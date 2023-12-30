import datetime
import os
import cv2
from flask import request
from flask import current_app as app

from blueprints.video.data import VideoRecord
from exts import PREFIX_URL
from blueprints.user import user_bp
from exts import AjaxResponse, db
from models import User, model2dict


# API 获取全部用户信息 Depressed
@user_bp.route('/all', methods=['GET'])
def get_all_users():
    return model2dict(User.query.all())


# API 查询用户 Depressed
@user_bp.route('/get', methods=['GET'])
def query_user():
    user_id = request.args.get("id")
    target = User.query.filter_by(id=user_id).first()
    if target is None:
        return model2dict([])
    return model2dict([target])


# API 获取用户喜欢/收藏/播放了哪些视频
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
        return AjaxResponse.success(model2dict(
            list(map(get_video, target.video_liked))))
    elif action == "star":
        return AjaxResponse.success(
            model2dict(list(map(get_video, target.video_starred))))
    elif action == "play":
        return AjaxResponse.success(
            model2dict(list(map(get_video, target.video_play)))
        )
    else:
        return AjaxResponse.error("参数错误, action")


# API 获取用户个性化推荐标签
@user_bp.route('/get/like_tags', methods=['GET'])
def get_user_like_tags():
    user_id = request.args.get("user_id")
    if user_id is None:
        return AjaxResponse.error("参数缺失: user_id")
    user = User.query.get(user_id)
    if user is None:
        return AjaxResponse.error("用户不存在")
    videos_liked = user.video_liked
    results = []
    for video_like in videos_liked:
        tags = VideoRecord(video_like.video).tags
        for tag in tags:
            results.append(tag)
    results = list(set(results))
    return AjaxResponse.success(results)


# API: 更新用户资料
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
    db.session.flush()
    db.session.commit()
    return AjaxResponse.success(None, "修改成功！")
    # email = request.args.get("email")
    # password = request.args.get("password")
    # nickname = request.args.get("nickname")
    # gender = request.args.get("gender")
    # area = request.args.get("area")
    # signature = request.args.get("signature")


# 上传头像，视频或封面的封装函数
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
        db.session.flush()
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


# API: 上传视频
@user_bp.route('/upload/video', methods=['POST'])
def upload_video():
    user_id = request.form.get("user_id")
    return upload(user_id, 'video')


# API: 上传封面
@user_bp.route('/upload/cover', methods=['POST'])
def upload_cover():
    user_id = request.form.get("user_id")
    return upload("ignore", 'cover')


# API: 上传头像
@user_bp.route('/upload/avatar', methods=['POST'])
def upload_avatar():
    user_id = request.form.get("user_id")
    return upload(user_id, 'avatar')


# TODO: 性能优化
class UserRecord:
    nickName: str
    id: int | str
    email: str
    avatar: str
    password: str
    age: int
    gender: str
    videoNum: int
    likedNum: int
    playedNum: int
    signature: str
    registerTime: str
    area: str

    def __init__(self, user: User):
        self.id = user.id
        self.nickName = user.nickname
        self.email = user.email
        self.avatar = user.avatar
        self.password = user.password
        self.age = user.age
        self.gender = user.gender
        self.signature = user.signature
        self.registerTime = user.register_time
        self.area = user.area
        # self.likedNum = len(user.video_liked)
        liked_num = 0
        videos = user.videos
        for video in videos:
            liked_num += len(video.video_liked)
        self.likedNum = liked_num
        self.videoNum = len(user.videos)
        # 该用户看过的视频数量
        self.playedNum = len(user.video_play)


# API: 全部/根据id查询用户
@user_bp.route('/info/<param>', methods=['GET'])
def get_user_info(param):
    if param == "all":
        users = User.query.all()
        result = []
        for user in users:
            record = UserRecord(user)
            result.append(record)
        return model2dict(result)
    else:
        if not str(param).isdigit():
            return "param应为user_id", 404
        user = User.query.get(int(param))
        if user is None:
            return "用户不存在", 404
        return UserRecord(user).__dict__
