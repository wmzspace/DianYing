# 导入所需包
from apscheduler.schedulers.background import BackgroundScheduler
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy

# 导出 SQLAlchemy db
db: SQLAlchemy = SQLAlchemy()
mail = Mail()

# 初始化定时任务
# scheduler = BackgroundScheduler()
scheduler = BackgroundScheduler()


class AjaxResponse:
    """
        This is a class for AjaxResponse

        This class contain
        general attributes of transaction type and some response functions

        Attributes:
                ajax_data:  	An object of ajax response's data
                ajax_msg:  	    A string of ajax response's message
                ajax_ok:  	    A bool of ajax response's status
    """
    ajax_data: object
    ajax_msg: str
    ajax_ok: bool

    def __init__(self, data, msg, ok):
        """
            initialize AjaxResponse class, all attributes pass in with independent params

            Input contain independent params

            Args:
                    data(object)      : response object
                    msg(str)          : response message
                    ok(bool)          : response status, true for success. false for failed
        """
        self.ajax_data = data
        self.ajax_msg = msg
        self.ajax_ok = ok

    @staticmethod
    def success(ajax_data=None, ajax_msg="") -> tuple:
        """
            This is ajax success function

            Handle success of ajax response

            Args:
                    ajax_data(object)      : response object
                    ajax_msg(str)          : response message

            Returns:
                tuple of AjaxResponse and HTTP status code
        """
        if ajax_data is None:
            ajax_data = {}
        return AjaxResponse(ajax_data, ajax_msg, True).__dict__, 200

    @staticmethod
    def error(ajax_msg="") -> tuple:
        """
            This is ajax error function

            Handle error of ajax response

            Args:
                    ajax_msg(str)          : response message

            Returns:
                tuple of AjaxResponse and HTTP status code
        """
        return AjaxResponse(None, ajax_msg, False).__dict__, 200
