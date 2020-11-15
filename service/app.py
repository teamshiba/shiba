from flask import Flask
from room.routes import room
from routes.voting import voting
from werkzeug.exceptions import HTTPException
from utils.exceptions import handle_http_exception


def create_app():
    _app = Flask(__name__)

    _app.register_blueprint(room)
    _app.register_blueprint(voting)
    _app.register_error_handler(HTTPException, handle_http_exception)

    return _app

# This line must be outside of `if __name__ == "__main__"` so that
# gunicorn can use ita
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
