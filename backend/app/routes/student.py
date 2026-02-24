from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from app import db
from app.models import User, Student, Result
from app.utils.auth import role_required

student_bp = Blueprint('student', __name__)

def get_current_student():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return Student.query.filter_by(user_id=user.id).first()

@student_bp.route('/profile', methods=['GET'])
@role_required('student')
def profile():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    return jsonify(student.to_dict()), 200

@student_bp.route('/results', methods=['GET'])
@role_required('student')
def my_results():
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    query = Result.query.filter_by(student_id=student.id, status='approved')
    if request.args.get('term_id'):
        query = query.filter_by(term_id=request.args.get('term_id'))
    if request.args.get('session_id'):
        query = query.filter_by(session_id=request.args.get('session_id'))
    results = query.all()
    return jsonify([r.to_dict() for r in results]), 200
