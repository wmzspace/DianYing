from flask import request

from blueprints.user import user_bp
from exts import AjaxResponse, db
from models import User, model2dict


# API: 用户注册/登录
@user_bp.route('/login/pwd', methods=['GET', 'POST'])
def user_pwd_login():
    email = request.args.get("email")
    pwd = request.args.get("pwd")

    if email is None or pwd is None:
        return AjaxResponse.error("参数缺失：需要 email, pwd")
    target = User.query.filter_by(email=email).first()
    if target is None:
        return AjaxResponse.error("用户不存在")
    password = target.password
    if password is None:
        return AjaxResponse.error("账号未设置密码登录方式")
    if password != pwd:
        return AjaxResponse.error("密码错误，请重新输入")

    return AjaxResponse.success(model2dict([target])[0], f"登录成功: {target.nickname}")


# API: 用户注销
@user_bp.route('/delete', methods=['POST'])
def user_delete():
    id = request.args.get("id")
    if id is None:
        return AjaxResponse.error("参数缺失: id")
    target = User.query.filter_by(id=id).first()
    if target is None:
        return AjaxResponse.error("用户不存在")
    nickname = target.nickname
    db.session.delete(target)
    db.session.commit()
    return AjaxResponse.success(None, f" 用户{nickname}({id})已注销")
