# Deployment Notes

Based off of this [DigitalOcean deployment guide for Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-gunicorn-and-nginx-on-ubuntu-14-04)

## Example Upstart Configuration

### Prerequisites
Make sure a Python environment with all the required dependencies is created at the following path below


### `/etc/init/us-commutes.conf`
```
description "Gunicorn application server running US Commutes Map v2"

start on runlevel [2345]
stop on runlevel [!2345]

respawn
setuid root
setgid www-data

env PATH=/home/us_commutes_ii/flask/flaskenv/bin
chdir /home/us_commutes_ii/flask
exec gunicorn --workers 3 --bind unix:flask.sock -m 007 wsgi
```

Use `sudo start us-commutes` to start and `/var/log/upstart/us-commutes.log` to debug errors

## Example Nginx Configuration

* Make sure React app is configured to use this endpoint
* Make sure Gunicorn is configured to create `flask.sock` file

### `/etc/nginx/sites-available/<some_site>`

```
...

server {
    # Port doesn't matter, just make sure React app uses the right one
	listen 8000;
	server_name 107.170.208.132 vincela.com;

    # Use compression for large JSON responses
    # See: https://docs.nginx.com/nginx/admin-guide/web-server/compression/
    gzip on;
    gzip_types application/json;
	
	location / {
		include proxy_params;
		proxy_pass http://unix:/home/us_commutes_ii/flask/flask.sock;
	}
}
```