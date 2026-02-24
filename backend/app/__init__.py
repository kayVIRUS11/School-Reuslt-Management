from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    
    db.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    
    from .routes.auth import auth_bp
    from .routes.admin import admin_bp
    from .routes.staff import staff_bp
    from .routes.student import student_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(staff_bp, url_prefix='/api/staff')
    app.register_blueprint(student_bp, url_prefix='/api/student')
    
    with app.app_context():
        db.create_all()
    
    return app
