from flask import request
from sqlalchemy import func

from blueprints.tag import tag_bp
from blueprints.video import video_bp
from exts import db, AjaxResponse
from models import Video, model2dict, User, VideoLike, VideoStar, VTRelation, VTag


@tag_bp.route('/get', methods=['GET'])
def get_all_tags():
    tags = VTag.query.all()

    def get_tag_name(tag):
        return tag.name

    return list(map(get_tag_name, tags))





# @tag_bp.route('/add', methods=['GET'])
# def api_add_tags():
#     video_id = request.args.get("video_id")
#     tags = request.args.get("tags")
#     if video_id is None or tags is None:
#         return AjaxResponse.error("参数缺失: video_id, tags")
#     if Video.query.filter_by(id=video_id).first() is None:

    # print(tags)
    # return AjaxResponse.success("成功")
