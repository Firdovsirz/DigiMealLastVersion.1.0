import os
import uuid
import qrcode
import base64
import atexit
import sqlite3
from io import BytesIO
from datetime import date
from flask_cors import CORS
from flask import Flask, request, jsonify
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "http://localhost:5173"}})

LOCAL_DB_PATH = "/Users/firdovsirzaev/Desktop/DigiMeal/src/BackScript/DigiMealDemoBack/LoginDemo.db"

# Initialize database if it doesn't exist
def init_db():
    conn = sqlite3.connect(LOCAL_DB_PATH)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS identify (
            username TEXT PRIMARY KEY,
            password TEXT NOT NULL
        )
    ''')

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


def update_old_qr_codes():
    today = str(date.today())
    conn = sqlite3.connect(LOCAL_DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE qr_codes
        SET status = 2
        WHERE status = 1 AND date < ?
    ''', (today,))
    conn.commit()
    conn.close()


scheduler = BackgroundScheduler()
scheduler.add_job(update_old_qr_codes, 'cron', hour=0, minute=1)
scheduler.start()
atexit.register(lambda: scheduler.shutdown())


def check_login(username, password):
    try:
        conn = sqlite3.connect(LOCAL_DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM identify WHERE username = ? AND password = ?", (username, password))
        user = cursor.fetchone()
        if user:
            return {"success": True, "username": username, "message": "Login successful"}
        else:
            return {"success": False, "message": "Incorrect username or password"}
    except sqlite3.Error as e:
        return {"success": False, "message": f"Database error: {str(e)}"}
    finally:
        conn.close()


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"success": False, "message": "Username and password required"}), 400

    result = check_login(username, password)
    return jsonify(result), 200 if result['success'] else 401


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


@app.route('/generate_qr', methods=['POST'])
def generate_qr():
    data = request.json
    username = data.get('username')
    today = str(date.today())

    if not username:
        return jsonify({"success": False, "message": "Username is required"}), 400

    conn = sqlite3.connect(LOCAL_DB_PATH)
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


@app.route('/get_qrs/<username>', methods=['GET'])
def get_qrs(username):
    conn = sqlite3.connect(LOCAL_DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT id, image, date, status FROM qr_codes WHERE username = ?', (username,))
    rows = cursor.fetchall()
    conn.close()

    qr_data = [{"id": row[0], "image": row[1], "date": row[2], "status": row[3]} for row in rows]
    return jsonify(qr_data), 200

@app.route('/get_username', methods=['POST'])
def get_username():
    data = request.json
    username = data.get('username')

    if not username:
        return jsonify({"success": False, "message": "Username is required"}), 400

    conn = sqlite3.connect(LOCAL_DB_PATH)
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT istifadeci_adi FROM user_page WHERE username = ?', (username, ))
        result = cursor.fetchone()

        if result:
            istifadeci_adi = result[0]
            return jsonify({"success": True, "istifadeci_adi": istifadeci_adi}), 200
        else:
            return jsonify({"success": False, "message": "Username not found"}), 404
    except sqlite3.Error as e:
        return jsonify({"success": False, "message": f"Database error: {str(e)}"}), 500
    finally:
        conn.close()
@app.route('/update_status/<qr_id>', methods=['PATCH'])
def update_status(qr_id):
    conn = sqlite3.connect(LOCAL_DB_PATH)
    cursor = conn.cursor()
    cursor.execute('UPDATE qr_codes SET status = 0 WHERE id = ?', (qr_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Status updated successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True)
