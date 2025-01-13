import os
import uuid
import qrcode
import bcrypt
import base64
import logging
import sqlite3
from io import BytesIO
from PIL import Image
from datetime import datetime, timedelta
from cryptography.fernet import Fernet
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import jwt  # Ensure this is installed


# Load environment variables
load_dotenv()

# Flask app configuration
app = Flask(__name__)
CORS(app)

# Secure database paths
LOCAL_DB_PATH = "Admins.db"
ADMIN_DB_PATH = "/Users/firdovsirzaev/Desktop/DigiMeal/src/BackScript/DigiMealDemoBack/admins_identify.db"

# Load Fernet encryption key and secret key
# FERNET_KEY = os.getenv('FERNET_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')

# if not FERNET_KEY or not SECRET_KEY:
#     raise Exception("\u274c Missing required environment variables: FERNET_KEY or SECRET_KEY")

# f = Fernet(FERNET_KEY)

# Logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def init_db():
    """Initializes both databases."""
    with sqlite3.connect(LOCAL_DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Neqliyyat_Admin (
                ad TEXT,
                soyad TEXT NOT NULL,
                ata_adi TEXT NOT NULL,
                digimealusername INTEGER NOT NULL,
                fin_kod TEXT NOT NULL,
                telefon_nomresi TEXT NOT NULL,
                fakulte TEXT NOT NULL,
                status TEXT NOT NULL,
                bilet TEXT NOT NULL,
                password TEXT NOT NULL,
                PRIMARY KEY(digimealusername, fin_kod, telefon_nomresi)
            )
        ''')
        logging.info("\u2705 Neqliyyat_Admin table initialized successfully.")

    with sqlite3.connect(ADMIN_DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS adminsidenfication (
                usernameadmin TEXT PRIMARY KEY,
                passwordadmin TEXT NOT NULL
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS admin_page (
                username TEXT PRIMARY KEY,
                istifadeci_adi TEXT NOT NULL
            )
        ''')
        logging.info("\u2705 Admin database tables initialized successfully.")

def encrypt_data(data):
    """Encrypts the provided data."""
    try:
        return f.encrypt(data.encode()).decode()
    except Exception as e:
        logging.error(f"\u274c Encryption failed: {str(e)}")
        raise

def decrypt_data(data):
    """Decrypts the provided data."""
    try:
        return f.decrypt(data.encode()).decode()
    except Exception as e:
        logging.error(f"\u274c Decryption failed: {str(e)}")
        raise

