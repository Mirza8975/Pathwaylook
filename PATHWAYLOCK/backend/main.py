"""
PathwayLock Backend
FastAPI application for livelihood pathway validation
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from api import beneficiaries, opportunities, nsqf, recommendations, counsellor, profile, sync

# Load environment variables
load_dotenv()

app = FastAPI(
    title="PathwayLock API",
    description="AI-Assisted, Voice-First Livelihood Pathway Validation",
    version="1.0.0"
)

# CORS Configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(beneficiaries.router, prefix="/api", tags=["beneficiaries"])
app.include_router(opportunities.router, prefix="/api", tags=["opportunities"])
app.include_router(nsqf.router, prefix="/api", tags=["nsqf"])
app.include_router(recommendations.router, prefix="/api", tags=["recommendations"])
app.include_router(counsellor.router, prefix="/api", tags=["counsellor"])
app.include_router(profile.router, prefix="/api", tags=["profile"])
app.include_router(sync.router, prefix="/api", tags=["sync"])

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "PathwayLock API",
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "PathwayLock API",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
