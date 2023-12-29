# 导入所需包
import json

from exts import db, scheduler
from exts import PREFIX_URL
import copy
import datetime
from typing import Any

import numpy
from apscheduler.schedulers.background import BackgroundScheduler
from flask_sqlalchemy.record_queries import get_recorded_queries
from flask_sqlalchemy.track_modifications import models_committed
from sqlalchemy import event
from flask import current_app, signals

app = current_app


# PREFIX_URL = 'http://192.168.1.104:5000/'


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
        tmp = copy.deepcopy(model.__dict__)
        if "_sa_instance_state" in tmp:
            tmp.pop("_sa_instance_state")
        result.append(tmp)
    return result


class User(db.Model):
    __tablename__ = 'users'
    __description__ = '用户'

    def to_dict(self):
        return {c.name: getattr(self, c.name, None)
                for c in self.__table__.columns}

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100))
    nickname = db.Column(db.String(100), default="未命名用户")
    age = db.Column(db.Integer, default=0, nullable=False)
    avatar = db.Column(
        db.String(100),
        default=PREFIX_URL + "static/user/avatars/default.jpeg")
    gender = db.Column(db.String(10), default="male")
    area = db.Column(db.String(20))
    signature = db.Column(db.String(120))
    register_time = db.Column(
        db.String(50),
        nullable=False)

    # videos = db.relationship("Video", backref="author")
    videos = db.relationship(
        "Video",
        back_populates="author",
        cascade="all, delete")
    # 定义与评论的关联关系
    comments = db.relationship(
        "Comment",
        back_populates="author",
        cascade="all, delete")
    # comments = db.relationship("Comment", backref="user", cascade="all, delete-orphan")

    # 定义与视频的关联关系
    # videos = db.relationship("Video", backref="user", cascade="all, delete-orphan")
    video_play = db.relationship(
        "VideoPlay",
        back_populates="user",
        cascade="all, delete")
    video_liked = db.relationship(
        "VideoLike",
        back_populates="user",
        cascade="all, delete")
    video_starred = db.relationship(
        "VideoStar",
        back_populates="user",
        cascade="all, delete")
    comment_likes = db.relationship(
        "CommentLike",
        back_populates="user",
        cascade="all, delete-orphan")

    def __repr__(self):
        return f"{self.nickname}"

    def __init__(self, args):
        if 'id' in args:
            self.id = args['id']
        if 'email' in args:
            self.email = args['email']
        if 'nickname' in args:
            self.nickname = args['nickname']
        if 'avatar' in args:
            self.avatar = args['avatar']
        if 'gender' in args:
            self.gender = args['gender']
        if 'age' in args:
            self.age = args['age']
        if 'area' in args:
            self.area = args['area']
        if 'signature' in args:
            self.signature = args['signature']
        if 'password' in args:
            self.password = args['password']
        if 'register_time' in args:
            self.register_time = args['register_time']


class Register(db.Model):
    __tablename__ = "registers"
    __description__ = '验证码记录'

    def to_dict(self):
        return {c.name: getattr(self, c.name, None)
                for c in self.__table__.columns}

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(6), nullable=True)
    code_timestamp = db.Column(
        db.String(50),
        nullable=False)

    def __repr__(self):
        return f"{self.id}"


class Video(db.Model):
    __tablename__ = 'videos'
    __description__ = '视频'

    def to_dict(self):
        return {c.name: getattr(self, c.name, None)
                for c in self.__table__.columns}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author_id = db.Column(
        db.Integer, db.ForeignKey(
            'users.id', ondelete="cascade"))
    # backref: author = User
    url = db.Column(db.String(100), nullable=False)
    cover = db.Column(db.String(100), nullable=False)
    width = db.Column(db.Integer, nullable=False)
    height = db.Column(db.Integer, nullable=False)
    # tags = db.relationship("VTag", secondary="video_tag_relation")
    status = db.Column(db.String(100), nullable=False, default="awaitApproval")
    publish_time = db.Column(
        db.String(50),
        nullable=False)
    author = db.relationship("User", back_populates="videos")
    video_played = db.relationship(
        "VideoPlay",
        back_populates="video",
        cascade="all, delete")
    video_liked = db.relationship(
        "VideoLike",
        back_populates="video",
        cascade="all, delete")
    video_starred = db.relationship(
        "VideoStar",
        back_populates="video",
        cascade="all, delete")
    vt_relations = db.relationship(
        "VTRelation",
        back_populates="video",
        cascade="all, delete")
    comments = db.relationship(
        "Comment",
        backref="video",
        cascade="all, delete-orphan")

    def __repr__(self):
        return f"{self.id}"

    def __init__(self, args):
        if 'id' in args:
            self.id = args['id']
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
        if 'status' in args:
            self.status = args['status']
        if 'publish_time' in args:
            self.publish_time = args['publish_time']


