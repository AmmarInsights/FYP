/* charts.js — All Chart.js chart renderers using DATA from data.js */

const COLORS = {
  hybrid:    '#36bffa',
  vqc:       '#d946ef',
  xgb:       '#22c55e',
  rf:        '#f97316',
  svm:       '#eab308',
  lr:        '#94a3b8',
  classical: '#22c55e',
  quantum:   '#d946ef',
  red:       '#ef4444',
  orange:    '#f97316',
  yellow:    '#eab308',
  purple:    '#a855f7',
};

const CHART_DEFAULTS = {
  color: '#7cd4fd',
  font: { family: "'JetBrains Mono', monospace", size: 10 },
};

function applyChartDefaults() {
  Chart.defaults.color = CHART_DEFAULTS.color;
  Chart.defaults.font.family = CHART_DEFAULTS.font.family;
  Chart.defaults.font.size = CHART_DEFAULTS.font.size;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyleWidth = 10;
  Chart.defaults.plugins.legend.labels.padding = 14;
}

function gridColor() { return 'rgba(11,165,236,0.1)'; }
function tickColor()  { return '#7cd4fd'; }

function makeScales(xLabel, yLabel, yMin, yMax, yFmt) {
  return {
    x: {
      grid: { color: gridColor() },
      ticks: { color: tickColor(), font: { size: 9 } },
      title: xLabel ? { display: true, text: xLabel, color: tickColor(), font: { size: 9 } } : undefined,
    },
    y: {
      grid: { color: gridColor() },
      ticks: {
        color: tickColor(), font: { size: 9 },
        callback: yFmt || null,
      },
      title: yLabel ? { display: true, text: yLabel, color: tickColor(), font: { size: 9 } } : undefined,
      min: yMin, max: yMax,
    }
  };
}

// ─── 1. Model Accuracy / F1 Bar Chart ─────────────────────────────────────
function renderModelBar() {
  const ctx = document.getElementById('chart-model-bar');
  if (!ctx) return;
  const d = DATA.modelMetrics;
  const typeColors = { hybrid: COLORS.hybrid, quantum: COLORS.vqc, classical: COLORS.xgb };
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.map(m => m.model.replace(' (Classical)', '').replace(' (QEM)', '')),
      datasets: [
        {
          label: 'Accuracy',
          data: d.map(m => +(m.accuracy * 100).toFixed(2)),
          backgroundColor: d.map(m => typeColors[m.type] + 'cc'),
          borderColor: d.map(m => typeColors[m.type]),
          borderWidth: 1, borderRadius: 4,
        },
        {
          label: 'F1 Macro',
          data: d.map(m => +(m.f1_macro * 100).toFixed(2)),
          backgroundColor: d.map(m => typeColors[m.type] + '55'),
          borderColor: d.map(m => typeColors[m.type]),
          borderWidth: 1, borderRadius: 4,
        },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: makeScales(null, 'Score (%)', 85, 100, v => v.toFixed(0) + '%'),
    }
  });
}

// ─── 2. ROC Curve ────────────────────────────────────────────────────────
function renderROC() {
  const ctx = document.getElementById('chart-roc');
  if (!ctx) return;
  const d = DATA.rocData;
  const baseline = d.map(p => ({ x: p.fpr, y: p.fpr }));
  new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        { label:'Hybrid Q-C (0.9971)',  data: d.map(p=>({x:p.fpr,y:p.hybrid})), borderColor:COLORS.hybrid,  borderWidth:2.5, pointRadius:0, tension:.4 },
        { label:'VQC QEM (0.9934)',     data: d.map(p=>({x:p.fpr,y:p.vqc})),    borderColor:COLORS.vqc,    borderWidth:2,   pointRadius:0, tension:.4 },
        { label:'XGBoost (0.9917)',     data: d.map(p=>({x:p.fpr,y:p.xgb})),    borderColor:COLORS.xgb,    borderWidth:1.5, pointRadius:0, tension:.4, borderDash:[5,3] },
        { label:'Rand Forest (0.9896)', data: d.map(p=>({x:p.fpr,y:p.rf})),     borderColor:COLORS.rf,     borderWidth:1.5, pointRadius:0, tension:.4, borderDash:[3,3] },
        { label:'Chance',               data: baseline,                          borderColor:'rgba(255,255,255,0.2)', borderWidth:1, pointRadius:0, borderDash:[4,4] },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { type:'linear', min:0, max:1, grid:{color:gridColor()}, ticks:{color:tickColor(),font:{size:9}}, title:{display:true,text:'False Positive Rate',color:tickColor(),font:{size:9}} },
        y: { min:0, max:1, grid:{color:gridColor()}, ticks:{color:tickColor(),font:{size:9}}, title:{display:true,text:'True Positive Rate',color:tickColor(),font:{size:9}} },
      }
    }
  });
}

