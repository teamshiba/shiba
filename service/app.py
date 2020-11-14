from flask import Flask
from room.routes import room


def create_app():
    _app = Flask(__name__)

    _app.register_blueprint(room)

    return _app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
