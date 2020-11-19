from flask_cors import CORS
from utils import create_app

# This line must be outside of `if __name__ == "__main__"` so that
# gunicorn can use it
app = create_app()

if __name__ == "__main__":
    # This is mainly for development, in the development environment
    # our frontend and backend reside on different hosts
    CORS(app)
    app.run(debug=True)
