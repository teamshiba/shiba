from flask import Blueprint
from service import db

room = Blueprint('room', __name__)

user_ref = db.collection(u'Users')
group_ref = db.collection(u'Groups')


@room.route('/room/list', methods=['GET'])
def get_group_list():
    pass

