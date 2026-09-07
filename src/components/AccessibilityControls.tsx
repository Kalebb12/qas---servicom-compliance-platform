import React, { useEffect, useState } from 'react';
import { Square, Volume2 } from 'lucide-react';

export const AccessibilityControls: React.FC = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState('');
  const [voiceCount, setVoiceCount] = useState(0);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const updateVoices = () => setVoiceCount(window.speechSynthesis.getVoices().length);
    updateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);

    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
    };
  }, []);

  const stopReading = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setStatus('Reading stopped.');
  };

  const readPage = () => {
    if (!('speechSynthesis' in window)) {
      setStatus('Text-to-speech is not supported in this browser.');
      return;
    }

    if (voiceCount === 0) {
      setStatus('No speech voice is available. Install or enable a system text-to-speech voice, then try again.');
      return;
    }

    const selectedText = window.getSelection()?.toString().trim();
    const pageText = document.querySelector('main')?.textContent?.replace(/\s+/g, ' ').trim();
    const textToRead = selectedText || pageText;

    if (!textToRead) {
      setStatus('There is no readable content available.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead.slice(0, 12000));
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find((voice) => voice.lang.toLowerCase().startsWith('en')) || voices[0];
    utterance.onstart = () => {
      setIsSpeaking(true);
      setStatus(selectedText ? 'Reading selected text.' : 'Reading page content.');
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setStatus('Finished reading.');
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setStatus('Text-to-speech could not start.');
    };

    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex items-center gap-1">
      {isSpeaking ? (
        <button
          type="button"
          onClick={stopReading}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-[#FBF9F4] bg-[#2F6E5F] hover:bg-[#275B52] transition-colors cursor-pointer"
          aria-label="Stop reading page aloud"
          title="Stop reading"
        >
          <Square className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
          <span className="hidden sm:inline">Stop reading</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={readPage}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-[#EFF3F1] hover:text-[#FBF9F4] hover:bg-[#1A433E] transition-colors cursor-pointer"
          aria-label="Read page content aloud"
          title="Read page content aloud"
        >
          <Volume2 className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Read aloud</span>
        </button>
      )}
      <span className="sr-only" role="status" aria-live="polite">{status}</span>
    </div>
  );
};
