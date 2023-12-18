#!/usr/bin/env python
import os

import click
from apscheduler.schedulers.blocking import BlockingScheduler
from flask import render_template, Flask
from flask_mail import Mail, Message

import models
from blueprints.comment import comment_bp
from blueprints.email import email_bp
from blueprints.tag import tag_bp
from blueprints.video import video_bp
from models import *
from blueprints.user import user_bp
from config import config
from exts import db, mail, scheduler

# from flask_script import Manager, Shell

# from flask.ext.migrate import Migrate, MigrateCommand

config_name = os.getenv('FLASK_CONFIG') or 'default'
app = Flask(__name__)
app.register_blueprint(user_bp)
app.register_blueprint(video_bp)
app.register_blueprint(comment_bp)
app.register_blueprint(email_bp)
app.register_blueprint(tag_bp)
# app.register_blueprint(api.get)
# app.register_blueprint(api.delete)
# app.register_blueprint(api.update)
# app.register_blueprint(api.add)
# app.register_blueprint(api.database)

app.config.from_object(config[config_name])  # 可以直接把对象里面的配置数据转换到app.config里面
# app.json.ensure_ascii = False  # 解决中文乱码问题
# app.config['JSON_AS_ASCII'] = False  # 解决中文乱码问题
config[config_name].init_app(app)
# page.encoding='utf-8'
# bootstrap.app_init(app)
# mail.init_app(app)
# moment.init_app(app)
# MAIL_SERVER = 'smtp.qq.email'
# MAIL_PORT = 465
# MAIL_USE_SSL = True
# MAIL_USERNAME = '517941374@qq.com'
# MAIL_PASSWORD = 'jfdhqbglogcubihe'
# app.config['MAIL_SERVER'] = 'smtp.qq.email'
# app.config['MAIL_PORT'] = '465'
# app.config['MAIL_USERNAME'] = '517941374@qq.com'
# app.config['MAIL_PASSWORD'] = 'jfdhqbglogcubihe'
#
# # 启用/禁用传输安全层加密
# app.config['MAIL_USE_TLS'] = False
# # 启用/禁用安全套接字层加密
# app.config['MAIL_USE_SSL'] = True
# app.config.update(MAIL_SERVER='smtp.qq.com',
#                   MAIL_PORT='465',
#                   MAIL_USE_SSL=True,
#                   MAIL_USERNAME='517941374',  # 使用qq，不是邮箱
#                   MAIL_PASSWORD='jfdhqbglogcubihe')  # config配置
# mail = Mail(app)

mail.init_app(app)
db.init_app(app)
scheduler.start()


# 路由和其他处理程序定义
# ...

@app.route("/")
def api_index():
    """
    API Document

        Author: Mianzi Wu

        Last Update: 2023-10-25

        URL: http://127.0.0.1:5000
    """
    return render_template("index.html")


# manager = Manager(app)


# migrate = Migrate(app, db)


# 新设备需执行以下任意命令以建表
@app.cli.command('db-init')
def db_init():
    """数据库建表/格式化"""
    db.drop_all()
    db.create_all()

    # models.load_type_data()
    click.echo("已清空并初始化数据库")


@app.cli.command('db-load')
def db_load():
    """数据库建表/格式化，并载入初始数据"""
    db.drop_all()
    db.create_all()
    models.load_init_data()
    db.session.commit()
    click.echo("成功载入初始数据")


@app.cli.command('db-drop')
def db_init():
    """数据库建表/格式化"""
    db.drop_all()
    click.echo("已清空数据库")


@app.cli.command('db-test')
def db_init():
    """数据库建表/格式化"""
    # db.drop_all()
    # click.echo("已清空数据库")
    comment = Comment.query.get(2)
    print(comment.replies)
    print(comment.parent)
    # print(test.author.videos)
    # test = Video.query.filter_by(author_id=1).count()
    # print(test)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    # app.run(debug=True)
