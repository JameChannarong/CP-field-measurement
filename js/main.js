/* ============================================================
   CP FIELD MEASUREMENT TRAINING — Main JS
   Section 1: Reference Electrodes
   ============================================================ */

'use strict';

/* ── Tab Navigation ── */
(function initNav() {
  const tabs    = document.querySelectorAll('.tab');
  const sections = document.querySelectorAll('.section');
  const progLabel = document.getElementById('progress-label');

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      sections.forEach(s => s.classList.remove('active-section'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected','true');

      const target = document.getElementById(tab.dataset.target);
      if (target) {
        target.classList.add('active-section');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (progLabel) progLabel.textContent = `Section ${i + 1} / 7`;
    });
  });
})();


/* ══════════════════════════════════════════════════════════
   SECTION 1 — REFERENCE ELECTRODES
   ══════════════════════════════════════════════════════════ */

/* ── Electrode Data ── */
const ELECTRODES = {
  cse: {
    name:        'Copper/Copper Sulfate',
    abbr:        'CSE',
    symbol:      'Cu/CuSO₄',
    potential:   0.000,
    useCase:     'FIELD',
    color:       '#FF9500',
    icon:        '🔶',
    environments: ['Onshore pipelines', 'Fresh water', 'Low-chloride soil'],
    note:        'The standard reference for onshore cathodic protection. All CP potentials are typically reported vs. CSE unless stated otherwise. Criterion for steel protection: −850 mV vs. CSE.',
    scaleX:      668   /* SVG x-position on potential scale */
  },
  agagcl: {
    name:        'Silver/Silver Chloride',
    abbr:        'Ag/AgCl',
    symbol:      'Ag/AgCl',
    potential:   -0.050,
    useCase:     'FIELD',
    color:       '#A8A9AD',
    icon:        '⚪',
    environments: ['Offshore structures', 'Seawater', 'Marine environments'],
    note:        'Preferred for offshore and marine use due to excellent stability in seawater. Potential is −50 mV vs. CSE, so you must add 50 mV when comparing readings to onshore criteria.',
    scaleX:      641
  },
  calomel: {
    name:        'Saturated Calomel Electrode',
    abbr:        'SCE',
    symbol:      'Calomel',
    potential:   -0.070,
    useCase:     'LAB',
    color:       '#FF3B30',
    icon:        '🔴',
    environments: ['Laboratory only'],
    note:        'Contains mercury — not suitable for field use due to environmental regulations. Used in laboratory testing and research. Potential is −70 mV vs. CSE.',
    scaleX:      631
  },
  she: {
    name:        'Standard Hydrogen Electrode',
    abbr:        'SHE',
    symbol:      'H₂/H⁺',
    potential:   -0.320,
    useCase:     'LAB',
    color:       '#007AFF',
    icon:        '🔵',
    environments: ['Laboratory only'],
    note:        'The international electrochemical standard (defined as 0.000 V on the absolute scale). Impractical for field use — requires pure hydrogen gas and platinum electrode. Potential is −320 mV vs. CSE.',
    scaleX:      500
  },
  zinc: {
    name:        'Pure Zinc Electrode',
    abbr:        'Zn',
    symbol:      'Zn',
    potential:   -1.100,
    useCase:     'FIELD',
    color:       '#34C759',
    icon:        '🟢',
    environments: ['Seawater', 'Marine structures', 'Buried anodes'],
    note:        'Used as both a reference electrode and a sacrificial anode material. Its stable potential of approximately −1.100 V vs. CSE in seawater makes it useful as an in-situ reference for offshore structures.',
    scaleX:      92
  }
};

/* ── Electrode Selector ── */
(function initElectrodeSelector() {
  const cards  = document.querySelectorAll('.elec-card');
  const detail = document.getElementById('electrodeDetail');
  const ring   = document.getElementById('selectedRing');

  if (!cards.length || !detail) return;

  function selectElectrode(id) {
    const data = ELECTRODES[id];
    if (!data) return;

    /* Update card states */
    cards.forEach(c => {
      const isThis = c.dataset.id === id;
      c.classList.toggle('selected', isThis);
      c.setAttribute('aria-pressed', isThis ? 'true' : 'false');
    });

    /* Move ring on scale */
    if (ring) {
      ring.setAttribute('cx', data.scaleX);
      ring.setAttribute('stroke', data.color);
    }

    /* Dim/highlight scale markers */
    Object.keys(ELECTRODES).forEach(key => {
      const mk = document.getElementById(`mk-${key}`);
      if (!mk) return;
      if (key === id) {
        mk.classList.remove('dimmed');
        mk.querySelector('circle').setAttribute('r', '11');
        mk.querySelector('circle').setAttribute('opacity', '1');
      } else {
        mk.classList.add('dimmed');
        mk.querySelector('circle').setAttribute('r', '9');
        mk.querySelector('circle').setAttribute('opacity', '.6');
      }
    });

    /* Render detail panel */
    const useColor = data.useCase === 'FIELD' ? '#34C759' : '#FF3B30';
    const envHtml  = data.environments.map(e =>
      `<span class="detail-tag"><span class="dot" style="background:${data.color}"></span>${e}</span>`
    ).join('');

    detail.innerHTML = `
      <div class="detail-grid">
        <span class="detail-icon">${data.icon}</span>
        <div>
          <div class="detail-name">${data.symbol}</div>
          <div class="detail-abbr">${data.name}</div>
        </div>
        <div></div>
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
            <span style="font-size:22px;font-weight:800;font-variant-numeric:tabular-nums;color:${data.color}">${data.potential.toFixed(3)} V</span>
            <span style="font-size:11px;color:#8E8E93">vs. CSE</span>
            <span class="detail-tag" style="border-color:${useColor};color:${useColor};background:transparent">
              <span class="dot" style="background:${useColor}"></span>${data.useCase}
            </span>
          </div>
        </div>
      </div>
      <div class="detail-row">${envHtml}</div>
      <p class="detail-note">${data.note}</p>
    `;
  }

  /* Click events */
  cards.forEach(card => {
    card.addEventListener('click',   () => selectElectrode(card.dataset.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') selectElectrode(card.dataset.id); });
  });

  /* Initialise with CSE */
  selectElectrode('cse');
})();


/* ── Electrode Positioning Demo ── */
(function initPositioningDemo() {
  const slider    = document.getElementById('distSlider');
  const caption   = document.getElementById('sliderCaption');
  const svg       = document.getElementById('posSvg');
  const elecGroup = document.getElementById('refElecGroup');
  const elecLine  = document.getElementById('elecPipeLine');
  const irLines   = document.getElementById('irLines');
  const accIcon   = document.getElementById('accIcon');
  const accText   = document.getElementById('accText');
  const accText2  = document.getElementById('accText2');
  const accBadge  = document.getElementById('accBadge');
  const structTabs = document.querySelectorAll('.struct-tab');

  if (!slider || !elecGroup) return;

  /* Structure presets */
  const structures = {
    buried: {
      skyH: 120, soilH: 160, surfaceY: 120,
      structCX: 280, structCY: 205, structR: 40, structRi: 28,
      label: 'PIPE',
      closestY: 120,  /* electrode at surface directly above */
      farthestY: 20   /* electrode far from surface - above ground (satellite style) */
    },
    marine: {
      skyH: 80, soilH: 200, surfaceY: 80,
      structCX: 280, structCY: 200, structR: 55, structRi: 42,
      label: 'STRUCTURE',
      closestY: 100,
      farthestY: 20
    },
    tank: {
      skyH: 120, soilH: 160, surfaceY: 120,
      structCX: 280, structCY: 195, structR: 80, structRi: 68,
      label: 'TANK',
      closestY: 120,
      farthestY: 20
    }
  };

  let currentStruct = 'buried';

  function getPreset() { return structures[currentStruct]; }

  function updateSlider(pct) {
    const p = getPreset();

    /* Electrode Y position: 0% = surface above structure, 100% = far away */
    const elecY = p.closestY - 12 - (pct / 100) * (p.closestY - p.farthestY - 20);
    elecGroup.setAttribute('transform', `translate(${p.structCX}, ${elecY})`);

    /* Update dashed connecting line */
    elecLine.setAttribute('x1', p.structCX);
    elecLine.setAttribute('y1', elecY + 22);
    elecLine.setAttribute('x2', p.structCX);
    elecLine.setAttribute('y2', p.structCY - p.structR);

    /* Lateral offset for "wandering electrode" effect */
    const lateralOffset = pct * 1.6;
    elecGroup.setAttribute('transform', `translate(${p.structCX + lateralOffset * 0.5}, ${elecY})`);
    elecLine.setAttribute('x1', p.structCX + lateralOffset * 0.5);

    /* Update IR lines visibility */
    const irOpacity = Math.min(pct / 50, 1);
    irLines.setAttribute('opacity', irOpacity);

    /* Accuracy state */
    let state, icon, text, text2, color, bgColor;
    if (pct <= 15) {
      state = 'excellent'; icon = '✅'; text = 'Excellent'; text2 = 'Minimal IR error';
      color = '#34C759'; bgColor = 'rgba(52,199,89,.15)';
      caption.className = 'slider-caption';
      caption.textContent = 'Electrode placed directly above structure — most accurate reading.';
    } else if (pct <= 45) {
      state = 'good'; icon = '⚠️'; text = 'Acceptable'; text2 = 'Small IR error present';
      color = '#FF9500'; bgColor = 'rgba(255,149,0,.15)';
      caption.className = 'slider-caption warn';
      caption.textContent = 'Moving away from the structure — IR drop error is increasing.';
    } else if (pct <= 70) {
      state = 'poor'; icon = '⚠️'; text = 'Poor'; text2 = 'Significant IR error';
      color = '#FF9500'; bgColor = 'rgba(255,149,0,.12)';
      caption.className = 'slider-caption warn';
      caption.textContent = 'Electrode is too far — significant IR drop will skew the reading.';
    } else {
      state = 'bad'; icon = '❌'; text = 'Inaccurate'; text2 = 'IR error is unacceptable';
      color = '#FF3B30'; bgColor = 'rgba(255,59,48,.12)';
      caption.className = 'slider-caption error';
      caption.textContent = 'Electrode far from structure — reading is unreliable due to IR drop.';
    }

    accIcon.textContent  = icon;
    accText.textContent  = text;
    accText2.textContent = text2;
    accText.setAttribute('fill',  color);
    accText2.setAttribute('fill', color);
    accBadge.querySelector('rect').setAttribute('fill',   bgColor);
    accBadge.querySelector('rect').setAttribute('stroke', color.replace(')', ',.4)').replace('rgb', 'rgba'));

    /* Update slider fill CSS variable */
    slider.style.setProperty('--fill', pct + '%');
  }

  slider.addEventListener('input', () => updateSlider(parseInt(slider.value)));

  /* Structure tab switching */
  structTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      structTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentStruct = tab.dataset.struct;
      updateSliderStructure();
    });
  });

  function updateSliderStructure() {
    const p = getPreset();
    const pipeOuter = document.getElementById('pipeOuter');
    const pipeInner = document.getElementById('pipeInner');
    const pipeLabel = document.getElementById('pipeLabel');
    const posSky    = document.getElementById('posSky');
    const posSoil   = document.getElementById('posSoil');

    if (pipeOuter) {
      pipeOuter.setAttribute('cx', p.structCX);
      pipeOuter.setAttribute('cy', p.structCY);
      pipeOuter.setAttribute('r',  p.structR);
    }
    if (pipeInner) {
      pipeInner.setAttribute('cx', p.structCX);
      pipeInner.setAttribute('cy', p.structCY);
      pipeInner.setAttribute('r',  p.structRi);
    }
    if (pipeLabel) {
      pipeLabel.setAttribute('x', p.structCX);
      pipeLabel.setAttribute('y', p.structCY + 5);
      pipeLabel.textContent = p.label;
    }
    if (posSky)  { posSky.setAttribute('height',  p.skyH);  posSky.setAttribute('y', 0); }
    if (posSoil) { posSoil.setAttribute('y', p.skyH); posSoil.setAttribute('height', p.soilH); }

    /* Marine = water not soil */
    if (posSoil) {
      if (currentStruct === 'marine') {
        posSoil.setAttribute('fill', 'rgba(0,119,190,.18)');
      } else {
        posSoil.setAttribute('fill', 'rgba(161,122,82,.15)');
      }
    }

    slider.value = 0;
    updateSlider(0);
  }

  /* Init */
  updateSlider(0);
})();


/* ── Quiz ── */
(function initQuiz() {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  const questions = [
    {
      q: 'Which reference electrode is the standard for onshore cathodic protection measurements?',
      opts: [
        'Silver/Silver Chloride (Ag/AgCl)',
        'Copper/Copper Sulfate (CSE)',
        'Standard Hydrogen Electrode (SHE)',
        'Pure Zinc (Zn)'
      ],
      correct: 1,
      explain: '✅ Correct! CSE (Cu/CuSO₄) is the standard onshore CP reference. All potentials are typically reported vs. CSE. The protection criterion for steel is −850 mV vs. CSE.'
    },
    {
      q: 'Where should the reference electrode be placed when measuring a buried pipeline?',
      opts: [
        'At the nearest test station junction box only',
        'At any convenient flat location on the soil surface',
        'Directly above the pipe or structure on the soil surface',
        'At least 1 m away to avoid stray current interference'
      ],
      correct: 2,
      explain: '✅ Correct! Place the electrode directly above the buried pipe. This minimises the IR drop (voltage error from soil resistance) included in the measurement, giving the most accurate pipe-to-soil potential.'
    },
    {
      q: 'Which reference electrode is preferred for offshore and marine environments?',
      opts: [
        'Copper/Copper Sulfate (CSE)',
        'Saturated Calomel (SCE)',
        'Standard Hydrogen Electrode (SHE)',
        'Silver/Silver Chloride (Ag/AgCl)'
      ],
      correct: 3,
      explain: '✅ Correct! Ag/AgCl (Silver/Silver Chloride) is the preferred offshore reference electrode because it is stable and reproducible in seawater. CSE is not suitable in marine environments as it degrades in chloride-rich water.'
    }
  ];

  let scores = new Array(questions.length).fill(null); // null=unanswered, true/false

  function render() {
    container.innerHTML = '';

    questions.forEach((q, qi) => {
      const block = document.createElement('div');
      block.className = 'quiz-q';

      const qText = document.createElement('div');
      qText.className = 'quiz-q-text';
      qText.innerHTML = `<span class="quiz-num">${qi + 1}</span>${q.q}`;
      block.appendChild(qText);

      const opts = document.createElement('div');
      opts.className = 'quiz-options';

      q.opts.forEach((opt, oi) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt';
        btn.textContent = opt;

        const isAnswered = scores[qi] !== null;

        if (isAnswered) {
          btn.classList.add('disabled');
          if (oi === q.correct) btn.classList.add('correct');
          else if (scores[qi] === false && oi === q.opts.findIndex(
            (_, idx) => idx !== q.correct)) {
            /* highlight only the answer user clicked wrong — handled via data */
          }
        }

        btn.addEventListener('click', () => {
          if (scores[qi] !== null) return; /* already answered */

          const isRight = (oi === q.correct);
          scores[qi] = isRight;

          /* Style all options */
          opts.querySelectorAll('.quiz-opt').forEach((b, bi) => {
            b.classList.add('disabled');
            if (bi === q.correct) b.classList.add('correct');
            else if (bi === oi && !isRight) b.classList.add('incorrect');
          });

          /* Show feedback */
          const fb = block.querySelector('.quiz-feedback');
          fb.textContent = isRight
            ? q.explain
            : `❌ Not quite. ${q.explain}`;
          fb.className = `quiz-feedback show ${isRight ? 'ok' : 'bad'}`;

          /* Check completion */
          if (scores.every(s => s !== null)) showScore();
        });

        opts.appendChild(btn);
      });

      block.appendChild(opts);

      const fb = document.createElement('div');
      fb.className = 'quiz-feedback';
      block.appendChild(fb);

      container.appendChild(block);
    });
  }

  function showScore() {
    const correct = scores.filter(Boolean).length;
    const total   = questions.length;
    const pct     = Math.round((correct / total) * 100);

    let emoji, msg;
    if (pct === 100) { emoji = '🎉'; msg = 'Perfect score! You have mastered reference electrodes.'; }
    else if (pct >= 67) { emoji = '👍'; msg = 'Good job! Review the explanations above to fill any gaps.'; }
    else { emoji = '📚'; msg = 'Keep studying! Re-read the electrode details and try again.'; }

    const scoreEl = document.createElement('div');
    scoreEl.className = 'quiz-score';
    scoreEl.innerHTML = `
      <div class="score-num">${emoji} ${correct}/${total}</div>
      <div class="score-lbl">${pct}% correct</div>
      <div class="score-msg">${msg}</div>
      <button class="quiz-retry" id="retryBtn">Try Again</button>
    `;
    container.appendChild(scoreEl);

    document.getElementById('retryBtn').addEventListener('click', () => {
      scores = new Array(questions.length).fill(null);
      render();
    });
  }

  render();
})();


/* ══════════════════════════════════════════════════════════
   SHARED QUIZ BUILDER  (used by S2 and later sections)
   ══════════════════════════════════════════════════════════ */
function buildQuiz(containerId, questions, sectionLabel) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let scores = new Array(questions.length).fill(null);

  function render() {
    container.innerHTML = '';
    questions.forEach((q, qi) => {
      const block = document.createElement('div');
      block.className = 'quiz-q';

      const qText = document.createElement('div');
      qText.className = 'quiz-q-text';
      qText.innerHTML = `<span class="quiz-num">${qi + 1}</span>${q.q}`;
      block.appendChild(qText);

      const opts = document.createElement('div');
      opts.className = 'quiz-options';

      q.opts.forEach((opt, oi) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt';
        btn.textContent = opt;

        if (scores[qi] !== null) {
          btn.classList.add('disabled');
          if (oi === q.correct) btn.classList.add('correct');
        }

        btn.addEventListener('click', () => {
          if (scores[qi] !== null) return;
          const isRight = (oi === q.correct);
          scores[qi] = isRight;
          opts.querySelectorAll('.quiz-opt').forEach((b, bi) => {
            b.classList.add('disabled');
            if (bi === q.correct) b.classList.add('correct');
            else if (bi === oi && !isRight) b.classList.add('incorrect');
          });
          const fb = block.querySelector('.quiz-feedback');
          fb.textContent = isRight ? q.explain : `❌ Not quite. ${q.explain}`;
          fb.className = `quiz-feedback show ${isRight ? 'ok' : 'bad'}`;
          if (scores.every(s => s !== null)) showScore();
        });

        opts.appendChild(btn);
      });

      block.appendChild(opts);
      const fb = document.createElement('div');
      fb.className = 'quiz-feedback';
      block.appendChild(fb);
      container.appendChild(block);
    });
  }

  function showScore() {
    const correct = scores.filter(Boolean).length;
    const total   = questions.length;
    const pct     = Math.round((correct / total) * 100);
    let emoji, msg;
    if (pct === 100)     { emoji = '🎉'; msg = `Perfect score! You have mastered ${sectionLabel}.`; }
    else if (pct >= 67)  { emoji = '👍'; msg = 'Good job! Review the explanations above to fill any gaps.'; }
    else                 { emoji = '📚'; msg = 'Keep studying! Re-read the content and try again.'; }

    const scoreEl = document.createElement('div');
    scoreEl.className = 'quiz-score';
    const retryId = `retry-${containerId}`;
    scoreEl.innerHTML = `
      <div class="score-num">${emoji} ${correct}/${total}</div>
      <div class="score-lbl">${pct}% correct</div>
      <div class="score-msg">${msg}</div>
      <button class="quiz-retry" id="${retryId}">Try Again</button>`;
    container.appendChild(scoreEl);
    document.getElementById(retryId).addEventListener('click', () => {
      scores = new Array(questions.length).fill(null);
      render();
    });
  }

  render();
}


