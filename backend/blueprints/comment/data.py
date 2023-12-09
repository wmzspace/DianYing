from flask import request

from blueprints.comment import comment_bp
from models import Comment, model2dict


@comment_bp.route('/all', methods=['GET'])
def get_all_comments():
    return (model2dict(Comment.query.all())

            @ comment_bp.route('/get', methods=['GET']))


def get_comments_by_video_id():
    video_id = request.args.get("video_id")
    target = Comment.query.filter_by(video_id=video_id).all()
    return model2dict(target)