class VTag(db.Model):
    __tablename__ = 'tags'
    __description__ = '标签'

    def to_dict(self):
        return {c.name: getattr(self, c.name, None)
                for c in self.__table__.columns}

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
    vt_relations = db.relationship(
        "VTRelation",
        back_populates="tag",
        cascade="all, delete")

    def __repr__(self):
        return self.name

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


class VTRelation(db.Model):
    __tablename__ = 'video_tag_relation'
    __description__ = '视频标签关系'

    def to_dict(self):
        return {c.name: getattr(self, c.name, None)
                for c in self.__table__.columns}

    def __repr__(self):
        return f"{self.tag.name}"

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
    video_id = db.Column(
        db.Integer,
        db.ForeignKey(
            'videos.id',
            ondelete="cascade"))
    tag_id = db.Column(
        db.Integer,
        db.ForeignKey(
            'tags.id',
            ondelete="cascade"))
    tag = db.relationship(
        "VTag",
        back_populates="vt_relations")
    video = db.relationship(
        "Video",
        back_populates="vt_relations")


# 定义评论模型
class Comment(db.Model):
    __tablename__ = 'comments'
    __description__ = '评论'

    def to_dict(self):
        return {c.name: getattr(self, c.name, None)
                for c in self.__table__.columns}

    def __repr__(self):
        return f"{self.content}"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(400), nullable=False)
    parent_id = db.Column(
        db.Integer,
        db.ForeignKey(
            'comments.id',
            ondelete="cascade"))
    video_id = db.Column(
        db.Integer,
        db.ForeignKey('videos.id', ondelete="cascade"),
        nullable=False)
    author_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete="cascade"),
        nullable=False)
    publish_time = db.Column(
        db.String(50),
        nullable=False)
    author = db.relationship("User", back_populates="comments")
    # comment_likes = db.relationship("CommentLike", back_populates="comment")  # TODO: delete?
    # users_liked = db.relationship("User", secondary="comment_likes", backref="liked_comments")
    # users_liked = db.relationship("User", backref="liked_comments")
    comment_liked = db.relationship(
        "CommentLike",
        back_populates="comment",
        cascade="all, delete")
    # 定义与子评论的关联关系
    # replies = db.relationship("Comment", backref="parent", remote_side=[id],cascade="all, delete")
    replies = db.relationship(
        "Comment",
        backref=db.backref(
            'parent',
            remote_side=[id]),
        cascade="all, delete")

    def __init__(self, args):
        """
        初始化Comment类

        Args:
            args.content (str): 评论内容
            args.parent_id (int): 父评论ID
            args.video_id (int): 视频ID
            args.user_id (int): 用户ID
        """
        if 'id' in args:
            self.id = args['id']
        if 'content' in args:
            self.content = args['content']
        if 'parent_id' in args:
            self.parent_id = args['parent_id']
        if 'video_id' in args:
            self.video_id = args['video_id']
        if 'author_id' in args:
            self.author_id = args['author_id']
        if 'publish_time' in args:
            self.publish_time = args['publish_time']


# 定义视频播放统计模型
class VideoPlay(db.Model):
    __tablename__ = 'video_plays'
    __description__ = '视频播放记录'

    def to_dict(self):
        return {c.name: getattr(self, c.name, None)
                for c in self.__table__.columns}

    def __repr__(self):
        return f"{self.id}"

    id = db.Column(db.Integer, primary_key=True)
    video_id = db.Column(
        db.Integer,
        db.ForeignKey(
            'videos.id',
            ondelete="cascade"))
    user_id = db.Column(
        db.Integer,
        db.ForeignKey(
            'users.id',
            ondelete="cascade"))

    time = db.Column(
        db.String(50),
        nullable=False)
    user = db.relationship("User", back_populates="video_play")
    video = db.relationship("Video", back_populates="video_played")


