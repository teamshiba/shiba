from unittest.mock import MagicMock, Mock


def mocked_check_token(f):
    def inner(*args, **kwargs):
        kwargs.update({'auth_uid': 'test_uid'})
        return f(*args, **kwargs)

    return inner


def get_mock_request(json=None, args=None, header=None):
    def get_value(key):
        if type(args) is dict:
            return args.get(key)
        else:
            return None

    request = MagicMock()
    # request.args = Mock(wraps=args)
    request.args.to_dict = Mock(return_value=args)
    request.args.get = get_value
    request.headers = header
    request.get_json = Mock(return_value=json)
    # req.headers.get = MagicMock(return_value='Bearer test-token')
    return request


def get_mock_doc_snap(data={}):
    doc = MagicMock()
    doc.to_dict = Mock(return_value=data)
    doc.get = lambda k: data.get(k)
    doc.exists = True if data else False
    return doc


def get_mock_doc_ref(data={}, doc_id=None):
    doc = get_mock_doc_snap(data)
    ref = MagicMock()
    ref.get = Mock(return_value=doc)
    ref.update = Mock()
    ref.id = doc_id
    return ref


def get_mock_query(stream=[]):
    docs = [get_mock_doc_snap(it) for it in stream]
    mock = Mock(
        stream=Mock(return_value=docs),
        where=Mock(
            return_value=Mock(
                stream=Mock(return_value=docs),
                where=Mock(
                    return_value=Mock(stream=Mock(return_value=docs))
                )
            )
        )
    )
    return mock


def get_mock_collection(mock_doc: Mock = None, valid_ids=[], stream=[]):
    def doc_getter(key):
        if not valid_ids or key in valid_ids:
            return mock_doc
        else:
            return get_mock_doc_ref(None)

    return MagicMock(
        add=Mock(return_value=('2020', mock_doc)),
        document=Mock(wraps=doc_getter),
        where=MagicMock(return_value=get_mock_query(stream))
    )


def get_mock_group(role=0):
    mock = MagicMock()
    mock.validate_user_role = Mock(return_value=role)
    return mock


def get_mock_config_g(collections: dict = None):
    def get_collection(name: str):
        return collections.get(name)
    collection = Mock(wraps=get_collection) if collections else Mock(return_value=Mock())
    db = Mock(collection=collection)
    config_g = Mock(db=db)
    return config_g
