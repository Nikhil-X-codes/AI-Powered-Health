'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, FileAudio2, Loader2, Mic, Send, Square, Upload } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';
import { useToast } from '@/components/ui/Toast';

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function InlineVoiceAssistant({ isOpen, onClose, onSubmitted, reportId, prescriptionId }) {
  const fetchWithAuth = useAuthenticatedFetch();
  const toast = useToast();

  const [step, setStep] = useState('choose');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  const [recordedAudioFile, setRecordedAudioFile] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const resetState = () => {
    setStep('choose');
    setIsRecording(false);
    setIsProcessing(false);
    setDuration(0);
    setSelectedAudioFile(null);
    setRecordedAudioFile(null);
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const stopTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const cleanupRecording = () => {
    stopTimers();
    stopStream();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  };

  useEffect(() => {
    if (!isOpen) {
      cleanupRecording();
      resetState();
      return;
    }

    resetState();

    return () => {
      cleanupRecording();
    };
  }, [isOpen]);

  const closeModal = () => {
    cleanupRecording();
    resetState();
    onClose();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const preferredMimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find((mimeType) =>
        MediaRecorder.isTypeSupported(mimeType)
      );

      const mediaRecorder = preferredMimeType
        ? new MediaRecorder(stream, { mimeType: preferredMimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const extension = mimeType.includes('mp4') ? 'm4a' : 'webm';
        const recordedBlob = new Blob(chunksRef.current, { type: mimeType });

        cleanupRecording();
        setIsRecording(false);

        if (recordedBlob.size > 0) {
          setRecordedAudioFile(
            new File([recordedBlob], `voice-recording.${extension}`, { type: mimeType })
          );
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setDuration(0);

      const startedAt = Date.now();
      timerRef.current = setInterval(() => {
        setDuration((Date.now() - startedAt) / 1000);
      }, 100);
    } catch {
      toast.error('Microphone access is required to record.');
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    if (recorder.state === 'recording') {
      recorder.stop();
    }

    setIsRecording(false);
    stopTimers();
  };

  const handleSend = async () => {
    const audioSource = selectedAudioFile || recordedAudioFile;
    if (!audioSource) {
      toast.warning('Choose or record audio before sending.');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioSource, audioSource.name);
      if (reportId) {
        formData.append('report_id', reportId);
      }
      if (prescriptionId) {
        formData.append('prescription_id', prescriptionId);
      }

      const data = await fetchWithAuth('/api/v1/voice', { method: 'POST', body: formData });
      onSubmitted?.(data);
      toast.success('Voice response added to chat');
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to process voice request');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Voice options"
      description="Record audio or upload a file without leaving chat."
      size="lg"
    >
      {step === 'choose' && (
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setStep('record')}
            className="flex flex-col items-start rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-100"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
              <Mic className="h-5 w-5" />
            </span>
            <span className="mt-4 text-sm font-semibold text-emerald-900">Record a voice note</span>
            <span className="mt-1 text-sm leading-6 text-emerald-700">
              Speak naturally and send the recording into this chat.
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStep('upload')}
            className="flex flex-col items-start rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-slate-300 hover:bg-slate-100"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Upload className="h-5 w-5" />
            </span>
            <span className="mt-4 text-sm font-semibold text-slate-900">Upload audio</span>
            <span className="mt-1 text-sm leading-6 text-slate-600">
              Use an existing voice note or recording from your device.
            </span>
          </button>
        </div>
      )}

      {step === 'record' && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setStep('choose')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to choices
          </button>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm font-semibold text-slate-800">Record a voice note</p>
            <p className="mt-1 text-sm text-slate-500">Your recording stays on this page and can be sent to chat.</p>

            <div className="mt-4 flex items-center justify-between">
              <p className={`text-sm font-mono font-semibold ${isRecording ? 'text-rose-500' : 'text-slate-500'}`}>
                {formatTime(duration)}
              </p>
              <p className="text-xs text-slate-400">{isRecording ? 'Recording...' : 'Ready to record'}</p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all disabled:opacity-50 ${
                  isRecording
                    ? 'bg-rose-500 text-white shadow-rose-200 hover:bg-rose-600'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:shadow-xl hover:shadow-emerald-200'
                }`}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
              >
                {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-7 w-7" />}
              </button>

              <button
                type="button"
                onClick={handleSend}
                disabled={isProcessing || (!selectedAudioFile && !recordedAudioFile)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition hover:bg-slate-800 disabled:opacity-30"
                aria-label="Send voice note to chat"
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </div>

            {recordedAudioFile && (
              <p className="mt-4 text-xs text-slate-500">Recorded file ready: {recordedAudioFile.name}</p>
            )}
          </div>
        </div>
      )}

      {step === 'upload' && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setStep('choose')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to choices
          </button>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm font-semibold text-slate-800">Upload an audio file</p>
            <p className="mt-1 text-sm text-slate-500">Choose a voice note from your device and send it into chat.</p>

            <label className="mt-4 flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50">
              <span className="inline-flex items-center gap-2">
                <FileAudio2 className="h-4 w-4 text-emerald-600" />
                {selectedAudioFile ? selectedAudioFile.name : 'Choose audio file'}
              </span>
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(event) => {
                  setSelectedAudioFile(event.target.files?.[0] || null);
                  setRecordedAudioFile(null);
                }}
              />
            </label>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={isProcessing || !selectedAudioFile}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200/40 transition hover:shadow-lg hover:shadow-emerald-300/50 disabled:opacity-40"
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send to chat
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}