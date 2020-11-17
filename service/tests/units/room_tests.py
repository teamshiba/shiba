from tests.test_client import create_app

app = create_app()


with app.test_client() as c:
    rv = c.post('/room', json={
        'roomName': 'test_name'
    })
    json_data = rv.get_json()
    assert json_data.get('data') is not None
