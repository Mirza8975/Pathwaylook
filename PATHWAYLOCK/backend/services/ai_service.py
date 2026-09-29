"""
AI Service for profile extraction using Gemini API
"""
import google.generativeai as genai
import os
import json
from typing import Dict, Any

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))

async def extract_profile_from_text(text: str) -> Dict[str, Any]:
    """
    Extract structured beneficiary profile from text using Gemini

    Returns a dictionary with ExtractedField objects
    """

    prompt = f"""
You are an AI assistant helping extract beneficiary information for a livelihood pathway assessment program.

Extract the following information from the text below. Return ONLY valid JSON.

For each field, provide:
- "value": the extracted value (or null if not found)
- "confidence": a confidence score between 0.0 and 1.0

Fields to extract:
- name: person's name
- age: age in years (integer)
- education: highest education level
- location: city/area name
- current_livelihood: current job or occupation
- skills: list of skills mentioned (array of strings)
- traditional_skills: family or traditional skills (array of strings)
- aspiration: what job/occupation they want to do
- mobility_radius_km: how far they can travel for work (number)
- work_preference: "full-time", "part-time", "flexible", or "self-employment"
- constraints: any limitations mentioned (array of strings)
- training_history: previous trainings attended (array of strings)

IMPORTANT:
- Return null for missing information - do NOT make up data
- Be conservative with confidence scores
- Return valid JSON only

Text to analyze:
\"\"\"
{text}
\"\"\"

Return JSON in this exact format:
{{
  "name": {{"value": "Rekha", "confidence": 0.95}} or {{"value": null, "confidence": 0.0}},
  "age": {{"value": 24, "confidence": 0.90}} or {{"value": null, "confidence": 0.0}},
  "education": {{"value": "10th Pass", "confidence": 0.85}},
  "location": {{"value": "Mumbai", "confidence": 0.80}},
  "current_livelihood": {{"value": "tailoring", "confidence": 0.85}},
  "skills": {{"value": ["stitching", "tailoring"], "confidence": 0.90}},
  "traditional_skills": {{"value": ["embroidery"], "confidence": 0.70}},
  "aspiration": {{"value": "tailoring", "confidence": 0.90}},
  "mobility_radius_km": {{"value": 5.0, "confidence": 0.75}},
  "work_preference": {{"value": "flexible", "confidence": 0.80}},
  "constraints": {{"value": ["childcare", "flexible hours needed"], "confidence": 0.85}},
  "training_history": {{"value": ["basic stitching course"], "confidence": 0.80}}
}}
"""

    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)

        # Parse JSON response
        response_text = response.text.strip()

        # Remove markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]

        response_text = response_text.strip()

        # Parse JSON
        extracted_data = json.loads(response_text)

        return extracted_data

    except json.JSONDecodeError as e:
        # Fallback: return empty structure
        print(f"JSON decode error: {e}")
        return create_empty_profile()
    except Exception as e:
        print(f"AI extraction error: {e}")
        return create_empty_profile()

def create_empty_profile() -> Dict[str, Any]:
    """Create an empty profile structure"""
    return {
        "name": {"value": None, "confidence": 0.0},
        "age": {"value": None, "confidence": 0.0},
        "education": {"value": None, "confidence": 0.0},
        "location": {"value": None, "confidence": 0.0},
        "current_livelihood": {"value": None, "confidence": 0.0},
        "skills": {"value": [], "confidence": 0.0},
        "traditional_skills": {"value": [], "confidence": 0.0},
        "aspiration": {"value": None, "confidence": 0.0},
        "mobility_radius_km": {"value": None, "confidence": 0.0},
        "work_preference": {"value": None, "confidence": 0.0},
        "constraints": {"value": [], "confidence": 0.0},
        "training_history": {"value": [], "confidence": 0.0}
    }
