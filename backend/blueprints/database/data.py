import datetime
import os
import random

from flask import request
from sqlalchemy import event

from blueprints.database import database_bp
from exts import AjaxResponse, db, mail, scheduler
from models import Comment, model2dict, User, Video, VideoLike, CommentLike, Register, DatabaseBackup

from flask_mail import Message


@database_bp.route('/get/backup', methods=['GET'])
def get_backup():
    backup = DatabaseBackup.query.all()
    return model2dict(backup), 200


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
    rollback_cli = f"mysql -uroot -proot web2_cwk2 < {path}"
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
    backup_cli = f"mysqldump -uroot -proot --host=127.0.0.1 --port=3306 --databases web2_cwk2 > {path}"
    result = os.system(backup_cli)

    if result == 0:
        query_exist = DatabaseBackup.query.filter_by(name=name).first()
        if query_exist is not None:
            return AjaxResponse.success(result, f"成功覆盖还原点'{query_exist.name}'")
        new_backup_record = DatabaseBackup(
            name=name, path=path, create_time=datetime.datetime.strftime(
                datetime.datetime.now(), "%Y-%m-%d %H:%M:%S"))
        db.session.add(new_backup_record)
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
        path = query_exist.path
        result = os.system(f"rm {path}")
        print(result)
        db.session.delete(query_exist)
        db.session.commit()
        return AjaxResponse.success(result, f"成功删除还原点'{query_exist.name}'")
    else:
        return AjaxResponse.error("该还原点不存在")
    # if result == 0:
    #     query_exist = DatabaseBackup.query.filter_by(name=name).first()
    #     if query_exist is not None:
    #         return AjaxResponse.success(result, f"成功覆盖还原点'{query_exist.name}'")
    #     new_backup_record = DatabaseBackup(name=name, path=path)
    #     db.session.add(new_backup_record)
    #     db.session.commit()
    #     return AjaxResponse.success(result, f"成功添加还原点'{name}'")
    # else:
    #     return AjaxResponse.error(f"备份失败：错误码{result}")
