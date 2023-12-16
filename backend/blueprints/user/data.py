from flask import request

from blueprints.user import user_bp
from exts import AjaxResponse
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
        return AjaxResponse.success(model2dict(list(map(get_video, video_liked))))
    elif action == "star":
        video_star = target.video_starred
        return AjaxResponse.success(model2dict(list(map(get_video, video_star))))
    else:
        return AjaxResponse.error("参数错误, action")
