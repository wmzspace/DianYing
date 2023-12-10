# 导入所需包
import copy
import datetime
from typing import Any

import numpy

from exts import db

# PREFIX_URL = 'http://192.168.1.104:5000/'


PREFIX_URL = "http://127.0.0.1:5000/"


def model2dict(models: list[Any] | None) -> list[Any]:
    """
        This is model to dict function

        Convert any model Class to dict

        Args:
                models(list):   A list of model

        Returns:
            A list of converted dict
    """
    if models is None:
        return []
    result = []
    for model in list[any](models):
        tmp = model.__dict__
        if "_sa_instance_state" in tmp:
            tmp.pop("_sa_instance_state")
        result.append(copy.deepcopy(tmp))
    return result


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    nickname = db.Column(db.String(100), default="未命名用户")
    avatar = db.Column(db.String(100), default="未命名用户")
    sex = db.Column(db.String(10), nullable=False)
    register_time = db.Column(
        db.String(50),
        nullable=False,
        default=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

    # videos = db.relationship("Video", backref="author")
    videos = db.relationship("Video", back_populates="author")
    # 定义与评论的关联关系
    comments = db.relationship("Comment", back_populates="author")
    # comments = db.relationship("Comment", backref="user", cascade="all, delete-orphan")

    # 定义与视频的关联关系
    # videos = db.relationship("Video", backref="user", cascade="all, delete-orphan")

    video_likes = db.relationship("VideoLike", back_populates="user")
    comment_likes = db.relationship("CommentLike", back_populates="user")

    def __init__(self, args):
        if 'username' in args:
            self.username = args['username']
        if 'nickname' in args:
            self.nickname = args['nickname']
        if 'avatar' in args:
            self.avatar = args['avatar']
        if 'sex' in args:
            self.sex = args['sex']


class VTag(db.Model):
    __tablename__ = 'tags'
    """
        This is a class for VTag

        This class contain
        general attributes of video tag and add function

        Attributes:
                id:  	A primary key for VTag model
                name: 	A string of video tag's name
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20))

    def __init__(self, args):
        """
            initialize VTag class, some attributes pass in with args, which is a dict

            Input contain dict param

            Args:
                    args.id(int)      : tag id
                    args.name(name)   : tag name
        """
        if 'id' in args:
            self.id = args['id']
        if 'name' in args:
            self.name = args['name']

    @staticmethod
    def add_video_tag(args):
        """
            This is tag add static function

            Add video tag

            Args:
                    args.id(int)      : type id
                    args.name(name)   : type name

            Returns:
                created video tag
        """
        repeat = VTag.query.filter(name=args.name).first()
        if repeat is None:
            db.session.add(VTag({'name': args.name}))
            return True
        else:
            return False
        pass


class Video(db.Model):
    __tablename__ = 'videos'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    # backref: author = User
    url = db.Column(db.String(100), nullable=False)
    cover = db.Column(db.String(100), nullable=False)
    width = db.Column(db.Integer, nullable=False)
    height = db.Column(db.Integer, nullable=False)
    tags = db.relationship("VTag", secondary="video_tag_relation")
    publish_time = db.Column(
        db.String(50),
        nullable=False,
        default=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    author = db.relationship("User", back_populates="videos")
    video_likes = db.relationship("VideoLike", back_populates="video")
    comments = db.relationship("Comment", backref="video", cascade="all, delete-orphan")

    def __init__(self, args):
        if 'title' in args:
            self.title = args['title']
        if 'author_id' in args:
            self.author_id = args['author_id']
        if 'url' in args:
            self.url = args['url']
        if 'cover' in args:
            self.cover = args['cover']
        if 'width' in args:
            self.width = args['width']
        if 'height' in args:
            self.height = args['height']
        if 'likes' in args:
            self.likes = args['likes']
        if 'publish_time' in args:
            self.publish_time = args['publish_time']

    pass


class VTRelation(db.Model):
    __tablename__ = 'video_tag_relation'

    def __init__(self, args):
        """
            initialize VTRelation class, some attributes pass in with args, which is a dict

            Input contain dict param

            Args:
                    args.video_id(int)   : video id
                    args.tag_id(int)   : tag id
        """
        if 'tag_id' in args:
            self.tag_id = args['tag_id']
        if 'video_id' in args:
            self.video_id = args['video_id']

    id = db.Column(db.Integer, primary_key=True)
    video_id = db.Column(db.Integer, db.ForeignKey('videos.id'))
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.id'))

    pass


# 定义评论模型
class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(100), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    video_id = db.Column(db.Integer, db.ForeignKey('videos.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    publish_time = db.Column(
        db.String(50),
        nullable=False,
        default=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    author = db.relationship("User", back_populates="comments")
    # comment_likes = db.relationship("CommentLike", back_populates="comment")  # TODO: delete?
    # users_liked = db.relationship("User", secondary="comment_likes", backref="liked_comments")
    # users_liked = db.relationship("User", backref="liked_comments")
    comment_liked = db.relationship("CommentLike", back_populates="comment")
    # 定义与子评论的关联关系
    parent = db.relationship("Comment", backref="replies", remote_side=[id])

    def __init__(self, args):
        """
        初始化Comment类

        Args:
            args.content (str): 评论内容
            args.parent_id (int): 父评论ID
            args.video_id (int): 视频ID
            args.user_id (int): 用户ID
        """
        if 'content' in args:
            self.content = args['content']
        if 'parent_id' in args:
            self.parent_id = args['parent_id']
        if 'video_id' in args:
            self.video_id = args['video_id']
        if 'author_id' in args:
            self.author_id = args['author_id']


# 定义视频点赞模型
class VideoLike(db.Model):
    __tablename__ = 'video_likes'
    id = db.Column(db.Integer, primary_key=True)
    video_id = db.Column(db.Integer, db.ForeignKey('videos.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship("User", back_populates="video_likes")
    video = db.relationship("Video", back_populates="video_likes")


# 定义评论点赞模型
class CommentLike(db.Model):
    __tablename__ = 'comment_likes'
    id = db.Column(db.Integer, primary_key=True)
    comment_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship("User", back_populates="comment_likes")
    comment = db.relationship("Comment", back_populates="comment_liked")
    __table_args__ = (
        db.CheckConstraint('(comment_id, user_id) <> (\'value1\', \'value2\')', name='check_column1_column2'),
    )


def load_init_data():
    """
        This load initial data function

        Add test data to the database
    """
    # id = db.Column(db.Integer, primary_key=True)
    # username = db.Column(db.String(100), nullable=False)
    # nickname = db.Column(db.String(100), default="未命名用户")
    # avatar = db.Column(db.String(100), default="未命名用户")
    # sex = db.Column(db.String(10), nullable=False)
    # register_time = db.Column(
    #     db.String(50),
    #     nullable=False,
    #     default=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    db.session.add_all([
        User({
            'nickname': '19岁带饭冲锋🌈',
            'username': "1",
            'avatar': PREFIX_URL + 'static/user/avatars/1.jpeg',
            'sex': 'male'
        }), User({
            'nickname': '鹿非🌈',
            'username': "2",
            'avatar': PREFIX_URL + 'static/user/avatars/2.jpeg',
            'sex': 'male'
        }), User({
            'nickname': '活着就不算坏',
            'username': "3",
            'avatar': PREFIX_URL + 'static/user/avatars/3.jpeg',
            'sex': 'male'
        }), User({
            'nickname': '浅梦',
            'username': "4",
            'avatar': PREFIX_URL + 'static/user/avatars/4.jpeg',
            'sex': 'male'
        })
    ])

    video1 = {
        'title': '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
        'author_id': 1,
        'url': PREFIX_URL + 'static/videos/3.mp4',
        'cover': PREFIX_URL + 'static/videos/covers/3.jpeg',
        'width': 1280,
        'height': 720,
        'likes': 985,
    }
    video2 = {
        'title': '亿万富翁找回儿子',
        'author_id': 4,
        'url': PREFIX_URL + 'static/videos/1.mp4',
        'cover': PREFIX_URL + 'static/videos/covers/1.png',
        'width': 1080,
        'height': 1920,
        'likes': 324401,

    }
    video3 = {
        'title': '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
        'author_id': 2,
        'url': PREFIX_URL + 'static/videos/2.mp4',
        'cover': PREFIX_URL + 'static/videos/covers/2.jpeg',
        'width': 1024,
        'height': 576,
        'likes': 14904,
    }
    video4 = {
        'title': '19岁带饭冲锋🌈的作品',
        'author_id': 1,
        'url': PREFIX_URL + 'static/videos/2.mp4',
        'cover': PREFIX_URL + 'static/videos/covers/2.jpeg',
        'width': 1024,
        'height': 576,
        'likes': 14904,
    }

    videos = []
    for i in range(1):
        videos.append(copy.deepcopy(Video(video1)))
        videos.append(copy.deepcopy(Video(video2)))
        videos.append(copy.deepcopy(Video(video3)))
        videos.append(copy.deepcopy(Video(video4)))
    db.session.add_all(videos)

    db.session.add_all(
        [
            VTag({'name': '计算机'}),
            VTag({'name': '电子科技大学'}),
            VTag({'name': '程序员'}),
            VTag({'name': '求职'}),
            VTag({'name': '职业规划'}),
        ]
    )

    db.session.add_all(
        [
            Comment({'video_id': 1, 'author_id': 1, 'content': '别太荒谬了哥们，别太荒谬了哥们', 'likes': 665}),
            Comment({'video_id': 1, 'author_id': 2, 'content': '跟我谈😍', 'likes': 70, 'parent_id': 1}),
            Comment({'video_id': 1, 'author_id': 3, 'content': '我好喜欢', 'likes': 6}),
        ]
    )

    db.session.commit()
    db.session.add_all(
        [
            VTRelation({'video_id': 1, 'tag_id': 1}),
            VTRelation({'video_id': 1, 'tag_id': 2}),
            VTRelation({'video_id': 1, 'tag_id': 3}),
            VTRelation({'video_id': 1, 'tag_id': 4}),
            VTRelation({'video_id': 1, 'tag_id': 5}),
        ]
    )
    pass

# class Income(Invoice, db.Model):
#     """
#         This is a class for Income
#
#         Income class is the child class of Invoice
#
#         Attributes: super()
#     """
#     pass
#
#
# class Expenditure(Invoice, db.Model):
#     """
#         This is a class for Expenditure
#
#         Expenditure class is the child class of Invoice
#
#         Attributes: super()
#     """
#     pass
#
#

#
#
# class Goal(db.Model):
#     """
#         This is a class for Goal
#
#         This class contain
#         general attributes of goal
#
#         Attributes:
#                 id:  	A primary key for Goal model
#                 name: 	A string of goal's name
#                 value: 	A float of goal's value
#     """
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(20))
#     value = db.Column(db.Float)
