import cv2
from pyzbar.pyzbar import decode
import numpy as np
from flask_cors import CORS
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

# Flag to control scanning
ready_to_scan = False

def scan_qr_code():
    global ready_to_scan
    cap = cv2.VideoCapture(0)

    while ready_to_scan:
        ret, frame = cap.read()
        if not ret:
            break

        qr_codes = decode(frame)
        if qr_codes:
            for qr_code in qr_codes:
                qr_data = qr_code.data.decode("utf-8")
                qr_type = qr_code.type

                # Draw polygon around QR code
                pts = qr_code.polygon
                if len(pts) == 4:
                    pts = [(point.x, point.y) for point in pts]
                    pts = np.array(pts, dtype=np.int32)
                    cv2.polylines(frame, [pts], True, (0, 255, 0), 3)

                # Display QR code data
                cv2.putText(frame, f"{qr_type}: {qr_data}",
                            (qr_code.rect.left, qr_code.rect.top - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)

                print("QR Code Data:", qr_data)
                ready_to_scan = False
                break

        cv2.imshow("QR Code Scanner", frame)

        # Exit when 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


@app.route('/start-scan', methods=['POST'])
def start_scan():
    """
    Start scanning for QR codes.
    """
    global ready_to_scan
    if not ready_to_scan:
        ready_to_scan = True
        scan_qr_code()
        return jsonify({"status": "Scanning complete."}), 200
    else:
        return jsonify({"status": "Already scanning."}), 400


@app.route('/stop-scan', methods=['POST'])
def stop_scan():
    """
    Stop scanning for QR codes.
    """
    global ready_to_scan
    ready_to_scan = False
    return jsonify({"status": "Scanning stopped."}), 200


if __name__ == '__main__':
    app.run(debug=True)