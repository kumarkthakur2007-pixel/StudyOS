import { useState, useEffect, useRef } from "react";

// ─── CSS injected as a style tag ───────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #12121a;
    --surface2: #1a1a26;
    --border: #2a2a3d;
    --purple: #7c6fff;
    --pink: #ec4899;
    --teal: #00e5c4;
    --text: #e8e8f0;
    --muted: #6b6b8a;
    --font-display: 'Syne', sans-serif;
    --font-mono: 'Space Mono', monospace;
  }

  .sos-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--font-display);
    color: var(--text);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 24px 16px 48px;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Background grid ── */
  .sos-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.25;
    pointer-events: none;
    z-index: 0;
  }

  .sos-inner {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
  }

  /* ── Header ── */
  .sos-logo {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 1.15rem;
    letter-spacing: 0.18em;
    color: var(--purple);
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .sos-tagline {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--muted);
    letter-spacing: 0.1em;
    margin-bottom: 32px;
  }

  /* ── Step indicator ── */
  .sos-steps {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 28px;
  }
  .sos-step-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--border);
    transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  .sos-step-dot.active {
    background: var(--purple);
    box-shadow: 0 0 12px var(--purple);
    transform: scale(1.5);
  }
  .sos-step-dot.done {
    background: var(--teal);
  }
  .sos-step-line {
    flex: 1; height: 1px;
    background: var(--border);
    position: relative;
    overflow: hidden;
  }
  .sos-step-line-fill {
    position: absolute;
    inset-block: 0; left: 0;
    background: var(--teal);
    transition: width 0.6s ease;
  }

  /* ── Card ── */
  .sos-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px 24px;
    position: relative;
    overflow: hidden;
  }
  .sos-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--purple), var(--pink));
  }

  .sos-section-title {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    color: var(--muted);
    text-transform: uppercase;
    font-family: var(--font-mono);
    margin-bottom: 20px;
  }

  /* ── Inputs ── */
  .sos-field {
    margin-bottom: 18px;
  }
  .sos-label {
    display: block;
    font-size: 0.72rem;
    font-family: var(--font-mono);
    color: var(--muted);
    margin-bottom: 6px;
    letter-spacing: 0.08em;
  }
  .sos-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 0.88rem;
    padding: 10px 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .sos-input:focus {
    border-color: var(--purple);
    box-shadow: 0 0 0 3px rgba(124,111,255,0.15);
  }
  textarea.sos-input {
    resize: vertical;
    min-height: 100px;
  }

  /* ── Select pills ── */
  .sos-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .sos-pill {
    padding: 7px 16px;
    border-radius: 99px;
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.78rem;
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
  }
  .sos-pill:hover { border-color: var(--purple); color: var(--text); }
  .sos-pill.selected {
    border-color: var(--purple);
    background: rgba(124,111,255,0.18);
    color: var(--purple);
    box-shadow: 0 0 10px rgba(124,111,255,0.25);
  }

  /* ── Button ── */
  .sos-btn {
    width: 100%;
    padding: 14px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, var(--purple), var(--pink));
    color: #fff;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.95rem;
    letter-spacing: 0.06em;
    cursor: pointer;
    margin-top: 24px;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s, box-shadow 0.2s;
  }
  .sos-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(124,111,255,0.35); }
  .sos-btn:active { transform: scale(0.98); }
  .sos-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  /* ── MACHINE CANVAS ── */
  .sos-machine {
    margin: 24px 0 8px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    min-height: 120px;
    position: relative;
    overflow: hidden;
  }
  .sos-machine-label {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  /* ── PULLEY ── */
  .pulley-scene {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    height: 80px;
    justify-content: center;
  }
  .pulley-wheel-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .pulley-wheel {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 3px solid var(--purple);
    background: var(--surface2);
    position: relative;
    transition: transform 0.1s linear;
  }
  .pulley-wheel::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--purple);
    transform: translate(-50%,-50%);
  }
  .pulley-spoke {
    position: absolute;
    top: 50%; left: 50%;
    width: 14px; height: 2px;
    background: var(--purple);
    transform-origin: left center;
    opacity: 0.6;
  }
  .pulley-rope {
    width: 2px;
    background: var(--muted);
    margin-top: 0;
  }
  .pulley-weight {
    width: 28px; height: 20px;
    background: linear-gradient(135deg, var(--purple), #5a4fff);
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(124,111,255,0.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.55rem; color: rgba(255,255,255,0.7);
    font-family: var(--font-mono);
    transition: transform 0.15s ease-out;
  }
  .pulley-rope-left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .pulley-rope-right {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* ── GEARS ── */
  .gears-scene {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    height: 80px;
  }
  .gear {
    position: relative;
    display: flex; align-items: center; justify-content: center;
  }
  .gear-body {
    border-radius: 50%;
    background: var(--surface2);
    border: 3px solid var(--purple);
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.05s linear;
    position: relative;
  }
  .gear-body.pink { border-color: var(--pink); }
  .gear-body.teal { border-color: var(--teal); }
  .gear-inner {
    border-radius: 50%;
    background: var(--surface);
    border: 2px solid;
  }
  .gear-tooth {
    position: absolute;
    width: 6px; height: 10px;
    background: var(--purple);
    border-radius: 2px;
  }
  .gear-tooth.pink { background: var(--pink); }
  .gear-tooth.teal { background: var(--teal); }

  /* ── PHOTO DROPPER ── */
  .photo-scene {
    height: 80px;
    position: relative;
    display: flex;
    justify-content: center;
  }
  .ball {
    width: 18px; height: 18px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--pink), #ff6b9d);
    position: absolute;
    top: 0;
    box-shadow: 0 0 10px rgba(236,72,153,0.5);
    transition: top 0.45s cubic-bezier(0.55,-0.1,0.45,1.4);
  }
  .ball.dropped { top: 52px; }
  .shutter {
    position: absolute;
    bottom: 0; left: 50%;
    transform: translateX(-50%);
    width: 60px; height: 14px;
    display: flex; gap: 3px;
  }
  .shutter-blade {
    flex: 1;
    background: var(--purple);
    border-radius: 2px;
    transform-origin: bottom center;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .shutter-blade:nth-child(odd) { transform: scaleY(1); }
  .shutter-blade.open { transform: scaleY(0.2); }

  /* ── LIQUID FILL ── */
  .liquid-scene {
    height: 80px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 8px;
  }
  .flask {
    width: 44px; height: 68px;
    border: 2px solid var(--teal);
    border-radius: 4px 4px 10px 10px;
    position: relative;
    overflow: hidden;
    background: var(--surface2);
  }
  .flask-fill {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: linear-gradient(to top, rgba(0,229,196,0.7), rgba(124,111,255,0.4));
    transition: height 0.6s cubic-bezier(0.4,0,0.2,1);
  }
  .flask-bubble {
    position: absolute;
    bottom: 4px; left: 6px;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: rgba(255,255,255,0.35);
    animation: bubble 2s ease-in-out infinite;
  }
  .flask-bubble:nth-child(2) { left: 16px; animation-delay: 0.7s; width: 4px; height: 4px; }
  .flask-bubble:nth-child(3) { left: 26px; animation-delay: 1.3s; }
  @keyframes bubble {
    0%,100% { transform: translateY(0); opacity: 0.35; }
    50% { transform: translateY(-12px); opacity: 0.1; }
  }
  .flask-label {
    width: 44px;
    text-align: center;
    font-family: var(--font-mono);
    font-size: 0.58rem;
    color: var(--teal);
    margin-top: 4px;
  }

  /* ── LEVER BUTTON ── */
  .lever-scene {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }
  .lever-base {
    width: 80px; height: 10px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px;
    position: relative;
    display: flex; align-items: center;
  }
  .lever-pivot {
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%,-50%);
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--purple);
    z-index: 2;
  }
  .lever-arm {
    position: absolute;
    left: 50%; bottom: 5px;
    width: 4px; height: 44px;
    background: linear-gradient(to top, var(--purple), var(--pink));
    border-radius: 4px;
    transform-origin: bottom center;
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  .lever-arm.swung { transform: rotate(-55deg); }
  .lever-ball {
    position: absolute;
    top: -8px; left: 50%;
    transform: translateX(-50%);
    width: 12px; height: 12px;
    border-radius: 50%;
    background: var(--pink);
    box-shadow: 0 0 8px var(--pink);
  }

  /* ── Photo upload area ── */
  .photo-upload-zone {
    border: 2px dashed var(--border);
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    position: relative;
    overflow: hidden;
  }
  .photo-upload-zone:hover, .photo-upload-zone.has-photo {
    border-color: var(--pink);
    background: rgba(236,72,153,0.05);
  }
  .photo-preview {
    width: 72px; height: 72px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 auto 8px;
    display: block;
    border: 2px solid var(--pink);
  }
  .photo-upload-icon {
    font-size: 2rem;
    margin-bottom: 6px;
  }
  .photo-upload-text {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--muted);
  }
  input[type=file] { display: none; }

  /* ── Done screen ── */
  .sos-done {
    text-align: center;
    padding: 32px 0;
    animation: fadeUp 0.6s ease forwards;
  }
  .sos-done-icon {
    font-size: 3.5rem;
    margin-bottom: 16px;
    animation: pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
  }
  .sos-done-title {
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(90deg, var(--purple), var(--pink));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  }
  .sos-done-sub {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--muted);
    line-height: 1.6;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pop {
    from { transform: scale(0); }
    to { transform: scale(1); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Mobile tweaks */
  @media (max-width: 360px) {
    .sos-card { padding: 20px 16px; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Gear({ size = 40, teeth = 8, color = "--purple", angle = 0 }) {
  const r = size / 2;
  const toothLen = size * 0.18;
  const points = Array.from({ length: teeth }, (_, i) => {
    const a = (i / teeth) * 360;
    const aRad = (a * Math.PI) / 180;
    return {
      x: 50 + (r + toothLen) * Math.cos(aRad),
      y: 50 + (r + toothLen) * Math.sin(aRad),
      angle: a,
    };
  });
  return (
    <svg
      width={size + 20}
      height={size + 20}
      viewBox="0 0 100 100"
      style={{ transform: `rotate(${angle}deg)`, transition: "transform 0.05s linear", overflow: "visible" }}
    >
      {points.map((p, i) => (
        <rect
          key={i}
          x={p.x - 4}
          y={p.y - 5}
          width={8}
          height={10}
          rx={2}
          fill={`var(${color})`}
          transform={`rotate(${p.angle}, ${p.x}, ${p.y})`}
        />
      ))}
      <circle cx={50} cy={50} r={r} fill="var(--surface2)" stroke={`var(${color})`} strokeWidth={3} />
      <circle cx={50} cy={50} r={r * 0.35} fill="var(--surface)" stroke={`var(${color})`} strokeWidth={2} />
    </svg>
  );
}

function PulleyScene({ progress }) {
  // progress: 0–1
  const ropeLen = 24 + progress * 18;
  const weightOffset = progress * 18;
  const wheelAngle = progress * 360 * 2;
  return (
    <div className="pulley-scene">
      <div className="pulley-rope-left" style={{ alignItems: "center" }}>
        <div style={{ height: 8 }} />
        <div className="pulley-rope" style={{ height: ropeLen }} />
        <div className="pulley-weight" style={{ transform: `translateY(${weightOffset}px)` }}>W</div>
      </div>
      <div className="pulley-wheel-wrap">
        <div className="pulley-wheel" style={{ transform: `rotate(${wheelAngle}deg)` }}>
          {[0, 60, 120, 180, 240, 300].map(a => (
            <div key={a} className="pulley-spoke" style={{ transform: `translate(-50%, -50%) rotate(${a}deg)`, top: "50%", left: "50%", position: "absolute" }} />
          ))}
        </div>
      </div>
      <div className="pulley-rope-right" style={{ alignItems: "center" }}>
        <div style={{ height: 8 }} />
        <div className="pulley-rope" style={{ height: 42 - weightOffset, minHeight: 6 }} />
        <div className="pulley-weight" style={{ transform: `translateY(${-weightOffset}px)`, background: "linear-gradient(135deg, var(--pink), #d63880)" }}>W</div>
      </div>
    </div>
  );
}

function GearsScene({ gearAngle }) {
  return (
    <div className="gears-scene">
      <Gear size={42} teeth={10} color="--purple" angle={gearAngle} />
      <Gear size={28} teeth={7} color="--pink" angle={-gearAngle * 1.5} />
      <Gear size={20} teeth={5} color="--teal" angle={gearAngle * 2.1} />
    </div>
  );
}

function PhotoScene({ dropped }) {
  return (
    <div className="photo-scene">
      <div className={`ball ${dropped ? "dropped" : ""}`} />
      <div className="shutter" style={{ bottom: 8 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`shutter-blade ${dropped ? "open" : ""}`} />
        ))}
      </div>
    </div>
  );
}

function LiquidScene({ fillPct }) {
  return (
    <div className="liquid-scene">
      <div>
        <div className="flask">
          <div className="flask-fill" style={{ height: `${fillPct}%` }} />
          <div className="flask-bubble" />
          <div className="flask-bubble" />
          <div className="flask-bubble" />
        </div>
        <div className="flask-label">{Math.round(fillPct)}%</div>
      </div>
      <div>
        <div className="flask">
          <div className="flask-fill" style={{ height: `${Math.min(100, fillPct * 0.7)}%`, background: "linear-gradient(to top, rgba(236,72,153,0.6), rgba(124,111,255,0.3))" }} />
          <div className="flask-bubble" />
        </div>
        <div className="flask-label" style={{ color: "var(--pink)" }}>{Math.round(Math.min(100, fillPct * 0.7))}%</div>
      </div>
    </div>
  );
}

function LeverScene({ swung }) {
  return (
    <div className="lever-scene">
      <div className="lever-base" style={{ position: "relative", width: 80, height: 10 }}>
        <div className="lever-pivot" />
        <div className={`lever-arm ${swung ? "swung" : ""}`}>
          <div className="lever-ball" />
        </div>
      </div>
    </div>
  );
}

// ─── Step components ──────────────────────────────────────────────────────────

function Step1({ data, onChange }) {
  const nameProgress = Math.min(1, (data.name?.length || 0) / 15);
  const gearAngle = ((data.class ? 120 : 0) + (data.stream ? 80 : 0) + (data.school?.length || 0) * 3) % 360;

  return (
    <div>
      {/* PULLEY — reacts to name */}
      <div className="sos-machine">
        <div className="sos-machine-label">⚙ mechanism // name input → pulley</div>
        <PulleyScene progress={nameProgress} />
      </div>

      <div className="sos-field" style={{ marginTop: 18 }}>
        <label className="sos-label">// your name</label>
        <input className="sos-input" placeholder="e.g. Aarav Shah" value={data.name || ""} onChange={e => onChange("name", e.target.value)} />
      </div>

      {/* GEARS — react to class/stream/school */}
      <div className="sos-machine" style={{ marginTop: 4 }}>
        <div className="sos-machine-label">⚙ mechanism // selection → gears</div>
        <GearsScene gearAngle={gearAngle} />
      </div>

      <div className="sos-field" style={{ marginTop: 18 }}>
        <label className="sos-label">// class</label>
        <div className="sos-pills">
          {["11", "12"].map(c => (
            <div key={c} className={`sos-pill ${data.class === c ? "selected" : ""}`} onClick={() => onChange("class", c)}>Class {c}</div>
          ))}
        </div>
      </div>

      <div className="sos-field">
        <label className="sos-label">// stream</label>
        <div className="sos-pills">
          {["PCB", "PCM", "Commerce", "Arts"].map(s => (
            <div key={s} className={`sos-pill ${data.stream === s ? "selected" : ""}`} onClick={() => onChange("stream", s)}>{s}</div>
          ))}
        </div>
      </div>

      <div className="sos-field">
        <label className="sos-label">// school name</label>
        <input className="sos-input" placeholder="e.g. DPS RK Puram" value={data.school || ""} onChange={e => onChange("school", e.target.value)} />
      </div>
    </div>
  );
}

function Step2({ data, onChange }) {
  const [dropped, setDropped] = useState(false);
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    onChange("photo", url);
    setDropped(false);
    setTimeout(() => setDropped(true), 50);
  };

  return (
    <div>
      <div className="sos-machine">
        <div className="sos-machine-label">⚙ mechanism // photo upload → shutter drop</div>
        <PhotoScene dropped={dropped} />
      </div>

      <div className="sos-field" style={{ marginTop: 18 }}>
        <label className="sos-label">// profile photo</label>
        <div
          className={`photo-upload-zone ${data.photo ? "has-photo" : ""}`}
          onClick={() => fileRef.current.click()}
        >
          <input type="file" ref={fileRef} accept="image/*" onChange={handleFile} />
          {data.photo ? (
            <>
              <img src={data.photo} alt="preview" className="photo-preview" />
              <div className="photo-upload-text">tap to change</div>
            </>
          ) : (
            <>
              <div className="photo-upload-icon">📸</div>
              <div className="photo-upload-text">tap to upload profile photo</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Step3({ data, onChange }) {
  const bioLen = (data.bio || "").length;
  const fillPct = Math.min(100, (bioLen / 200) * 100);

  const exams = ["NEET 2025", "NEET 2026", "AIIMS", "JIPMER", "JEE Main", "JEE Advanced", "CUET"];

  return (
    <div>
      <div className="sos-field">
        <label className="sos-label">// target exam</label>
        <div className="sos-pills">
          {exams.map(ex => (
            <div key={ex} className={`sos-pill ${data.exam === ex ? "selected" : ""}`} onClick={() => onChange("exam", ex)}>{ex}</div>
          ))}
        </div>
      </div>

      <div className="sos-machine" style={{ marginTop: 4 }}>
        <div className="sos-machine-label">⚙ mechanism // bio length → flask fill</div>
        <LiquidScene fillPct={fillPct} />
      </div>

      <div className="sos-field" style={{ marginTop: 18 }}>
        <label className="sos-label">// motivation / bio <span style={{ color: "var(--teal)" }}>{bioLen}/200</span></label>
        <textarea
          className="sos-input"
          placeholder="What drives you to study? What's your dream?"
          value={data.bio || ""}
          onChange={e => onChange("bio", e.target.value.slice(0, 200))}
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StudyOSOnboarding() {
  const [step, setStep] = useState(0); // 0,1,2 = steps; 3 = done
  const [data, setData] = useState({});
  const [leverSwung, setLeverSwung] = useState(false);

  // Inject styles
  useEffect(() => {
    const tag = document.createElement("style");
    tag.textContent = styles;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  const change = (k, v) => setData(d => ({ ...d, [k]: v }));

  const canNext = () => {
    if (step === 0) return data.name && data.class && data.stream && data.school;
    if (step === 1) return true; // photo optional
    if (step === 2) return data.exam;
    return false;
  };

  const handleNext = () => {
    if (step < 2) setStep(s => s + 1);
    else {
      setLeverSwung(true);
      setTimeout(() => setStep(3), 700);
    }
  };

  const stepLabels = ["Identity", "Photo", "Mission"];
  const totalSteps = 3;

  if (step === 3) {
    return (
      <div className="sos-root">
        <div className="sos-inner">
          <div className="sos-logo">StudyOS</div>
          <div className="sos-done">
            <div className="sos-done-icon">🚀</div>
            <div className="sos-done-title">System Initialized</div>
            <div className="sos-done-sub">
              Welcome, {data.name || "Scholar"}.<br />
              Target locked: <span style={{ color: "var(--pink)" }}>{data.exam || "your exam"}</span><br />
              The machine is ready. Let's build something great.
            </div>
            <div style={{ marginTop: 32, padding: "16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.8, textAlign: "left" }}>
              {data.photo && <img src={data.photo} alt="" style={{ width: 48, height: 48, borderRadius: "50%", float: "right", marginLeft: 8, border: "2px solid var(--pink)" }} />}
              <span style={{ color: "var(--purple)" }}>name:</span> {data.name}<br />
              <span style={{ color: "var(--purple)" }}>class:</span> {data.class} · <span style={{ color: "var(--purple)" }}>stream:</span> {data.stream}<br />
              <span style={{ color: "var(--purple)" }}>school:</span> {data.school}<br />
              <span style={{ color: "var(--purple)" }}>exam:</span> {data.exam}<br />
              {data.bio && <><span style={{ color: "var(--purple)" }}>bio:</span> {data.bio}</>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sos-root">
      <div className="sos-inner">
        <div className="sos-logo">StudyOS</div>
        <div className="sos-tagline">// onboarding_sequence.init</div>

        {/* Step dots */}
        <div className="sos-steps">
          {stepLabels.map((label, i) => (
            <>
              <div key={`dot-${i}`} className={`sos-step-dot ${i === step ? "active" : i < step ? "done" : ""}`} title={label} />
              {i < stepLabels.length - 1 && (
                <div key={`line-${i}`} className="sos-step-line">
                  <div className="sos-step-line-fill" style={{ width: step > i ? "100%" : "0%" }} />
                </div>
              )}
            </>
          ))}
        </div>

        <div className="sos-card">
          <div className="sos-section-title">
            step_{step + 1} // {stepLabels[step].toLowerCase()}
          </div>

          {step === 0 && <Step1 data={data} onChange={change} />}
          {step === 1 && <Step2 data={data} onChange={change} />}
          {step === 2 && <Step3 data={data} onChange={change} />}

          {/* Lever for final step */}
          {step === 2 && (
            <div className="sos-machine" style={{ marginTop: 20 }}>
              <div className="sos-machine-label">⚙ mechanism // submit → lever swing</div>
              <LeverScene swung={leverSwung} />
            </div>
          )}

          <button
            className="sos-btn"
            onClick={handleNext}
            disabled={!canNext()}
          >
            {step < 2 ? `Next → ${stepLabels[step + 1]}` : "⚡ Let's Go"}
          </button>
        </div>

        <div style={{ marginTop: 16, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)" }}>
          step {step + 1} of {totalSteps} · studyos v0.1
        </div>
      </div>
    </div>
  );
}
