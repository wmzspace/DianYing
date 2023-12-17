from flask import request

from blueprints.user import user_bp
from exts import AjaxResponse, db
from models import User, model2dict


@user_bp.route('/all', methods=['GET'])
def get_all_users():
    return model2dict(User.query.all())


@user_bp.route('/get', methods=['GET'])
def query_user():
    user_id = request.args.get("id")
    target = User.query.filter_by(id=user_id).first()
    if target is None:
        return model2dict([])
    return model2dict([target])


# 获取用户喜欢/收藏了哪些视频
@user_bp.route('/get/actions', methods=['GET'])
def get_user_likes():
    user_id = request.args.get("id")
    action = request.args.get("action")
    target = User.query.filter_by(id=user_id).first()
    if target is None:
        return AjaxResponse.error("用户不存在")

    def get_video(i):
        return i.video

    if action == "like":
        video_liked = target.video_liked
        return AjaxResponse.success(model2dict(
            list(map(get_video, video_liked))))
    elif action == "star":
        video_star = target.video_starred
        return AjaxResponse.success(
            model2dict(list(map(get_video, video_star))))
    else:
        return AjaxResponse.error("参数错误, action")


@user_bp.route('/update', methods=['POST'])
def update_user():
    user_id = request.json['id']
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return AjaxResponse.error("用户不存在")
    email = request.json['email']
    if email != user.email and User.query.filter_by(
            email=email).first() is not None:
        return AjaxResponse.error("该邮箱已经被使用")

    user.email = email
    user.nickname = request.json['nickname']
    user.password = request.json['password']
    user.area = request.json['area']
    if 'age' in request.json:
        user.age = request.json['age']
    else:
        user.age = 0
    user.gender = request.json['gender']
    user.signature = request.json['signature']
    db.session.commit()
    return AjaxResponse.success(None, "修改成功！")
    # email = request.args.get("email")
    # password = request.args.get("password")
    # nickname = request.args.get("nickname")
    # gender = request.args.get("gender")
    # area = request.args.get("area")
    # signature = request.args.get("signature")