# 定义视频点赞统计模型
class VideoLike(db.Model):
    __tablename__ = 'video_likes'
    __description__ = '视频点赞记录'

    def to_dict(self):
        return {c.name: getattr(self, c.name, None)
                for c in self.__table__.columns}

    def __repr__(self):
        return f"{self.id}"

    id = db.Column(db.Integer, primary_key=True)
    video_id = db.Column(
        db.Integer,
        db.ForeignKey(
            'videos.id',
            ondelete="cascade"))
    user_id = db.Column(
        db.Integer,
        db.ForeignKey(
            'users.id',
            ondelete="cascade"))
    time = db.Column(
        db.String(50),
        nullable=False)

    user = db.relationship("User", back_populates="video_liked")
    video = db.relationship("Video", back_populates="video_liked")


# 定义视频收藏统计模型
class VideoStar(db.Model):
    __tablename__ = 'video_stars'
    __description__ = '视频收藏记录'

    def to_dict(self):
        return {c.name: getattr(self, c.name, None)
                for c in self.__table__.columns}

    def __repr__(self):
        return f"{self.id}"

    id = db.Column(db.Integer, primary_key=True)
    video_id = db.Column(
        db.Integer,
        db.ForeignKey(
            'videos.id',
            ondelete="cascade"))
    user_id = db.Column(
        db.Integer,
        db.ForeignKey(
            'users.id',
            ondelete="cascade"))
    time = db.Column(
        db.String(50),
        nullable=False)
    user = db.relationship("User", back_populates="video_starred")
    video = db.relationship("Video", back_populates="video_starred")


# 定义评论点赞统计模型
class CommentLike(db.Model):
    __tablename__ = 'comment_likes'
    __description__ = '评论点赞记录'

    def to_dict(self):
        return {c.name: getattr(self, c.name, None)
                for c in self.__table__.columns}

    def __repr__(self):
        return f"{self.id}"

    id = db.Column(db.Integer, primary_key=True)
    comment_id = db.Column(
        db.Integer,
        db.ForeignKey(
            'comments.id',
            ondelete="cascade"))
    user_id = db.Column(
        db.Integer,
        db.ForeignKey(
            'users.id',
            ondelete="cascade"))
    time = db.Column(
        db.String(50),
        nullable=False)
    user = db.relationship("User", back_populates="comment_likes")
    comment = db.relationship("Comment", back_populates="comment_liked")
    __table_args__ = (
        db.CheckConstraint(
            '(comment_id, user_id) <> (\'value1\', \'value2\')',
            name='check_column1_column2'),
    )


class DatabaseBackup(db.Model):
    __tablename__ = 'database_backup'
    __description__ = '数据备份记录'

    def to_dict(self):
        return {c.name: getattr(self, c.name, None)
                for c in self.__table__.columns}

    def __repr__(self):
        return f"{self.name}"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    path = db.Column(db.String(100), nullable=False, unique=True)
    create_time = db.Column(
        db.String(50),
        nullable=False)


class DatabaseLog(db.Model):
    __tablename__ = 'database_logs'
    __description__ = '日志记录'
    id = db.Column(db.Integer, primary_key=True)
    operation = db.Column(db.String(10), nullable=False)
    target = db.Column(db.String(30), nullable=False)
    record_value = db.Column(db.String(800), nullable=False)
    timestamp = db.Column(
        db.String(50),
        nullable=False)

    def to_dict(self):
        return {c.name: getattr(self, c.name, None)
                for c in self.__table__.columns}

    def __init__(self, model, operation):
        self.operation = operation
        self.target = model.__description__
        self.timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        # self.record_value = model.__dict__
        # record = model.__dict__
        record = model.to_dict()
        if "_sa_instance_state" in record:
            record.pop("_sa_instance_state")
        # a={'video_id': 5, 'publish_time': '2023-12-25 18:59:19', 'content': '1', 'parent_id': None, 'id': 6,
        # 'author_id': 5, 'comment_liked': [1], 'replies': [], 'parent': None} print(json.dumps(a,
        # ensure_ascii=False)) a = json.loads(str(record))
        self.record_value = json.dumps(record, ensure_ascii=False)
        # self.record_value = str(record)
        # print(json.dumps(record))
        # self.record_value = str(model2dict([model])[0])


