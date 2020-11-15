from functools import wraps
from firebase_admin import auth
from firebase_admin.auth import ExpiredIdTokenError, RevokedIdTokenError, InvalidIdTokenError
from utils.exceptions import InvalidRequestHeader, UnauthorizedRequest
from flask import request


def check_token(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if not request.headers.get('id_token'):
            raise InvalidRequestHeader('No token provided')
        try:
            user = auth.verify_id_token(request.headers['id_token'])
        except (ValueError, AssertionError, InvalidIdTokenError, ExpiredIdTokenError, RevokedIdTokenError):
            raise UnauthorizedRequest('Invalid token provided')
        kwargs.update({"uid": user["user_id"]})
        return f(*args, **kwargs)
    return wrap

