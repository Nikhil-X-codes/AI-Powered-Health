"""
Text Chunking Utility
Splits long medical text into segments for embedding/processing.
Preserves sentence boundaries where possible.
"""

import re
from typing import List, Tuple, Optional


class TextChunker:
    """
    Split text into chunks while preserving sentence boundaries.
    """
    
    def __init__(
        self,
        chunk_size: int = 500,
        overlap: int = 50,
        preserve_sentences: bool = True
    ):
        """
        Initialize chunker.
        
        Args:
            chunk_size: Target size of each chunk in characters
            overlap: Number of characters to overlap between chunks
            preserve_sentences: If True, avoid breaking mid-sentence
        """
        self.chunk_size = chunk_size
        self.overlap = overlap
        self.preserve_sentences = preserve_sentences
    
    def split(self, text: str) -> List[str]:
        """
        Split text into chunks.
        
        Args:
            text: Text to split
            
        Returns:
            List of text chunks
        """
        if not text or len(text) <= self.chunk_size:
            return [text] if text else []
        
        chunks = []
        
        if self.preserve_sentences:
            chunks = self._split_preserving_sentences(text)
        else:
            chunks = self._split_naive(text)
        
        return chunks
    
    def _split_naive(self, text: str) -> List[str]:
        """Simple character-based split with overlap."""
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + self.chunk_size
            
            # Get chunk
            chunk = text[start:end]
            chunks.append(chunk)
            
            # Move start position (minus overlap for next iteration)
            start = end - self.overlap
        
        # Remove duplicate last chunk if created
        if len(chunks) > 1 and chunks[-1] == chunks[-2]:
            chunks.pop()
        
        return chunks
    
    def _split_preserving_sentences(self, text: str) -> List[str]:
        """
        Split text while trying to preserve sentence boundaries.
        """
        # Split into sentences
        sentences = self._split_sentences(text)
        
        if not sentences:
            return self._split_naive(text)
        
        # Group sentences into chunks
        chunks = []
        current_chunk = ""
        
        for sentence in sentences:
            # If adding this sentence exceeds chunk_size, save current chunk
            if len(current_chunk) + len(sentence) > self.chunk_size and current_chunk:
                chunks.append(current_chunk.strip())
                
                # Add overlap: start new chunk with last part of previous chunk
                if self.overlap > 0 and len(current_chunk) > self.overlap:
                    current_chunk = current_chunk[-self.overlap:] + " " + sentence
                else:
                    current_chunk = sentence
            else:
                if current_chunk:
                    current_chunk += " " + sentence
                else:
                    current_chunk = sentence
        
        # Add final chunk
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        # Clean up: remove empty chunks and very small chunks
        chunks = [c for c in chunks if len(c.strip()) > 0]
        
        return chunks
    
    @staticmethod
    def _split_sentences(text: str) -> List[str]:
        """
        Split text into sentences.
        Handles common abbreviations and medical terminology.
        """
        # Medical abbreviations that shouldn't end sentences
        medical_abbrevs = {
            'Dr', 'Mr', 'Mrs', 'Ms', 'Prof', 'mg', 'mL', 'IV', 'IM',
            'vs', 'e.g', 'i.e', 'etc', 'Co', 'Inc', 'Ltd', 'pH'
        }
        
        # Replace sentence endings with marker
        text = text.replace('?', '|QMARK|')
        text = text.replace('!', '|EXMARK|')
        
        # Split on periods, but protect abbreviations
        # Pattern: word followed by period NOT followed by lowercase
        sentences = re.split(r'\.(?=\s+[A-Z]|$)', text)
        
        result = []
        for sentence in sentences:
            # Restore markers
            sentence = sentence.replace('|QMARK|', '?')
            sentence = sentence.replace('|EXMARK|', '!')
            
            # Add back period if it was removed (except last sentence)
            if sentence.strip() and not sentence.endswith(('.', '?', '!')):
                if sentence != sentences[-1]:
                    sentence += '.'
            
            if sentence.strip():
                result.append(sentence.strip())
        
        return result


def chunk_text(
    text: str,
    chunk_size: int = 500,
    overlap: int = 50,
    preserve_sentences: bool = True
) -> List[str]:
    """
    Convenience function to chunk text.
    
    Args:
        text: Text to chunk
        chunk_size: Target chunk size
        overlap: Overlap between chunks
        preserve_sentences: Preserve sentence boundaries
        
    Returns:
        List of text chunks
    """
    chunker = TextChunker(chunk_size, overlap, preserve_sentences)
    return chunker.split(text)


