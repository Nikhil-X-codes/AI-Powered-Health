function includesAny(text, patterns) {
  return patterns.some((pattern) => text.includes(pattern));
}

export function getFriendlyApiErrorMessage(error, fallback = 'Request failed') {
  const rawMessage = String(error?.message || error || '').trim();
  const status = error?.status;
  const normalized = rawMessage.toLowerCase();

  if (status === 401) {
    return 'Please sign in again.';
  }

  if (status === 403) {
    return 'You are not allowed to access that record.';
  }

  if (status === 404) {
    return 'The requested record could not be found.';
  }

  if (status === 422 && includesAny(normalized, ['speak louder', 'rephrase', 'transcription is empty'])) {
    return 'Voice was empty. Please speak louder or rephrase your question.';
  }

  if (includesAny(normalized, ['please upload a clearer image', 'blurry', 'ocr', 'extract text', 'could not extract text', 'image quality'])) {
    return 'Please upload a clearer image.';
  }

  if (includesAny(normalized, ['service temporarily unavailable', 'fastapi service unavailable', 'unable to reach upstream', 'failed to reach upstream'])) {
    return 'The medical AI service is unavailable right now. Please try again in a moment.';
  }

  if (includesAny(normalized, ['voice transcription', 'record audio before sending', 'transcription is empty'])) {
    return 'Voice was empty. Please speak louder or rephrase your question.';
  }

  if (rawMessage) {
    return rawMessage;
  }

  return fallback;
}