# Instructions

Create a file called `secret.py` and create a variable called `PG_PASSWORD='PostgreSQL password'`

## Testing

To see whether or not gunicorn can serve this app, type:

`gunicorn --bind 0.0.0.0:8000 wsgi`

## References

https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-gunicorn-and-nginx-on-ubuntu-14-04
