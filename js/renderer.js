import { CONFIG, GAME_STATE } from './config.js';

// Класс для отрисовки игры на Canvas.
// Не содержит игровой логики, только визуализация состояния.
export class CanvasRenderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.sprite = new Image();
        this.sprite.src = CONFIG.assets.sprite;
    }

    // Главный метод отрисовки кадра
    render(game) {
        this.clearCanvas();
        this.drawBackground();
        this.drawPipes(game.pipes);
        this.drawForeground(game.foregroundX);
        this.drawBird(game.bird, game.frames);

        this.drawUI(game.state, game.score, game.bestScore);
    }

    clearCanvas() {
        this.ctx.fillStyle = CONFIG.canvas.bgColor;
        this.ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);
    }

    drawBackground() {
        const bg = CONFIG.sprites.background;
        const y = CONFIG.canvas.height - bg.h;
        // Рисуем два раза для бесконечного фона
        this.ctx.drawImage(this.sprite, bg.sX, bg.sY, bg.w, bg.h, 0, y, bg.w, bg.h);
        this.ctx.drawImage(this.sprite, bg.sX, bg.sY, bg.w, bg.h, bg.w, y, bg.w, bg.h);
    }

    drawForeground(offsetX) {
        const fg = CONFIG.sprites.foreground;
        const y = CONFIG.canvas.height - fg.h;
        this.ctx.drawImage(this.sprite, fg.sX, fg.sY, fg.w, fg.h, offsetX, y, fg.w, fg.h);
        this.ctx.drawImage(this.sprite, fg.sX, fg.sY, fg.w, fg.h, offsetX + fg.w, y, fg.w, fg.h);
    }

    drawBird(bird, frames) {
        // Расчет кадра анимации (визуальная логика, не игровая)
        const period = 5;
        let frameIndex = Math.floor(frames / period) % CONFIG.sprites.birdFrames.length;

        // Если птица падает, меняем кадр
        if (bird.speed >= CONFIG.physics.jumpForce) {
            frameIndex = 1;
        }

        const frame = CONFIG.sprites.birdFrames[frameIndex];
        const w = CONFIG.bird.width;
        const h = CONFIG.bird.height;

        this.ctx.save();
        this.ctx.translate(bird.x, bird.y);
        this.ctx.rotate(bird.rotation);
        this.ctx.drawImage(this.sprite, frame.sX, frame.sY, w, h, -w / 2, -h / 2, w, h);
        this.ctx.restore();
    }

    drawPipes(pipes) {
        const topSprite = CONFIG.sprites.pipeTop;
        const bottomSprite = CONFIG.sprites.pipeBottom;
        const w = CONFIG.pipes.width;
        const h = CONFIG.pipes.height;
        const gap = CONFIG.pipes.gap;

        for (let pipe of pipes) {
            // Верхняя труба
            this.ctx.drawImage(this.sprite, topSprite.sX, topSprite.sY, w, h, pipe.x, pipe.y, w, h);
            // Нижняя труба
            const bottomY = pipe.y + h + gap;
            this.ctx.drawImage(this.sprite, bottomSprite.sX, bottomSprite.sY, w, h, pipe.x, bottomY, w, h);
        }
    }

    drawUI(state, score, bestScore) {
        if (state === GAME_STATE.READY) {
            const msg = CONFIG.sprites.getReady;
            this.ctx.drawImage(this.sprite, msg.sX, msg.sY, msg.w, msg.h, CONFIG.ui.getReadyMsg.x, CONFIG.ui.getReadyMsg.y, msg.w, msg.h);
        }
        else if (state === GAME_STATE.OVER) {
            const msg = CONFIG.sprites.gameOver;
            this.ctx.drawImage(this.sprite, msg.sX, msg.sY, msg.w, msg.h, CONFIG.ui.gameOverMsg.x, CONFIG.ui.gameOverMsg.y, msg.w, msg.h);
            this.drawScoreText(score, CONFIG.ui.score.overCurrent);
            this.drawScoreText(bestScore, CONFIG.ui.score.overBest);
        }
        else if (state === GAME_STATE.PLAYING) {
            this.drawScoreText(score, CONFIG.ui.score.playing);
        }
    }

    // Вспомогательный метод для отрисовки текста (соблюдение DRY)
    drawScoreText(value, style) {
        this.ctx.fillStyle = "#FFF";
        this.ctx.strokeStyle = "#000";
        this.ctx.lineWidth = 2;
        this.ctx.font = style.font;
        this.ctx.textAlign = "center"; // Для центрирования на этапе игры

        if (style === CONFIG.ui.score.playing) {
            this.ctx.fillText(value, style.x, style.y);
            this.ctx.strokeText(value, style.x, style.y);
        } else {
            this.ctx.textAlign = "left"; // Для экрана Game Over
            this.ctx.fillText(value, style.x, style.y);
            this.ctx.strokeText(value, style.x, style.y);
        }
    }
}