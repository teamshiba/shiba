from flask import Flask
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
from routes.room import room
from routes.voting import voting
from utils.exceptions import handle_http_exception


def create_app():
    _app = Flask(__name__)

    _app.register_blueprint(room)
    _app.register_blueprint(voting)
    _app.register_error_handler(HTTPException, handle_http_exception)

    return _app


# This line must be outside of `if __name__ == "__main__"` so that
# gunicorn can use it
app = create_app()

if __name__ == "__main__":
    # This is mainly for development, in the development environment
    # our frontend and backend reside on different hosts
    CORS(app)
    app.run(debug=True)
