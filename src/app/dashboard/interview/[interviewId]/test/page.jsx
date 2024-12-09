"use client";

import React, { useEffect } from "react";
import useSpeechToText from "react-hook-speech-to-text";
const SpeechTest = () => {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true, // Try disabling continuous recording
    useLegacyResults: false,
  });

useEffect(()=>{
  console.log(results)
},[results])

  return (
    <div>
      <p>Microphone: {isRecording ? "on" : "off"}</p>
      <button onClick={startSpeechToText}>Start</button>
      <button onClick={stopSpeechToText}>Stop</button>
      <p>Transcript: {results[0]}</p>
    </div>
  );
};

export default SpeechTest;
