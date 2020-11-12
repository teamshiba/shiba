from flask import Flask
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate('fbConfig.json')
firebase = firebase_admin.initialize_app(cred)
db = firestore.client()


def create_app():
    app = Flask(__name__)

    from service.room.routes import room
    app.register_blueprint(room)

    return app