def generate_jwt(username, is_admin=False):
    """Generates a JWT token."""
    expiration_time = datetime.utcnow() + timedelta(hours=1)
    payload = {
        'username': username,
        'is_admin': is_admin,
        'exp': expiration_time
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def query_db(query, params=(), fetchone=False):
    """Query the database and fetch results."""
    with sqlite3.connect(LOCAL_DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        return cursor.fetchone() if fetchone else cursor.fetchall()

def execute_db(query, params=()):
    """Execute a query that modifies the database."""
    with sqlite3.connect(LOCAL_DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit()

@app.route('/admin/get_admin_username', methods=['POST'])
def get_admin_username():
    data = request.json
    usernameadmin = data.get('usernameadmin')

    if not usernameadmin:
        return jsonify({"success": False, "message": "Username is required"}), 400

    try:
        conn = sqlite3.connect(ADMIN_DB_PATH)
        cursor = conn.cursor()
        cursor.execute('SELECT istifadeci_adi FROM admin_page WHERE username = ?', (usernameadmin,))
        result = cursor.fetchone()

        if result:
            return jsonify({"success": True, "istifadeci_adi": result[0]}), 200
        else:
            return jsonify({"success": False, "message": "Username not found"}), 404

    except sqlite3.Error as e:
        logging.error(f"Database error: {str(e)}")
        return jsonify({"success": False, "message": "Database error"}), 500
    finally:
        conn.close()

@app.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"success": False, "message": "Username and password are required"}), 400

    try:
        result = query_db('SELECT passwordadmin FROM adminsidenfication WHERE usernameadmin = ?', (username,), fetchone=True)

        if result and bcrypt.checkpw(password.encode(), result[0].encode()):
            token = generate_jwt(username, is_admin=True)
            return jsonify({"success": True, "message": "Login successful", "token": token}), 200
        else:
            return jsonify({"success": False, "message": "Invalid username or password"}), 401

    except sqlite3.Error as e:
        logging.error(f"Database error: {str(e)}")
        return jsonify({"success": False, "message": "Database error"}), 500

@app.route('/adminregister', methods=['POST'])
def register():
    data = request.json

    try:
        ad = data['ad']
        soyad = data['soyad']
        ata_adi = data['ata_adi']
        digimealusername = int(data['digimealusername'])
        fin_kod = data['fin_kod']
        telefon_nomresi = data['telefon_nomresi']
        fakulte = data['fakulte']
        status = data['status']
        bilet = data['bilet']
        password = encrypt_data(data['password'])

        execute_db('''
            INSERT INTO Neqliyyat_Admin (ad, soyad, ata_adi, digimealusername, fin_kod, telefon_nomresi, fakulte, status, bilet, password)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (ad, soyad, ata_adi, digimealusername, fin_kod, telefon_nomresi, fakulte, status, bilet, password))

        return jsonify({"message": "\u2705 Qeydiyyat ugurla tamamlandi!"}), 201

    except sqlite3.IntegrityError:
        return jsonify({"error": "\u274c Istifadeci adi artiq movcuddur."}), 400
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({"error": "\u274c Xəta bas verdi."}), 500


@app.route('/adminregister/<usernameadmin>/<faculty>', methods=['POST'])
def registerAdmin(usernameadmin, faculty):
    """Registers a new admin or user."""
    data = request.get_json()

    try:
        digimealusername = int(data.get('digimealusername'))
        ad = data.get('ad')
        soyad = data.get('soyad')
        ata_adi = data.get('ata_adi')
        fin_kod = data.get('fin_kod')
        telefon_nomresi = data.get('telefon_nomresi')
        fakulte = data.get('fakulte')
        status = data.get('status')
        bilet = data.get('bilet')
        password = encrypt_data(data.get('password'))

        execute_db(f'''
            INSERT INTO "{faculty}" 
            (ad, soyad, ata_adi, digimealusername, fin_kod, telefon_nomresi, fakulte, status, bilet, password)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (ad, soyad, ata_adi, digimealusername, fin_kod, telefon_nomresi, fakulte, status, bilet, password))

        return jsonify({"message": "✅ Qeydiyyat ugurla tamamlandi!"}), 201

    except sqlite3.IntegrityError as e:
        logging.error(f"❌ Integrity error: {str(e)}")
        return jsonify({"error": "❌ Istifadeci adi artiq movcuddur."}), 400
    except Exception as e:
        logging.error(f"❌ Error: {str(e)}")
        return jsonify({"error": "❌ Xəta baş verdi"}), 500


@app.route('/adminsearch/<digimealusername>/<faculty>', methods=['GET'])
def search_data(digimealusername, faculty):
    """Searches for a specific user."""
    try:
        digimealusername = int(digimealusername)

        result = query_db(f'''
            SELECT ad, soyad, ata_adi, digimealusername, fin_kod, telefon_nomresi, fakulte, status, bilet, password 
            FROM "{faculty}"
            WHERE digimealusername=? AND fakulte=?
        ''', (digimealusername, faculty), fetchone=True)

        if result:
            decrypted_data = {
                "ad": result[0],
                "soyad": result[1],
                "ata_adi": result[2],
                "digimealusername": result[3],
                "fin_kod": result[4],
                "telefon_nomresi": result[5],
                "fakulte": result[6],
                "status": result[7],
                "bilet": result[8],
                "password": decrypt_data(result[9])
            }
            return jsonify(decrypted_data), 200
        else:
            return jsonify({"error": "❌ Istifadeci tapilmadi."}), 404

    except sqlite3.Error as e:
        logging.error(f"❌ Database error: {str(e)}")
        return jsonify({"error": "❌ Database error"}), 500
    except Exception as e:
        logging.error(f"❌ Error: {str(e)}")
        return jsonify({"error": "❌ Xəta baş verdi"}), 500


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
