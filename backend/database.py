import sqlite3
from contextlib import contextmanager
import hashlib
import os

DATABASE_URL = os.getenv("DATABASE_URL", "lesson_converter.db")

def init_db():
    """Initialize database with users table"""
    conn = sqlite3.connect(DATABASE_URL.replace("sqlite:///./", ""))
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create sample user: user@example.com / password123
    sample_password = hashlib.sha256("password123".encode()).hexdigest()
    cursor.execute('''
        INSERT OR IGNORE INTO users (email, password_hash) 
        VALUES (?, ?)
    ''', ("user@example.com", sample_password))
    
    conn.commit()
    conn.close()

@contextmanager
def get_db_connection():
    """Database connection context manager"""
    conn = sqlite3.connect(DATABASE_URL.replace("sqlite:///./", ""))
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def create_user(email: str, password_hash: str):
    """Create new user"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (email, password_hash) VALUES (?, ?)",
            (email, password_hash)
        )
        conn.commit()
        return cursor.lastrowid

def get_user_by_email(email: str):
    """Get user by email"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        return cursor.fetchone()

# Password reset helpers (simple in-memory for demo)
reset_tokens = {}

def save_reset_token(email: str, token: str):
    """Save password reset token (in-memory for demo)"""
    reset_tokens[email] = token

def get_reset_token(email: str):
    """Get password reset token"""
    return reset_tokens.get(email)

def delete_reset_token(email: str):
    """Delete password reset token"""
    if email in reset_tokens:
        del reset_tokens[email]

def update_user_password(email: str, password_hash: str):
    """Update user's password"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET password_hash = ? WHERE email = ?", (password_hash, email))
        conn.commit()
