from functools import wraps
import firebase_admin
from firebase_admin import auth
from firebase_admin.auth import ExpiredIdTokenError, RevokedIdTokenError, InvalidIdTokenError
from flask import request

from utils.exceptions import LoginRequired


def check_token(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        auth_token = request.headers.get('Authorization')
        if auth_token is None or not auth_token.startswith("Bearer"):
            raise LoginRequired('No auth token provided')
        try:
            user = auth.verify_id_token(id_token=auth_token.split()[1], app=firebase_admin.get_app('Shiba'))
        except (ValueError, IndexError, InvalidIdTokenError, ExpiredIdTokenError, RevokedIdTokenError):
            raise LoginRequired('Invalid token provided')
        kwargs.update({"auth_uid": user["user_id"]})
        return f(*args, **kwargs)
    return wrap

