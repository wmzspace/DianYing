from flask import request
from sqlalchemy import func

from blueprints.video import video_bp
from exts import db, AjaxResponse
from models import Video, model2dict, User, VideoLike, VideoStar


@video_bp.route('/get', methods=['GET'])
def get_all_users():
    all_videos = Video.query.all()
    num_records = request.args.get("num")
    # 获取表中的记录总数
    total_records = Video.query.count()
    # 从表中抽取指定数量的记录
    random_records = Video.query.order_by(
        func.random()).limit(num_records).all()
    return model2dict(random_records)


@video_bp.route('/query', methods=['GET'])
def query_video():
    video_id = request.args.get("id")
    target = Video.query.filter_by(id=video_id).first()
    return model2dict([target])


# @video_bp.route('/like', methods=['POST', 'GET'])  # FIXME
# def like_video():
#     # 检查用户和视频是否存在
#     user_id = request.args.get("user_id")
#     video_id = request.args.get("video_id")
#     user = User.query.get(user_id)
#     video = Video.query.get(video_id)
#     if not user or not video:
#         return AjaxResponse.error("用户或视频不存在")
#
#     # 检查用户是否已经点赞过该视频
#     existing_like = VideoLike.query.filter_by(user_id=user_id, video_id=video_id).first()
#     if existing_like:
#         return AjaxResponse.error("您已经点赞过该视频")
#
#     # 创建点赞记录
#     like = VideoLike(user_id=user_id, video_id=video_id)
#     db.session.add(like)
#     db.session.commit()
#     return AjaxResponse.success(None, "点赞成功")

@video_bp.route('/get_actions', methods=['GET'])
def get_video_liked_users():
    action = request.args.get("action")

    action_table = VideoLike if action == "like" else VideoStar

    def get_user_by_video_action(video_action: action_table):
        return video_action.user

    video_id = request.args.get("video_id")
    video = Video.query.get(video_id)
    if not video:
        return AjaxResponse.error("视频不存在")
    video_actions_list = video.video_liked if action == "like" else video.video_starred
    # video_actions_list = Video.query.get(video_id).video_liked
    target = list(map(get_user_by_video_action, video_actions_list))
    return AjaxResponse.success(model2dict(target))


# 点赞或收藏
@video_bp.route('/action', methods=['POST'])
def like_or_dislike_video():
    # 检查用户和视频是否存在
    user_id = request.args.get("user_id")
    video_id = request.args.get("video_id")
    action = request.args.get("action")
    to_status = request.args.get("to_status") == "true"
    user = User.query.get(user_id)
    video = Video.query.get(video_id)
    if not user or not video:
        return AjaxResponse.error("用户或视频不存在")

    action_table = VideoLike if action == "like" else VideoStar

    action_text = '点赞' if (action == 'like') else '收藏'

    # 检查用户是否已经点赞或收藏过该视频
    status_existed = action_table.query.filter_by(
        user_id=user_id, video_id=video_id).all()

    # 已经是点赞或收藏状态
    if len(status_existed) > 0:
        if to_status:
            return AjaxResponse.error("点击太频繁")
        else:
            # 取消该状态
            for exist_status in status_existed:
                db.session.delete(exist_status)
            db.session.commit()
            return AjaxResponse.success(
                None, f"已取消{action_text}")

    # 还不是点赞或收藏状态
    else:
        if to_status:
            new_action = action_table(user_id=user_id, video_id=video_id)
            db.session.add(new_action)
            db.session.commit()
            return AjaxResponse.success(
                None, f"{action_text}成功")
        else:
            return AjaxResponse.error("点击太频繁")
