import os

# Statements for enabling the development environment
if os.getenv('CHATSEC_ENV', False) == 'dev':
    DEBUG = True
    DEBUG_TB_INTERCEPT_REDIRECTS = True
    ANALYTICS = False
elif os.getenv('CHATSEC_ENV', False) == 'production':
    DEBUG = False
    ANALYTICS = True

# Define the application directory
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
WEB_IP = '0.0.0.0'
WEB_PORT = os.getenv('CHATSEC_FLASK_PORT', 5000)

# Load jQuery and Twitter Bootstrap from local server or CDN
USE_CDN = os.getenv('CHATSEC_USE_CDN', True)

# Application threads. A common general assumption is
# using 2 per available processor cores - to handle
# incoming requests using one and performing background
# operations using the other.
THREADS_PER_PAGE = 2

# Enable protection agains *Cross-site Request Forgery (CSRF)*
CSRF_ENABLED = True

# Use a secure, unique and absolutely secret key for
# signing the data.
CSRF_SESSION_KEY = os.getenv('CHATSEC_FLASK_CSRF_SESSION_KEY', '5eb63bbbe01eeed093cb22bb8f5acdc3')

# Secret key for signing cookies
SECRET_KEY = os.getenv('CHATSEC_FLASK_SECRET_KEY', '19f91a5069328a8ee6cdfc0e60894f90')
