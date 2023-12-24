import datetime

from flask import request
from sqlalchemy import func

from blueprints.video import video_bp
from exts import db, AjaxResponse
from models import Video, model2dict, User, VideoLike, VideoStar, VTRelation, VTag, VideoPlay


# API: 根据推流逻辑发放视频
@video_bp.route('/get', methods=['GET'])
def get_all_videos():
    # 从表中抽取指定数量的记录
    num_records = request.args.get("num")

    # 从表中抽取指定作者的记录
    author_id = request.args.get("author_id")

    # 从表中抽取指定标签的记录
    tags_name_raw = request.args.get("tags_name")
    tag_filter_mode = request.args.get("tag_filter_mode")

    # 是否包含未上线的视频
    all_status = request.args.get("all_status")

    # 是否按id降序
    sort = request.args.get("sort")

    # 待筛选的标签列表
    query_tags_name = []
    if tags_name_raw is not None:
        query_tags_name = tags_name_raw.split(',')

    if sort == "sort":
        if all_status == "all":
            all_videos = Video.query.order_by(db.desc(Video.id)).all()
        else:
            all_videos = Video.query.filter_by(status="online").order_by(db.desc(Video.id)).all()
    else:
        if all_status == "all":
            all_videos = Video.query.order_by(func.random())
        else:
            all_videos = Video.query.filter_by(status="online").order_by(func.random())
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
                    return VTag.query.filter_by(
                        id=v_tag_relation_model.tag_id).first().name

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


# API: 根据id查询
@video_bp.route('/query', methods=['GET'])
def query_video():
    video_id = request.args.get("id")
    target = Video.query.filter_by(id=video_id).first()
    if target is None:
        return AjaxResponse.error("视频不存在")
    return model2dict([target])


# API: 获取视频被哪些用户点赞，收藏或者播放
@video_bp.route('/get/actions', methods=['GET'])
def get_video_actioned_users():
    action = request.args.get("action")
    video_id = request.args.get("video_id")
    video = Video.query.get(video_id)
    if not video:
        return AjaxResponse.error("视频不存在")

    if action == "like":
        action_table = VideoLike
        video_actions_list = video.video_liked
    elif action == "star":
        action_table = VideoStar
        video_actions_list = video.video_starred
    elif action == "play":
        action_table = VideoPlay
        video_actions_list = video.video_played
    else:
        return AjaxResponse.error(f"参数错误: action={action}")

    def get_user_by_video_action(video_action: action_table):
        return video_action.user

    # video_actions_list = video.video_liked if action == "like" else video.video_starred
    # video_actions_list = Video.query.get(video_id).video_liked
    target = list(map(get_user_by_video_action, video_actions_list))
    return AjaxResponse.success(model2dict(target))


# API: 记录播放历史
@video_bp.route('/action/play', methods=['POST'])
def action_play_video():
    # 检查用户和视频是否存在
    user_id = request.args.get("user_id")
    video_id = request.args.get("video_id")
    if not user_id or not video_id:
        return AjaxResponse.error("参数缺失")
    user = User.query.get(user_id)
    video = Video.query.get(video_id)
    if not user or not video:
        return AjaxResponse.error("用户或视频不存在")

    exist_played = VideoPlay.query.filter_by(
        user_id=user_id, video_id=video_id).all()

    if not exist_played:
        new_play = VideoPlay(
            user_id=user_id,
            video_id=video_id,
            time=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        db.session.add(new_play)
        db.session.commit()
        return AjaxResponse.success(None, "视频播放记录已存在")
    else:
        return AjaxResponse.success(None, "视频播放记录已存在")


# API: 点赞或收藏
@video_bp.route('/action', methods=['POST'])
def like_or_dislike_video():
    # 检查用户和视频是否存在
    user_id = request.args.get("user_id")
    video_id = request.args.get("video_id")
    if not user_id or not video_id:
        return AjaxResponse.error("参数缺失")
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
            new_action = action_table(
                user_id=user_id,
                video_id=video_id,
                time=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
            db.session.add(new_action)
            db.session.commit()
            return AjaxResponse.success(
                None, f"{action_text}成功")
        else:
            return AjaxResponse.error("点击太频繁")


# API: 删除视频
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


# API: 绑定/新增视频标签
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


# API: 发布视频
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
    # tags_string = ' '.join(['#' + tag for tag in data['tags']])
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


# API: 根据id查询视频/全部视频详细信息
@video_bp.route('/info/<video_id>', methods=['GET'])
def get_video_info(video_id):
    if video_id is None:
        return AjaxResponse.error("参数缺失: video_id")

    if video_id == "all":
        videos = Video.query.all()
        records = []
        for video in videos:
            records.append(VideoRecord(video))
        return model2dict(records)
    else:
        video = Video.query.get(video_id)
        if video is None:
            return AjaxResponse.error("视频不存在")
        record = VideoRecord(video)
        return AjaxResponse.success(model2dict([record])[0])


# API: 更新视频信息
@video_bp.route('/edit', methods=['POST'])
def edit_video_by_id():
    video_id = request.args.get('videoId')
    status = request.args.get('status')
    video_title = request.args.get('title')
    author_id = request.args.get('authorId')

    if status is None or video_title is None or author_id is None or video_id is None:
        return AjaxResponse.error("参数缺失")
    video = Video.query.filter_by(id=video_id).first()
    if video is None:
        return AjaxResponse.error("视频不存在")
    author = User.query.filter_by(id=author_id).first()
    if author is None:
        return AjaxResponse.error("用户不存在")
    if status not in ["online", "offline", "awaitApproval"]:
        return AjaxResponse.error("参数错误: status")

    video.title = video_title
    video.author_id = author_id
    video.status = status

    db.session.commit()
    return AjaxResponse.success(None, "视频信息编辑成功")


# API: 获取流量周期数据:
@video_bp.route('/get/weekly', methods=['GET'])
def get_video_play_weekly():
    video_plays = VideoPlay.query.all()
    # 计算最近7天每天对应的数据个数
    current_date = datetime.datetime.now().date()
    date_counts = {str(current_date - datetime.timedelta(days=i)): 0 for i in range(6, -1, -1)}

    for entry in video_plays:
        entry_date = datetime.datetime.strptime(entry.time, "%Y-%m-%d %H:%M:%S").date()
        days_ago = (current_date - entry_date).days

        if 0 <= days_ago < 7:
            date_counts[str(entry_date)] += 1
    formatted_data = [{"x": date, "y": value} for date, value in date_counts.items()]
    # formatted_data = {"date": list(date_counts.keys()), "value": list(date_counts.values())}
    return formatted_data, 200


class VideoRecord:
    videoId: int | str
    videoTitle: str
    authorName: str
    authorId: int
    status: str
    contentType: str
    likeCount: int
    starCount: int
    playCount: int
    commentCount: int
    publishTime: str
    tags: list[str]

    def __init__(self, video: Video):
        self.videoId = video.id
        self.videoTitle = video.title
        self.authorName = User.query.get(video.author_id).nickname
        self.authorId = video.author_id
        self.status = video.status
        self.contentType = "horizontalVideo" if video.width >= video.height else "verticalVideo"
        self.likeCount = len(video.video_liked)
        self.playCount = len(video.video_played)
        self.starCount = len(video.video_starred)
        self.commentCount = len(video.comments)
        self.publishTime = video.publish_time
        # tags = video.tags
        tags = video.vt_relations

        def get_tag_name(vtr):
            return vtr.tag.name

        tags_name = list(map(get_tag_name, tags))
        self.tags = tags_name
