from flask import request

from blueprints.user import user_bp
from models import User, model2dict


@user_bp.route('/all', methods=['GET'])
def get_all_users():
    return model2dict(User.query.all())


@user_bp.route('/get', methods=['GET'])
def query_user():
    user_id = request.args.get("id")
    target = User.query.filter_by(id=user_id).first()
    return model2dict(target)
