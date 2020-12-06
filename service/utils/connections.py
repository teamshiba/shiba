"""
Initialize db collection reference.
"""

from google.cloud.firestore import CollectionReference

from utils import config_g

ref_users: CollectionReference = config_g.db.collection(u'Users')
ref_groups: CollectionReference = config_g.db.collection(u'Groups')
ref_votes: CollectionReference = config_g.db.collection(u'Votings')
ref_items: CollectionReference = config_g.db.collection("Items")
