'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft, Mic, Square, Send, Play, Pause, Heart,
  MessagesSquare, Volume2, Loader2,
} from 'lucide-react';

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function VoiceAssistantClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get('report_id');
  const fetchWithAuth = useAuthenticatedFetch();
  const toast = useToast();

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [answer, setAnswer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  const [contextMode, setContextMode] = useState('personal');

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 60;
      const gap = 3;
      const barWidth = (canvas.width - (barCount - 1) * gap) / barCount;
      const step = Math.floor(bufferLength / barCount);

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step];
        const barHeight = Math.max(4, (value / 255) * canvas.height * 0.85);
        const x = i * (barWidth + gap);
        const y = (canvas.height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, '#34d399');
        gradient.addColorStop(1, '#059669');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }
    };
    draw();
  };

  const startRecording = async () => {
    setAnswer('');
    setTranscription('');
    setAudioUrl(null);
    setDuration(0);
    setSelectedAudioFile(null);
    setContextMode('personal');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      drawWaveform();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Timer
      const start = Date.now();
      timerRef.current = setInterval(() => {
        setDuration((Date.now() - start) / 1000);
      }, 100);
    } catch {
      toast.error('Microphone access is required to record.');
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    recorder.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    // Clear canvas to static bars
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSend = async () => {
    if (!selectedAudioFile && chunksRef.current.length === 0) {
      toast.warning('Record audio before sending.');
      return;
    }
    setIsProcessing(true);
    try {
      const formData = new FormData();
      if (selectedAudioFile) {
        formData.append('audio', selectedAudioFile, selectedAudioFile.name);
      } else {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        formData.append('audio', audioBlob, 'voice.webm');
      }
      if (reportId) formData.append('report_id', reportId);

      const data = await fetchWithAuth('/api/v1/voice', { method: 'POST', body: formData });
      setTranscription(data.transcription || '');
      setAnswer(data.answer || '');
      setContextMode(data.contextMode || ((data.sources || []).length === 0 ? 'general' : 'personal'));
      if (data.audio) {
        const audioBytes = Uint8Array.from(data.audio, (c) => c.charCodeAt(0));
        const blob = new Blob([audioBytes], { type: data.audioMime || 'audio/mpeg' });
        setAudioUrl(URL.createObjectURL(blob));
      }
      toast.success('Voice response received');
    } catch (err) {
      toast.error(err.message || 'Failed to process voice request');
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f4f0ea] via-white to-[#eef6ff]">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600">
                  <Volume2 className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-slate-900">Voice Assistant</h1>
                  <p className="text-[10px] text-emerald-600 font-medium">Speak · Transcribe · Answer</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/chat')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              aria-label="Switch to text chat"
            >
              <MessagesSquare className="h-3.5 w-3.5" aria-hidden="true" />
              Text Chat
            </button>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
          {/* Recording area */}
          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">Upload a voice note</p>
                <p className="text-xs text-slate-500">Use a microphone recording or choose an audio file.</p>
              </div>
              <label className="inline-flex cursor-pointer items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
                Choose file
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => setSelectedAudioFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            {selectedAudioFile && (
              <p className="mb-4 text-xs text-slate-500">Selected file: {selectedAudioFile.name}</p>
            )}

            {/* Waveform */}
            <div className="rounded-2xl bg-slate-900 p-6 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={700}
                height={120}
                className="w-full"
                aria-label={isRecording ? 'Audio waveform visualization — recording' : 'Audio waveform — idle'}
              />
            </div>

            {/* Timer and status */}
            <div className="mt-4 flex items-center justify-between">
              <p className={`text-sm font-mono font-semibold ${isRecording ? 'text-rose-500' : 'text-slate-500'}`}>
                {formatTime(duration)}
              </p>
              <p className="text-xs text-slate-400">
                {isRecording ? (
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse-dot" />
                    Recording...
                  </span>
                ) : duration > 0 ? 'Recording complete' : 'Ready to record'}
              </p>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-center gap-4">
              {/* Record / Stop */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`flex h-16 w-16 items-center justify-center rounded-full transition-all shadow-lg ${
                  isRecording
                    ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200 scale-110'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 hover:shadow-xl hover:shadow-emerald-200'
                } disabled:opacity-50`}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
              >
                {isRecording ? (
                  <Square className="h-6 w-6 text-white" />
                ) : (
                  <Mic className="h-7 w-7 text-white" />
                )}
              </button>

              {/* Send */}
              <button
                onClick={handleSend}
                disabled={isProcessing || isRecording || (!selectedAudioFile && chunksRef.current.length === 0)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition hover:bg-slate-800 disabled:opacity-30"
                aria-label="Send recording to AI"
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Transcription */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Transcription</p>
              <p className={`text-sm leading-relaxed ${transcription ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                {transcription || 'Record and send audio to see transcription...'}
              </p>
            </div>

            {/* AI Answer */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              {contextMode === 'general' && (
                <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  General medical info only. No personal document context was found for this answer.
                </div>
              )}
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">AI Response</p>
              <p className={`text-sm leading-relaxed ${answer ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                {answer || 'Waiting for your question...'}
              </p>

              {/* Audio playback */}
              {audioUrl && (
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <button
                    onClick={togglePlayback}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-600"
                    aria-label={isPlaying ? 'Pause audio response' : 'Play audio response'}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                  </button>
                  <div className="flex-1">
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onEnded={() => setIsPlaying(false)}
                      className="w-full"
                      controls
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}