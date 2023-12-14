from flask import request

from blueprints.user import user_bp
from exts import AjaxResponse
from models import User, model2dict


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

    return AjaxResponse.success(model2dict([target])[0],f"登录成功: {target.nickname}")
