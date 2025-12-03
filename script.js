document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURACIÓN DEL JUEGO ---
    const levelsOriginal = [
        {
            answer: "puedo", 
            clue: "Que está justo después del saludo en la primera carta.",
            isFirst: true // ESTA PROPIEDAD INDICA QUE ESTA VA PRIMERO SIEMPRE
        },
        {
            answer: "tener",
            clue: "Rayada en otra carta, es algo que quiero contigo."
        },
        {
            answer: "dicha",
            clue: "Después del saludo, es otra carta diferente."
        },
        {
            answer: "decirte",
            clue: "En la última carta que recibiste, es lo que quiero hacer."
        }
    ];

    // Función para mezclar (barajar) arrays
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // --- LÓGICA DE ORDENAMIENTO ---
    // 1. Separamos la que debe ir primero
    const firstLevel = levelsOriginal.find(level => level.isFirst);
    // 2. Separamos las demás
    const otherLevels = levelsOriginal.filter(level => !level.isFirst);
    // 3. Mezclamos solo las demás
    const shuffledOthers = shuffleArray([...otherLevels]);
    // 4. Unimos: Primero la fija + luego las mezcladas
    let levels = [firstLevel, ...shuffledOthers];


    let currentLevel = 0;

    // Elementos del DOM
    const clueText = document.getElementById('clue-text');
    const wordInput = document.getElementById('word-input');
    const submitBtn = document.getElementById('submit-btn');
    const errorMsg = document.getElementById('error-message');
    const dotsContainer = document.getElementById('dots-container');
    const gameScreen = document.getElementById('game-screen');
    const finalScreen = document.getElementById('final-screen');
    
    // Botones finales
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');

    // Generar puntos de progreso
    levels.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.dot');

    function loadLevel() {
        const levelData = levels[currentLevel];
        const letterCount = levelData.answer.length;
        
        // Muestra pista + cantidad de letras
        clueText.textContent = `${levelData.clue} (${letterCount} letras)`;
        wordInput.value = '';
        wordInput.focus();
        errorMsg.classList.add('hidden');
        
        dots.forEach((dot, index) => {
            if (index <= currentLevel) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    function normalize(text) {
        return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    }

    function checkAnswer() {
        const userAnswer = normalize(wordInput.value);
        const correctAnswer = normalize(levels[currentLevel].answer);

        if (userAnswer === correctAnswer) {
            currentLevel++;
            if (currentLevel < levels.length) {
                loadLevel();
            } else {
                showFinalScreen();
            }
        } else {
            errorMsg.classList.remove('hidden');
            wordInput.style.borderColor = "red";
            setTimeout(() => { wordInput.style.borderColor = "#ddd"; }, 500);
        }
    }

    function showFinalScreen() {
        gameScreen.classList.add('hidden');
        finalScreen.classList.remove('hidden');
    }

    // Eventos del juego
    submitBtn.addEventListener('click', checkAnswer);
    wordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });

    // --- LÓGICA DE LOS BOTONES FINALES ---

    // 1. Botón SÍ
    yesBtn.addEventListener('click', () => {
        // Mensaje de éxito
        alert("¡SABÍA QUE DIRÍAS QUE SÍ! TE QUIERO MUCHO❤️");
        document.body.style.backgroundColor = "#ffc1c1";
        finalScreen.innerHTML = '<h1 style="font-size:3rem; color:#d32f2f;">¡Gracias! ❤️</h1><p style="font-size:1.5rem;">Me haces muy feliz.</p>';
    });

    // 2. Botón NO (Se escapa)
    // Para PC
    noBtn.addEventListener('mouseover', moveButton);
    
    // Para Celular (Touch)
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); 
        moveButton();
    }, { passive: false });

    function moveButton() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;

        const newX = Math.random() * (windowWidth - btnWidth - 20);
        const newY = Math.random() * (windowHeight - btnHeight - 20);
        
        noBtn.style.position = "fixed"; 
        noBtn.style.left = Math.max(10, newX) + "px";
        noBtn.style.top = Math.max(10, newY) + "px";
    }

    // Iniciar
    loadLevel();
});