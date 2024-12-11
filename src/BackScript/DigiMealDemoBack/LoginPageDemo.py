import os
import uuid
import qrcode
import base64
import sqlite3
import atexit
from io import BytesIO
from datetime import date
from flask_cors import CORS
from flask import Flask, request, jsonify
from apscheduler.schedulers.background import BackgroundScheduler

# Flask app setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

# Database paths
LOCAL_DB_PATH = "/Users/firdovsirzaev/Desktop/DigiMeal/src/BackScript/DigiMealDemoBack/LoginDemo.db"
ADMIN_DB_PATH = "/Users/firdovsirzaev/Desktop/DigiMeal/src/BackScript/DigiMealDemoBack/admins_identify.db"  # Proper path

# Initialize User and Admin Databases
def init_db():
    """Initializes the databases for users and admins."""
    # Initialize User Database
    conn = sqlite3.connect(LOCAL_DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS identify (
        username TEXT PRIMARY KEY, 
        password TEXT NOT NULL 
    )''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS qr_codes (
        id TEXT PRIMARY KEY, 
        username TEXT, 
        image BLOB, 
        date TEXT, 
        status INTEGER DEFAULT 1, 
        status_scanner INTEGER DEFAULT 1, 
        FOREIGN KEY (username) REFERENCES identify(username) 
    )''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS user_page (
        username TEXT PRIMARY KEY, 
        istifadeci_adi TEXT NOT NULL 
    )''')
    cursor.execute('INSERT OR IGNORE INTO user_page (username, istifadeci_adi) VALUES (?, ?)', ('Karam Shukurlu', 'Karam Shukurlu'))
    conn.commit()
    conn.close()
    
    # Initialize Admin Database
    conn = sqlite3.connect(ADMIN_DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS adminsidenfication (
        username TEXT PRIMARY KEY, 
        password TEXT NOT NULL 
    )''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS admin_page (
        username TEXT PRIMARY KEY, 
        istifadeci_adi TEXT NOT NULL 
    )''')
    conn.commit()
    conn.close()

init_db()

# Background scheduler to update QR codes
scheduler = BackgroundScheduler()


def update_old_qr_codes():
    today = str(date.today())
    conn = sqlite3.connect(LOCAL_DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''UPDATE qr_codes SET status = 2 WHERE status = 1 AND date < ?''', (today,))
    conn.commit()
    conn.close()


scheduler.add_job(update_old_qr_codes, 'cron', hour=23, minute=0)
scheduler.start()
atexit.register(lambda: scheduler.shutdown())


# User Authentication
def check_user_login(username, password):
    try:
        conn = sqlite3.connect(LOCAL_DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM identify WHERE username = ? AND password = ?", (username, password))
        user = cursor.fetchone()
        return {"success": bool(user), "username": username if user else None, "message": "Login successful" if user else "Incorrect username or password"}
    finally:
        conn.close()


@app.route('/user/login', methods=['POST'])
def user_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"success": False, "message": "Username and password required"}), 400
    result = check_user_login(username, password)
    return jsonify(result), 200 if result['success'] else 401

@app.route('/user/get_qrs/<username>', methods=['GET'])
def get_qrs(username):
    conn = sqlite3.connect(LOCAL_DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT id, image, date, status FROM qr_codes WHERE username = ?', (username,))
    rows = cursor.fetchall()
    conn.close()

    qr_data = [{"id": row[0], "image": row[1], "date": row[2], "status": row[3]} for row in rows]
    return jsonify(qr_data), 200

@app.route('/user/generate_qr', methods=['POST'])
def generate_user_qr():
    data = request.json
    username = data.get('username')
    if not username:
        return jsonify({"success": False, "message": "Username is required."}), 400

    today = str(date.today())
    conn = sqlite3.connect(LOCAL_DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT id, image, date FROM qr_codes WHERE username = ? AND date = ? AND status = 1', (username, today))
    existing_qr = cursor.fetchone()

    if existing_qr:
        conn.close()
        return jsonify({"success": True, "image": existing_qr[1], "date": existing_qr[2]})
    qr_id = str(uuid.uuid4())
    qr_image = generate_qr_code(username)
    cursor.execute('INSERT INTO qr_codes (id, username, image, date, status) VALUES (?, ?, ?, ?, 1)', (qr_id, username, qr_image, today))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "image": qr_image, "date": today})


@app.route('/user/get_username', methods=['POST'])
def get_username():
    data = request.json
    username = data.get('username')

    if not username:
        return jsonify({"success": False, "message": "Username is required"}), 400

    conn = sqlite3.connect(LOCAL_DB_PATH)
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT istifadeci_adi FROM user_page WHERE username = ?', (username,))
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






def generate_qr_code(data):
    qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=4)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill="black", back_color="white")
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")


# Admin Authentication
def check_admin_login(username, password):
    try:
        conn = sqlite3.connect(ADMIN_DB_PATH)
        cursor = conn.cursor()
        print(f"Checking admin credentials for {username}")  # Debugging line
        cursor.execute("SELECT * FROM adminsidenfication WHERE usernameadmin = ? AND passwordadmin = ?", (username, password))
        admin = cursor.fetchone()
        print(f"Admin found: {admin}")  # Debugging line
        return {
            "success": bool(admin),
            "username": username if admin else None,
            "message": "Login successful" if admin else "Incorrect username or password",
        }
    except Exception as e:
        print(f"Error in check_admin_login: {e}")  # Log the error
        return {"success": False, "message": "Database error"}
    finally:
        conn.close()


@app.route('/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.json
        print(f"Received data: {data}")  # Debugging line
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"success": False, "message": "Username and password required"}), 400

        result = check_admin_login(username, password)
        return jsonify(result), 200 if result['success'] else 401

    except Exception as e:
        print(f"Error during admin login: {e}")  # Log the error
        return jsonify({"success": False, "message": "Internal server error"}), 500


@app.route('/admin/get_admin_username', methods=['POST'])
def get_admin_username():
    data = request.json
    username = data.get('username')

    if not username:
        return jsonify({"success": False, "message": "Username is required"}), 400

    conn = sqlite3.connect(ADMIN_DB_PATH)
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT istifadeci_adi FROM admin_page WHERE usernameadmin = ?', (username,))
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


@app.route('/user/history/<username>', methods=['GET'])
def user_history(username):
    conn = sqlite3.connect(LOCAL_DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT id, date, status_scanner FROM qr_codes WHERE username = ?', (username,))
    rows = cursor.fetchall()
    conn.close()
    qr_data = [{"id": row[0], "date": row[1], "status_scanner": row[2]} for row in rows]
    return jsonify(qr_data), 200


if __name__ == '__main__':
    app.run(debug=True)