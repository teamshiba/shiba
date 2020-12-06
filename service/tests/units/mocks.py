from unittest.mock import MagicMock, Mock


def mocked_check_token(f):
    def inner(*args, **kwargs):
        kwargs.update({'auth_uid': 'test_uid'})
        return f(*args, **kwargs)

    return inner


def get_mock_request(json=None, args=None, header=None):
    request = MagicMock()
    request.args.to_dict = Mock(return_value=args)
    request.headers = header
    request.get_json = Mock(return_value=json)
    # req.headers.get = MagicMock(return_value='Bearer test-token')
    return request


def get_mock_doc_ref(data=None):
    mock = MagicMock()
    mock.to_dict = Mock(return_value=data)
    ref = MagicMock()
    ref.get = Mock(return_value=mock)
    return ref


def get_mock_group(role=0):
    mock = MagicMock()
    mock.validate_user_role = Mock(return_value=role)
    return mock


def get_mock_config_g():
    ref = MagicMock()
    collection = Mock(return_value=ref)
    db = Mock(collection=collection)
    config_g = Mock(db=db)
    return config_g
