import { useState, useEffect } from 'react';
import { listOpportunities } from '../services/api';
import { Opportunity } from '../types';

export default function OpportunityIntelligence() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const response = await listOpportunities();
      setOpportunities(response.data);
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(
    (opp) =>
      opp.title.toLowerCase().includes(filter.toLowerCase()) ||
      opp.occupation.toLowerCase().includes(filter.toLowerCase()) ||
      opp.location.toLowerCase().includes(filter.toLowerCase())
  );

  const getSourceTypeColor = (sourceType?: string) => {
    switch (sourceType) {
      case 'FIELD_VERIFIED':
        return 'bg-success text-white';
      case 'PUBLIC_SOURCE':
        return 'bg-secondary text-white';
      case 'SAMPLE_DATA':
        return 'bg-warning text-white';
      default:
        return 'bg-gray-300 text-primary';
    }
  };

  const getVerificationColor = (status?: string) => {
    return status === 'COUNSELLOR_VERIFIED' ? 'text-success' : 'text-warning';
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-400';
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    return 'text-danger';
  };

  const getDaysAgo = (dateString?: string) => {
    if (!dateString) return 'Never';
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days ago`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">Opportunity Intelligence</h1>

      <div className="card mb-6 bg-warning-light border-warning">
        <h3 className="font-semibold text-warning mb-2">Prototype Dataset</h3>
        <p className="text-sm text-body">
          This is a structured prototype dataset. These are not real government vacancies. Real opportunity data
          sources will be integrated in production.
        </p>
      </div>

      <div className="card mb-6">
        <input
          type="text"
          className="input"
          placeholder="Filter by title, occupation, or location..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-body">Loading opportunities...</div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOpportunities.map((opp) => (
            <div key={opp.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-primary">{opp.title}</h3>
                  <p className="text-sm text-body">{opp.occupation}</p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getConfidenceColor(opp.confidence)}`}>
                    {opp.confidence ? (opp.confidence * 100).toFixed(0) : '?'}%
                  </div>
                  <div className="text-xs text-body">Confidence</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-body mb-1">Location</div>
                  <div className="font-medium">{opp.location}</div>
                </div>
                <div>
                  <div className="text-xs text-body mb-1">Distance</div>
                  <div className="font-medium">{opp.distance_km?.toFixed(1)} km</div>
                </div>
                <div>
                  <div className="text-xs text-body mb-1">Employment Type</div>
                  <div className="font-medium">{opp.employment_type || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-body mb-1">Qualification</div>
                  <div className="font-medium">{opp.qualification || 'N/A'}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-body mb-1">Required Skills</div>
                <div className="flex flex-wrap gap-2">
                  {opp.required_skills?.map((skill, idx) => (
                    <span key={idx} className="bg-gray-100 text-primary px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex flex-wrap items-center gap-4 text-sm">
                <div>
                  <span className="text-body">Source:</span>
                  <span className="ml-2 font-medium">{opp.source}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${getSourceTypeColor(opp.source_type)}`}>
                  {opp.source_type}
                </span>
                <div className={getVerificationColor(opp.verification_status)}>
                  {opp.verification_status === 'COUNSELLOR_VERIFIED' ? '✓ Verified' : '⚠ Unverified'}
                </div>
                <div className="text-body">Last verified: {getDaysAgo(opp.last_verified_at)}</div>
              </div>

              {opp.description && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-body">{opp.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && filteredOpportunities.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-body">No opportunities found matching your filter.</p>
        </div>
      )}
    </div>
  );
}
