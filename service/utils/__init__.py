"""
app initialization.
"""
import json


class Config:
    """Global configuration object."""
    is_testing: bool = False
    env_dict: dict
    connect_db = None

    def __init__(self):
        with open("environ.json") as f:
            self.env_dict = json.load(f)

    def get_yelp_api_key(self):
        """Config item: API key."""
        return self.env_dict.get('yelp_api_key')

    @property
    def db(self):
        """Db connection."""
        return self.connect_db or None


config_g = Config()
