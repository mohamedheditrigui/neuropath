/* Chapter 6: overfitting and cross-validation with polynomial models.
   The hidden truth is a gentle curve, y = 1 + 0.5x − 2x², plus noise.
   'fit': pick a degree and compare training and test error.
   'cv':  5-fold cross-validation chooses the degree. */
import { useEffect, useMemo, useState } from 'react';
import Icon from '../Icon.jsx';

const truth = (x) => 1 + 0.5 * x - 2 * x * x;
const TRAIN_X = [-0.95, -0.75, -0.55, -0.35, -0.15, 0.05, 0.25, 0.45, 0.65, 0.85];
const TRAIN_N = [0.12, -0.18, 0.2, -0.05, 0.15, -0.22, 0.08, -0.12, 0.18, -0.1];
const TEST_X = [-0.85, -0.65, -0.45, -0.25, -0.05, 0.15, 0.35, 0.55, 0.75, 0.95];
const TEST_N = [-0.1, 0.15, -0.2, 0.1, -0.15, 0.2, -0.08, 0.12, -0.18, 0.1];
const TRAIN = TRAIN_X.map((x, i) => [x, truth(x) + TRAIN_N[i]]);
const TEST = TEST_X.map((x, i) => [x, truth(x) + TEST_N[i]]);
const ALL = [...TRAIN, ...TEST].sort((a, b) => a[0] - b[0]);
const DEGREES = [1, 2, 3, 4, 5, 6, 7, 8];
const FOLDS = 5;

/* Least-squares polynomial fit: solve (AᵀA)c = Aᵀy with Gaussian elimination. */
function polyfit(points, degree) {
  const n = degree + 1;
  const M = Array.from({ length: n }, () => new Array(n + 1).fill(0));
  points.forEach(([x, y]) => {
    const pw = Array.from({ length: n }, (_, i) => x ** i);
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) M[r][c] += pw[r] * pw[c];
      M[r][n] += pw[r] * y;
    }
  });
  for (let r = 0; r < n; r++) M[r][r] += 1e-10; // tiny ridge for numerical safety
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    [M[col], M[piv]] = [M[piv], M[col]];
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col] / M[col][col];
      for (let c = col; c <= n; c++) M[r][c] -= f * M[col][c];
    }
  }
  const coef = M.map((row, i) => row[n] / row[i]);
  return (x) => coef.reduce((s, c, i) => s + c * x ** i, 0);
}
const mse = (f, pts) => pts.reduce((s, [x, y]) => s + (f(x) - y) ** 2, 0) / pts.length;

function cvScores(degree) {
  return Array.from({ length: FOLDS }, (_, k) => {
    const test = ALL.filter((_, i) => i % FOLDS === k);
    const train = ALL.filter((_, i) => i % FOLDS !== k);
    return mse(polyfit(train, degree), test);
  });
}

const PX = (x) => 40 + ((x + 1) / 2) * 460;
const PY = (y) => 160 - y * 70;
const clipY = (y) => Math.max(-2, Math.min(2.1, y));

function CurvePlot({ f, showTest }) {
  const pts = Array.from({ length: 121 }, (_, i) => {
    const x = -1 + i / 60;
    return `${PX(x)},${PY(clipY(f(x)))}`;
  }).join(' ');
  return (
    <svg className="plot" viewBox="0 0 540 320" role="img" aria-label="Training and test points with the fitted polynomial" fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif">
      <defs><clipPath id="ofclip"><rect x="40" y="10" width="460" height="290" /></clipPath></defs>
      <rect x="40" y="10" width="460" height="290" fill="#FBF6EB" />
      <line x1="40" x2="500" y1={PY(0)} y2={PY(0)} stroke="#E7D8BC" />
      <polyline points={pts} fill="none" stroke="#C98F2B" strokeWidth="3.5" clipPath="url(#ofclip)" />
      {TRAIN.map(([x, y], i) => <circle key={`a${i}`} cx={PX(x)} cy={PY(y)} r="7" fill="#5F6D32" stroke="#FBF6EB" strokeWidth="2" />)}
      {showTest && TEST.map(([x, y], i) => <rect key={`b${i}`} x={PX(x) - 6} y={PY(y) - 6} width="12" height="12" fill="#A84F32" stroke="#FBF6EB" strokeWidth="2" />)}
    </svg>
  );
}

