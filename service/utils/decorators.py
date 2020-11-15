from functools import wraps
from firebase_admin import auth
from firebase_admin.auth import ExpiredIdTokenError, RevokedIdTokenError, InvalidIdTokenError
from flask import request


def check_token(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if not request.headers.get('id_token'):
            return {'message': 'No token provided'}
        try:
            user = auth.verify_id_token(request.headers['id_token'])
            user_id = request.args.get('uid')
            assert user_id == user["user_id"]
        except (ValueError, AssertionError, InvalidIdTokenError, ExpiredIdTokenError, RevokedIdTokenError):
            return {'message': 'Invalid token provided.'}
        return f(*args, **kwargs)
    return wrap
