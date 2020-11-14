from flask import Flask
from room.routes import room
from werkzeug.exceptions import HTTPException
from utils.exceptions import handle_http_exception

def create_app():
    _app = Flask(__name__)

    _app.register_blueprint(room)
    _app.register_error_handler(HTTPException, handle_http_exception)

    return _app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
