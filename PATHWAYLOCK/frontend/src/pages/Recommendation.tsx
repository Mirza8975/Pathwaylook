import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecommendation } from '../services/api';
import { Recommendation as RecommendationType } from '../types';

export default function Recommendation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState<RecommendationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadRecommendation(parseInt(id));
    }
  }, [id]);

  const loadRecommendation = async (recId: number) => {
    setLoading(true);
    try {
      const response = await getRecommendation(recId);
      setRecommendation(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load recommendation');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-body">Loading recommendation...</div>
      </div>
    );
  }

  if (error || !recommendation) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-danger-light border border-danger text-danger px-4 py-3 rounded-lg">
          {error || 'Recommendation not found'}
        </div>
      </div>
    );
  }

  const getDecisionColor = (decision: string) => {
    if (decision === 'GREEN') return 'bg-success text-white';
    if (decision === 'YELLOW') return 'bg-warning text-white';
    return 'bg-danger text-white';
  };

  const getDecisionBorderColor = (decision: string) => {
    if (decision === 'GREEN') return 'border-success';
    if (decision === 'YELLOW') return 'border-warning';
    return 'border-danger';
  };

  const getDecisionBgColor = (decision: string) => {
    if (decision === 'GREEN') return 'bg-success-light';
    if (decision === 'YELLOW') return 'bg-warning-light';
    return 'bg-danger-light';
  };

  const formatScore = (score?: number) => {
    return score ? (score * 100).toFixed(0) + '%' : 'N/A';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">PathwayLock Recommendation</h1>

      {/* Decision Header */}
      <div className={`card border-4 ${getDecisionBorderColor(recommendation.decision)} ${getDecisionBgColor(recommendation.decision)} mb-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              {recommendation.beneficiary?.name}
            </h2>
            <p className="text-body">
              Aspiration: <span className="font-medium">{recommendation.beneficiary?.aspiration}</span>
            </p>
          </div>
          <div className={`px-8 py-4 rounded-xl ${getDecisionColor(recommendation.decision)} text-3xl font-bold`}>
            {recommendation.decision.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-primary mb-3">Decision Explanation</h3>
        <p className="text-body">{recommendation.explanation}</p>
      </div>

      {/* Score Breakdown */}
      {recommendation.overall_score !== null && recommendation.overall_score !== undefined && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Score Breakdown</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary">{formatScore(recommendation.overall_score)}</div>
              <div className="text-sm text-body">Overall Match Score</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary">{formatScore(recommendation.opportunity_confidence)}</div>
              <div className="text-sm text-body">Opportunity Confidence</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-body">Skill Fit</span>
                <span className="text-sm font-medium">{formatScore(recommendation.skill_fit)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full"
                  style={{ width: `${(recommendation.skill_fit || 0) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-body">Aspiration Match</span>
                <span className="text-sm font-medium">{formatScore(recommendation.aspiration_match)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full"
                  style={{ width: `${(recommendation.aspiration_match || 0) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-body">Distance Score</span>
                <span className="text-sm font-medium">{formatScore(recommendation.distance_score)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full"
                  style={{ width: `${(recommendation.distance_score || 0) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-body">Employment Type Fit</span>
                <span className="text-sm font-medium">{formatScore(recommendation.employment_type_score)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full"
                  style={{ width: `${(recommendation.employment_type_score || 0) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-body">Training Accessibility</span>
                <span className="text-sm font-medium">{formatScore(recommendation.training_accessibility_score)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full"
                  style={{ width: `${(recommendation.training_accessibility_score || 0) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Opportunity Evidence */}
      {recommendation.opportunity && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Matched Opportunity</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">{recommendation.opportunity.title}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-body">Location:</span>
                <span className="ml-2 font-medium">{recommendation.opportunity.location}</span>
              </div>
              <div>
                <span className="text-body">Distance:</span>
                <span className="ml-2 font-medium">{recommendation.opportunity.distance_km?.toFixed(1)} km</span>
              </div>
              <div>
                <span className="text-body">Type:</span>
                <span className="ml-2 font-medium">{recommendation.opportunity.employment_type}</span>
              </div>
              <div>
                <span className="text-body">Source:</span>
                <span className="ml-2 font-medium">{recommendation.opportunity.source_type}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <div className="text-sm">
                <span className="text-body">Verification:</span>
                <span className={`ml-2 font-medium ${recommendation.opportunity.verification_status === 'COUNSELLOR_VERIFIED' ? 'text-success' : 'text-warning'}`}>
                  {recommendation.opportunity.verification_status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skills Analysis */}
      {(recommendation.matched_skills?.length || recommendation.skill_gaps?.length) ? (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Skills Analysis</h3>

          {recommendation.matched_skills && recommendation.matched_skills.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-body mb-2">Matched Skills</h4>
              <div className="flex flex-wrap gap-2">
                {recommendation.matched_skills.map((skill, idx) => (
                  <span key={idx} className="bg-success text-white px-3 py-1 rounded-full text-sm">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {recommendation.skill_gaps && recommendation.skill_gaps.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-body mb-2">Skill Gaps</h4>
              <div className="flex flex-wrap gap-2">
                {recommendation.skill_gaps.map((skill, idx) => (
                  <span key={idx} className="bg-warning text-white px-3 py-1 rounded-full text-sm">
                    ⚠ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* NSQF Training Pathway */}
      {recommendation.nsqf_pathway && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Recommended Training Pathway</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">{recommendation.nsqf_pathway.training_pathway.course_name}</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-body">Provider:</span>
                <span className="ml-2 font-medium">{recommendation.nsqf_pathway.training_pathway.provider}</span>
              </div>
              <div>
                <span className="text-body">Duration:</span>
                <span className="ml-2 font-medium">{recommendation.nsqf_pathway.training_pathway.duration_months} months</span>
              </div>
              <div>
                <span className="text-body">NSQF Level:</span>
                <span className="ml-2 font-medium">{recommendation.nsqf_pathway.nsqf_level}</span>
              </div>
              <div>
                <span className="text-body">Availability:</span>
                <span className="ml-2 font-medium">{recommendation.nsqf_pathway.training_availability}</span>
              </div>
            </div>
            {recommendation.nsqf_pathway.training_pathway.modules && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="text-sm text-body mb-1">Training Modules:</div>
                <ul className="list-disc list-inside text-sm">
                  {recommendation.nsqf_pathway.training_pathway.modules.map((module, idx) => (
                    <li key={idx}>{module}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Coverage Status */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-primary mb-3">Coverage Status</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-body">
            {recommendation.coverage_status === 'SEARCHED_FOUND' && '✓ Local opportunities have been searched and found'}
            {recommendation.coverage_status === 'SEARCHED_NONE' && '⚠ Local opportunities have been searched but none found'}
            {recommendation.coverage_status === 'NEVER_SEARCHED' && '✗ Local opportunity evidence has not yet been established'}
          </div>
        </div>
      </div>

      {/* Counsellor Status */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-primary mb-3">Counsellor Review Status</h3>
        <div className={`px-4 py-3 rounded-lg ${
          recommendation.counsellor_status === 'COUNSELLOR_VERIFIED' ? 'bg-success-light border border-success' :
          recommendation.counsellor_status === 'REJECTED' ? 'bg-danger-light border border-danger' :
          recommendation.counsellor_status === 'MORE_EVIDENCE_REQUIRED' ? 'bg-warning-light border border-warning' :
          'bg-gray-100 border border-border'
        }`}>
          <div className="font-medium">{recommendation.counsellor_status}</div>
          {recommendation.counsellor_notes && (
            <div className="text-sm mt-2">{recommendation.counsellor_notes}</div>
          )}
          {recommendation.reviewed_by && (
            <div className="text-xs text-body mt-2">
              Reviewed by: {recommendation.reviewed_by} on {new Date(recommendation.reviewed_at!).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button onClick={() => navigate('/')} className="btn-secondary flex-1">
          ← Back to Home
        </button>
        <button onClick={() => navigate('/counsellor')} className="btn-primary flex-1">
          Send to Counsellor for Review
        </button>
      </div>
    </div>
  );
}
