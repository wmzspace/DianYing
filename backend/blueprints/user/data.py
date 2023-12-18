import datetime
import os
import cv2
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


def upload(user_id, file_type):
    if user_id is None and user_id != "ignore":
        return AjaxResponse.error("参数缺失: user_id")
    user = User.query.filter_by(id=user_id).first()
    if user is None and user_id != "ignore":
        return AjaxResponse.error("用户不存在")
    f = request.files['file']
    base_path = app.root_path
    extension = f.filename.rsplit(".", 1)[1].lower()
    if file_type == "video":
        if extension not in ["mp4", "mov", "avi", "webm"]:
            return AjaxResponse.error("文件类型不支持")
        relative_path = ('static/videos/'
                         f'{user_id}-{datetime.datetime.now().strftime("%Y%m%d-%H%M%S")}.{extension}')
    elif file_type == "avatar":
        if extension not in ["png", "jpg", "jpeg", "gif"]:
            return AjaxResponse.error("文件类型不支持")
        relative_path = f'static/user/avatars/{user_id}.{extension}'
    elif file_type == "cover":
        if extension not in ["png", "jpg", "jpeg", "gif"]:
            return AjaxResponse.error("文件类型不支持")
        relative_path = ('static/videos/covers/'
                         f'{datetime.datetime.now().strftime("%Y%m%d-%H%M%S")}.{extension}')
    else:
        return AjaxResponse.error("参数错误: type")

    upload_path = os.path.join(
        base_path, relative_path
    )
    f.save(upload_path)
    server_path = os.path.join(PREFIX_URL, relative_path)
    if file_type == "avatar":
        user.avatar = server_path
        db.session.commit()
        return AjaxResponse.success(None, "头像上传成功")
    elif file_type == "cover":
        return AjaxResponse.success(server_path, "封面上传成功")
    else:
        video_capture = cv2.VideoCapture(server_path)
        success, frame = video_capture.read()
        if success:
            relative_path = ('static/videos/covers/'
                             f'{datetime.datetime.now().strftime("%Y%m%d-%H%M%S")}.jpg')
            cover_upload_path = os.path.join(
                base_path, relative_path
            )
            cv2.imwrite(cover_upload_path, frame)
            cover_server_path = os.path.join(PREFIX_URL, relative_path)
            return AjaxResponse.success({
                'videoPath': server_path,
                'coverPath': cover_server_path
            }, "视频上传成功，封面获取成功")
        else:
            return AjaxResponse.success({
                'videoPath': server_path,
                'coverPath': ""
            }, "视频上传成功")


@user_bp.route('/upload/video', methods=['POST'])
def upload_video():
    user_id = request.form.get("user_id")
    return upload(user_id, 'video')


@user_bp.route('/upload/cover', methods=['POST'])
def upload_cover():
    user_id = request.form.get("user_id")
    return upload("ignore", 'cover')


@user_bp.route('/upload/avatar', methods=['POST'])
def upload_avatar():
    user_id = request.form.get("user_id")
    return upload(user_id, 'avatar')
