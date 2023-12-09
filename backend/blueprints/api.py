# 导入所需包
import datetime

import click
from flask import Blueprint, request

import models
from exts import AjaxResponse, db
from models import Income, Expenditure, TxType, Goal, model2dict, Invoice

# 蓝图配置
get = Blueprint('get', __name__, url_prefix="/api/get")
database = Blueprint('database', __name__, url_prefix="/api/database")
update = Blueprint('update', __name__, url_prefix="/api/update")
add = Blueprint('add', __name__, url_prefix="/api/add")
delete = Blueprint('delete', __name__, url_prefix="/api/delete")


@get.route('/<model_name>')
def api_get_model(model_name=""):
    """处理GET请求，获取模型数据"""

    try:
        # 通过路由参数指定目标模型
        ref = {
            "income": Income,
            "expenditure": Expenditure,
            "txtype": TxType,
            "goal": Goal}
        model = ref.get(model_name)

        # 如果没有找到该模型
        if model is None:
            return AjaxResponse.error(f'No model named: {model_name}')

        # 返回数据
        result = model2dict(model.query.all())
        return AjaxResponse.success(result)

    except Exception as e:
        # 捕捉错误并反馈
        return AjaxResponse.error(str(e))


@update.route("/<invoice_group>/<int:invoice_id>", methods=['POST'])
def api_update_invoice(invoice_group, invoice_id):
    """处理POST请求，更新账单信息"""

    try:
        # 获取请求JSON数据
        body_json = request.get_json()

        # 验证数据完整性
        if not all(
                key in body_json for key in [
                    'id',
                    'name',
                    'amount',
                    'type',
                    'time']):
            raise Exception("数据异常")
        # 验证数据正确性
        if datetime.datetime.strptime(
                body_json['time'],
                '%Y-%m-%d %H:%M:%S') > datetime.datetime.now():
            raise Exception("不能选择之后的日期")

        # 通过路由参数指定模型为收入或支出
        invoice = (
            Income if invoice_group == 'income' else Expenditure).query.filter_by(
            id=invoice_id).first()

        # 如果账单类型改变
        if (body_json['type'] > 0 and invoice_group == 'expenditure'
                or body_json['type'] <= 0 and invoice_group == 'income'):
            # 添加对应类型的账单
            ajax_data = model2dict([Invoice.add_invoice(body_json)])[0]
            # 删除原账单
            db.session.delete(invoice)

        # 如果账单类型未改变
        else:
            # 修改账单
            invoice.update_invoice(body_json)
            ajax_data = model2dict([invoice])[0]

        # 提交修改至数据库并反馈
        db.session.commit()
        return AjaxResponse.success(ajax_data, "成功")

    except Exception as e:
        # 捕捉错误并反馈
        return AjaxResponse.error(str(e))


@update.route("/goal", methods=['POST'])
def api_update_goal():
    """处理POST请求，更新储蓄目标"""

    try:
        # 获取表单数据
        body_json = request.get_json()

        # 查询储蓄目标
        goal = Goal.query.first()

        # 为了保证有且只有一个储蓄目标，如果目标不存在
        if goal is None:
            # 创建并添加一个储蓄目标
            new_goal = Goal(name="储蓄目标", value=body_json['value'])
            db.session.add(new_goal)
        else:
            # 修改储蓄目标
            goal.name = body_json['name']
            goal.value = body_json['value']

        # 提交修改至数据库并反馈
        db.session.commit()
        return AjaxResponse.success(model2dict(Goal.query.all()), "储蓄目标更新成功")

    except Exception as e:
        # 捕捉错误并反馈
        return AjaxResponse.error(str(e))


@delete.route("/invoices", methods=['POST'])
def api_delete_invoice():
    """处理POST请求，删除账单记录"""

    try:
        # 获取表单数据
        body_json = request.get_json()

        # 获取用户请求删除的收入和支出列表，并执行删除操作
        incomes = body_json['incomes']
        expenditures = body_json['expenditures']
        for income in incomes:
            found_income = Income.query.filter_by(id=income).first()
            if found_income is not None:
                db.session.delete(found_income)
        for expenditure in expenditures:
            found_expenditure = Expenditure.query.filter_by(
                id=expenditure).first()
            if found_expenditure is not None:
                db.session.delete(found_expenditure)

        # 提交修改至数据库并反馈
        db.session.commit()
        return AjaxResponse.success(
            {}, f"删除了{len(incomes)}条收入和{len(expenditures)}条支出")

    except Exception as e:
        # 捕捉错误并反馈
        return AjaxResponse.error(str(e))


@add.route("/invoice", methods=['POST'])
def api_add_invoice():
    """处理POST请求，添加新账单记录"""

    try:
        # 获取表单数据
        body_json = request.get_json()

        # 添加账单记录
        invoice = Invoice.add_invoice(body_json)

        # 因为 db.session.commit() 之后会删除引用，所以需要备份
        ajax_data = model2dict([invoice])[0]

        # 提交修改至数据库并反馈
        db.session.commit()
        if 'name' in ajax_data:
            msg_data: str = ajax_data['name']
            if len(msg_data) > 10:
                msg_data = msg_data[:10] + "..."
        else:
            msg_data: str = '未命名'

        return AjaxResponse.success(
            ajax_data, f"成功添加记录：{msg_data}")

    except Exception as e:
        # 捕捉错误并反馈
        return AjaxResponse.error(str(e))


@add.route("/type", methods=['POST'])
def api_add_tx_type():
    """处理POST请求，添加新的账单分类"""

    try:
        # 获取表单数据
        body_json = request.get_json()

        # 验证数据完整性
        if 'type' not in body_json or 'name' not in body_json:
            return AjaxResponse.error("数据异常")

        # 添加账单分类
        tx_type = TxType.add_tx_type(body_json)

        # 备份引用
        ajax_data = model2dict([tx_type])[0]

        # 提交修改至数据库并反馈
        db.session.commit()
        return AjaxResponse.success(
            ajax_data, f"成功添加分类：{ajax_data['name'] if 'name' in ajax_data else '未命名'}")

    except Exception as e:
        # 捕捉错误并反馈
        return AjaxResponse.error(str(e))


@database.route('/drop', methods=['POST'])
def api_database_drop():
    """数据库建表/格式化"""

    try:
        db.drop_all()
        db.create_all()
        models.load_type_data()
        db.session.commit()
        click.echo("成功清空并初始化数据库")
        return AjaxResponse.success(None, "成功清空并初始化数据库")

    except Exception as e:
        # 捕捉错误并反馈
        return AjaxResponse.error(str(e))


@database.route('/init', methods=['POST'])
def api_database_init():
    """数据库建表/格式化，并载入初始数据"""

    try:
        db.drop_all()
        db.create_all()
        models.load_init_data()
        db.session.commit()
        click.echo("成功载入初始数据")
        return AjaxResponse.success(None, "成功载入初始数据")

    except Exception as e:
        # 捕捉错误并反馈
        return AjaxResponse.error(str(e))
