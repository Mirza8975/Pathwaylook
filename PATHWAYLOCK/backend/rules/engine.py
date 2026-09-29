"""
PathwayLock Decision Engine
Deterministic rule-based engine for livelihood pathway validation
"""
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import math

class PathwayLockEngine:
    """
    Deterministic decision engine for GREEN/YELLOW/RED recommendations

    Rules:
    - LLM assists with understanding/extraction
    - Engine makes final decision based on rules
    - No random scores
    """

    # Weights for overall score calculation
    WEIGHTS = {
        "skill_fit": 0.35,
        "aspiration_match": 0.20,
        "distance": 0.15,
        "employment_type": 0.15,
        "training_accessibility": 0.15
    }

    # Source type weights
    SOURCE_WEIGHTS = {
        "FIELD_VERIFIED": 0.90,
        "PUBLIC_SOURCE": 0.85,
        "SAMPLE_DATA": 0.70,
        "SYNTHETIC": 0.30
    }

    # Verification weights
    VERIFICATION_WEIGHTS = {
        "COUNSELLOR_VERIFIED": 1.0,
        "UNVERIFIED": 0.65
    }

    # Decision thresholds
    GREEN_SCORE_THRESHOLD = 0.70
    GREEN_CONFIDENCE_THRESHOLD = 0.75
    YELLOW_SCORE_THRESHOLD = 0.50
    RED_CONFIDENCE_THRESHOLD = 0.40

    # Freshness decay (half-life: 120 days)
    FRESHNESS_HALF_LIFE_DAYS = 120

    @staticmethod
    def calculate_skill_fit(
        beneficiary_skills: List[str],
        required_skills: List[str]
    ) -> Tuple[float, List[str]]:
        """
        Calculate skill fit score and identify matched skills

        Returns: (score, matched_skills)
        """
        if not required_skills:
            return 1.0, []

        # Normalize skills to lowercase for comparison
        beneficiary_skills_lower = [s.lower().strip() for s in beneficiary_skills]
        required_skills_lower = [s.lower().strip() for s in required_skills]

        # Find matches
        matched = []
        for req_skill in required_skills_lower:
            for ben_skill in beneficiary_skills_lower:
                if req_skill in ben_skill or ben_skill in req_skill:
                    matched.append(req_skill)
                    break

        # Calculate score
        score = len(matched) / len(required_skills_lower) if required_skills_lower else 0

        return score, matched

    @staticmethod
    def calculate_aspiration_match(
        beneficiary_aspiration: Optional[str],
        opportunity_occupation: str
    ) -> float:
        """Calculate how well the opportunity matches beneficiary's aspiration"""
        if not beneficiary_aspiration:
            return 0.5  # Neutral if no aspiration specified

        aspiration_lower = beneficiary_aspiration.lower().strip()
        occupation_lower = opportunity_occupation.lower().strip()

        # Exact match
        if aspiration_lower == occupation_lower:
            return 1.0

        # Partial match
        if aspiration_lower in occupation_lower or occupation_lower in aspiration_lower:
            return 0.8

        # Related keywords
        aspiration_keywords = set(aspiration_lower.split())
        occupation_keywords = set(occupation_lower.split())

        if aspiration_keywords & occupation_keywords:
            return 0.6

        return 0.3  # No match

    @staticmethod
    def calculate_distance_score(
        distance_km: float,
        mobility_radius_km: Optional[float]
    ) -> float:
        """
        Calculate distance score based on mobility constraint

        Returns 0 if beyond mobility radius (hard constraint)
        """
        if mobility_radius_km is None:
            # No constraint specified, use reasonable default scoring
            if distance_km <= 5:
                return 1.0
            elif distance_km <= 10:
                return 0.7
            elif distance_km <= 15:
                return 0.5
            else:
                return 0.3

        # Hard constraint: beyond radius = 0
        if distance_km > mobility_radius_km:
            return 0.0

        # Within radius: score based on proximity
        if distance_km <= mobility_radius_km * 0.5:
            return 1.0
        elif distance_km <= mobility_radius_km * 0.75:
            return 0.8
        else:
            return 0.6

    @staticmethod
    def calculate_employment_type_score(
        opportunity_type: str,
        preferred_type: Optional[str]
    ) -> float:
        """Calculate employment type match score"""
        if not preferred_type:
            return 0.8  # Neutral if no preference

        opp_type_lower = opportunity_type.lower().strip()
        pref_type_lower = preferred_type.lower().strip()

        if opp_type_lower == pref_type_lower:
            return 1.0

        # Flexible matches anything
        if pref_type_lower == "flexible" or opp_type_lower == "flexible":
            return 0.9

        return 0.5  # Mismatch but not blocking

    @staticmethod
    def calculate_training_accessibility(
        training_availability: Optional[str]
    ) -> float:
        """Calculate training accessibility score"""
        if not training_availability:
            return 0.5

        availability_lower = training_availability.lower()

        if availability_lower == "available":
            return 1.0
        elif availability_lower == "limited":
            return 0.6
        else:  # "not available"
            return 0.0

    @staticmethod
    def calculate_opportunity_confidence(
        source_type: str,
        verification_status: str,
        last_verified_at: Optional[datetime]
    ) -> float:
        """
        Calculate confidence in opportunity based on source, verification, and freshness

        confidence = sourceWeight * verificationWeight * freshness
        """
        # Source weight
        source_weight = PathwayLockEngine.SOURCE_WEIGHTS.get(source_type, 0.5)

        # Verification weight
        verification_weight = PathwayLockEngine.VERIFICATION_WEIGHTS.get(verification_status, 0.65)

        # Freshness calculation
        if last_verified_at is None:
            freshness = 0.5  # Unknown freshness
        else:
            days_since = (datetime.utcnow() - last_verified_at).days
            # Exponential decay with half-life
            freshness = 0.5 ** (days_since / PathwayLockEngine.FRESHNESS_HALF_LIFE_DAYS)
            freshness = max(0.3, min(1.0, freshness))  # Clamp between 0.3 and 1.0

        return source_weight * verification_weight * freshness

    @staticmethod
    def calculate_overall_score(
        skill_fit: float,
        aspiration_match: float,
        distance_score: float,
        employment_type_score: float,
        training_accessibility: float
    ) -> float:
        """Calculate weighted overall score"""
        w = PathwayLockEngine.WEIGHTS

        overall = (
            skill_fit * w["skill_fit"] +
            aspiration_match * w["aspiration_match"] +
            distance_score * w["distance"] +
            employment_type_score * w["employment_type"] +
            training_accessibility * w["training_accessibility"]
        )

        return round(overall, 2)

    @staticmethod
    def make_decision(
        overall_score: float,
        opportunity_confidence: float,
        coverage_status: str,
        counsellor_verified: bool,
        training_pathway_exists: bool
    ) -> Tuple[str, str]:
        """
        Make final GREEN/YELLOW/RED decision

        Returns: (decision, explanation)
        """

        # RED: Coverage never searched
        if coverage_status == "NEVER_SEARCHED":
            return (
                "RED_UNCOVERED",
                "Available evidence is insufficient to validate this pathway. Local opportunity coverage for this occupation has not yet been established."
            )

        # RED: No training pathway
        if not training_pathway_exists:
            return (
                "RED_NO_TRAINING_PATHWAY",
                "No viable NSQF-aligned training pathway is currently available for this role."
            )

        # RED: Very low confidence in opportunity
        if opportunity_confidence < PathwayLockEngine.RED_CONFIDENCE_THRESHOLD:
            return (
                "RED",
                f"Opportunity confidence ({opportunity_confidence:.2f}) is insufficient for pathway validation. Evidence quality or freshness is too low."
            )

        # GREEN: All conditions met
        if (
            overall_score >= PathwayLockEngine.GREEN_SCORE_THRESHOLD and
            opportunity_confidence >= PathwayLockEngine.GREEN_CONFIDENCE_THRESHOLD and
            counsellor_verified and
            coverage_status == "SEARCHED_FOUND"
        ):
            return (
                "GREEN",
                f"Pathway validated with high confidence. Overall match score: {overall_score:.2f}, Opportunity confidence: {opportunity_confidence:.2f}. Counsellor verified. Training pathway available."
            )

        # YELLOW: Moderate score but insufficient confidence
        if (
            overall_score >= PathwayLockEngine.YELLOW_SCORE_THRESHOLD and
            coverage_status == "SEARCHED_FOUND"
        ):
            reasons = []

            if opportunity_confidence < PathwayLockEngine.GREEN_CONFIDENCE_THRESHOLD:
                reasons.append(f"opportunity confidence ({opportunity_confidence:.2f}) below threshold")

            if not counsellor_verified:
                reasons.append("counsellor verification pending")

            if overall_score < PathwayLockEngine.GREEN_SCORE_THRESHOLD:
                reasons.append(f"overall score ({overall_score:.2f}) below GREEN threshold")

            explanation = f"Opportunity exists but confidence is insufficient for GREEN validation. Issues: {', '.join(reasons)}. Additional verification recommended."

            return ("YELLOW", explanation)

        # RED: Low overall score
        return (
            "RED",
            f"Overall pathway match score ({overall_score:.2f}) is too low. Significant skill gaps, distance constraints, or employment type mismatch detected."
        )

    @staticmethod
    def identify_skill_gaps(
        required_skills: List[str],
        matched_skills: List[str]
    ) -> List[str]:
        """Identify skills that are required but not matched"""
        required_lower = [s.lower().strip() for s in required_skills]
        matched_lower = [s.lower().strip() for s in matched_skills]

        gaps = [skill for skill in required_lower if skill not in matched_lower]
        return gaps
