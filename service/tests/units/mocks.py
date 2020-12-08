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


def get_mock_doc_ref(data={}, doc_id=None):
    doc = MagicMock()
    doc.to_dict = Mock(return_value=data)
    doc.get = lambda k: data.get(k)
    doc.exists = True if data else False
    ref = MagicMock()
    ref.get = Mock(return_value=doc)
    ref.update = Mock()
    ref.id = doc_id
    return ref


def get_mock_query(stream=[]):
    mock = Mock(
        stream=Mock(return_value=stream),
        where=Mock(
            return_value=Mock(
                stream=Mock(return_value=stream),
                where=Mock(
                    return_value=Mock(stream=Mock(return_value=stream))
                )
            )
        )
    )
    return mock


def get_mock_collection(mock_doc=None, stream=[]):
    return MagicMock(
        add=Mock(return_value=('2020', mock_doc)),
        document=Mock(return_value=mock_doc),
        where=MagicMock(return_value=get_mock_query(stream))
    )


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
