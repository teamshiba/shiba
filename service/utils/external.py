# -*- coding: utf-8 -*-
"""Used for external data source."""

from typing import Dict
from urllib.parse import quote

import requests

from utils import config_g

YELP_API_HOST = 'https://api.yelp.com'
YELP_API_KEY = config_g.get_yelp_api_key()
YELP_SEARCH_PATH = '/v3/businesses/search'


def request_external(host, path, api_key, url_params=None) -> Dict:
    """Given your API_KEY, send a GET request to the API.
    Args:
        host (str): The domain host of the API.
        path (str): The path of the API after the domain.
        api_key (str): Your API Key.
        url_params (dict): An optional set of query parameters in the request.
    Returns:
        dict: The JSON response from the request.
    Raises:
        HTTPError: An error occurs from the HTTP request.
    """
    url_params = url_params or {}
    url = '{0}{1}'.format(host, quote(path.encode('utf8')))
    headers = {
        'Authorization': 'Bearer %s' % api_key,
    }

    response = requests.request('GET', url, headers=headers, params=url_params)

    return response.json()


def yelp_search_biz(term: str = None, location: str = None,
                    latitude: float = None,
                    longitude: float = None,
                    url_params: Dict = None) -> Dict:
    """Query the Search API by a search term and location.
    Args:
        term (str): The search term passed to the API.
        location (str): The search location passed to the API.
    Returns:
        dict: The JSON response from the request.
        :param longitude: Longitude of the location you want to search nearby.
        :param latitude: Latitude of the location you want to search nearby.
        :param location: The search location passed to the API.
        :param term: The search term passed to the API.
        :param url_params: Extra parameters.
    """
    params = url_params.copy() if url_params else {}
    if not (location or (latitude and longitude)):
        raise ValueError("Either location or coordinates is required.")
    if term:
        params['term'] = term.replace(' ', '+')
    if latitude and longitude:
        latitude = float(latitude)
        longitude = float(longitude)
        if latitude < -90 or latitude > 90 or longitude < -180 or longitude > 180:
            raise ValueError("Invalid latitude or longitude.")
        params['latitude'] = latitude
        params['longitude'] = longitude
    if location:
        params['location'] = location.replace(' ', '+')
    return request_external(YELP_API_HOST,
                            YELP_SEARCH_PATH, YELP_API_KEY,
                            url_params=params)
