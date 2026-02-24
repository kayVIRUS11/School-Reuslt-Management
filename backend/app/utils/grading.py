from ..models import GradingScale

def calculate_grade(total):
    scales = GradingScale.query.order_by(GradingScale.min_score.desc()).all()
    for scale in scales:
        if scale.min_score <= total <= scale.max_score:
            return scale.grade, scale.remark
    return 'F', 'Fail'

def calculate_total(ca1, ca2, ca3, exam):
    return (ca1 or 0) + (ca2 or 0) + (ca3 or 0) + (exam or 0)
