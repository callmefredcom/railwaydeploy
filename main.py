from flask import Flask, render_template, request, jsonify, g
from dotenv import load_dotenv
import os
import mysql.connector

load_dotenv()

app = Flask(__name__)

# get sql pw from .env
db_password = os.environ.get('MYSQLPASSWORD')

# MySQL configuration
DATABASE_URL = f"mysql -hroundhouse.proxy.rlwy.net -uroot -p{db_password} --port 50259 --protocol=TCP railway"

DATABASE_CONFIG = {
            'user': 'root',
            'password': os.environ.get('MYSQLPASSWORD'),
            'host': 'roundhouse.proxy.rlwy.net',
            'port': '50259',
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


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/submit-email', methods=['POST'])
def submit_email():
    email = request.form['email']

    # Get the database connection
    db = get_db()

    try:
        # Create a cursor
        cursor = db.cursor()

        # Execute the INSERT statement
        cursor.execute("INSERT INTO users (email) VALUES (%s)", (email,))

        print("Email submitted successfully")

        # Commit the changes
        db.commit()

    except mysql.connector.Error as err:
        print("Something went wrong: {}".format(err))
        return jsonify({'status': 'failure', 'message': 'Email could not be submitted'})

    finally:
        # Close the cursor
        cursor.close()

    return jsonify({'status': 'success', 'message': 'Email submitted successfully'})

if __name__ == '__main__':
    app.run(debug=True)