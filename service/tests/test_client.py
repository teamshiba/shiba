from flask import Flask
from utils.exceptions import HTTPException, handle_http_exception
from routes.room import room
from routes.voting import voting


def create_app():
    _app = Flask(__name__)

    _app.register_blueprint(room)
    _app.register_blueprint(voting)
    _app.register_error_handler(HTTPException, handle_http_exception)

    return _app
