import React, { useEffect, useState } from 'react';

const TypingEffect = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;

    const typeCharacter = () => {
      if (i < text.length) {
        setDisplayText(prevText => prevText + text.charAt(i));
        i++;
        setTimeout(typeCharacter, speed);
      }
    };

    typeCharacter();

    return () => {
      setDisplayText('');
    };
  }, [text, speed]);

  return <>{displayText}</>;
};

export default TypingEffect;
