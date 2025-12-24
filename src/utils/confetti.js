// Confetti utility for win celebrations
import confetti from 'canvas-confetti';

// Standard celebration
export const celebrate = () => {
    // First burst
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    // Second burst after slight delay
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
    }, 150);

    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
    }, 300);
};

// Big celebration for perfect scores
export const bigCelebrate = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#39ff14', '#ffffff', '#8b5cf6']
        });

        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#39ff14', '#ffffff', '#8b5cf6']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    };

    frame();
};

// Cricket themed confetti
export const cricketCelebrate = () => {
    confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#39ff14', '#8b5cf6', '#ffffff', '#ffd700'],
        shapes: ['circle', 'square'],
        scalar: 1.2
    });
};
