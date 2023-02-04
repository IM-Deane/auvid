import sys
import os
import whisper
from whisper.utils import write_txt, write_vtt, write_srt


def transcribe_file(file):
    """
    Accepts an audio file and transcribes it using Whisper.
    """
    file_extension = os.path.splitext(file)[1]
    if file_extension in ["mp3", ".wav", ".flac", ".ogg", ".m4a", ".wma"]:
        model = whisper.load_model("tiny")
        # load audio and pad/trim it to fit 30 seconds
        # audio = whisper.load_audio(file)
        # audio = whisper.pad_or_trim(audio)

        # # make log-Mel spectrogram and move to the same device as the model
        # mel = whisper.log_mel_spectrogram(audio).to(model.device)

        # # decode the audio
        # options = whisper.DecodingOptions()
        # # options["sample_len"] = 10
        # result = whisper.decode(model, mel, options)

        # # print the recognized text
        # print(result.text.strip())


        result = model.transcribe(file, language="english")
        print(result["text"].strip()) # send to stdout

        audio_basename = os.path.basename(file)
        # output_dir = os.path.dirname(file)

        # save TXT
        # with open(os.path.join(output_dir, audio_basename + ".txt"), "w", encoding="utf-8") as txt:
        #     write_txt(result["segments"], file=txt)

        # # save VTT
        # with open(os.path.join(output_dir, audio_basename + ".vtt"), "w", encoding="utf-8") as vtt:
        #     write_vtt(result["segments"], file=vtt)

        # # save SRT
        # with open(os.path.join(output_dir, audio_basename + ".srt"), "w", encoding="utf-8") as srt:
        #     write_srt(result["segments"], file=srt)


# pass resulting text back to node.js
transcribe_file(sys.argv[1])
# sys.stdout.flush()