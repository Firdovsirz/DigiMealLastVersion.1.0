import cv2
#from pyzbar.pyzbar 
import decode
import numpy as np
import sqlite3
import time

DB_PATH = 'LoginDemo.db'

# Database connection and table setup
def initialize_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Ensure table matches backend structure
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


def update_status_in_db(qr_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Check if the ID exists with status 1
    cursor.execute("SELECT * FROM qr_codes WHERE id = ? AND status = 1", (qr_id,))
    result = cursor.fetchone()

    if result:
        # Update status to 0 if a match is found
        cursor.execute("UPDATE qr_codes SET status = 0 WHERE id = ?", (qr_id,))
        conn.commit()
        print(f"Status for QR ID {qr_id} updated to 0.")
    else:
        print(f"No matching QR ID {qr_id} with status 1 found.")

    conn.close()

# Function to scan QR codes
def scan_qr_code():
    cap = cv2.VideoCapture(0)
    ready_to_scan = True

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if ready_to_scan:
            qr_codes = decode(frame)
            if qr_codes:
                for qr_code in qr_codes:
                    qr_data = qr_code.data.decode("utf-8")

                    # Draw polygon around the QR code
                    pts = qr_code.polygon
                    if len(pts) == 4:
                        pts = [(point.x, point.y) for point in pts]
                        pts = np.array(pts, dtype=np.int32)
                        cv2.polylines(frame, [pts], True, (0, 255, 0), 3)

                    # Display QR code data on the screen
                    cv2.putText(frame, f"QR Code: {qr_data}", (qr_code.rect.left, qr_code.rect.top - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)

                    print("QR Code Data:", qr_data)

                    # Update the status in the database if the ID matches
                    update_status_in_db(qr_data)

                ready_to_scan = False
                start_time = time.time()

        else:
            elapsed_time = time.time() - start_time
            if elapsed_time >= 15:
                ready_to_scan = True
            else:
                cv2.putText(frame, "Ready to scan again in {:.0f} seconds".format(15 - elapsed_time),
                            (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

        cv2.imshow("QR Code Scanner", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

# Initialize the database and table
initialize_db()

# Run the QR code scanner
scan_qr_code()