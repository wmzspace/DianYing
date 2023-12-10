from flask import request

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
        target = Comment.query.get(parent_id).replies
    else:
        if video_id is None:
            return AjaxResponse.error("缺失参数: video_id")
        video = Video.query.get(video_id)
        if video is None:
            return AjaxResponse.error("视频不存在")
        target = video.comments
        # target = Comment.query.filter_by(video_id=video_id).all()
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
    existing_like = CommentLike.query.filter_by(user_id=user_id, comment_id=comment_id).all()

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

    author = User.query.get(author_id)
    parent = Comment.query.get(parent_id)
    video = request.args.get(video_id)

    if not author or not parent or not video:
        return AjaxResponse.error("资源不存在")

    # 创建评论对象
    comment = Comment({
        'content': content,
        'parent_id': parent_id,
        'video_id': video_id,
        "author_id": author_id
    })

    # 将评论对象添加到会话中
    db.session.add(comment)

    # 提交更改到数据库
    db.session.commit()

    return "评论已发布！"
