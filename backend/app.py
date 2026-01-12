from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from routes.client_routes import client_bp
from routes.case_routes import case_bp

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(client_bp, url_prefix='/api/clients')
app.register_blueprint(case_bp, url_prefix='/api/cases')


# ============== API ROUTES ==============

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'API is running'}), 200


# ============== RUN APPLICATION ==============

if __name__ == '__main__':
    app.run(debug=True, port=5000)

