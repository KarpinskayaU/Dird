import { CONFIG } from './config.js';
import { BirdPhysics } from './physics.js';
import { Game } from './game.js';
import { CanvasRenderer } from './renderer.js';
import { AudioManager } from './audio.js';
import { InputHandler } from './input.js';

// Инициализация холста
const canvas = document.getElementById("roket");
const ctx = canvas.getContext("2d");
canvas.width = CONFIG.canvas.width;
canvas.height = CONFIG.canvas.height;

// Создание экземпляров классов
const physics = new BirdPhysics(CONFIG);
const game = new Game(physics);
const renderer = new CanvasRenderer(ctx);
const audio = new AudioManager();
const input = new InputHandler(canvas, game, audio);

// Игровой цикл
function loop() {
    // 1. Обновляем логику
    game.update();

    // 2. Проверяем сигналы от игры для звуков (коллизии, очки)
    // В данном упрощенном варианте звуки коллизий и очков можно обрабатывать
    // через отслеживание изменений состояния, но для простоты добавим проверку в game.js
    // (См. примечание ниже, в идеале game должен эмитить события)

    // 3. Отрисовываем кадр
    renderer.render(game);

    // Запуск следующего кадра
    requestAnimationFrame(loop);
}

// Запуск игры
loop();