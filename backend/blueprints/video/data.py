import datetime

from flask import request
from sqlalchemy import func

from blueprints.video import video_bp
from exts import db, AjaxResponse
from models import Video, model2dict, User, VideoLike, VideoStar, VTRelation, VTag


# 根据推流逻辑发放视频
@video_bp.route('/get', methods=['GET'])
def get_all_videos():
    all_videos = Video.query.order_by(func.random())

    # 从表中抽取指定数量的记录
    num_records = request.args.get("num")

    # 从表中抽取指定作者的记录
    author_id = request.args.get("author_id")

    # 从表中抽取指定标签的记录
    tags_name_raw = request.args.get("tags_name")
    tag_filter_mode = request.args.get("tag_filter_mode")

    # 待筛选的标签列表
    query_tags_name = []
    if tags_name_raw is not None:
        query_tags_name = tags_name_raw.split(',')

    results = []
    for video in all_videos:
        if author_id is not None and video.author_id != author_id:
            continue
        if len(query_tags_name) > 0:
            tags = VTRelation.query.filter_by(video_id=video.id).all()
            if tag_filter_mode == "filterAll":
                # 返回包含所有标签的视频
                find = True

                def get_tags_name(v_tag_relation_model):
                    return VTag.query.filter_by(id=v_tag_relation_model.tag_id).first().name

                tags_name = list(map(get_tags_name, tags))
                for query_tag_name in query_tags_name:
                    if query_tag_name not in tags_name:
                        find = False
                        break
            else:
                # 返回包含任意一个标签的视频
                find = False
                for tag in tags:
                    tag_record = VTag.query.get(tag.tag_id)
                    if tag_record.name in query_tags_name:
                        find = True
                        break
            if not find:
                continue

        results.append(video)
        if num_records is not None and len(results) >= int(num_records):
            break
    return model2dict(results)


# 根据id查询
@video_bp.route('/query', methods=['GET'])
def query_video():
    video_id = request.args.get("id")
    target = Video.query.filter_by(id=video_id).first()
    return model2dict([target])


# 获取视频被哪些用户点赞或者收藏
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


# 删除视频
@video_bp.route('/delete', methods=['POST'])
def delete_video_by_id():
    id = request.args.get('id')
    if id is None:
        return AjaxResponse.error("参数缺失: id")
    video = Video.query.filter_by(id=id).first()
    if video is None:
        return AjaxResponse.error("视频不存在")
    db.session.delete(video)
    db.session.commit()
    return AjaxResponse.success(None, "视频已删除")


def add_tags(tags, video_id):
    for tag in tags:
        query_tag = VTag.query.filter_by(name=tag).first()

        if query_tag is None:
            # 如果 Tag 不存在，创建 Tag
            new_tag = VTag({'name': tag})
            db.session.add(new_tag)
            db.session.flush()
            tag_id = new_tag.id
            db.session.commit()
        else:
            tag_id = query_tag.id

        # 添加 VTRelation
        new_vt_relation = VTRelation({'video_id': video_id, 'tag_id': tag_id})
        db.session.add(new_vt_relation)
        db.session.commit()


@video_bp.route('/post', methods=['POST'])
def post_video():
    data = request.json['data']
    if 'url' not in data or len(data['url']) == 0:
        return AjaxResponse.error("参数缺失: url")
    if 'authorId' not in data or data['authorId'] == -1:
        return AjaxResponse.error("参数缺失: authorId")
    author = User.query.filter_by(id=data['authorId']).first()
    if author is None:
        return AjaxResponse.error("用户不存在")
    if 'height' not in data or data['height'] == -1:
        return AjaxResponse.error("参数缺失: height")
    if 'width' not in data or data['width'] == 0:
        return AjaxResponse.error("参数缺失: width")
    if 'cover' not in data or len(data['url']) == 0:
        return AjaxResponse.error("参数缺失: cover")
    if 'title' not in data or len(data['title']) == 0:
        return AjaxResponse.error("参数缺失: title")
    if 'tags' not in data or len(data['tags']) == 0:
        return AjaxResponse.error("参数缺失: tags")
    tags_string = ' '.join(['#' + tag for tag in data['tags']])
    new_video = Video({
        'url': data['url'],
        'author_id': data['authorId'],
        'height': data['height'],
        'width': data['width'],
        'cover': data['cover'],
        'title': data['title'],
        # 'title': data['title'] + ' ' + tags_string,
        'publish_time': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    })
    db.session.add(new_video)
    db.session.flush()
    new_video_id = new_video.id
    add_tags(data['tags'], new_video.id)
    db.session.commit()

    return AjaxResponse.success(new_video_id, "视频上传成功")


class VideoRecord:
    videoId: int | str
    videoTitle: str
    authorName: str
    status: str
    contentType: str
    likeCount: int
    starCount: int
    commentCount: int
    publishTime: str
    tags: list[str]

    def __init__(self, video_id, video_title, author_name,
                 status, content_type, like_count, star_count, comment_count, publish_time, tags):
        self.videoId = video_id
        self.videoTitle = video_title
        self.authorName = author_name
        self.status = status
        self.contentType = content_type
        self.likeCount = like_count
        self.starCount = star_count
        self.commentCount = comment_count
        self.publishTime = publish_time
        self.tags = tags


@video_bp.route('/info/<int:video_id>', methods=['GET'])
def get_video_info(video_id):
    if video_id is None:
        return AjaxResponse.error("参数缺失: video_id")
    video = Video.query.get(video_id)
    if video is None:
        return AjaxResponse.error("视频不存在")
    author_name = User.query.get(video.author_id).nickname
    content_type = "horizontalVideo" if video.width >= video.height else "verticalVideo"
    tags = video.tags

    def get_tag_name(tag):
        return tag.name

    tags_name = list(map(get_tag_name, tags))
    record = VideoRecord(
        video_id=video_id,
        video_title=video.title,
        author_name=author_name,
        status=video.status,
        content_type=content_type,
        like_count=len(video.video_liked),
        star_count=len(video.video_starred),
        comment_count=len(video.comments),
        publish_time=video.publish_time,
        tags=tags_name)

    return AjaxResponse.success(model2dict([record])[0])
