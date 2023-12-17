import os

from flask import request
from flask import current_app as app

from exts import PREFIX_URL
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


@user_bp.route('/upload/avatar', methods=['POST', 'GET'])
def upload():
    user_id = request.form.get("user_id")
    if user_id is None:
        return AjaxResponse.error("参数缺失: user_id")
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return AjaxResponse.error("用户不存在")
    f = request.files['file']
    base_path = app.root_path
    extension = f.filename.rsplit(".", 1)[1].lower()
    if extension not in ["png", "jpg", "jpeg", "gif"]:
        return AjaxResponse.error("文件类型不支持")
    relative_path = f'static/user/avatars/{user_id}.{extension}'

    # upload_path = os.path.join(base_path, )
    upload_path = os.path.join(
        base_path, relative_path
    )
    f.save(upload_path)
    user.avatar = os.path.join(PREFIX_URL, relative_path)
    db.session.commit()
    return AjaxResponse.success(None, "上传成功")