/* ══════════════════════════════════════════════════════════
   SECTION 2 — SURVEY METHODS
   ══════════════════════════════════════════════════════════ */

/* ── CIPS Potential Profile ── */
const CIPS_PROFILE = [
  { pos: 0.00, on: -1050, off: -920 },
  { pos: 0.15, on: -980,  off: -895 },
  { pos: 0.28, on: -940,  off: -872 },
  { pos: 0.33, on: -918,  off: -848 },
  { pos: 0.37, on: -895,  off: -818 },  /* holiday 1 peak */
  { pos: 0.42, on: -912,  off: -830 },
  { pos: 0.50, on: -950,  off: -872 },
  { pos: 0.57, on: -972,  off: -893 },
  { pos: 0.61, on: -982,  off: -900 },
  { pos: 0.65, on: -942,  off: -858 },
  { pos: 0.67, on: -908,  off: -828 },  /* holiday 2 peak */
  { pos: 0.72, on: -912,  off: -832 },
  { pos: 0.80, on: -948,  off: -868 },
  { pos: 0.88, on: -962,  off: -888 },
  { pos: 1.00, on: -924,  off: -858 }
];

function getProfileAt(pos) {
  const profile = CIPS_PROFILE;
  for (let i = 0; i < profile.length - 1; i++) {
    const a = profile[i], b = profile[i + 1];
    if (pos >= a.pos && pos <= b.pos) {
      const t = (pos - a.pos) / (b.pos - a.pos);
      return {
        on:  Math.round(a.on  + t * (b.on  - a.on)),
        off: Math.round(a.off + t * (b.off - a.off))
      };
    }
  }
  return { on: profile[profile.length - 1].on, off: profile[profile.length - 1].off };
}

