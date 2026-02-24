import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors_origins = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    CORS(app, origins=[cors_origins], supports_credentials=True)

    from app.routes.auth import auth_bp
    from app.routes.admin import admin_bp
    from app.routes.staff import staff_bp
    from app.routes.student import student_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(staff_bp, url_prefix='/api/staff')
    app.register_blueprint(student_bp, url_prefix='/api/student')

    with app.app_context():
        db.create_all()

    return app
