# Redis

Start a redis instance in the foreground, which can be terminated by Ctrl-C:

```shell
docker run --rm -p 6379:6379 redis:6.0.9
```

Start a redis instance in the background, and it can be later managed with `docker ps/start/stop/...`:

```shell
docker run -d -p 6379:6379 redis:6.0.9
```

Our backend server should be able to make use of the local redis server by default (see `config.py`). 
When it is needed to use a remote one, it should be sufficient to configure `REDIS_HOST`, `REDIS_PORT`, 
`REDIS_PASSWROD` environment variables.