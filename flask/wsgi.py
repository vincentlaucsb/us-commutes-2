'''
gunicorn demands our app be called "application"
or else we get

Failed to find attribute 'application' in 'wsgi'.
'''
from app import app as application

if __name__ == "__main__":
	appication.run()