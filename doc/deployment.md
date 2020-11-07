# Deployment

I am planning to deploy the services using `docker-compose`. It is a
 simple tool that allow us to run several docker images that possibly
 interconnects with each other.
 
For now, 4 services will be deployed (see `docker-compose.yml` for details):

- frontend server, which is basically a nginx server that serves
  static files
- backend server, our flask app executed with `gunicorn`
- redis server
- gateway server

The gateway server is a nginx reverse proxy that is configured to
forward every request with prefix `/api/` to the backend server and
everything else to the frontend server. For example, a request to
`/api/hello` with be forwarded to the backend server as `/hello`, and
a request to `/index.html` with be forwarded to the frontend server
with URL unchanged.

`docker-compose` will create a internal network for these services,
services can access each other using the name in the configuration
file as the hostname. Services within this network should also be
inaccessible from the outside unless a port is exposed in the
configuration file explicitly. That's why I didn't set up a password
for the redis server.