// ─── 3. Robustness — Noise ───────────────────────────────────────────────
function renderRobustnessNoise() {
  const ctx = document.getElementById('chart-noise');
  if (!ctx) return;
  const d = DATA.robustnessData;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.map(p => p.noise_pct + '%'),
      datasets: [
        { label:'Hybrid Q-C', data:d.map(p=>+(p.hybrid*100).toFixed(2)), borderColor:COLORS.hybrid, borderWidth:2.5, pointRadius:4, tension:.4 },
        { label:'VQC (QEM)',  data:d.map(p=>+(p.vqc*100).toFixed(2)),   borderColor:COLORS.vqc,   borderWidth:2,   pointRadius:3, tension:.4 },
        { label:'XGBoost',    data:d.map(p=>+(p.xgb*100).toFixed(2)),   borderColor:COLORS.xgb,   borderWidth:1.5, pointRadius:3, tension:.4, borderDash:[5,3] },
        { label:'Rand Forest',data:d.map(p=>+(p.rf*100).toFixed(2)),    borderColor:COLORS.rf,    borderWidth:1.5, pointRadius:3, tension:.4, borderDash:[3,3] },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: makeScales('Noise Level', 'Accuracy (%)', 85, 100, v => v.toFixed(0) + '%'),
    }
  });
}

// ─── 4. Robustness — Missingness ─────────────────────────────────────────
function renderRobustnessMissing() {
  const ctx = document.getElementById('chart-missing');
  if (!ctx) return;
  const d = DATA.missingnessData;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.map(p => p.missing_pct + '%'),
      datasets: [
        { label:'Hybrid Q-C', data:d.map(p=>+(p.hybrid*100).toFixed(2)), borderColor:COLORS.hybrid, borderWidth:2.5, pointRadius:4, tension:.4 },
        { label:'VQC (QEM)',  data:d.map(p=>+(p.vqc*100).toFixed(2)),   borderColor:COLORS.vqc,   borderWidth:2,   pointRadius:3, tension:.4 },
        { label:'XGBoost',    data:d.map(p=>+(p.xgb*100).toFixed(2)),   borderColor:COLORS.xgb,   borderWidth:1.5, pointRadius:3, tension:.4, borderDash:[5,3] },
        { label:'Rand Forest',data:d.map(p=>+(p.rf*100).toFixed(2)),    borderColor:COLORS.rf,    borderWidth:1.5, pointRadius:3, tension:.4, borderDash:[3,3] },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: makeScales('Missing Data %', 'Accuracy (%)', 88, 100, v => v.toFixed(0) + '%'),
    }
  });
}

// ─── 5. QEM Chart ────────────────────────────────────────────────────────
function renderQEM() {
  const ctx = document.getElementById('chart-qem');
  if (!ctx) return;
  const d = DATA.qemData;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.map(p => p.qubits + 'Q'),
      datasets: [
        { label:'Noisy (raw)',      data:d.map(p=>+(p.noisy*100).toFixed(1)),    borderColor:COLORS.red,    borderWidth:1.5, pointRadius:3, tension:.4, borderDash:[4,2] },
        { label:'ZNE',              data:d.map(p=>+(p.zne*100).toFixed(1)),      borderColor:COLORS.orange, borderWidth:2,   pointRadius:3, tension:.4 },
        { label:'Readout Correct',  data:d.map(p=>+(p.readout*100).toFixed(1)),  borderColor:COLORS.yellow, borderWidth:2,   pointRadius:3, tension:.4 },
        { label:'Combined QEM',     data:d.map(p=>+(p.combined*100).toFixed(1)), borderColor:COLORS.hybrid, borderWidth:2.5, pointRadius:4, tension:.4 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: makeScales('Qubit Count', 'Accuracy (%)', 68, 100, v => v.toFixed(0) + '%'),
    }
  });
}

