import firebase_admin
from firebase_admin import credentials, firestore


def init_db(config):
    """
    Initialize db
    :return: db
    """
    cred = credentials.Certificate(config)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    return db

