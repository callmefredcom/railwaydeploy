# The files you need in your app configuration to deploy it to Railway

### .gitignore

### Procfile

### requirements.txt


**.gitignore**

This is where you’ll declare the files you don’t want to commit to your GitHub repo.

**Procfile** (to start the deployment)

```python
web: gunicorn **main**:app
```

generate **requirements.txt**

This will list all the packages you’ll need to install on your server.

```python
pip install pipreqs

pipreqs .
pipreqs . --force to regenerate the requirements.txt file
pipreqs . --ignore .venv to ignore a specific directory
```

Make sure you’re using those packages (sometimes pipreqs can suggest the wrong ones)

```python

mysql-connector-python==8.0.33
gunicorn==21.1.0
```

MySQL DB Connection logic. Quick boilerplate to get you started.

```python
from flask import **g**
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()
```

```python
# get sql pw from .env
db_password = os.environ.get('MYSQLPASSWORD')

# MySQL configuration
DATABASE_URL = f"mysql -hmonorail.proxy.rlwy.net -uroot -p{db_password} --port 11855 --protocol=TCP railway"

DATABASE_CONFIG = {
            'user': 'root',
            'password': os.environ.get('MYSQLPASSWORD'),
            'host': 'monorail.proxy.rlwy.net',
            'port': '11855',
            'database': 'railway'
        }

def get_db():
    if hasattr(g, 'db_conn') and g.db_conn.is_connected():
        return g.db_conn
    else:
        g.db_conn = mysql.connector.connect(**DATABASE_CONFIG)
        return g.db_conn

@app.teardown_appcontext
def close_db_connection(exception):
    db = getattr(g, 'db_conn', None)
    if db is not None:
        db.close()
```