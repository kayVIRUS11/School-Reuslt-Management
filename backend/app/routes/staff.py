from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from app import db
from app.models import User, Staff, Student, Result, StaffSubjectClass, ClassRoom, Subject
from app.utils.auth import role_required
from app.utils.grading import calculate_result

staff_bp = Blueprint('staff', __name__)

def get_current_staff():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return Staff.query.filter_by(user_id=user.id).first()

@staff_bp.route('/my-assignments', methods=['GET'])
@role_required('staff')
def my_assignments():
    staff = get_current_staff()
    if not staff:
        return jsonify({'error': 'Staff not found'}), 404
    assignments = StaffSubjectClass.query.filter_by(staff_id=staff.id).all()
    return jsonify([a.to_dict() for a in assignments]), 200

@staff_bp.route('/classes/<int:class_id>/students', methods=['GET'])
@role_required('staff')
def get_class_students(class_id):
    students = Student.query.filter_by(class_id=class_id).all()
    return jsonify([s.to_dict() for s in students]), 200

@staff_bp.route('/results', methods=['GET'])
@role_required('staff')
def get_my_results():
    staff = get_current_staff()
    if not staff:
        return jsonify({'error': 'Staff not found'}), 404
    query = Result.query.filter_by(staff_id=staff.id)
    if request.args.get('class_id'):
        query = query.filter_by(class_id=request.args.get('class_id'))
    if request.args.get('subject_id'):
        query = query.filter_by(subject_id=request.args.get('subject_id'))
    if request.args.get('term_id'):
        query = query.filter_by(term_id=request.args.get('term_id'))
    results = query.all()
    return jsonify([r.to_dict() for r in results]), 200

@staff_bp.route('/results', methods=['POST'])
@role_required('staff')
def enter_results():
    staff = get_current_staff()
    if not staff:
        return jsonify({'error': 'Staff not found'}), 404

    data = request.get_json()
    results_data = data.get('results', [])

    created = []
    for item in results_data:
        existing = Result.query.filter_by(
            student_id=item['student_id'],
            subject_id=item['subject_id'],
            term_id=item['term_id'],
            session_id=item['session_id']
        ).first()

        total, grade, remark = calculate_result(
            item.get('ca1', 0), item.get('ca2', 0),
            item.get('ca3', 0), item.get('exam', 0)
        )

        if existing:
            existing.ca1 = item.get('ca1', 0)
            existing.ca2 = item.get('ca2', 0)
            existing.ca3 = item.get('ca3', 0)
            existing.exam = item.get('exam', 0)
            existing.total = total
            existing.grade = grade
            existing.remark = remark
            created.append(existing.to_dict())
        else:
            result = Result(
                student_id=item['student_id'],
                subject_id=item['subject_id'],
                class_id=item['class_id'],
                session_id=item['session_id'],
                term_id=item['term_id'],
                staff_id=staff.id,
                ca1=item.get('ca1', 0),
                ca2=item.get('ca2', 0),
                ca3=item.get('ca3', 0),
                exam=item.get('exam', 0),
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

@staff_bp.route('/results/<int:id>', methods=['PUT'])
@role_required('staff')
def update_result(id):
    staff = get_current_staff()
    result = Result.query.get_or_404(id)

    if result.staff_id != staff.id:
        return jsonify({'error': 'Forbidden'}), 403
    if result.status not in ['draft', 'rejected']:
        return jsonify({'error': 'Cannot edit submitted or approved result'}), 400

    data = request.get_json()
    result.ca1 = data.get('ca1', result.ca1)
    result.ca2 = data.get('ca2', result.ca2)
    result.ca3 = data.get('ca3', result.ca3)
    result.exam = data.get('exam', result.exam)
    result.total, result.grade, result.remark = calculate_result(result.ca1, result.ca2, result.ca3, result.exam)
    db.session.commit()
    return jsonify(result.to_dict()), 200

@staff_bp.route('/results/submit', methods=['POST'])
@role_required('staff')
def submit_results():
    staff = get_current_staff()
    data = request.get_json()
    result_ids = data.get('result_ids', [])

    for rid in result_ids:
        result = Result.query.get(rid)
        if result and result.staff_id == staff.id and result.status == 'draft':
            result.status = 'submitted'

    db.session.commit()
    return jsonify({'message': 'Results submitted for approval'}), 200
