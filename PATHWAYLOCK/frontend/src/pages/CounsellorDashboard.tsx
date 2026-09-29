import { useState, useEffect } from 'react';
import { getPendingReviews, getReviewedRecommendations, submitReview } from '../services/api';
import { Recommendation } from '../types';

export default function CounsellorDashboard() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewerName, setReviewerName] = useState('Demo Counsellor');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, [activeTab]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pending') {
        const response = await getPendingReviews();
        setRecommendations(response.data);
      } else {
        const status = activeTab === 'approved' ? 'COUNSELLOR_VERIFIED' : 'REJECTED';
        const response = await getReviewedRecommendations(status);
        setRecommendations(response.data);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (recId: number, status: string) => {
    setSubmitting(true);
    try {
      await submitReview({
        recommendation_id: recId,
        status,
        notes: reviewNotes,
        reviewer: reviewerName,
      });
      setSelectedRec(null);
      setReviewNotes('');
      loadRecommendations();
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const getDecisionColor = (decision: string) => {
    if (decision === 'GREEN') return 'text-success';
    if (decision === 'YELLOW') return 'text-warning';
    return 'text-danger';
  };

  const formatScore = (score?: number) => {
    return score ? (score * 100).toFixed(0) + '%' : 'N/A';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">Counsellor Dashboard</h1>

      {/* Tabs */}
      <div className="card mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3 rounded-lg font-medium ${
              activeTab === 'pending' ? 'bg-primary text-white' : 'bg-gray-100 text-body'
            }`}
          >
            Pending Reviews
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex-1 py-3 rounded-lg font-medium ${
              activeTab === 'approved' ? 'bg-success text-white' : 'bg-gray-100 text-body'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`flex-1 py-3 rounded-lg font-medium ${
              activeTab === 'rejected' ? 'bg-danger text-white' : 'bg-gray-100 text-body'
            }`}
          >
            Needs More Evidence
          </button>
        </div>
      </div>

      {/* Counsellor Name */}
      {activeTab === 'pending' && (
        <div className="card mb-6">
          <label className="label">Counsellor Name</label>
          <input
            type="text"
            className="input"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
          />
        </div>
      )}

      {/* Recommendations List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-body">Loading recommendations...</div>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-body">No recommendations found in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-primary">{rec.beneficiary?.name}</h3>
                  <p className="text-sm text-body">
                    Aspiration: <span className="font-medium">{rec.beneficiary?.aspiration}</span>
                  </p>
                  {rec.opportunity && (
                    <p className="text-sm text-body">
                      Matched Opportunity: <span className="font-medium">{rec.opportunity.title}</span>
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getDecisionColor(rec.decision)}`}>
                    {rec.decision.replace('_', ' ')}
                  </div>
                  <div className="text-sm text-body mt-1">
                    Score: {formatScore(rec.overall_score)}
                  </div>
                  <div className="text-sm text-body">
                    Confidence: {formatScore(rec.opportunity_confidence)}
                  </div>
                </div>
              </div>

              {selectedRec?.id === rec.id ? (
                <div className="pt-4 border-t border-border">
                  <div className="mb-4">
                    <label className="label">Review Notes</label>
                    <textarea
                      className="input min-h-[100px]"
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Enter your review notes..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleReview(rec.id, 'COUNSELLOR_VERIFIED')}
                      disabled={submitting}
                      className="btn-primary flex-1"
                    >
                      {submitting ? 'Submitting...' : '✓ Approve'}
                    </button>
                    <button
                      onClick={() => handleReview(rec.id, 'MORE_EVIDENCE_REQUIRED')}
                      disabled={submitting}
                      className="bg-warning text-white px-6 py-3 rounded-lg font-medium hover:bg-warning/80 transition-colors flex-1"
                    >
                      {submitting ? 'Submitting...' : '⚠ Request More Evidence'}
                    </button>
                    <button
                      onClick={() => handleReview(rec.id, 'REJECTED')}
                      disabled={submitting}
                      className="bg-danger text-white px-6 py-3 rounded-lg font-medium hover:bg-danger/80 transition-colors flex-1"
                    >
                      {submitting ? 'Submitting...' : '✗ Reject'}
                    </button>
                    <button
                      onClick={() => setSelectedRec(null)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-body mb-4">{rec.explanation}</p>

                  {activeTab === 'pending' ? (
                    <button
                      onClick={() => setSelectedRec(rec)}
                      className="btn-primary"
                    >
                      Review This Recommendation
                    </button>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-primary">
                        Reviewed by: {rec.reviewed_by}
                      </div>
                      {rec.counsellor_notes && (
                        <div className="text-sm text-body mt-1">Notes: {rec.counsellor_notes}</div>
                      )}
                      <div className="text-xs text-body mt-1">
                        {new Date(rec.reviewed_at!).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
