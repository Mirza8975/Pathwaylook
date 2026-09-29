import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBeneficiary, generateRecommendation } from '../services/api';
import { Beneficiary, ProfileExtractionResponse } from '../types';

export default function ProfileReview() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const extractedProfile: ProfileExtractionResponse | undefined = location.state?.extractedProfile;
  const existingBeneficiary: Beneficiary | undefined = location.state?.beneficiary;
  const voiceTranscript: string | undefined = location.state?.voiceTranscript;
  const fromAssessment: boolean = location.state?.fromAssessment;

  const [formData, setFormData] = useState<Beneficiary>({
    name: '',
    age: undefined,
    education: '',
    location: '',
    current_livelihood: '',
    skills: [],
    traditional_skills: [],
    aspiration: '',
    mobility_radius_km: undefined,
    work_preference: '',
    constraints: [],
    training_history: [],
    voice_transcript: voiceTranscript,
  });

  useEffect(() => {
    if (existingBeneficiary) {
      setFormData(existingBeneficiary);
    } else if (extractedProfile) {
      setFormData({
        name: extractedProfile.name?.value || '',
        age: extractedProfile.age?.value,
        education: extractedProfile.education?.value || '',
        location: extractedProfile.location?.value || '',
        current_livelihood: extractedProfile.current_livelihood?.value || '',
        skills: extractedProfile.skills?.value || [],
        traditional_skills: extractedProfile.traditional_skills?.value || [],
        aspiration: extractedProfile.aspiration?.value || '',
        mobility_radius_km: extractedProfile.mobility_radius_km?.value,
        work_preference: extractedProfile.work_preference?.value || '',
        constraints: extractedProfile.constraints?.value || [],
        training_history: extractedProfile.training_history?.value || [],
        voice_transcript: voiceTranscript,
      });
    }
  }, [extractedProfile, existingBeneficiary, voiceTranscript]);

  const handleConfirm = async () => {
    setError('');
    setLoading(true);

    try {
      let beneficiaryId = existingBeneficiary?.id;

      if (!beneficiaryId) {
        const response = await createBeneficiary(formData);
        beneficiaryId = response.data.id;
      }

      // Generate recommendation
      const recResponse = await generateRecommendation(beneficiaryId);
      navigate(`/recommendation/${recResponse.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate recommendation');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-400';
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">Profile Review</h1>

      {extractedProfile && !fromAssessment && (
        <div className="card mb-6 bg-success-light border-success">
          <h3 className="font-semibold text-success mb-2">✓ Profile Extracted with AI</h3>
          <p className="text-sm text-body">
            Review the extracted information below. Edit any fields if needed, then confirm to proceed.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-danger-light border border-danger text-danger px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="card space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <label className="label">Name</label>
            {extractedProfile?.name?.confidence && (
              <span className={`text-xs ${getConfidenceColor(extractedProfile.name.confidence)}`}>
                Confidence: {(extractedProfile.name.confidence * 100).toFixed(0)}%
              </span>
            )}
          </div>
          <input
            type="text"
            className="input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="label">Age</label>
              {extractedProfile?.age?.confidence && (
                <span className={`text-xs ${getConfidenceColor(extractedProfile.age.confidence)}`}>
                  {(extractedProfile.age.confidence * 100).toFixed(0)}%
                </span>
              )}
            </div>
            <input
              type="number"
              className="input"
              value={formData.age || ''}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="label">Education</label>
              {extractedProfile?.education?.confidence && (
                <span className={`text-xs ${getConfidenceColor(extractedProfile.education.confidence)}`}>
                  {(extractedProfile.education.confidence * 100).toFixed(0)}%
                </span>
              )}
            </div>
            <input
              type="text"
              className="input"
              value={formData.education || ''}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="label">Location</label>
          <input
            type="text"
            className="input"
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Current Livelihood</label>
          <input
            type="text"
            className="input"
            value={formData.current_livelihood || ''}
            onChange={(e) => setFormData({ ...formData, current_livelihood: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Skills</label>
          <div className="flex flex-wrap gap-2">
            {formData.skills?.map((skill, index) => (
              <span key={index} className="bg-secondary text-white px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Traditional Skills</label>
          <div className="flex flex-wrap gap-2">
            {formData.traditional_skills?.map((skill, index) => (
              <span key={index} className="bg-accent text-white px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Aspiration</label>
          <input
            type="text"
            className="input"
            value={formData.aspiration || ''}
            onChange={(e) => setFormData({ ...formData, aspiration: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Mobility Radius (km)</label>
            <input
              type="number"
              step="0.1"
              className="input"
              value={formData.mobility_radius_km || ''}
              onChange={(e) =>
                setFormData({ ...formData, mobility_radius_km: parseFloat(e.target.value) || undefined })
              }
            />
          </div>

          <div>
            <label className="label">Work Preference</label>
            <input
              type="text"
              className="input"
              value={formData.work_preference || ''}
              onChange={(e) => setFormData({ ...formData, work_preference: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="label">Constraints</label>
          <div className="flex flex-wrap gap-2">
            {formData.constraints?.map((constraint, index) => (
              <span key={index} className="bg-gray-300 text-primary px-3 py-1 rounded-full text-sm">
                {constraint}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-border">
          <button onClick={() => navigate(-1)} className="btn-secondary flex-1">
            ← Back
          </button>
          <button onClick={handleConfirm} disabled={loading} className="btn-primary flex-1">
            {loading ? 'Generating Recommendation...' : 'Confirm Profile & Generate Recommendation'}
          </button>
        </div>
      </div>
    </div>
  );
}
