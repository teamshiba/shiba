import firebase_admin
from firebase_admin import credentials, firestore


def init_db():
    """
    Initialize db
    :return: db
    """
    cred = credentials.Certificate('fbConfigs.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    return db

