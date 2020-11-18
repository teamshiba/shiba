from flask import Blueprint, request

from models.connections import ref_items
from models.item import filter_items
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
# TODO fix
@router_item.route('/item')
def add_item():
    request_body: dict = request.get_json()
    item_id = request_body.get("itemId")
    if item_id is None:
        raise InvalidRequestBody("itemId is required.")
    resp = ref_items.document(item_id).set(request_body)
    return {
        "resp": resp
    }
