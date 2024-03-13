from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/submit-email', methods=['POST'])
def submit_email():
    email = request.form['email']
    # Here you can add the code to process the email address, like adding it to a database or sending a confirmation email
    return jsonify({'status': 'success', 'message': 'Email submitted successfully'})

if __name__ == '__main__':
    app.run(debug=True)