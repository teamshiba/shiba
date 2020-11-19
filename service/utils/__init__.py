import json

from flask import Flask
from google.cloud.firestore import CollectionReference
from werkzeug.exceptions import HTTPException

from utils.db import init_db

db = None


def create_app(test_mode=False):
    _app = Flask(__name__)
    global db
    if test_mode:
        db = init_db('fbConfigs_test.json')
    else:
        db = init_db('fbConfigs.json')

    from routes.room import room
    from routes.voting import voting
    from routes.item import router_item
    from utils.exceptions import handle_http_exception

    _app.register_blueprint(room)
    _app.register_blueprint(voting)
    _app.register_blueprint(router_item)
    _app.register_error_handler(HTTPException, handle_http_exception)

    return _app


def delete_collection(coll_ref: CollectionReference, batch_size=50):
    """
    Delete all documents in a collection.
    :param coll_ref:
    :param batch_size:
    :return:
    """
    docs = coll_ref.limit(batch_size).stream()
    deleted = 0

    for doc in docs:
        print(f'Deleting doc {doc.id} => {doc.to_dict()}')
        doc.reference.delete()
        deleted = deleted + 1

    if deleted >= batch_size:
        return delete_collection(coll_ref, batch_size)


def load_collection(coll_ref: CollectionReference,
                    data_path: str, id_key=None):
    """
    Add data to a collection from a json data file.
    :param coll_ref: reference object to a firebase collection.
    :param data_path:
    :param id_key:
    :return:
    """
    raw = json.loads(data_path)
    data = raw.get('data')
    for record in data:
        if id_key in record:
            coll_ref.document(record['id_key']).set(record)
        else:
            coll_ref.add(record)


def format_headers(token=""):
    return {
        'Authorization': 'Bearer {}'.format(token)}
