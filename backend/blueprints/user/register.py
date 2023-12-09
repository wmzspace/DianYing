from blueprints.user import user_bp


@user_bp.route('/')
def test():
    return "hello bluprint"
