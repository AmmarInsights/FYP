/* app.js — Renders all sections from DATA, wires up navbar & interactions */

// ── Navbar ────────────────────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });

  hamburger.addEventListener('click', () => {
    mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
    mobileMenu.style.flexDirection = 'column';
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 80) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  // Close mobile on link click
  document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => { mobileMenu.style.display = 'none'; });
  });
}

// ── Hero floating tech badges ─────────────────────────────────────────────
function renderHeroFloatBadges() {
  const techs = [
    { label:'QKD',  x:'8%',  y:'22%', color:'#0ba5ec', delay:0    },
    { label:'PQC',  x:'84%', y:'18%', color:'#d946ef', delay:0.5  },
    { label:'VQC',  x:'5%',  y:'68%', color:'#22c55e', delay:1.0  },
    { label:'ZTSA', x:'87%', y:'63%', color:'#f97316', delay:1.5  },
    { label:'QML',  x:'44%', y:'88%', color:'#36bffa', delay:0.3  },
    { label:'QFL',  x:'72%', y:'80%', color:'#a855f7', delay:0.8  },
  ];
  const hero = document.getElementById('hero');
  techs.forEach((t, i) => {
    const el = document.createElement('div');
    el.className = 'float-tech';
    el.textContent = t.label;
    el.style.cssText = `left:${t.x};top:${t.y};color:${t.color};border:1px solid ${t.color}55;background:${t.color}18;animation-delay:${t.delay}s;animation-duration:${5 + i * 0.6}s`;
    hero.appendChild(el);
  });
}

// ── KPI Cards ─────────────────────────────────────────────────────────────
function renderKPICards() {
  const k = DATA.systemKPIs;
  const cards = [
    { icon:'📡', val: k.detectionRate, lbl:'Detection Rate', color:'#36bffa' },
    { icon:'⚡', val: k.avgLatency,    lbl:'Avg Latency',    color:'#22c55e' },
    { icon:'🛡', val: k.totalDevices,  lbl:'IoT Devices',    color:'#d946ef' },
    { icon:'🔒', val: k.uptime,        lbl:'Uptime',         color:'#f97316' },
  ];
  const grid = document.getElementById('kpi-grid');
  grid.innerHTML = cards.map(c => `
    <div class="kpi-card card" style="border-color:${c.color}30;background:${c.color}10">
      <div class="kpi-icon">${c.icon}</div>
      <div class="kpi-val" style="color:${c.color}">${c.val}</div>
      <div class="kpi-lbl">${c.lbl}</div>
    </div>`).join('');
}

// ── Model Table ───────────────────────────────────────────────────────────
function renderModelTable() {
  const tbody = document.getElementById('model-tbody');
  if (!tbody) return;
  const best = Math.max(...DATA.modelMetrics.map(m => m.accuracy));
  tbody.innerHTML = DATA.modelMetrics.map(m => {
    const isBest = m.accuracy === best;
    const typeCls = `type-${m.type}`;
    return `<tr>
      <td class="${isBest?'text-white font-bold':''}" style="white-space:nowrap">${m.model}</td>
      <td><span class="badge ${typeCls}" style="font-size:.6rem">${m.type}</span></td>
      <td class="${isBest?'best':''}">${(m.accuracy*100).toFixed(2)}%</td>
      <td>${(m.balanced_acc*100).toFixed(2)}%</td>
      <td>${m.mcc.toFixed(4)}</td>
      <td class="${isBest?'best':''}">${m.f1_macro.toFixed(4)}</td>
      <td>${m.f1_weighted.toFixed(4)}</td>
      <td>${m.roc_auc.toFixed(4)}</td>
      <td>${m.pr_auc.toFixed(4)}</td>
      <td>${m.train_time.toFixed(2)}s</td>
      <td>${(m.infer_time*1000).toFixed(1)}ms</td>
    </tr>`;
  }).join('');
}

