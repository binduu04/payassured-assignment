from flask import Blueprint, request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
import os

case_bp = Blueprint('cases', __name__)

# Database connection helper
def get_db_connection():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    return conn

# Validation helper
def validate_case_data(data):
    """Simple validation for case data"""
    required_fields = ['client_id', 'invoice_number', 'invoice_amount', 'invoice_date', 'due_date']
    for field in required_fields:
        if field not in data or data[field] is None:
            return False, f'{field} is required'
    
    # Validate status if provided
    valid_statuses = ['New', 'In Follow-up', 'Partially Paid', 'Closed']
    if 'status' in data and data['status'] not in valid_statuses:
        return False, f'Status must be one of: {valid_statuses}'
    
    return True, None


# ============== CASE ROUTES ==============

@case_bp.route('', methods=['POST'])
def create_case():
    """Create a new case"""
    try:
        data = request.get_json()
        
        # Validate data
        is_valid, error = validate_case_data(data)
        if not is_valid:
            return jsonify({'error': error}), 400
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Check if client exists
        cur.execute("SELECT id FROM clients WHERE id = %s", (data['client_id'],))
        if not cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({'error': 'Client not found'}), 404
        
        # Check if invoice number already exists
        cur.execute("SELECT id FROM cases WHERE invoice_number = %s", (data['invoice_number'],))
        if cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({'error': 'Invoice number already exists'}), 409
        
        # Insert new case
        cur.execute("""
            INSERT INTO cases (client_id, invoice_number, invoice_amount, invoice_date, due_date, status, last_follow_up_notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (data['client_id'], data['invoice_number'], data['invoice_amount'],
              data['invoice_date'], data['due_date'], data.get('status', 'New'),
              data.get('last_follow_up_notes', '')))
        
        case_id = cur.fetchone()['id']
        conn.commit()
        
        # Get the created case with client info
        cur.execute("""
            SELECT c.*, cl.client_name, cl.company_name
            FROM cases c
            JOIN clients cl ON c.client_id = cl.id
            WHERE c.id = %s
        """, (case_id,))
        
        case = cur.fetchone()
        cur.close()
        conn.close()
        
        return jsonify({
            'message': 'Case created successfully',
            'case': dict(case)
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@case_bp.route('', methods=['GET'])
def get_cases():
    """Get all cases with optional filtering and sorting"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Build query based on filters
        query = """
            SELECT c.*, cl.client_name, cl.company_name
            FROM cases c
            JOIN clients cl ON c.client_id = cl.id
        """
        params = []
        
        # Filter by status
        status = request.args.get('status')
        if status:
            query += " WHERE c.status = %s"
            params.append(status)
        
        # Sort by due_date
        sort = request.args.get('sort', 'asc')
        if sort == 'desc':
            query += " ORDER BY c.due_date DESC"
        else:
            query += " ORDER BY c.due_date ASC"
        
        cur.execute(query, params)
        cases = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify({
            'cases': [dict(case) for case in cases],
            'count': len(cases)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@case_bp.route('/<int:case_id>', methods=['GET'])
def get_case(case_id):
    """Get a specific case"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT c.*, cl.client_name, cl.company_name
            FROM cases c
            JOIN clients cl ON c.client_id = cl.id
            WHERE c.id = %s
        """, (case_id,))
        
        case = cur.fetchone()
        cur.close()
        conn.close()
        
        if not case:
            return jsonify({'error': 'Case not found'}), 404
        
        return jsonify({'case': dict(case)}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@case_bp.route('/<int:case_id>', methods=['PATCH'])
def update_case(case_id):
    """Update case status and follow-up notes"""
    try:
        data = request.get_json()
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Check if case exists
        cur.execute("SELECT id FROM cases WHERE id = %s", (case_id,))
        if not cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({'error': 'Case not found'}), 404
        
        # Build update query
        updates = []
        params = []
        
        if 'status' in data:
            valid_statuses = ['New', 'In Follow-up', 'Partially Paid', 'Closed']
            if data['status'] not in valid_statuses:
                cur.close()
                conn.close()
                return jsonify({'error': f'Status must be one of: {valid_statuses}'}), 400
            updates.append("status = %s")
            params.append(data['status'])
        
        if 'last_follow_up_notes' in data:
            updates.append("last_follow_up_notes = %s")
            params.append(data['last_follow_up_notes'])
        
        if updates:
            params.append(case_id)
            query = f"UPDATE cases SET {', '.join(updates)} WHERE id = %s"
            cur.execute(query, params)
            conn.commit()
        
        # Get updated case
        cur.execute("""
            SELECT c.*, cl.client_name, cl.company_name
            FROM cases c
            JOIN clients cl ON c.client_id = cl.id
            WHERE c.id = %s
        """, (case_id,))
        
        case = cur.fetchone()
        cur.close()
        conn.close()
        
        return jsonify({
            'message': 'Case updated successfully',
            'case': dict(case)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
