from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from ..models import db, User, Student, Staff, ClassRoom, Subject, AcademicSession, Term, StaffSubjectClass, Result, GradingScale, ClassSubject
from ..utils.auth import hash_password, role_required, generate_password

admin_bp = Blueprint('admin', __name__)

# Students
@admin_bp.route('/students', methods=['GET'])
@role_required('admin')
def get_students():
    students = Student.query.all()
    return jsonify([s.to_dict() for s in students])

@admin_bp.route('/students', methods=['POST'])
@role_required('admin')
def create_student():
    data = request.get_json()
    required = ['reg_number', 'first_name', 'last_name']
    if not all(data.get(f) for f in required):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(username=data['reg_number']).first():
        return jsonify({'error': 'Registration number already exists'}), 409
    
    plain_password = generate_password()
    user = User(
        username=data['reg_number'],
        password_hash=hash_password(plain_password),
        role='student',
        first_name=data['first_name'],
        last_name=data['last_name']
    )
    db.session.add(user)
    db.session.flush()
    
    student = Student(
        user_id=user.id,
        reg_number=data['reg_number'],
        class_id=data.get('class_id'),
        guardian_name=data.get('guardian_name'),
        guardian_phone=data.get('guardian_phone')
    )
    db.session.add(student)
    db.session.commit()
    return jsonify({'student': student.to_dict(), 'generated_password': plain_password}), 201

@admin_bp.route('/students/<int:student_id>', methods=['PUT'])
@role_required('admin')
def update_student(student_id):
    student = Student.query.get_or_404(student_id)
    data = request.get_json()
    
    if 'first_name' in data:
        student.user.first_name = data['first_name']
    if 'last_name' in data:
        student.user.last_name = data['last_name']
    if 'class_id' in data:
        student.class_id = data['class_id']
    if 'guardian_name' in data:
        student.guardian_name = data['guardian_name']
    if 'guardian_phone' in data:
        student.guardian_phone = data['guardian_phone']
    if 'password' in data and data['password']:
        student.user.password_hash = hash_password(data['password'])
    
    db.session.commit()
    return jsonify(student.to_dict())

@admin_bp.route('/students/<int:student_id>', methods=['DELETE'])
@role_required('admin')
def delete_student(student_id):
    student = Student.query.get_or_404(student_id)
    user = student.user
    db.session.delete(student)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Student deleted'})

@admin_bp.route('/students/<int:student_id>/reset-password', methods=['POST'])
@role_required('admin')
def reset_student_password(student_id):
    student = Student.query.get_or_404(student_id)
    plain_password = generate_password()
    student.user.password_hash = hash_password(plain_password)
    db.session.commit()
    return jsonify({'generated_password': plain_password})

# Staff
@admin_bp.route('/staff', methods=['GET'])
@role_required('admin')
def get_staff():
    staff_list = Staff.query.all()
    return jsonify([s.to_dict() for s in staff_list])

@admin_bp.route('/staff', methods=['POST'])
@role_required('admin')
def create_staff():
    data = request.get_json()
    required = ['staff_id_number', 'first_name', 'last_name']
    if not all(data.get(f) for f in required):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(username=data['staff_id_number']).first():
        return jsonify({'error': 'Staff ID already exists'}), 409
    
    plain_password = generate_password()
    user = User(
        username=data['staff_id_number'],
        password_hash=hash_password(plain_password),
        role='staff',
        first_name=data['first_name'],
        last_name=data['last_name']
    )
    db.session.add(user)
    db.session.flush()
    
    staff = Staff(
        user_id=user.id,
        staff_id_number=data['staff_id_number'],
    )
    db.session.add(staff)
    db.session.commit()
    return jsonify({'staff': staff.to_dict(), 'generated_password': plain_password}), 201

@admin_bp.route('/staff/<int:staff_id>', methods=['PUT'])
@role_required('admin')
def update_staff(staff_id):
    staff = Staff.query.get_or_404(staff_id)
    data = request.get_json()
    
    if 'first_name' in data:
        staff.user.first_name = data['first_name']
    if 'last_name' in data:
        staff.user.last_name = data['last_name']
    if 'password' in data and data['password']:
        staff.user.password_hash = hash_password(data['password'])
    
    db.session.commit()
    return jsonify(staff.to_dict())

@admin_bp.route('/staff/<int:staff_id>', methods=['DELETE'])
@role_required('admin')
def delete_staff(staff_id):
    staff = Staff.query.get_or_404(staff_id)
    user = staff.user
    db.session.delete(staff)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Staff deleted'})

@admin_bp.route('/staff/<int:staff_id>/reset-password', methods=['POST'])
@role_required('admin')
def reset_staff_password(staff_id):
    staff = Staff.query.get_or_404(staff_id)
    plain_password = generate_password()
    staff.user.password_hash = hash_password(plain_password)
    db.session.commit()
    return jsonify({'generated_password': plain_password})

# Classes
@admin_bp.route('/classes', methods=['GET'])
@role_required('admin')
def get_classes():
    classes = ClassRoom.query.all()
    return jsonify([c.to_dict() for c in classes])

