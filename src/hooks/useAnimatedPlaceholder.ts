import { useState, useEffect } from 'react';

/**
 * Custom hook to generate a typing animation for input placeholders.
 *
 * @param baseText The prefix text of the placeholder (e.g. "Search by")
 * @param hints The rotating list of search hints (e.g. ["Name", "Code"])
 * @param interval The delay in ms before starting to delete the fully typed hint
 * @param typingSpeed The delay in ms between typing individual characters
 */
export function useAnimatedPlaceholder(
  baseText: string,
  hints?: string[],
  interval = 2000,
  typingSpeed = 80,
) {
  const [displayText, setDisplayText] = useState('');
  const [hintIndex, setHintIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!hints || hints.length === 0) return;

    let timer: ReturnType<typeof setTimeout>;
    const currentHint = hints[hintIndex];

    if (isDeleting) {
      if (displayText.length > 0) {
        timer = setTimeout(() => setDisplayText(displayText.slice(0, -1)), typingSpeed / 2);
      } else {
        setIsDeleting(false);
        setHintIndex((prev) => (prev + 1) % hints.length);
      }
    } else {
      if (displayText.length < currentHint.length) {
        timer = setTimeout(() => setDisplayText(currentHint.slice(0, displayText.length + 1)), typingSpeed);
      } else {
        timer = setTimeout(() => setIsDeleting(true), interval);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, hintIndex, hints, interval, typingSpeed]);

  if (!hints || hints.length === 0) return baseText;
  return `${baseText} ${displayText}`;
}
