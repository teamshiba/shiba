import json


def json_read(filename):
    with open(filename, 'r') as fd:
        return json.load(fd)