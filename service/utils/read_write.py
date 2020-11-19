"""
read and write to file doc.
"""
import json


def json_read(filename):
    """
    :param filename: file path
    :return:
    """
    with open(filename, 'r') as file:
        return json.load(file)
