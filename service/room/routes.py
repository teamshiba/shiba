from flask import Blueprint
from service import db

room = Blueprint('room', __name__)

user_ref = db.collection(u'Users')
group_ref = db.collection(u'Groups')


@room.route('/room/list', methods=['GET'])
def get_group_list():
    pass


@room.route('/room', methods=['POST'])
def create_group():
    pass


@room.route('/room', methods=['GET'])
def get_group_profile():
    pass


@room.route('/room', methods=['PUT'])
def update_group_profile():
    pass


@room.route('/room/join', methods=['PUT'])
def update_group_profile():
    pass
