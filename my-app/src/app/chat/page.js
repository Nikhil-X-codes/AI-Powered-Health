'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AIMessage } from '@/components/chat/AIMessage';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatInput } from '@/components/chat/ChatInput';
import { InlineVoiceAssistant } from '@/components/chat/InlineVoiceAssistant';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { UserMessage } from '@/components/chat/UserMessage';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';
import { useToast } from '@/components/ui/Toast';
import {
  ArrowLeft, Heart, Trash2, Plus, MessagesSquare, Volume2,
} from 'lucide-react';

const QUICK_PROMPTS = [
  'Explain my hemoglobin levels',
  'What does this medicine do?',
  'Summarize my latest report',
  'Are my glucose levels normal?',
  'What are the side effects?',
];

function formatDateSeparator(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, hydrated } = useAuth();
  const fetchWithAuth = useAuthenticatedFetch();
  const toast = useToast();
  const reportId = searchParams.get('report_id');
  const prescriptionId = searchParams.get('prescription_id');
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeReportId, setActiveReportId] = useState('');
  const [activePrescriptionId, setActivePrescriptionId] = useState('');
  const [activeDocumentType, setActiveDocumentType] = useState('');
  const [isReportsLoading, setIsReportsLoading] = useState(true);
  const [isPrescriptionsLoading, setIsPrescriptionsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!hydrated) {
      return () => {
        cancelled = true;
      };
    }

    const loadReports = async () => {
      try {
        setIsReportsLoading(true);
        const data = await fetchWithAuth('/api/v1/reports');
        const list = data.reports || data.data || [];

        if (cancelled) return;

        setReports(list);
      } catch {
        if (!cancelled) {
          toast.error('Failed to load your reports');
          setReports([]);
        }
      } finally {
        if (!cancelled) setIsReportsLoading(false);
      }
    };

    const loadPrescriptions = async () => {
      try {
        setIsPrescriptionsLoading(true);
        const data = await fetchWithAuth('/api/v1/prescriptions');
        const list = data.prescriptions || data.data || [];

        if (cancelled) return;

        setPrescriptions(list);
      } catch {
        if (!cancelled) {
          toast.error('Failed to load your prescriptions');
          setPrescriptions([]);
        }
      } finally {
        if (!cancelled) setIsPrescriptionsLoading(false);
      }
    };

    void loadReports();
    void loadPrescriptions();

    return () => {
      cancelled = true;
    };
  }, [fetchWithAuth, hydrated, reportId, prescriptionId, toast]);

  const selectedDocument = useMemo(() => {
    if (activeDocumentType === 'report' && activeReportId) {
      return reports.find((report) => report.id === activeReportId) || null;
    }

    if (activeDocumentType === 'prescription' && activePrescriptionId) {
      return prescriptions.find((prescription) => prescription.id === activePrescriptionId) || null;
    }

    return null;
  }, [activeDocumentType, activePrescriptionId, activeReportId, prescriptions, reports]);

  const selectedDocumentLabel = activeDocumentType === 'prescription'
    ? selectedDocument?.display_name || 'Prescription'
    : selectedDocument?.report_name || 'Medical Report';
  const hasSelectableDocuments = reports.length > 0 || prescriptions.length > 0;

  useEffect(() => {
    if (!hydrated || activeDocumentType) return;

    if (reportId && reports.some((report) => report.id === reportId)) {
      setActiveDocumentType('report');
      setActiveReportId(reportId);
      setActivePrescriptionId('');
      return;
    }

    if (prescriptionId && prescriptions.some((prescription) => prescription.id === prescriptionId)) {
      setActiveDocumentType('prescription');
      setActivePrescriptionId(prescriptionId);
      setActiveReportId('');
      return;
    }

    if (reports.length > 0) {
      setActiveDocumentType('report');
      setActiveReportId(reports[0].id);
      setActivePrescriptionId('');
      return;
    }

    if (prescriptions.length > 0) {
      setActiveDocumentType('prescription');
      setActivePrescriptionId(prescriptions[0].id);
      setActiveReportId('');
    }
  }, [activeDocumentType, hydrated, prescriptionId, prescriptions, reportId, reports]);

  useEffect(() => {
    let cancelled = false;
    const loadHistory = async () => {
      try {
        const data = await fetchWithAuth('/api/v1/chat/history');
        const history = (data.messages || []).flatMap((entry) => [
          { id: `${entry.id}-user`, role: 'user', content: entry.userMessage, createdAt: entry.createdAt, sources: [] },
          { id: `${entry.id}-ai`, role: 'assistant', content: entry.aiResponse, createdAt: entry.createdAt, sources: [] },
        ]);
        if (!cancelled) { setMessages(history); }
      } catch {
        if (!cancelled) toast.error('Failed to load chat history');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void loadHistory();
    return () => { cancelled = true; };
  }, [fetchWithAuth, toast]);

  const handleSend = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || isSending) return;

    const userMessage = {
      id: `local-${Date.now()}`,
      role: 'user',
      content: messageText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const useRag = Boolean(activeDocumentType && (activeReportId || activePrescriptionId));
      const endpoint = useRag ? '/api/v1/chat/rag' : '/api/v1/chat/quick';
      const body = useRag
        ? activeDocumentType === 'prescription'
          ? {
              question: messageText,
              user_id: user?.userId,
              prescription_id: activePrescriptionId,
            }
          : {
              question: messageText,
              user_id: user?.userId,
              report_id: activeReportId,
            }
        : { question: messageText };

      const data = await fetchWithAuth(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const assistantMessage = {
        id: `local-${Date.now()}-ai`,
        role: 'assistant',
        content: data.response || data.answer || 'No answer',
        createdAt: new Date().toISOString(),
        sources: data.sources || [],
        contextMode: data.contextMode || ((data.sources || []).length === 0 ? 'general' : 'personal'),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      toast.error(err.message || 'AI is temporarily unavailable. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  const handleVoiceSubmitted = (data) => {
    const transcription = data?.transcription || '';
    const answer = data?.answer || data?.response || '';
    const createdAt = new Date().toISOString();

    if (transcription) {
      setMessages((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}-voice-user`,
          role: 'user',
          content: transcription,
          createdAt,
          sources: [],
        },
      ]);
    }

    if (answer) {
      setMessages((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}-voice-ai`,
          role: 'assistant',
          content: answer,
          createdAt,
          sources: data?.sources || [],
          contextMode: data?.contextMode || ((data?.sources || []).length === 0 ? 'general' : 'personal'),
        },
      ]);
    }
  };

  // Group messages by date
  const messagesWithSeparators = useMemo(() => {
    const result = [];
    let lastDate = null;
    for (const msg of messages) {
      const dateLabel = formatDateSeparator(msg.createdAt);
      if (dateLabel && dateLabel !== lastDate) {
        result.push({ type: 'separator', label: dateLabel, id: `sep-${dateLabel}-${msg.id}` });
        lastDate = dateLabel;
      }
      result.push({ type: 'message', ...msg });
    }
    return result;
  }, [messages]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f4f0ea] via-white to-[#eef6ff]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                    onClick={() => router.push('/dashboard')}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600">
                  <Heart className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-slate-900">AI Health Assistant</h1>
                  <p className="text-[10px] text-emerald-600 font-medium">
                    RAG-powered • Grounded in your data{selectedDocument ? ` • ${selectedDocumentLabel}` : ''}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsVoiceAssistantOpen(true)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Open voice options"
              >
                <Volume2 className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={handleNewChat}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                aria-label="Start a new chat conversation"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                New Chat
              </button>
            </div>
          </div>
        </header>

        {/* Chat body */}
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-4 sm:px-6">
          <ChatContainer
            isLoading={isLoading}
            isEmpty={messages.length === 0}
            emptyMessage={
              hasSelectableDocuments
                ? 'Pick a report or prescription, then ask about it here'
                : 'Upload a report or prescription in the dashboard to start asking questions here'
            }
            quickPrompts={selectedDocument ? QUICK_PROMPTS : []}
            onQuickPrompt={(prompt) => handleSend(prompt)}
          >
            {messagesWithSeparators.map((item) => {
              if (item.type === 'separator') {
                return (
                  <div key={item.id} className="flex items-center gap-3 py-2" role="separator">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{item.label}</span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                );
              }
              return item.role === 'user' ? (
                <UserMessage key={item.id} content={item.content} createdAt={item.createdAt} />
              ) : (
                <AIMessage
                  key={item.id}
                  content={item.content}
                  createdAt={item.createdAt}
                  sources={item.sources}
                  contextMode={item.contextMode}
                />
              );
            })}
            {isSending && <TypingIndicator />}
          </ChatContainer>

          <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">Document selector</p>
                <p className="text-xs text-slate-500">Choose the uploaded report or prescription this chat should use.</p>
              </div>
              {selectedDocument && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                  Active: {selectedDocumentLabel}
                </span>
              )}
            </div>
            <select
              value={
                activeDocumentType === 'report'
                  ? `report:${activeReportId}`
                  : activeDocumentType === 'prescription'
                    ? `prescription:${activePrescriptionId}`
                    : ''
              }
              onChange={(e) => {
                const [type, id] = e.target.value.split(':');
                if (type === 'report') {
                  setActiveDocumentType('report');
                  setActiveReportId(id);
                  setActivePrescriptionId('');
                } else if (type === 'prescription') {
                  setActiveDocumentType('prescription');
                  setActivePrescriptionId(id);
                  setActiveReportId('');
                } else {
                  setActiveDocumentType('');
                  setActiveReportId('');
                  setActivePrescriptionId('');
                }
              }}
              disabled={isReportsLoading || isPrescriptionsLoading}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-slate-50"
              aria-label="Select document for chat"
            >
              <option value="">{(isReportsLoading || isPrescriptionsLoading) ? 'Loading documents...' : '-- Choose a document --'}</option>
              {reports.map((report) => (
                <option key={`report-${report.id}`} value={`report:${report.id}`}>
                  Report: {report.report_name || 'Medical Report'} ({report.id.slice(0, 8)}...)
                </option>
              ))}
              {prescriptions.map((prescription) => (
                <option key={`prescription-${prescription.id}`} value={`prescription:${prescription.id}`}>
                  Prescription: {prescription.display_name || 'Prescription'}
                </option>
              ))}
            </select>
            {!isReportsLoading && !isPrescriptionsLoading && !hasSelectableDocuments && (
              <p className="mt-2 text-xs text-slate-500">
                No documents were loaded, so the chat will fall back to general questions until one appears.
              </p>
            )}
          </div>

          {/* Input */}
          <div className="rounded-2xl border border-white/70 bg-white/80 shadow-[0_-10px_40px_rgba(15,23,42,0.06)]">
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={() => handleSend()}
              onMicClick={() => setIsVoiceAssistantOpen(true)}
              disabled={isSending}
              placeholder="Ask about a report, prescription, or health topic..."
              showMic
            />
          </div>
        </div>

        <InlineVoiceAssistant
          isOpen={isVoiceAssistantOpen}
          onClose={() => setIsVoiceAssistantOpen(false)}
          onSubmitted={handleVoiceSubmitted}
          reportId={activeDocumentType === 'report' ? activeReportId : ''}
          prescriptionId={activeDocumentType === 'prescription' ? activePrescriptionId : ''}
        />
      </div>
    </ProtectedRoute>
  );
}
