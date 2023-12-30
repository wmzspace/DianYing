import datetime
import os
import random

from flask import request
from sqlalchemy import event

from blueprints.database import database_bp
from exts import AjaxResponse, db, mail, scheduler
from models import Comment, model2dict, User, Video, VideoLike, CommentLike, Register, DatabaseBackup, load_init_data, \
    DatabaseLog, VTag

from flask_mail import Message


@database_bp.route('/get/backup', methods=['GET'])
def get_backup():
    backup = DatabaseBackup.query.all()
    return model2dict(backup), 200


@database_bp.route('/force/rollback', methods=['GET', 'POST'])
def force_rollback():
    users = User.query.all()
    for user in users:
        db.session.delete(user)
    tags = VTag.query.all()
    for tag in tags:
        db.session.delete(tag)
    db.session.flush()
    db.session.commit()
    return AjaxResponse.success(None, "已重置数据库")


@database_bp.route("/rollback", methods=["GET", 'POST'])
def load_data():
    name = request.args.get("name")
    if name is None:
        return AjaxResponse.error("参数缺失: name")

    query_exist = DatabaseBackup.query.filter_by(name=name).first()
    if query_exist is None:
        return AjaxResponse.error("该还原点不存在")
    path = query_exist.path
    if path != f"~/web2_cwk2/backup-{name}.sql":
        return AjaxResponse.error("备份文件名称不匹配，请联系相关技术人员")
    rollback_cli = f"mysql -uroot -pwmz030907 -h127.0.0.1 web2_cwk2 --default-character-set=utf8mb4 < {path}"
    result = os.system(rollback_cli)
    if result == 0:
        return AjaxResponse.success(result, f"成功还原数据库，还原点:{name}")
    else:
        return AjaxResponse.error(f"还原失败：错误码{result}")


@database_bp.route("/create", methods=["GET", 'POST'])
def backup_data():
    name = request.args.get("name")
    if name is None:
        return AjaxResponse.error("参数缺失: name")
    path = f"~/web2_cwk2/backup-{name}.sql"
    backup_cli = (f"mysqldump -uroot -pwmz030907 --host=127.0.0.1 --port=3306 --databases web2_cwk2 "
                  f"--ignore-table=web2_cwk2.database_backup --ignore-table=web2_cwk2.registers "
                  f"--default-character-set=utf8mb4 > {path}")
    result = os.system(backup_cli)

    if result == 0:
        query_exist = DatabaseBackup.query.filter_by(name=name).first()
        if query_exist is not None:
            query_exist.create_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            db.session.flush()
            db.session.commit()
            return AjaxResponse.success(result, f"成功覆盖还原点'{query_exist.name}'")
        new_backup_record = DatabaseBackup(
            name=name, path=path, create_time=datetime.datetime.strftime(
                datetime.datetime.now(), "%Y-%m-%d %H:%M:%S"))
        db.session.add(new_backup_record)
        db.session.flush()
        db.session.commit()
        return AjaxResponse.success(result, f"成功添加还原点'{name}'")
    else:
        if result in [256, 512]:
            return AjaxResponse.error(f"备份失败, 错误码{result}: 请确保名称不含非法字符")
        return AjaxResponse.error(f"备份失败：错误码{result}")


@database_bp.route("/delete", methods=["GET", 'POST'])
def delete_data():
    name = request.args.get("name")
    if name is None:
        return AjaxResponse.error("参数缺失: name")
    query_exist = DatabaseBackup.query.filter_by(name=name).first()
    if query_exist is not None:
        print(name)
        if "__protect__" in name:
            return AjaxResponse.error("该还原点禁止删除")
        path = query_exist.path
        result = os.system(f"rm {path}")
        db.session.delete(query_exist)
        db.session.flush()
        db.session.commit()
        return AjaxResponse.success(result, f"成功删除还原点'{query_exist.name}'")
    else:
        return AjaxResponse.error("该还原点不存在")


# API: 获取数据库日志
@database_bp.route("/logs", methods=["GET"])
def get_logs():
    logs = DatabaseLog.query.all()
    return model2dict(logs), 200


# API: 清空数据库日志
@database_bp.route("/delete/logs", methods=["POST"])
def delete_logs():
    DatabaseLog.query.delete()
    db.session.commit()
    return AjaxResponse.success(None,"日志已清空")
