from os import environ

REDIS_HOST = environ.get("REDIS_HOST") or "127.0.0.1"
REDIS_PORT = int(environ.get("REDIS_PORT") or "6379")
REDIS_PASSWORD = environ.get("REDIS_PASSWORD")