def chunk_text_with_metadata(
    text: str,
    chunk_size: int = 500,
    overlap: int = 50,
    source: Optional[str] = None
) -> List[dict]:
    """
    Chunk text and return chunks with metadata (position, source).
    
    Args:
        text: Text to chunk
        chunk_size: Target chunk size
        overlap: Overlap between chunks
        source: Source identifier (file path, URL, etc.)
        
    Returns:
        List of dicts with keys: text, start_pos, end_pos, chunk_num, source
    """
    chunker = TextChunker(chunk_size, overlap)
    chunks = chunker.split(text)
    
    result = []
    current_pos = 0
    
    for i, chunk in enumerate(chunks):
        # Find actual position in original text (accounting for overlap)
        start_pos = text.find(chunk, current_pos)
        if start_pos == -1:
            start_pos = current_pos
        
        end_pos = start_pos + len(chunk)
        
        result.append({
            'text': chunk,
            'chunk_num': i + 1,
            'total_chunks': len(chunks),
            'start_pos': start_pos,
            'end_pos': end_pos,
            'length': len(chunk),
            'source': source
        })
        
        current_pos = end_pos
    
    return result


# ============================================================================
# Medical-Specific Chunking
# ============================================================================

def chunk_medical_report(
    text: str,
    section_aware: bool = True
) -> List[dict]:
    """
    Chunk medical report text, optionally preserving report sections.
    
    Recognizes sections like:
    - Chief Complaint
    - History of Present Illness
    - Physical Examination
    - Assessment
    - Plan
    - etc.
    
    Args:
        text: Medical report text
        section_aware: If True, try to separate by sections
        
    Returns:
        List of chunks with section info
    """
    # Common medical report section headers
    section_pattern = r'(?i)(^|\n)(chief complaint|history of present illness|hpi|physical examination|pe|vital signs|labs?|assessment|a/p|plan|medications|allergies|family history|social history|past medical history|pmh|past surgical history|psh|objective|subjective|diagnosis|treatment|prognosis|impression|procedures|findings)(?:[:|\s])'
    
    chunks_with_meta = chunk_text_with_metadata(text)
    
    if not section_aware:
        return chunks_with_meta
    
    # Attempt to identify sections
    result = []
    for chunk_info in chunks_with_meta:
        # Find sections in this chunk
        chunk_text = chunk_info['text']
        section_match = re.search(section_pattern, chunk_text)
        
        if section_match:
            chunk_info['section'] = section_match.group(2).lower()
        else:
            chunk_info['section'] = 'general'
        
        result.append(chunk_info)
    
    return result


def estimate_tokens(text: str, model: str = "gpt-3.5") -> int:
    """
    Estimate number of tokens in text (rough approximation).
    
    Args:
        text: Text to estimate
        model: Model name (gpt-3.5, gpt-4, etc.)
        
    Returns:
        Estimated token count
    """
    # Rough approximation: 1 token ≈ 4 characters
    # Different models have slightly different ratios
    ratio = {
        'gpt-3.5': 4,
        'gpt-4': 3,
        'embedding': 3.5,  # For embedding models
    }
    
    chars_per_token = ratio.get(model, 4)
    
    return len(text) // chars_per_token


def split_by_token_limit(
    text: str,
    max_tokens: int = 2000,
    model: str = "gpt-3.5"
) -> List[str]:
    """
    Split text to stay under token limit.
    
    Args:
        text: Text to split
        max_tokens: Maximum tokens per chunk
        model: Model name for token estimation
        
    Returns:
        List of chunks under token limit
    """
    # Estimate characters per token
    ratio = {
        'gpt-3.5': 4,
        'gpt-4': 3,
        'embedding': 3.5,
    }
    chars_per_token = ratio.get(model, 4)
    max_chars = max_tokens * chars_per_token
    
    # Use TextChunker with estimated character limit
    return chunk_text(text, chunk_size=int(max_chars), overlap=int(max_chars * 0.1))


# ============================================================================
# Example Usage
# ============================================================================

if __name__ == "__main__":
    # Example 1: Basic chunking
    sample_text = """
    The patient presented with chest pain. They reported pain for 3 days.
    Physical examination revealed elevated blood pressure. Labs were ordered.
    The diagnosis was hypertension. Treatment plan includes medication.
    Follow-up in 2 weeks.
    """ * 10
    
    chunks = chunk_text(sample_text)
    print(f"Created {len(chunks)} chunks from {len(sample_text)} characters")
    print(f"First chunk: {chunks[0][:50]}...")
    
    # Example 2: With metadata
    chunks_meta = chunk_text_with_metadata(sample_text, source="test.txt")
    print(f"\nChunk with metadata: {chunks_meta[0]}")
    
    # Example 3: Medical report
    medical_text = """
    CHIEF COMPLAINT: Chest pain
    
    HISTORY OF PRESENT ILLNESS:
    Patient is a 45-year-old male with 3 days of chest pain.
    
    PHYSICAL EXAMINATION:
    BP: 140/90, HR: 85, RR: 16
    
    ASSESSMENT:
    Hypertension
    
    PLAN:
    Start antihypertensive medication
    """ * 5
    
    medical_chunks = chunk_medical_report(medical_text)
    print(f"\nMedical chunks: {len(medical_chunks)}")
    for chunk in medical_chunks[:2]:
        print(f"  Section: {chunk.get('section')}, Length: {chunk['length']}")
