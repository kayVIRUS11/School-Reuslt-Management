import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db, bcrypt
from app.models import User, GradingScale, AcademicSession, Term, ClassRoom, Subject

def seed():
    app = create_app()
    with app.app_context():
        db.create_all()

        # Admin user
        if not User.query.filter_by(username='admin').first():
            admin = User(
                username='admin',
                password_hash=bcrypt.generate_password_hash('admin123').decode('utf-8'),
                role='admin',
                first_name='Super',
                last_name='Admin'
            )
            db.session.add(admin)

        # Grading scale
        if GradingScale.query.count() == 0:
            scales = [
                GradingScale(min_score=70, max_score=100, grade='A', remark='Excellent'),
                GradingScale(min_score=60, max_score=69, grade='B', remark='Very Good'),
                GradingScale(min_score=50, max_score=59, grade='C', remark='Good'),
                GradingScale(min_score=45, max_score=49, grade='D', remark='Fair'),
                GradingScale(min_score=40, max_score=44, grade='E', remark='Pass'),
                GradingScale(min_score=0, max_score=39, grade='F', remark='Fail'),
            ]
            db.session.add_all(scales)

        # Academic session
        if AcademicSession.query.count() == 0:
            session = AcademicSession(name='2025/2026', is_current=True)
            db.session.add(session)
            db.session.flush()

            terms = [
                Term(name='First Term', session_id=session.id, is_current=True),
                Term(name='Second Term', session_id=session.id, is_current=False),
                Term(name='Third Term', session_id=session.id, is_current=False),
            ]
            db.session.add_all(terms)

        # Classes
        if ClassRoom.query.count() == 0:
            classes = [
                ClassRoom(name='JSS1A', level='JSS1'),
                ClassRoom(name='JSS1B', level='JSS1'),
                ClassRoom(name='JSS2A', level='JSS2'),
                ClassRoom(name='SS1A', level='SS1'),
                ClassRoom(name='SS2A', level='SS2'),
                ClassRoom(name='SS3A', level='SS3'),
            ]
            db.session.add_all(classes)

        # Subjects
        if Subject.query.count() == 0:
            subjects = [
                Subject(name='Mathematics', code='MATH'),
                Subject(name='English Language', code='ENG'),
                Subject(name='Physics', code='PHY'),
                Subject(name='Chemistry', code='CHEM'),
                Subject(name='Biology', code='BIO'),
                Subject(name='History', code='HIST'),
                Subject(name='Geography', code='GEO'),
            ]
            db.session.add_all(subjects)

        db.session.commit()
        print("✅ Database seeded successfully!")
        print("Admin credentials: username=admin, password=admin123")

if __name__ == '__main__':
    seed()
