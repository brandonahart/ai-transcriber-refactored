import React, {useState, useEffect, useRef, use} from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


export default function HomePage(props) {
    const { setFile, setAudioStream, setTranscription } = props;
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    

    const [recordingStatus, setRecordingStatus] = useState('inactive');
    const [audioChunks, setAudioChunks] = useState([]);
    const [duration, setDuration] = useState(0);

    const mediaRecorder = useRef(null);

    const mimeType = 'audio/webm';

    async function startRecording() {
        SpeechRecognition.startListening();
        setTranscription(transcript)
        setRecordingStatus('recording');
        console.log("Recording started")
        // let stream = null;
        // console.log('Starting recording...');
        // try {
        //     //requests microphone access from user
        //     const streamData = await navigator.mediaDevices.getUserMedia({ 
        //         audio: true, 
        //         video: false 
        //     });
        //     stream = streamData;
        // } catch (err) {
        //     console.log(err.message);
        //     return;
        // }
        // setRecordingStatus('recording');

        // //create new media recorder instance
        // const media = new MediaRecorder(stream, { mimeType });
        // mediaRecorder.current = media;

        // //emits data every one second
        // mediaRecorder.current.start(1000);
        // let localAudioChunks = [];

        // //everytime audio is available, push it to the array
        // mediaRecorder.current.ondataavailable = (event) => {
        //     if (typeof event.data === 'undefined') { return; }
        //     if (event.data.size === 0) { return; }
        //     localAudioChunks.push(event.data);
        // }
        // setAudioChunks(localAudioChunks);
    }

    async function stopRecording() {
        setRecordingStatus('inactive');
        SpeechRecognition.stopListening();
        setTranscription(transcript)
        console.log("Recording stopped")
        console.log("Transcription: " + transcript)
        setAudioStream(true);
        // console.log('Stopping recording...');

        // mediaRecorder.current.stop();
        // mediaRecorder.current.onstop = () => {
        //     const audioBlob = new Blob(audioChunks, { type: mimeType });
        //     setAudioStream(audioBlob);
        //     setAudioChunks([]);
        //     setDuration(0);
            
        // }
    }

    //use for recording counter
    useEffect(() => {
        if (recordingStatus === 'inactive') { return; }
        //increments duration every second
        const interval = setInterval(() => {
            setDuration((curr) => curr + 1);
        }, 1000);

        return () => clearInterval(interval);
    });

    return (
        <main className='flex-1 p-4 flex flex-col gap-3 sm:gap-4 justify-center pb-20 items-center text-center'>
            <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl text-white'>Grand<span className='text-green-400 bold'>Scribe</span></h1>
            <h3 className='font-medium md:text-lg text-white'>Record <span className='text-green-400'>&rarr;</span> Transcribe <span className='text-green-400'>&rarr;</span> Translate
            </h3>
            <button onClick={recordingStatus === 'recording' ? stopRecording : startRecording} className='flex items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4 specialBtn px-4 py-2 rounded-lg'>
                <p className='text-green-400'>{recordingStatus === 'inactive' ? 'Record' : `Stop recording`}</p>
                <div className='flex items-center gap-2'>
                    {duration !== 0 && (
                        <p className='text-sm'>{duration}s</p>
                    )}
                    <i className={"fa-solid duration-200 fa-microphone " + (recordingStatus === 'recording' ? ' text-rose-300' : "")}></i>
                </div>
            </button>
            <p className='text-base text-white'>Or <label className='text-green-400 cursor-pointer hover:text-green-600 duration-200'>Upload <input onChange={(e) => {
                const tempFile = e.target.files[0];
                setFile(tempFile);
            }} className='hidden' type='file' accept='.mp3,.wave' /></label> a mp3 file</p>
            <p className='italic text-slate-400'>Translate whatever you like</p>
        </main>
    )
}