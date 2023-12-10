from random import random

from flask import request
from sqlalchemy import func

from blueprints.video import video_bp
from exts import db, AjaxResponse
from models import Video, model2dict, User, VideoLike


@video_bp.route('/get', methods=['GET'])
def get_all_users():
    all_videos = Video.query.all()
    num_records = request.args.get("num")
    # 获取表中的记录总数
    total_records = Video.query.count()
    # 从表中抽取指定数量的记录
    random_records = Video.query.order_by(func.random()).limit(num_records).all()
    return model2dict(random_records)


@video_bp.route('/query', methods=['GET'])
def query_video():
    video_id = request.args.get("id")
    target = Video.query.filter_by(id=video_id).first()
    return model2dict([target])


@video_bp.route('/like', methods=['POST', 'GET'])  # FIXME
def like_video():
    # 检查用户和视频是否存在
    user_id = request.args.get("user_id")
    video_id = request.args.get("video_id")
    user = User.query.get(user_id)
    video = Video.query.get(video_id)
    if not user or not video:
        return AjaxResponse.error("用户或视频不存在")

    # 检查用户是否已经点赞过该视频
    existing_like = VideoLike.query.filter_by(user_id=user_id, video_id=video_id).first()
    if existing_like:
        return AjaxResponse.error("您已经点赞过该视频")

    # 创建点赞记录
    like = VideoLike(user_id=user_id, video_id=video_id)
    db.session.add(like)
    db.session.commit()
    return AjaxResponse.success(None, "点赞成功")
