import React from 'react';
import { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import './index.css'; 
import FileDisplay from './components/FileDisplay';
import Information from './components/Information';
import Transcribing from './components/Transcribing';
import { MessageTypes } from './utils/presets';
import { OpenAI } from 'openai';

function App() {
  const [audioFile, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(false);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [transcription, setTranscription] = useState('');


  const isAudioAvailable = audioFile || audioStream;

  function handleAudioReset() {
    setFile(null);
    setAudioStream(false);
  }

  // gets the audio from the file or transcription
  async function readAudioFrom(audioFile) {
    const audioRate = 16000;
    const audioContext = new AudioContext({ sampleRate: audioRate });
    const response = await audioFile.arrayBuffer();
    const decodedAudio = await audioContext.decodeAudioData(response);
    const audio = decodedAudio.getChannelData(0);
    return audio
  }

  async function handleFormSubmission() {
    if (!audioFile && !audioStream) {
      console.error('No audio audioFile or stream available');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOutput(true);
      setFinished(true);
    }, 1000);
  }

  return (
    <div className='flex flex-col mx-auto w-full bg-black'>
      <section className='min-h-screen flex flex-col'>
        <Header />
        {output ? (
          <Information transcription={transcription}/>
        ) : loading ? (
          <Transcribing downloading={loading} />
        ) : isAudioAvailable ? (
          <FileDisplay handleFormSubmission={handleFormSubmission} handleAudioReset={handleAudioReset} audioFile={audioFile} audio={audioStream} />
        ) : (
          <HomePage setFile={setFile} setAudioStream={setAudioStream} setTranscription={setTranscription}/>
        )}
      </section>
      <footer>
      </footer>
    </div>
  );
}

export default App;
