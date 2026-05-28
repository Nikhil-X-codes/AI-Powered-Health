'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';
import { ArrowLeft, Mic, Square, Play } from 'lucide-react';

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function VoiceAssistantPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get('report_id');
  const fetchWithAuth = useAuthenticatedFetch();

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) {
      return;
    }

    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i += 4) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = `rgba(30, 64, 175, ${0.2 + barHeight / canvas.height})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth * 3, barHeight);
        x += barWidth * 3.5;
      }
    };

    draw();
  };

  const startRecording = async () => {
    setError(null);
    setAnswer('');
    setTranscription('');
    setAudioUrl(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      drawWaveform();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      startTimeRef.current = Date.now();
      setIsRecording(true);
    } catch (err) {
      setError('Microphone access is required to record.');
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) {
      return;
    }

    recorder.stop();
    setIsRecording(false);
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    setDuration(elapsed);

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleSend = async () => {
    if (chunksRef.current.length === 0) {
      setError('Record audio before sending.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice.webm');
      if (reportId) {
        formData.append('report_id', reportId);
      }

      const data = await fetchWithAuth('/api/v1/voice', {
        method: 'POST',
        body: formData,
      });

      setTranscription(data.transcription || '');
      setAnswer(data.answer || '');
      if (data.audio) {
        const audioBytes = Uint8Array.from(data.audio, (c) => c.charCodeAt(0));
        const audioBlob = new Blob([audioBytes], { type: data.audioMime || 'audio/mpeg' });
        setAudioUrl(URL.createObjectURL(audioBlob));
      }
    } catch (err) {
      setError(err.message || 'Failed to process voice request');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#f1f4ff] via-white to-[#eef6ff] text-slate-900">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </button>
            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500">
              Voice Assistant
            </div>
          </header>

          <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-semibold">Speak your question</h1>
                <p className="mt-2 text-sm text-slate-600">
                  Record a short question and let the assistant respond with audio.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                    isRecording
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {isRecording ? 'Stop recording' : 'Start recording'}
                </button>
                <button
                  onClick={handleSend}
                  disabled={isProcessing || isRecording}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 disabled:opacity-60"
                >
                  {isProcessing ? 'Processing...' : 'Send to AI'}
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{isRecording ? 'Recording...' : 'Waveform preview'}</span>
                <span>{duration > 0 ? formatTime(duration) : '0:00'}</span>
              </div>
              <canvas ref={canvasRef} width={900} height={120} className="mt-3 w-full" />
            </div>

            {error && (
              <p className="mt-4 rounded-full bg-rose-100 px-4 py-2 text-xs font-semibold text-rose-700">
                {error}
              </p>
            )}
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Transcription</p>
              <h2 className="text-lg font-semibold">What we heard</h2>
              <p className="mt-3 text-sm text-slate-700">
                {transcription || 'No transcription yet.'}
              </p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">AI response</p>
              <h2 className="text-lg font-semibold">Answer</h2>
              <p className="mt-3 text-sm text-slate-700">
                {answer || 'Waiting for response.'}
              </p>
              {audioUrl && (
                <div className="mt-4 flex items-center gap-3">
                  <audio controls src={audioUrl} className="w-full" />
                  <Play className="h-4 w-4 text-slate-400" />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
