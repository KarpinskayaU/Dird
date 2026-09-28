import { CONFIG, GAME_STATE } from './config.js';

// Основной класс игры. Содержит всю игровую логику, состояния и правила.
export class Game {
    constructor(physics) {
        this.physics = physics;
        this.state = GAME_STATE.READY;
        this.frames = 0;

        // Счет и рекорд
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('best')) || 0;

        // Инициализация сущностей
        this.bird = this.createBird();
        this.pipes = [];
        this.foregroundX = 0;
    }

    createBird() {
        return {
            x: CONFIG.bird.x,
            y: CONFIG.bird.y,
            speed: 0,
            rotation: 0
        };
    }

    // Обработка прыжка (ввода от игрока)
    flap() {
        if (this.state === GAME_STATE.READY) {
            this.state = GAME_STATE.PLAYING;
            return 'swoosh';
        }
        if (this.state === GAME_STATE.PLAYING) {
            if (this.bird.y - CONFIG.bird.radius <= 0) return null;
            this.physics.applyJump(this.bird);
            return 'flap';
        }
        return null;
    }

    // Обработка клика при окончании игры
    handleGameOverClick(clickX, clickY) {
        if (this.state !== GAME_STATE.OVER) return false;

        const btn = CONFIG.ui.startButton;
        if (clickX >= btn.x && clickX <= btn.x + btn.w &&
            clickY >= btn.y && clickY <= btn.y + btn.h) {
            this.restart();
            return true;
        }
        return false;
    }

    restart() {
        this.pipes = [];
        this.physics.reset(this.bird);
        this.score = 0;
        this.state = GAME_STATE.READY;
    }

    // Главный метод обновления логики
    update() {
        this.frames++;

        if (this.state === GAME_STATE.READY) {
            this.bird.y = CONFIG.bird.y; // Возврат на стартовую позицию
            this.bird.rotation = 0;
        }
        else if (this.state === GAME_STATE.PLAYING) {
            this.physics.update(this.bird);
            this.updatePipes();
            this.checkCollisions();
            this.updateForeground();
        }
    }

    updatePipes() {
        // Спавн новых труб
        if (this.frames % CONFIG.pipes.spawnInterval === 0) {
            this.pipes.push({
                x: CONFIG.canvas.width,
                y: CONFIG.pipes.maxYPos * (Math.random() + 1)
            });
        }

        // Движение и удаление труб
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            let pipe = this.pipes[i];
            pipe.x -= CONFIG.pipes.speed;

            // Начисление очков, когда труба полностью прошла за птицу
            if (pipe.x + CONFIG.pipes.width <= 0) {
                this.pipes.shift();
                this.score++;
                if (this.score > this.bestScore) {
                    this.bestScore = this.score;
                    localStorage.setItem("best", this.bestScore);
                }
                return 'score'; // Сигнал для воспроизведения звука
            }
        }
    }

    updateForeground() {
        // Бесконечная прокрутка переднего плана
        this.foregroundX = (this.foregroundX - CONFIG.pipes.speed) % (CONFIG.sprites.foreground.w / 2);
    }

    checkCollisions() {
        const bird = this.bird;
        const groundY = CONFIG.canvas.height - CONFIG.sprites.foreground.h;

        // Столкновение с землей
        if (bird.y + CONFIG.bird.height / 2 >= groundY) {
            bird.y = groundY - CONFIG.bird.height / 2;
            this.state = GAME_STATE.OVER;
            return 'die';
        }

        // Столкновение с трубами
        for (let pipe of this.pipes) {
            const topPipeBottom = pipe.y + CONFIG.pipes.height;
            const bottomPipeTop = pipe.y + CONFIG.pipes.height + CONFIG.pipes.gap;

            // Проверка верхней трубы
            if (this.isColliding(pipe.x, pipe.y, topPipeBottom)) {
                this.state = GAME_STATE.OVER;
                return 'hit';
            }
            // Проверка нижней трубы
            if (this.isColliding(pipe.x, bottomPipeTop, bottomPipeTop + CONFIG.pipes.height)) {
                this.state = GAME_STATE.OVER;
                return 'hit';
            }
        }
        return null;
    }

    // Вспомогательный метод для проверки пересечения хитбоксов (AABB)
    isColliding(pipeX, pipeTopY, pipeBottomY) {
        const bird = this.bird;
        const r = CONFIG.bird.radius;

        return (bird.x + r > pipeX && bird.x - r < pipeX + CONFIG.pipes.width &&
            bird.y + r > pipeTopY && bird.y - r < pipeBottomY);
    }
}