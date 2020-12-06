"""Pipelines."""
import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask
from werkzeug.exceptions import HTTPException

from utils import config_g


def create_app(test_mode=False):
    """
    Initialize the Flask app.
    :param test_mode: where it's run from Pytest.
    :return:
    """
    _app = Flask(__name__)
    if test_mode:
        config_g.connect_db = init_db('fbConfigs_test.json')
        config_g.is_testing = True
    else:
        config_g.connect_db = init_db('fbConfigs.json')

    from routes.room import room
    from routes.voting import voting
    from routes.item import router_item
    from utils.exceptions import handle_http_exception

    _app.register_blueprint(room)
    _app.register_blueprint(voting)
    _app.register_blueprint(router_item)
    _app.register_error_handler(HTTPException, handle_http_exception)

    return _app


def init_db(config):
    """
    Initialize db
    :return: db
    """
    cred = credentials.Certificate(config)
    try:
        app = firebase_admin.get_app("Shiba")
    except ValueError:
        app = firebase_admin.initialize_app(cred, name="Shiba")
    database = firestore.client(app)
    return database
