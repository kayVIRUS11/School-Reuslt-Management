from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from ..models import db, Student, Staff, Result, StaffSubjectClass, Term, AcademicSession
from ..utils.auth import role_required
from ..utils.grading import calculate_total, calculate_grade
from datetime import datetime

staff_bp = Blueprint('staff', __name__)

def get_staff_profile():
    user_id = int(get_jwt_identity())
    return Staff.query.filter_by(user_id=user_id).first()

@staff_bp.route('/my-assignments', methods=['GET'])
@role_required('staff')
def my_assignments():
    staff = get_staff_profile()
    if not staff:
        return jsonify({'error': 'Staff profile not found'}), 404
    assignments = StaffSubjectClass.query.filter_by(staff_id=staff.id).all()
    return jsonify([a.to_dict() for a in assignments])

@staff_bp.route('/classes/<int:class_id>/students', methods=['GET'])
@role_required('staff')
def get_class_students(class_id):
    students = Student.query.filter_by(class_id=class_id).all()
    return jsonify([s.to_dict() for s in students])

@staff_bp.route('/results', methods=['POST'])
@role_required('staff')
def enter_results():
    staff = get_staff_profile()
    if not staff:
        return jsonify({'error': 'Staff profile not found'}), 404
    
    data = request.get_json()
    results_data = data.get('results', [])

    current_term = Term.query.filter_by(is_current=True).first()
    current_session = AcademicSession.query.filter_by(is_current=True).first()
    
    created = []
    for r in results_data:
        if current_term and current_session:
            if r.get('term_id') != current_term.id or r.get('session_id') != current_session.id:
                return jsonify({'error': 'Results can only be entered for the current term and session'}), 400

        # Check if result already exists
        existing = Result.query.filter_by(
            student_id=r['student_id'],
            subject_id=r['subject_id'],
            term_id=r['term_id'],
            session_id=r['session_id']
        ).first()
        
        try:
            ca1 = float(r.get('ca1', 0))
            ca2 = float(r.get('ca2', 0))
            ca3 = float(r.get('ca3', 0))
            exam = float(r.get('exam', 0))
        except (TypeError, ValueError):
            return jsonify({'error': 'Invalid score value; scores must be numbers'}), 400
        total = calculate_total(ca1, ca2, ca3, exam)
        grade, remark = calculate_grade(total)
        
        if existing:
            if existing.status in ('submitted', 'approved'):
                continue
            existing.ca1 = ca1
            existing.ca2 = ca2
            existing.ca3 = ca3
            existing.exam = exam
            existing.total = total
            existing.grade = grade
            existing.remark = remark
            existing.updated_at = datetime.utcnow()
            created.append(existing.to_dict())
        else:
            result = Result(
                student_id=r['student_id'],
                subject_id=r['subject_id'],
                class_id=r['class_id'],
                session_id=r['session_id'],
                term_id=r['term_id'],
                staff_id=staff.id,
                ca1=ca1,
                ca2=ca2,
                ca3=ca3,
                exam=exam,
                total=total,
                grade=grade,
                remark=remark,
                status='draft'
            )
            db.session.add(result)
            db.session.flush()
            created.append(result.to_dict())
    
    db.session.commit()
    return jsonify(created), 201

@staff_bp.route('/results/<int:result_id>', methods=['PUT'])
@role_required('staff')
def update_result(result_id):
    staff = get_staff_profile()
    result = Result.query.get_or_404(result_id)
    
    if result.staff_id != staff.id:
        return jsonify({'error': 'Unauthorized'}), 403
    if result.status not in ('draft', 'rejected'):
        return jsonify({'error': 'Cannot edit submitted or approved results'}), 400

    current_term = Term.query.filter_by(is_current=True).first()
    current_session = AcademicSession.query.filter_by(is_current=True).first()
    if current_term and current_session:
        if result.term_id != current_term.id or result.session_id != current_session.id:
            return jsonify({'error': 'Results can only be entered for the current term and session'}), 403
    
    data = request.get_json()
    try:
        ca1 = float(data.get('ca1', result.ca1))
        ca2 = float(data.get('ca2', result.ca2))
        ca3 = float(data.get('ca3', result.ca3))
        exam = float(data.get('exam', result.exam))
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid score value; scores must be numbers'}), 400
    total = calculate_total(ca1, ca2, ca3, exam)
    grade, remark = calculate_grade(total)
    
    result.ca1 = ca1
    result.ca2 = ca2
    result.ca3 = ca3
    result.exam = exam
    result.total = total
    result.grade = grade
    result.remark = remark
    result.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(result.to_dict())

@staff_bp.route('/results/submit', methods=['POST'])
@role_required('staff')
def submit_results():
    staff = get_staff_profile()
    data = request.get_json()
    result_ids = data.get('result_ids', [])
    
    for result_id in result_ids:
        result = Result.query.get(result_id)
        if result and result.staff_id == staff.id and result.status == 'draft':
            result.status = 'submitted'
    
    db.session.commit()
    return jsonify({'message': 'Results submitted for approval'})

@staff_bp.route('/results', methods=['GET'])
@role_required('staff')
def get_staff_results():
    staff = get_staff_profile()
    query = Result.query.filter_by(staff_id=staff.id)
    if request.args.get('term_id'):
        query = query.filter_by(term_id=int(request.args['term_id']))
    if request.args.get('class_id'):
        query = query.filter_by(class_id=int(request.args['class_id']))
    if request.args.get('subject_id'):
        query = query.filter_by(subject_id=int(request.args['subject_id']))
    results = query.all()
    return jsonify([r.to_dict() for r in results])

@staff_bp.route('/stats', methods=['GET'])
@role_required('staff')
def get_staff_stats():
    staff = get_staff_profile()
    assignments = StaffSubjectClass.query.filter_by(staff_id=staff.id).count()
    draft_results = Result.query.filter_by(staff_id=staff.id, status='draft').count()
    submitted_results = Result.query.filter_by(staff_id=staff.id, status='submitted').count()
    approved_results = Result.query.filter_by(staff_id=staff.id, status='approved').count()
    return jsonify({
        'assignments': assignments,
        'draft_results': draft_results,
        'submitted_results': submitted_results,
        'approved_results': approved_results,
    })
