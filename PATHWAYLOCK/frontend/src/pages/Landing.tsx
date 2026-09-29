import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Validate the livelihood pathway before training.
        </h1>
        <p className="text-lg text-body max-w-2xl mx-auto">
          PathwayLock combines beneficiary skills, aspirations, constraints and local opportunity
          evidence to validate a suitable livelihood pathway before recommending training.
        </p>
      </div>

      <div className="card max-w-2xl mx-auto">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/assessment')}
            className="btn-primary w-full text-lg py-4"
          >
            Start Assessment
          </button>

          <button
            onClick={() => navigate('/counsellor')}
            className="btn-secondary w-full text-lg py-4"
          >
            Counsellor Login
          </button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-primary mb-2">Evidence-Based</h3>
          <p className="text-sm text-body">
            Local opportunity intelligence with source verification and freshness tracking.
          </p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-primary mb-2">NSQF-Aligned</h3>
          <p className="text-sm text-body">
            Structured training pathways mapped to National Skills Qualifications Framework.
          </p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-primary mb-2">Explainable</h3>
          <p className="text-sm text-body">
            Transparent GREEN/YELLOW/RED decisions with full score breakdown and reasoning.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-body">
        <p>Smart India Hackathon 2026 - PS 26097</p>
        <p className="mt-1">PM-AJAY GIA Component</p>
      </div>
    </div>
  );
}
