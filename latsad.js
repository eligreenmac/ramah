document.addEventListener('DOMContentLoaded', () => {
    const heritageQuestions = [
        {
            question: 'מה שם ענף ה"א בהקמתו?',
            image: 'לצד.jpeg',
            hasImage: true,
            correctText: 'ענף בקורת אוירונאוטית',
            options: [
                { text: "ענף סיקורים", isCorrect: false },
                { text: "ענף איכות", isCorrect: false },
                { text: "ענף בקורת אוירונאוטית", isCorrect: true },
                { text: "ענף איכות ותקינה", isCorrect: false }
            ]
        },
        {
            question: 'מה שם ענף תנופה בהקמתו?',
            image: null,
            hasImage: false,
            correctText: 'אימונים טכניים',
            options: [
                { text: "אימונים טכניים", isCorrect: true },
                { text: "תעופה הדרכתית", isCorrect: false },
                { text: "תנופה אוירונאוטית", isCorrect: false },
                { text: "אימון אחזקתי", isCorrect: false }
            ]
        }
    ];

    let currentStep = 0;
    let isTransitioning = false;

    const quizImage = document.getElementById('quizImage');
    const imageBox = document.getElementById('imageBox');
    const mysteryOverlay = document.getElementById('mysteryOverlay');
    const questionText = document.getElementById('questionText');
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
    const fullscreenText = document.getElementById('fullscreenText');
    const revealCountdown = document.getElementById('revealCountdown');
    let revealTimerInterval = null;

    function loadQuizStep(stepIndex) {
        isTransitioning = false;
        const qData = heritageQuestions[stepIndex];

        // Update progress bar & text
        currentStepText.textContent = `שאלה ${stepIndex + 1} מתוך ${heritageQuestions.length}`;
        progressFill.style.width = `${((stepIndex + 1) / heritageQuestions.length) * 100}%`;

        // Update Question Text
        questionText.textContent = qData.question;

        // Handle Image Box vs Text Question
        if (qData.hasImage && qData.image) {
            imageBox.classList.remove('hidden');
            quizImage.src = qData.image;
            if (mysteryOverlay) mysteryOverlay.classList.remove('revealed');
            quizImage.classList.remove('revealed');
        } else {
            imageBox.classList.add('hidden');
        }

        // Clear feedback
        feedbackMsg.textContent = '';
        feedbackMsg.className = 'feedback-msg';

        // Render options in shuffled order
        const shuffledOptions = [...qData.options];
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
        }

        optionsContainer.innerHTML = '';
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `
                <span>${opt.text}</span>
                <i class="fa-regular fa-circle"></i>
            `;
            btn.addEventListener('click', () => handleOptionClick(opt, qData, btn));
            optionsContainer.appendChild(btn);
        });
    }

    function handleOptionClick(opt, qData, buttonEl) {
        if (isTransitioning) return;

        if (opt.isCorrect) {
            isTransitioning = true;
            buttonEl.classList.add('btn-correct');
            buttonEl.querySelector('i').className = 'fa-solid fa-circle-check';

            if (qData.hasImage) {
                if (mysteryOverlay) mysteryOverlay.classList.add('revealed');
                quizImage.classList.add('revealed');
            }

            feedbackMsg.textContent = 'תשובה נכונה! 🥳';
            feedbackMsg.className = 'feedback-msg correct';

            // Configure Fullscreen Reveal (Image or Big Text)
            if (qData.hasImage && qData.image) {
                fullscreenImg.classList.remove('hidden');
                fullscreenImg.src = qData.image;
                fullscreenText.classList.add('hidden');
            } else {
                fullscreenImg.classList.add('hidden');
                fullscreenText.classList.remove('hidden');
                fullscreenText.textContent = qData.correctText;
            }

            fullscreenReveal.classList.add('active');

            // Confetti burst
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 80,
                    spread: 80,
                    origin: { y: 0.6 }
                });
            }

            // 2-second countdown
            let timeLeft = 2;
            if (revealCountdown) revealCountdown.textContent = timeLeft;

            clearInterval(revealTimerInterval);
            revealTimerInterval = setInterval(() => {
                timeLeft--;
                if (revealCountdown) revealCountdown.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(revealTimerInterval);
                    fullscreenReveal.classList.remove('active');
                    setTimeout(() => {
                        if (currentStep < heritageQuestions.length - 1) {
                            currentStep++;
                            loadQuizStep(currentStep);
                        } else {
                            showWinScreen();
                        }
                    }, 300);
                }
            }, 1000);

        } else {
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

    function startQuiz() {
        winScreen.classList.add('hidden');
        currentStep = 0;
        loadQuizStep(0);
    }

    restartBtn.addEventListener('click', startQuiz);

    // Initialize Quiz
    startQuiz();
});
