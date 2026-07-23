document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // שמות 7 מדורי הענף לבחירה
    // -------------------------------------------------------------
    const SECTIONS = [
        "ספרות",
        "אנגלית",
        "איכות התעשיה",
        "מעוף להדרכה",
        "הכשרות ואימונים",
        "אחזקה",
        "בטיחות"
    ];

    // הגדרת 7 התמונות והתשובה הנכונה עבור כל תמונה
    const rawQuizData = [
        { image: "ספרות.jpeg", correctIndex: 0 },
        { image: "אנגלית.jpeg", correctIndex: 1 },
        { image: "איכות תעשיה.jpeg", correctIndex: 2 },
        { image: "מעוף להדרכה.jpeg", correctIndex: 3 },
        { image: "כשירות ואימון.jpeg", correctIndex: 4 },
        { image: "אחזקה.jpeg", correctIndex: 5 },
        { image: "בטיחות.jpeg", correctIndex: 6 }
    ];

    let currentStep = 0;
    let isTransitioning = false;
    let activeQuizData = [];

    // DOM Elements
    const quizImage = document.getElementById('quizImage');
    const mysteryOverlay = document.getElementById('mysteryOverlay');
    const optionsContainer = document.getElementById('optionsContainer');
    const currentStepText = document.getElementById('currentStepText');
    const progressFill = document.getElementById('progressFill');
    const feedbackMsg = document.getElementById('feedbackMsg');
    const winScreen = document.getElementById('winScreen');
    const restartBtn = document.getElementById('restartBtn');
    const lockIconContainer = document.getElementById('lockIconContainer');
    const lockIcon = document.getElementById('lockIcon');

    const fullscreenReveal = document.getElementById('fullscreenReveal');
    const fullscreenImg = document.getElementById('fullscreenImg');
    const revealCountdown = document.getElementById('revealCountdown');
    let revealTimerInterval = null;

    // Shuffle Quiz Images Array
    function shuffleQuizImages() {
        activeQuizData = [...rawQuizData];
        for (let i = activeQuizData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [activeQuizData[i], activeQuizData[j]] = [activeQuizData[j], activeQuizData[i]];
        }
    }

    function loadQuizStep(stepIndex) {
        isTransitioning = false;
        const data = activeQuizData[stepIndex];

        // Update progress bar & text
        currentStepText.textContent = `תמונה ${stepIndex + 1} מתוך ${activeQuizData.length}`;
        progressFill.style.width = `${((stepIndex + 1) / activeQuizData.length) * 100}%`;

        // Update image
        if (stepIndex === 0) {
            quizImage.src = data.image;
            quizImage.classList.remove('fade-out');
        } else {
            quizImage.classList.add('fade-out');
            setTimeout(() => {
                quizImage.src = data.image;
                quizImage.classList.remove('fade-out');
            }, 150);
        }

        // Clear feedback
        feedbackMsg.textContent = '';
        feedbackMsg.className = 'feedback-msg';

        // Render option buttons in random shuffled display order
        optionsContainer.innerHTML = '';
        const optionsList = SECTIONS.map((name, index) => ({ name, originalIndex: index }));
        
        // Fisher-Yates shuffle for options
        for (let i = optionsList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [optionsList[i], optionsList[j]] = [optionsList[j], optionsList[i]];
        }

        optionsList.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `
                <span>${opt.name}</span>
                <i class="fa-regular fa-circle"></i>
            `;
            btn.addEventListener('click', () => handleOptionClick(opt.originalIndex, data.correctIndex, btn));
            optionsContainer.appendChild(btn);
        });
    }

    function handleOptionClick(selectedIndex, correctIndex, buttonEl) {
        if (isTransitioning) return;

        if (selectedIndex === correctIndex) {
            // Correct Answer! Fullscreen Image Reveal & Confetti!
            isTransitioning = true;
            buttonEl.classList.add('btn-correct');
            buttonEl.querySelector('i').className = 'fa-solid fa-circle-check';

            feedbackMsg.textContent = 'תשובה נכונה! 🥳';
            feedbackMsg.className = 'feedback-msg correct';

            // Open Fullscreen Reveal Modal
            if (fullscreenReveal && fullscreenImg) {
                fullscreenImg.src = activeQuizData[currentStep].image;
                fullscreenReveal.classList.add('active');
            }

            // Trigger confetti burst
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 80,
                    spread: 80,
                    origin: { y: 0.6 }
                });
            }

            // 2-second countdown timer
            let timeLeft = 2;
            if (revealCountdown) revealCountdown.textContent = timeLeft;

            clearInterval(revealTimerInterval);
            revealTimerInterval = setInterval(() => {
                timeLeft--;
                if (revealCountdown) revealCountdown.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(revealTimerInterval);
                    if (fullscreenReveal) fullscreenReveal.classList.remove('active');
                    setTimeout(() => {
                        if (currentStep < activeQuizData.length - 1) {
                            currentStep++;
                            loadQuizStep(currentStep);
                        } else {
                            showWinScreen();
                        }
                    }, 300);
                }
            }, 1000);

        } else {
            // Wrong Answer!
            buttonEl.classList.add('btn-wrong');
            buttonEl.querySelector('i').className = 'fa-solid fa-circle-xmark';

            feedbackMsg.textContent = 'תשובה שגויה, נסה שוב!';
            feedbackMsg.className = 'feedback-msg wrong';

            setTimeout(() => {
                buttonEl.classList.remove('btn-wrong');
                buttonEl.querySelector('i').className = 'fa-regular fa-circle';
            }, 1200);
        }
    }

    function showWinScreen() {
        winScreen.classList.remove('hidden');

        if (lockIconContainer && lockIcon) {
            lockIcon.className = 'fa-solid fa-lock';
            lockIconContainer.classList.remove('unlocked');
            
            setTimeout(() => {
                lockIcon.className = 'fa-solid fa-lock-open';
                lockIconContainer.classList.add('unlocked');
            }, 300);
        }

        if (typeof confetti === 'function') {
            confetti({
                particleCount: 120,
                spread: 100,
                origin: { y: 0.6 }
            });
        }
    }

    function startNewGame() {
        winScreen.classList.add('hidden');
        shuffleQuizImages();
        currentStep = 0;
        loadQuizStep(0);
    }

    restartBtn.addEventListener('click', startNewGame);

    // Initialize Quiz with shuffled image order
    startNewGame();
});
