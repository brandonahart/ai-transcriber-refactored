import React, { useState } from 'react';
import { LANGUAGES } from '../utils/presets';
export default function Translation(props) {
    const { translating, toLanguage, textElement, setToLanguage, generateTranslation } = props; // Assuming translation is passed as a prop

    return (
        <div className='flex flex-col mx-auto w-full bg-black gap-2 max-w-[400px]'>
            {!translating && (<div className='flex flex-col gap-1'>
                <p className='text-xs sm:text-sm font-medium text-slate-400 mr-auto'>To language</p>
                <div className='flex items-stretch'>
                    <select value={toLanguage} onChange={(e) => setToLanguage(e.target.value)} className='bg-black border-2 border-solid border-green-400 text-white rounded-l px-4 py-2 focus:outline-none flex-1'>
                        <option value="Select language" >Select language</option>
                        {Object.entries(LANGUAGES).map(([key, value]) => {
                            return (
                                <option key={key} value={value}>{key}</option>
                            )
                        })}

                    </select>
                    <button onClick={generateTranslation} className='specialBtn text-green-400 px-4 py-2 rounded-r hover:bg-black-600 duration-200'> Translate
                    </button>
                </div>
            </div>)}
            {textElement && !translating && (
                <p className='text-white whitespace-pre-wrap'>{textElement}</p>
            )}
            {translating && (
                <div className='grid place-items-center'>
                    <i className="fa-solid fa-spinner animate-spin"></i>
                </div>
            )}

        </div>
    )
}