from functools import wraps

import firebase_admin
from firebase_admin import auth
from firebase_admin.auth import ExpiredIdTokenError, RevokedIdTokenError, InvalidIdTokenError
from flask import request

from utils import config_g
from utils.exceptions import LoginRequired


def check_token(f):
    """
    Authorization information extractor.
    :param f: request handler.
    :return:
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        """wrapping the function `f`."""
        auth_token = request.headers.get('Authorization')
        if auth_token is None or not auth_token.startswith("Bearer"):
            raise LoginRequired('No auth token provided')
        try:
            _, token_body = auth_token.split()
            # if 'is_testing' in g or 'is_testing' in session:
            if config_g.is_testing:
                user = {'user_id': token_body}
            else:
                user = auth.verify_id_token(id_token=token_body,
                                            app=firebase_admin.get_app('Shiba'))
        except (ValueError, IndexError, InvalidIdTokenError) as e:
            # TODO fix custom token created by firebase_admin is still invalid "id token"
            raise LoginRequired('Invalid token provided: {}'.format(e))
        except (ExpiredIdTokenError, RevokedIdTokenError) as e:
            raise LoginRequired('Expired token provided: {}'.format(e))
        kwargs.update({"auth_uid": user["user_id"]})
        return f(*args, **kwargs)

    return wrap
