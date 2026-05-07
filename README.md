# Quantum-IoT Security Dashboard (HTML/CSS/JS)

**Integrating Quantum AI with IoT Security: A Framework for Error-Resilient Models and Adaptive Zero-Trust Orchestration**

> Final Year Project — Department of AI, University of Management and Technology, Lahore

**Students:** Muhammad Ammar Ajmal (F2022376076) · Muhammad Afnan (F2022376028)

---

## 📁 Project Structure

```
quantum-iot-html/
├── index.html      ← Main page (open this in browser)
├── css/
│   └── style.css   ← Full quantum dark theme
└── js/
    ├── data.js     ← All simulation metrics & chart data
    ├── charts.js   ← Chart.js chart renderers (13 charts)
    └── app.js      ← DOM builder, navbar, tables, sections
```

## 🚀 How to Run

**Option 1 — Just open the file:**
Double-click `index.html` — works in any modern browser.

**Option 2 — Local server (recommended):**
```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000

# Node.js
npx serve .
# then open http://localhost:3000
```

**Option 3 — GitHub Pages:**
1. Push this folder to a GitHub repo
2. Go to Settings → Pages → Deploy from branch (main / root)
3. Done — live at `https://yourusername.github.io/repo-name`

**Option 4 — Vercel / Netlify:**
Drag-and-drop the folder onto vercel.com or netlify.com — deploys instantly.

---

## 📊 What's Included

- Hero with animated floating tech badges + KPI cards
- System Architecture — 4-layer diagram, data flow pipeline, tech stack
- Performance — Model table (7 models), Accuracy/F1 bars, ROC curves, K-Fold CV, Noise + Missingness robustness
- Security — QEM curves, Zero-Trust timeline, class distribution, feature importance, QKD, latency, scalability
- Results — Confusion matrix, per-class metrics, achievement cards, system KPIs
- Research — Research questions answered, contributions, future work, project info

**No build step. No npm. No framework. Pure HTML/CSS/JS.**
