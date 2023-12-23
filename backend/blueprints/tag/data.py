from blueprints.tag import tag_bp

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
