# Audio Summarizer

## Overview:

The goal of this project is to take a recording of a podcast or audiobook,
read it through OpenAI Whisper and then create a TLDR summary using OpenAI
Davinci.

## Features:

- Create a series of notes based on the text generated from the recording.
- Can upload audio files for analysis

### System:
<img src="https://github.com/IM-Deane/auvid/blob/main/system-diagram.png" />

### Stack:

- [NextJS](https://nextjs.org/)
- [RecordRTC for Audio](https://recordrtc.org/)
- [OpenAI Whisper](https://github.com/openai/whisper)
- [OpenAI Davinci](https://beta.openai.com/docs/introduction)
