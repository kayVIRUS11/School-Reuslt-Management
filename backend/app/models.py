from datetime import datetime
from . import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('admin', 'staff', 'student', name='user_roles'), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    student_profile = db.relationship('Student', backref='user', uselist=False, cascade='all, delete-orphan')
    staff_profile = db.relationship('Staff', backref='user', uselist=False, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'created_at': self.created_at.isoformat()
        }

class Student(db.Model):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    reg_number = db.Column(db.String(50), unique=True, nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classrooms.id'), nullable=True)
    guardian_name = db.Column(db.String(100))
    guardian_phone = db.Column(db.String(20))

    classroom = db.relationship('ClassRoom', backref='students')
    results = db.relationship('Result', backref='student', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'reg_number': self.reg_number,
            'class_id': self.class_id,
            'class_name': self.classroom.name if self.classroom else None,
            'guardian_name': self.guardian_name,
            'guardian_phone': self.guardian_phone,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'username': self.user.username,
        }

class Staff(db.Model):
    __tablename__ = 'staff'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    staff_id_number = db.Column(db.String(50), unique=True, nullable=False)
    department = db.Column(db.String(100))

    assignments = db.relationship('StaffSubjectClass', backref='staff', cascade='all, delete-orphan')
    results = db.relationship('Result', backref='staff')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'staff_id_number': self.staff_id_number,
            'department': self.department,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'username': self.user.username,
        }

class AcademicSession(db.Model):
    __tablename__ = 'academic_sessions'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    is_current = db.Column(db.Boolean, default=False)

    terms = db.relationship('Term', backref='session', cascade='all, delete-orphan')
    assignments = db.relationship('StaffSubjectClass', backref='session', cascade='all, delete-orphan')
    results = db.relationship('Result', backref='session')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'is_current': self.is_current,
        }

class Term(db.Model):
    __tablename__ = 'terms'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('academic_sessions.id'), nullable=False)
    is_current = db.Column(db.Boolean, default=False)

    results = db.relationship('Result', backref='term')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'session_id': self.session_id,
            'session_name': self.session.name if self.session else None,
            'is_current': self.is_current,
        }

class ClassRoom(db.Model):
    __tablename__ = 'classrooms'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    level = db.Column(db.String(50), nullable=False)

    assignments = db.relationship('StaffSubjectClass', backref='classroom', cascade='all, delete-orphan')
    results = db.relationship('Result', backref='classroom')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'level': self.level,
        }

class Subject(db.Model):
    __tablename__ = 'subjects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(20), nullable=False, unique=True)

    assignments = db.relationship('StaffSubjectClass', backref='subject', cascade='all, delete-orphan')
    results = db.relationship('Result', backref='subject')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
        }

class StaffSubjectClass(db.Model):
    __tablename__ = 'staff_subject_classes'
    id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classrooms.id'), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('academic_sessions.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'staff_id': self.staff_id,
            'staff_name': f"{self.staff.user.first_name} {self.staff.user.last_name}",
            'staff_id_number': self.staff.staff_id_number,
            'subject_id': self.subject_id,
            'subject_name': self.subject.name,
            'subject_code': self.subject.code,
            'class_id': self.class_id,
            'class_name': self.classroom.name,
            'session_id': self.session_id,
            'session_name': self.session.name,
        }

class GradingScale(db.Model):
    __tablename__ = 'grading_scales'
    id = db.Column(db.Integer, primary_key=True)
    min_score = db.Column(db.Float, nullable=False)
    max_score = db.Column(db.Float, nullable=False)
    grade = db.Column(db.String(5), nullable=False)
    remark = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'min_score': self.min_score,
            'max_score': self.max_score,
            'grade': self.grade,
            'remark': self.remark,
        }

class Result(db.Model):
    __tablename__ = 'results'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classrooms.id'), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('academic_sessions.id'), nullable=False)
    term_id = db.Column(db.Integer, db.ForeignKey('terms.id'), nullable=False)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'), nullable=False)
    ca1 = db.Column(db.Float, default=0)
    ca2 = db.Column(db.Float, default=0)
    ca3 = db.Column(db.Float, default=0)
    exam = db.Column(db.Float, default=0)
    total = db.Column(db.Float, default=0)
    grade = db.Column(db.String(5))
    remark = db.Column(db.String(50))
    status = db.Column(db.Enum('draft', 'submitted', 'approved', 'rejected', name='result_status'), default='draft')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'student_name': f"{self.student.user.first_name} {self.student.user.last_name}",
            'reg_number': self.student.reg_number,
            'subject_id': self.subject_id,
            'subject_name': self.subject.name,
            'subject_code': self.subject.code,
            'class_id': self.class_id,
            'class_name': self.classroom.name,
            'session_id': self.session_id,
            'session_name': self.session.name,
            'term_id': self.term_id,
            'term_name': self.term.name,
            'staff_id': self.staff_id,
            'staff_name': f"{self.staff.user.first_name} {self.staff.user.last_name}",
            'ca1': self.ca1,
            'ca2': self.ca2,
            'ca3': self.ca3,
            'exam': self.exam,
            'total': self.total,
            'grade': self.grade,
            'remark': self.remark,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
