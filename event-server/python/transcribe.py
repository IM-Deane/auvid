import sys
import itertools
import numpy as np
import whisper
from typing import Union
from whisper.decoding import DecodingResult
import ffmpeg


CHUNK_SIZE = 1024 * 5 # 1024 bytes == 1KB

def load_audio(file: Union[str, bytes], sr: int = 16000):
    """
    Open an audio file and read as mono waveform, resampling as necessary

    Parameters
    ----------
    file: (str, bytes)
        The audio file to open or bytes of audio file

    sr: int
        The sample rate to resample the audio if necessary

    Returns
    -------
    A NumPy array containing the audio waveform, in float32 dtype.
    """
    
    if isinstance(file, bytes):
        inp = file
        file = 'pipe:'
    else:
        inp = None
    
    try:
        # This launches a subprocess to decode audio while down-mixing and resampling as necessary.
        # Requires the ffmpeg CLI and `ffmpeg-python` package to be installed.
        out, _ = (
            ffmpeg.input(file, threads=0)
            .output("-", format="s16le", acodec="pcm_s16le", ac=1, ar=sr)
            .run(cmd="ffmpeg", capture_stdout=True, capture_stderr=True, input=inp)
        )
    except ffmpeg.Error as e:
        raise RuntimeError(f"Failed to load audio: {e.stderr.decode()}") from e

    return np.frombuffer(out, np.int16).flatten().astype(np.float32) / 32768.0


def process_input_stream_chunks(chunk_size=CHUNK_SIZE):
    while True:
        audio_bytes = sys.stdin.buffer.readline()
        if not audio_bytes:
            break

        audio_array = load_audio(audio_bytes)
        print(audio_array)

        yield audio_array


def transcribe_test():
    """
    Reads audio data from stdin, transcribes it, and returns the resulting text.
    """
    model = whisper.load_model("tiny")

    audio_bytes = sys.stdin.buffer.read()
    if len(audio_bytes) == 0:
        return
    
    audio_array = load_audio(audio_bytes)

    # decode the audio
    result = model.transcribe(audio_array, language="english", fp16=False)

    sys.stdout.write(result["text"])
    sys.stdout.flush()


def fine_tuned_transcribe():
    """
    Reads audio data from stdin and uses low-level whisper methods to transcribe the audio.
    """
    model = whisper.load_model("tiny")

    audio_bytes = sys.stdin.buffer.read()
    if len(audio_bytes) == 0:
        return
    
    audio_array = load_audio(audio_bytes)
    formatted_audio = whisper.pad_or_trim(audio_array)
    # make log-Mel spectrogram and move to the same device as the model
    mel = whisper.log_mel_spectrogram(formatted_audio).to(model.device)

    # decode the audio
    options = whisper.DecodingOptions(language="english", fp16=False)
    result: DecodingResult = whisper.decode(model, mel, options)

    sys.stdout.write(result.text)
    sys.stdout.flush()



def transcribe():
    """
    Reads audio data from stdin, transcribes it, and returns the resulting text.
    """
    model = whisper.load_model("tiny")

    audio_bytes = sys.stdin.buffer.read()
    if len(audio_bytes) == 0:
        return
    
    audio_array = load_audio(audio_bytes)

    result = model.transcribe(audio_array, language="english", fp16=False)

    sys.stdout.write(result["segments"])
    sys.stdout.flush()


def process_audio_chunks(chunk_size=CHUNK_SIZE):
    while True:
        audio_bytes = sys.stdin.buffer.read(chunk_size)
        if not audio_bytes:
            break
        
        numpy_array = load_audio(audio_bytes)
        text = transcribe_audio(numpy_array)
        sys.stdout.write(text)
        sys.stdout.flush()

        # yield text

def transcribe_audio(audio_array):
    model = whisper.load_model("tiny")

    # transcribe the audio using openai's whisper library
    result = model.transcribe(audio_array, language="english", fp16=False)
    return result["text"]

# audio_chunks = process_audio_chunks()
# transcribed_text = ''

# # Use itertools.chain() to combine all chunks of audio data
# for chunk in audio_chunks:


#     # Use next() to retrieve each chunk for processing
#     transcribed_text += chunk

# sys.stdout.write(transcribed_text)
# sys.stdout.flush()


process_audio_chunks()