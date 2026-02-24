from app import create_app, db
from app.models import User, Student, Staff, ClassRoom, Subject, AcademicSession, Term, GradingScale
from app.utils.auth import hash_password

app = create_app()

with app.app_context():
    db.create_all()
    
    # Default grading scale
    if not GradingScale.query.first():
        scales = [
            GradingScale(min_score=70, max_score=100, grade='A', remark='Excellent'),
            GradingScale(min_score=60, max_score=69, grade='B', remark='Very Good'),
            GradingScale(min_score=50, max_score=59, grade='C', remark='Good'),
            GradingScale(min_score=45, max_score=49, grade='D', remark='Fair'),
            GradingScale(min_score=40, max_score=44, grade='E', remark='Pass'),
            GradingScale(min_score=0, max_score=39, grade='F', remark='Fail'),
        ]
        db.session.add_all(scales)
        db.session.commit()
        print("Grading scale seeded.")
    
    # Default admin
    if not User.query.filter_by(username='admin').first():
        admin = User(
            username='admin',
            password_hash=hash_password('admin123'),
            role='admin',
            first_name='Super',
            last_name='Admin'
        )
        db.session.add(admin)
        db.session.commit()
        print("Admin user seeded: username=admin, password=admin123")
    
    # Academic session
    if not AcademicSession.query.first():
        session = AcademicSession(name='2025/2026', is_current=True)
        db.session.add(session)
        db.session.flush()
        
        terms = [
            Term(name='First Term', session_id=session.id, is_current=True),
            Term(name='Second Term', session_id=session.id, is_current=False),
            Term(name='Third Term', session_id=session.id, is_current=False),
        ]
        db.session.add_all(terms)
        db.session.commit()
        print("Academic session and terms seeded.")
    
    # Sample classes
    if not ClassRoom.query.first():
        classes = [
            ClassRoom(name='JSS1A', level='JSS1'),
            ClassRoom(name='JSS1B', level='JSS1'),
            ClassRoom(name='JSS2A', level='JSS2'),
            ClassRoom(name='SS1A', level='SS1'),
            ClassRoom(name='SS2A', level='SS2'),
            ClassRoom(name='SS3A', level='SS3'),
        ]
        db.session.add_all(classes)
        db.session.commit()
        print("Classes seeded.")
    
    # Sample subjects
    if not Subject.query.first():
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
        print("Subjects seeded.")
    
    print("Database seeding complete!")
