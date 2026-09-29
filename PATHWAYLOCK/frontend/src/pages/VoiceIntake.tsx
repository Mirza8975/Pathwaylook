import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVoiceService, VoiceRecognitionResult } from '../services/voiceService';
import { extractProfile } from '../services/api';

export default function VoiceIntake() {
  const navigate = useNavigate();
  const [voiceService] = useState(() => createVoiceService({ language: 'en-IN' }));
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!voiceService.isAvailable()) {
      setError('Voice input is unavailable in this browser. Please continue with text.');
    }

    voiceService.onResult((result: VoiceRecognitionResult) => {
      if (result.isFinal) {
        setTranscript((prev) => prev + ' ' + result.transcript);
        setInterimTranscript('');
      } else {
        setInterimTranscript(result.transcript);
      }
    });

    voiceService.onError((err: string) => {
      setError(`Voice recognition error: ${err}`);
      setIsListening(false);
    });

    voiceService.onEnd(() => {
      setIsListening(false);
    });
  }, [voiceService]);

  const startListening = () => {
    setError('');
    setIsListening(true);
    voiceService.start();
  };

  const stopListening = () => {
    setIsListening(false);
    voiceService.stop();
  };

  const handleUseTranscript = async () => {
    if (!transcript.trim()) {
      setError('Please record some audio first');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const response = await extractProfile(transcript, transcript);
      navigate('/profile-review', {
        state: {
          extractedProfile: response.data,
          voiceTranscript: transcript,
        },
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to extract profile from voice input');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">Voice Intake</h1>

      <div className="card mb-6">
        <div className="bg-warning-light border border-warning text-warning px-4 py-3 rounded-lg mb-4">
          <strong>Prototype Voice Input</strong>
          <p className="text-sm mt-1">
            Using browser-based speech recognition. BHASHINI integration for multilingual support is pending.
          </p>
        </div>

        {!voiceService.isAvailable() && (
          <div className="bg-danger-light border border-danger text-danger px-4 py-3 rounded-lg mb-4">
            Voice input is unavailable in this browser. Please continue with text.
          </div>
        )}

        {error && (
          <div className="bg-danger-light border border-danger text-danger px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="text-center py-12">
          {!isListening ? (
            <button
              onClick={startListening}
              disabled={!voiceService.isAvailable()}
              className="btn-primary text-xl px-12 py-6 rounded-full"
            >
              🎤 Start Recording
            </button>
          ) : (
            <button onClick={stopListening} className="btn-secondary text-xl px-12 py-6 rounded-full animate-pulse">
              ⏸️ Stop Recording
            </button>
          )}

          {isListening && (
            <div className="mt-6">
              <div className="flex justify-center items-center gap-2">
                <div className="w-3 h-3 bg-danger rounded-full animate-pulse"></div>
                <span className="text-danger font-medium">Listening...</span>
              </div>
            </div>
          )}
        </div>

        {(transcript || interimTranscript) && (
          <div className="mt-6">
            <label className="label">Transcript</label>
            <div className="bg-gray-50 border border-border rounded-lg p-4 min-h-[200px]">
              <p className="text-body whitespace-pre-wrap">
                {transcript}
                {interimTranscript && <span className="text-gray-400"> {interimTranscript}</span>}
              </p>
            </div>

            <div className="mt-4">
              <label className="label">Edit Transcript (if needed)</label>
              <textarea
                className="input min-h-[150px]"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              />
            </div>
          </div>
        )}

        {transcript && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleUseTranscript}
              disabled={isProcessing}
              className="btn-primary flex-1"
            >
              {isProcessing ? 'Extracting Profile...' : 'Use Transcript'}
            </button>
            <button onClick={() => setTranscript('')} className="btn-secondary">
              Clear
            </button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-border">
          <button onClick={() => navigate('/assessment')} className="btn-secondary w-full">
            ← Back to Text Form
          </button>
        </div>
      </div>

      <div className="card bg-gray-50">
        <h3 className="font-semibold text-primary mb-2">Sample Voice Input</h3>
        <p className="text-sm text-body italic">
          "My name is Rekha. I am 24 years old and I have passed 10th standard. I live in Mumbai. Currently, I do
          stitching and tailoring work at home. I know basic stitching, taking measurements, and simple tailoring. My
          mother also does embroidery, so I learned some embroidery from her. I want to work as a tailor in a shop or
          garment factory. I can travel up to 5 kilometers. I prefer flexible hours because I have a small child at
          home. I need work close to home because of childcare."
        </p>
      </div>
    </div>
  );
}
