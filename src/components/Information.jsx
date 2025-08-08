import React, { useState } from "react";
import Transcription from "./Transcription";
import Translation from "./Translation";

export default function Information() {
    const [tab, setTab] = useState('transcription');

    return (
        <main className='flex-1 p-4 flex flex-col gap-3 sm:gap-4 justify-center pb-20 max-w-full mx-auto max-w-prose'>
            <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl text-white whitespace-nowrap'>Your <span className='text-green-400 bold'>Transcription</span></h1>

            <div className='grid grid-cols-2 flex mx-auto bg-black border-2 border-solid border-green-400 text-white shadow rounded-full overflow-hidden items-center gap-2'>
                <button onClick={() => setTab('transcription')} className={'px-4 py-1 font-medium durration-200'  + (tab === 'translation' ? ' bg-green-500 text-white' : ' text-green-400 hover:text-green-600')}>Translation</button>
                <button onClick={() => setTab('translation')} className={'px-4 py-1 font-medium durration-200' + (tab === 'transcription' ? ' bg-green-500 text-white' : ' text-green-400 hover:text-green-600')}>Transcription</button>
            </div>
            { tab === 'transcription' ? (
                <Transcription />
            ) : (
                <Translation />
            )}
        </main>
    )
}