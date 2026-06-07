'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
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
  ArrowLeft, Heart, Plus, MessagesSquare, Volume2,
  Clock, FileText, Pill, PanelLeftClose, PanelLeftOpen,
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

function formatSessionDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

import { Suspense } from 'react';

function ChatContent() {
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

  // Session state
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isSessionsLoading, setIsSessionsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load documents
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
    }
  }, [activeDocumentType, hydrated, prescriptionId, prescriptions, reportId, reports]);

  // Load sessions
  const loadSessions = useCallback(async () => {
    try {
      setIsSessionsLoading(true);
      const data = await fetchWithAuth('/api/v1/chat/history');
      if (data?.sessions) {
        setSessions(data.sessions);
      }
    } catch {
      // Sessions loading is optional
    } finally {
      setIsSessionsLoading(false);
      setIsLoading(false);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    if (!hydrated) return;
    void loadSessions();
  }, [hydrated, loadSessions]);

  // Load messages for a specific session
  const loadSessionMessages = useCallback(async (sessionId) => {
    try {
      setIsLoading(true);
      const data = await fetchWithAuth(`/api/v1/chat/history?session_id=${sessionId}`);
      const history = (data.messages || []).map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt,
        sources: msg.sources || [],
        contextMode: msg.contextMode,
      }));
      setMessages(history);
      setActiveSessionId(sessionId);
    } catch {
      toast.error('Failed to load chat session');
    } finally {
      setIsLoading(false);
    }
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
      const documentId = activeDocumentType === 'prescription'
        ? activePrescriptionId
        : activeReportId;
      const useRag = Boolean(activeDocumentType && documentId);
      const endpoint = useRag ? '/api/v1/chat/rag' : '/api/v1/chat/quick';
      const body = useRag
        ? {
            question: messageText,
            user_id: user?.userId,
            report_id: documentId,
            session_id: activeSessionId,
          }
        : {
            question: messageText,
            session_id: activeSessionId,
          };

      const data = await fetchWithAuth(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      // Update session_id from response (may be newly generated)
      if (data.sessionId && !activeSessionId) {
        setActiveSessionId(data.sessionId);
      }

      const assistantMessage = {
        id: `local-${Date.now()}-ai`,
        role: 'assistant',
        content: data.response || data.answer || 'No answer',
        createdAt: new Date().toISOString(),
        sources: data.sources || [],
        contextMode: data.contextMode || ((data.sources || []).length === 0 ? 'general' : 'personal'),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Refresh sessions list
      void loadSessions();
    } catch (err) {
      toast.error(err.message || 'AI is temporarily unavailable. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setActiveSessionId(null);
  };

  const handleSessionClick = (session) => {
    void loadSessionMessages(session.sessionId);
    // On mobile, close sidebar after selecting
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
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

  // Group sessions by date for sidebar
  const groupedSessions = useMemo(() => {
    const groups = new Map();
    for (const session of sessions) {
      const dateLabel = formatSessionDate(session.lastMessageAt);
      if (!groups.has(dateLabel)) {
        groups.set(dateLabel, []);
      }
      groups.get(dateLabel).push(session);
    }
    return Array.from(groups.entries());
  }, [sessions]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-[#f4f0ea] via-white to-[#eef6ff]">
        {/* Session Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-72' : 'w-0'
          } flex-shrink-0 transition-all duration-300 overflow-hidden border-r border-slate-200/60 bg-white/90 backdrop-blur-xl md:relative fixed inset-y-0 left-0 z-40`}
        >
          <div className="flex h-full w-72 flex-col">
            {/* Sidebar header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <MessagesSquare className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                <span className="text-sm font-semibold text-slate-900">Chat History</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 md:hidden"
                aria-label="Close sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>

            {/* New chat button */}
            <div className="px-3 pt-3 pb-2">
              <button
                onClick={handleNewChat}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                aria-label="Start a new chat"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                New Conversation
              </button>
            </div>

            {/* Sessions list */}
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              {isSessionsLoading ? (
                <div className="space-y-2 pt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessagesSquare className="mb-2 h-8 w-8 text-slate-300" aria-hidden="true" />
                  <p className="text-xs text-slate-400">No conversations yet</p>
                  <p className="mt-1 text-[10px] text-slate-400">Start a new chat to begin</p>
                </div>
              ) : (
                <div className="space-y-1 pt-1">
                  {groupedSessions.map(([dateLabel, dateSessions]) => (
                    <div key={dateLabel}>
                      <p className="px-2 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {dateLabel}
                      </p>
                      {dateSessions.map((session) => {
                        const isActive = session.sessionId === activeSessionId;
                        const hasReport = !!session.reportId;
                        const hasPrescription = !!session.prescriptionId;
                        return (
                          <button
                            key={session.sessionId}
                            onClick={() => handleSessionClick(session)}
                            className={`group flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition ${
                              isActive
                                ? 'bg-emerald-50 border border-emerald-200'
                                : 'hover:bg-slate-50'
                            }`}
                            aria-label={`Open chat session: ${session.firstMessage || 'Conversation'}`}
                            aria-current={isActive ? 'true' : undefined}
                          >
                            <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                              isActive ? 'bg-emerald-100' : 'bg-slate-100 group-hover:bg-slate-200'
                            }`}>
                              {hasReport ? (
                                <FileText className={`h-3 w-3 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} aria-hidden="true" />
                              ) : hasPrescription ? (
                                <Pill className={`h-3 w-3 ${isActive ? 'text-emerald-600' : 'text-violet-500'}`} aria-hidden="true" />
                              ) : (
                                <MessagesSquare className={`h-3 w-3 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} aria-hidden="true" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`truncate text-xs font-medium ${
                                isActive ? 'text-emerald-900' : 'text-slate-700'
                              }`}>
                                {session.firstMessage || 'Conversation'}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-slate-400">
                                  {session.messageCount} msg{session.messageCount !== 1 ? 's' : ''}
                                </span>
                                {session.contextMode === 'personal' && (
                                  <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-medium text-blue-600">
                                    Personal
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Sidebar overlay on mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main chat area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                {!isSidebarOpen && (
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Open chat history sidebar"
                  >
                    <PanelLeftOpen className="h-4.5 w-4.5" />
                  </button>
                )}
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
                  ? 'Ask a general health question, or pick a document below'
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
                  const val = e.target.value;
                  if (!val) {
                    setActiveDocumentType('');
                    setActiveReportId('');
                    setActivePrescriptionId('');
                    return;
                  }
                  const [type, id] = val.split(':');
                  if (type === 'report') {
                    setActiveDocumentType('report');
                    setActiveReportId(id);
                    setActivePrescriptionId('');
                  } else if (type === 'prescription') {
                    setActiveDocumentType('prescription');
                    setActivePrescriptionId(id);
                    setActiveReportId('');
                  }
                }}
                disabled={isReportsLoading || isPrescriptionsLoading}
                className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-slate-50"
                aria-label="Select document for chat"
              >
                <option value="">
                  {(isReportsLoading || isPrescriptionsLoading)
                    ? 'Loading documents...'
                    : 'General health question (no document)'}
                </option>
                {reports.map((report) => (
                  <option key={`report-${report.id}`} value={`report:${report.id}`}>
                    Report: {report.report_name || 'Medical Report'}
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
      </div>
    </ProtectedRoute>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
