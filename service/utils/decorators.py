from functools import wraps

from firebase_admin import auth
from firebase_admin.auth import ExpiredIdTokenError, RevokedIdTokenError, InvalidIdTokenError
from flask import request

from utils.exceptions import UnauthorizedRequest


def check_token(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if not request.headers.get('id_token'):
            raise UnauthorizedRequest('No token provided')
        try:
            user = auth.verify_id_token(request.headers['id_token'])
        except (ValueError, AssertionError, InvalidIdTokenError, ExpiredIdTokenError, RevokedIdTokenError):
            raise UnauthorizedRequest('Invalid token provided')
        kwargs.update({"uid": user["user_id"]})
        return f(*args, **kwargs)
    return wrap

