// Utility to generate synthesized alert sounds using Web Audio API
// Designed to be "irritating" and high-pitched for maximum alertness

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;

const initAudio = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        masterGain = audioContext.createGain();
        masterGain.connect(audioContext.destination);
        masterGain.gain.value = 0.8; // High volume
    } else if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
};

const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.2; // Urgent speed
        utterance.pitch = 1.2; // Higher pitch voice
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
    }
};

export const stopAudio = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    if (audioContext && audioContext.state === 'running') {
        if (masterGain) {
            // Fast cut-off
            masterGain.gain.cancelScheduledValues(audioContext.currentTime);
            masterGain.gain.setValueAtTime(masterGain.gain.value, audioContext.currentTime);
            masterGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
            setTimeout(() => {
                audioContext?.suspend();
                if (masterGain) masterGain.gain.value = 0.8;
            }, 50);
        } else {
            audioContext.suspend();
        }
    }
};

const playOscillator = (ctx: AudioContext, type: OscillatorType, freq: number, startTime: number, duration: number, vol = 0.1) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(vol, startTime + 0.01); // Instant attack
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(masterGain!);

    osc.start(startTime);
    osc.stop(startTime + duration);
};

// "Irritating" Sound Effects
const soundEffects = {
    // Drowsiness: High-pitched Square Wave Strobe
    drowsiness: (ctx: AudioContext) => {
        const now = ctx.currentTime;
        // 3000Hz Square wave pulses (Very harsh)
        for (let i = 0; i < 5; i++) {
            playOscillator(ctx, 'square', 3000, now + (i * 0.1), 0.05, 0.4);
        }
        // Underlying dissonance
        playOscillator(ctx, 'sawtooth', 2500, now, 0.5, 0.2);
    },

    // Rage/Distraction: Chaotic Sawtooth Sweep
    rage: (ctx: AudioContext) => {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';

        // Sweep from 2000Hz to 5000Hz very quickly
        osc.frequency.setValueAtTime(2000, now);
        osc.frequency.linearRampToValueAtTime(5000, now + 0.1);
        osc.frequency.linearRampToValueAtTime(2000, now + 0.2);
        osc.frequency.linearRampToValueAtTime(5000, now + 0.3);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(masterGain!);
        osc.start(now);
        osc.stop(now + 0.3);

        // High static noise feel
        playOscillator(ctx, 'square', 4000, now, 0.3, 0.2);
    },

    // No Face: Constant High Tone
    no_face: (ctx: AudioContext) => {
        const now = ctx.currentTime;
        // Continuous high beep
        playOscillator(ctx, 'sine', 3500, now, 0.1, 0.3);
        playOscillator(ctx, 'square', 3000, now + 0.1, 0.1, 0.2);
    }
};

export const playAlertSound = (type: 'drowsiness' | 'rage' | 'no_face') => {
    const ctx = initAudio();
    if (!ctx) return;

    // Play SFX
    if (soundEffects[type]) {
        soundEffects[type](ctx);
    }

    // Voice Overlay
    if (type === 'drowsiness') {
        speakMessage("WAKE UP! WAKE UP!");
    } else if (type === 'no_face') {
        speakMessage("DRIVER NOT FOUND!");
    } else {
        speakMessage("DISTRACTED! EYES ON ROAD!"); // Rage -> Distraction
    }
};
