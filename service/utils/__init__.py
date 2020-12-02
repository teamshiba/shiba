"""
app initialization.
"""
from flask import Flask
from werkzeug.exceptions import HTTPException

from utils.db import init_db

db = None


# pylint: disable=too-few-public-methods
class Config:
    """Global configuration object."""
    is_testing: bool = False


config_g = Config()


def create_app(test_mode=False):
    """
    Initialize the Flask app.
    :param test_mode: where it's run from Pytest.
    :return:
    """
    _app = Flask(__name__)
    # pylint: disable=global-statement
    global db
    if test_mode:
        db = init_db('fbConfigs_test.json')
        config_g.is_testing = True
        # with _app.app_context():
        #     g.is_testing = True
        #     session['is_testing'] = True
    else:
        db = init_db('fbConfigs.json')

    from routes.room import room
    from routes.voting import voting
    from routes.item import router_item
    from utils.exceptions import handle_http_exception

    _app.register_blueprint(room)
    _app.register_blueprint(voting)
    _app.register_blueprint(router_item)
    _app.register_error_handler(HTTPException, handle_http_exception)

    return _app


def format_headers(token=""):
    """Format a HTTP request header with the auth information."""
    return {
        'Authorization': 'Bearer {}'.format(token)
    }
