document.addEventListener("DOMContentLoaded", () => {
    const heartsContainer = document.getElementById('hearts-container');
    const music = document.getElementById('background-music');
    const playPauseButton = document.getElementById('play-pause');
    let maxHearts = 50; // Nombre maximum de cœurs à l'écran à un moment donné
    let hearts = [];

    function createHeart(x, y) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.classList.add(Math.random() > 0.5 ? 'red-heart' : 'white-heart'); // Alternance entre les couleurs
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        heartsContainer.appendChild(heart);
        hearts.push({ element: heart, speed: Math.random() * 0.5 + 0.5, x: x, y: y });

        // Animation du cœur tombant
        animateHeart(heart);
    }

    function animateHeart(heart) {
        const index = hearts.findIndex(h => h.element === heart);
        if (index === -1) return; // Si le cœur n'est plus dans la liste, arrêtez l'animation

        let heartData = hearts[index];
        let currentTop = heartData.y;
        let currentLeft = heartData.x;

        // Animation continue
        requestAnimationFrame(() => {
            currentTop += heartData.speed; // Déplacement vers le bas
            currentLeft += Math.sin(currentTop / 10) * 3; // Légère oscillation horizontale

            if (currentTop > window.innerHeight) {
                // Si le cœur sort de l'écran, on le repositionne au hasard en haut
                currentTop = -20;
                currentLeft = Math.random() * window.innerWidth;
                heartData.speed = Math.random() * 0.5 + 0.5; // Réinitialisation de la vitesse
            }

            heartData.y = currentTop;
            heartData.x = currentLeft;
            heart.style.top = `${currentTop}px`;
            heart.style.left = `${currentLeft}px`;
            heart.style.transform = `rotate(${currentTop}deg)`; // Rotation en fonction de la position pour l'effet flottant

            animateHeart(heart); // Continue l'animation
        });
    }

    // Générer des cœurs à intervalles réguliers
    setInterval(() => {
        if (hearts.length < maxHearts) {
            const screenWidth = window.innerWidth;
            createHeart(Math.random() * screenWidth, -20);
        }
    }, 500);

    // Tentative de contournement des politiques autoplay strictes
    function attemptPlay() {
        if (music.paused) {
            music.play().catch(error => {
                console.log('Autoplay a été bloqué par le navigateur, veuillez interagir avec la page pour lancer la musique.');
                // Si l'autoplay échoue, attendez un clic utilisateur
                document.addEventListener('click', attemptPlay, { once: true });
            });
        }
    }

    // Gestion du bouton play/pause
    playPauseButton.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            playPauseButton.textContent = "Stop"; // Changer le texte en "Stop"
        } else {
            music.pause();
            playPauseButton.textContent = "Play"; // Changer le texte en "Play"
        }
    });

    // Première tentative de lecture à l'ouverture de la page
    attemptPlay();
});
