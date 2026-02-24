from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from ..models import Student, Result, Term, AcademicSession
from ..utils.auth import role_required

student_bp = Blueprint('student', __name__)

def get_student_profile():
    user_id = int(get_jwt_identity())
    return Student.query.filter_by(user_id=user_id).first()

@student_bp.route('/terms', methods=['GET'])
@role_required('student')
def get_student_terms():
    terms = Term.query.all()
    return jsonify([t.to_dict() for t in terms])

@student_bp.route('/sessions', methods=['GET'])
@role_required('student')
def get_student_sessions():
    sessions = AcademicSession.query.all()
    return jsonify([s.to_dict() for s in sessions])

@student_bp.route('/profile', methods=['GET'])
@role_required('student')
def get_profile():
    student = get_student_profile()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404
    return jsonify(student.to_dict())

@student_bp.route('/results', methods=['GET'])
@role_required('student')
def get_results():
    student = get_student_profile()
    if not student:
        return jsonify({'error': 'Student profile not found'}), 404
    
    query = Result.query.filter_by(student_id=student.id, status='approved')
    if request.args.get('term_id'):
        query = query.filter_by(term_id=int(request.args['term_id']))
    if request.args.get('session_id'):
        query = query.filter_by(session_id=int(request.args['session_id']))
    
    results = query.all()
    
    # Also return terms and sessions for filter options
    terms = Term.query.all()
    sessions = AcademicSession.query.all()
    
    return jsonify({
        'results': [r.to_dict() for r in results],
        'terms': [t.to_dict() for t in terms],
        'sessions': [s.to_dict() for s in sessions],
    })