def load_init_data():
    """
        This load initial data function

        Add test data to the database
    """
    # id = db.Column(db.Integer, primary_key=True)
    # username = db.Column(db.String(100), nullable=False)
    # nickname = db.Column(db.String(100), default="未命名用户")
    # avatar = db.Column(db.String(100), default="未命名用户")
    # gender = db.Column(db.String(10), nullable=False)
    # register_time = db.Column(
    #     db.String(50),
    #     nullable=False,
    #     default=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    db.session.add_all([
        User({
            'id': 1,
            'nickname': '19岁带饭冲锋🌈',
            'area': '四川',
            'email': "1@test.com",
            'avatar': PREFIX_URL + 'static/user/avatars/1.jpeg',
            'gender': 'male',
            'age': 20,
            'password': '123456',
            'signature': "心之所向，便是阳光 🌈\n喜欢摄影、唱歌，@向阳花木👈\n谢谢你长得这么好看还关注我❤️",
            'register_time': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        }), User({
            'id': 2,
            'nickname': '鹿非🌈',
            'area': '重庆',
            'email': "2@test.com",
            'avatar': PREFIX_URL + 'static/user/avatars/2.jpeg',
            'gender': 'male',
            'register_time': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        }), User({
            'id': 3,
            'nickname': '活着就不算坏',
            'area': '重庆',
            'email': "3@test.com",
            'avatar': PREFIX_URL + 'static/user/avatars/3.jpeg',
            'gender': 'male',
            'register_time': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        }), User({
            'id': 4,
            'nickname': '浅梦',
            'area': '浙江',
            'email': "4@test.com",
            'avatar': PREFIX_URL + 'static/user/avatars/4.jpeg',
            'gender': 'male',
            'register_time': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
    ])

    videos = [{'id': 1,
               'title': '电子科技大学，4个计算机男生，毕业4年后现状',
               'author_id': 1,
               'url': PREFIX_URL + 'static/videos/3.mp4',
               'cover': PREFIX_URL + 'static/videos/covers/3.jpeg',
               'width': 1280,
               'height': 720,
               'publish_time': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
               'status': "online"},
              {'id': 2,
               'title': '亿万富翁找回儿子',
               'author_id': 4,
               'url': PREFIX_URL + 'static/videos/1.mp4',
               'cover': PREFIX_URL + 'static/videos/covers/1.png',
               'width': 1080,
               'height': 1920,
               'publish_time': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
               'status': "online"},
              {'id': 3,
               'title': '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
               'author_id': 2,
               'url': PREFIX_URL + 'static/videos/2.mp4',
               'cover': PREFIX_URL + 'static/videos/covers/2.jpeg',
               'width': 1024,
               'height': 576,
               'publish_time': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
               'status': "awaitApproval"},
              {'id': 4,
               'title': '19岁带饭冲锋🌈的作品',
               'author_id': 1,
               'url': PREFIX_URL + 'static/videos/2.mp4',
               'cover': PREFIX_URL + 'static/videos/covers/2.jpeg',
               'width': 1024,
               'height': 576,
               'publish_time': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
               'status': "offline"},
              {'id': 5,
               'title': '带东北同学第一次逛成都犀浦夜市！！ 好多没见过的美食！',
               'author_id': 1,
               'url': PREFIX_URL + 'static/videos/4.mp4',
               'cover': PREFIX_URL + 'static/videos/covers/4.jpg',
               'width': 1024,
               'height': 576,
               'publish_time': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
               'status': "online"},
              {'id': 6,
               'title': '如果你只有手机，但是你想用手机拍出电影感视频，那么你就要看完这个教程',
               'author_id': 1,
               'url': 'http://127.0.0.1:5000/static/videos/knowledge-1.mp4',
               'cover': 'http://127.0.0.1:5000/static/videos/covers/knowledge-1.jpg',
               'width': 1024,
               'height': 576,
               'publish_time': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
               'status': 'online'}]

    def get_video(params):
        return Video(params)

    db.session.add_all(list(map(get_video, videos)))

    db.session.add_all(
        [
            VTag({'id': 1, 'name': '计算机'}),
            VTag({'id': 2, 'name': '电子科技大学'}),
            VTag({'id': 3, 'name': '程序员'}),
            VTag({'id': 4, 'name': '求职'}),
            VTag({'id': 5, 'name': '职业规划'}),
            VTag({'id': 6, 'name': '美食'}),
            VTag({'id': 7, 'name': 'vlog日常'}),
            VTag({'id': 8, 'name': '成都夜市'}),
            VTag({'id': 9, 'name': '犀浦夜市'}),
            VTag({'id': 10, 'name': '成都'}),
            VTag({'id': 11, 'name': '知识'}),
            VTag({'id': 12, 'name': '热点'}),
            VTag({'id': 13, 'name': '游戏'}),
            VTag({'id': 14, 'name': '娱乐'}),
            VTag({'id': 15, 'name': '二次元'}),
            VTag({'id': 16, 'name': '音乐'}),
            VTag({'id': 17, 'name': '美食'}),
            VTag({'id': 18, 'name': '体育'}),
            VTag({'id': 19, 'name': '时尚'}),
            VTag({'id': 20, 'name': '拍摄技巧'}),
            VTag({'id': 21, 'name': '干货分享'}),
            VTag({'id': 22, 'name': '电影感'}),
            VTag({'id': 23, 'name': '剪辑'}),
        ]
    )

    db.session.add_all([
        Comment({
            'id': 1,
            'video_id': 1,
            'author_id': 1,
            'content': '加油加油，争取保研！',
            'publish_time': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}),
        Comment({
            'id': 2,
            'video_id': 1,
            'author_id': 2,
            'content': '加油！😍',
            'parent_id': 1,
            'publish_time': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}),
        Comment({
            'id': 3,
            'video_id': 1,
            'author_id': 3,
            'content': '我好喜欢',
            'publish_time': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}),
        Comment({
            'id': 4,
            'video_id': 1,
            'author_id': 1,
            'content': '我也好喜欢',
            'parent_id': 3,
            'publish_time': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            # 'publish_time': datetime.datetime(2023,
            #                                   10,
            #                                   2,
            #                                   21,
            #                                   50,
            # 16).strftime('%Y-%m-%d %H:%M:%S')
        }),
    ])
    db.session.flush()
    db.session.commit()
    db.session.add_all(
        [
            VTRelation({'video_id': 1, 'tag_id': 1}),
            VTRelation({'video_id': 1, 'tag_id': 2}),
            VTRelation({'video_id': 1, 'tag_id': 3}),
            VTRelation({'video_id': 1, 'tag_id': 4}),
            VTRelation({'video_id': 1, 'tag_id': 5}),
            VTRelation({'video_id': 5, 'tag_id': 6}),
            VTRelation({'video_id': 5, 'tag_id': 7}),
            VTRelation({'video_id': 5, 'tag_id': 8}),
            VTRelation({'video_id': 5, 'tag_id': 9}),
            VTRelation({'video_id': 1, 'tag_id': 10}),
            VTRelation({'video_id': 5, 'tag_id': 10}),
            VTRelation({'video_id': 6, 'tag_id': 11}),
            VTRelation({'video_id': 6, 'tag_id': 20}),
            VTRelation({'video_id': 6, 'tag_id': 21}),
            VTRelation({'video_id': 6, 'tag_id': 22}),
            VTRelation({'video_id': 6, 'tag_id': 23}),
        ]
    )
    db.session.flush()
    db.session.commit()

    # user = User.query.get(1)
    # user.nickname="1"
    # db.session.commit()
    # def get_parameters(query):
    #     if len(query.parameters)>1:
    #         print(query.parameters)
    #     return len(query.parameters)
    #
    # print(list(map(get_parameters, queries)))
