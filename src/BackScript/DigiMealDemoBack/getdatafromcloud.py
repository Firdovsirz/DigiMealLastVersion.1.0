import os
import sqlite3
import gdown

DB_URL = "https://drive.google.com/uc?id=1iKLIdvbwN2j0TL-Jpe1V25mMLSmka6Fl"
LOCAL_DB_PATH = "temp_LoginDemo.db"


def download_db():
    """
    Download the database file if it doesn't exist locally.
    """
    if not os.path.exists(LOCAL_DB_PATH):
        print("Downloading DB...")
        gdown.download(DB_URL, LOCAL_DB_PATH, quiet=False)
        print("Database downloaded successfully.")
    return LOCAL_DB_PATH


def cleanup():
    """
    Delete the temporary database file if it exists.
    """
    if os.path.exists(LOCAL_DB_PATH):
        os.remove(LOCAL_DB_PATH)
        print("Temporary database file deleted.")


def main():
    """
    Main function to connect to the database, fetch and print rows, and clean up the temp file.
    """
    # Ensure the database is downloaded
    DB_PATH = download_db()

    # Connect to the SQLite database
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()

        # Fetch and print all rows from the database table
        query = 'SELECT * FROM identify'
        cursor.execute(query)
        rows = cursor.fetchall()

        for row in rows:
            print(row)

    except sqlite3.Error as e:
        print(f"Database error: {e}")

    finally:
        # Ensure the connection is closed properly
        conn.close()
        print("Database connection closed.")

    # Clean up the temporary database file
    cleanup()


if __name__ == "__main__":
    main()
#
# from cryptography.fernet import Fernet
#
# # we will be encrypting the below string.
# message = input("Soz: ")
#
# # generate a key for encryption and decryption
# # You can use fernet to generate
# # the key or use random key generator
# # here I'm using fernet to generate key
#
# key = b'IRa9WxzRfcdLMN40cRpGF3gtSHrw5D5sPEFS9Vd1nSc='
#
# fernet = Fernet(key)
#
# encMessage = fernet.encrypt(message.encode())
#
# print("original string: ", message)
# print("encrypted string: ", encMessage)
#
# decMessage = fernet.decrypt(encMessage).decode()
#
# print("decrypted string: ", decMessage)