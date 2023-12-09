#!/usr/bin/env python
import os

import click
from flask import render_template, Flask

import models
from blueprints.comment import comment_bp
from blueprints.video import video_bp
from models import *
from blueprints.user import user_bp
from config import config
from exts import db

# from flask_script import Manager, Shell

# from flask.ext.migrate import Migrate, MigrateCommand

config_name = os.getenv('FLASK_CONFIG') or 'default'
app = Flask(__name__)
app.register_blueprint(user_bp)
app.register_blueprint(video_bp)
app.register_blueprint(comment_bp)
# app.register_blueprint(api.get)
# app.register_blueprint(api.delete)
# app.register_blueprint(api.update)
# app.register_blueprint(api.add)
# app.register_blueprint(api.database)

app.config.from_object(config[config_name])  # 可以直接把对象里面的配置数据转换到app.config里面
config[config_name].init_app(app)

# bootstrap.app_init(app)
# mail.init_app(app)
# moment.init_app(app)
db.init_app(app)


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


@app.cli.command('test')
def db_load():
    """数据库建表/格式化，并载入初始数据"""
    users = User.query.all()
    for user in users:
        print(user.videos)


if __name__ == '__main__':
    app.run()
