from werkzeug.exceptions import HTTPException
from typing import Union


class InvalidQueryParams(HTTPException):
    def __init__(self, desc=""):
        self.code = 400
        self.description = desc


class InvalidRequestBody(HTTPException):
    def __init__(self, desc=""):
        self.code = 400
        self.description = desc

    @staticmethod
    def raise_key_error(e: Union[KeyError, str] = None):
        raise InvalidRequestBody(
            "Field '{}' is required.".format(e.args[0] if type(e) is KeyError else e)
        )


class InvalidRequestHeader(HTTPException):
    def __init__(self, desc=""):
        self.code = 400
        self.description = desc


class UnauthorizedRequest(HTTPException):
    def __init__(self, desc=""):
        self.code = 403
        self.description = desc

    @staticmethod
    def raise_no_membership():
        raise UnauthorizedRequest('Not a member of target matching group.')


class LoginRequired(HTTPException):
    def __init__(self, desc=""):
        self.code = 401
        self.description = desc


class DataModelException(Exception):
    description: str = None

    def __init__(self, msg=""):
        super(DataModelException, self).__init__()
        self.description = msg

    def __repr__(self):
        return "<empty exception>" if self.description is None \
            else self.description


def handle_http_exception(e: HTTPException):
    """Return JSON instead of HTML for HTTP errors."""
    return {
        "code": e.code,
        "name": e.name,
        "msg": e.description
    }, e.code
