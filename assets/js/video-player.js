/**
 * The Skytech Structural Consultant - Responsive Video & 3D Walkthrough Player
 * Optimized for Mobile Phones, Tablets, Laptops & Desktops
 */

document.addEventListener('DOMContentLoaded', () => {
  initBrandVideoPlayer();
});

function initBrandVideoPlayer() {
  const openButtons = document.querySelectorAll('[data-open-video]');
  const videoModal = document.getElementById('brandVideoModal');
  if (!videoModal) return;

  const closeBtn = videoModal.querySelector('.modal-close-btn');
  const videoEl = document.getElementById('brandVideoPlayer');
  const centerPlayOverlay = document.getElementById('videoCenterPlayBtn');
  const playPauseBtn = document.getElementById('videoPlayPauseBtn');
  const muteBtn = document.getElementById('videoMuteBtn');
  const volumeSlider = document.getElementById('videoVolumeSlider');
  const progressBar = document.getElementById('videoProgressBar');
  const progressFill = document.getElementById('videoProgressFill');
  const timeDisplay = document.getElementById('videoTimeDisplay');
  const fullscreenBtn = document.getElementById('videoFullscreenBtn');

  if (!videoEl) return;

  // Track state
  let isDraggingProgress = false;

  // Open modal & start video
  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      videoModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Attempt to play video
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          updatePlayPauseUI(true);
        }).catch(() => {
          // Auto-play was prevented by browser policy (user interaction required)
          updatePlayPauseUI(false);
        });
      }
    });
  });

  // Close modal & stop video
  const handleClose = () => {
    videoModal.classList.remove('active');
    document.body.style.overflow = '';
    videoEl.pause();
    updatePlayPauseUI(false);
  };

  if (closeBtn) closeBtn.addEventListener('click', handleClose);
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) handleClose();
  });

  document.addEventListener('keydown', (e) => {
    if (!videoModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'm' || e.key === 'M') {
      toggleMute();
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    }
  });

  // Toggle play/pause
  function togglePlay() {
    if (videoEl.paused || videoEl.ended) {
      videoEl.play();
      updatePlayPauseUI(true);
    } else {
      videoEl.pause();
      updatePlayPauseUI(false);
    }
  }

  function updatePlayPauseUI(isPlaying) {
    if (playPauseBtn) {
      playPauseBtn.innerHTML = isPlaying ? `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1"></rect>
          <rect x="14" y="4" width="4" height="16" rx="1"></rect>
        </svg>
      ` : `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      `;
      playPauseBtn.setAttribute('aria-label', isPlaying ? 'Pause Video' : 'Play Video');
    }

    if (centerPlayOverlay) {
      if (isPlaying) {
        centerPlayOverlay.classList.add('hidden');
      } else {
        centerPlayOverlay.classList.remove('hidden');
      }
    }
  }

  // Click on video canvas/surface or center button to toggle play
  videoEl.addEventListener('click', togglePlay);
  if (centerPlayOverlay) {
    centerPlayOverlay.addEventListener('click', togglePlay);
  }
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlay);
  }

  // Update progress on timeupdate
  videoEl.addEventListener('timeupdate', () => {
    if (isDraggingProgress) return;
    const current = videoEl.currentTime;
    const dur = videoEl.duration || 1;
    const pct = (current / dur) * 100;

    if (progressFill) progressFill.style.width = `${pct}%`;
    if (timeDisplay) {
      timeDisplay.textContent = `${formatTime(current)} / ${formatTime(dur)}`;
    }
  });

  videoEl.addEventListener('loadedmetadata', () => {
    if (timeDisplay) {
      timeDisplay.textContent = `0:00 / ${formatTime(videoEl.duration)}`;
    }
  });

  videoEl.addEventListener('ended', () => {
    updatePlayPauseUI(false);
  });

  // Progress Bar Seek
  if (progressBar) {
    const handleSeek = (e) => {
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      if (videoEl.duration) {
        videoEl.currentTime = pct * videoEl.duration;
      }
      if (progressFill) progressFill.style.width = `${pct * 100}%`;
    };

    progressBar.addEventListener('click', handleSeek);

    // Touch support for mobile seek
    progressBar.addEventListener('touchstart', (e) => {
      isDraggingProgress = true;
    }, { passive: true });

    progressBar.addEventListener('touchmove', (e) => {
      if (!isDraggingProgress || !e.touches[0]) return;
      const rect = progressBar.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      const pct = Math.max(0, Math.min(1, touchX / rect.width));
      if (progressFill) progressFill.style.width = `${pct * 100}%`;
    }, { passive: true });

    progressBar.addEventListener('touchend', (e) => {
      if (!isDraggingProgress || !e.changedTouches[0]) return;
      isDraggingProgress = false;
      const rect = progressBar.getBoundingClientRect();
      const touchX = e.changedTouches[0].clientX - rect.left;
      const pct = Math.max(0, Math.min(1, touchX / rect.width));
      if (videoEl.duration) {
        videoEl.currentTime = pct * videoEl.duration;
      }
    });
  }

  // Mute / Unmute
  function toggleMute() {
    videoEl.muted = !videoEl.muted;
    updateAudioUI();
  }

  function updateAudioUI() {
    const isMuted = videoEl.muted || videoEl.volume === 0;
    if (muteBtn) {
      muteBtn.innerHTML = isMuted ? `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      ` : `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      `;
    }
    if (volumeSlider && !isMuted) {
      volumeSlider.value = videoEl.volume;
    }
  }

  if (muteBtn) muteBtn.addEventListener('click', toggleMute);

  // Volume Slider (Laptop / Desktop)
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      videoEl.volume = val;
      videoEl.muted = val === 0;
      updateAudioUI();
    });
  }

  // Fullscreen Toggle
  function toggleFullscreen() {
    const wrapper = videoEl.closest('.video-player-wrapper') || videoEl;
    if (!document.fullscreenElement) {
      if (wrapper.requestFullscreen) {
        wrapper.requestFullscreen();
      } else if (wrapper.webkitRequestFullscreen) {
        wrapper.webkitRequestFullscreen();
      } else if (videoEl.webkitEnterFullscreen) {
        // Native iOS Safari fullscreen
        videoEl.webkitEnterFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
}
