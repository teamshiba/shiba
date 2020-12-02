"""Exceptions"""
from typing import Union
from werkzeug.exceptions import HTTPException


class InvalidQueryParams(HTTPException):
    """Invalid query parameters."""

    def __init__(self, desc=""):
        super().__init__()
        self.code = 400
        self.description = desc


class InvalidRequestBody(HTTPException):
    """Invalid request body."""

    def __init__(self, desc=""):
        super().__init__()
        self.code = 400
        self.description = desc

    @staticmethod
    # pylint: disable=unsubscriptable-object
    def raise_key_error(e: Union[KeyError, str] = None):
        """
        Helper function for raising key error.
        :param e:
        :return:
        """
        raise InvalidRequestBody(
            "Field '{}' is required.".format(e.args[0] if isinstance(e, KeyError) else e)
        )


class InvalidRequestHeader(HTTPException):
    """Invalid request header."""

    def __init__(self, desc=""):
        super().__init__()
        self.code = 400
        self.description = desc


class UnauthorizedRequest(HTTPException):
    """The user is not authorized for the intended action."""

    def __init__(self, desc=""):
        super().__init__()
        self.code = 403
        self.description = desc

    @staticmethod
    def error_no_membership():
        """The user is not a member of this group."""
        return UnauthorizedRequest('Not a member of target matching group.')


class LoginRequired(HTTPException):
    """The request is not sent from a login user."""

    def __init__(self, desc=""):
        super().__init__()
        self.code = 401
        self.description = desc


class DataModelException(Exception):
    """DataModelException"""
    description: str = None

    def __init__(self, msg=""):
        super().__init__()
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
