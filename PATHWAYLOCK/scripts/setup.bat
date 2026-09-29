@echo off
REM Setup script for PathwayLock MVP on Windows

echo ==========================================
echo PathwayLock MVP Setup
echo ==========================================

REM Backend setup
echo.
echo Setting up backend...
cd backend

REM Create .env file
if not exist .env (
    echo Creating backend/.env file...
    copy .env.example .env
    echo WARNING: Please edit backend/.env and add your GEMINI_API_KEY
)

REM Create virtual environment
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Initialize database
echo Initializing database...
python -m database.init_db

echo Backend setup complete

REM Frontend setup
cd ..\frontend
echo.
echo Setting up frontend...

REM Create .env file
if not exist .env (
    echo Creating frontend/.env file...
    copy .env.example .env
)

REM Install dependencies
echo Installing Node dependencies...
call npm install

echo Frontend setup complete

cd ..

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Edit backend\.env and add your GEMINI_API_KEY
echo 2. Start the backend: cd backend && venv\Scripts\activate && uvicorn main:app --reload
echo 3. Start the frontend: cd frontend && npm run dev
echo 4. Open http://localhost:5173 in your browser
echo.
pause