@admin_bp.route('/classes', methods=['POST'])
@role_required('admin')
def create_class():
    data = request.get_json()
    if not data.get('name') or not data.get('level'):
        return jsonify({'error': 'Name and level are required'}), 400
    if ClassRoom.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Class name already exists'}), 409
    classroom = ClassRoom(name=data['name'], level=data['level'])
    db.session.add(classroom)
    db.session.commit()
    return jsonify(classroom.to_dict()), 201

@admin_bp.route('/classes/<int:class_id>', methods=['PUT'])
@role_required('admin')
def update_class(class_id):
    classroom = ClassRoom.query.get_or_404(class_id)
    data = request.get_json()
    if 'name' in data:
        classroom.name = data['name']
    if 'level' in data:
        classroom.level = data['level']
    db.session.commit()
    return jsonify(classroom.to_dict())

@admin_bp.route('/classes/<int:class_id>', methods=['DELETE'])
@role_required('admin')
def delete_class(class_id):
    classroom = ClassRoom.query.get_or_404(class_id)
    db.session.delete(classroom)
    db.session.commit()
    return jsonify({'message': 'Class deleted'})

# Subjects
@admin_bp.route('/subjects', methods=['GET'])
@role_required('admin')
def get_subjects():
    subjects = Subject.query.all()
    return jsonify([s.to_dict() for s in subjects])

@admin_bp.route('/subjects', methods=['POST'])
@role_required('admin')
def create_subject():
    data = request.get_json()
    if not data.get('name') or not data.get('code'):
        return jsonify({'error': 'Name and code are required'}), 400
    if Subject.query.filter_by(code=data['code']).first():
        return jsonify({'error': 'Subject code already exists'}), 409
    subject = Subject(name=data['name'], code=data['code'])
    db.session.add(subject)
    db.session.commit()
    return jsonify(subject.to_dict()), 201

@admin_bp.route('/subjects/<int:subject_id>', methods=['PUT'])
@role_required('admin')
def update_subject(subject_id):
    subject = Subject.query.get_or_404(subject_id)
    data = request.get_json()
    if 'name' in data:
        subject.name = data['name']
    if 'code' in data:
        subject.code = data['code']
    db.session.commit()
    return jsonify(subject.to_dict())

@admin_bp.route('/subjects/<int:subject_id>', methods=['DELETE'])
@role_required('admin')
def delete_subject(subject_id):
    subject = Subject.query.get_or_404(subject_id)
    db.session.delete(subject)
    db.session.commit()
    return jsonify({'message': 'Subject deleted'})

# Sessions
@admin_bp.route('/sessions', methods=['GET'])
@role_required('admin')
def get_sessions():
    sessions = AcademicSession.query.all()
    return jsonify([s.to_dict() for s in sessions])

@admin_bp.route('/sessions', methods=['POST'])
@role_required('admin')
def create_session():
    data = request.get_json()
    if not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
    if data.get('is_current'):
        AcademicSession.query.filter_by(is_current=True).update({'is_current': False}, synchronize_session=False)
    session = AcademicSession(name=data['name'], is_current=data.get('is_current', False))
    db.session.add(session)
    db.session.commit()
    return jsonify(session.to_dict()), 201

@admin_bp.route('/sessions/<int:session_id>', methods=['PUT'])
@role_required('admin')
def update_session(session_id):
    session = AcademicSession.query.get_or_404(session_id)
    data = request.get_json()
    if 'name' in data:
        session.name = data['name']
    if data.get('is_current'):
        AcademicSession.query.filter_by(is_current=True).update({'is_current': False}, synchronize_session=False)
        session.is_current = True
    db.session.commit()
    return jsonify(session.to_dict())

@admin_bp.route('/sessions/<int:session_id>', methods=['DELETE'])
@role_required('admin')
def delete_session(session_id):
    session = AcademicSession.query.get_or_404(session_id)
    db.session.delete(session)
    db.session.commit()
    return jsonify({'message': 'Session deleted'})

# Terms
@admin_bp.route('/terms', methods=['GET'])
@role_required('admin')
def get_terms():
    terms = Term.query.all()
    return jsonify([t.to_dict() for t in terms])

@admin_bp.route('/terms', methods=['POST'])
@role_required('admin')
def create_term():
    data = request.get_json()
    if not data.get('name') or not data.get('session_id'):
        return jsonify({'error': 'Name and session_id are required'}), 400
    if data.get('is_current'):
        Term.query.filter_by(is_current=True).update({'is_current': False}, synchronize_session=False)
    term = Term(name=data['name'], session_id=data['session_id'], is_current=data.get('is_current', False))
    db.session.add(term)
    db.session.commit()
    return jsonify(term.to_dict()), 201

@admin_bp.route('/terms/<int:term_id>', methods=['PUT'])
@role_required('admin')
def update_term(term_id):
    term = Term.query.get_or_404(term_id)
    data = request.get_json()
    if 'name' in data:
        term.name = data['name']
    if 'session_id' in data:
        term.session_id = data['session_id']
    if data.get('is_current'):
        Term.query.filter_by(is_current=True).update({'is_current': False}, synchronize_session=False)
        term.is_current = True
    db.session.commit()
    return jsonify(term.to_dict())

