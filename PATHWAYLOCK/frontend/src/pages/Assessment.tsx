import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBeneficiary } from '../services/api';
import { Beneficiary } from '../types';

export default function Assessment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
  });

  const [skillInput, setSkillInput] = useState('');
  const [traditionalSkillInput, setTraditionalSkillInput] = useState('');
  const [constraintInput, setConstraintInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await createBeneficiary(formData);
      const beneficiaryId = response.data.id;

      // Navigate to profile review with beneficiary data
      navigate('/profile-review', { state: { beneficiary: response.data, fromAssessment: true } });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save beneficiary profile');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData({ ...formData, skills: [...(formData.skills || []), skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = [...(formData.skills || [])];
    newSkills.splice(index, 1);
    setFormData({ ...formData, skills: newSkills });
  };

  const addTraditionalSkill = () => {
    if (traditionalSkillInput.trim()) {
      setFormData({
        ...formData,
        traditional_skills: [...(formData.traditional_skills || []), traditionalSkillInput.trim()],
      });
      setTraditionalSkillInput('');
    }
  };

  const removeTraditionalSkill = (index: number) => {
    const newSkills = [...(formData.traditional_skills || [])];
    newSkills.splice(index, 1);
    setFormData({ ...formData, traditional_skills: newSkills });
  };

  const addConstraint = () => {
    if (constraintInput.trim()) {
      setFormData({
        ...formData,
        constraints: [...(formData.constraints || []), constraintInput.trim()],
      });
      setConstraintInput('');
    }
  };

  const removeConstraint = (index: number) => {
    const newConstraints = [...(formData.constraints || [])];
    newConstraints.splice(index, 1);
    setFormData({ ...formData, constraints: newConstraints });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">Beneficiary Assessment</h1>

      <div className="card mb-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => navigate('/voice-intake')}
            className="btn-primary flex-1"
          >
            🎤 Start Voice Intake
          </button>
          <div className="text-center py-2 text-body">or</div>
          <div className="flex-1 text-center py-2 text-body font-medium">Continue with Text Form</div>
        </div>
      </div>

      {error && (
        <div className="bg-danger-light border border-danger text-danger px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="label">Name *</label>
          <input
            type="text"
            required
            className="input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Age</label>
            <input
              type="number"
              className="input"
              value={formData.age || ''}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
            />
          </div>

          <div>
            <label className="label">Education</label>
            <select
              className="input"
              value={formData.education || ''}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            >
              <option value="">Select</option>
              <option value="No formal education">No formal education</option>
              <option value="Primary">Primary</option>
              <option value="5th Pass">5th Pass</option>
              <option value="8th Pass">8th Pass</option>
              <option value="10th Pass">10th Pass</option>
              <option value="12th Pass">12th Pass</option>
              <option value="Graduate">Graduate</option>
            </select>
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
          <label className="label">Existing Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="Enter a skill"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <button type="button" onClick={addSkill} className="btn-secondary">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills?.map((skill, index) => (
              <span
                key={index}
                className="bg-secondary text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <button type="button" onClick={() => removeSkill(index)} className="font-bold">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Traditional / Family Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="Enter a traditional skill"
              value={traditionalSkillInput}
              onChange={(e) => setTraditionalSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTraditionalSkill())}
            />
            <button type="button" onClick={addTraditionalSkill} className="btn-secondary">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.traditional_skills?.map((skill, index) => (
              <span
                key={index}
                className="bg-accent text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <button type="button" onClick={() => removeTraditionalSkill(index)} className="font-bold">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Aspiration (What job/occupation do you want?) *</label>
          <input
            type="text"
            required
            className="input"
            placeholder="e.g., Tailoring, Beauty assistant, Data entry"
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
              placeholder="How far can you travel?"
              value={formData.mobility_radius_km || ''}
              onChange={(e) =>
                setFormData({ ...formData, mobility_radius_km: parseFloat(e.target.value) || undefined })
              }
            />
          </div>

          <div>
            <label className="label">Work Preference</label>
            <select
              className="input"
              value={formData.work_preference || ''}
              onChange={(e) => setFormData({ ...formData, work_preference: e.target.value })}
            >
              <option value="">Select</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="flexible">Flexible hours</option>
              <option value="self-employment">Self-employment</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Constraints</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="Enter a constraint"
              value={constraintInput}
              onChange={(e) => setConstraintInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addConstraint())}
            />
            <button type="button" onClick={addConstraint} className="btn-secondary">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.constraints?.map((constraint, index) => (
              <span
                key={index}
                className="bg-gray-300 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {constraint}
                <button type="button" onClick={() => removeConstraint(index)} className="font-bold">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Saving...' : 'Continue to Profile Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
