import datetime

from flask import request
from sqlalchemy.orm.collections import InstrumentedList

from blueprints.comment import comment_bp
from exts import AjaxResponse, db
from models import Comment, model2dict, User, Video, VideoLike, CommentLike

from sqlalchemy import distinct


@comment_bp.route('/all', methods=['GET'])
def get_all_comments():
    return model2dict(Comment.query.all())


@comment_bp.route('/get', methods=['GET', 'POST'])
def get_comments_by_video_id_or_comment_id():
    video_id = request.args.get("video_id")
    parent_id = request.args.get("parent_id")
    # print(f"video_id:{video_id}")
    # print(f"parent_id:{parent_id}")

    if parent_id is not None:
        parent = Comment.query.get(parent_id)
        if parent is not None:
            target = parent.replies
        else:
            return AjaxResponse.error("资源不存在: comment")
    else:
        if video_id is None:
            return AjaxResponse.error("缺失参数: video_id")
        video = Video.query.get(video_id)
        if video is None:
            return AjaxResponse.error("资源不存在: video")

        def is_root_comment(comment: Comment):
            return comment.parent_id is None

        target = list(filter(is_root_comment, video.comments))
    return AjaxResponse.success(model2dict(target))


@comment_bp.route('/get_likes', methods=['GET'])
def get_comment_liked_users():
    def get_user_by_comment_like(comment_like: CommentLike):
        return comment_like.user

    comment_id = request.args.get("comment_id")
    comment = Comment.query.get(comment_id)
    if not comment:
        return AjaxResponse.error("评论不存在")
    comment_liked_list = Comment.query.get(comment_id).comment_liked
    target = list(map(get_user_by_comment_like, comment_liked_list))
    return AjaxResponse.success(model2dict(target))


@comment_bp.route('/like', methods=['POST'])
def like_or_dislike_comment():
    # 检查用户和评论是否存在
    user_id = request.args.get("user_id")
    comment_id = request.args.get("comment_id")
    to_like_or_not = request.args.get("to_like") == "true"
    user = User.query.get(user_id)
    comment = Comment.query.get(comment_id)
    if not user or not comment:
        return AjaxResponse.error("用户或评论不存在")

    # 检查用户是否已经点赞过该评论
    existing_like = CommentLike.query.filter_by(
        user_id=user_id, comment_id=comment_id).all()

    # 已经点过赞
    if len(existing_like) > 0:
        if to_like_or_not:
            return AjaxResponse.error("点击太频繁")
        else:
            # 取消点赞
            for like in existing_like:
                db.session.delete(like)
            db.session.commit()
            return AjaxResponse.success(None, "已取消点赞")

    # 还未点过赞
    else:
        if to_like_or_not:
            like = CommentLike(user_id=user_id, comment_id=comment_id)
            db.session.add(like)
            db.session.commit()
            return AjaxResponse.success(None, "点赞成功")
        else:
            return AjaxResponse.error("点击太频繁")


@comment_bp.route('/post', methods=['POST'])
# 定义评论函数
def post_comment():
    # 检查用户和评论是否存在
    author_id = request.args.get("author_id")
    video_id = request.args.get("video_id")
    parent_id = request.args.get("parent_id")
    content = request.args.get("content")

    if (author_id is None or content is None
            or (video_id is None and parent_id is None)):
        return AjaxResponse.error("参数缺失")

    author = User.query.get(author_id)
    if not author:
        return AjaxResponse.error("资源不存在: author")
    if parent_id is not None:
        parent = Comment.query.get(parent_id)
        if not parent:
            return AjaxResponse.error("资源不存在: parent")
        video_id = parent.video_id
    elif video_id is not None:
        video = Video.query.get(video_id)
        if not video:
            return AjaxResponse.error("资源不存在: video")

    # 创建评论对象
    comment = Comment({
        'content': content,
        'parent_id': parent_id,
        'video_id': video_id,
        "author_id": author_id,
        "publish_time": datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    })

    comment_id = comment.id

    # 将评论对象添加到会话中
    db.session.add(comment)

    # 提交更改到数据库
    db.session.commit()

    return AjaxResponse.success(
        {'comment_id': comment_id},
        "评论已发布")


@comment_bp.route('/delete', methods=['POST'])
def api_delete_comment():
    comment_id = request.args.get("comment_id")
    return delete_comment(comment_id)


# 用于递归删除
def delete_comment(comment_id):
    if comment_id is None:
        return AjaxResponse.error("参数缺失")
    comment = Comment.query.get(comment_id)
    if not comment:
        return AjaxResponse.error("资源不存在: comment")
    print(comment_id)
    # children_comment = comment.replies
    # if not children_comment:
    #     # 可以直接删除
    #     pass
    # else:
    #     # 需要先删除子评论
    #     for child_comment in children_comment:
    #         delete_comment(child_comment.id)
    # db.session.commit()
    db.session.commit()
    # print(comment.content)
    db.session.delete(comment)
    db.session.commit()
    return AjaxResponse.success(None,"删除成功")
