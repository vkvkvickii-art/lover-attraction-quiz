/**
 * 《测测你最容易吸引什么样的恋人》核心交互、六维魅力匹配引擎与法式海报生成器
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'lover_attraction_quiz_progress_15q_v1';
  const SHARE_URL_KEY = 'lover_attraction_share_url_v1';
  const TOTAL_QUESTIONS = QUESTIONS.length;
  const DIM_KEYS = DIMENSIONS.map((d) => d.key);

  const state = {
    currentIndex: 0,
    answers: new Array(TOTAL_QUESTIONS).fill(null),
    isTransitioning: false,
    lastResult: null,
    customShareUrl: ''
  };

  // =========================================================================
  // 1. 六维白化向量匹配引擎（自动计算均值、协方差与白化矩阵）
  // =========================================================================
  const engine = initScoringEngine();

  function initScoringEngine() {
    const n = DIM_KEYS.length;
    const mean = new Array(n).fill(0);
    const cov = Array.from({ length: n }, () => new Array(n).fill(0));
    const minRaw = new Array(n).fill(0);
    const maxRaw = new Array(n).fill(0);

    for (const q of QUESTIONS) {
      const qMean = new Array(n).fill(0);
      const k = q.options.length;

      for (let i = 0; i < n; i++) {
        const key = DIM_KEYS[i];
        const vals = q.options.map((opt) => opt.scores[key] || 0);
        minRaw[i] += Math.min(...vals);
        maxRaw[i] += Math.max(...vals);
        qMean[i] = vals.reduce((a, b) => a + b, 0) / k;
        mean[i] += qMean[i];
      }

      for (const opt of q.options) {
        const diff = DIM_KEYS.map((key, i) => (opt.scores[key] || 0) - qMean[i]);
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            cov[i][j] += (diff[i] * diff[j]) / k;
          }
        }
      }
    }

    const std = cov.map((row, i) => Math.sqrt(Math.max(row[i], 1e-6)));
    const { vals, vecs } = jacobiSymmetricEigen(cov);
    const W = Array.from({ length: n }, () => new Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let m = 0; m < n; m++) {
          const invSqrt = 1 / Math.sqrt(Math.max(vals[m], 1e-6));
          W[i][j] += vecs[i][m] * invSqrt * vecs[j][m];
        }
      }
    }

    const charProfiles = CHARACTERS.map((char) => {
      const zTarget = DIM_KEYS.map((key) => (char.target[key] - 50) / 25);
      const xCentered = zTarget.map((z, i) => z * std[i]);
      const wVec = matVecMul(W, xCentered);
      const wNorm = Math.hypot(...wVec) || 1;
      return {
        character: char,
        wUnit: wVec.map((v) => v / wNorm),
        bias: char.bias || 0
      };
    });

    return { mean, std, minRaw, maxRaw, W, charProfiles };
  }

  function jacobiSymmetricEigen(matrix) {
    const n = matrix.length;
    const M = matrix.map((row) => row.slice());
    const V = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );

    for (let iter = 0; iter < 100; iter++) {
      let p = 0;
      let q = 1;
      let maxOff = 0;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          if (Math.abs(M[i][j]) > maxOff) {
            maxOff = Math.abs(M[i][j]);
            p = i;
            q = j;
          }
        }
      }
      if (maxOff < 1e-11) break;

      const theta = 0.5 * Math.atan2(2 * M[p][q], M[q][q] - M[p][p]);
      const c = Math.cos(theta);
      const s = Math.sin(theta);

      for (let i = 0; i < n; i++) {
        const mip = M[i][p];
        const miq = M[i][q];
        M[i][p] = c * mip - s * miq;
        M[i][q] = s * mip + c * miq;
      }
      for (let i = 0; i < n; i++) {
        const mpi = M[p][i];
        const mqi = M[q][i];
        M[p][i] = c * mpi - s * mqi;
        M[q][i] = s * mpi + c * mqi;
      }
      M[p][q] = 0;
      M[q][p] = 0;

      for (let i = 0; i < n; i++) {
        const vip = V[i][p];
        const viq = V[i][q];
        V[i][p] = c * vip - s * viq;
        V[i][q] = s * vip + c * viq;
      }
    }

    return {
      vals: M.map((row, i) => row[i]),
      vecs: V
    };
  }

  function matVecMul(M, v) {
    return M.map((row) => row.reduce((sum, x, idx) => sum + x * v[idx], 0));
  }

  function evaluateQuizResult(answers) {
    const raw = new Array(DIM_KEYS.length).fill(0);

    answers.forEach((optIdx, qIdx) => {
      const validIdx = optIdx !== null && optIdx >= 0 ? optIdx : 0;
      const opt = QUESTIONS[qIdx].options[validIdx];
      DIM_KEYS.forEach((key, dIdx) => {
        raw[dIdx] += opt.scores[key] || 0;
      });
    });

    const centered = raw.map((val, i) => val - engine.mean[i]);
    const zScores = centered.map((val, i) => val / engine.std[i]);

    const displayScores = {};
    const dimDetails = DIMENSIONS.map((dim, i) => {
      const linearRatio =
        (raw[i] - engine.minRaw[i]) / Math.max(1, engine.maxRaw[i] - engine.minRaw[i]);
      const sigmoidRatio = 1 / (1 + Math.exp(-0.85 * zScores[i]));
      const blended = 0.45 * linearRatio + 0.55 * sigmoidRatio;
      const score = Math.round(Math.min(98, Math.max(16, blended * 100)));
      displayScores[dim.key] = score;
      return {
        ...dim,
        score,
        z: zScores[i]
      };
    });

    const wUser = matVecMul(engine.W, centered);
    const wNorm = Math.hypot(...wUser);
    const wUnit = wNorm > 1e-6 ? wUser.map((v) => v / wNorm) : [1, 0, 0, 0, 0, 0];

    const ranked = engine.charProfiles
      .map((profile) => {
        let cosine = 0;
        for (let i = 0; i < wUnit.length; i++) {
          cosine += wUnit[i] * profile.wUnit[i];
        }
        const adjustedScore = cosine + profile.bias;
        const clampedCos = Math.max(-0.5, Math.min(1, adjustedScore));
        const matchPct = Math.round(84 + ((clampedCos + 0.5) / 1.5) * 15);
        return {
          character: profile.character,
          rawSim: adjustedScore,
          cosine,
          matchPct: Math.min(99, Math.max(83, matchPct))
        };
      })
      .sort((a, b) => b.rawSim - a.rawSim);

    const best = ranked[0];
    const runnerUp = ranked[1];

    const sortedByStrength = [...dimDetails].sort((a, b) => b.score - a.score);
    const topDim1 = sortedByStrength[0];
    const topDim2 = sortedByStrength[1];
    const dynamicNote = `你的魅力雷达中，「${topDim1.fullName}」（${topDim1.score}分）与「${topDim2.fullName}」（${topDim2.score}分）信号最强。`;

    return {
      best,
      runnerUp,
      displayScores,
      dimDetails,
      dynamicReason: `${dynamicNote}${best.character.reason}`
    };
  }

  // =========================================================================
  // 2. DOM 节点缓存与初始化
  // =========================================================================
  const els = {};

  function cacheElements() {
    els.viewHome = document.getElementById('view-home');
    els.viewQuiz = document.getElementById('view-quiz');
    els.viewComputing = document.getElementById('view-computing');
    els.viewResult = document.getElementById('view-result');

    els.rosterChips = document.getElementById('roster-chips');
    els.btnStart = document.getElementById('btn-start');
    els.resumeBanner = document.getElementById('resume-banner');
    els.resumeCount = document.getElementById('resume-count');
    els.btnResume = document.getElementById('btn-resume');

    els.chapterBadge = document.getElementById('chapter-badge');
    els.currentNum = document.getElementById('current-q-num');
    els.totalNum = document.getElementById('total-q-num');
    els.progressFill = document.getElementById('progress-fill');
    els.questionStage = document.getElementById('question-stage');
    els.questionTitle = document.getElementById('question-title');
    els.optionsList = document.getElementById('options-list');
    els.btnPrev = document.getElementById('btn-prev');
    els.btnNext = document.getElementById('btn-next');

    els.resMatchPct = document.getElementById('res-match-pct');
    els.resName = document.getElementById('res-name');
    els.resCourtesy = document.getElementById('res-courtesy');
    els.resVerdict = document.getElementById('res-verdict');
    els.resSeal = document.getElementById('res-seal');
    els.resTags = document.getElementById('res-tags');
    els.resQuote = document.getElementById('res-quote');
    els.resRadarWrap = document.getElementById('res-radar-wrap');
    els.resDimBars = document.getElementById('res-dim-bars');
    els.resRunnerUp = document.getElementById('res-runner-up');
    els.resTraits = document.getElementById('res-traits');
    els.resReason = document.getElementById('res-reason');
    els.resAdvantage = document.getElementById('res-advantage');
    els.resScene = document.getElementById('res-scene');
    els.resSweetSpot = document.getElementById('res-sweetspot');
    els.resWarning = document.getElementById('res-warning');
    els.resQrBox = document.getElementById('res-qr-box');

    els.btnSavePoster = document.getElementById('btn-save-poster');
    els.btnCopyText = document.getElementById('btn-copy-text');
    els.btnCleanShot = document.getElementById('btn-clean-shot');
    els.btnRestart = document.getElementById('btn-restart');
    els.qrUrlInput = document.getElementById('qr-url-input');
    els.btnUpdateQr = document.getElementById('btn-update-qr');
    els.cleanShotToast = document.getElementById('clean-shot-toast');
    els.toastMsg = document.getElementById('toast-msg');

    els.posterModal = document.getElementById('poster-modal');
    els.posterModalImg = document.getElementById('poster-modal-img');
    els.posterModalClose = document.getElementById('poster-modal-close');
  }

  function initApp() {
    cacheElements();
    loadSavedShareUrl();
    renderRosterPreview();
    checkSavedProgress();
    bindEvents();
  }

  function loadSavedShareUrl() {
    try {
      const saved = localStorage.getItem(SHARE_URL_KEY);
      if (saved && saved.trim()) {
        state.customShareUrl = saved.trim();
      }
    } catch (_) {
      // ignore
    }
  }

  function getActiveShareUrl() {
    if (state.customShareUrl) return state.customShareUrl;
    if (typeof window !== 'undefined' && window.location && window.location.href) {
      const host = window.location.hostname || '';
      const isLocal =
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host === '0.0.0.0' ||
        window.location.protocol === 'file:';
      if (!isLocal && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
        return window.location.href.split('#')[0];
      }
    }
    if (typeof QUIZ_CONFIG !== 'undefined' && QUIZ_CONFIG.defaultShareUrl) {
      return QUIZ_CONFIG.defaultShareUrl;
    }
    if (typeof window !== 'undefined' && window.location && window.location.href.startsWith('http')) {
      return window.location.href.split('#')[0];
    }
    return 'https://lover-attraction-quiz.example.com/';
  }

  function refreshQRCodeUI() {
    const url = getActiveShareUrl();
    if (els.qrUrlInput) {
      els.qrUrlInput.value = url;
    }
    const qrApi = typeof MiniQR !== 'undefined' ? MiniQR : (typeof window !== 'undefined' && window.MiniQR);
    if (els.resQrBox && qrApi) {
      els.resQrBox.innerHTML = qrApi.renderQRToSVG(url, '#2A1F23', '#FFFFFF');
    }
  }

  function renderRosterPreview() {
    els.rosterChips.innerHTML = CHARACTERS.map(
      (c) => `<span class="roster-chip">✦ ${c.seal} · ${c.name.replace(/恋人|伴侣/, '')}</span>`
    ).join('');
    els.totalNum.textContent = String(TOTAL_QUESTIONS);
  }

  // =========================================================================
  // 3. 本地进度存储与恢复
  // =========================================================================
  function saveProgress() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentIndex: state.currentIndex,
          answers: state.answers
        })
      );
    } catch (_) {
      // ignore
    }
  }

  function clearProgress() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {
      // ignore
    }
  }

  function checkSavedProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.answers) && parsed.answers.length === TOTAL_QUESTIONS) {
        const answeredCount = parsed.answers.filter((a) => a !== null).length;
        if (answeredCount > 0 && answeredCount < TOTAL_QUESTIONS) {
          els.resumeCount.textContent = String(answeredCount);
          els.resumeBanner.classList.add('visible');
        }
      }
    } catch (_) {
      // ignore
    }
  }

  // =========================================================================
  // 4. 答题流转控制
  // =========================================================================
  function switchView(targetEl) {
    [els.viewHome, els.viewQuiz, els.viewComputing, els.viewResult].forEach((el) => {
      el.classList.toggle('active', el === targetEl);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startNewQuiz() {
    state.currentIndex = 0;
    state.answers = new Array(TOTAL_QUESTIONS).fill(null);
    state.isTransitioning = false;
    clearProgress();
    els.resumeBanner.classList.remove('visible');
    renderCurrentQuestion('next');
    switchView(els.viewQuiz);
  }

  function resumeSavedQuiz() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return startNewQuiz();
      const parsed = JSON.parse(raw);
      state.answers = parsed.answers;
      const firstUnanswered = state.answers.findIndex((a) => a === null);
      state.currentIndex =
        firstUnanswered !== -1
          ? firstUnanswered
          : Math.min(parsed.currentIndex || 0, TOTAL_QUESTIONS - 1);
      state.isTransitioning = false;
      renderCurrentQuestion('next');
      switchView(els.viewQuiz);
    } catch (_) {
      startNewQuiz();
    }
  }

  function renderCurrentQuestion(direction) {
    const q = QUESTIONS[state.currentIndex];
    const selectedIdx = state.answers[state.currentIndex];

    els.chapterBadge.textContent = q.chapter;
    els.currentNum.textContent = String(state.currentIndex + 1).padStart(2, '0');
    const pct = ((state.currentIndex + 1) / TOTAL_QUESTIONS) * 100;
    els.progressFill.style.width = `${pct.toFixed(1)}%`;

    els.questionStage.classList.remove('anim-next', 'anim-prev');
    void els.questionStage.offsetWidth;
    els.questionStage.classList.add(direction === 'prev' ? 'anim-prev' : 'anim-next');

    els.questionTitle.textContent = `${q.id}. ${q.question}`;

    els.optionsList.innerHTML = q.options
      .map((opt, idx) => {
        const isSelected = selectedIdx === idx ? 'selected' : '';
        return `
          <button type="button" class="option-btn ${isSelected}" data-idx="${idx}" aria-pressed="${selectedIdx === idx}">
            <span class="option-key">${opt.label}</span>
            <span class="option-text">${opt.text}</span>
          </button>
        `;
      })
      .join('');

    els.btnPrev.disabled = state.currentIndex === 0;
    els.btnNext.disabled = selectedIdx === null;
    els.btnNext.textContent =
      state.currentIndex === TOTAL_QUESTIONS - 1 ? '揭晓心动档案 →' : '下一题 →';
  }

  function handleSelectOption(optIndex) {
    if (state.isTransitioning) return;
    state.isTransitioning = true;
    state.answers[state.currentIndex] = optIndex;
    saveProgress();

    const buttons = els.optionsList.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
      const active = idx === optIndex;
      btn.classList.toggle('selected', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    els.btnNext.disabled = false;

    setTimeout(() => {
      if (state.currentIndex < TOTAL_QUESTIONS - 1) {
        state.currentIndex += 1;
        saveProgress();
        renderCurrentQuestion('next');
        state.isTransitioning = false;
      } else {
        finishQuiz();
      }
    }, 240);
  }

  function goPrevQuestion() {
    if (state.isTransitioning || state.currentIndex <= 0) return;
    state.currentIndex -= 1;
    saveProgress();
    renderCurrentQuestion('prev');
  }

  function goNextQuestion() {
    if (state.isTransitioning) return;
    if (state.answers[state.currentIndex] === null) return;
    if (state.currentIndex < TOTAL_QUESTIONS - 1) {
      state.currentIndex += 1;
      saveProgress();
      renderCurrentQuestion('next');
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    clearProgress();
    switchView(els.viewComputing);
    const result = evaluateQuizResult(state.answers);
    state.lastResult = result;

    setTimeout(() => {
      renderResultView(result);
      switchView(els.viewResult);
      state.isTransitioning = false;
    }, 950);
  }

  // =========================================================================
  // 5. 结果页面渲染与六维魅力雷达图
  // =========================================================================
  function renderResultView(result) {
    const char = result.best.character;
    const accent = char.accentColor || '#A84C60';

    els.resMatchPct.textContent = `磁场契合度 ${result.best.matchPct}%`;
    els.resName.textContent = char.name;
    els.resCourtesy.textContent = char.courtesy;
    els.resVerdict.textContent = char.title;
    els.resVerdict.style.color = accent;
    els.resSeal.textContent = char.seal;
    els.resSeal.style.background = `linear-gradient(135deg, ${accent} 0%, #6D597A 100%)`;

    els.resTags.innerHTML = char.tags
      .map((t) => `<span class="char-tag">✦ ${t}</span>`)
      .join('');

    els.resQuote.textContent = char.quote;
    els.resRadarWrap.innerHTML = buildRadarSVG(result.dimDetails, accent);

    els.resDimBars.innerHTML = result.dimDetails
      .map(
        (d) => `
        <div class="dim-bar-item">
          <span class="dim-bar-name">${d.name}</span>
          <div class="dim-bar-track">
            <div class="dim-bar-fill" style="width:${d.score}%; background:linear-gradient(90deg, ${accent}, #7B567B)"></div>
          </div>
          <span class="dim-bar-val">${d.score}</span>
        </div>
      `
      )
      .join('');

    els.resRunnerUp.innerHTML = `
      <span>隐藏备选桃花类型</span>
      <strong>${result.runnerUp.character.name} · ${result.runnerUp.matchPct}%</strong>
    `;

    els.resTraits.textContent = char.traits;
    els.resReason.textContent = result.dynamicReason;
    els.resAdvantage.textContent = char.advantage;

    els.resScene.textContent = char.easterEgg.scene;
    els.resSweetSpot.textContent = char.easterEgg.sweetSpot;
    els.resWarning.textContent = char.easterEgg.warning;

    refreshQRCodeUI();
  }

  function buildRadarSVG(dimDetails, accentColor) {
    const size = 220;
    const cx = size / 2;
    const cy = size / 2;
    const radius = 74;
    const levels = [0.33, 0.66, 1.0];

    const pointAt = (idx, rRatio) => {
      const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / 6;
      return [
        cx + radius * rRatio * Math.cos(angle),
        cy + radius * rRatio * Math.sin(angle)
      ];
    };

    const gridPolys = levels
      .map((lv) => {
        const pts = dimDetails
          .map((_, i) => pointAt(i, lv).map((n) => n.toFixed(1)).join(','))
          .join(' ');
        return `<polygon points="${pts}" fill="none" stroke="#E8DCE0" stroke-width="1" />`;
      })
      .join('');

    const axesLines = dimDetails
      .map((_, i) => {
        const [x, y] = pointAt(i, 1);
        return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#EFE5E8" stroke-width="1" />`;
      })
      .join('');

    const dataPoints = dimDetails.map((d, i) => pointAt(i, d.score / 100));
    const dataPolyStr = dataPoints
      .map((p) => p.map((n) => n.toFixed(1)).join(','))
      .join(' ');

    const dots = dataPoints
      .map(
        ([x, y]) =>
          `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="${accentColor}" stroke="#FFFFFF" stroke-width="1.4" />`
      )
      .join('');

    const labels = dimDetails
      .map((d, i) => {
        const [lx, ly] = pointAt(i, 1.25);
        return `<text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="600" fill="#5B4A51">${d.name}</text>`;
      })
      .join('');

    return `
      <svg viewBox="0 0 ${size} ${size}" role="img" aria-label="六维魅力磁场雷达图">
        ${gridPolys}
        ${axesLines}
        <polygon points="${dataPolyStr}" fill="${accentColor}" fill-opacity="0.18" stroke="${accentColor}" stroke-width="2" />
        ${dots}
        ${labels}
      </svg>
    `;
  }

  // =========================================================================
  // 6. 原生 Canvas 法式电影感高清分享海报生成（含扫码二维码）
  // =========================================================================
  function drawRoundedRect(ctx, x, y, w, h, r) {
    const rad = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.lineTo(x + w - rad, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
    ctx.lineTo(x + w, y + h - rad);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
    ctx.lineTo(x + rad, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
    ctx.lineTo(x, y + rad);
    ctx.quadraticCurveTo(x, y, x + rad, y);
    ctx.closePath();
  }

  function generateSharePoster(result) {
    const char = result.best.character;
    const shareUrl = getActiveShareUrl();
    const W = 900;
    const serif = '"Songti SC", "STSong", "Noto Serif SC", Georgia, serif';
    const sans = '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
    const accent = char.accentColor || '#A84C60';

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = 1650;
    const ctx = canvas.getContext('2d');

    const contentW = W - 144;
    const quoteLines = wrapCanvasText(ctx, char.quote, W - 196, `bold 25px ${serif}`);
    const qBoxY = 394;
    const qBoxH = quoteLines.length * 39 + 38;
    const radarBoxH = 264;

    const traitsLines = wrapCanvasText(ctx, char.traits, contentW, `21px ${sans}`).slice(0, 5);
    const reasonLines = wrapCanvasText(ctx, result.dynamicReason, contentW, `21px ${sans}`).slice(0, 5);
    const easterSummary = `宿命相遇：${char.easterEgg.scene} ｜ 避雷锦囊：${char.easterEgg.warning}`;
    const easterLines = wrapCanvasText(ctx, easterSummary, contentW, `21px ${sans}`).slice(0, 4);

    const secH = (lines) => 42 + lines.length * 33;
    const bodyEndY =
      qBoxY +
      qBoxH +
      26 +
      radarBoxH +
      26 +
      secH(traitsLines) +
      18 +
      secH(reasonLines) +
      18 +
      secH(easterLines);

    const footerTopY = bodyEndY + 28;
    const footerBoxH = 152;
    const H = footerTopY + footerBoxH + 58;
    canvas.height = H;

    // 1. 丝绒暖杏白底色 + 微醺玫瑰光晕
    ctx.fillStyle = '#F7EFEA';
    ctx.fillRect(0, 0, W, H);

    drawRoundedRect(ctx, 26, 26, W - 52, H - 52, 34);
    ctx.fillStyle = '#FFFDFC';
    ctx.fill();

    const g1 = ctx.createRadialGradient(W * 0.86, 120, 20, W * 0.86, 120, 440);
    g1.addColorStop(0, hexToRgba(accent, 0.12));
    g1.addColorStop(1, 'rgba(255, 253, 252, 0)');
    ctx.fillStyle = g1;
    ctx.fillRect(26, 26, W - 52, H - 52);

    const g2 = ctx.createRadialGradient(120, H * 0.52, 20, 120, H * 0.52, 420);
    g2.addColorStop(0, 'rgba(109, 89, 122, 0.09)');
    g2.addColorStop(1, 'rgba(255, 253, 252, 0)');
    ctx.fillStyle = g2;
    ctx.fillRect(26, 26, W - 52, H - 52);

    drawRoundedRect(ctx, 38, 38, W - 76, H - 76, 26);
    ctx.strokeStyle = '#DFC7A7';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // 2. 顶部法式杂志刊头
    ctx.fillStyle = '#8D7A82';
    ctx.font = `20px ${sans}`;
    ctx.fillText('L’AMOUR ARCHIVE · 心动引力报告', 72, 92);

    ctx.textAlign = 'right';
    ctx.fillStyle = accent;
    ctx.font = `bold 21px ${sans}`;
    ctx.fillText(`磁场契合度 ${result.best.matchPct}%`, W - 72, 92);
    ctx.textAlign = 'left';

    ctx.strokeStyle = '#EFE6E8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(72, 114);
    ctx.lineTo(W - 72, 114);
    ctx.stroke();

    // 3. 主标题与圆形徽章
    ctx.fillStyle = accent;
    ctx.font = `bold 21px ${sans}`;
    ctx.fillText('✦ 你最容易吸引的命定恋人画像', 72, 158);

    ctx.fillStyle = '#2A1F23';
    ctx.font = `bold 52px ${serif}`;
    ctx.fillText(char.name, 72, 226);

    ctx.fillStyle = '#8D7A82';
    ctx.font = `23px ${sans}`;
    ctx.fillText(char.courtesy, 72, 266);

    ctx.fillStyle = '#6D597A';
    ctx.font = `bold 26px ${serif}`;
    ctx.fillText(char.title, 72, 306);

    // 右上微醺渐变圆印
    const orbCx = W - 124;
    const orbCy = 206;
    const orbGrad = ctx.createLinearGradient(orbCx - 48, orbCy - 48, orbCx + 48, orbCy + 48);
    orbGrad.addColorStop(0, accent);
    orbGrad.addColorStop(1, '#6D597A');
    ctx.beginPath();
    ctx.arc(orbCx, orbCy, 50, 0, Math.PI * 2);
    ctx.fillStyle = orbGrad;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(orbCx, orbCy, 44, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold 24px ${serif}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char.seal, orbCx, orbCy + 1);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // 4. 胶囊标签组
    let tagX = 72;
    const tagY = 330;
    ctx.font = `20px ${sans}`;
    char.tags.forEach((tag) => {
      const label = `✦ ${tag}`;
      const tw = ctx.measureText(label).width + 32;
      drawRoundedRect(ctx, tagX, tagY, tw, 38, 19);
      ctx.fillStyle = '#FFF7F8';
      ctx.fill();
      ctx.strokeStyle = hexToRgba(accent, 0.35);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.fillText(label, tagX + 16, tagY + 26);
      tagX += tw + 12;
    });

    // 5. 电影感金句框
    drawRoundedRect(ctx, 72, qBoxY, contentW, qBoxH, 18);
    ctx.fillStyle = '#FAF1F2';
    ctx.fill();
    ctx.strokeStyle = '#E6CFC2';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = '#2A1F23';
    ctx.font = `bold 25px ${serif}`;
    quoteLines.forEach((line, idx) => {
      ctx.fillText(line, 98, qBoxY + 42 + idx * 39);
    });

    // 6. 六维魅力雷达区
    let curY = qBoxY + qBoxH + 26;
    drawRoundedRect(ctx, 72, curY, contentW, radarBoxH, 18);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#EFE6E8';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    const rCx = 215;
    const rCy = curY + radarBoxH / 2 + 4;
    const rMax = 86;
    [0.35, 0.7, 1.0].forEach((lv) => {
      ctx.beginPath();
      result.dimDetails.forEach((_, i) => {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
        const px = rCx + rMax * lv * Math.cos(ang);
        const py = rCy + rMax * lv * Math.sin(ang);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.strokeStyle = '#E8DCE0';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    ctx.beginPath();
    result.dimDetails.forEach((d, i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
      const px = rCx + rMax * (d.score / 100) * Math.cos(ang);
      const py = rCy + rMax * (d.score / 100) * Math.sin(ang);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fillStyle = hexToRgba(accent, 0.2);
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2.4;
    ctx.stroke();

    ctx.fillStyle = '#5B4A51';
    ctx.font = `bold 20px ${sans}`;
    ctx.textAlign = 'center';
    result.dimDetails.forEach((d, i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
      const lx = rCx + (rMax + 24) * Math.cos(ang);
      const ly = rCy + (rMax + 24) * Math.sin(ang) + 7;
      ctx.fillText(d.name, lx, ly);
    });
    ctx.textAlign = 'left';

    const barStartX = 375;
    const barStartY = curY + 36;
    result.dimDetails.forEach((d, idx) => {
      const by = barStartY + idx * 34;
      ctx.fillStyle = '#5B4A51';
      ctx.font = `bold 20px ${sans}`;
      ctx.fillText(d.name, barStartX, by);

      drawRoundedRect(ctx, barStartX + 58, by - 14, 300, 11, 5.5);
      ctx.fillStyle = '#EFE6E8';
      ctx.fill();

      drawRoundedRect(ctx, barStartX + 58, by - 14, Math.max(12, Math.round(3 * d.score)), 11, 5.5);
      ctx.fillStyle = accent;
      ctx.fill();

      ctx.fillStyle = '#8D7A82';
      ctx.font = `20px ${serif}`;
      ctx.fillText(String(d.score), barStartX + 372, by);
    });

    ctx.fillStyle = '#8D7A82';
    ctx.font = `19px ${sans}`;
    ctx.fillText(
      `隐藏备选桃花：${result.runnerUp.character.name}（${result.runnerUp.matchPct}%）`,
      barStartX,
      curY + radarBoxH - 18
    );

    // 7. 吸引力深度解析模块
    curY += radarBoxH + 26;
    curY = drawPreparedSection(ctx, '✦ 你自身散发的致命吸引力', traitsLines, 72, curY, accent, serif, sans);
    curY += 18;
    curY = drawPreparedSection(ctx, '✦ 为什么这类人最容易对你上头', reasonLines, 72, curY, accent, serif, sans);
    curY += 18;
    curY = drawPreparedSection(ctx, '✦ 心动擦火花指南', easterLines, 72, curY, accent, serif, sans);

    // 8. 底部杂志风扫码区
    drawRoundedRect(ctx, 72, footerTopY, contentW, footerBoxH, 18);
    ctx.fillStyle = '#FAF3F0';
    ctx.fill();
    ctx.strokeStyle = '#DFC7A7';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = '#2A1F23';
    ctx.font = `bold 25px ${serif}`;
    ctx.fillText('扫码测测你最容易吸引什么样的恋人', 98, footerTopY + 46);

    ctx.fillStyle = '#635259';
    ctx.font = `20px ${sans}`;
    ctx.fillText('15道大白话恋爱细节题 · 测出你的六维心动磁场与命定桃花', 98, footerTopY + 84);

    drawRoundedRect(ctx, 98, footerTopY + 102, 276, 32, 16);
    ctx.fillStyle = hexToRgba(accent, 0.1);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.font = `bold 18px ${sans}`;
    ctx.fillText('✦ 长按识别右侧二维码立即开测', 114, footerTopY + 124);

    const qrSize = 122;
    const qrX = W - 72 - qrSize - 16;
    const qrY = footerTopY + Math.round((footerBoxH - qrSize) / 2);
    drawRoundedRect(ctx, qrX - 4, qrY - 4, qrSize + 8, qrSize + 8, 10);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#DFC7A7';
    ctx.lineWidth = 1;
    ctx.stroke();

    const qrApi = typeof MiniQR !== 'undefined' ? MiniQR : (typeof window !== 'undefined' && window.MiniQR);
    if (qrApi) {
      qrApi.drawQROnCanvas(ctx, shareUrl, qrX, qrY, qrSize, '#2A1F23', '#FFFFFF');
    }

    return canvas.toDataURL('image/png');
  }

  function drawPreparedSection(ctx, title, lines, x, y, accent, serif, sans) {
    ctx.fillStyle = accent;
    ctx.font = `bold 23px ${serif}`;
    ctx.fillText(title, x, y + 24);

    ctx.fillStyle = '#4B3C42';
    ctx.font = `21px ${sans}`;
    lines.forEach((line, idx) => {
      ctx.fillText(line, x, y + 58 + idx * 33);
    });
    return y + 42 + lines.length * 33;
  }

  const NO_LINE_START = new Set([
    '，', '。', '、', '；', '：', '！', '？', '）', '》', '”', '’', '】', '〉', '%', ',', '.', ':', ';', '!', '?'
  ]);

  function wrapCanvasText(ctx, text, maxWidth, fontStr) {
    ctx.font = fontStr;
    const chars = Array.from(text);
    const lines = [];
    let current = '';

    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      const test = current + ch;
      if (ctx.measureText(test).width > maxWidth && current.length > 0) {
        if (NO_LINE_START.has(ch)) {
          const currentArr = Array.from(current);
          const carry = currentArr.pop() || '';
          lines.push(currentArr.join(''));
          current = carry + ch;
        } else {
          lines.push(current);
          current = ch;
        }
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  function hexToRgba(hex, alpha) {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 168;
    const g = parseInt(clean.substring(2, 4), 16) || 76;
    const b = parseInt(clean.substring(4, 6), 16) || 96;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // =========================================================================
  // 7. 导出海报、复制文案与事件绑定
  // =========================================================================
  function handleSavePoster() {
    if (!state.lastResult) return;
    const dataUrl = generateSharePoster(state.lastResult);
    const charName = state.lastResult.best.character.name;

    try {
      const link = document.createElement('a');
      link.download = `易吸引恋人测试_${charName.replace(/\//g, '_')}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (_) {
      // ignore
    }

    els.posterModalImg.src = dataUrl;
    els.posterModal.classList.add('open');
    showToast('已生成高清心动档案海报，可保存或长按分享');
  }

  function handleCopyShareText() {
    if (!state.lastResult) return;
    const char = state.lastResult.best.character;
    const pct = state.lastResult.best.matchPct;
    const runner = state.lastResult.runnerUp.character.name;

    const shareText = [
      `💘 我在《测测你最容易吸引什么样的恋人》测出的命定桃花是：【${char.name}】（磁场契合度 ${pct}%）`,
      `✨ 心动标签：${char.tags.join(' · ')}`,
      `💬 专属判词：${char.quote}`,
      `🎬 擦出火花场景：${char.easterEgg.scene}`,
      `🌙 隐藏备选桃花：${runner}`,
      `🔗 测测你的心动引力：${getActiveShareUrl()}`
    ].join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(shareText)
        .then(() => showToast('专属心动文案已复制，快去小红书/朋友圈分享吧'))
        .catch(() => fallbackCopy(shareText));
    } else {
      fallbackCopy(shareText);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('专属心动文案已复制，快去分享吧');
    } catch (_) {
      showToast('复制失败，请直接保存海报或截图分享');
    }
    document.body.removeChild(ta);
  }

  let toastTimer = null;
  function showToast(msg) {
    els.toastMsg.textContent = msg;
    els.toastMsg.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toastMsg.classList.remove('show');
    }, 2400);
  }

  function bindEvents() {
    els.btnStart.addEventListener('click', startNewQuiz);
    els.btnResume.addEventListener('click', resumeSavedQuiz);

    els.optionsList.addEventListener('click', (e) => {
      const btn = e.target.closest('.option-btn');
      if (!btn) return;
      const idx = Number(btn.getAttribute('data-idx'));
      if (!Number.isNaN(idx)) {
        handleSelectOption(idx);
      }
    });

    els.btnPrev.addEventListener('click', goPrevQuestion);
    els.btnNext.addEventListener('click', goNextQuestion);

    els.btnSavePoster.addEventListener('click', handleSavePoster);
    els.btnCopyText.addEventListener('click', handleCopyShareText);

    if (els.btnUpdateQr && els.qrUrlInput) {
      const applyCustomUrl = () => {
        const val = els.qrUrlInput.value.trim();
        state.customShareUrl = val;
        try {
          if (val) localStorage.setItem(SHARE_URL_KEY, val);
          else localStorage.removeItem(SHARE_URL_KEY);
        } catch (_) {
          // ignore
        }
        refreshQRCodeUI();
        showToast('二维码链接已更新，点击上方按钮可重新导出海报');
      };
      els.btnUpdateQr.addEventListener('click', applyCustomUrl);
      els.qrUrlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyCustomUrl();
        }
      });
    }

    els.btnCleanShot.addEventListener('click', () => {
      document.body.classList.add('clean-shot-mode');
    });

    document.addEventListener('click', (e) => {
      if (
        document.body.classList.contains('clean-shot-mode') &&
        !e.target.closest('#btn-clean-shot')
      ) {
        document.body.classList.remove('clean-shot-mode');
      }
    });

    els.btnRestart.addEventListener('click', () => {
      document.body.classList.remove('clean-shot-mode');
      startNewQuiz();
    });

    els.posterModalClose.addEventListener('click', () => {
      els.posterModal.classList.remove('open');
    });

    els.posterModal.addEventListener('click', (e) => {
      if (e.target === els.posterModal) {
        els.posterModal.classList.remove('open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (els.posterModal.classList.contains('open')) {
        if (e.key === 'Escape') els.posterModal.classList.remove('open');
        return;
      }
      if (!els.viewQuiz.classList.contains('active')) return;

      const keyUpper = e.key.toUpperCase();
      const keyMap = { A: 0, B: 1, C: 2, D: 3, '1': 0, '2': 1, '3': 2, '4': 3 };
      if (Object.prototype.hasOwnProperty.call(keyMap, keyUpper)) {
        e.preventDefault();
        handleSelectOption(keyMap[keyUpper]);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrevQuestion();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNextQuestion();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
