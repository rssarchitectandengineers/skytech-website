/**
 * SkyTech Structural Consultant - Brand Introduction Video Player
 * High-precision canvas engineering visualization & video controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initBrandVideoPlayer();
});

function initBrandVideoPlayer() {
  const openButtons = document.querySelectorAll('[data-open-video]');
  const videoModal = document.getElementById('brandVideoModal');
  if (!videoModal) return;

  const closeBtn = videoModal.querySelector('.modal-close-btn');
  const canvas = document.getElementById('videoCanvasStage');
  const playPauseBtn = document.getElementById('videoPlayPauseBtn');
  const muteBtn = document.getElementById('videoMuteBtn');
  const volumeSlider = document.getElementById('videoVolumeSlider');
  const progressBar = document.getElementById('videoProgressBar');
  const progressFill = document.getElementById('videoProgressFill');
  const timeDisplay = document.getElementById('videoTimeDisplay');

  let isPlaying = false;
  let isMuted = false;
  let volume = 0.8;
  let currentTime = 0;
  const duration = 75; // 75 seconds video showcase
  let animationFrameId = null;

  // Open modal
  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      videoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      startVideoPlayback();
    });
  });

  // Close modal
  const handleClose = () => {
    videoModal.classList.remove('active');
    document.body.style.overflow = '';
    stopVideoPlayback();
  };

  if (closeBtn) closeBtn.addEventListener('click', handleClose);
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) handleClose();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
      handleClose();
    }
  });

  // Play / Pause
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseVideoPlayback();
      } else {
        startVideoPlayback();
      }
    });
  }

  // Mute
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      updateAudioState();
    });
  }

  // Volume
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      volume = parseFloat(e.target.value);
      isMuted = volume === 0;
      updateAudioState();
    });
  }

  // Progress Bar Seek
  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      currentTime = pct * duration;
      updateProgressUI();
    });
  }

  function updateAudioState() {
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
  }

  function updateProgressUI() {
    const pct = (currentTime / duration) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (timeDisplay) {
      const curM = Math.floor(currentTime / 60);
      const curS = Math.floor(currentTime % 60);
      const durM = Math.floor(duration / 60);
      const durS = Math.floor(duration % 60);
      timeDisplay.textContent = `${curM}:${curS < 10 ? '0' : ''}${curS} / ${durM}:${durS < 10 ? '0' : ''}${durS}`;
    }
  }

  function startVideoPlayback() {
    isPlaying = true;
    if (playPauseBtn) {
      playPauseBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1"></rect>
          <rect x="14" y="4" width="4" height="16" rx="1"></rect>
        </svg>
      `;
    }
    renderLoop();
  }

  function pauseVideoPlayback() {
    isPlaying = false;
    if (playPauseBtn) {
      playPauseBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      `;
    }
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  }

  function stopVideoPlayback() {
    pauseVideoPlayback();
    currentTime = 0;
    updateProgressUI();
  }

  /* -------------------------------------------------------------
   * Canvas Dynamic Engineering Simulation
   * Renders 3D Wireframe Skyscraper, Strain Heatmap, and Blueprint Grid
   * ------------------------------------------------------------- */
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth || 800;
    canvas.height = canvas.parentElement.clientHeight || 450;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  let angle = 0;
  let lastTimestamp = performance.now();

  function renderLoop(now = performance.now()) {
    const delta = (now - lastTimestamp) / 1000;
    lastTimestamp = now;

    if (isPlaying) {
      currentTime += delta;
      if (currentTime >= duration) currentTime = 0;
      angle += delta * 0.45;
      updateProgressUI();
    }

    drawScene(angle);

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(renderLoop);
    }
  }

  function drawScene(rot) {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Dark engineering background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#060d17');
    bgGrad.addColorStop(1, '#0b192c');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Blueprint grid
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // SkyTech Brand Video Watermark & Telemetry
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px "Space Grotesk", sans-serif';
    ctx.fillText('SKYTECH STRUCTURAL CONSULTANT  •  FEA SIMULATION ENGINE', 25, 30);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`IS 1893:2016 SEISMIC ANALYSIS  •  LOAD STEP: ${(currentTime * 4.2).toFixed(1)} kN  •  DISP: ${(Math.sin(rot * 2) * 2.4 + 4.1).toFixed(2)} mm`, 25, 48);

    // 3D Isometric Skyscraper Skeleton
    const cx = w / 2;
    const cy = h / 2 + 50;
    const levels = 10;
    const radius = Math.min(w, h) * 0.22;

    for (let l = 0; l <= levels; l++) {
      const yOffset = -l * 24;
      const pts = [];
      const numSides = 4;
      for (let i = 0; i < numSides; i++) {
        const a = rot + (i * Math.PI * 2) / numSides;
        const px = cx + Math.cos(a) * radius;
        const py = cy + Math.sin(a) * (radius * 0.45) + yOffset;
        pts.push({ x: px, y: py });
      }

      // Draw Floor Slab
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();

      // Stress Heatmap Gradient
      const stressRatio = (levels - l) / levels;
      ctx.fillStyle = stressRatio > 0.7 ? 'rgba(239, 68, 68, 0.12)' : stressRatio > 0.4 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(14, 165, 233, 0.1)';
      ctx.fill();

      ctx.strokeStyle = stressRatio > 0.7 ? '#f87171' : stressRatio > 0.4 ? '#fbbf24' : '#38bdf8';
      ctx.lineWidth = l === 0 || l === levels ? 2 : 1;
      ctx.stroke();

      // Draw Cross Bracing for Steel Towers
      if (l > 0) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 0.8;
        for (let i = 0; i < numSides; i++) {
          const next = (i + 1) % numSides;
          const prevYOffset = -(l - 1) * 24;
          const prevA = rot + (i * Math.PI * 2) / numSides;
          const prevNextA = rot + (next * Math.PI * 2) / numSides;

          const p1x = cx + Math.cos(prevA) * radius;
          const p1y = cy + Math.sin(prevA) * (radius * 0.45) + prevYOffset;
          const p2x = cx + Math.cos(prevNextA) * radius;
          const p2y = cy + Math.sin(prevNextA) * (radius * 0.45) + prevYOffset;

          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(p2x, p2y);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(pts[next].x, pts[next].y);
          ctx.lineTo(p1x, p1y);
          ctx.stroke();
        }
      }
    }

    // Engineering Callout Overlay Box
    const calloutX = w - 240;
    const calloutY = h - 120;
    ctx.fillStyle = 'rgba(6, 13, 23, 0.88)';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(calloutX, calloutY, 215, 80, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px "Space Grotesk", sans-serif';
    ctx.fillText('STRUCTURAL HEALTH: 100% OK', calloutX + 14, calloutY + 24);
    ctx.fillStyle = '#10b981';
    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('✔ Seismic Base Shear Checked', calloutX + 14, calloutY + 42);
    ctx.fillText('✔ Lateral Drift < H / 250 (Pass)', calloutX + 14, calloutY + 58);
  }

  // Initial draw
  drawScene(0);
}
