import firebase_admin
from firebase_admin import credentials, firestore


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
    db = firestore.client(app)
    return db

