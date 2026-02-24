from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db, bcrypt
from app.models import User, Student, Staff, ClassRoom, Subject, AcademicSession, Term, StaffSubjectClass, Result
from app.utils.auth import role_required

admin_bp = Blueprint('admin', __name__)

# ---- Dashboard Stats ----
@admin_bp.route('/stats', methods=['GET'])
@role_required('admin')
def stats():
    total_students = Student.query.count()
    total_staff = Staff.query.count()
    pending_results = Result.query.filter_by(status='submitted').count()
    total_classes = ClassRoom.query.count()
    return jsonify({
        'total_students': total_students,
        'total_staff': total_staff,
        'pending_results': pending_results,
        'total_classes': total_classes,
    }), 200

# ---- Students ----
@admin_bp.route('/students', methods=['GET'])
@role_required('admin')
def get_students():
    students = Student.query.all()
    return jsonify([s.to_dict() for s in students]), 200

@admin_bp.route('/students', methods=['POST'])
@role_required('admin')
def create_student():
    data = request.get_json()
    required = ['reg_number', 'first_name', 'last_name', 'password']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    if User.query.filter_by(username=data['reg_number']).first():
        return jsonify({'error': 'Registration number already exists'}), 400

    password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(
        username=data['reg_number'],
        password_hash=password_hash,
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
    return jsonify(student.to_dict()), 201

@admin_bp.route('/students/<int:id>', methods=['PUT'])
@role_required('admin')
def update_student(id):
    student = Student.query.get_or_404(id)
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
        student.user.password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    db.session.commit()
    return jsonify(student.to_dict()), 200

@admin_bp.route('/students/<int:id>', methods=['DELETE'])
@role_required('admin')
def delete_student(id):
    student = Student.query.get_or_404(id)
    user = student.user
    db.session.delete(student)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Student deleted'}), 200

# ---- Staff ----
@admin_bp.route('/staff', methods=['GET'])
@role_required('admin')
def get_staff():
    staff_list = Staff.query.all()
    return jsonify([s.to_dict() for s in staff_list]), 200

@admin_bp.route('/staff', methods=['POST'])
@role_required('admin')
def create_staff():
    data = request.get_json()
    required = ['staff_id_number', 'first_name', 'last_name', 'password']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    if User.query.filter_by(username=data['staff_id_number']).first():
        return jsonify({'error': 'Staff ID already exists'}), 400

    password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(
        username=data['staff_id_number'],
        password_hash=password_hash,
        role='staff',
        first_name=data['first_name'],
        last_name=data['last_name']
    )
    db.session.add(user)
    db.session.flush()

    staff = Staff(
        user_id=user.id,
        staff_id_number=data['staff_id_number'],
        department=data.get('department')
    )
    db.session.add(staff)
    db.session.commit()
    return jsonify(staff.to_dict()), 201

@admin_bp.route('/staff/<int:id>', methods=['PUT'])
@role_required('admin')
def update_staff(id):
    staff = Staff.query.get_or_404(id)
    data = request.get_json()

    if 'first_name' in data:
        staff.user.first_name = data['first_name']
    if 'last_name' in data:
        staff.user.last_name = data['last_name']
    if 'department' in data:
        staff.department = data['department']
    if 'password' in data and data['password']:
        staff.user.password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    db.session.commit()
    return jsonify(staff.to_dict()), 200

@admin_bp.route('/staff/<int:id>', methods=['DELETE'])
@role_required('admin')
def delete_staff(id):
    staff = Staff.query.get_or_404(id)
    user = staff.user
    db.session.delete(staff)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Staff deleted'}), 200

# ---- Classes ----
@admin_bp.route('/classes', methods=['GET'])
@role_required('admin')
def get_classes():
    classes = ClassRoom.query.all()
    return jsonify([c.to_dict() for c in classes]), 200

@admin_bp.route('/classes', methods=['POST'])
@role_required('admin')
def create_class():
    data = request.get_json()
    if not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
    cls = ClassRoom(name=data['name'], level=data.get('level'))
    db.session.add(cls)
    db.session.commit()
    return jsonify(cls.to_dict()), 201

@admin_bp.route('/classes/<int:id>', methods=['PUT'])
@role_required('admin')
def update_class(id):
    cls = ClassRoom.query.get_or_404(id)
    data = request.get_json()
    if 'name' in data:
        cls.name = data['name']
    if 'level' in data:
        cls.level = data['level']
    db.session.commit()
    return jsonify(cls.to_dict()), 200

@admin_bp.route('/classes/<int:id>', methods=['DELETE'])
@role_required('admin')
def delete_class(id):
    cls = ClassRoom.query.get_or_404(id)
    db.session.delete(cls)
    db.session.commit()
    return jsonify({'message': 'Class deleted'}), 200

# ---- Subjects ----
@admin_bp.route('/subjects', methods=['GET'])
@role_required('admin')
def get_subjects():
    subjects = Subject.query.all()
    return jsonify([s.to_dict() for s in subjects]), 200

@admin_bp.route('/subjects', methods=['POST'])
@role_required('admin')
def create_subject():
    data = request.get_json()
    if not data.get('name') or not data.get('code'):
        return jsonify({'error': 'Name and code are required'}), 400
    subject = Subject(name=data['name'], code=data['code'])
    db.session.add(subject)
    db.session.commit()
    return jsonify(subject.to_dict()), 201

@admin_bp.route('/subjects/<int:id>', methods=['PUT'])
@role_required('admin')
def update_subject(id):
    subject = Subject.query.get_or_404(id)
    data = request.get_json()
    if 'name' in data:
        subject.name = data['name']
    if 'code' in data:
        subject.code = data['code']
    db.session.commit()
    return jsonify(subject.to_dict()), 200

@admin_bp.route('/subjects/<int:id>', methods=['DELETE'])
@role_required('admin')
def delete_subject(id):
    subject = Subject.query.get_or_404(id)
    db.session.delete(subject)
    db.session.commit()
    return jsonify({'message': 'Subject deleted'}), 200

# ---- Sessions ----
@admin_bp.route('/sessions', methods=['GET'])
@role_required('admin')
def get_sessions():
    sessions = AcademicSession.query.all()
    return jsonify([s.to_dict() for s in sessions]), 200

@admin_bp.route('/sessions', methods=['POST'])
@role_required('admin')
def create_session():
    data = request.get_json()
    if not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
    if data.get('is_current'):
        AcademicSession.query.update({'is_current': False}, synchronize_session='fetch')
    session = AcademicSession(name=data['name'], is_current=data.get('is_current', False))
    db.session.add(session)
    db.session.commit()
    return jsonify(session.to_dict()), 201

@admin_bp.route('/sessions/<int:id>', methods=['PUT'])
@role_required('admin')
def update_session(id):
    session = AcademicSession.query.get_or_404(id)
    data = request.get_json()
    if 'name' in data:
        session.name = data['name']
    if 'is_current' in data:
        if data['is_current']:
            AcademicSession.query.update({'is_current': False}, synchronize_session='fetch')
        session.is_current = data['is_current']
    db.session.commit()
    return jsonify(session.to_dict()), 200

@admin_bp.route('/sessions/<int:id>', methods=['DELETE'])
@role_required('admin')
def delete_session(id):
    session = AcademicSession.query.get_or_404(id)
    db.session.delete(session)
    db.session.commit()
    return jsonify({'message': 'Session deleted'}), 200

# ---- Terms ----
@admin_bp.route('/terms', methods=['GET'])
@role_required('admin')
def get_terms():
    terms = Term.query.all()
    return jsonify([t.to_dict() for t in terms]), 200

@admin_bp.route('/terms', methods=['POST'])
@role_required('admin')
def create_term():
    data = request.get_json()
    if not data.get('name') or not data.get('session_id'):
        return jsonify({'error': 'Name and session_id are required'}), 400
    if data.get('is_current'):
        Term.query.update({'is_current': False}, synchronize_session='fetch')
    term = Term(name=data['name'], session_id=data['session_id'], is_current=data.get('is_current', False))
    db.session.add(term)
    db.session.commit()
    return jsonify(term.to_dict()), 201

@admin_bp.route('/terms/<int:id>', methods=['PUT'])
@role_required('admin')
def update_term(id):
    term = Term.query.get_or_404(id)
    data = request.get_json()
    if 'name' in data:
        term.name = data['name']
    if 'is_current' in data:
        if data['is_current']:
            Term.query.update({'is_current': False}, synchronize_session='fetch')
        term.is_current = data['is_current']
    db.session.commit()
    return jsonify(term.to_dict()), 200

@admin_bp.route('/terms/<int:id>', methods=['DELETE'])
@role_required('admin')
def delete_term(id):
    term = Term.query.get_or_404(id)
    db.session.delete(term)
    db.session.commit()
    return jsonify({'message': 'Term deleted'}), 200

# ---- Assignments ----
@admin_bp.route('/assign-subject', methods=['POST'])
@role_required('admin')
def assign_subject():
    data = request.get_json()
    required = ['staff_id', 'subject_id', 'class_id', 'session_id']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    existing = StaffSubjectClass.query.filter_by(
        staff_id=data['staff_id'],
        subject_id=data['subject_id'],
        class_id=data['class_id'],
        session_id=data['session_id']
    ).first()
    if existing:
        return jsonify({'error': 'Assignment already exists'}), 400

    assignment = StaffSubjectClass(
        staff_id=data['staff_id'],
        subject_id=data['subject_id'],
        class_id=data['class_id'],
        session_id=data['session_id']
    )
    db.session.add(assignment)
    db.session.commit()
    return jsonify(assignment.to_dict()), 201

@admin_bp.route('/assignments', methods=['GET'])
@role_required('admin')
def get_assignments():
    assignments = StaffSubjectClass.query.all()
    return jsonify([a.to_dict() for a in assignments]), 200

@admin_bp.route('/assignments/<int:id>', methods=['DELETE'])
@role_required('admin')
def delete_assignment(id):
    assignment = StaffSubjectClass.query.get_or_404(id)
    db.session.delete(assignment)
    db.session.commit()
    return jsonify({'message': 'Assignment deleted'}), 200

# ---- Results ----
@admin_bp.route('/results', methods=['GET'])
@role_required('admin')
def get_all_results():
    query = Result.query
    if request.args.get('class_id'):
        query = query.filter_by(class_id=request.args.get('class_id'))
    if request.args.get('subject_id'):
        query = query.filter_by(subject_id=request.args.get('subject_id'))
    if request.args.get('term_id'):
        query = query.filter_by(term_id=request.args.get('term_id'))
    if request.args.get('session_id'):
        query = query.filter_by(session_id=request.args.get('session_id'))
    if request.args.get('status'):
        query = query.filter_by(status=request.args.get('status'))
    results = query.all()
    return jsonify([r.to_dict() for r in results]), 200

@admin_bp.route('/results/pending', methods=['GET'])
@role_required('admin')
def get_pending_results():
    results = Result.query.filter_by(status='submitted').all()
    return jsonify([r.to_dict() for r in results]), 200

@admin_bp.route('/results/approve/<int:id>', methods=['POST'])
@role_required('admin')
def approve_result(id):
    result = Result.query.get_or_404(id)
    result.status = 'approved'
    db.session.commit()
    return jsonify(result.to_dict()), 200

@admin_bp.route('/results/reject/<int:id>', methods=['POST'])
@role_required('admin')
def reject_result(id):
    result = Result.query.get_or_404(id)
    result.status = 'rejected'
    db.session.commit()
    return jsonify(result.to_dict()), 200
