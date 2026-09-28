// Конфигурация игры. Все константы вынесены сюда для удобства настройки.
export const CONFIG = {
    // Настройки холста
    canvas: {
        width: 320,
        height: 480,
        bgColor: "#70c5ce"
    },

    // Настройки физики
    physics: {
        gravity: 0.25,
        jumpForce: 4.6
    },

    // Настройки птицы (игрока)
    bird: {
        x: 50,
        y: 150,
        width: 34,
        height: 26,
        radius: 12
    },

    // Настройки препятствий (труб)
    pipes: {
        width: 53,
        height: 400,
        gap: 85,
        speed: 2,
        spawnInterval: 100, // Кадры между спавном
        maxYPos: -150
    },

    // Координаты объектов на спрайт-листе
    sprites: {
        background: { sX: 0, sY: 0, w: 275, h: 226 },
        foreground: { sX: 276, sY: 0, w: 224, h: 112 },
        birdFrames: [
            { sX: 276, sY: 112 },
            { sX: 276, sY: 139 },
            { sX: 276, sY: 164 },
            { sX: 276, sY: 139 }
        ],
        pipeTop: { sX: 553, sY: 0 },
        pipeBottom: { sX: 502, sY: 0 },
        getReady: { sX: 0, sY: 228, w: 173, h: 152 },
        gameOver: { sX: 175, sY: 228, w: 225, h: 202 }
    },

    // Позиции UI элементов
    ui: {
        startButton: { x: 120, y: 263, w: 83, h: 29 },
        getReadyMsg: { x: 73.5, y: 80 }, // (320 - 173) / 2
        gameOverMsg: { x: 47.5, y: 90 }, // (320 - 225) / 2
        score: {
            playing: { x: 160, y: 50, font: "35px Teko" }, // 320 / 2
            overCurrent: { x: 225, y: 186, font: "25px Teko" },
            overBest: { x: 225, y: 228, font: "25px Teko" }
        }
    },

    // Пути к ресурсам
    assets: {
        sprite: "img/sprite.png",
        audio: {
            score: "audio/sfx_point.wav",
            flap: "audio/sfx_flap.wav",
            hit: "audio/sfx_hit.wav",
            swoosh: "audio/sfx_swooshing.wav",
            die: "audio/sfx_die.wav"
        }
    }
};

// Состояния игры
export const GAME_STATE = {
    READY: 'ready',
    PLAYING: 'playing',
    OVER: 'over'
};