@admin_bp.route('/terms/<int:term_id>', methods=['DELETE'])
@role_required('admin')
def delete_term(term_id):
    term = Term.query.get_or_404(term_id)
    db.session.delete(term)
    db.session.commit()
    return jsonify({'message': 'Term deleted'})

# Assignments
@admin_bp.route('/assign-subject', methods=['POST'])
@role_required('admin')
def assign_subject():
    data = request.get_json()
    required = ['staff_id', 'class_id']
    if not all(data.get(f) for f in required):
        return jsonify({'error': 'Missing required fields'}), 400
    
    subject_id = data.get('subject_id')

    existing = StaffSubjectClass.query.filter_by(
        staff_id=data['staff_id'],
        class_id=data['class_id'],
        subject_id=subject_id,
    ).first()
    if existing:
        return jsonify({'error': 'This assignment already exists'}), 409
    
    assignment = StaffSubjectClass(
        staff_id=data['staff_id'],
        subject_id=subject_id,
        class_id=data['class_id'],
    )
    db.session.add(assignment)
    db.session.commit()
    return jsonify(assignment.to_dict()), 201

@admin_bp.route('/assignments', methods=['GET'])
@role_required('admin')
def get_assignments():
    assignments = StaffSubjectClass.query.all()
    return jsonify([a.to_dict() for a in assignments])

@admin_bp.route('/assignments/<int:assignment_id>', methods=['DELETE'])
@role_required('admin')
def delete_assignment(assignment_id):
    assignment = StaffSubjectClass.query.get_or_404(assignment_id)
    db.session.delete(assignment)
    db.session.commit()
    return jsonify({'message': 'Assignment deleted'})

# Class Subjects
@admin_bp.route('/class-subjects/<int:class_id>', methods=['GET'])
@role_required('admin')
def get_class_subjects(class_id):
    class_subjects = ClassSubject.query.filter_by(class_id=class_id).all()
    return jsonify([cs.to_dict() for cs in class_subjects])

@admin_bp.route('/class-subjects', methods=['POST'])
@role_required('admin')
def create_class_subject():
    data = request.get_json()
    if not data.get('class_id') or not data.get('subject_id'):
        return jsonify({'error': 'class_id and subject_id are required'}), 400
    existing = ClassSubject.query.filter_by(
        class_id=data['class_id'],
        subject_id=data['subject_id']
    ).first()
    if existing:
        return jsonify({'error': 'This subject is already assigned to the class'}), 409
    cs = ClassSubject(class_id=data['class_id'], subject_id=data['subject_id'])
    db.session.add(cs)
    db.session.commit()
    return jsonify(cs.to_dict()), 201

@admin_bp.route('/class-subjects/<int:cs_id>', methods=['DELETE'])
@role_required('admin')
def delete_class_subject(cs_id):
    cs = ClassSubject.query.get_or_404(cs_id)
    db.session.delete(cs)
    db.session.commit()
    return jsonify({'message': 'Class subject deleted'})

# Results
@admin_bp.route('/results/pending', methods=['GET'])
@role_required('admin')
def get_pending_results():
    results = Result.query.filter_by(status='submitted').all()
    return jsonify([r.to_dict() for r in results])

@admin_bp.route('/results/approve/<int:result_id>', methods=['POST'])
@role_required('admin')
def approve_result(result_id):
    result = Result.query.get_or_404(result_id)
    result.status = 'approved'
    db.session.commit()
    return jsonify(result.to_dict())

@admin_bp.route('/results/reject/<int:result_id>', methods=['POST'])
@role_required('admin')
def reject_result(result_id):
    result = Result.query.get_or_404(result_id)
    result.status = 'rejected'
    db.session.commit()
    return jsonify(result.to_dict())

@admin_bp.route('/results', methods=['GET'])
@role_required('admin')
def get_all_results():
    query = Result.query
    if request.args.get('class_id'):
        query = query.filter_by(class_id=int(request.args['class_id']))
    if request.args.get('subject_id'):
        query = query.filter_by(subject_id=int(request.args['subject_id']))
    if request.args.get('term_id'):
        query = query.filter_by(term_id=int(request.args['term_id']))
    if request.args.get('session_id'):
        query = query.filter_by(session_id=int(request.args['session_id']))
    if request.args.get('status'):
        query = query.filter_by(status=request.args['status'])
    results = query.all()
    return jsonify([r.to_dict() for r in results])

# Stats for dashboard
@admin_bp.route('/stats', methods=['GET'])
@role_required('admin')
def get_stats():
    total_students = Student.query.count()
    total_staff = Staff.query.count()
    pending_results = Result.query.filter_by(status='submitted').count()
    total_classes = ClassRoom.query.count()
    return jsonify({
        'total_students': total_students,
        'total_staff': total_staff,
        'pending_results': pending_results,
        'total_classes': total_classes,
    })
