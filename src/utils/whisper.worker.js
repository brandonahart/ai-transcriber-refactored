import { pipeline } from '@huggingface/transformers'
import { MessageTypes } from './presets'

class MyTranscriptionPipeline {
    static task = 'automatic-speech-recognition'
    static model = 'Xenova/whisper-tiny.en'
    static instance = null

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            console.log('model ' + this.model)
            this.instance = await pipeline(this.task, this.model, { progress_callback })
        }

        return this.instance
    }
}

self.addEventListener('message', async (event) => {
    const { type, audio } = event.data
    if (type === MessageTypes.INFERENCE_REQUEST) {
        await transcribe(audio)
    }
})

async function transcribe(audio) {
    sendLoadingMessage('loading')

    let transcriber;

    try {
        // Get the transcriber function from the pipeline
        transcriber = await MyTranscriptionPipeline.getInstance(load_model_callback);
        console.log(transcriber); // Check if it's the function
    } catch (err) {
        console.error('Error loading model:', err);
        console.log(err.message);
    }

    if (!transcriber) {
        console.error('Transcriber function not loaded');
        return;
    }

    sendLoadingMessage('success');

    // Convert the Blob to a URL for Hugging Face's pipeline
    const audioUrl = URL.createObjectURL(audio);  // Convert Blob to URL

    // Now call the transcriber function with the audio URL
    try {
        const output = await transcriber(audioUrl); // Use the transcriber function to get transcription
        console.log('Transcription result:', output.text); // Log the transcribed text
    } catch (err) {
        console.error('Error during transcription:', err);
    }
}

async function load_model_callback(data) {
    const { status } = data
    if (status === 'progress') {
        const { file, progress, loaded, total } = data
        sendDownloadingMessage(file, progress, loaded, total)
    }
}

function sendLoadingMessage(status) {
    self.postMessage({
        type: MessageTypes.LOADING,
        status
    })
}

async function sendDownloadingMessage(file, progress, loaded, total) {
    self.postMessage({
        type: MessageTypes.DOWNLOADING,
        file,
        progress,
        loaded,
        total
    })
}

class GenerationTracker {
    // constructor(pipeline, stride_length_s) {
    //     this.pipeline = pipeline
    //     this.stride_length_s = stride_length_s
    //     this.chunks = []
    //     this.time_precision = pipeline?.processor.feature_extractor.config.chunk_length / pipeline.model.config.max_source_positions
    //     this.processed_chunks = []
    //     this.callbackFunctionCounter = 0
    // }
    constructor(pipeline, stride_length_s) {
        this.pipeline = pipeline
        this.stride_length_s = stride_length_s
        this.chunks = []
        if (
            pipeline &&
            pipeline.processor &&
            pipeline.processor.feature_extractor &&
            pipeline.processor.feature_extractor.config &&
            pipeline.model &&
            pipeline.model.config &&
            pipeline.model.config.max_source_positions
        ) {
            this.time_precision =
                pipeline.processor.feature_extractor.config.chunk_length /
                pipeline.model.config.max_source_positions
        } else {
            this.time_precision = 1 // fallback value
            console.warn('Pipeline structure is missing expected properties');
        }
        this.processed_chunks = []
        this.callbackFunctionCounter = 0
    }

    sendFinalResult() {
        self.postMessage({ type: MessageTypes.INFERENCE_DONE })
    }

    callbackFunction(beams) {
        this.callbackFunctionCounter += 1
        if (this.callbackFunctionCounter % 10 !== 0) {
            return
        }

        const bestBeam = beams[0]
        let text = this.pipeline.tokenizer.decode(bestBeam.output_token_ids, {
            skip_special_tokens: true
        })

        const result = {
            text,
            start: this.getLastChunkTimestamp(),
            end: undefined
        }

        createPartialResultMessage(result)
    }

    chunkCallback(data) {
        this.chunks.push(data)
        const [text, { chunks }] = this.pipeline.tokenizer._decode_asr(
            this.chunks,
            {
                time_precision: this.time_precision,
                return_timestamps: true,
                force_full_sequence: false
            }
        )

        this.processed_chunks = chunks.map((chunk, index) => {
            return this.processChunk(chunk, index)
        })


        createResultMessage(
            this.processed_chunks, false, this.getLastChunkTimestamp()
        )
    }

    getLastChunkTimestamp() {
        if (this.processed_chunks.length === 0) {
            return 0
        }
    }

    processChunk(chunk, index) {
        const { text, timestamp } = chunk
        const [start, end] = timestamp

        return {
            index,
            text: `${text.trim()}`,
            start: Math.round(start),
            end: Math.round(end) || Math.round(start + 0.9 * this.stride_length_s)
        }

    }
}

function createResultMessage(results, isDone, completedUntilTimestamp) {
    self.postMessage({
        type: MessageTypes.RESULT,
        results,
        isDone,
        completedUntilTimestamp
    })
}

function createPartialResultMessage(result) {
    self.postMessage({
        type: MessageTypes.RESULT_PARTIAL,
        result
    })
}