function FitMode({ level, onSolved }) {
  const [degree, setDegree] = useState(8);
  const errors = useMemo(() => DEGREES.map((d) => { const f = polyfit(TRAIN, d); return { d, train: mse(f, TRAIN), test: mse(f, TEST) }; }), []);
  const bestTest = Math.min(...errors.map((e) => e.test));
  const cur = errors[degree - 1];
  const f = useMemo(() => polyfit(TRAIN, degree), [degree]);
  const ok = cur.test <= bestTest * 1.1;
  useEffect(() => onSolved(ok), [ok, onSolved]);
  const maxE = 0.6;
  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">y = c₀ + c₁x + … + c<sub>{degree}</sub>x<sup>{degree}</sup></div>
        <div className="slider">
          <label htmlFor="deg">Polynomial degree <span className="mono">{degree}</span></label>
          <input id="deg" type="range" min="1" max="8" step="1" value={degree} onChange={(e) => setDegree(+e.target.value)} />
        </div>
        <div className="stats" style={{ gridTemplateColumns: 'repeat(2,minmax(0,1fr))' }}>
          <div className="stat"><b className="mono">{cur.train.toFixed(3)}</b><span>Training error (MSE)</span></div>
          <div className="stat"><b className="mono">{cur.test > 99 ? '> 99' : cur.test.toFixed(3)}</b><span>Test error (MSE)</span></div>
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p><b>Mini-exercise.</b> Find the degree with the lowest test error.</p>
          <span className={`chip ${ok ? 'good' : 'warn'}`} style={{ justifySelf: 'start' }}>{ok ? <><Icon name="check" /> Goal reached</> : cur.train < 0.02 ? 'Tiny training error, big test error: overfitting' : 'Not yet'}</span>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Fit and errors by degree</h3>
        <CurvePlot f={f} showTest />
        <div className="legend"><span><i style={{ background: '#5F6D32' }} />Training points</span><span><i style={{ background: '#A84F32', borderRadius: 2 }} />Test points</span></div>
        <svg className="plot" viewBox="0 0 540 150" role="img" aria-label="Training and test error for each degree" fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif">
          {errors.map((e, i) => {
            const x = 40 + i * 60;
            const h1 = (Math.min(e.train, maxE) / maxE) * 100;
            const h2 = (Math.min(e.test, maxE) / maxE) * 100;
            return (
              <g key={e.d} opacity={e.d === degree ? 1 : 0.55}>
                <rect x={x} y={115 - h1} width="20" height={h1} fill="#5F6D32" rx="2" />
                <rect x={x + 22} y={115 - h2} width="20" height={h2} fill="#A84F32" rx="2" />
                <text x={x + 21} y="134" textAnchor="middle" fontSize="12" fontWeight={e.d === degree ? 700 : 400} fill="#2E2118">{e.d}</text>
              </g>
            );
          })}
          <line x1="34" x2="520" y1="115" y2="115" stroke="#2E2118" strokeWidth="2" />
          <text x="280" y="149" textAnchor="middle" fontSize="12" fill="#5E4C3D">Degree (green = training error, red = test error)</text>
        </svg>
      </section>
    </div>
  );
}

function CvMode({ level, onSolved }) {
  const [degree, setDegree] = useState(1);
  const table = useMemo(() => DEGREES.slice(0, 6).map((d) => { const s = cvScores(d); return { d, s, mean: s.reduce((a, b) => a + b, 0) / FOLDS }; }), []);
  const best = Math.min(...table.map((t) => t.mean));
  const cur = table[degree - 1];
  const ok = cur.mean <= best * 1.1;
  useEffect(() => onSolved(ok), [ok, onSolved]);
  const f = useMemo(() => polyfit(ALL, degree), [degree]);
  const maxS = 0.4;
  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">score = average of <em>{FOLDS}</em> folds</div>
        <div className="slider">
          <label htmlFor="cvdeg">Polynomial degree <span className="mono">{degree}</span></label>
          <input id="cvdeg" type="range" min="1" max="6" step="1" value={degree} onChange={(e) => setDegree(+e.target.value)} />
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p><b>Mini-exercise.</b> Choose the degree with the lowest average cross-validation error.</p>
          <div className="readout"><span>Average error <span className="mse">{cur.mean.toFixed(3)}</span></span><span className={`chip ${ok ? 'good' : 'warn'}`}>{ok ? <><Icon name="check" /> Goal reached</> : 'Not yet'}</span></div>
        </div>
        <CurvePlot f={f} />
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Five folds, five test scores</h3>
        <p className="muted">All 20 points are cut into 5 folds of 4. Each fold is the test set once; the model trains on the other 16.</p>
        <svg className="plot" viewBox="0 0 540 220" role="img" aria-label={`Cross-validation error per fold for degree ${degree}`} fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif">
          {cur.s.map((s, k) => {
            const h = (Math.min(s, maxS) / maxS) * 150;
            return (
              <g key={k}>
                <rect x={50 + k * 90} y={180 - h} width="60" height={h} fill="#C98F2B" rx="4" />
                <text x={80 + k * 90} y="198" textAnchor="middle" fontSize="12" fill="#2E2118">Fold {k + 1}</text>
                <text x={80 + k * 90} y={174 - h} textAnchor="middle" fontSize="11" fill="#5E4C3D">{s > 9 ? '> 9' : s.toFixed(2)}</text>
              </g>
            );
          })}
          <line x1="40" x2="500" y1={180 - (Math.min(cur.mean, maxS) / maxS) * 150} y2={180 - (Math.min(cur.mean, maxS) / maxS) * 150} stroke="#A84F32" strokeWidth="2.5" strokeDasharray="7 5" />
          <text x="500" y={172 - (Math.min(cur.mean, maxS) / maxS) * 150} textAnchor="end" fontSize="12" fontWeight="700" fill="#7E3820">average</text>
          <line x1="40" x2="500" y1="180" y2="180" stroke="#2E2118" strokeWidth="2" />
        </svg>
      </section>
    </div>
  );
}

export default function OverfitLab(props) {
  return props.level.mode === 'cv' ? <CvMode {...props} /> : <FitMode {...props} />;
}
