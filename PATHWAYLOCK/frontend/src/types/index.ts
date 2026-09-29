export interface Beneficiary {
  id?: number;
  name: string;
  age?: number;
  education?: string;
  location?: string;
  current_livelihood?: string;
  skills?: string[];
  traditional_skills?: string[];
  aspiration?: string;
  mobility_radius_km?: number;
  work_preference?: string;
  constraints?: string[];
  training_history?: string[];
  voice_transcript?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExtractedField<T = any> {
  value: T;
  confidence?: number;
}

export interface ProfileExtractionResponse {
  name?: ExtractedField<string>;
  age?: ExtractedField<number>;
  education?: ExtractedField<string>;
  location?: ExtractedField<string>;
  current_livelihood?: ExtractedField<string>;
  skills?: ExtractedField<string[]>;
  traditional_skills?: ExtractedField<string[]>;
  aspiration?: ExtractedField<string>;
  mobility_radius_km?: ExtractedField<number>;
  work_preference?: ExtractedField<string>;
  constraints?: ExtractedField<string[]>;
  training_history?: ExtractedField<string[]>;
  raw_text: string;
}

export interface Opportunity {
  id: number;
  title: string;
  occupation: string;
  location: string;
  distance_km?: number;
  employment_type?: string;
  required_skills?: string[];
  qualification?: string;
  source?: string;
  source_type?: string;
  last_verified_at?: string;
  verification_status?: string;
  confidence?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Coverage {
  id: number;
  occupation: string;
  location?: string;
  status: 'SEARCHED_FOUND' | 'SEARCHED_NONE' | 'NEVER_SEARCHED';
  last_searched_at?: string;
  opportunities_count: number;
  created_at: string;
  updated_at: string;
}

export interface NSQFPathway {
  id: number;
  occupation: string;
  role: string;
  nsqf_level?: number;
  required_skills: string[];
  skill_gaps: string[];
  training_pathway: {
    course_name: string;
    provider: string;
    duration_months: number;
    modules: string[];
  };
  training_duration_months?: number;
  training_availability?: string;
  source_label?: string;
  created_at: string;
  updated_at: string;
}

export interface Recommendation {
  id: number;
  beneficiary_id: number;
  opportunity_id?: number;
  nsqf_pathway_id?: number;
  decision: 'GREEN' | 'YELLOW' | 'RED' | 'RED_UNCOVERED' | 'RED_NO_TRAINING_PATHWAY';
  overall_score?: number;
  opportunity_confidence?: number;
  skill_fit?: number;
  aspiration_match?: number;
  distance_score?: number;
  employment_type_score?: number;
  training_accessibility_score?: number;
  coverage_status?: string;
  matched_skills?: string[];
  skill_gaps?: string[];
  explanation?: string;
  counsellor_status?: string;
  counsellor_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  beneficiary?: Beneficiary;
  opportunity?: Opportunity;
  nsqf_pathway?: NSQFPathway;
}

export interface CounsellorReview {
  recommendation_id: number;
  status: 'COUNSELLOR_VERIFIED' | 'MORE_EVIDENCE_REQUIRED' | 'REJECTED';
  notes?: string;
  reviewer: string;
}