/* ── CIPS Animation ── */
(function initCips() {
  const playBtn  = document.getElementById('cipsPlay');
  const resetBtn = document.getElementById('cipsReset');
  const canvas   = document.getElementById('cipsChart');
  const surveyor = document.getElementById('surveyor');
  const scanned  = document.getElementById('cipsScanned');
  const cHol1    = document.getElementById('cHol1');
  const cHol2    = document.getElementById('cHol2');
  const badge    = document.getElementById('cipsReadBadge');
  const onVal    = document.getElementById('cipsOnVal');
  const offVal   = document.getElementById('cipsOffVal');

  if (!canvas || !surveyor || !playBtn) return;

  const ctx = canvas.getContext('2d');
  let rafId, startTime, animating = false, completed = false;
  let data = { x: [], on: [], off: [] };
  let lastStep = 0;

  const DURATION = 9000;   /* 9-second survey walk */
  const STEPS    = 260;

  /* Chart geometry */
  const CL = 52, CR = 6, CT = 14, CB = 24;
  const CW = canvas.width - CL - CR;
  const CH = canvas.height - CT - CB;
  const MV_TOP = -750, MV_BOT = -1200;

  function mvToY(mv) { return CT + ((MV_TOP - mv) / (MV_TOP - MV_BOT)) * CH; }
  function posToX(pos) { return CL + pos * CW; }

  function drawChart() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    /* Chart background */
    ctx.fillStyle = 'rgba(255,255,255,0.42)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(0, 0, W, H, 8);
    else ctx.rect(0, 0, W, H);
    ctx.fill();

    /* Unprotected zone (above −850) */
    const y850 = mvToY(-850);
    ctx.fillStyle = 'rgba(255,59,48,0.04)';
    ctx.fillRect(CL, CT, CW, y850 - CT);

    /* Grid lines */
    [-800, -850, -900, -1000, -1100].forEach(mv => {
      const y = mvToY(mv);
      ctx.beginPath();
      ctx.lineWidth = mv === -850 ? 1.5 : 1;
      ctx.strokeStyle = mv === -850 ? 'rgba(255,59,48,.4)' : 'rgba(0,0,0,.08)';
      ctx.setLineDash(mv === -850 ? [6, 4] : []);
      ctx.moveTo(CL, y); ctx.lineTo(W - CR, y);
      ctx.stroke();
      ctx.setLineDash([]);

      /* Y labels */
      ctx.font = '9px system-ui';
      ctx.textAlign = 'right';
      ctx.fillStyle = mv === -850 ? 'rgba(255,59,48,.7)' : 'rgba(0,0,0,.38)';
      ctx.fillText(`${mv}`, CL - 4, y + 3.5);
    });

    /* Criterion label */
    ctx.fillStyle = 'rgba(255,59,48,.65)';
    ctx.font = 'bold 8.5px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText('−850 mV', CL + 4, y850 - 3);

    /* Axis labels */
    ctx.fillStyle = 'rgba(0,0,0,.28)';
    ctx.font = '9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Pipeline distance →', W / 2, H - 5);

    ctx.save();
    ctx.translate(11, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('mV vs. CSE', 0, 0);
    ctx.restore();

    if (data.x.length < 2) return;

    /* Highlight unprotected OFF zones */
    data.x.forEach((pos, i) => {
      if (data.off[i] > -850) {
        ctx.fillStyle = 'rgba(255,59,48,.18)';
        ctx.fillRect(posToX(pos) - 1, CT, 3, CH);
      }
    });

    /* OFF potential — green */
    ctx.beginPath();
    ctx.strokeStyle = '#34C759';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    data.x.forEach((pos, i) => {
      const x = posToX(pos), y = mvToY(data.off[i]);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    /* ON potential — blue */
    ctx.beginPath();
    ctx.strokeStyle = '#007AFF';
    ctx.lineWidth = 2.2;
    ctx.lineJoin = 'round';
    data.x.forEach((pos, i) => {
      const x = posToX(pos), y = mvToY(data.on[i]);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  function updateSurveyor(progress) {
    const x = 20 + progress * 660;
    surveyor.setAttribute('transform', `translate(${x},58)`);
    scanned.setAttribute('width', Math.max(0, x - 20));
  }

  function revealHolidays(progress) {
    /* Holiday 1 at pos≈0.37 */
    if (progress >= 0.32) {
      const a = Math.min((progress - 0.32) / 0.05, 1);
      cHol1.setAttribute('fill',   `rgba(255,59,48,${a * 0.28})`);
      cHol1.setAttribute('stroke', `rgba(255,59,48,${a * 0.85})`);
    }
    /* Holiday 2 at pos≈0.67 */
    if (progress >= 0.62) {
      const a = Math.min((progress - 0.62) / 0.05, 1);
      cHol2.setAttribute('fill',   `rgba(255,59,48,${a * 0.22})`);
      cHol2.setAttribute('stroke', `rgba(255,59,48,${a * 0.75})`);
    }
  }

  function animFrame(ts) {
    if (!startTime) startTime = ts;
    const elapsed  = ts - startTime;
    const progress = Math.min(elapsed / DURATION, 1);
    const stepNow  = Math.min(Math.floor(progress * STEPS), STEPS);

    for (let s = lastStep; s <= stepNow; s++) {
      const pos = s / STEPS;
      const pt  = getProfileAt(pos);
      data.x.push(pos);
      data.on.push(pt.on);
      data.off.push(pt.off);
    }
    lastStep = stepNow + 1;

    drawChart();
    updateSurveyor(progress);
    revealHolidays(progress);

    /* Live reading badge */
    if (progress > 0.01 && badge) {
      badge.setAttribute('opacity', '1');
      const pt = getProfileAt(progress);
      if (onVal)  onVal.textContent  = `${pt.on} mV`;
      if (offVal) {
        offVal.textContent = `${pt.off} mV`;
        offVal.setAttribute('fill', pt.off > -850 ? '#FF3B30' : '#34C759');
      }
    }

    if (progress < 1 && animating) {
      rafId = requestAnimationFrame(animFrame);
    } else {
      animating = false;
      completed = true;
      if (playBtn) playBtn.textContent = '▶ Replay';
    }
  }

  function doReset() {
    animating = false;
    completed = false;
    cancelAnimationFrame(rafId);
    startTime = null;
    lastStep = 0;
    data = { x: [], on: [], off: [] };
    drawChart();
    if (surveyor) surveyor.setAttribute('transform', 'translate(20,58)');
    if (scanned)  scanned.setAttribute('width', '0');
    if (cHol1) { cHol1.setAttribute('fill', 'rgba(255,59,48,0)'); cHol1.setAttribute('stroke', 'rgba(255,59,48,0)'); }
    if (cHol2) { cHol2.setAttribute('fill', 'rgba(255,59,48,0)'); cHol2.setAttribute('stroke', 'rgba(255,59,48,0)'); }
    if (badge) badge.setAttribute('opacity', '0');
    if (playBtn) playBtn.textContent = '▶ Play';
  }

  playBtn.addEventListener('click', () => {
    if (animating) {
      /* Pause */
      animating = false;
      cancelAnimationFrame(rafId);
      playBtn.textContent = '▶ Resume';
    } else if (completed) {
      /* Replay from start */
      doReset();
      setTimeout(() => {
        animating = true;
        playBtn.textContent = '⏸ Pause';
        rafId = requestAnimationFrame(animFrame);
      }, 60);
    } else {
      /* Start or resume */
      animating = true;
      /* Adjust start time so progress continues from where we left off */
      if (startTime !== null) startTime = performance.now() - (data.x.length / STEPS) * DURATION;
      playBtn.textContent = '⏸ Pause';
      rafId = requestAnimationFrame(animFrame);
    }
  });

  if (resetBtn) resetBtn.addEventListener('click', doReset);

  /* Draw empty chart grid on page load */
  drawChart();
})();


/* ── DCVG Interactive Slider ── */
(function initDcvg() {
  const slider   = document.getElementById('dcvgSlider');
  if (!slider) return;

  const probeA   = document.getElementById('dcvgProbeA');
  const probeB   = document.getElementById('dcvgProbeB');
  const wire     = document.getElementById('dcvgWire');
  const vmeter   = document.getElementById('dcvgVMeter');
  const valText  = document.getElementById('dcvgValText');
  const statusTx = document.getElementById('dcvgStatusText');
  const caption  = document.getElementById('dcvgCaption');
  const gradFill = document.getElementById('gradientFill');
  const posTick  = document.getElementById('dcvgPosTick');
  const hGlow1   = document.getElementById('dHGlow1');
  const hDot1    = document.getElementById('dHDot1');
  const hLbl1    = document.getElementById('dHLbl1');
  const hGlow2   = document.getElementById('dHGlow2');
  const hDot2    = document.getElementById('dHDot2');
  const hLbl2    = document.getElementById('dHLbl2');
  const curr1    = document.getElementById('dCurr1');
  const curr2    = document.getElementById('dCurr2');

  /* Gaussian peak reading — holiday 1 @ pct=32, holiday 2 @ pct=69 */
  function getDcvgComponents(pct) {
    const g1 = 87 * Math.exp(-Math.pow((pct - 32) / 5, 2));
    const g2 = 46 * Math.exp(-Math.pow((pct - 69) / 4.5, 2));
    const noise = 1.5 + Math.sin(pct * 0.7) * 0.6;
    return { g1, g2, total: Math.max(1, Math.round(noise + g1 + g2)) };
  }

  function update(pct) {
    /* Probe positions: probeA is front (higher x), probeB is 60px behind */
    const ax = 30 + (pct / 100) * 640;
    const bx = Math.min(ax + 60, 686);
    const mx = (ax + bx) / 2;

    if (probeA) probeA.setAttribute('transform', `translate(${ax},82)`);
    if (probeB) probeB.setAttribute('transform', `translate(${bx},82)`);
    if (wire)   { wire.setAttribute('x1', ax); wire.setAttribute('x2', bx); }
    if (vmeter) vmeter.setAttribute('transform', `translate(${mx - 60},0)`);
    if (posTick) { posTick.setAttribute('x1', ax); posTick.setAttribute('x2', ax); }

    /* Reading */
    const { g1, g2, total } = getDcvgComponents(pct);

    if (valText) valText.textContent = `${total} mV`;

    let color, statusText, captionText, fillPct;
    if (total < 5) {
      color = '#34C759'; statusText = '✓ OK';
      captionText = `Background signal (${total} mV) — coating intact at this location.`;
      fillPct = (total / 90) * 100;
    } else if (total < 20) {
      color = '#FF9500'; statusText = '⚠ Low';
      captionText = `Low gradient (${total} mV) — minor indication. Log the location and cross-reference with CIPS data.`;
      fillPct = (total / 90) * 100;
    } else if (total < 50) {
      color = '#FF6B00'; statusText = '⚠ Defect';
      captionText = `Medium gradient (${total} mV) — coating defect detected! Mark GPS location for follow-up.`;
      fillPct = (total / 90) * 100;
    } else {
      color = '#FF3B30'; statusText = '🚨 Major!';
      captionText = `HIGH GRADIENT (${total} mV) — Significant coating holiday! Current converging at defect. Recommend excavation and repair.`;
      fillPct = Math.min((total / 90) * 100, 100);
    }

    if (valText)  valText.setAttribute('fill', color);
    if (statusTx) { statusTx.textContent = statusText; statusTx.setAttribute('fill', color); }
    if (caption)  {
      caption.textContent = captionText;
      caption.className = total >= 50 ? 'slider-caption error' : total >= 20 ? 'slider-caption warn' : 'slider-caption';
    }
    if (gradFill) gradFill.style.width = fillPct + '%';

    /* Holiday 1 visibility (appears when its Gaussian contribution is large) */
    const a1 = Math.min(g1 / 55, 1);
    if (hGlow1) hGlow1.setAttribute('opacity', a1 * 0.92);
    if (hDot1)  { hDot1.setAttribute('fill', `rgba(255,59,48,${a1 * 0.25})`); hDot1.setAttribute('stroke', `rgba(255,59,48,${a1})`); }
    if (hLbl1)  hLbl1.setAttribute('fill', `rgba(255,59,48,${a1})`);
    if (curr1)  curr1.setAttribute('opacity', a1);

    /* Holiday 2 visibility */
    const a2 = Math.min(g2 / 35, 1);
    if (hGlow2) hGlow2.setAttribute('opacity', a2 * 0.9);
    if (hDot2)  { hDot2.setAttribute('fill', `rgba(255,149,0,${a2 * 0.2})`); hDot2.setAttribute('stroke', `rgba(255,149,0,${a2})`); }
    if (hLbl2)  hLbl2.setAttribute('fill', `rgba(255,149,0,${a2})`);
    if (curr2)  curr2.setAttribute('opacity', a2);

    slider.style.setProperty('--fill', pct + '%');
  }

  slider.addEventListener('input', () => update(parseInt(slider.value)));
  update(0);
})();


/* ── Section 2 Quiz ── */
buildQuiz('quizS2', [
  {
    q: 'What is the primary purpose of CIPS (Close Interval Potential Survey)?',
    opts: [
      'To locate buried pipeline depth using electromagnetic signals',
      'To measure pipe-to-soil potential at close intervals along the entire pipeline',
      'To measure soil resistivity for corrosion risk assessment',
      'To determine the coating thickness at selected test stations'
    ],
    correct: 1,
    explain: '✅ Correct! CIPS records the pipe-to-soil potential every 1–3 m along the pipeline route, creating a continuous profile to verify that the CP system effectively protects the entire length.'
  },
  {
    q: 'How does DCVG detect a coating holiday?',
    opts: [
      'By detecting a difference in pipe wall temperature above the defect',
      'By measuring the voltage gradients in soil caused by CP current flowing toward the coating defect',
      'By directly measuring the coating thickness with ultrasonic probes',
      'By comparing ON and OFF potential readings at test stations'
    ],
    correct: 1,
    explain: '✅ Correct! DCVG measures surface voltage gradients. CP current "leaks" through any coating defect and flows toward it through the soil, creating a measurable voltage gradient directly above the holiday that two surface probes can detect.'
  },
  {
    q: 'Why is the OFF (instant-off) potential used to assess cathodic protection adequacy rather than the ON potential?',
    opts: [
      'Because the rectifier must be off for worker safety during all surveys',
      'Because the ON potential is always more negative, giving false confidence',
      'Because the OFF potential excludes the IR drop, representing the true polarised pipe potential',
      'Because OFF potentials are easier to measure accurately with standard equipment'
    ],
    correct: 2,
    explain: '✅ Correct! The ON potential includes an IR drop component — a voltage error caused by current flowing through the soil resistance. The OFF (instant-off) potential, measured immediately after interrupting the current, eliminates this error and gives the true polarised potential at the pipe surface, which is what the −850 mV criterion is based on.'
  }
], 'survey methods');


/* ══════════════════════════════════════════════════════════
   SECTION 3 — IR DROP
   ══════════════════════════════════════════════════════════ */

/* ── IR Drop Bar Visualiser ── */
(function initIrVisualiser() {
  const vOffSlider   = document.getElementById('vOffSlider');
  const irDropSlider = document.getElementById('irDropSlider');
  if (!vOffSlider || !irDropSlider) return;

  const vOffDisplay  = document.getElementById('vOffDisplay');
  const irDropDisplay= document.getElementById('irDropDisplay');
  const barOnGreen   = document.getElementById('barOnGreen');
  const barOnOrange  = document.getElementById('barOnOrange');
  const barOffGreen  = document.getElementById('barOffGreen');
  const barIRRect    = document.getElementById('barIRRect');
  const barOnLabel   = document.getElementById('barOnLabel');
  const barOffLabel  = document.getElementById('barOffLabel');
  const barIRLabel   = document.getElementById('barIRLabel');
  const statusBox    = document.getElementById('irStatusBox');
  const statusIcon   = document.getElementById('irStatusIcon');
  const statusTitle  = document.getElementById('irStatusTitle');
  const statusBody   = document.getElementById('irStatusBody');

  /* Bar chart geometry (mirrors SVG viewBox 0 0 520 168)
     x = 130 + (|V| − 600) / 600 × 380
     SCALE = 380/600 ≈ 0.6333 px/mV
     x_start = 130 */
  const X0    = 130;
  const SCALE = 380 / 600;   /* px per mV */
  const V_MIN = 600;         /* zero of the bar scale (|V|=600 → x=130) */
  const MAX_W = 380;

  function voltToW(absMV) {
    return Math.max(0, Math.min((absMV - V_MIN) * SCALE, MAX_W));
  }

  function update() {
    const vOff  = parseInt(vOffSlider.value);   /* e.g. -880 */
    const irDrop= parseInt(irDropSlider.value); /* e.g. 80   */
    const vOn   = vOff - irDrop;                /* e.g. -960 */

    /* Update displays */
    if (vOffDisplay)  { vOffDisplay.textContent = `${vOff} mV`; }
    if (irDropDisplay){ irDropDisplay.textContent = `${irDrop} mV`; }

    /* Bar widths */
    const greenW  = voltToW(Math.abs(vOff));
    const orangeW = irDrop * SCALE;
    const totalW  = voltToW(Math.abs(vOn));

    /* Update SVG bars */
    if (barOnGreen)  { barOnGreen.setAttribute('width',  Math.round(greenW));  }
    if (barOnOrange) {
      barOnOrange.setAttribute('x',     Math.round(X0 + greenW));
      barOnOrange.setAttribute('width', Math.round(orangeW));
    }
    if (barOffGreen) { barOffGreen.setAttribute('width', Math.round(greenW)); }
    if (barIRRect)   { barIRRect.setAttribute('width',   Math.round(orangeW)); }

    /* Value labels */
    const onLabelX  = Math.round(X0 + totalW  + 6);
    const offLabelX = Math.round(X0 + greenW  + 6);
    const irLabelX  = Math.round(X0 + orangeW + 6);
    if (barOnLabel)  { barOnLabel.setAttribute('x',  Math.min(onLabelX,  470)); barOnLabel.textContent  = `${vOn} mV`; }
    if (barOffLabel) { barOffLabel.setAttribute('x', Math.min(offLabelX, 470)); barOffLabel.textContent = `${vOff} mV`; }
    if (barIRLabel)  { barIRLabel.setAttribute('x',  Math.min(irLabelX,  470)); barIRLabel.textContent  = `${irDrop} mV`; }

    /* Slider fill CSS */
    const offPct = ((Math.abs(vOff) - 700) / 400) * 100;
    const irPct  = (irDrop / 200) * 100;
    vOffSlider.style.setProperty('--fill',  offPct + '%');
    irDropSlider.style.setProperty('--fill', irPct  + '%');

    /* Protection status */
    const isOffProtected = vOff <= -850;            /* V_OFF more negative than criterion */
    const isOnProtected  = vOn  <= -850;

    if (isOffProtected) {
      statusBox.className = 'ir-status-box ok';
      statusIcon.textContent = '✅';
      statusTitle.textContent = 'Protected';
      statusBody.innerHTML = `V<sub>OFF</sub> = ${vOff} mV is more negative than −850 mV. The pipe is adequately protected regardless of IR drop.`;
    } else if (!isOffProtected && isOnProtected) {
      statusBox.className = 'ir-status-box danger';
      statusIcon.textContent = '🚨';
      statusTitle.textContent = 'DANGER — IR Drop Masking Underprotection!';
      statusBody.innerHTML = `V<sub>OFF</sub> = ${vOff} mV → pipe is <strong>UNPROTECTED</strong>, but V<sub>ON</sub> = ${vOn} mV falsely suggests adequate protection. The ${irDrop} mV IR drop is hiding the problem.`;
    } else {
      statusBox.className = 'ir-status-box bad';
      statusIcon.textContent = '❌';
      statusTitle.textContent = 'Unprotected';
      statusBody.innerHTML = `V<sub>OFF</sub> = ${vOff} mV is less negative than −850 mV. Both ON and OFF potentials indicate the pipe is not adequately protected.`;
    }
  }

  vOffSlider.addEventListener('input',   update);
  irDropSlider.addEventListener('input', update);
  update(); /* initialise */
})();


/* ── Instant-Off Waveform Simulator ── */
(function initWaveform() {
  const canvas   = document.getElementById('waveCanvas');
  const playBtn  = document.getElementById('wavePlay');
  const resetBtn = document.getElementById('waveReset');
  if (!canvas || !playBtn) return;

  const ctx = canvas.getContext('2d');

  /* Waveform parameters */
  const V_ON  = -960;  /* mV — ON potential (includes IR) */
  const V_IOFF= -880;  /* mV — instant-off (true polarised) */
  const V_NAT = -800;  /* mV — natural potential (no protection) */
  const TAU   = 2.2;   /* s  — depolarisation time constant */
  const ON_T  = 4.5;   /* s  — on period per cycle */
  const OFF_T = 1.5;   /* s  — off period per cycle */
  const CYCLE = ON_T + OFF_T;
  const N_CYCLES = 3;
  const TOTAL_T  = N_CYCLES * CYCLE;  /* 18 s */

  /* Animation speed: 1 animated second = 0.4 real seconds (2.5× speed) */
  const SPEED = 2.5;

  /* Chart geometry */
  const CL = 55, CR = 10, CT = 18, CB = 28;
  const CW = canvas.width  - CL - CR;
  const CH = canvas.height - CT - CB;
  const MV_TOP = -700, MV_BOT = -1050;

  function mvToY(mv) { return CT + (MV_TOP - mv) / (MV_TOP - MV_BOT) * CH; }
  function tToX(t)   { return CL + (t / TOTAL_T) * CW; }

  /* Waveform value at time t */
  function waveAt(t) {
    const phase = t % CYCLE;
    if (phase <= ON_T) return V_ON;
    const tOff = phase - ON_T;
    if (tOff < 0.06) return V_IOFF;          /* instant-off jump */
    return V_IOFF + (V_NAT - V_IOFF) * (1 - Math.exp(-(tOff - 0.06) / TAU));
  }

  /* Pre-build full waveform at fine resolution for smooth curve */
  const SAMPLES = 900;
  const waveT = [], waveV = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const t = (i / SAMPLES) * TOTAL_T;
    waveT.push(t);
    waveV.push(waveAt(t));
  }

  function drawBase() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    /* Background */
    ctx.fillStyle = 'rgba(255,255,255,.42)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(0, 0, W, H, 8); else ctx.rect(0, 0, W, H);
    ctx.fill();

    /* Unprotected zone above criterion */
    const y850 = mvToY(-850);
    ctx.fillStyle = 'rgba(255,59,48,.04)';
    ctx.fillRect(CL, CT, CW, y850 - CT);

    /* Grid lines */
    [-750, -800, -850, -900, -950, -1000].forEach(mv => {
      const y = mvToY(mv);
      ctx.beginPath();
      ctx.lineWidth = mv === -850 ? 1.6 : 1;
      ctx.strokeStyle = mv === -850 ? 'rgba(255,59,48,.5)' : 'rgba(0,0,0,.07)';
      ctx.setLineDash(mv === -850 ? [6, 4] : []);
      ctx.moveTo(CL, y); ctx.lineTo(W - CR, y);
      ctx.stroke();
      ctx.setLineDash([]);
      /* Y labels */
      ctx.font = '9px system-ui'; ctx.textAlign = 'right';
      ctx.fillStyle = mv === -850 ? 'rgba(255,59,48,.7)' : 'rgba(0,0,0,.35)';
      ctx.fillText(`${mv}`, CL - 4, y + 3.5);
    });

    /* Axis labels */
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Time →', W / 2, H - 6);
    ctx.save(); ctx.translate(12, H / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('mV vs. CSE', 0, 0); ctx.restore();

    /* Criterion label */
    ctx.fillStyle = 'rgba(255,59,48,.7)'; ctx.font = 'bold 8.5px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('−850 mV protection criterion', CL + 4, y850 - 3);

    /* X axis cycle markers (show ON / OFF cycles) */
    for (let c = 0; c <= N_CYCLES; c++) {
      const x = tToX(c * CYCLE);
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0,0,0,.1)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.moveTo(x, CT); ctx.lineTo(x, CT + CH); ctx.stroke(); ctx.setLineDash([]);
    }
  }

  let rafId, startRealTime, animStopped = false, animDone = false;

  function drawWaveformUpTo(animT) {
    /* Find last sample index ≤ animT */
    const lastIdx = Math.min(
      waveT.findLastIndex ? waveT.findLastIndex(t => t <= animT) : waveT.reduce((acc, t, i) => t <= animT ? i : acc, 0),
      SAMPLES
    );
    if (lastIdx < 1) return;

    ctx.beginPath();
    ctx.strokeStyle = '#007AFF';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap  = 'round';
    for (let i = 0; i <= lastIdx; i++) {
      const x = tToX(waveT[i]), y = mvToY(waveV[i]);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    /* Draw annotations when enough of the waveform is visible */
    if (animT >= ON_T * 0.6) {
      /* V_ON label */
      const x1 = tToX(ON_T * 0.3), y1 = mvToY(V_ON);
      ctx.fillStyle = 'rgba(0,122,255,.15)';
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x1 - 32, y1 - 16, 78, 18, 4); else ctx.rect(x1-32,y1-16,78,18); ctx.fill();
      ctx.fillStyle = '#007AFF'; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(`V_ON = ${V_ON} mV`, x1 + 7, y1 - 3);
    }

    if (animT >= ON_T + 0.2) {
      /* Instant-off label + arrow */
      const xOff = tToX(ON_T + 0.06), yOff = mvToY(V_IOFF);
      ctx.fillStyle = 'rgba(52,199,89,.15)';
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(xOff + 4, yOff - 16, 110, 18, 4); else ctx.rect(xOff+4,yOff-16,110,18); ctx.fill();
      ctx.fillStyle = '#34C759'; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left';
      ctx.fillText(`V_OFF = ${V_IOFF} mV  ← Instant-off`, xOff + 7, yOff - 3);

      /* IR Drop bracket */
      const xBrk = tToX(ON_T * 0.65);
      const yTop = mvToY(V_ON), yBot = mvToY(V_IOFF);
      ctx.strokeStyle = '#FF9500'; ctx.lineWidth = 1.4; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(xBrk, yTop); ctx.lineTo(xBrk, yBot); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#FF9500'; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'left';
      ctx.fillText(`IR = ${Math.abs(V_ON - V_IOFF)} mV`, xBrk + 4, (yTop + yBot) / 2 + 4);
    }

    if (animT >= ON_T + OFF_T * 0.5) {
      /* Depolarisation label */
      const xD = tToX(ON_T + OFF_T * 0.35), yD = mvToY(waveAt(ON_T + OFF_T * 0.4)) - 14;
      ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.font = 'italic 9px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('Depolarising...', xD, yD);
    }
  }

  function animFrame(realTs) {
    if (!startRealTime) startRealTime = realTs;
    const realElapsed = (realTs - startRealTime) / 1000;  /* seconds */
    const animT = Math.min(realElapsed * SPEED, TOTAL_T);

    drawBase();
    drawWaveformUpTo(animT);

    if (animT < TOTAL_T && !animStopped) {
      rafId = requestAnimationFrame(animFrame);
    } else {
      animStopped = false;
      animDone    = true;
      if (playBtn) playBtn.textContent = '▶ Replay';
      drawBase();
      drawWaveformUpTo(TOTAL_T);
    }
  }

  function doReset() {
    animStopped = true; animDone = false;
    cancelAnimationFrame(rafId);
    startRealTime = null;
    drawBase();
    if (playBtn) playBtn.textContent = '▶ Play';
  }

  playBtn.addEventListener('click', () => {
    if (!animDone && startRealTime !== null && !animStopped) {
      /* Pause */
      animStopped = true;
      cancelAnimationFrame(rafId);
      playBtn.textContent = '▶ Resume';
    } else if (animDone) {
      doReset();
      setTimeout(() => { animStopped = false; startRealTime = null; playBtn.textContent = '⏸ Pause'; rafId = requestAnimationFrame(animFrame); }, 60);
    } else {
      /* Start or resume */
      animStopped = false;
      if (startRealTime !== null) startRealTime = performance.now();  /* simple restart on resume */
      playBtn.textContent = '⏸ Pause';
      rafId = requestAnimationFrame(animFrame);
    }
  });

  if (resetBtn) resetBtn.addEventListener('click', doReset);
  drawBase();
})();


/* ── Section 3 Quiz ── */
buildQuiz('quizS3', [
  {
    q: 'What causes IR drop in a CP potential measurement?',
    opts: [
      'Corrosion products building up on the pipe surface',
      'Current flowing through the soil resistance between the reference electrode and the pipe',
      'Fluctuations in the rectifier output voltage',
      'Temperature differences between the soil and the pipe metal'
    ],
    correct: 1,
    explain: '✅ Correct! IR drop (V = I × R) occurs because CP current flows through the electrical resistance of the soil. This creates a voltage gradient in the soil between the pipe and the reference electrode, adding an error to the measured potential.'
  },
  {
    q: 'If V_OFF (instant-off) = −840 mV and IR drop = 120 mV, what is the ON potential?',
    opts: [
      '−720 mV (less negative)',
      '−960 mV (more negative)',
      '−840 mV (unchanged)',
      '−850 mV (exactly at criterion)'
    ],
    correct: 1,
    explain: '✅ Correct! V_ON = V_OFF − IR drop = −840 − 120 = −960 mV. The ON potential is MORE negative than the true protection potential. Notice that V_OFF = −840 mV means the pipe is actually UNPROTECTED (above −850 mV criterion), but V_ON = −960 mV falsely suggests strong protection — this is the "masking" danger of relying on ON potential.'
  },
  {
    q: 'When must the potential be read during the instant-off technique to eliminate IR drop?',
    opts: [
      'After the pipe has fully depolarised (several minutes after switch-off)',
      'During the ON phase, between current pulses',
      'Immediately at the moment of current switch-off, before depolarisation begins',
      'At the midpoint of the OFF cycle to average the depolarisation effect'
    ],
    correct: 2,
    explain: '✅ Correct! The reading must be taken at the instant of switch-off — within milliseconds. At that moment, the ohmic (IR) drop disappears instantly because current stops flowing, but the pipe has not yet had time to depolarise. Any delay allows depolarisation to begin, which changes the reading and makes it no longer represent the true polarised potential.'
  }
], 'IR drop');


/* ══════════════════════════════════════════════════════════
   SECTION 4 — CURRENT MEASUREMENT
   ══════════════════════════════════════════════════════════ */

/* ── Shunt Calculator ── */
(function initShuntCalc() {
  const sel    = document.getElementById('shuntSelect');
  const mvIn   = document.getElementById('shuntMv');
  const slider = document.getElementById('shuntSlider');
  const steps  = document.getElementById('shuntCalcSteps');
  if (!sel || !mvIn || !steps) return;

  function fmtR(r) {
    /* Format resistance with up to 5 decimal places, trim trailing zeros */
    return r >= 0.001
      ? parseFloat(r.toFixed(5)).toString()
      : r.toExponential(3);
  }

  function update() {
    const [maxA, fullMv] = sel.value.split(',').map(Number);
    const mv  = parseFloat(mvIn.value) || 0;
    const R   = (fullMv / 1000) / maxA;
    const V   = mv / 1000;
    const I   = V / R;
    const pct = (Math.min(mv, fullMv) / fullMv) * 100;

    slider.value = Math.min(mv, fullMv);
    slider.style.background =
      `linear-gradient(to right, var(--blue) ${pct}%, rgba(0,0,0,.12) ${pct}%)`;

    steps.innerHTML = `
      <div class="calc-step">
        <div class="calc-step-num">1</div>
        <div class="calc-step-text">
          Shunt rating: <span class="formula">${maxA} A / ${fullMv} mV</span>
          &nbsp;→&nbsp; Resistance
          <span class="formula">R = ${fullMv} mV ÷ ${maxA} A = ${fmtR(R)} Ω</span>
        </div>
      </div>
      <div class="calc-step">
        <div class="calc-step-num">2</div>
        <div class="calc-step-text">
          Measured voltage drop:
          <span class="formula">V = ${mv.toFixed(1)} mV = ${V.toFixed(4)} V</span>
        </div>
      </div>
      <div class="calc-step">
        <div class="calc-step-num">3</div>
        <div class="calc-step-text">
          Apply Ohm's Law:
          <span class="formula">I = V ÷ R = ${V.toFixed(4)} V ÷ ${fmtR(R)} Ω</span>
        </div>
      </div>
      <div class="calc-result">
        <span class="calc-result-label">Current (I) =</span>
        <span class="calc-result-value">${I.toFixed(3)} A</span>
      </div>`;
  }

  sel.addEventListener('change', update);
  mvIn.addEventListener('input', () => {
    slider.value = Math.min(parseFloat(mvIn.value) || 0, 50);
    update();
  });
  slider.addEventListener('input', () => {
    mvIn.value = slider.value;
    update();
  });
  update();
})();


/* ── 2-Wire vs 4-Wire Comparison ── */
(function initWireComparison() {
  const wireSvg   = document.getElementById('wireSvg');
  const infoPanel = document.getElementById('wireInfoPanel');
  const exampleBox = document.getElementById('wireExampleBox');
  const btn2      = document.getElementById('wireBtn2');
  const btn4      = document.getElementById('wireBtn4');
  const titleEl   = document.getElementById('wireMethodTitle');
  if (!wireSvg || !btn2) return;

  /* SVG geometry constants */
  const W = 560, H = 280;
  const PY = 165, PR = 22, PX1 = 45, PX2 = 515;

  const PIPE_GRAD = `
    <defs>
      <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#b8c2d4"/>
        <stop offset="38%"  stop-color="#dde4f0"/>
        <stop offset="100%" stop-color="#8993a6"/>
      </linearGradient>
    </defs>`;

  const SOIL_LAYER = `
    <rect x="0" y="${PY+PR}" width="${W}" height="${H-PY-PR}"
      fill="rgba(170,130,90,.13)"/>
    <text x="12" y="${H-10}" font-size="11" fill="#a08060" font-style="italic">Soil</text>`;

  const PIPE_BODY = `
    <rect x="${PX1}" y="${PY-PR}" width="${PX2-PX1}" height="${PR*2}"
      rx="${PR}" fill="url(#pg)" stroke="#8993a6" stroke-width="1.5"/>
    <text x="${(PX1+PX2)/2}" y="${PY+5}" text-anchor="middle"
      font-size="12" fill="#333" font-weight="700" letter-spacing="1">PIPELINE</text>`;

  function draw2Wire() {
    const A = 155, B = 405;
    const TY = 68;  /* top of wires */
    const MX = (A + B) / 2;

    wireSvg.innerHTML = `
      ${PIPE_GRAD}
      ${SOIL_LAYER}
      <!-- span highlight -->
      <rect x="${A}" y="${PY-PR-3}" width="${B-A}" height="${PR*2+6}"
        fill="rgba(0,122,255,.07)" stroke="rgba(0,122,255,.22)"
        stroke-width="1.5" stroke-dasharray="5,3" rx="2"/>
      <text x="${MX}" y="${PY+PR+20}" text-anchor="middle"
        font-size="11" fill="#007AFF" font-weight="600">Pipe span  (R<tspan font-size="9" dy="2">span</tspan><tspan dy="-2"> known)</tspan></text>
      ${PIPE_BODY}
      <!-- lead A -->
      <line x1="${A}" y1="${PY-PR}" x2="${A}" y2="${TY}"
        stroke="#007AFF" stroke-width="2.5"/>
      <circle cx="${A}" cy="${PY-PR}" r="6" fill="#007AFF" stroke="white" stroke-width="2"/>
      <text x="${A}" y="${TY+16}" text-anchor="middle"
        font-size="12" fill="#007AFF" font-weight="700">A</text>
      <!-- lead B -->
      <line x1="${B}" y1="${PY-PR}" x2="${B}" y2="${TY}"
        stroke="#007AFF" stroke-width="2.5"/>
      <circle cx="${B}" cy="${PY-PR}" r="6" fill="#007AFF" stroke="white" stroke-width="2"/>
      <text x="${B}" y="${TY+16}" text-anchor="middle"
        font-size="12" fill="#007AFF" font-weight="700">B</text>
      <!-- wire horizontals to voltmeter -->
      <line x1="${A}" y1="${TY}" x2="${MX-40}" y2="${TY-20}"
        stroke="#007AFF" stroke-width="1.8"/>
      <line x1="${B}" y1="${TY}" x2="${MX+40}" y2="${TY-20}"
        stroke="#007AFF" stroke-width="1.8"/>
      <!-- voltmeter box -->
      <rect x="${MX-42}" y="${TY-58}" width="84" height="40"
        rx="11" fill="rgba(255,255,255,.9)" stroke="#007AFF" stroke-width="2"/>
      <text x="${MX}" y="${TY-40}" text-anchor="middle"
        font-size="15" fill="#007AFF" font-weight="900">V</text>
      <text x="${MX}" y="${TY-24}" text-anchor="middle"
        font-size="10" fill="#555">mV meter</text>
      <!-- formula -->
      <text x="${MX}" y="${H-34}" text-anchor="middle"
        font-size="14" fill="#1C1C1E" font-weight="700">I  =  V<tspan font-size="10" dy="3">meas</tspan><tspan dy="-3">  ÷  R</tspan><tspan font-size="10" dy="3">span</tspan></text>
      <text x="${MX}" y="${H-15}" text-anchor="middle"
        font-size="12" fill="#555">e.g.  0.00017 V  ÷  4.88×10⁻⁶ Ω  =  348 mA</text>`;
  }

  function draw4Wire() {
    const A = 90, B = 175, C = 385, D = 470;
    const TY_OUT = 56, TY_IN = 80;
    const MX_OUT = (A + D) / 2, MX_IN = (B + C) / 2;

    wireSvg.innerHTML = `
      ${PIPE_GRAD}
      ${SOIL_LAYER}
      <!-- measurement span highlight -->
      <rect x="${B}" y="${PY-PR-3}" width="${C-B}" height="${PR*2+6}"
        fill="rgba(0,122,255,.07)" stroke="rgba(0,122,255,.22)"
        stroke-width="1.5" stroke-dasharray="5,3" rx="2"/>
      <text x="${MX_IN}" y="${PY+PR+20}" text-anchor="middle"
        font-size="11" fill="#007AFF" font-weight="600">Voltage sense span</text>
      ${PIPE_BODY}
      <!-- outer wires (orange) — calibration current -->
      <line x1="${A}" y1="${PY-PR}" x2="${A}" y2="${TY_OUT}"
        stroke="#FF9500" stroke-width="2.5"/>
      <circle cx="${A}" cy="${PY-PR}" r="6" fill="#FF9500" stroke="white" stroke-width="2"/>
      <text x="${A}" y="${PY-PR-10}" text-anchor="middle"
        font-size="11" fill="#FF9500" font-weight="700">A</text>

      <line x1="${D}" y1="${PY-PR}" x2="${D}" y2="${TY_OUT}"
        stroke="#FF9500" stroke-width="2.5"/>
      <circle cx="${D}" cy="${PY-PR}" r="6" fill="#FF9500" stroke="white" stroke-width="2"/>
      <text x="${D}" y="${PY-PR-10}" text-anchor="middle"
        font-size="11" fill="#FF9500" font-weight="700">B</text>

      <!-- current source box -->
      <line x1="${A}" y1="${TY_OUT}" x2="${MX_OUT-52}" y2="${TY_OUT-18}"
        stroke="#FF9500" stroke-width="1.8"/>
      <line x1="${D}" y1="${TY_OUT}" x2="${MX_OUT+52}" y2="${TY_OUT-18}"
        stroke="#FF9500" stroke-width="1.8"/>
      <rect x="${MX_OUT-54}" y="${TY_OUT-52}" width="108" height="36"
        rx="10" fill="rgba(255,255,255,.9)" stroke="#FF9500" stroke-width="2"/>
      <text x="${MX_OUT}" y="${TY_OUT-37}" text-anchor="middle"
        font-size="11" fill="#FF9500" font-weight="800">I<tspan font-size="9" dy="2">cal</tspan><tspan dy="-2"> = 10 A</tspan></text>
      <text x="${MX_OUT}" y="${TY_OUT-22}" text-anchor="middle"
        font-size="9.5" fill="#888">Cal. Current Source</text>

      <!-- inner wires (blue) — voltage sense -->
      <line x1="${B}" y1="${PY-PR}" x2="${B}" y2="${TY_IN}"
        stroke="#007AFF" stroke-width="2.5"/>
      <circle cx="${B}" cy="${PY-PR}" r="6" fill="#007AFF" stroke="white" stroke-width="2"/>
      <text x="${B}" y="${PY-PR-10}" text-anchor="middle"
        font-size="11" fill="#007AFF" font-weight="700">C</text>

      <line x1="${C}" y1="${PY-PR}" x2="${C}" y2="${TY_IN}"
        stroke="#007AFF" stroke-width="2.5"/>
      <circle cx="${C}" cy="${PY-PR}" r="6" fill="#007AFF" stroke="white" stroke-width="2"/>
      <text x="${C}" y="${PY-PR-10}" text-anchor="middle"
        font-size="11" fill="#007AFF" font-weight="700">D</text>

      <!-- voltmeter (blue) -->
      <line x1="${B}" y1="${TY_IN}" x2="${MX_IN-38}" y2="${TY_IN-14}"
        stroke="#007AFF" stroke-width="1.8"/>
      <line x1="${C}" y1="${TY_IN}" x2="${MX_IN+38}" y2="${TY_IN-14}"
        stroke="#007AFF" stroke-width="1.8"/>
      <rect x="${MX_IN-40}" y="${TY_IN-48}" width="80" height="36"
        rx="10" fill="rgba(255,255,255,.9)" stroke="#007AFF" stroke-width="2"/>
      <text x="${MX_IN}" y="${TY_IN-33}" text-anchor="middle"
        font-size="14" fill="#007AFF" font-weight="900">V</text>
      <text x="${MX_IN}" y="${TY_IN-17}" text-anchor="middle"
        font-size="9.5" fill="#555">mV meter</text>

      <!-- formula -->
      <text x="${MX_OUT}" y="${H-34}" text-anchor="middle"
        font-size="13" fill="#1C1C1E" font-weight="700">Factor = I<tspan font-size="9" dy="3">cal</tspan><tspan dy="-3"> ÷ V</tspan><tspan font-size="9" dy="3">cal</tspan><tspan dy="-3">   →   I</tspan><tspan font-size="9" dy="3">pipe</tspan><tspan dy="-3"> = Factor × V</tspan><tspan font-size="9" dy="3">span</tspan></text>
      <text x="${MX_OUT}" y="${H-15}" text-anchor="middle"
        font-size="12" fill="#555">e.g.  10 A ÷ 4.91 mV = 2.04 A/mV  →  2.04 × 0.17 = 347 mA</text>`;
  }

  function setMethod(n) {
    btn2.className = 'ctrl-btn' + (n === 2 ? ' primary' : '');
    btn4.className = 'ctrl-btn' + (n === 4 ? ' primary' : '');
    titleEl.textContent = n === 2 ? '2-Wire Method' : '4-Wire Method';

    if (n === 2) {
      draw2Wire();
      infoPanel.innerHTML = `
        <div class="wire-info-item"><h4>Required inputs</h4>
          <p>Pipe span resistance (R<sub>span</sub>) — calculated from pipe dimensions/data, or pre-measured</p></div>
        <div class="wire-info-item"><h4>How it works</h4>
          <p>Two leads measure the voltage drop across a known length of pipe. Ohm's Law gives the current.</p></div>
        <div class="wire-info-item"><h4>Formula</h4>
          <p><strong>I = V<sub>span</sub> ÷ R<sub>span</sub></strong></p></div>
        <div class="wire-info-item"><h4>Limitation</h4>
          <p>Accuracy depends on R<sub>span</sub> being accurately known. Lead contact resistance may add a small error.</p></div>`;
      exampleBox.innerHTML = `
        <strong>Worked Example — 2-Wire:</strong><br>
        Pipe span: 200 ft of 6-inch steel &nbsp;→&nbsp; R<sub>span</sub> = 4.88 × 10<sup>−6</sup> Ω<br>
        Measured V drop: 0.17 mV = 0.00017 V
        <span class="ex-formula">I = 0.00017 V ÷ 4.88×10<sup>−6</sup> Ω = <strong>348 mA  (West → East)</strong></span>
        Positive reading at lead A (West side) → current flows West toward East in the pipe.`;
    } else {
      draw4Wire();
      infoPanel.innerHTML = `
        <div class="wire-info-item"><h4>Step 1 — Calibrate</h4>
          <p>Inject known I<sub>cal</sub> via outer leads A, B. Measure resulting V<sub>cal</sub> at inner leads C, D. Factor = I<sub>cal</sub> ÷ V<sub>cal</sub></p></div>
        <div class="wire-info-item"><h4>Step 2 — Measure</h4>
          <p>Remove calibration current. Measure pipeline voltage V<sub>span</sub> at inner leads. I<sub>pipe</sub> = Factor × V<sub>span</sub></p></div>
        <div class="wire-info-item"><h4>Advantage</h4>
          <p>Calibration eliminates contact resistance errors in the leads. No need to know R<sub>span</sub> from pipe data.</p></div>
        <div class="wire-info-item"><h4>Accuracy</h4>
          <p>Higher precision than 2-wire. The method of choice when accurate survey data is required.</p></div>`;
      exampleBox.innerHTML = `
        <strong>Worked Example — 4-Wire:</strong><br>
        Inject I<sub>cal</sub> = 10 A → measure V<sub>cal</sub> = 4.91 mV (ON − OFF difference)
        <span class="ex-formula">Factor = 10 A ÷ 4.91 mV = <strong>2.04 A/mV</strong></span>
        Pipeline span reading (no cal. current): V<sub>span</sub> = 0.17 mV
        <span class="ex-formula">I<sub>pipe</sub> = 2.04 × 0.17 = <strong>347 mA  (East → West)</strong></span>
        Negative sign at lead C → current flows East toward West through the pipe.`;
    }
  }

  btn2.addEventListener('click', () => setMethod(2));
  btn4.addEventListener('click', () => setMethod(4));
  setMethod(4);  /* default */
})();


/* ── Current Direction Indicator ── */
(function initCurrentDirection() {
  const svg    = document.getElementById('dirSvg');
  const row    = document.getElementById('dirReadingRow');
  const btnW   = document.getElementById('dirBtnWest');
  const btnE   = document.getElementById('dirBtnEast');
  if (!svg || !btnW) return;

  const W = 560, H = 150;
  const PY = 82, PR = 20, PX1 = 42, PX2 = 518;
  const TA = 165, TB = 395;  /* test point x */

  const PIPE_GRAD = `
    <defs>
      <linearGradient id="pgDir" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#b8c2d4"/>
        <stop offset="40%"  stop-color="#dde4f0"/>
        <stop offset="100%" stop-color="#8993a6"/>
      </linearGradient>`;

  function draw(dir) {
    const isEast  = dir === 'east';
    const color   = isEast ? '#007AFF' : '#FF9500';
    const vLabel  = isEast ? '+0.17 mV' : '−0.17 mV';
    const flowTxt = isEast ? 'West → East' : 'East → West';

    /* Arrow marker: use separate IDs to force re-render */
    const markId = isEast ? 'arDE' : 'arDW';

    /* Arrow positions along pipe — skip test point area */
    const ARROW_XS = [100, 195, 280, 365, 460];
    const dx = 16;
    const arrowsSvg = ARROW_XS.map(ax => {
      const x1 = isEast ? ax - dx : ax + dx;
      const x2 = isEast ? ax + dx : ax - dx;
      return `<line x1="${x1}" y1="${PY}" x2="${x2}" y2="${PY}"
        stroke="${color}" stroke-width="3.2" opacity=".88"
        marker-end="url(#${markId})"/>`;
    }).join('');

    const MX = (TA + TB) / 2;
    const vmY = PY - PR - 14;

    svg.innerHTML = `
      ${PIPE_GRAD}
        <marker id="${markId}" markerWidth="9" markerHeight="9"
          refX="8" refY="4.5" orient="auto">
          <path d="M0,1 L0,8 L9,4.5 z" fill="${color}"/>
        </marker>
      </defs>
      <!-- axis labels -->
      <text x="16" y="${PY+5}" font-size="13" fill="#999" font-weight="700">W</text>
      <text x="${W-22}" y="${PY+5}" font-size="13" fill="#999" font-weight="700">E</text>
      <!-- pipe -->
      <rect x="${PX1}" y="${PY-PR}" width="${PX2-PX1}" height="${PR*2}"
        rx="${PR}" fill="url(#pgDir)" stroke="#8993a6" stroke-width="1.5"/>
      <!-- current arrows -->
      ${arrowsSvg}
      <!-- test point A -->
      <circle cx="${TA}" cy="${PY-PR}" r="6" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="${TA}" y="${PY-PR-12}" text-anchor="middle"
        font-size="11" fill="${color}" font-weight="700">A</text>
      <!-- test point B -->
      <circle cx="${TB}" cy="${PY-PR}" r="6" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="${TB}" y="${PY-PR-12}" text-anchor="middle"
        font-size="11" fill="${color}" font-weight="700">B</text>
      <!-- voltmeter dashed leads -->
      <line x1="${TA}" y1="${PY-PR-16}" x2="${MX-34}" y2="${vmY-10}"
        stroke="${color}" stroke-width="1.5" stroke-dasharray="4,3"/>
      <line x1="${TB}" y1="${PY-PR-16}" x2="${MX+34}" y2="${vmY-10}"
        stroke="${color}" stroke-width="1.5" stroke-dasharray="4,3"/>
      <!-- voltmeter box -->
      <rect x="${MX-36}" y="${vmY-34}" width="72" height="28"
        rx="9" fill="rgba(255,255,255,.92)" stroke="${color}" stroke-width="1.8"/>
      <text x="${MX}" y="${vmY-15}" text-anchor="middle"
        font-size="13" fill="${color}" font-weight="900">${vLabel}</text>
      <!-- flow label -->
      <text x="${(PX1+PX2)/2}" y="${PY+PR+20}" text-anchor="middle"
        font-size="12.5" fill="${color}" font-weight="700">Current flow: ${flowTxt}</text>`;

    const signColor = isEast ? 'var(--blue)' : 'var(--orange)';
    const interp    = isEast
      ? 'CP current enters pipe at West, flows toward East (anode side)'
      : 'CP current enters pipe at East, flows toward West (anode side)';
    row.innerHTML = `
      <div class="dir-reading-chip">
        <div class="chip-label">V (A − B)</div>
        <div class="chip-val" style="color:${signColor}">${vLabel}</div>
      </div>
      <div class="dir-reading-chip">
        <div class="chip-label">Direction</div>
        <div class="chip-val" style="color:${signColor};font-size:15px">${flowTxt}</div>
      </div>
      <div class="dir-reading-chip" style="flex:2;min-width:200px">
        <div class="chip-label">Interpretation</div>
        <div class="chip-val" style="font-size:13px;color:var(--text2);font-weight:600">${interp}</div>
      </div>`;
  }

  btnW.addEventListener('click', () => {
    btnW.className = 'ctrl-btn primary';
    btnE.className = 'ctrl-btn';
    draw('west');
  });
  btnE.addEventListener('click', () => {
    btnE.className = 'ctrl-btn primary';
    btnW.className = 'ctrl-btn';
    draw('east');
  });
  draw('east');  /* default */
})();


/* ── Section 4 Quiz ── */
buildQuiz('quizS4', [
  {
    q: 'A shunt is rated 15 A / 50 mV. You measure a voltage drop of 28 mV across it. What is the pipeline current?',
    opts: ['5.36 A', '8.40 A', '18.75 A', '0.84 A'],
    correct: 1,
    explain: '✅ Correct! R = 50 mV ÷ 15 A = 0.00333 Ω. I = V ÷ R = 0.028 V ÷ 0.00333 Ω = 8.40 A.'
  },
  {
    q: 'Why is the 4-wire test station method more accurate than the 2-wire method?',
    opts: [
      'It injects a higher current, giving a larger, easier-to-read signal',
      'It eliminates contact-resistance errors through a calibration factor',
      'It measures both ON-potential and OFF-potential simultaneously',
      'It does not require any instruments to be connected to the pipe'
    ],
    correct: 1,
    explain: '✅ Correct! The 4-wire method determines a calibration factor (A/mV) by injecting a known current, which absorbs any contact resistance errors in the test leads. The measurement current is then calculated using that factor, independent of the unknown span resistance.'
  },
  {
    q: 'At a 2-wire test station, lead A (West side) reads higher voltage than lead B (East side), giving V(A−B) = +0.17 mV. In which direction does current flow in the pipe?',
    opts: [
      'East to West — conventional current flows from B toward A',
      'West to East — conventional current flows from A toward B',
      'No current flows — the positive sign indicates zero potential difference',
      'The result is ambiguous; both directions are possible'
    ],
    correct: 1,
    explain: '✅ Correct! A positive V(A−B) means lead A (West) is at higher potential. Conventional current flows from higher to lower potential — i.e., from A (West) toward B (East). Direction: West → East.'
  }
], 'current measurement');


/* ══════════════════════════════════════════════════════════
   SECTION 5 — RESISTANCE MEASUREMENT
   ══════════════════════════════════════════════════════════ */

/* ── Ohmmeter Error Demo ── */
(function initOhmDemo() {
  const slider  = document.getElementById('soilResSlider');
  const lbl     = document.getElementById('soilResLabel');
  const svg     = document.getElementById('ohmSvg');
  const readRow = document.getElementById('ohmReadingRow');
  if (!slider || !svg) return;

  const R_TRUE = 10e6;  /* 10 MΩ — isolation fitting, effectively infinite */

  /* Exponential scale: slider 0→100 maps to R_soil 10→100 000 Ω */
  function soilR(v) { return Math.round(10 * Math.pow(10000, v / 100)); }

  function fmtR(r) {
    if (r >= 1e6)  return (r / 1e6).toFixed(2) + ' MΩ';
    if (r >= 1000) return (r / 1000).toFixed(1) + ' kΩ';
    return r.toFixed(0) + ' Ω';
  }

  function draw(Rsoil, Rmeas) {
    const W=480, H=185;
    const CY=55, CH=22;  /* casing top-y, height */
    const PY=145, PH=22; /* pipe top-y, height */
    const MID = (CY+CH + PY)/2;  /* ~111 */
    const RT_X=145, RS_X=335;

    const soilPct  = parseInt(slider.value) / 100;
    const soilCol  = soilPct > 0.6 ? '#34C759' : soilPct > 0.25 ? '#FF9500' : '#FF3B30';
    const measCol  = Rmeas > 1e5 ? '#34C759' : Rmeas > 5000 ? '#FF9500' : '#FF3B30';

    svg.innerHTML = `
      <!-- soil fill between pipes -->
      <rect x="42" y="${CY+CH}" width="396" height="${PY-CY-CH}"
        fill="rgba(170,130,80,.08)" rx="2"/>
      <text x="240" y="${MID+4}" text-anchor="middle"
        font-size="10.5" fill="rgba(150,110,60,.35)" font-style="italic">Annular space / soil</text>

      <!-- casing -->
      <rect x="42" y="${CY}" width="396" height="${CH}"
        fill="#c8d0e0" stroke="#8891a4" stroke-width="1.5" rx="2"/>
      <text x="240" y="${CY-7}" text-anchor="middle"
        font-size="10" fill="#666" font-weight="700">CASING (Outer Steel Pipe)</text>

      <!-- carrier pipe -->
      <rect x="42" y="${PY}" width="396" height="${PH}"
        fill="#c8d0e0" stroke="#8891a4" stroke-width="1.5" rx="2"/>
      <text x="240" y="${PY+PH+13}" text-anchor="middle"
        font-size="10" fill="#666" font-weight="700">CARRIER PIPE (Inner)</text>

      <!-- Ohmmeter on left side, connecting casing to carrier -->
      <line x1="42" y1="${CY+11}" x2="14" y2="${CY+11}" stroke="#007AFF" stroke-width="2"/>
      <line x1="14" y1="${CY+11}" x2="14" y2="${PY+11}" stroke="#007AFF" stroke-width="2"/>
      <line x1="14" y1="${PY+11}" x2="42" y2="${PY+11}" stroke="#007AFF" stroke-width="2"/>
      <!-- Ohmmeter circle -->
      <circle cx="14" cy="${MID}" r="26" fill="rgba(255,255,255,.92)" stroke="#007AFF" stroke-width="2"/>
      <text x="14" y="${MID-6}" text-anchor="middle" font-size="15" fill="#007AFF" font-weight="900">Ω</text>
      <text x="14" y="${MID+8}" text-anchor="middle" font-size="8.5" fill="${measCol}" font-weight="800">${fmtR(Rmeas)}</text>

      <!-- R_true path (left-centre) -->
      <line x1="${RT_X}" y1="${CY+CH}" x2="${RT_X}" y2="${MID-22}" stroke="#34C759" stroke-width="2"/>
      <rect x="${RT_X-32}" y="${MID-22}" width="64" height="32"
        rx="7" fill="rgba(52,199,89,.12)" stroke="#34C759" stroke-width="1.8"/>
      <text x="${RT_X}" y="${MID-8}" text-anchor="middle" font-size="9.5" fill="#1a8a3a" font-weight="700">R_true</text>
      <text x="${RT_X}" y="${MID+6}" text-anchor="middle" font-size="9" fill="#1a8a3a">10 MΩ</text>
      <line x1="${RT_X}" y1="${MID+10}" x2="${RT_X}" y2="${PY}" stroke="#34C759" stroke-width="2"/>
      <text x="${RT_X}" y="${PY+PH+13}" text-anchor="middle" font-size="9" fill="#34C759" font-weight="600">Isolation fitting</text>

      <!-- R_soil path (right-centre) -->
      <line x1="${RS_X}" y1="${CY+CH}" x2="${RS_X}" y2="${MID-22}" stroke="${soilCol}" stroke-width="2.5"/>
      <rect x="${RS_X-32}" y="${MID-22}" width="64" height="32"
        rx="7" fill="rgba(255,149,0,.10)" stroke="${soilCol}" stroke-width="1.8"/>
      <text x="${RS_X}" y="${MID-8}" text-anchor="middle" font-size="9.5" fill="${soilCol}" font-weight="700">R_soil</text>
      <text x="${RS_X}" y="${MID+6}" text-anchor="middle" font-size="9" fill="${soilCol}">${fmtR(Rsoil)}</text>
      <line x1="${RS_X}" y1="${MID+10}" x2="${RS_X}" y2="${PY}" stroke="${soilCol}" stroke-width="2.5"/>
      <text x="${RS_X}" y="${PY+PH+13}" text-anchor="middle" font-size="9" fill="${soilCol}" font-weight="600">Soil path</text>

      <!-- Horizontal bus lines on each pipe (show connections across) -->
      <line x1="42" y1="${CY+11}" x2="${RT_X}" y2="${CY+11}" stroke="#888" stroke-width="1" stroke-dasharray="3,2"/>
      <line x1="${RT_X}" y1="${CY+11}" x2="${RS_X}" y2="${CY+11}" stroke="#888" stroke-width="1" stroke-dasharray="3,2"/>
      <line x1="42" y1="${PY+11}" x2="${RT_X}" y2="${PY+11}" stroke="#888" stroke-width="1" stroke-dasharray="3,2"/>
      <line x1="${RT_X}" y1="${PY+11}" x2="${RS_X}" y2="${PY+11}" stroke="#888" stroke-width="1" stroke-dasharray="3,2"/>
    `;
  }

  function update() {
    const v     = parseInt(slider.value);
    const Rsoil = soilR(v);
    const Rmeas = (R_TRUE * Rsoil) / (R_TRUE + Rsoil);

    lbl.textContent = fmtR(Rsoil);
    slider.style.background = `linear-gradient(to right,var(--blue) ${v}%,rgba(0,0,0,.12) ${v}%)`;

    draw(Rsoil, Rmeas);

    const measCol = Rmeas > 1e5 ? 'ok' : Rmeas > 5000 ? 'warn' : 'bad';
    const concl   = Rmeas > 1e5 ? 'Appears isolated'
                  : Rmeas > 5000 ? 'Misleading — soil path'
                  : 'Appears shorted!';
    readRow.innerHTML = `
      <div class="ohm-read-chip">
        <div class="orc-label">True R (Fitting)</div>
        <div class="orc-val ok">10.00 MΩ</div>
      </div>
      <div class="ohm-read-chip">
        <div class="orc-label">Ohmmeter Reads</div>
        <div class="orc-val ${measCol}">${fmtR(Rmeas)}</div>
      </div>
      <div class="ohm-read-chip">
        <div class="orc-label">Verdict</div>
        <div class="orc-val ${measCol}" style="font-size:13px">${concl}</div>
      </div>`;
  }

  slider.addEventListener('input', update);
  update();
})();


/* ── Isolation Fitting Potential Tester ── */
(function initIsoFitTester() {
  const slider    = document.getElementById('isoFitSlider');
  const condLbl   = document.getElementById('isoFitLabel');
  const svg       = document.getElementById('isoFitSvg');
  const statusBox = document.getElementById('isoFitStatus');
  if (!slider || !svg) return;

  const V_CP  = -1050;  /* mV — CP protected side */
  const V_NAT =  -650;  /* mV — natural / unprotected side */

  function update() {
    const q = parseInt(slider.value) / 100;  /* 0=shorted, 1=fully isolated */
    slider.style.background = `linear-gradient(to right,var(--blue) ${slider.value}%,rgba(0,0,0,.12) ${slider.value}%)`;
    condLbl.textContent = Math.round(q * 100) + '% intact';

    /* Potentials converge as q → 0 */
    const vL   = V_CP  + (1 - q) * (V_NAT - V_CP)  * 0.5;
    const vR   = V_NAT + (1 - q) * (V_CP  - V_NAT) * 0.5;
    const diff = Math.abs(vL - vR);

    const W=520, H=165, PY=88, PR=20, PX1=30, PX2=490;
    const MX = (PX1 + PX2) / 2;

    const flangeCol = diff > 100 ? '#34C759' : diff > 30 ? '#FF9500' : '#FF3B30';
    const REA_X=170, REB_X=350, REY=40;

    svg.innerHTML = `
      <defs>
        <linearGradient id="pgL5" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#b8d4f8"/><stop offset="100%" stop-color="#7aabce"/>
        </linearGradient>
        <linearGradient id="pgR5" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#b8c2d4"/><stop offset="100%" stop-color="#8993a6"/>
        </linearGradient>
        <marker id="arL" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="${flangeCol}"/>
        </marker>
        <marker id="arR" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto-start-reverse">
          <path d="M6,0 L6,6 L0,3 z" fill="${flangeCol}"/>
        </marker>
      </defs>

      <!-- Left pipe (CP protected) -->
      <rect x="${PX1}" y="${PY-PR}" width="${MX-PX1-13}" height="${PR*2}"
        rx="${PR}" fill="url(#pgL5)" stroke="#5090c0" stroke-width="1.5"/>
      <text x="${(PX1+MX)/2}" y="${PY+5}" text-anchor="middle"
        font-size="10.5" fill="#1e5cb0" font-weight="700">CP Protected</text>

      <!-- Right pipe (natural) -->
      <rect x="${MX+13}" y="${PY-PR}" width="${PX2-MX-13}" height="${PR*2}"
        rx="${PR}" fill="url(#pgR5)" stroke="#8993a6" stroke-width="1.5"/>
      <text x="${(MX+PX2)/2}" y="${PY+5}" text-anchor="middle"
        font-size="10.5" fill="#666" font-weight="700">Unprotected Side</text>

      <!-- Isolation flange -->
      <rect x="${MX-12}" y="${PY-PR-5}" width="24" height="${PR*2+10}"
        rx="5" fill="${flangeCol}" opacity="${0.2 + q * 0.65}"
        stroke="${flangeCol}" stroke-width="2"/>
      <text x="${MX}" y="${PY+PR+18}" text-anchor="middle"
        font-size="9.5" fill="${flangeCol}" font-weight="700">FLANGE</text>

      <!-- Reference electrode A (left) -->
      <circle cx="${REA_X}" cy="${PY-PR}" r="5" fill="#007AFF" stroke="white" stroke-width="2"/>
      <line x1="${REA_X}" y1="${PY-PR-5}" x2="${REA_X}" y2="${REY+18}"
        stroke="#007AFF" stroke-width="1.5" stroke-dasharray="3,2"/>
      <rect x="${REA_X-32}" y="${REY-14}" width="64" height="22"
        rx="6" fill="rgba(255,255,255,.92)" stroke="#007AFF" stroke-width="1.5"/>
      <text x="${REA_X}" y="${REY-1}" text-anchor="middle"
        font-size="11" fill="#007AFF" font-weight="800">${vL.toFixed(0)} mV</text>

      <!-- Reference electrode B (right) -->
      <circle cx="${REB_X}" cy="${PY-PR}" r="5" fill="#8E8E93" stroke="white" stroke-width="2"/>
      <line x1="${REB_X}" y1="${PY-PR-5}" x2="${REB_X}" y2="${REY+18}"
        stroke="#8E8E93" stroke-width="1.5" stroke-dasharray="3,2"/>
      <rect x="${REB_X-32}" y="${REY-14}" width="64" height="22"
        rx="6" fill="rgba(255,255,255,.92)" stroke="#8E8E93" stroke-width="1.5"/>
      <text x="${REB_X}" y="${REY-1}" text-anchor="middle"
        font-size="11" fill="#555" font-weight="800">${vR.toFixed(0)} mV</text>

      <!-- ΔV arrow + label -->
      <line x1="${REA_X+33}" y1="${REY-3}" x2="${REB_X-33}" y2="${REY-3}"
        stroke="${flangeCol}" stroke-width="1.5"
        marker-end="url(#arL)" marker-start="url(#arR)"/>
      <rect x="${MX-46}" y="${REY-30}" width="92" height="22"
        rx="6" fill="rgba(255,255,255,.92)" stroke="${flangeCol}" stroke-width="1.8"/>
      <text x="${MX}" y="${REY-15}" text-anchor="middle"
        font-size="12" fill="${flangeCol}" font-weight="900">ΔV = ${diff.toFixed(0)} mV</text>
    `;

    let sc, icon, title, body;
    if (diff > 100) {
      sc='ok'; icon='✅'; title='Functional — Isolation Effective';
      body=`ΔV = ${diff.toFixed(0)} mV > 100 mV. The fitting is electrically isolating both sides. CP current is confined to the protected section.`;
    } else if (diff > 30) {
      sc='warn'; icon='⚠️'; title='Suspect — Degraded Isolation';
      body=`ΔV = ${diff.toFixed(0)} mV (30–100 mV range). Isolation may be partially compromised. Further investigation is recommended before accepting this fitting.`;
    } else {
      sc='bad'; icon='❌'; title='Shorted — Isolation Failed';
      body=`ΔV = ${diff.toFixed(0)} mV < 30 mV. Both sides are at nearly the same potential. The fitting has failed — CP current is bleeding across to the unprotected side.`;
    }
    statusBox.innerHTML = `
      <div class="res-status-badge ${sc}">
        <span class="st-icon">${icon}</span>
        <div>
          <div class="st-title">${title}</div>
          <div class="st-body">${body}</div>
        </div>
      </div>`;
  }

  slider.addEventListener('input', update);
  update();
})();


/* ── Diode Test Simulator ── */
(function initDiodeSim() {
  const btnNorm  = document.getElementById('diodeBtnNorm');
  const btnShort = document.getElementById('diodeBtnShort');
  const btnOpen  = document.getElementById('diodeBtnOpen');
  const fwdEl    = document.getElementById('diodeFwdReading');
  const revEl    = document.getElementById('diodeRevReading');
  const fwdUnit  = document.getElementById('diodeFwdUnit');
  const revUnit  = document.getElementById('diodeRevUnit');
  const explain  = document.getElementById('diodeExplain');
  if (!btnNorm || !fwdEl) return;

  const STATES = {
    norm: {
      fwd:'0.65', fwdOl:false, fwdU:'V',
      rev:'OL',   revOl:true,  revU:'Overload — blocked',
      text:'<strong>Normal diode:</strong> Forward bias shows the junction voltage (~0.3–0.9 V for silicon). Reverse bias shows OL (overload) — the diode is blocking current in this direction as intended.'
    },
    short: {
      fwd:'0.000', fwdOl:false, fwdU:'V — near zero',
      rev:'0.000', revOl:false, revU:'V — near zero',
      text:'<strong>Short-circuit failure:</strong> Both directions show near-zero voltage — current flows freely in both directions through the failed junction. The diode is acting as a plain wire. CP current can now flow back through the bond in the wrong direction.'
    },
    open: {
      fwd:'OL', fwdOl:true,  fwdU:'Overload — open',
      rev:'OL', revOl:true,  revU:'Overload — open',
      text:'<strong>Open-circuit failure:</strong> Both directions show OL — no current flows at all. The diode has broken open. It no longer provides any drain-bond function; it behaves as if the bond wire were cut.'
    }
  };

  function setState(key) {
    [btnNorm, btnShort, btnOpen].forEach(b => b.classList.remove('active'));
    if (key === 'norm')  btnNorm.classList.add('active');
    if (key === 'short') btnShort.classList.add('active');
    if (key === 'open')  btnOpen.classList.add('active');

    const s = STATES[key];
    fwdEl.textContent = s.fwd;
    fwdEl.className   = 'meter-reading' + (s.fwdOl ? ' ol' : '');
    fwdUnit.textContent = s.fwdU;

    revEl.textContent = s.rev;
    revEl.className   = 'meter-reading' + (s.revOl ? ' ol' : '');
    revUnit.textContent = s.revU;

    explain.innerHTML = s.text;
  }

  btnNorm.addEventListener('click',  () => setState('norm'));
  btnShort.addEventListener('click', () => setState('short'));
  btnOpen.addEventListener('click',  () => setState('open'));
  setState('norm');
})();


/* ── Section 5 Quiz ── */
buildQuiz('quizS5', [
  {
    q: 'You use an ohmmeter to test casing-to-pipe resistance and read 80 Ω. The isolation fitting is known to be new. What is the most likely explanation?',
    opts: [
      'The fitting has degraded to 80 Ω — it needs immediate replacement',
      'The soil in the annulus provides a parallel path, making a good fitting appear to have low resistance',
      'An ohmmeter reading of 80 Ω is perfectly normal for a new isolation fitting',
      'The ohmmeter leads are reversed — repeat with leads swapped'
    ],
    correct: 1,
    explain: '✅ Correct! Soil in the annular space between casing and carrier pipe acts as a parallel resistance to the fitting. The ohmmeter reads R_true ∥ R_soil ≈ R_soil when soil resistance is much lower than fitting resistance. This is the classic ohmmeter error for casing-to-pipe tests.'
  },
  {
    q: 'An isolation flange separates a CP-protected pipe (−1 050 mV vs CSE) from an unprotected section (−650 mV vs CSE). After several years, you measure a potential difference of only 60 mV across the flange. What is the status?',
    opts: [
      'Functional — 60 mV is well above the 100 mV criterion',
      'Suspect — below the 100 mV criterion; further investigation is needed',
      'Fully shorted — both sides are at identical potential',
      'The criterion does not apply to flanges — only to monolithic joints'
    ],
    correct: 1,
    explain: '✅ Correct! The criterion for an effective isolation fitting is ΔV > 100 mV. At 60 mV the fitting is below this threshold — it is in the "Suspect" range and should be investigated further. It may be partially conducting due to metallic contact or moisture bridging.'
  },
  {
    q: 'During a multimeter diode test on a CP drain-bond diode, the forward bias reads 0.000 V AND the reverse bias also reads 0.000 V. What is the diode condition?',
    opts: [
      'Normal — 0.000 V confirms the diode has zero resistance (good contact)',
      'Open-circuit — no current can flow in either direction',
      'Short-circuit — current flows freely in both directions through the failed device',
      'Over-range — the multimeter needs a higher voltage setting'
    ],
    correct: 2,
    explain: '✅ Correct! When both forward and reverse measurements show near-zero voltage (not OL), the diode has short-circuited. It now conducts in both directions like a plain wire, defeating the purpose of the drain bond. Compare this to an open-circuit failure where both readings show OL.'
  }
], 'resistance measurement');


/* ══════════════════════════════════════════════════════════
   SECTION 6 — SOIL RESISTIVITY
   ══════════════════════════════════════════════════════════ */

/* ── Wenner 4-Pin Simulator ── */
(function initWennerSim() {
  const aSlider   = document.getElementById('wennerA');
  const aLbl      = document.getElementById('wennerALabel');
  const rInput    = document.getElementById('wennerR');
  const rSlider   = document.getElementById('wennerRSlider');
  const svg       = document.getElementById('wennerSvg');
  const resultBox = document.getElementById('wennerResultBox');
  if (!aSlider || !svg) return;

  function fmtRho(rho) {
    if (rho >= 100000) return (rho / 1000).toFixed(0) + ' kΩ·cm';
    if (rho >= 10000)  return (rho / 1000).toFixed(1) + ' kΩ·cm';
    return rho.toFixed(0) + ' Ω·cm';
  }

  function riskInfo(rho) {
    if (rho < 1000)  return {label:'Extremely Corrosive', color:'#FF3B30', bg:'rgba(255,59,48,.12)',  bdr:'rgba(255,59,48,.3)'};
    if (rho < 5000)  return {label:'Corrosive',            color:'#FF9500', bg:'rgba(255,149,0,.12)',  bdr:'rgba(255,149,0,.3)'};
    if (rho < 10000) return {label:'Moderately Corrosive', color:'#c9920a', bg:'rgba(255,214,10,.12)', bdr:'rgba(255,214,10,.4)'};
    if (rho < 30000) return {label:'Mildly Corrosive',     color:'var(--teal)', bg:'rgba(90,200,250,.12)', bdr:'rgba(90,200,250,.35)'};
    return              {label:'Minimally Corrosive',  color:'#34C759', bg:'rgba(52,199,89,.12)',  bdr:'rgba(52,199,89,.3)'};
  }

  function drawSvg(a_m) {
    const W=320, H=230, GY=72, PIN_D=28;
    /* Scale: keep 3a within ~270px; cap spacing at 90px so pins stay visible */
    const a_px = Math.min(a_m * 58, 90);
    const CX   = W / 2;
    const C1x  = CX - 1.5 * a_px, P1x = CX - 0.5 * a_px;
    const P2x  = CX + 0.5 * a_px, C2x = CX + 1.5 * a_px;
    const depth_px = Math.min(a_m * 30, H - GY - 18);
    const hemiW    = 1.5 * a_px;

    svg.innerHTML = `
      <defs>
        <clipPath id="wBG"><rect x="0" y="${GY}" width="${W}" height="${H}"/></clipPath>
        <marker id="wA1" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L0,5 L5,2.5 z" fill="#888"/>
        </marker>
        <marker id="wA2" markerWidth="5" markerHeight="5" refX="1" refY="2.5" orient="auto-start-reverse">
          <path d="M5,0 L5,5 L0,2.5 z" fill="#888"/>
        </marker>
      </defs>

      <!-- Sky -->
      <rect x="0" y="0" width="${W}" height="${GY}" fill="rgba(190,220,255,.18)"/>
      <text x="8" y="${GY-7}" font-size="9" fill="rgba(100,110,140,.55)" font-style="italic">Ground surface</text>

      <!-- Soil -->
      <rect x="0" y="${GY}" width="${W}" height="${H-GY}" fill="rgba(165,125,75,.13)"/>
      <text x="${W-8}" y="${H-8}" text-anchor="end" font-size="9" fill="rgba(130,95,50,.4)" font-style="italic">Soil</text>

      <!-- Ground line -->
      <line x1="0" y1="${GY}" x2="${W}" y2="${GY}" stroke="rgba(100,70,30,.28)" stroke-width="1.5"/>

      <!-- Measurement depth hemisphere -->
      <ellipse cx="${CX}" cy="${GY}" rx="${hemiW}" ry="${depth_px}"
        fill="rgba(0,122,255,.07)" stroke="rgba(0,122,255,.38)"
        stroke-width="1.5" stroke-dasharray="5,3"
        clip-path="url(#wBG)"/>
      <text x="${CX}" y="${GY + depth_px - 5}" text-anchor="middle"
        font-size="9" fill="rgba(0,100,210,.7)" font-weight="600">depth ≈ a = ${a_m.toFixed(2)} m</text>

      <!-- Current flow arc C1→C2 -->
      <path d="M${C1x} ${GY+PIN_D} Q${CX} ${GY+depth_px*1.15} ${C2x} ${GY+PIN_D}"
        fill="none" stroke="rgba(255,149,0,.4)" stroke-width="1.5" stroke-dasharray="5,3"/>

      <!-- Pins -->
      <line x1="${C1x}" y1="${GY}" x2="${C1x}" y2="${GY+PIN_D}" stroke="#FF9500" stroke-width="3"/>
      <circle cx="${C1x}" cy="${GY}" r="6" fill="#FF9500" stroke="white" stroke-width="2"/>
      <text x="${C1x}" y="${GY-10}" text-anchor="middle" font-size="11" fill="#FF9500" font-weight="800">C1</text>

      <line x1="${P1x}" y1="${GY}" x2="${P1x}" y2="${GY+PIN_D}" stroke="#007AFF" stroke-width="2.5"/>
      <circle cx="${P1x}" cy="${GY}" r="5.5" fill="#007AFF" stroke="white" stroke-width="2"/>
      <text x="${P1x}" y="${GY-10}" text-anchor="middle" font-size="11" fill="#007AFF" font-weight="800">P1</text>

      <line x1="${P2x}" y1="${GY}" x2="${P2x}" y2="${GY+PIN_D}" stroke="#007AFF" stroke-width="2.5"/>
      <circle cx="${P2x}" cy="${GY}" r="5.5" fill="#007AFF" stroke="white" stroke-width="2"/>
      <text x="${P2x}" y="${GY-10}" text-anchor="middle" font-size="11" fill="#007AFF" font-weight="800">P2</text>

      <line x1="${C2x}" y1="${GY}" x2="${C2x}" y2="${GY+PIN_D}" stroke="#FF9500" stroke-width="3"/>
      <circle cx="${C2x}" cy="${GY}" r="6" fill="#FF9500" stroke="white" stroke-width="2"/>
      <text x="${C2x}" y="${GY-10}" text-anchor="middle" font-size="11" fill="#FF9500" font-weight="800">C2</text>

      <!-- Spacing dimension arrow -->
      <line x1="${C1x}" y1="${GY+52}" x2="${P1x}" y2="${GY+52}"
        stroke="#aaa" stroke-width="1" marker-end="url(#wA1)" marker-start="url(#wA2)"/>
      <text x="${(C1x+P1x)/2}" y="${GY+65}" text-anchor="middle" font-size="9.5" fill="#888">a</text>

      <!-- Legend -->
      <circle cx="12" cy="${H-28}" r="5" fill="#FF9500"/>
      <text x="22" y="${H-24}" font-size="9" fill="#888">Current (C)</text>
      <circle cx="12" cy="${H-14}" r="5" fill="#007AFF"/>
      <text x="22" y="${H-10}" font-size="9" fill="#888">Potential (P)</text>
    `;
  }

  function pct(v, min, max) { return ((v - min) / (max - min) * 100).toFixed(1); }

  function update() {
    const a_m  = parseFloat(aSlider.value);
    const R    = parseFloat(rInput.value) || 0;
    const a_cm = a_m * 100;
    const rho  = 2 * Math.PI * a_cm * R;

    aLbl.textContent = a_m.toFixed(2) + ' m';
    aSlider.style.background = `linear-gradient(to right,var(--blue) ${pct(a_m,.1,5)}%,rgba(0,0,0,.12) ${pct(a_m,.1,5)}%)`;
    rSlider.style.background = `linear-gradient(to right,var(--blue) ${pct(parseFloat(rSlider.value),.1,200)}%,rgba(0,0,0,.12) ${pct(parseFloat(rSlider.value),.1,200)}%)`;

    const risk = riskInfo(rho);
    resultBox.innerHTML = `
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--text3)">Soil Resistivity  ρ</div>
      <div class="rho-value">${fmtRho(rho)}</div>
      <div class="rho-sub">= ${(rho / 100).toFixed(1)} Ω·m</div>
      <div class="rho-sub">2π × ${a_cm.toFixed(0)} cm × ${R.toFixed(1)} Ω &nbsp;|&nbsp; depth ≈ ${a_m.toFixed(2)} m</div>
      <div style="margin-top:8px">
        <span class="corr-risk-badge" style="color:${risk.color};background:${risk.bg};border-color:${risk.bdr}">
          ● ${risk.label}
        </span>
      </div>`;

    drawSvg(a_m);
  }

  aSlider.addEventListener('input', update);
  rInput.addEventListener('input', () => { rSlider.value = Math.min(parseFloat(rInput.value) || 0, 200); update(); });
  rSlider.addEventListener('input', () => { rInput.value = parseFloat(rSlider.value).toFixed(1); update(); });
  update();
})();


/* ── Soil Layer Effect ── */
(function initLayerEffect() {
  const dSlider = document.getElementById('layerD');
  const dLbl    = document.getElementById('layerDLabel');
  const aSlider = document.getElementById('layerA');
  const aLbl    = document.getElementById('layerALabel');
  const svg     = document.getElementById('layerSvg');
  const readout = document.getElementById('layerReadout');
  if (!dSlider || !svg) return;

  const RHO_TOP  = 500;   /* moist clay — conductive */
  const RHO_DEEP = 8000;  /* dry sand/gravel — resistive */

  function pct(v, min, max) { return ((v - min) / (max - min) * 100).toFixed(1); }

  function update() {
    const D_m = parseFloat(dSlider.value);
    const a_m = parseFloat(aSlider.value);

    dLbl.textContent = D_m.toFixed(1) + ' m';
    aLbl.textContent = a_m.toFixed(1) + ' m';
    dSlider.style.background = `linear-gradient(to right,var(--teal) ${pct(D_m,.3,3)}%,rgba(0,0,0,.12) ${pct(D_m,.3,3)}%)`;
    aSlider.style.background = `linear-gradient(to right,var(--blue) ${pct(a_m,.1,5)}%,rgba(0,0,0,.12) ${pct(a_m,.1,5)}%)`;

    /* Sigmoid mixing: k→0 = top layer dominant, k→1 = deep layer dominant */
    const k       = 1 / (1 + Math.exp(-3 * (a_m / D_m - 1.3)));
    const rhoMeas = RHO_TOP * (1 - k) + RHO_DEEP * k;

    /* SVG layout */
    const W=560, H=195, GY=28;
    const SCALE = (H - GY - 14) / 3.6;  /* px per meter */
    const D_px  = Math.min(D_m * SCALE, H - GY - 14);
    const a_px  = Math.min(a_m * SCALE * 0.55, 108);
    const depth_px = Math.min(a_m * SCALE * 0.52, H - GY - 14);
    const CX = W / 2;
    const C1x = CX - 1.5*a_px, P1x = CX - 0.5*a_px;
    const P2x = CX + 0.5*a_px, C2x = CX + 1.5*a_px;
    const layerBY = GY + D_px;

    svg.innerHTML = `
      <defs>
        <clipPath id="lBG"><rect x="0" y="${GY}" width="${W}" height="${H}"/></clipPath>
      </defs>
      <!-- Top layer (moist clay, orange-brown) -->
      <rect x="0" y="${GY}" width="${W}" height="${D_px}" fill="rgba(190,130,60,.20)"/>
      <text x="10" y="${GY + Math.min(D_px * 0.5, 40) + 4}"
        font-size="11" fill="rgba(130,80,25,.8)" font-weight="700">
        Layer 1  ρ₁ = ${RHO_TOP} Ω·cm  (moist clay)
      </text>

      <!-- Deep layer (dry sand, blue-grey) -->
      ${D_px < H - GY ? `
      <rect x="0" y="${layerBY}" width="${W}" height="${H - layerBY}"
        fill="rgba(90,110,150,.14)"/>
      <text x="10" y="${layerBY + Math.min((H-layerBY)*0.45, 38) + 8}"
        font-size="11" fill="rgba(60,80,120,.7)" font-weight="700">
        Layer 2  ρ₂ = ${RHO_DEEP} Ω·cm  (dry sand)
      </text>
      ` : ''}

      <!-- Layer boundary -->
      <line x1="0" y1="${layerBY}" x2="${W}" y2="${layerBY}"
        stroke="rgba(80,60,30,.35)" stroke-width="1.5" stroke-dasharray="8,5"/>
      <text x="${W - 8}" y="${layerBY - 4}" text-anchor="end"
        font-size="9.5" fill="rgba(80,60,30,.55)">D = ${D_m.toFixed(1)} m</text>

      <!-- Sky / ground surface -->
      <rect x="0" y="0" width="${W}" height="${GY}" fill="rgba(195,220,255,.18)"/>
      <line x1="0" y1="${GY}" x2="${W}" y2="${GY}" stroke="rgba(100,70,30,.28)" stroke-width="1.5"/>

      <!-- Measurement hemisphere -->
      <ellipse cx="${CX}" cy="${GY}" rx="${1.5*a_px}" ry="${depth_px}"
        fill="rgba(0,122,255,.07)" stroke="rgba(0,122,255,.32)"
        stroke-width="1.5" stroke-dasharray="5,3"
        clip-path="url(#lBG)"/>
      <text x="${CX}" y="${GY + depth_px - 5}" text-anchor="middle"
        font-size="9" fill="rgba(0,100,215,.7)">depth ≈ ${a_m.toFixed(1)} m</text>

      <!-- Pins -->
      <line x1="${C1x}" y1="${GY}" x2="${C1x}" y2="${GY+20}" stroke="#FF9500" stroke-width="3"/>
      <circle cx="${C1x}" cy="${GY}" r="5" fill="#FF9500" stroke="white" stroke-width="2"/>
      <text x="${C1x}" y="${GY-6}" text-anchor="middle" font-size="9" fill="#FF9500" font-weight="700">C1</text>

      <line x1="${P1x}" y1="${GY}" x2="${P1x}" y2="${GY+20}" stroke="#007AFF" stroke-width="2.5"/>
      <circle cx="${P1x}" cy="${GY}" r="4.5" fill="#007AFF" stroke="white" stroke-width="2"/>
      <text x="${P1x}" y="${GY-6}" text-anchor="middle" font-size="9" fill="#007AFF" font-weight="700">P1</text>

      <line x1="${P2x}" y1="${GY}" x2="${P2x}" y2="${GY+20}" stroke="#007AFF" stroke-width="2.5"/>
      <circle cx="${P2x}" cy="${GY}" r="4.5" fill="#007AFF" stroke="white" stroke-width="2"/>
      <text x="${P2x}" y="${GY-6}" text-anchor="middle" font-size="9" fill="#007AFF" font-weight="700">P2</text>

      <line x1="${C2x}" y1="${GY}" x2="${C2x}" y2="${GY+20}" stroke="#FF9500" stroke-width="3"/>
      <circle cx="${C2x}" cy="${GY}" r="5" fill="#FF9500" stroke="white" stroke-width="2"/>
      <text x="${C2x}" y="${GY-6}" text-anchor="middle" font-size="9" fill="#FF9500" font-weight="700">C2</text>
    `;

    const dominance = k < 0.25 ? 'Layer 1 only'
                    : k > 0.75 ? 'Layer 2 dominant'
                    : 'Both layers';
    const domColor  = k < 0.25 ? 'rgba(150,90,20,.9)' : k > 0.75 ? 'rgba(60,80,130,.9)' : 'var(--purple)';
    const rhoStr    = rhoMeas >= 1000 ? (rhoMeas/1000).toFixed(1) + ' kΩ·cm' : rhoMeas.toFixed(0) + ' Ω·cm';

    readout.innerHTML = `
      <div class="layer-chip">
        <div class="lc-label">Pin spacing a</div>
        <div class="lc-val">${a_m.toFixed(1)} m</div>
      </div>
      <div class="layer-chip">
        <div class="lc-label">Layer depth D</div>
        <div class="lc-val">${D_m.toFixed(1)} m</div>
      </div>
      <div class="layer-chip">
        <div class="lc-label">Sampling</div>
        <div class="lc-val" style="font-size:13px;color:${domColor}">${dominance}</div>
      </div>
      <div class="layer-chip">
        <div class="lc-label">Approx ρ reading</div>
        <div class="lc-val">${rhoStr}</div>
      </div>`;
  }

  dSlider.addEventListener('input', update);
  aSlider.addEventListener('input', update);
  update();
})();


/* ── Soil Resistivity Factors Chart ── */
(function initFactorsChart() {
  const svgEl    = document.getElementById('factorsSvg');
  const detail   = document.getElementById('factorsDetail');
  const btnSoil  = document.getElementById('ftbSoil');
  const btnMoist = document.getElementById('ftbMoist');
  const btnTemp  = document.getElementById('ftbTemp');
  if (!svgEl || !btnSoil) return;

  const DATA = {
    soil: [
      {label:'Seawater',     rho:15,     detail:'Seawater is highly conductive (ρ ≈ 10–25 Ω·cm). Marine pipelines and structures face extreme corrosion without CP protection.'},
      {label:'Clay',         rho:500,    detail:'Clay retains moisture and has high ionic content. Typical ρ = 100–1 000 Ω·cm — highly corrosive to buried steel.'},
      {label:'Loam/Silt',    rho:2000,   detail:'Mixed organic soil with moderate conductivity. ρ = 1 000–5 000 Ω·cm — corrosive, requires careful CP design.'},
      {label:'Sand',         rho:8000,   detail:'Dry sand has low ionic content. ρ = 5 000–15 000 Ω·cm — moderately corrosive. Moisture greatly shifts this value.'},
      {label:'Sandy Gravel', rho:20000,  detail:'Good drainage reduces conductivity. ρ = 15 000–30 000 Ω·cm — mildly corrosive. CP anodes last longer here.'},
      {label:'Rock',         rho:200000, detail:'Solid rock is a poor conductor. ρ > 100 000 Ω·cm — minimal corrosion risk. Bedrock requires little to no CP.'},
    ],
    moist: [
      {label:'Saturated',    rho:200,    detail:'Fully waterlogged soil maximises ionic conductivity — extremely corrosive. Equivalent to clay-like conditions.'},
      {label:'Moist',        rho:2000,   detail:'Typical subsurface condition after rainfall. ρ ≈ 1 000–5 000 Ω·cm — the most common real-world CP design scenario.'},
      {label:'Damp',         rho:12000,  detail:'Partially dry — moderate conductivity. Seasonal rainfall variation can shift ρ significantly in this range.'},
      {label:'Dry',          rho:50000,  detail:'Low moisture greatly reduces ionic conduction. ρ > 30 000 Ω·cm — minimal risk, but ρ drops sharply after rain.'},
      {label:'Bone Dry',     rho:150000, detail:'Effectively non-conductive — desert or arid conditions. Corrosion rate near zero; CP current barely flows.'},
    ],
    temp: [
      {label:'40°C',         rho:800,    detail:'High temperature increases ionic mobility → lower ρ → more corrosive. Tropical buried pipelines face elevated risk in summer months.'},
      {label:'25°C',         rho:1500,   detail:'Standard reference temperature for soil resistivity. Most NACE corrosion risk classifications are based on 25°C measurements.'},
      {label:'10°C',         rho:4000,   detail:'Cooler temperatures slow ionic movement → higher ρ → reduced corrosion rate. Northern climates benefit in winter.'},
      {label:'0°C',          rho:15000,  detail:'Near-freezing soil sees a sharp ρ increase as ice crystals begin to block ionic pathways in the soil water.'},
      {label:'−5°C (Ice)',   rho:100000, detail:'Frozen soil has extremely high ρ — nearly non-conductive. CP systems may not function effectively in permafrost.'},
    ]
  };

  function barColor(rho) {
    if (rho < 1000)  return '#FF3B30';
    if (rho < 5000)  return '#FF9500';
    if (rho < 10000) return '#c9920a';
    if (rho < 30000) return '#5AC8FA';
    return '#34C759';
  }

  function riskStr(rho) {
    if (rho < 1000)  return {label:'Extremely Corrosive', color:'#FF3B30'};
    if (rho < 5000)  return {label:'Corrosive',            color:'#FF9500'};
    if (rho < 10000) return {label:'Moderately Corrosive', color:'#c9920a'};
    if (rho < 30000) return {label:'Mildly Corrosive',     color:'var(--teal)'};
    return              {label:'Minimally Corrosive',  color:'#34C759'};
  }

  function fmtShort(rho) {
    if (rho >= 100000) return (rho/1000).toFixed(0) + 'k';
    if (rho >= 10000)  return (rho/1000).toFixed(0) + 'k';
    if (rho >= 1000)   return (rho/1000).toFixed(1) + 'k';
    return rho.toString();
  }

  function draw(key) {
    const items = DATA[key];
    const n = items.length;
    const W=560, H=175;
    const X1=36, X2=W-8, Y1=15, Y2=138;
    const CW=X2-X1, CH=Y2-Y1;
    const LOG_MIN=1, LOG_MAX=6.3;
    const logY = r => Y2 - (Math.log10(Math.max(r,1)) - LOG_MIN) / (LOG_MAX - LOG_MIN) * CH;
    const barW = Math.min(CW / n * 0.62, 72);
    const gap  = CW / n;

    let s = '';
    /* Grid lines */
    [10, 100, 1000, 10000, 100000].forEach(v => {
      const y = logY(v);
      if (y >= Y1 && y <= Y2) {
        s += `<line x1="${X1}" y1="${y.toFixed(1)}" x2="${X2}" y2="${y.toFixed(1)}"
                stroke="rgba(0,0,0,.07)" stroke-width="1" stroke-dasharray="3,3"/>
              <text x="${X1-3}" y="${(y+3.5).toFixed(1)}" text-anchor="end"
                font-size="8.5" fill="#bbb">${v>=1000?(v/1000)+'k':v}</text>`;
      }
    });
    /* Y-axis label */
    s += `<text transform="rotate(-90,14,${((Y1+Y2)/2).toFixed(0)})"
            x="14" y="${((Y1+Y2)/2).toFixed(0)}" text-anchor="middle"
            font-size="9" fill="#bbb">ρ (Ω·cm)</text>`;

    /* Bars */
    items.forEach((item, i) => {
      const cx = X1 + (i + 0.5) * gap;
      const bx = cx - barW / 2;
      const y  = logY(item.rho);
      const bh = Y2 - y;
      const col = barColor(item.rho);
      s += `
        <rect class="factor-bar" x="${bx.toFixed(1)}" y="${y.toFixed(1)}"
          width="${barW.toFixed(1)}" height="${bh.toFixed(1)}"
          rx="4" fill="${col}" opacity="0.82"
          data-idx="${i}" data-key="${key}" style="cursor:pointer;transition:opacity .15s"/>
        <text x="${cx.toFixed(1)}" y="${(y - 4).toFixed(1)}" text-anchor="middle"
          font-size="9" fill="${col}" font-weight="700">${fmtShort(item.rho)}</text>
        <text x="${cx.toFixed(1)}" y="${(Y2 + 13).toFixed(1)}" text-anchor="middle"
          font-size="9.5" fill="#666" font-weight="600">${item.label}</text>`;
    });

    svgEl.innerHTML = s;

    svgEl.querySelectorAll('.factor-bar').forEach(bar => {
      bar.addEventListener('click', function () {
        const idx  = parseInt(this.dataset.idx);
        const k    = this.dataset.key;
        const item = DATA[k][idx];
        const r    = riskStr(item.rho);
        const rhoFmt = item.rho >= 10000 ? (item.rho/1000).toFixed(0)+' kΩ·cm'
                     : item.rho >= 1000  ? (item.rho/1000).toFixed(1)+' kΩ·cm'
                     : item.rho + ' Ω·cm';
        detail.innerHTML = `<strong>${item.label}</strong> — ρ ≈ ${rhoFmt} &nbsp;
          <span style="font-weight:700;color:${r.color}">● ${r.label}</span><br>
          <span style="font-size:12.5px">${item.detail}</span>`;
        svgEl.querySelectorAll('.factor-bar').forEach(b => b.style.opacity = '0.5');
        this.style.opacity = '1';
      });
    });

    detail.innerHTML = '<span style="color:var(--text3);font-size:13px">↑ Click any bar to see details</span>';
  }

  function setTab(key, btn) {
    [btnSoil, btnMoist, btnTemp].forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    draw(key);
  }

  btnSoil.addEventListener('click',  () => setTab('soil',  btnSoil));
  btnMoist.addEventListener('click', () => setTab('moist', btnMoist));
  btnTemp.addEventListener('click',  () => setTab('temp',  btnTemp));
  draw('soil');
})();


/* ── Section 6 Quiz ── */
buildQuiz('quizS6', [
  {
    q: 'Using the Wenner 4-pin method, pin spacing a = 2 m and measured resistance R = 8 Ω. What is the soil resistivity ρ?',
    opts: ['50.3 Ω·cm', '1 005 Ω·cm', '10 053 Ω·cm', '100 530 Ω·cm'],
    correct: 2,
    explain: '✅ Correct! ρ = 2π × a(cm) × R = 2π × 200 cm × 8 Ω ≈ 10 053 Ω·cm. This falls in the moderately corrosive range (5 000–10 000 Ω·cm). In SI units: ρ = 2π × 2 m × 8 Ω ≈ 100.5 Ω·m.'
  },
  {
    q: 'A Wenner survey at a = 0.5 m gives ρ = 600 Ω·cm, and at a = 3 m gives ρ = 6 500 Ω·cm. What does this two-layer profile indicate?',
    opts: [
      'The measurements are inconsistent — one must be an error',
      'A conductive top layer (e.g. moist clay) overlies a more resistive deep layer (e.g. dry sand)',
      'A resistive top layer overlies a more conductive deep layer',
      'Both readings represent the same homogeneous soil — the difference is instrument error'
    ],
    correct: 1,
    explain: '✅ Correct! Shallow spacing (0.5 m) samples the top layer only → ρ = 600 Ω·cm (highly conductive, e.g. wet clay). Deeper spacing (3 m) averages both layers → ρ = 6 500 Ω·cm (deep layer is more resistive, pulling the average up). This is a classic two-layer resistivity profile.'
  },
  {
    q: 'Which of the following would cause a Wenner 4-pin measurement to read LOWER than the true soil resistivity?',
    opts: [
      'Measuring on a hot day when soil temperature is elevated',
      'Positioning the pin array directly above a buried metallic pipeline',
      'Using a pin spacing larger than the depth of the soil layer being tested',
      'Measuring after several days of rain when soil is moist'
    ],
    correct: 1,
    explain: '✅ Correct! A buried metallic structure under the pin array provides a low-resistance parallel current path that draws extra current — the measured resistance (and therefore ρ) reads falsely low. This is why ASTM G57 instructs surveyors to position pins away from any known underground metalwork.'
  }
], 'soil resistivity');


/* ============================================================
   SECTION 7 — Special Equipment
   ============================================================ */

/* ── Pipe / Cable Locator Demo ── */
(function initLocatorDemo() {
  const svg    = document.getElementById('locatorSvg');
  const infoRow = document.getElementById('locatorInfoRow');
  const btnCond  = document.getElementById('locBtnCond');
  const btnInd   = document.getElementById('locBtnInd');
  const btnCombo = document.getElementById('locBtnCombo');
  if (!svg || !infoRow) return;

  const W = 520, H = 168;
  const PIPE_Y = 130, PIPE_X1 = 30, PIPE_X2 = 490;
  const SURF_Y = 60;

  function groundPath() {
    return `<line x1="${PIPE_X1}" y1="${SURF_Y}" x2="${PIPE_X2}" y2="${SURF_Y}"
              stroke="rgba(120,100,60,.35)" stroke-width="1.5" stroke-dasharray="4 4"/>
            <rect x="${PIPE_X1}" y="${SURF_Y}" width="${PIPE_X2-PIPE_X1}" height="${H-SURF_Y}"
              fill="rgba(200,170,120,.09)" rx="0"/>
            <text x="38" y="${SURF_Y-8}" font-size="10" fill="rgba(100,80,40,.55)"
              font-family="-apple-system,sans-serif">Ground surface</text>`;
  }
  function pipeEl() {
    return `<rect x="${PIPE_X1+10}" y="${PIPE_Y-9}" width="${PIPE_X2-PIPE_X1-20}" height="18"
              rx="9" fill="#8E8E93" stroke="rgba(0,0,0,.2)" stroke-width="1.5"/>
            <text x="${(PIPE_X1+PIPE_X2)/2}" y="${PIPE_Y+4}" text-anchor="middle"
              font-size="10" fill="#fff" font-weight="700"
              font-family="-apple-system,sans-serif">BURIED PIPE</text>`;
  }

  const MODES = {
    cond: {
      label: 'Conductive',
      draw() {
        const TX_X = 80, TX_Y = 24;
        const RX_X = 340, RX_Y = 24;
        const CONN_X = 170;
        return `
          ${groundPath()}
          <!-- TX box -->
          <rect x="${TX_X-28}" y="${TX_Y-14}" width="56" height="28" rx="6"
            fill="rgba(0,122,255,.15)" stroke="rgba(0,122,255,.5)" stroke-width="1.5"/>
          <text x="${TX_X}" y="${TX_Y+5}" text-anchor="middle" font-size="11" font-weight="700"
            fill="#007AFF" font-family="-apple-system,sans-serif">TX</text>
          <!-- wire from TX to pipe surface -->
          <line x1="${TX_X+28}" y1="${TX_Y}" x2="${CONN_X}" y2="${TX_Y}"
            stroke="#007AFF" stroke-width="2"/>
          <line x1="${CONN_X}" y1="${TX_Y}" x2="${CONN_X}" y2="${PIPE_Y-9}"
            stroke="#007AFF" stroke-width="2" stroke-dasharray="5 3"/>
          <circle cx="${CONN_X}" cy="${PIPE_Y-9}" r="4" fill="#007AFF"/>
          <text x="${CONN_X+6}" y="${SURF_Y+16}" font-size="9.5" fill="#007AFF"
            font-family="-apple-system,sans-serif">direct connection</text>
          <!-- EM field arcs above receiver -->
          ${[18,28,38].map(r=>`<ellipse cx="${RX_X}" cy="${SURF_Y-2}" rx="${r}" ry="${r*0.45}"
            fill="none" stroke="rgba(0,122,255,${0.55-r*0.01})" stroke-width="1.2"
            stroke-dasharray="3 2"/>`).join('')}
          <!-- RX box -->
          <rect x="${RX_X-22}" y="${RX_Y-14}" width="44" height="28" rx="6"
            fill="rgba(52,199,89,.12)" stroke="rgba(52,199,89,.55)" stroke-width="1.5"/>
          <text x="${RX_X}" y="${RX_Y+5}" text-anchor="middle" font-size="11" font-weight="700"
            fill="#34C759" font-family="-apple-system,sans-serif">RX</text>
          ${pipeEl()}
          <!-- signal along pipe -->
          ${[0.2,0.4,0.6,0.8].map(f=>{
            const px = PIPE_X1+10 + f*(PIPE_X2-PIPE_X1-20);
            return `<circle cx="${px}" cy="${PIPE_Y}" r="3" fill="rgba(0,122,255,.55)"/>`;
          }).join('')}`;
      },
      info: [
        { h: 'Signal Method',  p: 'AC signal injected directly onto the pipe via a wired connection.' },
        { h: 'Advantages',     p: 'Stronger signal, greater depth range, more accurate pipe tracing.' },
        { h: 'Limitations',    p: 'Requires physical access to the pipe or a test station terminal.' },
        { h: 'Best Use',       p: 'Cathodic protection test station surveys where connection is easy.' }
      ]
    },

    ind: {
      label: 'Inductive',
      draw() {
        const TX_X = 100, TX_Y = 28;
        const RX_X = 360, RX_Y = 28;
        return `
          ${groundPath()}
          <!-- TX on surface -->
          <rect x="${TX_X-28}" y="${TX_Y-14}" width="56" height="28" rx="6"
            fill="rgba(175,82,222,.12)" stroke="rgba(175,82,222,.55)" stroke-width="1.5"/>
          <text x="${TX_X}" y="${TX_Y+5}" text-anchor="middle" font-size="11" font-weight="700"
            fill="#AF52DE" font-family="-apple-system,sans-serif">TX</text>
          <!-- EM arcs from TX down to pipe -->
          ${[1,2,3].map(i=>`
            <path d="M ${TX_X+28} ${TX_Y}
                     Q ${TX_X+28+i*45} ${(SURF_Y+PIPE_Y)/2}
                       ${(TX_X+PIPE_X1+10+(PIPE_X2-PIPE_X1-20)*0.35)} ${PIPE_Y-9}"
              fill="none" stroke="rgba(175,82,222,${0.55-i*0.1})"
              stroke-width="${2.2-i*0.4}" stroke-dasharray="6 3"/>`).join('')}
          <text x="${TX_X+60}" y="${(SURF_Y+PIPE_Y)/2}" font-size="9.5" fill="#AF52DE"
            font-family="-apple-system,sans-serif">EM induction</text>
          <!-- EM field arcs at RX -->
          ${[16,26,36].map(r=>`<ellipse cx="${RX_X}" cy="${SURF_Y-2}" rx="${r}" ry="${r*0.45}"
            fill="none" stroke="rgba(52,199,89,${0.55-r*0.01})" stroke-width="1.2"
            stroke-dasharray="3 2"/>`).join('')}
          <!-- RX -->
          <rect x="${RX_X-22}" y="${RX_Y-14}" width="44" height="28" rx="6"
            fill="rgba(52,199,89,.12)" stroke="rgba(52,199,89,.55)" stroke-width="1.5"/>
          <text x="${RX_X}" y="${RX_Y+5}" text-anchor="middle" font-size="11" font-weight="700"
            fill="#34C759" font-family="-apple-system,sans-serif">RX</text>
          ${pipeEl()}`;
      },
      info: [
        { h: 'Signal Method',  p: 'Transmitter couples EM energy through the air — no wire connection.' },
        { h: 'Advantages',     p: 'No connection to pipe needed. Fast setup in remote locations.' },
        { h: 'Limitations',    p: 'Weaker induced signal; cross-coupling to nearby metalwork is possible.' },
        { h: 'Best Use',       p: 'Areas without test stations; preliminary route tracing surveys.' }
      ]
    },

    combo: {
      label: 'Combination',
      draw() {
        const TX_X = 100, TX_Y = 28;
        const RX_X = 380, RX_Y = 28;
        const CONN_X = 200;
        return `
          ${groundPath()}
          <!-- TX -->
          <rect x="${TX_X-28}" y="${TX_Y-14}" width="56" height="28" rx="6"
            fill="rgba(255,149,0,.12)" stroke="rgba(255,149,0,.6)" stroke-width="1.5"/>
          <text x="${TX_X}" y="${TX_Y+5}" text-anchor="middle" font-size="11" font-weight="700"
            fill="#FF9500" font-family="-apple-system,sans-serif">TX</text>
          <!-- wire connection -->
          <line x1="${TX_X+28}" y1="${TX_Y}" x2="${CONN_X}" y2="${TX_Y}"
            stroke="#007AFF" stroke-width="1.8"/>
          <line x1="${CONN_X}" y1="${TX_Y}" x2="${CONN_X}" y2="${PIPE_Y-9}"
            stroke="#007AFF" stroke-width="1.8" stroke-dasharray="5 3"/>
          <circle cx="${CONN_X}" cy="${PIPE_Y-9}" r="3.5" fill="#007AFF"/>
          <!-- EM arcs inductive -->
          ${[1,2].map(i=>`
            <path d="M ${TX_X} ${TX_Y+14}
                     Q ${TX_X+i*30} ${(SURF_Y+PIPE_Y)/2+10}
                       ${TX_X+20+i*50} ${PIPE_Y-9}"
              fill="none" stroke="rgba(175,82,222,${0.45-i*0.1})"
              stroke-width="1.5" stroke-dasharray="5 3"/>`).join('')}
          <!-- RX -->
          ${[14,22,30].map(r=>`<ellipse cx="${RX_X}" cy="${SURF_Y-2}" rx="${r}" ry="${r*0.45}"
            fill="none" stroke="rgba(52,199,89,${0.55-r*0.01})" stroke-width="1.2"
            stroke-dasharray="3 2"/>`).join('')}
          <rect x="${RX_X-22}" y="${RX_Y-14}" width="44" height="28" rx="6"
            fill="rgba(52,199,89,.12)" stroke="rgba(52,199,89,.55)" stroke-width="1.5"/>
          <text x="${RX_X}" y="${RX_Y+5}" text-anchor="middle" font-size="11" font-weight="700"
            fill="#34C759" font-family="-apple-system,sans-serif">RX</text>
          ${pipeEl()}
          <text x="${(TX_X+RX_X)/2}" y="${H-6}" text-anchor="middle" font-size="10"
            fill="rgba(100,80,40,.65)" font-family="-apple-system,sans-serif">
            Conductive + Inductive — switchable on the same instrument
          </text>`;
      },
      info: [
        { h: 'Hybrid Instrument', p: 'Same device switches between conductive and inductive modes.' },
        { h: 'Advantages',        p: 'Maximum flexibility — use the best method for each site condition.' },
        { h: 'Conductive mode',   p: 'Preferred when a test station is accessible (stronger signal).' },
        { h: 'Inductive mode',    p: 'Fall back when no connection point exists on-site.' }
      ]
    }
  };

  function setMode(key, activeBtn) {
    [btnCond, btnInd, btnCombo].forEach(b => b.classList.remove('primary'));
    activeBtn.classList.add('primary');
    svg.innerHTML = MODES[key].draw();
    infoRow.innerHTML = MODES[key].info.map(c =>
      `<div class="loc-info-card"><h4>${c.h}</h4><p>${c.p}</p></div>`
    ).join('');
  }

  btnCond.addEventListener('click',  () => setMode('cond',  btnCond));
  btnInd.addEventListener('click',   () => setMode('ind',   btnInd));
  btnCombo.addEventListener('click', () => setMode('combo', btnCombo));
  setMode('cond', btnCond);
})();


/* ── Current Interrupter Timeline ── */
(function initInterrupterTimeline() {
  const canvas   = document.getElementById('interrCanvas');
  const sliderOn = document.getElementById('interrOnTime');
  const labelOn  = document.getElementById('interrOnLabel');
  const statusEl = document.getElementById('interrStatus');
  const btnPlay  = document.getElementById('interrPlay');
  const btnReset = document.getElementById('interrReset');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const CW = canvas.width, CH = canvas.height;

  /* potential levels (mV) */
  const V_ON   = -960;
  const V_IOFF = -880;
  const V_NAT  = -800;

  /* chart geometry */
  const PAD_L = 52, PAD_R = 18, PAD_T = 18, PAD_B = 38;
  const GW = CW - PAD_L - PAD_R;
  const GH = CH - PAD_T - PAD_B;
  const V_MIN = -1000, V_MAX = -740;

  function vToY(mv) {
    return PAD_T + (1 - (mv - V_MIN) / (V_MAX - V_MIN)) * GH;
  }
  function tToX(t, totalDur) {
    return PAD_L + (t / totalDur) * GW;
  }

  /* animation state */
  let raf = null, startTime = null, pausedAt = null, playing = false;
  const SPEED = 2.5;
  const OFF_DUR = 1.5;
  const NCYCLES = 3;

  function getOnDur() { return parseFloat(sliderOn.value); }
  function totalDur() { return (getOnDur() + OFF_DUR) * NCYCLES; }

  /* segment model — generates waveform break-points for one cycle */
  function cycleSegments(tStart, onDur) {
    const tOff = tStart + onDur;
    const tEnd = tOff + OFF_DUR;
    return [
      { t0: tStart,        t1: tOff - 0.01, v0: V_ON,  v1: V_ON,  type: 'on' },
      { t0: tOff - 0.01,   t1: tOff + 0.04, v0: V_ON,  v1: V_IOFF,type: 'switch' },
      { t0: tOff + 0.04,   t1: tOff + 0.15, v0: V_IOFF,v1: V_IOFF,type: 'ioff' },
      { t0: tOff + 0.15,   t1: tEnd,        v0: V_IOFF,v1: V_NAT,  type: 'depol' },
    ];
  }
  function allSegments() {
    const onDur = getOnDur();
    const cycle = onDur + OFF_DUR;
    let segs = [];
    for (let i = 0; i < NCYCLES; i++) {
      segs = segs.concat(cycleSegments(i * cycle, onDur));
    }
    return segs;
  }

  function drawGrid() {
    ctx.clearRect(0, 0, CW, CH);
    ctx.fillStyle = 'rgba(28,28,30,.04)';
    ctx.fillRect(PAD_L, PAD_T, GW, GH);

    /* grid lines & V labels */
    [-1000,-960,-920,-880,-840,-800,-760].forEach(mv => {
      const y = vToY(mv);
      ctx.strokeStyle = 'rgba(0,0,0,.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3,4]);
      ctx.beginPath(); ctx.moveTo(PAD_L, y); ctx.lineTo(PAD_L + GW, y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(60,60,67,.7)';
      ctx.font = '10px -apple-system,sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(mv + ' mV', PAD_L - 4, y + 4);
    });

    /* axes */
    ctx.strokeStyle = 'rgba(0,0,0,.2)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(PAD_L, PAD_T); ctx.lineTo(PAD_L, PAD_T + GH);
    ctx.lineTo(PAD_L + GW, PAD_T + GH);
    ctx.stroke();
  }

  function drawWaveform(elapsed) {
    const dur = totalDur();
    const t = Math.min(elapsed * SPEED, dur);
    const segs = allSegments();

    ctx.strokeStyle = '#007AFF';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    let started = false;

    segs.forEach(seg => {
      if (seg.t0 >= t) return;
      const segT = Math.min(t, seg.t1);
      const frac = (segT - seg.t0) / (seg.t1 - seg.t0);
      const vCur = seg.v0 + frac * (seg.v1 - seg.v0);
      const x0 = tToX(seg.t0, dur);
      const x1 = tToX(segT,  dur);
      const y0 = vToY(seg.v0);
      const y1 = vToY(vCur);
      if (!started) { ctx.moveTo(x0, y0); started = true; }
      if (seg.type === 'switch') {
        ctx.lineTo(x0, y0); ctx.lineTo(x0, vToY(V_IOFF));
      }
      ctx.lineTo(x1, y1);
    });
    ctx.stroke();

    /* labels for first cycle */
    const onDur = getOnDur();
    const cycle = onDur + OFF_DUR;
    if (t > 0.5) {
      ctx.fillStyle = '#007AFF';
      ctx.font = '10px -apple-system,sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ON potential', tToX(onDur * 0.4, dur), vToY(V_ON) - 8);
    }
    if (t > onDur + 0.12) {
      ctx.fillStyle = '#FF3B30';
      ctx.font = 'bold 10px -apple-system,sans-serif';
      ctx.textAlign = 'center';
      const xIoff = tToX(onDur + 0.08, dur);
      ctx.fillText('← Instant-off', xIoff + 42, vToY(V_IOFF) - 8);
    }
    if (t > onDur + 0.4) {
      ctx.fillStyle = '#FF9500';
      ctx.font = '9.5px -apple-system,sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Depolarising…', tToX(onDur + 0.3, dur), vToY((V_IOFF + V_NAT) / 2) - 8);
    }

    /* horizontal reference lines */
    [[V_IOFF,'#FF3B30','Instant-off'],[V_NAT,'#FF9500','Natural']].forEach(([mv,col,lbl]) => {
      const y = vToY(mv);
      ctx.strokeStyle = col + '55';
      ctx.lineWidth = 1;
      ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(PAD_L, y); ctx.lineTo(PAD_L + GW, y); ctx.stroke();
      ctx.setLineDash([]);
    });
  }

  function frame(ts) {
    if (startTime === null) startTime = ts;
    const elapsed = (ts - startTime) / 1000;
    const dur = totalDur() / SPEED;
    drawGrid();
    drawWaveform(elapsed);
    if (elapsed < dur) {
      const pct = Math.round(elapsed / dur * 100);
      statusEl.textContent = `Playing… ${pct}%`;
      raf = requestAnimationFrame(frame);
    } else {
      statusEl.textContent = 'Complete — press Reset to replay';
      btnPlay.textContent = '▶ Play';
      playing = false;
    }
  }

  function play() {
    if (playing) {
      /* pause */
      cancelAnimationFrame(raf);
      pausedAt = performance.now() - startTime;
      playing = false;
      btnPlay.textContent = '▶ Resume';
      statusEl.textContent = 'Paused';
    } else {
      playing = true;
      btnPlay.textContent = '⏸ Pause';
      if (pausedAt !== null) {
        startTime = performance.now() - pausedAt;
        pausedAt = null;
      } else {
        startTime = null;
      }
      raf = requestAnimationFrame(frame);
    }
  }

  function reset() {
    cancelAnimationFrame(raf);
    playing = false; startTime = null; pausedAt = null;
    btnPlay.textContent = '▶ Play';
    statusEl.textContent = 'Ready — press Play';
    drawGrid();
  }

  sliderOn.addEventListener('input', () => {
    labelOn.textContent = parseFloat(sliderOn.value).toFixed(1) + ' s';
    reset();
  });
  btnPlay.addEventListener('click', play);
  btnReset.addEventListener('click', reset);
  drawGrid();
})();


/* ── Coupon Station Explorer ── */
(function initCouponExplorer() {
  const svg        = document.getElementById('couponSvg');
  const readingsEl = document.getElementById('couponReadings');
  const btnConn    = document.getElementById('couponBtnConn');
  const btnDisc    = document.getElementById('couponBtnDisc');
  if (!svg || !readingsEl) return;

  const W = 540, H = 192;
  /* layout constants */
  const SURF_Y = 52;
  const PIPE_CY = 148, PIPE_CX = 195, PIPE_RX = 54, PIPE_RY = 14;
  const COUP_CX = 340, COUP_Y1 = 108, COUP_Y2 = 136;
  const BOX_X = 420, BOX_Y = 22, BOX_W = 96, BOX_H = 44;
  const LEAD_TOP_X = COUP_CX, LEAD_TOP_Y = COUP_Y1;
  const SW_X = COUP_CX, SW_Y1 = 72, SW_Y2 = SURF_Y + 8;
  const BOX_PORT_X = BOX_X, BOX_PORT_Y = BOX_Y + BOX_H / 2;

  function base() {
    return `
      <!-- sky -->
      <rect x="0" y="0" width="${W}" height="${SURF_Y}" fill="rgba(173,216,230,.25)" rx="8"/>
      <!-- ground -->
      <rect x="0" y="${SURF_Y}" width="${W}" height="${H - SURF_Y}" fill="rgba(200,170,120,.18)" rx="8"/>
      <!-- surface line -->
      <line x1="0" y1="${SURF_Y}" x2="${W}" y2="${SURF_Y}"
        stroke="rgba(120,90,40,.4)" stroke-width="1.5" stroke-dasharray="6 4"/>
      <text x="10" y="${SURF_Y - 8}" font-size="10" fill="rgba(90,80,60,.7)"
        font-family="-apple-system,sans-serif">Ground surface</text>

      <!-- buried pipe -->
      <ellipse cx="${PIPE_CX}" cy="${PIPE_CY}" rx="${PIPE_RX}" ry="${PIPE_RY}"
        fill="#8E8E93" stroke="rgba(0,0,0,.25)" stroke-width="2"/>
      <text x="${PIPE_CX}" y="${PIPE_CY + 4}" text-anchor="middle" font-size="10"
        font-weight="700" fill="#fff" font-family="-apple-system,sans-serif">PIPE</text>

      <!-- coupon plate -->
      <rect x="${COUP_CX - 22}" y="${COUP_Y1}" width="44" height="${COUP_Y2 - COUP_Y1}"
        rx="4" fill="rgba(142,142,147,.65)" stroke="rgba(0,0,0,.22)" stroke-width="1.8"/>
      <text x="${COUP_CX}" y="${(COUP_Y1 + COUP_Y2) / 2 + 4}" text-anchor="middle"
        font-size="9" font-weight="700" fill="#fff" font-family="-apple-system,sans-serif">COUPON</text>

      <!-- test station box -->
      <rect x="${BOX_X}" y="${BOX_Y}" width="${BOX_W}" height="${BOX_H}"
        rx="6" fill="rgba(255,255,255,.7)" stroke="rgba(0,122,255,.4)" stroke-width="1.8"/>
      <text x="${BOX_X + BOX_W / 2}" y="${BOX_Y + 16}" text-anchor="middle"
        font-size="10" font-weight="700" fill="#007AFF" font-family="-apple-system,sans-serif">Test</text>
      <text x="${BOX_X + BOX_W / 2}" y="${BOX_Y + 30}" text-anchor="middle"
        font-size="10" font-weight="700" fill="#007AFF" font-family="-apple-system,sans-serif">Station</text>
    `;
  }

  function connected() {
    return base() + `
      <!-- lead wire coupon to surface (solid green = connected) -->
      <line x1="${LEAD_TOP_X}" y1="${LEAD_TOP_Y}"
            x2="${SW_X}" y2="${SW_Y1}"
        stroke="#34C759" stroke-width="2.2"/>
      <!-- switch closed -->
      <line x1="${SW_X}" y1="${SW_Y1}" x2="${SW_X}" y2="${SW_Y2}"
        stroke="#34C759" stroke-width="2.2"/>
      <circle cx="${SW_X}" cy="${SW_Y1}" r="5" fill="#34C759"/>
      <circle cx="${SW_X}" cy="${SW_Y2}" r="5" fill="#34C759"/>
      <text x="${SW_X + 10}" y="${SW_Y1 + 4}" font-size="9.5" fill="#34C759"
        font-weight="700" font-family="-apple-system,sans-serif">CLOSED</text>
      <!-- wire to box -->
      <line x1="${SW_X}" y1="${SW_Y2}"
            x2="${BOX_PORT_X}" y2="${BOX_PORT_Y}"
        stroke="#34C759" stroke-width="2.2"/>
      <!-- CP current arrows along coupon lead (connected only) -->
      ${[0.3,0.55,0.78].map(f => {
        const ay = LEAD_TOP_Y + f * (SW_Y2 - LEAD_TOP_Y);
        return `<text x="${LEAD_TOP_X + 14}" y="${ay + 4}" font-size="12"
          fill="rgba(0,122,255,.8)" font-family="-apple-system,sans-serif">↑</text>`;
      }).join('')}
      <!-- label -->
      <text x="${PIPE_CX}" y="${PIPE_CY + PIPE_RY + 14}" text-anchor="middle"
        font-size="9.5" fill="rgba(52,199,89,.9)" font-weight="700"
        font-family="-apple-system,sans-serif">CP current → coupon</text>
    `;
  }

  function disconnected() {
    return base() + `
      <!-- wire coupon to SW_Y1 -->
      <line x1="${LEAD_TOP_X}" y1="${LEAD_TOP_Y}"
            x2="${SW_X}" y2="${SW_Y1}"
        stroke="#8E8E93" stroke-width="2.2"/>
      <!-- switch open — angled gap -->
      <line x1="${SW_X}" y1="${SW_Y1}"
            x2="${SW_X + 14}" y2="${SW_Y1 - 18}"
        stroke="#FF3B30" stroke-width="2.2"/>
      <circle cx="${SW_X}" cy="${SW_Y1}" r="5" fill="#FF3B30"/>
      <circle cx="${SW_X}" cy="${SW_Y2}" r="5" fill="#8E8E93"/>
      <text x="${SW_X + 18}" y="${SW_Y1 - 10}" font-size="9.5" fill="#FF3B30"
        font-weight="700" font-family="-apple-system,sans-serif">OPEN</text>
      <!-- wire from SW_Y2 to box — grey (no current) -->
      <line x1="${SW_X}" y1="${SW_Y2}"
            x2="${BOX_PORT_X}" y2="${BOX_PORT_Y}"
        stroke="#8E8E93" stroke-width="2.2" stroke-dasharray="5 3"/>
      <!-- label -->
      <text x="${PIPE_CX}" y="${PIPE_CY + PIPE_RY + 14}" text-anchor="middle"
        font-size="9.5" fill="rgba(142,142,147,.9)" font-weight="700"
        font-family="-apple-system,sans-serif">Circuit open — no pickup current</text>
    `;
  }

  const STATES = {
    conn: {
      svgFn: connected,
      chips: [
        { label: 'Coupon Potential', val: '−870 mV', color: 'var(--green)',  status: 'ON (w/ IR drop)' },
        { label: 'Pickup Current',   val: '+2.3 mA', color: 'var(--blue)',   status: 'CP Active' },
        { label: 'Protection',       val: '✓ Active', color: 'var(--green)', status: 'Protected' }
      ]
    },
    disc: {
      svgFn: disconnected,
      chips: [
        { label: 'Coupon Potential', val: '−750 mV', color: 'var(--orange)', status: 'Instant-off (IR-free)' },
        { label: 'Pickup Current',   val: '0.0 mA',  color: 'var(--gray)',   status: 'Open circuit' },
        { label: 'Measurement',      val: 'True P/S', color: 'var(--blue)',  status: 'IR-drop free' }
      ]
    }
  };

  function setState(key, activeBtn) {
    [btnConn, btnDisc].forEach(b => b.classList.remove('primary'));
    activeBtn.classList.add('primary');
    svg.innerHTML = STATES[key].svgFn();
    readingsEl.innerHTML = STATES[key].chips.map(c => `
      <div class="coupon-chip">
        <div class="cc-label">${c.label}</div>
        <div class="cc-val" style="color:${c.color}">${c.val}</div>
        <div class="cc-status">${c.status}</div>
      </div>`).join('');
  }

  btnConn.addEventListener('click', () => setState('conn', btnConn));
  btnDisc.addEventListener('click', () => setState('disc', btnDisc));
  setState('conn', btnConn);
})();


/* ── Section 7 Quiz ── */
buildQuiz('quizS7', [
  {
    q: 'A technician needs to locate a buried pipeline in a remote field location where there is no test station or any accessible pipe connection point. Which locator method should they use?',
    opts: [
      'Conductive — inject the signal directly onto the pipe',
      'Inductive — couple the EM signal through the air without a connection',
      'Shunt method — measure resistance across the pipe span',
      'Wenner 4-pin — map the pipe by soil resistivity contrast'
    ],
    correct: 1,
    explain: '✅ Correct! The inductive method requires no direct electrical connection to the pipe. The transmitter is placed on the ground surface and couples an AC electromagnetic signal onto the pipe through inductive coupling — ideal when no test station is accessible. The conductive method gives a stronger, more accurate signal but needs a wired connection.'
  },
  {
    q: 'During a CIPS survey with a current interrupter installed, the rectifier switches OFF. When should the "instant-off" potential be recorded?',
    opts: [
      'After waiting 2–3 seconds for the reading to stabilise',
      'Immediately at the moment the current is interrupted — before depolarisation begins',
      'During the ON phase, just before the interrupter opens the circuit',
      'After the full OFF period is complete, just before the current comes back ON'
    ],
    correct: 1,
    explain: '✅ Correct! The instant-off potential must be recorded immediately after current interruption — typically within 0.1 s. This reading captures the pipe-to-electrolyte potential before depolarisation can occur. Waiting even a second allows the electrode to depolarise toward the natural corrosion potential, giving a falsely optimistic (less negative) reading. The interrupter ensures all operators along the pipeline record this value at exactly the same instant.'
  },
  {
    q: 'A coupon is retrieved from a test station in a disconnected state. Which TWO pieces of information can be obtained that are NOT available from a standard pipe-to-soil potential reading at a test station post?',
    opts: [
      'The ON potential and the rectifier output voltage',
      'The IR-free (instant-off) pipe potential and a direct corrosion rate from the coupon weight loss',
      'The soil resistivity at the coupon depth and the anode output current',
      'The coating holiday density and the pH of the surrounding electrolyte'
    ],
    correct: 1,
    explain: '✅ Correct! When disconnected, the coupon reads the IR-free (instant-off) potential — equivalent to breaking the circuit at the pipe surface, without the IR error caused by current flow through soil resistance. Additionally, retrieving the coupon and weighing it gives a direct corrosion rate measurement (weight loss method, expressed in mils per year or mm/year) — something no electronic measurement can provide.'
  }
], 'special equipment');
