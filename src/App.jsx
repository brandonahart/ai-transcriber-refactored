import React from 'react';
import { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import './index.css'; 
import FileDisplay from './components/FileDisplay';
import Information from './components/Information';
import Transcribing from './components/Transcribing';
import { MessageTypes } from './utils/presets';

function App() {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [downloading, setDownloading] = useState(false);


  const isAudioAvailable = file || audioStream;

  function handleAudioReset() {
    setFile(null);
    setAudioStream(null);
  }

  // Worker for handling transcription and translation in background
  const worker = useRef(null);

  // Starts the transcription process
  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./utils/whisper.worker.js', import.meta.url), { type: 'module' });
    }

    // If audio is available, send it to the worker for transcription
    const onMessageReceived = async (event) => {
      switch (event.data.type) {
        case 'DOWNLOADING' :
          setDownloading(true);
          console.log('Downloading audio...');
          break;
        case 'LOADING' :
          setLoading(true);
          console.log('Loading audio...');
          break;
        case 'RESULT' :
          setOutput(event.data.result);
          console.log(event.data.results)
          break;
        case 'INFERENCE_DONE' :
          setFinished(true);
          console.log('Done transcribing!');
          break;
      }
    }

    worker.current.addEventListener('message', onMessageReceived);
    // clean up function to remove the event listener and terminate the worker
    return () => {
      worker.current.removeEventListener('message', onMessageReceived);
      worker.current.terminate();
      worker.current = null;
    };
  }, []);

  // gets the audio from the file or transcription
  async function readAudioFrom(file) {
    const audioRate = 16000;
    const audioContext = new AudioContext({ sampleRate: audioRate });
    const response = await file.arrayBuffer();
    const decodedAudio = await audioContext.decodeAudioData(response);
    const audio = decodedAudio.getChannelData(0);
    return audio
  }

  async function handleFormSubmission() {
    if (!file && !audioStream) {
      console.error('No audio file or stream available');
      return;
    }

    let audio = file ? file : audioStream;
    const model_name = `openai/whisper-tiny.en`;

    worker.current.postMessage({
      type: MessageTypes.INFERENCE_REQUEST,
      audio,
      model_name
    });
  }

  return (
    <div className='flex flex-col mx-auto w-full bg-black'>
      <section className='min-h-screen flex flex-col'>
        <Header />
        {output ? (
          <Information />
        ) : loading ? (
          <Transcribing downloading={loading} />
        ) : isAudioAvailable ? (
          <FileDisplay handleFormSubmission={handleFormSubmission} handleAudioReset={handleAudioReset} file={file} audio={audioStream} />
        ) : (
          <HomePage setFile={setFile} setAudioStream={setAudioStream} />
        )}
      </section>
      <footer>
      </footer>
    </div>
  );
}

export default App;
