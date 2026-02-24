from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from ..models import User
from ..utils.auth import check_password

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    user = User.query.filter_by(username=username).first()
    if not user or not check_password(password, user.password_hash):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    additional_claims = {'role': user.role}
    access_token = create_access_token(identity=str(user.id), additional_claims=additional_claims)
    
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    })

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': user.to_dict()})

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'Logged out successfully'})
