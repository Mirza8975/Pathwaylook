#!/bin/bash
# Setup script for PathwayLock MVP

set -e

echo "=========================================="
echo "PathwayLock MVP Setup"
echo "=========================================="

# Backend setup
echo ""
echo "Setting up backend..."
cd backend

# Create .env file
if [ ! -f .env ]; then
    echo "Creating backend/.env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and add your GEMINI_API_KEY"
fi

# Create virtual environment
if [ ! -d venv ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Initialize database
echo "Initializing database..."
python -m database.init_db

echo "✓ Backend setup complete"

# Frontend setup
cd ../frontend
echo ""
echo "Setting up frontend..."

# Create .env file
if [ ! -f .env ]; then
    echo "Creating frontend/.env file..."
    cp .env.example .env
fi

# Install dependencies
echo "Installing Node dependencies..."
npm install

echo "✓ Frontend setup complete"

cd ..

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Edit backend/.env and add your GEMINI_API_KEY"
echo "2. Start the backend: cd backend && source venv/bin/activate && uvicorn main:app --reload"
echo "3. Start the frontend: cd frontend && npm run dev"
echo "4. Open http://localhost:5173 in your browser"
echo ""
