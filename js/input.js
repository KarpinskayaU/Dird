import { GAME_STATE } from './config.js';

// Класс для обработки событий ввода (клики/тапы)
export class InputHandler {
    constructor(canvas, game, audio) {
        this.canvas = canvas;
        this.game = game;
        this.audio = audio;

        this.canvas.addEventListener("click", this.handleClick.bind(this));
    }

    handleClick(evt) {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = evt.clientX - rect.left;
        const clickY = evt.clientY - rect.top;

        // Если игра окончена, проверяем клик по кнопке рестарта
        if (this.game.state === GAME_STATE.OVER) {
            this.game.handleGameOverClick(clickX, clickY);
            return;
        }

        // Иначе обрабатываем прыжок
        const soundEvent = this.game.flap();
        if (soundEvent) {
            this.audio.play(soundEvent);
        }
    }
}