// ── K-Fold Table ──────────────────────────────────────────────────────────
function renderKFoldTable() {
  const tbody = document.getElementById('kfold-tbody');
  if (!tbody) return;
  tbody.innerHTML = DATA.kfoldResults.map(r => {
    const varLbl = r.std_f1 < 0.005 ? 'Low' : r.std_f1 < 0.008 ? 'Med' : 'High';
    const barW = Math.round((1 - r.std_f1 / 0.015) * 100);
    return `<tr>
      <td class="text-white font-bold" style="white-space:nowrap">${r.model}</td>
      <td class="text-green">${r.mean_f1.toFixed(4)}</td>
      <td>±${r.std_f1.toFixed(4)}</td>
      <td>${r.mean_acc.toFixed(4)}</td>
      <td>±${r.std_acc.toFixed(4)}</td>
      <td>
        <div class="pbar-wrap">
          <div class="pbar"><div class="pbar-fill" style="width:${barW}%"></div></div>
          <span style="font-size:.65rem;color:#7cd4fd;white-space:nowrap">${varLbl}</span>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ── Per-class Table ───────────────────────────────────────────────────────
function renderPerClassTable() {
  const tbody = document.getElementById('perclass-tbody');
  if (!tbody) return;
  const totalSupport = DATA.perClassMetrics.reduce((a,m)=>a+m.support,0);
  const avgP = DATA.perClassMetrics.reduce((a,m)=>a+m.precision,0)/DATA.perClassMetrics.length;
  const avgR = DATA.perClassMetrics.reduce((a,m)=>a+m.recall,0)/DATA.perClassMetrics.length;
  const avgF = DATA.perClassMetrics.reduce((a,m)=>a+m.f1,0)/DATA.perClassMetrics.length;
  const rows = DATA.perClassMetrics.map(m => `<tr>
    <td class="text-white font-bold">${m.cls}</td>
    <td>
      <div class="pbar-wrap">
        <div class="pbar" style="width:80px"><div class="pbar-fill" style="width:${m.precision*100}%"></div></div>
        <span>${(m.precision*100).toFixed(1)}%</span>
      </div>
    </td>
    <td>${(m.recall*100).toFixed(1)}%</td>
    <td class="${m.f1>=0.95?'text-green font-bold':''}">${(m.f1*100).toFixed(1)}%</td>
    <td style="color:#7cd4fd">${m.support}</td>
  </tr>`).join('');
  tbody.innerHTML = rows + `<tr style="border-top:1px solid rgba(11,165,236,.3)">
    <td class="text-green font-bold">Macro Avg</td>
    <td class="text-green font-bold">${(avgP*100).toFixed(1)}%</td>
    <td class="text-green font-bold">${(avgR*100).toFixed(1)}%</td>
    <td class="text-green font-bold">${(avgF*100).toFixed(1)}%</td>
    <td style="color:#7cd4fd">${totalSupport}</td>
  </tr>`;
}

// ── Class Distribution Legend ─────────────────────────────────────────────
function renderClassLegend() {
  const el = document.getElementById('class-legend');
  if (!el) return;
  el.innerHTML = DATA.classDistribution.map(d => `
    <div class="legend-item">
      <div class="legend-dot" style="background:${d.color}"></div>
      <span class="legend-lbl">${d.label} <span style="color:${d.color}">${d.pct}%</span></span>
    </div>`).join('');
}

// ── System KPI summary ────────────────────────────────────────────────────
function renderSystemKPIGrid() {
  const el = document.getElementById('kpi-summary');
  if (!el) return;
  const items = [
    { lbl:'Total IoT Devices',  val:'1,247'  },
    { lbl:'Active Threats',     val:'3'      },
    { lbl:'Detection Rate',     val:'97.34%' },
    { lbl:'Avg Latency',        val:'24ms'   },
    { lbl:'QKD Sessions',       val:'89'     },
    { lbl:'System Uptime',      val:'99.97%' },
    { lbl:'False Positive',     val:'0.31%'  },
    { lbl:'Trust Score',        val:'92.3%'  },
  ];
  el.innerHTML = items.map(i => `
    <div style="text-align:center">
      <div class="metric-value">${i.val}</div>
      <div class="label-sm" style="margin-top:4px">${i.lbl}</div>
    </div>`).join('');
}

// ── Architecture layers ───────────────────────────────────────────────────
function renderArchLayers() {
  const el = document.getElementById('arch-layers');
  if (!el) return;
  const layers = [
    { num:1, name:'IoT Device Layer',         icon:'📡', color:'#36bffa',
      desc:'Heterogeneous IoT devices with quantum-enabled edge security modules',
      comps:['Smart Sensors','Edge Nodes','QKD Endpoints','NISQ Chips'] },
    { num:2, name:'Fog / Edge Layer',          icon:'🖥', color:'#22c55e',
      desc:'Fog nodes running quantum circuit inference with error mitigation',
      comps:['VQC Classifier','QAE Autoencoder','ZNE Mitigation','QRL Agent'] },
    { num:3, name:'Zero-Trust Orchestration',  icon:'🛡', color:'#d946ef',
      desc:'Adaptive zero-trust policies enforced via Quantum Bayesian Inference',
      comps:['QBI Engine','Trust Scorer','Policy Manager','QHE Module'] },
    { num:4, name:'Cloud / Quantum Backend',   icon:'⚛', color:'#f97316',
      desc:'Quantum cloud resources for heavy computations and federated aggregation',
      comps:['IBM Quantum Cloud','PQC Vault','QFL Aggregator','QAOA Optimizer'] },
  ];
  el.innerHTML = layers.map(l => `
    <div class="arch-layer" style="border-color:${l.color}30;background:${l.color}08">
      <div class="arch-layer-icon" style="background:${l.color}20;border:1px solid ${l.color}40">${l.icon}</div>
      <div style="font-family:var(--font-mono);font-size:.65rem;font-weight:700;color:${l.color};margin-bottom:6px">Layer ${l.num}</div>
      <h3>${l.name}</h3>
      <p>${l.desc}</p>
      ${l.comps.map(c=>`
        <div class="arch-comp" style="background:${l.color}12">
          <div class="arch-comp-dot" style="background:${l.color}"></div>
          <span style="color:${l.color}cc">${c}</span>
        </div>`).join('')}
    </div>`).join('');
}

// ── Tech stack ────────────────────────────────────────────────────────────
function renderTechStack() {
  const el = document.getElementById('tech-grid');
  if (!el) return;
  const techs = [
    { name:'PennyLane',      cat:'Quantum SDK',  color:'#0ba5ec' },
    { name:'Qiskit',         cat:'Quantum SDK',  color:'#0ba5ec' },
    { name:'PyTorch',        cat:'Classical AI', color:'#f97316' },
    { name:'Scikit-learn',   cat:'Classical AI', color:'#f97316' },
    { name:'IBM Quantum',    cat:'Cloud',        color:'#a855f7' },
    { name:'Google Colab',   cat:'Cloud',        color:'#a855f7' },
    { name:'QAOA',           cat:'Optimization', color:'#22c55e' },
    { name:"Grover's Algo",  cat:'Optimization', color:'#22c55e' },
    { name:'XGBoost',        cat:'ML Model',     color:'#eab308' },
    { name:'Random Forest',  cat:'ML Model',     color:'#eab308' },
    { name:'QKD BB84',       cat:'Security',     color:'#ef4444' },
    { name:'Post-Quantum',   cat:'Security',     color:'#ef4444' },
  ];
  el.innerHTML = techs.map(t=>`
    <div class="tech-item card" style="border-color:${t.color}25;background:${t.color}0a">
      <div class="tech-name" style="color:${t.color}">${t.name}</div>
      <div class="tech-cat" style="color:${t.color}">${t.cat}</div>
    </div>`).join('');
}

// ── Achievement Cards ─────────────────────────────────────────────────────
function renderAchievements() {
  const el = document.getElementById('ach-cards');
  if (!el) return;
  const cards = [
    { icon:'📈', color:'#36bffa', val:'97.34%', title:'Best Detection Rate',
      desc:'Hybrid Q-Classical model surpasses all classical baselines by 2.1–5.0%' },
    { icon:'⚡', color:'#22c55e', val:'33% ↓',  title:'Latency Reduction',
      desc:'Quantum-enhanced security modules reduce average response latency vs. classical' },
    { icon:'✅', color:'#d946ef', val:'+8.1%',  title:'QEM Improvement',
      desc:'Combined ZNE + Readout Correction improves VQC accuracy on 10-qubit circuits' },
    { icon:'🎯', color:'#f97316', val:'0.31%',  title:'False Positive Rate',
      desc:'QBI-driven trust scoring reduces false positive alerts in zero-trust policy engine' },
  ];
  el.innerHTML = cards.map(c=>`
    <div class="ach-card" style="border-color:${c.color}30;background:${c.color}0a">
      <div class="ach-icon">${c.icon}</div>
      <div class="ach-value" style="color:${c.color}">${c.val}</div>
      <div class="ach-title">${c.title}</div>
      <div class="ach-desc">${c.desc}</div>
    </div>`).join('');
}

// ── Research sections ─────────────────────────────────────────────────────
function renderResearch() {
  const rqEl = document.getElementById('rq-cards');
  if (rqEl) {
    const rqs = [
      { id:'RQ1', color:'#36bffa', title:'Error Mitigation Scaling',
        desc:'How scalable are error-mitigation techniques (ZNE, readout correction) in multi-qubit circuits for real-time IoT anomaly detection? Our experiments on 2–12 qubit VQCs show combined QEM improves accuracy by 6.7–8.1%, with diminishing returns beyond 10 qubits due to noise floor.' },
      { id:'RQ2', color:'#22c55e', title:'Hybrid Orchestration Effectiveness',
        desc:'How effective is dynamic task allocation in a zero-trust IoT architecture across fog, edge, and cloud layers? Results show 33% latency reduction and 15% CPU savings vs. classical-only pipelines while maintaining 97.34% detection accuracy.' },
      { id:'RQ3', color:'#d946ef', title:'Quantum Homomorphic Encryption',
        desc:'What is the optimal method for QHE balancing encryption depth, latency, and computational complexity in multi-device IoT? Layered-QHE with partial evaluation achieves <41ms policy update latency for networks up to 2,000 devices.' },
    ];
    rqEl.innerHTML = rqs.map(r=>`
      <div class="rq-card" style="border-color:${r.color}30;background:${r.color}08">
        <span class="rq-badge" style="background:${r.color}20;color:${r.color};border:1px solid ${r.color}40">${r.id}</span>
        <div class="rq-title">${r.title}</div>
        <div class="rq-desc">${r.desc}</div>
      </div>`).join('');
  }

  const contribEl = document.getElementById('contrib-grid');
  if (contribEl) {
    const contribs = [
      { num:'01', title:'Error-Resilient VQC Pipeline',
        desc:'First end-to-end quantum circuit pipeline for IoT intrusion detection combining ZNE + readout correction, validated on 6 attack classes.' },
      { num:'02', title:'Dynamic Hybrid Orchestration',
        desc:'QAOA-based task scheduler dynamically allocating security processing between quantum cloud and classical edge, achieving 33% latency savings.' },
      { num:'03', title:'Quantum Bayesian Zero-Trust',
        desc:'Novel QBI-based trust scoring engine integrated with QRL policy adaptation for real-time zero-trust IoT orchestration.' },
      { num:'04', title:'Federated Quantum Privacy',
        desc:'QFL framework achieving 93.89% detection accuracy across distributed edge nodes with full data locality and differential privacy.' },
    ];
    contribEl.innerHTML = contribs.map(c=>`
      <div class="contrib-item">
        <div class="contrib-num">${c.num}</div>
        <div>
          <div class="contrib-title">${c.title}</div>
          <div class="contrib-desc">${c.desc}</div>
        </div>
      </div>`).join('');
  }

  const fuEl = document.getElementById('future-list');
  if (fuEl) {
    const fw = [
      'Deploy on real IBM Quantum hardware for hardware-in-the-loop validation',
      'Extend QFL to 100+ edge nodes with differential privacy guarantees',
      'Implement Post-Quantum TLS 1.3 integration for standard IoT protocols',
      'Optimize QAOA task scheduling beyond 50 qubits using error-mitigated circuits',
      'Healthcare IoT pilot: secure medical device communication with QBI + QFL',
      'Smart city deployment: QAOA + QKD for urban sensor network security',
    ];
    fuEl.innerHTML = fw.map((f,i)=>`
      <li>
        <div class="future-num">${i+1}</div>
        <span>${f}</span>
      </li>`).join('');
  }

  const metaEl = document.getElementById('project-meta');
  if (metaEl) {
    const p = DATA.projectInfo;
    metaEl.innerHTML = `
      <div>
        <div class="label-sm" style="margin-bottom:6px">Students</div>
        ${p.students.map(s=>`<div style="font-family:var(--font-mono);font-size:.8rem;color:#fff">${s.name} <span style="color:var(--q-400)">(${s.id})</span></div>`).join('')}
      </div>
      <div>
        <div class="label-sm" style="margin-bottom:6px">Advisors</div>
        <div style="font-family:var(--font-mono);font-size:.8rem;color:#fff">${p.advisor}</div>
        <div style="font-family:var(--font-mono);font-size:.75rem;color:var(--q-400);margin-top:3px">${p.coadvisor}</div>
      </div>
      <div>
        <div class="label-sm" style="margin-bottom:6px">Institution</div>
        <div style="font-family:var(--font-mono);font-size:.78rem;color:#fff">${p.university}</div>
        <div style="font-family:var(--font-mono);font-size:.72rem;color:var(--q-400);margin-top:3px">${p.department}</div>
      </div>
      <div>
        <div class="label-sm" style="margin-bottom:6px">Funding Support</div>
        <div style="font-size:.75rem;color:var(--q-300);line-height:1.5">Taif University, Saudi Arabia<br>(Project TU-DSPP-2024-291)</div>
      </div>
      <div>
        <div class="label-sm" style="margin-bottom:6px">Quantum SDKs</div>
        <div style="font-family:var(--font-mono);font-size:.75rem;color:var(--q-300)">PennyLane · Qiskit · IBM Aer</div>
      </div>
      <div>
        <div class="label-sm" style="margin-bottom:6px">Classical AI</div>
        <div style="font-family:var(--font-mono);font-size:.75rem;color:var(--q-300)">PyTorch · Scikit-learn · XGBoost</div>
      </div>`;
  }
}

// ── Boot ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  renderHeroFloatBadges();
  renderKPICards();
  renderModelTable();
  renderKFoldTable();
  renderPerClassTable();
  renderClassLegend();
  renderSystemKPIGrid();
  renderArchLayers();
  renderTechStack();
  renderAchievements();
  renderResearch();
  initCharts();
});
