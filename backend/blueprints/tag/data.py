from flask import request

from blueprints.tag import tag_bp
from exts import AjaxResponse

from models import VTag


@tag_bp.route('/get', methods=['GET'])
def get_all_tags():
    tags = VTag.query.all()

    def get_tag_name(tag):
        return tag.name

    return list(map(get_tag_name, tags))


# API: 获取所有标签对应的视频数量
@tag_bp.route('/statistic', methods=['GET'])
def get_tag_statistic():
    tags = VTag.query.all()
    result = []
    for tag in tags:
        result.append({'name': tag.name, 'count': len(tag.vt_relations)})
    result = sorted(result, key=lambda x: x['count'], reverse=True)
    return result, 200


channel_dict = {
    "knowledge": ["知识", "ppt教学", "拍摄技巧"],
    "hot": ["热点", "热门"],
    "game": ["游戏"],
    "entertainment": ["娱乐"],
    "ACGN": ["二次元"],
    "music": ["音乐"],
    "delicacy": ["美食"],
    "sports": ["体育", "篮球"],
    "fashions": ["时尚"],
}


# API: 根据Channel名获取对应的标签列表
@tag_bp.route('/channel', methods=['GET'])
def get_channel_tags():
    channel_name = request.args.get("name")
    if channel_name is None:
        return AjaxResponse.error("参数缺失: name")
    if channel_name not in channel_dict:
        return AjaxResponse.error("参数错误: name")

    return AjaxResponse.success(channel_dict[channel_name])
