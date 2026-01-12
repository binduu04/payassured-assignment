from flask import Blueprint, request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
import os

client_bp = Blueprint('clients', __name__)

# Database connection helper
def get_db_connection():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    return conn

# Validation helper
def validate_client_data(data):
    """Simple validation for client data"""
    required_fields = ['client_name', 'company_name', 'city', 'contact_person', 'phone', 'email']
    for field in required_fields:
        if not data.get(field):
            return False, f'{field} is required'
    
    # Basic email validation
    if '@' not in data['email']:
        return False, 'Invalid email format'
    
    return True, None


# ============== CLIENT ROUTES ==============

@client_bp.route('', methods=['POST'])
def create_client():
    """Create a new client"""
    try:
        data = request.get_json()
        
        # Validate data
        is_valid, error = validate_client_data(data)
        if not is_valid:
            return jsonify({'error': error}), 400
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Check if email already exists
        cur.execute("SELECT id FROM clients WHERE email = %s", (data['email'],))
        if cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({'error': 'Email already exists'}), 409
        
        # Insert new client
        cur.execute("""
            INSERT INTO clients (client_name, company_name, city, contact_person, phone, email)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, client_name, company_name, city, contact_person, phone, email, created_at
        """, (data['client_name'], data['company_name'], data['city'], 
              data['contact_person'], data['phone'], data['email']))
        
        client = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'message': 'Client created successfully',
            'client': dict(client)
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@client_bp.route('', methods=['GET'])
def get_clients():
    """Get all clients"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("SELECT * FROM clients ORDER BY created_at DESC")
        clients = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify({
            'clients': [dict(client) for client in clients],
            'count': len(clients)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@client_bp.route('/<int:client_id>', methods=['GET'])
def get_client(client_id):
    """Get a specific client"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("SELECT * FROM clients WHERE id = %s", (client_id,))
        client = cur.fetchone()
        
        cur.close()
        conn.close()
        
        if not client:
            return jsonify({'error': 'Client not found'}), 404
        
        return jsonify({'client': dict(client)}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
