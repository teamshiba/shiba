"""Item API"""
from flask import Blueprint, request

from models.group import Group
from models.item import filter_items, Item, db_add_item
from utils.decorators import check_token
from utils.exceptions import (InvalidQueryParams, InvalidRequestBody,
                              DataModelException, UnauthorizedRequest)
from utils.external import yelp_search_biz

router_item = Blueprint('item', __name__)


# GET /api/item/list
@router_item.route('/item/list', methods=['GET'])
@check_token
def get_group_item_list(auth_uid=None):
    """
    Get a list of items in the group.
    :param auth_uid:
    :return:
    """
    params: dict = request.args.to_dict()
    gid = params.get("gid") or params.get("group_id")
    if gid is None:
        raise InvalidQueryParams('gid is required.')
    role = Group.validate_user_role(auth_uid, gid)
    if role < 1:
        raise UnauthorizedRequest.error_no_membership()
    try:
        return filter_items(params)
    except DataModelException as error:
        raise InvalidQueryParams(error.description) from error


# POST /api/item
@router_item.route('/item', methods=['POST', 'PUT'])
@check_token
def add_item(auth_uid=None):
    """
    Adding an item to a group.
    :param auth_uid:
    :return:
    """
    request_body: dict = request.get_json()
    group_id = request_body.get('groupId')
    item = request_body.get("item")
    if item is None:
        raise InvalidRequestBody.raise_key_error("item")
    data = Item.from_dict(item)
    _ = db_add_item(data)

    if group_id is not None:
        Group.append_item_list(uid=auth_uid, group_id=group_id, item_id=data.item_id)
    return {
        "msg": "success"
    }


@router_item.route('/item/search', methods=['GET'])
@check_token
def search_item(auth_uid=None):
    """Yelp API: business search"""
    if not auth_uid:
        raise UnauthorizedRequest()
    params: dict = request.args.to_dict()
    location = params.get('location')
    latitude = params.get('latitude')
    longitude = params.get('longitude')
    term = params.get('term')
    try:
        resp = yelp_search_biz(location=location,
                               latitude=latitude,
                               longitude=longitude,
                               term=term,
                               url_params=params)
        if 'businesses' not in resp:
            return {
                'msg': 'Unexpected response from Yelp API.'
            }, 500
        for item in resp['businesses']:
            item['itemURL'] = item['url']
            item['imgURL'] = item['image_url']
        return resp
    except KeyError as e:
        return {
            'msg': 'In response key not found: ' + str(e)
        }, 500
    except ValueError as e:
        raise InvalidQueryParams(str(e)) from e