// ─── 6. Trust Score Timeline ─────────────────────────────────────────────
function renderTrustTimeline() {
  const ctx = document.getElementById('chart-trust');
  if (!ctx) return;
  const d = DATA.trustEvents;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.map(p => p.time),
      datasets: [
        {
          label:'Trust Score',
          data: d.map(p => +(p.trust_score * 100).toFixed(1)),
          borderColor: COLORS.hybrid, borderWidth: 2.5, pointRadius: 3, tension: .4,
          fill: true,
          backgroundColor: 'rgba(54,191,250,0.08)',
          yAxisID: 'y',
        },
        {
          label:'Anomalies',
          data: d.map(p => p.anomalies),
          borderColor: COLORS.red, borderWidth: 1.5, pointRadius: 3, tension: .4,
          fill: true,
          backgroundColor: 'rgba(239,68,68,0.08)',
          borderDash: [4, 2],
          yAxisID: 'y2',
        },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { grid:{color:gridColor()}, ticks:{color:tickColor(),font:{size:9}} },
        y:  { min:0, max:100, grid:{color:gridColor()}, ticks:{color:tickColor(),font:{size:9},callback:v=>v+'%'}, position:'left' },
        y2: { min:0, grid:{display:false}, ticks:{color:COLORS.red,font:{size:9}}, position:'right' },
      }
    }
  });
}

