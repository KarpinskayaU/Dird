// Класс для расчета физики птицы (гравитация, прыжок, наклон)
export class BirdPhysics {
    constructor(config) {
        this.gravity = config.physics.gravity;
        this.jumpForce = config.physics.jumpForce;
    }

    // Обновление позиции и скорости птицы под действием гравитации
    update(bird) {
        bird.speed += this.gravity;
        bird.y += bird.speed;

        // Расчет угла наклона в зависимости от скорости
        const DEGREE = Math.PI / 180;
        if (bird.speed >= this.jumpForce) {
            bird.rotation = 90 * DEGREE;
        } else {
            bird.rotation = -25 * DEGREE;
        }
    }

    // Применение импульса прыжка
    applyJump(bird) {
        bird.speed = -this.jumpForce;
    }

    // Сброс скорости
    reset(bird) {
        bird.speed = 0;
    }
}