from flask import Blueprint, request

from models.group import Group
from models.item import filter_items, Item, db_add_item
from utils.decorators import check_token
from utils.exceptions import InvalidQueryParams, InvalidRequestBody, DataModelException

router_item = Blueprint('item', __name__)


# GET /api/item/list
@router_item.route('/item/list', methods=['GET'])
@check_token
def get_group_item_list(auth_uid=None):
    params: dict = request.args.to_dict()
    try:
        return filter_items(params)
    except DataModelException as e:
        raise InvalidQueryParams(e.description)


# POST /api/item
@router_item.route('/item', methods=['POST'])
def add_item(auth_uid=None):
    request_body: dict = request.get_json()
    group_id = request_body.get('groupId')
    item = request_body.get("item")
    if item is None:
        raise InvalidRequestBody.raise_key_error("item")
    data = Item.from_dict(item)
    _ = db_add_item(data)

    Group.append_item_list(uid=auth_uid, group_id=group_id, item_id=data.item_id)
    return {
        "msg": "success"
    }
