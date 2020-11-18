import json

import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore import CollectionReference

cred = credentials.Certificate('fbConfigs.json')
firebase = firebase_admin.initialize_app(cred)
db = firestore.client()


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
