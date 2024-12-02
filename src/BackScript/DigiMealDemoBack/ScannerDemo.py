import cv2
import numpy as np
import time
import sqlite3

# Define your database path
DB_PATH = '/Users/firdovsirzaev/Desktop/DigiMeal/src/BackScript/DigiMealDemoBack/LoginDemo.db'

# Function to update the status in the database
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

# Function to scan QR code
def scan_qr_code(): 
    cap = cv2.VideoCapture(0) 
    ready_to_scan = True 

    # Create a QRCodeDetector object
    qr_decoder = cv2.QRCodeDetector() 

    while True: 
        ret, frame = cap.read() 
        if not ret: 
            break 

        if ready_to_scan: 
            # Use OpenCV's QRCodeDetector to detect and decode the QR code
            qr_data, pts, _ = qr_decoder.detectAndDecode(frame) 

            if qr_data: 
                # If a QR code is detected, draw the bounding box and display data
                pts = np.int32(pts).reshape(-1, 2) 
                for i in range(4): 
                    cv2.line(frame, tuple(pts[i]), tuple(pts[(i + 1) % 4]), (0, 255, 0), 3) 

                cv2.putText(frame, f"QR Code Data: {qr_data}", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2) 

                print("QR Code Data:", qr_data)

                # Update the QR code status in the database using the decoded QR code (assumed to be the qr_id)
                update_status_in_db(qr_data)

                ready_to_scan = False 
                start_time = time.time() 

        else: 
            elapsed_time = time.time() - start_time 
            if elapsed_time >= 15: 
                ready_to_scan = True  # Set flag to scan again 
            else: 
                cv2.putText(frame, "Ready to scan again in {:.0f} seconds".format(15 - elapsed_time), 
                            (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2) 

        cv2.imshow("QR Code Scanner", frame) 

        if cv2.waitKey(1) & 0xFF == ord('q'): 
            break 

    cap.release() 
    cv2.destroyAllWindows()

# Start the QR code scanner
scan_qr_code()