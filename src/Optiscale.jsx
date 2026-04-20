import { useEffect, useRef, useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Karla:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :root{
    --bg:#060b1e; --bg-2:#0a1230; --bg-3:#0d1840;
    --ink:#e9ecff; --ink-dim:#a5acd0; --ink-mute:#6a719a;
    --line:rgba(255,255,255,0.08); --line-2:rgba(255,255,255,0.14);
    --blue:#2d7aff; --blue-2:#5b96ff; --blue-soft:rgba(45,122,255,0.12);
    --green:#39d18b; --amber:#f5b841; --red:#ff5a6a;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{background:var(--bg); color:var(--ink); font-family:'Karla', system-ui, sans-serif; font-size:16px; line-height:1.6; -webkit-font-smoothing:antialiased; overflow-x:hidden}
  h1,h2,h3,h4{font-family:'Outfit', system-ui, sans-serif; font-weight:800; letter-spacing:-0.02em; margin:0}
  .mono{font-family:'JetBrains Mono', monospace}

  .lens-bg{position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden}
  .lens-bg svg{position:absolute; opacity:0.18}
  .lens-bg .l1{top:-180px; right:-200px; width:680px; height:680px; opacity:0.22}
  .lens-bg .l2{top:900px; left:-300px; width:780px; height:780px; opacity:0.12}
  .lens-bg .l3{top:2200px; right:-240px; width:620px; height:620px; opacity:0.14}
  .lens-bg .l4{top:3600px; left:-180px; width:520px; height:520px; opacity:0.12}
  .grain{position:fixed; inset:0; pointer-events:none; z-index:1;
    background:
      radial-gradient(ellipse 80% 50% at 50% -10%, rgba(45,122,255,0.15), transparent 60%),
      radial-gradient(ellipse 60% 40% at 90% 30%, rgba(91,150,255,0.08), transparent 60%);
  }
  .shell{position:relative; z-index:2; max-width:1240px; margin:0 auto; padding:0 32px}

  nav.top{position:sticky; top:0; z-index:50; backdrop-filter:blur(14px); background:rgba(6,11,30,0.72); border-bottom:1px solid var(--line)}
  .nav-row{display:flex; align-items:center; justify-content:space-between; height:76px}
  .logo{display:flex; align-items:center; gap:10px; font-family:'Outfit'; font-weight:800; font-size:22px; letter-spacing:-0.02em}
  .logo .dot{width:28px; height:28px; border-radius:50%; border:2px solid var(--blue); position:relative; display:grid; place-items:center}
  .logo .dot::after{content:""; width:10px; height:10px; border-radius:50%; background:var(--blue); box-shadow:0 0 18px rgba(45,122,255,0.8)}
  .logo b{color:#fff}
  .logo .hl{color:var(--blue)}
  .nav-links{display:flex; gap:36px; align-items:center}
  .nav-links a{color:var(--ink-dim); text-decoration:none; font-size:15px; font-weight:500; transition:color .2s}
  .nav-links a:hover{color:var(--ink)}
  .nav-cta{display:flex; align-items:center; gap:14px}
  .btn{display:inline-flex; align-items:center; gap:8px; padding:12px 22px; border-radius:10px; font-family:'Outfit'; font-weight:600; font-size:15px; cursor:pointer; border:0; text-decoration:none; transition:transform .15s, box-shadow .2s, background .2s}
  .btn-primary{background:var(--blue); color:#fff; box-shadow:0 8px 24px -8px rgba(45,122,255,0.6), inset 0 1px 0 rgba(255,255,255,0.2); position:relative; overflow:hidden}
  .btn-primary:hover{transform:translateY(-1px); box-shadow:0 14px 32px -10px rgba(45,122,255,0.8)}
  .btn-primary::after{content:""; position:absolute; inset:0; background:linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent); transform:translateX(-120%); transition:transform .8s}
  .btn-primary:hover::after{transform:translateX(120%)}
  .btn-ghost{color:var(--ink); background:transparent; border:1px solid var(--line-2)}
  .btn-ghost:hover{background:rgba(255,255,255,0.04)}

  .hero{padding:80px 0 120px; position:relative}
  .hero-grid{display:grid; grid-template-columns:1.05fr 1fr; gap:60px; align-items:center}
  .eyebrow{display:inline-flex; align-items:center; gap:10px; padding:7px 14px; border-radius:100px; border:1px solid var(--line-2); background:rgba(255,255,255,0.03); font-size:13px; color:var(--ink-dim); font-family:'JetBrains Mono'; letter-spacing:0.02em; position:relative; overflow:hidden}
  .eyebrow::before{content:""; position:absolute; inset:0; background:linear-gradient(90deg, transparent, rgba(45,122,255,0.25), transparent); transform:translateX(-100%); animation:shimmer 4s ease-in-out infinite}
  .eyebrow .pulse{width:7px; height:7px; border-radius:50%; background:var(--green); box-shadow:0 0 0 0 rgba(57,209,139,0.5); animation:pulse 2s infinite}
  @keyframes pulse{0%{box-shadow:0 0 0 0 rgba(57,209,139,0.5)} 70%{box-shadow:0 0 0 10px rgba(57,209,139,0)} 100%{box-shadow:0 0 0 0 rgba(57,209,139,0)}}
  @keyframes shimmer{0%{transform:translateX(-100%)} 50%{transform:translateX(200%)} 100%{transform:translateX(200%)}}

  .title-word{display:inline-block; opacity:0; transform:translateY(40px) rotate(2deg); animation:wordIn .9s cubic-bezier(.22,.98,.3,1.02) forwards}
  @keyframes wordIn{to{opacity:1; transform:translateY(0) rotate(0)}}

  .mockup-anim{animation:mockupFloat 7s ease-in-out infinite}
  @keyframes mockupFloat{0%,100%{transform:rotateY(-6deg) rotateX(4deg) translateY(0)} 50%{transform:rotateY(-6deg) rotateX(4deg) translateY(-10px)}}

  .spark .line{stroke-dasharray:500; stroke-dashoffset:500; animation:draw 2.4s ease-out .8s forwards}
  .spark .line.delay{animation-delay:1.2s}
  .spark .dot-s{opacity:0; animation:dotIn .4s ease-out forwards}
  .spark .dot-s.d1{animation-delay:2.6s}
  .spark .dot-s.d2{animation-delay:2.9s}
  @keyframes draw{to{stroke-dashoffset:0}}
  @keyframes dotIn{to{opacity:1}}

  .delta-up-anim{animation:deltaGlow 3s ease-in-out 1.5s infinite}
  @keyframes deltaGlow{0%,100%{text-shadow:0 0 0 rgba(245,184,65,0)} 50%{text-shadow:0 0 14px rgba(245,184,65,0.6)}}

  .tag-anim{animation:tagBreathe 3.5s ease-in-out infinite}
  @keyframes tagBreathe{0%,100%{box-shadow:0 0 0 0 rgba(57,209,139,0)} 50%{box-shadow:0 0 24px -4px rgba(57,209,139,0.35)}}

  .step .num{transition:transform .4s, box-shadow .4s, background .3s, color .3s}
  .step.active .num{background:var(--blue); color:#fff; transform:scale(1.08); box-shadow:0 0 0 6px var(--bg), 0 0 30px rgba(45,122,255,0.6)}

  .f-card .f-icon{transition:transform .4s cubic-bezier(.2,1.3,.5,1), background .3s}
  .f-card:hover .f-icon{transform:translateY(-4px) rotate(-6deg) scale(1.08); background:rgba(45,122,255,0.22)}

  .avatar-anim{animation:avatarGlow 3s ease-in-out infinite}
  @keyframes avatarGlow{0%,100%{box-shadow:0 0 0 0 rgba(45,122,255,0)} 50%{box-shadow:0 0 22px rgba(45,122,255,0.5)}}

  h1.hero-title{font-size:68px; line-height:1.04; margin:24px 0 24px; max-width:620px}
  h1.hero-title em{font-style:normal; color:var(--blue); position:relative}
  h1.hero-title em::after{content:""; position:absolute; left:0; right:0; bottom:6px; height:10px; background:var(--blue-soft); z-index:-1; border-radius:4px}
  .hero p.lead{font-size:19px; color:var(--ink-dim); max-width:520px; margin:0 0 36px}
  .hero-ctas{display:flex; gap:14px; align-items:center; flex-wrap:wrap}
  .hero-meta{margin-top:40px; display:flex; gap:36px; align-items:center; flex-wrap:wrap}
  .hero-meta .item{display:flex; gap:10px; align-items:center; color:var(--ink-dim); font-size:14px}
  .hero-meta .item svg{color:var(--blue)}

  .mockup-wrap{position:relative; perspective:1400px}
  .mockup{background:linear-gradient(180deg, #0e1744 0%, #0a1230 100%); border:1px solid var(--line-2); border-radius:20px; padding:22px; box-shadow:0 60px 120px -30px rgba(0,0,0,0.8), 0 24px 60px -20px rgba(45,122,255,0.25), inset 0 1px 0 rgba(255,255,255,0.06); transform-style:preserve-3d}
  .mockup-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:18px}
  .dots{display:flex; gap:6px}
  .dots span{width:11px; height:11px; border-radius:50%; background:rgba(255,255,255,0.12)}
  .dots span:nth-child(1){background:#ff5a6a}
  .dots span:nth-child(2){background:#f5b841}
  .dots span:nth-child(3){background:#39d18b}
  .url-bar{flex:1; margin:0 18px; height:28px; border-radius:8px; background:rgba(255,255,255,0.05); display:flex; align-items:center; padding:0 12px; font-family:'JetBrains Mono'; font-size:11px; color:var(--ink-mute)}
  .url-bar .lock{margin-right:8px; color:var(--green)}

  .patient-row{display:flex; align-items:center; justify-content:space-between; padding:14px 16px; background:rgba(255,255,255,0.03); border:1px solid var(--line); border-radius:12px; margin-bottom:16px}
  .avatar{width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg,#2d7aff,#5b96ff); display:grid; place-items:center; font-family:'Outfit'; font-weight:700; color:#fff; font-size:15px}
  .patient-meta{flex:1; margin-left:12px}
  .patient-meta .name{font-family:'Outfit'; font-weight:600; font-size:15px; color:#fff}
  .patient-meta .sub{font-size:12px; color:var(--ink-mute); font-family:'JetBrains Mono'}
  .tag{padding:4px 10px; border-radius:100px; background:rgba(57,209,139,0.12); color:var(--green); font-size:11px; font-family:'JetBrains Mono'; font-weight:600; letter-spacing:0.02em}

  .eye-grid{display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px}
  .eye-card{background:rgba(255,255,255,0.03); border:1px solid var(--line); border-radius:12px; padding:14px 16px}
  .eye-card .eye-label{display:flex; align-items:center; justify-content:space-between; margin-bottom:12px}
  .eye-card .eye-label .code{font-family:'Outfit'; font-weight:700; color:#fff; font-size:13px; letter-spacing:0.06em}
  .eye-card .eye-label .side{font-size:10px; color:var(--ink-mute); font-family:'JetBrains Mono'}
  .rx-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:8px}
  .rx-cell .lbl{font-size:9px; color:var(--ink-mute); font-family:'JetBrains Mono'; letter-spacing:0.08em; text-transform:uppercase}
  .rx-cell .val{font-family:'Outfit'; font-weight:700; font-size:17px; color:#fff; margin-top:2px; letter-spacing:-0.02em}
  .rx-cell .delta{font-family:'JetBrains Mono'; font-size:10px; margin-top:3px; display:inline-flex; align-items:center; gap:3px}
  .delta.up{color:var(--amber)}
  .delta.stable{color:var(--green)}
  .delta.danger{color:var(--red)}

  .trend-card{background:rgba(255,255,255,0.03); border:1px solid var(--line); border-radius:12px; padding:16px}
  .trend-head{display:flex; justify-content:space-between; align-items:center; margin-bottom:14px}
  .trend-head .t{font-family:'Outfit'; font-weight:600; font-size:13px; color:#fff}
  .trend-head .legend{display:flex; gap:10px; font-size:10px; color:var(--ink-mute); font-family:'JetBrains Mono'}
  .trend-head .legend span{display:inline-flex; align-items:center; gap:4px}
  .trend-head .legend i{width:8px; height:2px; display:inline-block}
  .spark{height:54px; width:100%; display:block}

  .floater{position:absolute; left:-40px; bottom:40px; background:#0e1744; border:1px solid var(--line-2); border-radius:14px; padding:14px 18px; display:flex; align-items:center; gap:12px; box-shadow:0 20px 50px -20px rgba(0,0,0,0.8); animation:float 4s ease-in-out infinite}
  .floater .icn{width:36px; height:36px; border-radius:50%; background:rgba(57,209,139,0.15); color:var(--green); display:grid; place-items:center}
  .floater .t{font-family:'Outfit'; font-weight:600; font-size:13px; color:#fff}
  .floater .s{font-size:11px; color:var(--ink-mute); font-family:'JetBrains Mono'}
  @keyframes float{0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)}}

  .floater-2{position:absolute; right:-24px; top:30px; background:#0e1744; border:1px solid var(--line-2); border-radius:14px; padding:12px 16px; box-shadow:0 20px 50px -20px rgba(0,0,0,0.8); animation:float 4.6s ease-in-out infinite; animation-delay:-1.5s; display:flex; align-items:center; gap:10px}
  .floater-2 .swatch{width:10px; height:10px; border-radius:50%; background:var(--blue); box-shadow:0 0 14px var(--blue)}

  section{padding:120px 0; position:relative}
  .section-head{text-align:center; max-width:720px; margin:0 auto 64px}
  .section-head .kicker{font-family:'JetBrains Mono'; font-size:13px; color:var(--blue); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:14px}
  .section-head h2{font-size:52px; line-height:1.08; margin-bottom:18px}
  .section-head p{font-size:18px; color:var(--ink-dim); margin:0}

  .problem-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:20px}
  .p-card{background:linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border:1px solid var(--line); border-radius:18px; padding:32px; position:relative; overflow:hidden; transition:transform .3s, border-color .3s}
  .p-card:hover{transform:translateY(-4px); border-color:var(--line-2)}
  .p-card .n{font-family:'JetBrains Mono'; font-size:12px; color:var(--ink-mute); letter-spacing:0.1em; margin-bottom:24px}
  .p-card h3{font-size:22px; margin-bottom:12px; color:#fff}
  .p-card p{color:var(--ink-dim); font-size:15px; margin:0}
  .p-illus{height:120px; margin-bottom:24px; border-radius:10px;
    background: repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 9px), rgba(255,255,255,0.02);
    border:1px dashed var(--line-2); display:grid; place-items:center;
    font-family:'JetBrains Mono'; font-size:11px; color:var(--ink-mute); letter-spacing:0.08em; text-align:center}

  .features-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:16px}
  .f-card{background:linear-gradient(180deg, rgba(255,255,255,0.025), transparent); border:1px solid var(--line); border-radius:18px; padding:32px 28px; transition:transform .3s, border-color .3s; position:relative}
  .f-card:hover{transform:translateY(-4px); border-color:var(--blue); background:linear-gradient(180deg, rgba(45,122,255,0.06), transparent)}
  .f-icon{width:46px; height:46px; border-radius:12px; background:var(--blue-soft); color:var(--blue); display:grid; place-items:center; margin-bottom:22px; border:1px solid rgba(45,122,255,0.25)}
  .f-card h3{font-size:19px; color:#fff; margin-bottom:8px}
  .f-card p{color:var(--ink-dim); font-size:14.5px; margin:0; line-height:1.55}
  .f-idx{font-family:'JetBrains Mono'; font-size:11px; color:var(--ink-mute); letter-spacing:0.1em; position:absolute; top:28px; right:28px}

  .how-wrap{max-width:820px; margin:0 auto; position:relative}
  .how-wrap::before{content:""; position:absolute; left:31px; top:40px; bottom:40px; width:2px; background:linear-gradient(180deg, transparent, var(--blue) 10%, var(--blue) 90%, transparent)}
  .step{display:grid; grid-template-columns:64px 1fr; gap:28px; margin-bottom:36px; position:relative}
  .step:last-child{margin-bottom:0}
  .step .num{width:64px; height:64px; border-radius:50%; background:var(--bg-2); border:2px solid var(--blue); display:grid; place-items:center; font-family:'Outfit'; font-weight:800; font-size:22px; color:var(--blue); position:relative; z-index:2; box-shadow:0 0 0 6px var(--bg)}
  .step .body{padding-top:10px}
  .step .body h3{font-size:24px; color:#fff; margin-bottom:8px}
  .step .body p{color:var(--ink-dim); font-size:15.5px; margin:0 0 14px; max-width:540px}
  .step .chip{display:inline-flex; gap:8px; padding:6px 12px; border-radius:8px; background:rgba(255,255,255,0.04); border:1px solid var(--line); font-family:'JetBrains Mono'; font-size:12px; color:var(--ink-dim)}

  .forwho{background:linear-gradient(180deg, var(--bg-2), rgba(14,23,68,0.4)); border:1px solid var(--line); border-radius:24px; overflow:hidden; display:grid; grid-template-columns:1.1fr 1fr}
  .forwho .left{padding:56px}
  .forwho .left h2{font-size:38px; margin-bottom:22px}
  .forwho ul{list-style:none; padding:0; margin:0; display:grid; gap:14px}
  .forwho li{display:flex; gap:12px; align-items:flex-start; font-size:16px; color:var(--ink)}
  .forwho li .tick{flex:0 0 24px; width:24px; height:24px; border-radius:50%; background:rgba(57,209,139,0.14); color:var(--green); display:grid; place-items:center; margin-top:1px}
  .forwho .right{background:radial-gradient(circle at 30% 20%, rgba(45,122,255,0.22), transparent 60%), linear-gradient(180deg, #0b1436, #070e24); padding:56px; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; border-left:1px solid var(--line); position:relative; overflow:hidden}
  .forwho .right::before{content:""; position:absolute; width:400px; height:400px; border-radius:50%; border:1px solid rgba(45,122,255,0.18); top:-120px; right:-120px}
  .forwho .right::after{content:""; position:absolute; width:260px; height:260px; border-radius:50%; border:1px solid rgba(45,122,255,0.28); top:-20px; right:-40px}
  .forwho .right .badge{font-family:'JetBrains Mono'; font-size:12px; color:var(--blue); letter-spacing:0.14em; margin-bottom:18px; position:relative; z-index:2}
  .forwho .right h3{font-size:30px; color:#fff; line-height:1.15; margin-bottom:14px; position:relative; z-index:2}
  .forwho .right .loc{font-size:15px; color:var(--ink-dim); position:relative; z-index:2; margin-bottom:28px}
  .forwho .right .quote{font-size:15px; color:var(--ink); font-style:italic; line-height:1.5; border-left:2px solid var(--blue); padding-left:16px; position:relative; z-index:2; max-width:340px}

  .cta-band{position:relative; background:linear-gradient(135deg, #0e1a4a 0%, #0a1230 100%); border:1px solid var(--line); border-radius:24px; padding:72px 56px; overflow:hidden; text-align:center}
  .cta-band::before{content:""; position:absolute; inset:0; background:radial-gradient(ellipse 50% 60% at 50% 120%, rgba(45,122,255,0.35), transparent 60%)}
  .cta-band::after{content:""; position:absolute; width:600px; height:600px; border-radius:50%; border:1px solid rgba(45,122,255,0.15); top:50%; left:50%; transform:translate(-50%,-50%)}
  .cta-band > *{position:relative; z-index:2}
  .cta-band h2{font-size:48px; margin-bottom:16px}
  .cta-band p{color:var(--ink-dim); font-size:18px; max-width:520px; margin:0 auto 32px}

  footer{padding:48px 0 60px; border-top:1px solid var(--line); margin-top:60px}
  .foot-row{display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap}
  .foot-row .small{color:var(--ink-mute); font-size:13px; font-family:'JetBrains Mono'}
  .foot-links{display:flex; gap:28px}
  .foot-links a{color:var(--ink-dim); text-decoration:none; font-size:14px}

  .reveal{opacity:0; transform:translateY(24px); transition:opacity .8s ease, transform .8s cubic-bezier(.22,.98,.3,1.02)}
  .reveal.in{opacity:1; transform:none}

  @media (max-width: 960px){
    .hero-grid{grid-template-columns:1fr}
    h1.hero-title{font-size:44px}
    .section-head h2{font-size:34px}
    .problem-grid, .features-grid{grid-template-columns:1fr}
    .forwho{grid-template-columns:1fr}
    .forwho .right{border-left:0; border-top:1px solid var(--line)}
    .nav-links{display:none}
    .mockup-anim{transform:none !important}
    .floater{left:0}
    .floater-2{right:0}
  }
`;

// ─── ICONS ───
const Arrow = ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);
const Play = () => <svg width="14" height="14" viewBox="0 0 24 24"><polygon points="6,4 20,12 6,20" fill="currentColor" /></svg>;
const Check = ({ s = 12 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
);
const IconShield = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" /></svg>;
const IconMonitor = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18" /></svg>;

const FeatureIcons = {
  lock: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>,
  user: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></svg>,
  file: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M9 14h6M9 17h4" /></svg>,
  chart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-5" /></svg>,
  globe: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" /></svg>,
  report: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13l-4 4-2-2" /></svg>,
};

// ─── SCROLL REVEAL ───
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ─── LOGO ───
function Logo() {
  return (
      <div className="logo">
        <span className="dot" />
        <span><b>OPTI</b><span className="hl">SCALE</span></span>
      </div>
  );
}

// ─── LENS BG ───
function LensBg() {
  const rings = [
    { cls: "l1", rs: [40, 80, 120, 160, 198] },
    { cls: "l2", rs: [60, 110, 160, 198] },
    { cls: "l3", rs: [40, 90, 140, 198] },
    { cls: "l4", rs: [50, 100, 160, 198] },
  ];
  return (
      <div className="lens-bg" aria-hidden="true">
        {rings.map((l, i) => (
            <svg key={i} className={l.cls} viewBox="0 0 400 400" fill="none" stroke="#2d7aff" strokeWidth="0.6">
              {l.rs.map((r) => <circle key={r} cx="200" cy="200" r={r} />)}
            </svg>
        ))}
      </div>
  );
}

// ─── NAV ───
function Nav() {
  return (
      <nav className="top">
        <div className="shell nav-row">
          <Logo />
          <div className="nav-links">
            <a href="#problema">Problema</a>
            <a href="#funciones">Funciones</a>
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#para-quien">Para quién</a>
          </div>
          <div className="nav-cta">
            <a href="#" className="btn btn-ghost">Iniciar sesión</a>
            <a href="#cta" className="btn btn-primary">Comenzar <Arrow /></a>
          </div>
        </div>
      </nav>
  );
}

// ─── MOCKUP ───
function RxCell({ lbl, val, delta, kind = "stable" }) {
  return (
      <div className="rx-cell">
        <div className="lbl">{lbl}</div>
        <div className="val">{val}</div>
        <div className={`delta ${kind}`}>{delta}</div>
      </div>
  );
}

function EyeCardMockup({ code, side, cells }) {
  return (
      <div className="eye-card">
        <div className="eye-label">
          <span className="code">{code}</span>
          <span className="side">{side}</span>
        </div>
        <div className="rx-grid">
          {cells.map((c, i) => <RxCell key={i} {...c} />)}
        </div>
      </div>
  );
}

function Mockup() {
  return (
      <div className="mockup-wrap reveal">
        <div className="mockup mockup-anim">
          <div className="mockup-head">
            <div className="dots"><span /><span /><span /></div>
            <div className="url-bar"><span className="lock">●</span> app.optiscale.mx/pacientes/mariana-s</div>
            <div style={{ width: 48 }} />
          </div>

          <div className="patient-row">
            <div className="avatar avatar-anim">MS</div>
            <div className="patient-meta">
              <div className="name">Mariana Salazar</div>
              <div className="sub">EXP #0482 · 34 años · 4 visitas</div>
            </div>
            <div className="tag tag-anim">● EVOLUCIÓN ESTABLE</div>
          </div>

          <div className="eye-grid">
            <EyeCardMockup code="OD" side="OJO DERECHO" cells={[
              { lbl: "ESF", val: "-2.25", delta: "● 0.00", kind: "stable" },
              { lbl: "CIL", val: "-0.75", delta: "▲ 0.25", kind: "up" },
              { lbl: "EJE", val: "175°",  delta: "● —",    kind: "stable" },
              { lbl: "ADD", val: "+1.00", delta: "● 0.00", kind: "stable" },
            ]} />
            <EyeCardMockup code="OI" side="OJO IZQUIERDO" cells={[
              { lbl: "ESF", val: "-2.50", delta: "▲ 0.25", kind: "up" },
              { lbl: "CIL", val: "-1.00", delta: "● 0.00", kind: "stable" },
              { lbl: "EJE", val: "10°",   delta: "● —",    kind: "stable" },
              { lbl: "ADD", val: "+1.00", delta: "● 0.00", kind: "stable" },
            ]} />
          </div>

          <div className="trend-card">
            <div className="trend-head">
              <div className="t">Evolución · últimas 4 visitas</div>
              <div className="legend">
                <span><i style={{ background: "#5b96ff" }} />OD</span>
                <span><i style={{ background: "#39d18b" }} />OI</span>
              </div>
            </div>
            <svg className="spark" viewBox="0 0 300 54" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#5b96ff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#5b96ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,38 L60,34 L120,32 L180,30 L240,28 L300,26 L300,54 L0,54 Z" fill="url(#g1)" />
              <path className="line" d="M0,38 L60,34 L120,32 L180,30 L240,28 L300,26" stroke="#5b96ff" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path className="line delay" d="M0,40 L60,39 L120,36 L180,34 L240,32 L300,30" stroke="#39d18b" strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle className="dot-s d1" cx="300" cy="26" r="3" fill="#5b96ff" />
              <circle className="dot-s d2" cx="300" cy="30" r="3" fill="#39d18b" />
            </svg>
          </div>
        </div>

        <div className="floater">
          <div className="icn"><Check s={18} /></div>
          <div>
            <div className="t">Evolución estable</div>
            <div className="s">análisis · 2 visitas</div>
          </div>
        </div>

        <div className="floater-2">
          <span className="swatch" />
          <div>
            <div className="t" style={{ fontSize: 12 }}>Sincronizado</div>
            <div className="s" style={{ fontSize: 10 }}>hace 2 seg</div>
          </div>
        </div>
      </div>
  );
}

// ─── HERO ───
function Hero() {
  const words = ["El", "historial", "visual", "de", "tus", "pacientes,"];
  return (
      <section className="hero">
        <div className="shell hero-grid">
          <div className="reveal">
            <div className="eyebrow"><span className="pulse" /> SOFTWARE CLÍNICO · MÉXICO</div>
            <h1 className="hero-title">
              {words.map((w, i) => (
                  <span key={i} className="title-word" style={{ animationDelay: `${i * 90}ms`, marginRight: "0.28em" }}>{w}</span>
              ))}
              <em><span className="title-word" style={{ animationDelay: "560ms" }}>simplificado</span></em>
              <span className="title-word" style={{ animationDelay: "640ms" }}>.</span>
            </h1>
            <p className="lead">Reemplaza el papel y Excel. Registra graduaciones, compara visitas automáticamente y detecta cambios en la visión de tus pacientes con un sistema de semáforo inteligente.</p>
            <div className="hero-ctas">
              <a href="#cta" className="btn btn-primary">Comenzar gratis <Arrow /></a>
              <a href="#como-funciona" className="btn btn-ghost"><Play /> Ver demo</a>
            </div>
            <div className="hero-meta">
              <div className="item"><IconShield /> 100% en la nube</div>
              <div className="item"><IconMonitor /> Sin instalación</div>
              <div className="item"><Check s={16} /> Listo en minutos</div>
            </div>
          </div>
          <Mockup />
        </div>
      </section>
  );
}

// ─── PROBLEM ───
function Problem() {
  const cards = [
    { n: "01 · MÉTODO ANTIGUO", tag: "archivo · papel · expediente físico", t: "Expedientes en papel", d: "Carpetas que se pierden, se mojan, se traspapelan. Buscar la visita anterior de un paciente toma minutos que no tienes." },
    { n: "02 · EXCEL CAÓTICO",  tag: "hoja de cálculo · .xlsx · sin estructura", t: "Hojas sin estructura", d: "Cada optometrista registra como quiere. Sin campos validados, sin historial, sin forma de comparar entre visitas." },
    { n: "03 · PACIENTE A CIEGAS", tag: "paciente · sin contexto · sin reporte", t: "Sin reporte de evolución", d: "El paciente sale sin saber si su vista mejoró, empeoró o se mantuvo. No hay visibilidad, no hay confianza." },
  ];
  return (
      <section id="problema">
        <div className="shell">
          <div className="section-head reveal">
            <div className="kicker">EL PROBLEMA</div>
            <h2>Las ópticas pierden tiempo —<br />y pierden pacientes.</h2>
            <p>La mayoría siguen usando métodos que hacen imposible dar seguimiento a la evolución visual.</p>
          </div>
          <div className="problem-grid">
            {cards.map((c, i) => (
                <div className="p-card reveal" key={i}>
                  <div className="p-illus">{c.tag}</div>
                  <div className="n">{c.n}</div>
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
}

// ─── FEATURES ───
function Features() {
  const feats = [
    { k: "lock",   t: "Inicio de sesión seguro",   d: "Cada optometrista con su propia cuenta. Datos cifrados y aislados por clínica." },
    { k: "user",   t: "Gestión de pacientes",       d: "Agenda, datos personales, antecedentes y notas. Búsqueda instantánea por nombre o expediente." },
    { k: "file",   t: "Registro de consultas",      d: "Formularios validados para ESF, CIL, EJE y ADD en ambos ojos. Imposible equivocarse." },
    { k: "chart",  t: "Evolución automática",       d: "Compara las últimas dos visitas y pinta el resultado con semáforo: ✅ estable, 🟡 leve, 🔴 notable." },
    { k: "globe",  t: "100% en el navegador",       d: "Sin instalación, sin actualizaciones manuales. Funciona en cualquier dispositivo con internet." },
    { k: "report", t: "Reportes para pacientes",    d: "Imprime o envía por WhatsApp un resumen claro de cómo evoluciona la vista de cada paciente." },
  ];
  return (
      <section id="funciones">
        <div className="shell">
          <div className="section-head reveal">
            <div className="kicker">FUNCIONES</div>
            <h2>Todo lo que tu óptica necesita,<br />en un solo lugar.</h2>
            <p>Diseñado con optometristas. Cada función está pensada para el flujo real de una consulta.</p>
          </div>
          <div className="features-grid">
            {feats.map((f, i) => (
                <div className="f-card reveal" key={i}>
                  <span className="f-idx">{String(i + 1).padStart(2, "0")}</span>
                  <div className="f-icon">{FeatureIcons[f.k]}</div>
                  <h3>{f.t}</h3>
                  <p>{f.d}</p>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
}

// ─── HOW IT WORKS ───
function HowItWorks() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const i = refs.current.indexOf(e.target);
          if (i >= 0) setActive(i);
        }
      });
    }, { threshold: 0.55 });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const steps = [
    { t: "Registra al paciente",   d: "Datos básicos, antecedentes y foto opcional. Toma menos de un minuto y queda guardado para siempre.",        c: "◎ datos personales · antecedentes · expediente" },
    { t: "Captura la graduación",  d: "Formulario validado con los cuatro parámetros: esfera, cilindro, eje y adición — para cada ojo.",             c: "OD · OI · ESF · CIL · EJE · ADD" },
    { t: "El sistema compara",     d: "OptiScale calcula la diferencia contra la visita anterior y clasifica con semáforo en tiempo real.",           c: "✓ estable · 🟡 leve aumento · 🔴 aumento notable" },
    { t: "Entrega el reporte",     d: "Exporta un PDF limpio para el paciente. Historial completo accesible desde cualquier dispositivo.",            c: "PDF · WhatsApp · correo" },
  ];

  return (
      <section id="como-funciona">
        <div className="shell">
          <div className="section-head reveal">
            <div className="kicker">CÓMO FUNCIONA</div>
            <h2>De la primera visita al reporte,<br />en cuatro pasos.</h2>
            <p>Sin curva de aprendizaje. Si sabes usar WhatsApp, sabes usar OptiScale.</p>
          </div>
          <div className="how-wrap">
            {steps.map((s, i) => (
                <div className={`step reveal${active === i ? " active" : ""}`} key={i} ref={(el) => (refs.current[i] = el)}>
                  <div className="num">{i + 1}</div>
                  <div className="body">
                    <h3>{s.t}</h3>
                    <p>{s.d}</p>
                    <div className="chip">{s.c}</div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
}

// ─── FOR WHO ───
function ForWho() {
  const items = [
    "Tienes una óptica independiente o pequeña cadena.",
    "Registras graduaciones en papel o en hojas de Excel.",
    "Quieres que tus pacientes regresen y te recomienden.",
    "Buscas diferenciarte de las cadenas grandes.",
    "Trabajas con 1–4 optometristas en tu equipo.",
    "No quieres pelear con software caro y complicado.",
  ];
  return (
      <section id="para-quien">
        <div className="shell">
          <div className="section-head reveal">
            <div className="kicker">PARA QUIÉN</div>
            <h2>Hecho para ópticas independientes<br />que quieren verse profesionales.</h2>
          </div>
          <div className="forwho reveal">
            <div className="left">
              <h2>¿Esto es para ti?</h2>
              <ul>
                {items.map((it, i) => (
                    <li key={i}><span className="tick"><Check /></span> {it}</li>
                ))}
              </ul>
            </div>
            <div className="right">
              <div className="badge">◎ CASO DE USO · PILOTO</div>
              <h3>Óptica Gaffas Correctas</h3>
              <div className="loc">Tuxtla Gutiérrez, Chiapas · México</div>
              <div className="quote">"Antes tardaba diez minutos en encontrar el historial de un paciente. Ahora lo abro y ya tengo su evolución lista para mostrarle."</div>
            </div>
          </div>
        </div>
      </section>
  );
}

// ─── CTA ───
function CTA() {
  return (
      <section id="cta">
        <div className="shell">
          <div className="cta-band reveal">
            <h2>Tu primera consulta digital,<br />a un clic de distancia.</h2>
            <p>Comienza gratis. Sin tarjeta, sin compromisos. Migra tus pacientes en minutos.</p>
            <a href="#" className="btn btn-primary" style={{ padding: "16px 32px", fontSize: 16 }}>Comenzar ahora <Arrow s={16} /></a>
          </div>
        </div>
      </section>
  );
}

// ─── FOOTER ───
function Footer() {
  return (
      <footer>
        <div className="shell foot-row">
          <Logo />
          <div className="foot-links">
            <a href="#">Privacidad</a>
            <a href="#">Términos</a>
            <a href="#">Soporte</a>
            <a href="#">Contacto</a>
          </div>
          <div className="small">© 2026 · Hecho en México</div>
        </div>
      </footer>
  );
}

// ─── APP ───
export default function Landing() {
  useReveal();
  return (
      <>
        <style>{css}</style>
        <LensBg />
        <div className="grain" aria-hidden="true" />
        <Nav />
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <ForWho />
        <CTA />
        <Footer />
      </>
  );
}