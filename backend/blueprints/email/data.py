import datetime
import random

from flask import request
from sqlalchemy import event

from blueprints.email import email_bp
from exts import AjaxResponse, db, mail, scheduler
from models import Comment, model2dict, User, Video, VideoLike, CommentLike, Register

from flask_mail import Message


@email_bp.route('/send', methods=['POST'])
def send_mail():
    # 清除可能因系统故障导致的记录冗余
    five_minutes_ago = datetime.datetime.now() - datetime.timedelta(minutes=2)
    records_to_delete = Register.query.filter(
        Register.code_timestamp <= five_minutes_ago).all()
    for record in records_to_delete:
        db.session.delete(record)
    db.session.commit()

    email = request.args.get("email")
    if email is None:
        return AjaxResponse.error("参数缺失：email")
    msg = Message("[点映] 账号验证",
                  sender="517941374@qq.com",
                  recipients=[email])
    random_code = random.randint(100000, 999999)
    db.session.add(
        Register(email=email, code=random_code, code_timestamp=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
    db.session.commit()
    target = User.query.filter_by(email=email).first()
    if target is None:
        # 用户注册邮件
        msg.body = f'您正在注册点映，验证码为: {random_code}。\n2分钟内有效。如非本人操作请忽略。'
        pass
    else:
        # 用户登录邮件
        # target.code_timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        # target.verification_code = random_code
        msg.body = f'您正在登录点映，验证码为: {random_code}。\n2分钟内有效。如非本人操作请忽略。'
    mail.send(msg)
    return AjaxResponse.success(None, "验证码发送成功")


@email_bp.route('/validate', methods=['POST'])
def validate_email():
    email = request.args.get("email")
    code = request.args.get("code")
    print(code)
    if email is None or code is None:
        return AjaxResponse.error("参数缺失：email, code")
    all_records = Register.query.filter_by(email=email).all()
    for record in all_records:
        # 有匹配记录
        if record.code == code:
            db.session.delete(record)
            db.session.commit()
            target = User.query.filter_by(email=email).first()
            if target is None:
                # 用户注册
                new_user = User({"email": email,"register_time":datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')})
                db.session.add(new_user)
                db.session.flush()
                new_id = new_user.id
                db.session.commit()
                return AjaxResponse.success({'id': new_id, 'isNew': True})
            # 用户注册登录
            return AjaxResponse.success({'id': target.id, 'isNew': False})
    # 无匹配记录
    return AjaxResponse.error("验证码错误")
