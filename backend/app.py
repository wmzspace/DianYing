import io
import os
import sys

import click
from flask import render_template, Flask
from flask_sqlalchemy.track_modifications import before_models_committed

import models
from blueprints.comment import comment_bp
from blueprints.database import database_bp
from blueprints.email import email_bp
from blueprints.tag import tag_bp
from blueprints.video import video_bp
from models import *
from blueprints.user import user_bp
from config import config
from exts import db, mail, scheduler

config_name = os.getenv('FLASK_CONFIG') or 'default'
app = Flask(__name__)
app.register_blueprint(user_bp)
app.register_blueprint(video_bp)
app.register_blueprint(comment_bp)
app.register_blueprint(email_bp)
app.register_blueprint(tag_bp)
app.register_blueprint(database_bp)

app.config.from_object(config[config_name])  # 可以直接把对象里面的配置数据转换到app.config里面
config[config_name].init_app(app)


# sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='utf8') #改变标准输出的默认编码
# sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='gb18030')

def on_before__models_committed(sender, changes):
    # 处理模型提交事件
    for change in changes:
        model = change[0]
        if model.__tablename__ != 'database_logs':
            operation = change[1]
            log = DatabaseLog(model, operation)
            db.session.add(log)


before_models_committed.connect(on_before__models_committed)

mail.init_app(app)
db.init_app(app)
scheduler.start()


# 路由和其他处理程序定义

@app.route("/")
def api_index():
    """
    API Document

        Author: Mianzi Wu

        Last Update: 2023-10-25

        URL: http://127.0.0.1:5000
    """
    return render_template("index.html")


@app.cli.command('db-init')
def db_init():
    """数据库建表/格式化"""
    db.drop_all()
    db.create_all()

    # models.load_type_data()
    click.echo("已清空并初始化数据库")


def db_load():
    """数据库建表/格式化，并载入初始数据"""
    db.drop_all()
    db.create_all()
    models.load_init_data()
    db.session.flush()
    db.session.commit()
    click.echo("成功载入初始数据")


@app.cli.command('db-load')
def api_db_load():
    db_load()


@app.cli.command('db-drop')
def db_init():
    """数据库建表/格式化"""
    db.drop_all()
    click.echo("已清空数据库")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    # app.run(debug=True)
