# CoquiLLM Voice Assistant

A modern voice-enabled AI assistant built with Next.js, featuring speech recognition, LLM integration via Ollama, and text-to-speech using Coqui TTS.

## Features

- 🎤 **Speech Recognition**: Browser-based voice input with real-time transcription
- 🤖 **LLM Integration**: Powered by Ollama for intelligent responses
- 🔊 **Text-to-Speech**: Voice cloning with Coqui TTS using custom voice samples
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🌓 **Dark Mode**: Modern glassmorphism UI with neon accents
- ⚡ **Real-time**: Live conversation flow with visual feedback

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Ollama** - for LLM functionality
- **Coqui TTS** - for text-to-speech synthesis

## Setup Instructions

### 1. Install Ollama

**Windows/macOS/Linux:**
```bash
# Visit https://ollama.ai and download the installer
# Or use the following commands:

# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows: Download from https://ollama.ai/download
```

**Pull the required model:**
```bash
ollama pull gemma3:12b
```

**Start Ollama server:**
```bash
ollama serve
```
The server will run on `http://localhost:11434`

### 2. Install Coqui TTS

**Using pip:**
```bash
pip install TTS
```

**Start Coqui TTS server:**
```bash
tts-server --model_name tts_models/multilingual/multi-dataset/xtts_v2 --port 5002
```
The TTS server will run on `http://localhost:5002`

### 3. Install Project Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd CoquiLLM

# Install dependencies
npm install
```

### 4. Voice Sample Setup

The application includes a placeholder voice sample at `/public/voice_samples/myvoice.wav`. To use your own voice:

1. Record a clear audio sample (1-5 seconds, WAV format recommended)
2. Replace `/public/voice_samples/myvoice.wav` with your audio file
3. Ensure the file is named `myvoice.wav` or update the path in `/src/app/api/tts/route.ts`

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. **Grant Microphone Permission**: When prompted, allow microphone access
2. **Start Recording**: Click the microphone button to begin voice input
3. **Speak Clearly**: The app will show real-time transcription
4. **Stop Recording**: Click the button again to stop and process your input
5. **AI Response**: The assistant will respond with both text and synthesized speech

## API Endpoints

- **POST /api/ask**: Processes user queries via Ollama LLM
- **POST /api/tts**: Converts text to speech using Coqui TTS

## Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Frontend      │────│   Next.js    │────│   Browser APIs  │
│   (React)       │    │   API Routes │    │   (Speech)      │
└─────────────────┘    └──────────────┘    └─────────────────┘
         │                       │                     │
         │                       │                     │
         ▼                       ▼                     ▼
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Ollama        │    │   Coqui TTS  │    │   Voice Sample  │
│   (LLM)         │    │   (Voice)    │    │   (myvoice.wav) │
│   :11434        │    │   :5002      │    │   /public/      │
└─────────────────┘    └──────────────┘    └─────────────────┘
```

## Configuration

### Environment Variables

Create a `.env.local` file for custom configuration:

```env
# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=gemma3:12b

# Coqui TTS Configuration
TTS_HOST=http://localhost:5002
TTS_MODEL=xtts_v2

# Voice Sample Path
VOICE_SAMPLE_PATH=/voice_samples/myvoice.wav
```

## Troubleshooting

### Common Issues

**1. Microphone not working:**
- Ensure browser permissions are granted
- Check if HTTPS is required for your deployment
- Verify microphone hardware functionality

**2. Ollama connection failed:**
- Verify Ollama is running: `ollama list`
- Check if the model is downloaded: `ollama pull gemma3:12b`
- Ensure port 11434 is available

**3. TTS not working:**
- Confirm Coqui TTS server is running on port 5002
- Verify the voice sample file exists and is accessible
- Check TTS server logs for errors

**4. Build/Runtime errors:**
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check browser console for JavaScript errors

### Browser Compatibility

- **Chrome/Edge**: Full support ✅
- **Firefox**: Speech Recognition requires flags ⚠️
- **Safari**: Limited Speech Recognition support ⚠️
- **Mobile**: iOS Safari and Chrome Mobile supported ✅

## Development

### Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── ask/route.ts      # LLM integration
│   │   └── tts/route.ts      # Text-to-speech
│   ├── globals.css           # Styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── MicButton.tsx        # Recording button
│   ├── Toast.tsx            # Notifications
│   └── ToastContainer.tsx   # Toast manager
└── hooks/
    ├── useAssistant.ts      # Main logic
    └── useSpeechRecognition.ts # Speech handling
```

### Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by [Ollama](https://ollama.ai) for LLM capabilities
- Voice synthesis by [Coqui TTS](https://github.com/coqui-ai/TTS)
- UI components with [Tailwind CSS](https://tailwindcss.com)
