import React, { useState } from "react";
import Transcription from "./Transcription";
import Translation from "./Translation";

export default function Information(props) {
    const { transcription } = props;
    const [tab, setTab] = useState('transcription');
    const [translation, setTranslation] = useState(''); // Placeholder for translation data
    const [translating, setTranslating] = useState(false);
    const [toLanguage, setToLanguage] = useState('Select Lanugage'); // Default to English

    function handleCopy() {
        navigator.clipboard.writeText(transcription);
        alert('Transcription copied to clipboard!');
    }

    function handleDownload() {
        const element = document.createElement('a');
        const file = new Blob([transcription], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download(`GrandScribe_${new Date().toDateString()}.txt`);
        document.body.appendChild(element);
        element.click();
    }

    function generateTranslation() {

    }

    const textElement = tab === 'transcription' ? transcription : translation;

    return (
        <main className='flex-1 p-4 flex flex-col gap-3 sm:gap-4 justify-center items-center pb-20 max-w-full mx-auto max-w-prose'>
            <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl text-white whitespace-nowrap'>Your <span className='text-green-400 bold'>Transcription</span></h1>

            <div className='grid grid-cols-2 flex mx-auto bg-black border-2 border-solid border-green-400 text-white shadow rounded-full overflow-hidden items-center gap-2'>
                <button onClick={() => setTab('transcription')} className={'px-4 py-1 durration-200' + (tab === 'transcription' ? ' bg-green-500 text-white' : ' text-green-400 hover:text-green-600')}>Transcription</button>
                <button onClick={() => setTab('translation')} className={'px-4 py-1 durration-200'  + (tab === 'translation' ? ' bg-green-500 text-white' : ' text-green-400 hover:text-green-600')}>Translation</button>
            </div>
            <div className="my-8 flex flex-col>">
                { tab === 'transcription' ? (
                    <Transcription {...props} textElement={textElement}/>
                ) : (
                    <Translation {...props} toLanguage={toLanguage} translating={translating} textElement={textElement}
                    setTranslating={setTranslating} setTranslation={setTranslation} setToLanguage={setToLanguage} generateTranslation={generateTranslation}/>
                )}
            </div>
            <div className='flex items-center gap-4 mx-auto'>
                <button title="Copy" className="specialBtn px-4 rounded p-2 text-green-400 hover:text-green-600 duration-200">
                    <i className="fa-solid fa-copy"></i>
                </button>
                <button title="Download" className="specialBtn px-4 rounded p-2 text-green-400 hover:text-green-600 duration-200">
                    <i className="fa-solid fa-download"></i>
                </button>
            </div>
        </main>
    )
}