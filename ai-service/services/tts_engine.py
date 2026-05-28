"""
Edge TTS Engine
Generates speech audio from text.
"""

import asyncio


async def synthesize_speech(text: str, voice: str) -> bytes:
	"""
	Synthesize speech using Edge TTS.

	Args:
		text: Text to speak
		voice: Edge voice name

	Returns:
		MP3 audio bytes
	"""
	if not text or not text.strip():
		return b""

	try:
		import edge_tts
	except ImportError as exc:
		raise RuntimeError("edge-tts is not installed") from exc

	communicate = edge_tts.Communicate(text, voice=voice)
	audio_chunks = []

	async for chunk in communicate.stream():
		if chunk.get("type") == "audio":
			audio_chunks.append(chunk.get("data", b""))

	return b"".join(audio_chunks)
