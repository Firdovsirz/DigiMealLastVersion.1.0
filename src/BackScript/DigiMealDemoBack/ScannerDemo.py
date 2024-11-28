from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import bcrypt
import qrcode
from io import BytesIO
import base64
import uuid
from datetime import date
from apscheduler.schedulers.background import BackgroundScheduler
import atexit

app = Flask(__name__)
CORS(app)
DB_PATH = 'LoginDemo.db'

# Initialize the database
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create or update the identify table with faculty, username, and password
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS identify (
            faculty TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    ''')

    # Create table for QR codes with 'username' as a foreign key
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS qr_codes (
            id TEXT PRIMARY KEY,
            username TEXT,
            image BLOB,
            date TEXT,
            status INTEGER DEFAULT 1,
            FOREIGN KEY (username) REFERENCES identify(username)
        )
    ''')

    conn.commit()
    conn.close()

init_db()

# Register endpoint
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    faculty = data.get('faculty')
    username = data.get('username')
    password = data.get('password')

    if not faculty or not username or not password:
        return jsonify({"success": False, "message": "Faculty, username, and password are required"}), 400

    # Hash the username and password using bcrypt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO identify (faculty, username, password) VALUES (?, ?, ?)",
                       (faculty, username, hashed_password))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Registration successful"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "message": "Username already exists"}), 400
    except sqlite3.Error as e:
        return jsonify({"success": False, "message": f"Database error: {str(e)}"}), 500

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"success": False, "message": "Username and password are required"}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT username, password FROM identify WHERE username = ?", (username,))
        user = cursor.fetchone()
        conn.close()

        if user and bcrypt.checkpw(password.encode('utf-8'), user[1].encode('utf-8')):
            return jsonify({"success": True, "message": "Login successful"}), 200
        else:
            return jsonify({"success": False, "message": "Invalid username or password"}), 401
    except sqlite3.Error as e:
        return jsonify({"success": False, "message": f"Database error: {str(e)}"}), 500

# QR Code generation
def generate_qr_code(data):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill="black", back_color="white")
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

# Generate QR Code endpoint
@app.route('/generate_qr', methods=['POST'])
def generate_qr():
    data = request.json
    username = data.get('username')
    today = str(date.today())

    if not username:
        return jsonify({"success": False, "message": "Username is required"}), 400

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM qr_codes WHERE username = ? AND date = ?', (username, today))
    if cursor.fetchone():
        conn.close()
        return jsonify({"success": False, "message": "QR code already generated for today"}), 400

    unique_id = str(uuid.uuid4())
    qr_image = generate_qr_code(unique_id)

    cursor.execute('INSERT INTO qr_codes (id, username, image, date, status) VALUES (?, ?, ?, ?, ?)',
                   (unique_id, username, qr_image, today, 1))
    conn.commit()
    conn.close()

    return jsonify({"success": True, "id": unique_id, "image": qr_image, "status": 1}), 201

# Update old QR codes
def update_old_qr_codes():
    today = str(date.today())
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE qr_codes
        SET status = 2
        WHERE status = 1 AND date < ?
    ''', (today,))
    conn.commit()
    conn.close()

# Scheduler setup
scheduler = BackgroundScheduler()
scheduler.add_job(update_old_qr_codes, 'cron', hour=0, minute=1)
scheduler.start()

# Ensure scheduler stops when the application shuts down
atexit.register(lambda: scheduler.shutdown())

if __name__ == '__main__':
    app.run(debug=True)
