import { CONFIG } from './config.js';

// Класс для управления звуковыми эффектами
export class AudioManager {
    constructor() {
        this.sounds = {};
        this.loadSounds();
    }

    loadSounds() {
        for (const [key, src] of Object.entries(CONFIG.assets.audio)) {
            const audio = new Audio();
            audio.src = src;
            this.sounds[key] = audio;
        }
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            // Сбрасываем на начало, чтобы можно было быстро нажимать
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(e => console.warn("Audio play error:", e));
        }
    }
}