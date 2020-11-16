from werkzeug.exceptions import HTTPException
import json


class InvalidQueryParams(HTTPException):
    def __init__(self, desc=""):
        self.code = 400
        self.description = desc


class InvalidRequestBody(HTTPException):
    def __init__(self, desc=""):
        self.code = 400
        self.description = desc


class InvalidRequestHeader(HTTPException):
    def __init__(self, desc=""):
        self.code = 400
        self.description = desc


class UnauthorizedRequest(HTTPException):
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
    response = e.get_response()
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "msg": e.description
    })
    response.content_type = "application/json"
    return response, e.code