// ─── 7. Class Distribution (Doughnut) ───────────────────────────────────
function renderClassDist() {
  const ctx = document.getElementById('chart-classdist');
  if (!ctx) return;
  const d = DATA.classDistribution;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: d.map(p => p.label),
      datasets: [{
        data: d.map(p => p.count),
        backgroundColor: d.map(p => p.color + 'cc'),
        borderColor: d.map(p => p.color),
        borderWidth: 1.5,
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '58%',
      plugins: {
        legend: { position: 'right', labels: { font:{size:10}, padding: 10 } },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.raw.toLocaleString()} (${d[ctx.dataIndex].pct}%)`
          }
        }
      }
    }
  });
}

// ─── 8. Feature Importance (Horizontal bar) ─────────────────────────────
function renderFeatureImportance() {
  const ctx = document.getElementById('chart-features');
  if (!ctx) return;
  const d = DATA.featureImportance;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.map(p => p.feature),
      datasets: [
        { label:'RF Importance',    data:d.map(p=>p.importance),   backgroundColor:COLORS.hybrid+'cc',  borderColor:COLORS.hybrid,  borderWidth:1, borderRadius:3 },
        { label:'Permutation Imp.', data:d.map(p=>p.permutation),  backgroundColor:COLORS.vqc+'88',    borderColor:COLORS.vqc,    borderWidth:1, borderRadius:3 },
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { grid:{color:gridColor()}, ticks:{color:tickColor(),font:{size:9}}, title:{display:true,text:'Importance',color:tickColor(),font:{size:9}} },
        y: { grid:{display:false},     ticks:{color:tickColor(),font:{size:9}} },
      }
    }
  });
}

// ─── 9. QKD Key Rate ────────────────────────────────────────────────────
function renderQKD() {
  const ctx = document.getElementById('chart-qkd');
  if (!ctx) return;
  const d = DATA.qkdData;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.map(p => p.distance_km + 'km'),
      datasets: [{
        label:'Key Rate (kbps)',
        data: d.map(p => p.key_rate_kbps),
        borderColor: COLORS.xgb, borderWidth: 2.5, pointRadius: 4, tension: .4,
        fill: true, backgroundColor: 'rgba(34,197,94,0.08)',
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: makeScales('Distance (km)', 'Key Rate (kbps)', 0, 1300),
    }
  });
}

// ─── 10. Latency Comparison ──────────────────────────────────────────────
function renderLatency() {
  const ctx = document.getElementById('chart-latency');
  if (!ctx) return;
  const d = DATA.latencyData;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.map(p => p.category),
      datasets: [
        { label:'Classical', data:d.map(p=>p.classical), backgroundColor:COLORS.red+'cc',    borderColor:COLORS.red,    borderWidth:1, borderRadius:4 },
        { label:'Hybrid',    data:d.map(p=>p.hybrid),    backgroundColor:COLORS.orange+'cc',  borderColor:COLORS.orange, borderWidth:1, borderRadius:4 },
        { label:'Quantum',   data:d.map(p=>p.quantum),   backgroundColor:COLORS.hybrid+'cc',  borderColor:COLORS.hybrid, borderWidth:1, borderRadius:4 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: makeScales(null, 'Latency (ms)', 0, 340),
    }
  });
}

// ─── 11. Scalability ─────────────────────────────────────────────────────
function renderScalability() {
  const ctx = document.getElementById('chart-scalability');
  if (!ctx) return;
  const d = DATA.scalabilityData;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.map(p => p.devices),
      datasets: [
        { label:'Classical CPU%', data:d.map(p=>p.classical_cpu), borderColor:COLORS.red,    borderWidth:2, pointRadius:3, tension:.4 },
        { label:'Hybrid CPU%',    data:d.map(p=>p.hybrid_cpu),    borderColor:COLORS.hybrid, borderWidth:2, pointRadius:3, tension:.4 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: makeScales('Devices', 'CPU Usage (%)', 0, 200),
    }
  });
}

// ─── 12. Per-class F1 bar ────────────────────────────────────────────────
function renderPerClass() {
  const ctx = document.getElementById('chart-perclass');
  if (!ctx) return;
  const d = DATA.perClassMetrics;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.map(p => p.cls),
      datasets: [
        { label:'Precision', data:d.map(p=>+(p.precision*100).toFixed(1)), backgroundColor:COLORS.hybrid+'cc', borderColor:COLORS.hybrid, borderWidth:1, borderRadius:4 },
        { label:'Recall',    data:d.map(p=>+(p.recall*100).toFixed(1)),    backgroundColor:COLORS.xgb+'cc',   borderColor:COLORS.xgb,   borderWidth:1, borderRadius:4 },
        { label:'F1',        data:d.map(p=>+(p.f1*100).toFixed(1)),        backgroundColor:COLORS.vqc+'88',   borderColor:COLORS.vqc,   borderWidth:1, borderRadius:4 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: makeScales(null, 'Score (%)', 80, 100, v => v.toFixed(0) + '%'),
    }
  });
}

// ─── Confusion Matrix (DOM) ───────────────────────────────────────────────
function renderConfusionMatrix() {
  const wrap = document.getElementById('conf-matrix-wrap');
  if (!wrap) return;
  const { labels, matrix } = DATA.confusionMatrix;

  let html = '<table id="conf-matrix"><thead><tr><th>True \\ Pred</th>';
  labels.forEach(l => { html += `<th>${l}</th>`; });
  html += '</tr></thead><tbody>';

  matrix.forEach((row, i) => {
    html += `<tr><th style="text-align:left;white-space:nowrap;font-size:.65rem;color:#7cd4fd;padding-right:8px">${labels[i]}</th>`;
    row.forEach((val, j) => {
      const isDiag = i === j;
      let bg, color;
      if (isDiag) {
        const intensity = Math.min(val / matrix[i][i], 1);
        bg = `rgba(11,165,236,${0.15 + intensity * 0.5})`;
        color = '#b9e5fe';
      } else if (val > 0) {
        bg = `rgba(239,68,68,${Math.min(val / 10, 0.5)})`;
        color = val > 3 ? '#fca5a5' : '#555';
      } else {
        bg = 'rgba(11,165,236,0.03)';
        color = '#334155';
      }
      html += `<td style="background:${bg};color:${color}">${val}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  wrap.innerHTML = html;
}

// ─── Init all charts ─────────────────────────────────────────────────────
function initCharts() {
  applyChartDefaults();
  renderModelBar();
  renderROC();
  renderRobustnessNoise();
  renderRobustnessMissing();
  renderQEM();
  renderTrustTimeline();
  renderClassDist();
  renderFeatureImportance();
  renderQKD();
  renderLatency();
  renderScalability();
  renderPerClass();
  renderConfusionMatrix();
}
