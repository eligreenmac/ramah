document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const playText = document.getElementById('playText');
    const vinylDisc = document.getElementById('vinylDisc');
    const equalizer = document.getElementById('equalizer');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const currentTimeEl = document.getElementById('currentTime');
    const durationTimeEl = document.getElementById('durationTime');

    function formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function togglePlay() {
        if (audio.paused) {
            audio.play().then(() => {
                setPlayingState(true);
            }).catch(err => {
                console.error("Audio playback error:", err);
            });
        } else {
            audio.pause();
            setPlayingState(false);
        }
    }

    function setPlayingState(isPlaying) {
        if (isPlaying) {
            playBtn.classList.add('playing');
            playIcon.className = 'fa-solid fa-pause';
            playText.textContent = 'PAUSE';
            vinylDisc.classList.add('playing');
            equalizer.classList.add('playing');
        } else {
            playBtn.classList.remove('playing');
            playIcon.className = 'fa-solid fa-play';
            playText.textContent = 'PLAY';
            vinylDisc.classList.remove('playing');
            equalizer.classList.remove('playing');
        }
    }

    // Event Listeners
    playBtn.addEventListener('click', togglePlay);

    audio.addEventListener('loadedmetadata', () => {
        durationTimeEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        if (!audio.duration) return;
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        if (audio.duration && durationTimeEl.textContent === "00:00") {
            durationTimeEl.textContent = formatTime(audio.duration);
        }
    });

    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        if (duration) {
            audio.currentTime = (clickX / width) * duration;
        }
    });

    audio.addEventListener('ended', () => {
        setPlayingState(false);
        progressBar.style.width = '0%';
        audio.currentTime = 0;
    });
});
