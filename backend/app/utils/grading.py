from app.models import GradingScale

def calculate_grade(total):
    scales = GradingScale.query.order_by(GradingScale.min_score.desc()).all()
    for scale in scales:
        if scale.min_score <= total <= scale.max_score:
            return scale.grade, scale.remark
    return 'F', 'Fail'

def calculate_result(ca1, ca2, ca3, exam):
    total = (ca1 if ca1 is not None else 0) + (ca2 if ca2 is not None else 0) + \
            (ca3 if ca3 is not None else 0) + (exam if exam is not None else 0)
    grade, remark = calculate_grade(total)
    return total, grade, remark
