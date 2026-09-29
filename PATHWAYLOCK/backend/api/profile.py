"""
Profile extraction API using Gemini
"""
from fastapi import APIRouter, HTTPException
from schemas.schemas import ProfileExtractionRequest, ProfileExtractionResponse, ExtractedField
from services.ai_service import extract_profile_from_text
import os

router = APIRouter()

@router.post("/profile/extract", response_model=ProfileExtractionResponse)
async def extract_profile(request: ProfileExtractionRequest):
    """Extract structured profile from voice/text using AI"""

    # Check if Gemini API key is configured
    if not os.getenv("GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY") == "your_gemini_api_key_here":
        # Return a graceful error with instructions
        raise HTTPException(
            status_code=503,
            detail="AI profile extraction is not configured. Please set GEMINI_API_KEY in backend/.env file."
        )

    try:
        # Use the text or voice transcript
        text_to_process = request.voice_transcript if request.voice_transcript else request.text

        # Call AI service
        extracted_data = await extract_profile_from_text(text_to_process)

        # Add raw text to response
        extracted_data["raw_text"] = text_to_process

        return ProfileExtractionResponse(**extracted_data)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Profile extraction failed: {str(e)}"
        )
