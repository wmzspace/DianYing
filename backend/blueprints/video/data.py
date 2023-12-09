from random import random

from flask import request
from sqlalchemy import func

from blueprints.video import video_bp
from models import Video, model2dict


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