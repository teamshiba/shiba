"""
Initialize db collection reference.
"""

from google.cloud.firestore import CollectionReference

from utils import db

ref_users: CollectionReference = db.collection(u'Users')
ref_groups: CollectionReference = db.collection(u'Groups')
ref_votes: CollectionReference = db.collection(u'Votings')
ref_items: CollectionReference = db.collection("Items")
