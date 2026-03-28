import { useState, useEffect, useRef, useCallback } from "react";

/* ─── FONTS ─────────────────────────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600;700&display=swap');
  `}</style>
);

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --rose:      #F4A0B0;
      --rose-deep: #E8637A;
      --blush:     #FDE8ED;
      --lavender:  #C9B8E8;
      --lav-deep:  #8B6FBF;
      --cream:     #FFF7F0;
      --gold:      #F5C842;
      --coral:     #FF8A7A;
      --text:      #2D1B3D;
      --text-soft: #7B6082;
      --card:      rgba(255,255,255,0.85);
      --glass:     rgba(255,255,255,0.55);
      --shadow:    0 8px 32px rgba(139,111,191,0.18);
      --shadow-sm: 0 3px 12px rgba(139,111,191,0.12);
    }

    body { background: var(--cream); font-family: 'DM Sans', sans-serif; color: var(--text); overflow: hidden; }

    .app-shell {
      width: 100%;
      max-width: 420px;
      height: 100vh;
      max-height: 900px;
      margin: 0 auto;
      position: relative;
      overflow: hidden;
      background: linear-gradient(160deg, #FFF0F5 0%, #F3EEFF 50%, #FFF5E8 100%);
      display: flex;
      flex-direction: column;
      box-shadow: 0 0 80px rgba(200,100,140,0.15);
    }

    /* SCROLLABLE AREA */
    .scroll-area { flex: 1; overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth; }
    .scroll-area::-webkit-scrollbar { display: none; }

    /* BOTTOM NAV */
    .bottom-nav {
      height: 72px;
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(20px);
      border-top: 1px solid rgba(244,160,176,0.2);
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 0 8px;
      flex-shrink: 0;
      position: relative;
      z-index: 100;
    }
    .nav-item {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      cursor: pointer; padding: 8px 12px; border-radius: 16px;
      transition: all 0.25s cubic-bezier(.34,1.56,.64,1);
      border: none; background: none; flex: 1;
    }
    .nav-item.active { background: linear-gradient(135deg, #FDE8ED, #EDE0FF); }
    .nav-item .nav-icon { font-size: 22px; line-height: 1; transition: transform 0.25s cubic-bezier(.34,1.56,.64,1); }
    .nav-item.active .nav-icon { transform: scale(1.2); }
    .nav-label { font-size: 10px; font-weight: 600; color: var(--text-soft); letter-spacing: 0.4px; }
    .nav-item.active .nav-label { color: var(--rose-deep); }

    /* CARDS */
    .card {
      background: var(--card);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 20px;
      box-shadow: var(--shadow-sm);
      border: 1px solid rgba(255,255,255,0.8);
    }
    .card-glass {
      background: var(--glass);
      backdrop-filter: blur(16px);
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.7);
    }

    /* BUTTONS */
    .btn-primary {
      background: linear-gradient(135deg, var(--rose-deep), var(--lav-deep));
      color: white; border: none; border-radius: 16px;
      padding: 14px 28px; font-family: 'DM Sans', sans-serif;
      font-size: 15px; font-weight: 600; cursor: pointer; letter-spacing: 0.3px;
      transition: all 0.25s cubic-bezier(.34,1.56,.64,1);
      box-shadow: 0 4px 20px rgba(232,99,122,0.35);
    }
    .btn-primary:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 28px rgba(232,99,122,0.45); }
    .btn-primary:active { transform: scale(0.97); }

    .btn-ghost {
      background: rgba(255,255,255,0.7); border: 1.5px solid rgba(244,160,176,0.5);
      border-radius: 14px; padding: 12px 22px; font-family: 'DM Sans', sans-serif;
      font-size: 14px; font-weight: 500; color: var(--text); cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-ghost:hover { background: var(--blush); border-color: var(--rose); }

    .btn-icon {
      width: 48px; height: 48px; border-radius: 14px; border: none;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; cursor: pointer; transition: all 0.2s cubic-bezier(.34,1.56,.64,1);
    }

    /* HEADINGS */
    h1, h2 { font-family: 'Playfair Display', serif; }
    .script { font-family: 'Dancing Script', cursive; }

    /* ANIMATIONS */
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes pulse-heart { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
    @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
    @keyframes popIn { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes heartPop { 0%{transform:scale(0) translateY(0);opacity:1} 100%{transform:scale(1.5) translateY(-60px);opacity:0} }
    @keyframes bounce { 0%,100%{transform:translateY(0)} 25%{transform:translateY(-6px)} 75%{transform:translateY(-3px)} }
    @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(232,99,122,0.3)} 50%{box-shadow:0 0 40px rgba(232,99,122,0.6)} }
    @keyframes reveal { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }

    .float { animation: float 3s ease-in-out infinite; }
    .pulse { animation: pulse-heart 1.5s ease-in-out infinite; }
    .fade-in { animation: fadeIn 0.5s ease forwards; }
    .slide-up { animation: slideUp 0.4s cubic-bezier(.34,1.56,.64,1) forwards; }
    .pop-in { animation: popIn 0.4s cubic-bezier(.34,1.56,.64,1) forwards; }
    .bounce { animation: bounce 2s ease-in-out infinite; }

    /* HEARTS BG */
    .hearts-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
    .heart-float {
      position: absolute; font-size: 20px; opacity: 0.08;
      animation: float 4s ease-in-out infinite;
    }

    /* PROGRESS BAR */
    .progress-bar {
      height: 8px; border-radius: 99px;
      background: rgba(139,111,191,0.15);
      overflow: hidden;
    }
    .progress-fill {
      height: 100%; border-radius: 99px;
      background: linear-gradient(90deg, var(--rose-deep), var(--lav-deep));
      transition: width 0.6s cubic-bezier(.34,1.56,.64,1);
    }

    /* BADGE */
    .badge {
      display: inline-flex; align-items: center; gap: 5px;
      background: linear-gradient(135deg, var(--blush), #EDE0FF);
      border-radius: 99px; padding: 5px 12px;
      font-size: 12px; font-weight: 600; color: var(--lav-deep);
      border: 1px solid rgba(201,184,232,0.4);
    }

    /* STREAK */
    .streak-fire { animation: pulse-heart 1s ease-in-out infinite; }

    /* CHAT */
    .chat-bubble {
      max-width: 75%; padding: 10px 16px; border-radius: 20px;
      font-size: 14px; line-height: 1.5; position: relative;
    }
    .chat-bubble.mine {
      background: linear-gradient(135deg, var(--rose-deep), var(--lav-deep));
      color: white; border-bottom-right-radius: 6px; align-self: flex-end;
    }
    .chat-bubble.theirs {
      background: white; color: var(--text);
      border-bottom-left-radius: 6px; align-self: flex-start;
      box-shadow: var(--shadow-sm);
    }

    /* GAME CARD */
    .game-card {
      border-radius: 22px; padding: 18px; cursor: pointer;
      transition: all 0.25s cubic-bezier(.34,1.56,.64,1);
      border: 1px solid rgba(255,255,255,0.8);
      position: relative; overflow: hidden;
    }
    .game-card:hover, .game-card:active { transform: scale(0.97); }

    /* INPUT */
    .love-input {
      width: 100%; padding: 14px 18px; border-radius: 16px;
      border: 1.5px solid rgba(201,184,232,0.4);
      background: rgba(255,255,255,0.7); font-family: 'DM Sans', sans-serif;
      font-size: 14px; color: var(--text); outline: none;
      transition: border-color 0.2s;
    }
    .love-input:focus { border-color: var(--rose-deep); background: white; }

    /* CHOICE BUTTON */
    .choice-btn {
      width: 100%; padding: 16px 20px; border-radius: 18px;
      border: 2px solid transparent; background: white;
      font-family: 'DM Sans', sans-serif; font-size: 14px;
      font-weight: 500; color: var(--text); cursor: pointer;
      text-align: left; transition: all 0.2s;
      box-shadow: var(--shadow-sm);
    }
    .choice-btn:hover { border-color: var(--rose); transform: translateX(4px); }
    .choice-btn.correct { background: linear-gradient(135deg,#d4f7e7,#a8efd1); border-color: #4CAF82; color: #1a5c3a; }
    .choice-btn.wrong { background: linear-gradient(135deg,#fde8e8,#fcc); border-color: #E07070; color: #7a1a1a; }
    .choice-btn.selected { border-color: var(--rose-deep); background: var(--blush); }
    .choice-btn:disabled { cursor: default; }

    /* DARE CARD */
    .dare-card {
      background: linear-gradient(135deg, #fff0f5, #f3eeff);
      border-radius: 28px; padding: 32px 24px;
      text-align: center; border: 1.5px solid rgba(244,160,176,0.3);
      box-shadow: var(--shadow);
    }

    /* SCROLLBAR HIDDEN */
    * { scrollbar-width: none; }

    /* Divider */
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(201,184,232,0.4), transparent);
      margin: 12px 0;
    }

    /* NOTIFICATION DOT */
    .notif-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--rose-deep);
      position: absolute; top: 6px; right: 6px;
      border: 2px solid white;
    }

    /* TAG */
    .tag {
      font-size: 11px; font-weight: 700; letter-spacing: 0.8px;
      text-transform: uppercase; padding: 4px 10px; border-radius: 8px;
    }
  `}</style>
);

/* ─── DATA ───────────────────────────────────────────────────────────── */
const TRIVIA_QUESTIONS = [
  { q: "What does your partner consider their love language?", opts: ["Words of Affirmation","Acts of Service","Physical Touch","Gift Giving"], ans: 0 },
  { q: "What was the first movie you watched together?", opts: ["A romantic comedy","An action movie","A horror film","A documentary"], ans: 0 },
  { q: "Where would your partner most want to travel?", opts: ["Paris, France","Bali, Indonesia","Tokyo, Japan","New York, USA"], ans: 2 },
  { q: "What's your partner's comfort food on a bad day?", opts: ["Ice cream","Pizza","Ramen","Chocolate"], ans: 3 },
  { q: "How does your partner prefer to spend a lazy Sunday?", opts: ["Brunch & walks","Netflix marathon","Reading books","Gaming all day"], ans: 1 },
  { q: "What's your partner's biggest pet peeve?", opts: ["Being late","Loud chewing","Leaving lights on","Messy spaces"], ans: 3 },
  { q: "Which best describes your partner's morning routine?", opts: ["Rise & shine early","Snoozes 5x","Coffee first, then human","Straight to phone"], ans: 1 },
  { q: "What superpower would your partner choose?", opts: ["Time travel","Teleportation","Mind reading","Invisibility"], ans: 1 },
];

const TRUTH_DARE = {
  truth: [
    "What's the first thing you thought when you saw me for the first time? 💭",
    "What's your favorite memory of us together so far? 🌸",
    "What's one thing you wish we did more often? ✨",
    "Describe me in 3 words — be honest! 🎯",
    "What's the most romantic thing you've ever done for someone? 💌",
    "What's a secret you've been too nervous to tell me? 🤫",
    "When did you realize you had feelings for me? 💖",
    "What's your love language and do I speak it well? 💬",
    "What's your biggest fear about our relationship? 🫂",
    "What song reminds you of me and why? 🎵",
    "If we could live anywhere together, where would it be? 🌍",
    "What's the best part about our relationship? 🌺",
  ],
  dare: [
    "Send me a voice note saying 3 things you love about me 🎤",
    "Screenshot your favorite photo of us and send it 📸",
    "Send me a GIF that describes how I make you feel 🐻",
    "Change your phone wallpaper to a photo of us for 24 hours 💝",
    "Text me a poem — even if it's terrible, it's yours 📝",
    "Send me a song that's been making you think of me 🎶",
    "Draw me in 60 seconds and send it — no judgment! 🎨",
    "Tell me something you've never told anyone else 🤫",
    "Do your best impression of me and send a video 😂",
    "Pick a future date night and describe it in detail 🌙",
    "Write me a tiny love letter — right now! 💌",
    "Send me a selfie with your biggest smile 😊",
  ],
};

const WYR_QUESTIONS = [
  { a: "Know the date you'll die", b: "Know how you'll die" },
  { a: "Live in the city forever", b: "Live in the countryside forever" },
  { a: "Never fight with your partner", b: "Always make up perfectly after fights" },
  { a: "Travel the world together", b: "Have a dream home together" },
  { a: "Always know what your partner is feeling", b: "Always be understood by your partner" },
  { a: "Spend every day together", b: "Have perfect quality time once a week" },
  { a: "Slow dance in the rain", b: "Watch the sunset on a mountain" },
  { a: "Receive unexpected gifts", b: "Receive handwritten letters" },
  { a: "Be the one who loves more", b: "Be the one who is loved more" },
  { a: "Have a relationship with no secrets", b: "Have a relationship with total privacy" },
  { a: "Always say 'I love you' first", b: "Hear 'I love you' first every time" },
  { a: "Forget all bad memories", b: "Remember every happy moment vividly" },
];

const CONVO_STARTERS = [
  "If we could freeze one moment from our relationship, which would you pick? 🕰️",
  "What's a dream you've never told anyone that you'd share with me? ✨",
  "If our relationship were a movie, what genre would it be? 🎬",
  "What's the first thing you want to do when we're finally in the same city? 🏙️",
  "If you could give me a gift with no budget limit, what would it be? 🎁",
  "What's something small I do that makes you smile without realizing it? 🌸",
  "If we had a whole week with no plans, how would you want to spend it? 🌴",
  "What's a song that feels like it was written for us? 🎵",
  "When do you feel most connected to me? 💫",
  "What's your favorite thing about the distance being temporary? 🌈",
];

const MINI_CHALLENGES = [
  { icon: "🤳", title: "Mirror Selfie", desc: "Take a selfie making the same silly face. Share in 30 seconds!", time: 30 },
  { icon: "🎵", title: "Hum That Tune", desc: "Hum a song you've sent each other before. Partner guesses!", time: 45 },
  { icon: "✍️", title: "Love in 5 Words", desc: "Describe your partner using exactly 5 words. Send simultaneously!", time: 20 },
  { icon: "🏠", title: "Room Tour Roulette", desc: "Point camera at a random corner of your room. Partner guesses what they see!", time: 15 },
  { icon: "📚", title: "Book Spine Poetry", desc: "Stack 3 books and photograph their spines to make a poem!", time: 60 },
  { icon: "🍕", title: "Snack Battle", desc: "Show your current snack. Vote who has the better one!", time: 20 },
  { icon: "🌅", title: "Sky Watch", desc: "Both go to a window, photograph the sky at the same moment!", time: 10 },
];

const BADGES = [
  { icon: "💌", label: "First Kiss", earned: true },
  { icon: "🔥", label: "7-Day Streak", earned: true },
  { icon: "🧩", label: "Game Master", earned: true },
  { icon: "💬", label: "Chatterbox", earned: true },
  { icon: "🌙", label: "Late Night", earned: false },
  { icon: "🌟", label: "Star Player", earned: false },
  { icon: "💎", label: "Diamond Love", earned: false },
  { icon: "🎯", label: "Truth Seeker", earned: false },
];

/* ─── FLOATING HEARTS ────────────────────────────────────────────────── */
function FloatingHearts() {
  const hearts = ["💗","💕","✨","💖","🌸","💫","💝","🌺"];
  return (
    <div className="hearts-bg">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="heart-float" style={{
          left: `${8 + i * 8}%`,
          top: `${10 + (i % 4) * 20}%`,
          animationDelay: `${i * 0.4}s`,
          animationDuration: `${3 + (i % 3)}s`,
          fontSize: `${14 + (i % 3) * 6}px`,
        }}>
          {hearts[i % hearts.length]}
        </div>
      ))}
    </div>
  );
}

/* ─── HEART BURST ANIMATION ──────────────────────────────────────────── */
function HeartBurst({ x, y, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position:"fixed", left:x, top:y, pointerEvents:"none", zIndex:9999 }}>
      {["💗","💕","💖"].map((h, i) => (
        <div key={i} style={{
          position:"absolute", fontSize:"20px",
          animation: `heartPop 1s ease-out ${i*0.1}s forwards`,
          transform: `rotate(${-20 + i*20}deg)`,
        }}>{h}</div>
      ))}
    </div>
  );
}

/* ─── HOME SCREEN ────────────────────────────────────────────────────── */
function HomeScreen({ setTab }) {
  const [heartBursts, setHeartBursts] = useState([]);
  const [showStarter, setShowStarter] = useState(false);
  const [starter, setStarter] = useState(CONVO_STARTERS[0]);
  const [starterLoading, setStarterLoading] = useState(false);
  const [aiStarter, setAiStarter] = useState(null);

  const addBurst = (e) => {
    const b = { id: Date.now(), x: e.clientX - 10, y: e.clientY - 10 };
    setHeartBursts(p => [...p, b]);
  };

  const getAiStarter = async () => {
    setStarterLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Generate ONE creative, romantic, and emotionally deep conversation starter for a long-distance couple who love each other deeply. 
Make it feel intimate, thoughtful, and unique. It should spark a meaningful conversation.
Use 1-2 emojis. Keep it to 1-2 sentences maximum. Return ONLY the conversation starter, nothing else.`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || CONVO_STARTERS[Math.floor(Math.random()*CONVO_STARTERS.length)];
      setAiStarter(text.trim());
      setShowStarter(true);
    } catch {
      setStarter(CONVO_STARTERS[Math.floor(Math.random()*CONVO_STARTERS.length)]);
      setShowStarter(true);
    }
    setStarterLoading(false);
  };

  return (
    <div className="scroll-area" style={{ padding: "24px 20px 24px" }} onClick={addBurst}>
      <FloatingHearts />
      {heartBursts.map(b => (
        <HeartBurst key={b.id} x={b.x} y={b.y} onDone={() => setHeartBursts(p => p.filter(x => x.id !== b.id))} />
      ))}

      <style>{`@keyframes heartPop{0%{transform:scale(0) translateY(0);opacity:1}100%{transform:scale(1.5) translateY(-60px);opacity:0}}`}</style>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, position:"relative", zIndex:1 }}>
        <div>
          <p style={{ fontSize:12, color:"var(--text-soft)", fontWeight:600, letterSpacing:"1px", textTransform:"uppercase" }}>Good evening ✨</p>
          <h1 style={{ fontSize:26, lineHeight:1.2, marginTop:2 }}>Hey, <span className="script" style={{ color:"var(--rose-deep)", fontSize:30 }}>Mia</span> 💕</h1>
        </div>
        <div style={{ position:"relative" }}>
          <div style={{
            width:50, height:50, borderRadius:"50%",
            background:"linear-gradient(135deg,#F4A0B0,#C9B8E8)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:24, boxShadow:"0 4px 16px rgba(244,160,176,0.4)",
            border:"3px solid white"
          }}>🧡</div>
          <div style={{
            position:"absolute", bottom:-2, right:-2, width:16, height:16, borderRadius:"50%",
            background:"#4CAF82", border:"2px solid white"
          }} />
        </div>
      </div>

      {/* Partner status */}
      <div className="card fade-in" style={{ marginBottom:18, position:"relative", zIndex:1, overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, right:0, width:100, height:100,
          background:"radial-gradient(circle at 70% 30%, rgba(244,160,176,0.15), transparent)",
          borderRadius:"0 24px 0 100%"
        }} />
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ position:"relative" }}>
            <div style={{
              width:56, height:56, borderRadius:"50%",
              background:"linear-gradient(135deg,#C9B8E8,#F4A0B0)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:26, border:"3px solid white",
              boxShadow:"0 4px 16px rgba(201,184,232,0.4)"
            }}>💜</div>
            <div style={{
              position:"absolute", bottom:1, right:1, width:14, height:14,
              borderRadius:"50%", background:"#4CAF82", border:"2px solid white"
            }} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <p style={{ fontWeight:700, fontSize:16 }}>Alex</p>
              <span className="badge" style={{ fontSize:11 }}>Online 💚</span>
            </div>
            <p style={{ fontSize:13, color:"var(--text-soft)", marginTop:2 }}>Last seen: just now · 2,847 km away</p>
          </div>
          <button className="btn-primary" style={{ padding:"10px 16px", fontSize:13 }} onClick={() => setTab("chat")}>
            Chat 💬
          </button>
        </div>
        <div className="divider" style={{ marginTop:14 }} />
        <div style={{ display:"flex", gap:20, paddingTop:4 }}>
          <div style={{ textAlign:"center" }}>
            <p className="script" style={{ fontSize:22, color:"var(--rose-deep)", lineHeight:1 }}>24</p>
            <p style={{ fontSize:11, color:"var(--text-soft)", marginTop:2 }}>days together</p>
          </div>
          <div style={{ textAlign:"center" }}>
            <p className="script" style={{ fontSize:22, color:"var(--lav-deep)", lineHeight:1 }}>🔥 7</p>
            <p style={{ fontSize:11, color:"var(--text-soft)", marginTop:2 }}>day streak</p>
          </div>
          <div style={{ textAlign:"center" }}>
            <p className="script" style={{ fontSize:22, color:"var(--coral)", lineHeight:1 }}>340</p>
            <p style={{ fontSize:11, color:"var(--text-soft)", marginTop:2 }}>hearts earned</p>
          </div>
          <div style={{ textAlign:"center" }}>
            <p className="script" style={{ fontSize:22, color:"var(--gold)", lineHeight:1 }}>Lvl 6</p>
            <p style={{ fontSize:11, color:"var(--text-soft)", marginTop:2 }}>couple level</p>
          </div>
        </div>
      </div>

      {/* Daily reminder */}
      <div style={{
        background:"linear-gradient(135deg, #F4A0B0, #C9B8E8)",
        borderRadius:20, padding:"16px 18px", marginBottom:18,
        position:"relative", overflow:"hidden", zIndex:1
      }}>
        <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:40, opacity:0.3 }}>💌</div>
        <p style={{ fontSize:12, fontWeight:700, color:"white", opacity:0.8, letterSpacing:"0.8px", textTransform:"uppercase" }}>Daily Reminder</p>
        <p style={{ fontSize:14, fontWeight:500, color:"white", marginTop:4 }}>Alex is thinking of you right now 💕</p>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:2 }}>Play a game together tonight?</p>
      </div>

      {/* Quick actions */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18, position:"relative", zIndex:1 }}>
        <button onClick={(e) => { e.stopPropagation(); setTab("games"); }} style={{
          background:"linear-gradient(135deg, #FDE8ED, #F4A0B0)",
          border:"1px solid rgba(244,160,176,0.3)", borderRadius:20, padding:"16px",
          cursor:"pointer", textAlign:"left", transition:"all 0.2s"
        }}>
          <div style={{ fontSize:28, marginBottom:8 }}>🎮</div>
          <p style={{ fontWeight:700, fontSize:14, color:"var(--text)" }}>Play Now</p>
          <p style={{ fontSize:12, color:"var(--text-soft)", marginTop:2 }}>6 games ready</p>
        </button>
        <button onClick={(e) => { e.stopPropagation(); getAiStarter(); }} style={{
          background:"linear-gradient(135deg, #EDE0FF, #C9B8E8)",
          border:"1px solid rgba(201,184,232,0.3)", borderRadius:20, padding:"16px",
          cursor:"pointer", textAlign:"left", transition:"all 0.2s"
        }}>
          <div style={{ fontSize:28, marginBottom:8 }}>{starterLoading ? "⏳" : "✨"}</div>
          <p style={{ fontWeight:700, fontSize:14, color:"var(--text)" }}>AI Spark</p>
          <p style={{ fontSize:12, color:"var(--text-soft)", marginTop:2 }}>
            {starterLoading ? "Generating..." : "Convo starter"}
          </p>
        </button>
      </div>

      {/* AI Conversation Starter */}
      {showStarter && (
        <div className="card pop-in" style={{ marginBottom:18, position:"relative", zIndex:1, borderColor:"rgba(201,184,232,0.5)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <p style={{ fontSize:11, fontWeight:700, color:"var(--lav-deep)", letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:10 }}>✨ AI Conversation Starter</p>
            <button onClick={(e) => { e.stopPropagation(); setShowStarter(false); }}
              style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:"var(--text-soft)" }}>×</button>
          </div>
          <p style={{ fontSize:15, fontStyle:"italic", color:"var(--text)", lineHeight:1.6, fontFamily:"'Playfair Display',serif" }}>
            "{aiStarter || starter}"
          </p>
          <button className="btn-ghost" style={{ marginTop:14, width:"100%", fontSize:13 }}
            onClick={(e) => { e.stopPropagation(); setTab("chat"); }}>
            Send to Alex 💌
          </button>
        </div>
      )}

      {/* Date Night Suggestion */}
      <div style={{ position:"relative", zIndex:1, marginBottom:18 }}>
        <p style={{ fontSize:13, fontWeight:700, color:"var(--text-soft)", letterSpacing:"0.5px", marginBottom:12, textTransform:"uppercase", fontSize:11 }}>🌙 Date Night Ideas</p>
        <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:4 }}>
          {[
            { icon:"🎬", title:"Movie Night", desc:"Watch the same film" },
            { icon:"🍳", title:"Cook Together", desc:"Same recipe, FaceTime" },
            { icon:"🎵", title:"Playlist Date", desc:"Build a shared playlist" },
            { icon:"📖", title:"Book Club", desc:"Read the same chapter" },
          ].map((d, i) => (
            <div key={i} className="card-glass" style={{
              minWidth:120, padding:"14px", flexShrink:0,
              border:"1px solid rgba(255,255,255,0.7)",
              animation:`fadeIn 0.4s ${i*0.1}s ease both`
            }}>
              <div style={{ fontSize:24, marginBottom:6 }}>{d.icon}</div>
              <p style={{ fontSize:13, fontWeight:600 }}>{d.title}</p>
              <p style={{ fontSize:11, color:"var(--text-soft)", marginTop:2 }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── GAMES SCREEN ───────────────────────────────────────────────────── */
function GamesScreen({ setActiveGame }) {
  const games = [
    { id:"trivia", icon:"🧠", title:"Couple Trivia", desc:"How well do you know each other?", color:"#FDE8ED,#F4A0B0", tag:"2 Players", hearts:"+15" },
    { id:"truth", icon:"🎴", title:"Truth or Dare", desc:"Romantic, funny & deep", color:"#EDE0FF,#C9B8E8", tag:"Hot Pick 🔥", hearts:"+20" },
    { id:"wyr", icon:"💭", title:"Would You Rather", desc:"Make impossible choices together", color:"#FFF0E0,#FFD4A3", tag:"Quick Play", hearts:"+10" },
    { id:"draw", icon:"🎨", title:"Draw & Guess", desc:"Sketch & guess each other's art", color:"#E0F4FF,#A3D4FF", tag:"Creative", hearts:"+25" },
    { id:"challenge", icon:"⚡", title:"Mini Challenges", desc:"Selfies, songs, speed tasks", color:"#E0FFE8,#A3EDB8", tag:"New ✨", hearts:"+18" },
    { id:"memory", icon:"💝", title:"Memory Timeline", desc:"Save your special moments", color:"#FFE8F4,#FFB8D9", tag:"Premium 👑", hearts:"+30" },
  ];

  return (
    <div className="scroll-area" style={{ padding:"24px 20px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:26 }}>Game Room <span style={{ fontSize:22 }}>🎮</span></h1>
          <p style={{ fontSize:13, color:"var(--text-soft)", marginTop:2 }}>Play with Alex · Room #LM-4872</p>
        </div>
        <div className="badge">🔥 7 streak</div>
      </div>

      {/* Level progress */}
      <div className="card" style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <p style={{ fontWeight:600, fontSize:14 }}>💑 Couple Level 6</p>
          <p style={{ fontSize:13, color:"var(--text-soft)" }}>340 / 500 ❤️</p>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width:"68%" }} />
        </div>
        <p style={{ fontSize:12, color:"var(--text-soft)", marginTop:6 }}>160 hearts to reach Level 7 ✨</p>
      </div>

      <div style={{ display:"grid", gap:12 }}>
        {games.map((g, i) => (
          <div key={g.id} className="game-card" style={{
            background:`linear-gradient(135deg, ${g.color})`,
            animation:`fadeIn 0.4s ${i*0.06}s ease both`,
          }} onClick={() => setActiveGame(g.id)}>
            <div style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", fontSize:48, opacity:0.15 }}>
              {g.icon}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:14, position:"relative" }}>
              <div style={{
                width:52, height:52, borderRadius:16, background:"rgba(255,255,255,0.7)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:26,
                flexShrink:0, boxShadow:"0 2px 8px rgba(0,0,0,0.08)"
              }}>{g.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <p style={{ fontWeight:700, fontSize:15 }}>{g.title}</p>
                </div>
                <p style={{ fontSize:12.5, color:"var(--text-soft)" }}>{g.desc}</p>
                <div style={{ display:"flex", gap:6, marginTop:6 }}>
                  <span className="tag" style={{ background:"rgba(255,255,255,0.7)", color:"var(--text-soft)" }}>{g.tag}</span>
                  <span className="tag" style={{ background:"rgba(255,255,255,0.7)", color:"var(--rose-deep)" }}>{g.hearts} 💗</span>
                </div>
              </div>
              <div style={{ fontSize:18, color:"var(--text-soft)" }}>›</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── TRIVIA GAME ────────────────────────────────────────────────────── */
function TriviaGame({ onBack }) {
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answered, setAnswered] = useState(false);

  const q = TRIVIA_QUESTIONS[qi];

  const answer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.ans) setScore(s => s + 1);
    setTimeout(() => {
      if (qi + 1 >= TRIVIA_QUESTIONS.length) setDone(true);
      else { setQi(qi + 1); setSelected(null); setAnswered(false); }
    }, 1200);
  };

  if (done) return (
    <div className="scroll-area" style={{ padding:"32px 24px", textAlign:"center" }}>
      <div style={{ fontSize:80, marginBottom:20 }} className="float">🏆</div>
      <h2 style={{ fontSize:28, marginBottom:8 }}>Quiz Complete!</h2>
      <p style={{ color:"var(--text-soft)", marginBottom:24 }}>You scored {score} out of {TRIVIA_QUESTIONS.length}</p>
      <div className="dare-card" style={{ marginBottom:24 }}>
        <p className="script" style={{ fontSize:36, color:"var(--rose-deep)" }}>
          {score >= 6 ? "Soulmates! 💑" : score >= 4 ? "Great Match! 💕" : "Keep Exploring! 🌸"}
        </p>
        <p style={{ fontSize:14, color:"var(--text-soft)", marginTop:8 }}>
          {score >= 6 ? "You two really know each other deeply!" : "Every day is a chance to know more ✨"}
        </p>
        <div style={{ marginTop:16 }}>
          {[...Array(score)].map((_, i) => (
            <span key={i} style={{ fontSize:24 }}>💖</span>
          ))}
          {[...Array(TRIVIA_QUESTIONS.length - score)].map((_, i) => (
            <span key={i} style={{ fontSize:24, opacity:0.2 }}>🤍</span>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
        <button className="btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={() => { setQi(0); setScore(0); setDone(false); setSelected(null); setAnswered(false); }}>
          Play Again 🔄
        </button>
      </div>
    </div>
  );

  return (
    <div className="scroll-area" style={{ padding:"24px 20px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <button className="btn-ghost" style={{ padding:"10px 14px" }} onClick={onBack}>←</button>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:12, color:"var(--text-soft)", fontWeight:600 }}>
            Question {qi + 1} of {TRIVIA_QUESTIONS.length}
          </p>
          <div className="progress-bar" style={{ marginTop:6 }}>
            <div className="progress-fill" style={{ width:`${((qi + 1)/TRIVIA_QUESTIONS.length)*100}%` }} />
          </div>
        </div>
        <span style={{ fontSize:18 }}>🧠</span>
      </div>

      <div className="dare-card" style={{ marginBottom:24, minHeight:160, display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <p style={{ fontSize:13, color:"var(--text-soft)", marginBottom:10 }}>About Your Partner...</p>
        <h2 style={{ fontSize:20, lineHeight:1.4, fontStyle:"normal" }}>{q.q}</h2>
      </div>

      <div style={{ display:"grid", gap:10 }}>
        {q.opts.map((opt, i) => (
          <button key={i} className={`choice-btn ${answered ? (i === q.ans ? "correct" : i === selected ? "wrong" : "") : ""}`}
            disabled={answered} onClick={() => answer(i)}>
            <span style={{ marginRight:10, opacity:0.5 }}>{String.fromCharCode(65+i)}.</span>
            {opt}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:24 }}>
        <div style={{ textAlign:"center" }}>
          <p style={{ fontSize:20 }}>💗</p>
          <p style={{ fontSize:12, color:"var(--text-soft)" }}>Score: {score}</p>
        </div>
        <div style={{ textAlign:"center" }}>
          <p style={{ fontSize:20 }}>🧠</p>
          <p style={{ fontSize:12, color:"var(--text-soft)" }}>Mia vs Alex</p>
        </div>
      </div>
    </div>
  );
}

/* ─── TRUTH OR DARE ──────────────────────────────────────────────────── */
function TruthDareGame({ onBack }) {
  const [mode, setMode] = useState(null); // "truth" | "dare"
  const [card, setCard] = useState(null);
  const [pack, setPack] = useState("Romantic 💕");
  const [flipping, setFlipping] = useState(false);
  const [count, setCount] = useState(0);

  const packs = ["Romantic 💕", "Funny 😂", "Deep 🌊", "Spicy 🌶️"];

  const draw = (m) => {
    setFlipping(true);
    const list = m === "truth" ? TRUTH_DARE.truth : TRUTH_DARE.dare;
    setTimeout(() => {
      setCard(list[Math.floor(Math.random() * list.length)]);
      setMode(m);
      setFlipping(false);
      setCount(c => c + 1);
    }, 300);
  };

  return (
    <div className="scroll-area" style={{ padding:"24px 20px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button className="btn-ghost" style={{ padding:"10px 14px" }} onClick={onBack}>←</button>
        <h2 style={{ fontSize:22 }}>Truth or Dare 🎴</h2>
      </div>

      {/* Pack selector */}
      <div style={{ display:"flex", gap:8, overflowX:"auto", marginBottom:20, paddingBottom:4 }}>
        {packs.map(p => (
          <button key={p} onClick={() => setPack(p)} style={{
            padding:"8px 14px", borderRadius:12, border:`1.5px solid ${pack===p ? "var(--rose-deep)" : "rgba(201,184,232,0.4)"}`,
            background: pack===p ? "var(--blush)" : "white", cursor:"pointer", whiteSpace:"nowrap",
            fontSize:13, fontWeight: pack===p ? 600 : 400, color: pack===p ? "var(--rose-deep)" : "var(--text-soft)",
            fontFamily:"'DM Sans',sans-serif", flexShrink:0, transition:"all 0.2s"
          }}>{p}</button>
        ))}
      </div>

      {/* Card */}
      <div style={{ marginBottom:24, minHeight:200 }}>
        {!card ? (
          <div className="dare-card" style={{ minHeight:200, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center" }}>
            <p style={{ fontSize:48, marginBottom:12 }} className="float">🎴</p>
            <p className="script" style={{ fontSize:24, color:"var(--rose-deep)" }}>Pick Truth or Dare</p>
            <p style={{ fontSize:14, color:"var(--text-soft)", marginTop:6 }}>Tap a button below to begin</p>
          </div>
        ) : (
          <div className={`dare-card pop-in`} style={{
            minHeight:200, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",
            background: mode==="truth"
              ? "linear-gradient(135deg,#fff0f5,#fde8ed)"
              : "linear-gradient(135deg,#f3eeff,#ede0ff)",
            opacity: flipping ? 0 : 1, transition:"opacity 0.2s"
          }}>
            <span className="tag" style={{
              background: mode==="truth" ? "var(--rose)" : "var(--lavender)",
              color:"white", marginBottom:16, fontSize:12
            }}>
              {mode==="truth" ? "💬 TRUTH" : "⚡ DARE"}
            </span>
            <p style={{ fontSize:17, lineHeight:1.6, fontFamily:"'Playfair Display',serif", fontStyle:"italic" }}>{card}</p>
            <p style={{ fontSize:12, color:"var(--text-soft)", marginTop:16 }}>Pack: {pack}</p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        <button className="btn-primary" style={{
          background:"linear-gradient(135deg,var(--rose-deep),#FF8A7A)"
        }} onClick={() => draw("truth")}>
          💬 Truth
        </button>
        <button className="btn-primary" style={{
          background:"linear-gradient(135deg,var(--lav-deep),#A070CF)"
        }} onClick={() => draw("dare")}>
          ⚡ Dare
        </button>
      </div>

      {card && (
        <button className="btn-ghost" style={{ width:"100%", marginBottom:8 }} onClick={() => draw(mode)}>
          🔄 New {mode === "truth" ? "Truth" : "Dare"}
        </button>
      )}

      <div style={{ textAlign:"center", marginTop:8 }}>
        <p style={{ fontSize:13, color:"var(--text-soft)" }}>Cards drawn: {count} · +{count * 20} 💗</p>
      </div>
    </div>
  );
}

/* ─── WOULD YOU RATHER ───────────────────────────────────────────────── */
function WYRGame({ onBack }) {
  const [qi, setQi] = useState(0);
  const [voted, setVoted] = useState(null);
  const [votes, setVotes] = useState({ a: 60, b: 40 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState(null);

  const q = aiQuestion || WYR_QUESTIONS[qi % WYR_QUESTIONS.length];

  const vote = (side) => {
    if (voted) return;
    setVoted(side);
    const newVotes = side === "a"
      ? { a: Math.floor(Math.random()*30)+45, b: Math.floor(Math.random()*25)+30 }
      : { a: Math.floor(Math.random()*25)+30, b: Math.floor(Math.random()*30)+45 };
    setVotes(newVotes);
    setHistory(h => [...h, { q, choice: side === "a" ? q.a : q.b }]);
  };

  const next = async () => {
    setVoted(null);
    setAiQuestion(null);
    if (qi % 4 === 3) {
      setLoading(true);
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({
            model:"claude-sonnet-4-20250514", max_tokens:1000,
            messages:[{ role:"user", content:`Create ONE creative and thought-provoking "Would You Rather" question for a long-distance couple. 
The question should be romantic, emotionally meaningful, or fun — not dark or disturbing.
Return ONLY a JSON object like: {"a":"option A text","b":"option B text"}
No preamble, just the JSON.`}]
          })
        });
        const data = await res.json();
        const text = data.content?.map(b=>b.text||"").join("") || "";
        const clean = text.replace(/```json|```/g,"").trim();
        const parsed = JSON.parse(clean);
        setAiQuestion(parsed);
      } catch { setQi(i => i + 1); }
      setLoading(false);
    } else {
      setQi(i => i + 1);
    }
  };

  const total = votes.a + votes.b;

  return (
    <div className="scroll-area" style={{ padding:"24px 20px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button className="btn-ghost" style={{ padding:"10px 14px" }} onClick={onBack}>←</button>
        <h2 style={{ fontSize:22 }}>Would You Rather 💭</h2>
        {qi % 4 === 3 && <span className="badge" style={{ fontSize:11 }}>✨ AI next</span>}
      </div>

      <div style={{ textAlign:"center", marginBottom:20 }}>
        <p className="script" style={{ fontSize:32, color:"var(--rose-deep)" }}>Question {qi + 1}</p>
        <p style={{ fontSize:13, color:"var(--text-soft)" }}>{history.length} answered · +{history.length * 10} 💗</p>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:40 }}>
          <p style={{ fontSize:36, animation:"spin 1s linear infinite", display:"inline-block" }}>✨</p>
          <p style={{ marginTop:12, color:"var(--text-soft)" }}>AI is crafting a question…</p>
        </div>
      ) : (
        <>
          <div style={{ display:"grid", gap:12, marginBottom:20 }}>
            {["a","b"].map((side, idx) => (
              <div key={side}>
                <button disabled={!!voted} onClick={() => vote(side)} style={{
                  width:"100%", padding:"20px", borderRadius:22,
                  border:`2.5px solid ${voted === side ? "var(--rose-deep)" : voted ? "rgba(201,184,232,0.3)" : "rgba(201,184,232,0.4)"}`,
                  background: voted === side ? "var(--blush)" : voted ? "rgba(255,255,255,0.5)" : "white",
                  cursor: voted ? "default" : "pointer",
                  transition:"all 0.25s", fontFamily:"'DM Sans',sans-serif",
                  boxShadow: voted === side ? "0 4px 20px rgba(232,99,122,0.2)" : "var(--shadow-sm)"
                }}>
                  <p style={{ fontSize:13, color:"var(--text-soft)", marginBottom:6, fontWeight:600 }}>
                    {idx === 0 ? "Option A 🅰️" : "Option B 🅱️"}
                  </p>
                  <p style={{ fontSize:16, fontWeight:600, color:"var(--text)", lineHeight:1.4 }}>
                    {side === "a" ? q.a : q.b}
                  </p>
                  {voted && (
                    <div style={{ marginTop:10 }}>
                      <div style={{ height:6, borderRadius:99, background:"rgba(201,184,232,0.2)", overflow:"hidden" }}>
                        <div style={{
                          height:"100%", borderRadius:99,
                          background: side==="a" ? "var(--rose-deep)" : "var(--lav-deep)",
                          width:`${side==="a" ? Math.round(votes.a*100/total) : Math.round(votes.b*100/total)}%`,
                          transition:"width 0.8s ease"
                        }} />
                      </div>
                      <p style={{ fontSize:12, color:"var(--text-soft)", marginTop:4 }}>
                        {side==="a" ? Math.round(votes.a*100/total) : Math.round(votes.b*100/total)}% chose this
                        {voted===side ? " (you ✓)" : ""}
                      </p>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>

          {!voted && (
            <div style={{ textAlign:"center" }}>
              <p style={{ fontSize:32 }} className="pulse">💭</p>
              <p style={{ fontSize:13, color:"var(--text-soft)", marginTop:4 }}>Tap your choice!</p>
            </div>
          )}

          {voted && (
            <button className="btn-primary" style={{ width:"100%" }} onClick={next}>
              Next Question →
            </button>
          )}
        </>
      )}

      {history.length > 0 && (
        <div style={{ marginTop:20 }}>
          <p style={{ fontSize:12, fontWeight:700, color:"var(--text-soft)", textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:10 }}>Your Choices</p>
          {history.slice(-3).reverse().map((h, i) => (
            <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:8 }}>
              <span style={{ fontSize:16 }}>✅</span>
              <p style={{ fontSize:13, color:"var(--text-soft)" }}>{h.choice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── DRAW & GUESS GAME ──────────────────────────────────────────────── */
function DrawGame({ onBack }) {
  const canvasRef = useRef();
  const [drawing, setDrawing] = useState(false);
  const [word, setWord] = useState(null);
  const [guess, setGuess] = useState("");
  const [phase, setPhase] = useState("pick"); // pick | draw | guess | result
  const [correct, setCorrect] = useState(false);
  const [color, setColor] = useState("#E8637A");
  const [size, setSize] = useState(4);
  const [timer, setTimer] = useState(60);
  const timerRef = useRef();

  const words = ["sunset","lighthouse","heartbeat","umbrella","telescope","fireflies","hammock","rainbow","snowglobe","lantern","compass","teapot"];
  const colors = ["#E8637A","#8B6FBF","#4CAF82","#F5C842","#FF8A7A","#3B82F6","#2D1B3D","#FFD4A3"];

  const pickWord = (w) => {
    setWord(w);
    setPhase("draw");
    setTimer(60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer(t => { if (t <= 1) { clearInterval(timerRef.current); return 0; } return t-1; }), 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startDraw = (e) => {
    const c = canvasRef.current; if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left;
    const y = (e.touches?.[0]?.clientY ?? e.clientY) - rect.top;
    const ctx = c.getContext("2d");
    ctx.beginPath(); ctx.moveTo(x, y);
    setDrawing(true);
  };
  const draw = (e) => {
    if (!drawing) return;
    const c = canvasRef.current; if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left;
    const y = (e.touches?.[0]?.clientY ?? e.clientY) - rect.top;
    const ctx = c.getContext("2d");
    ctx.lineTo(x, y);
    ctx.strokeStyle = color; ctx.lineWidth = size;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.stroke();
  };
  const endDraw = () => setDrawing(false);
  const clearCanvas = () => {
    const c = canvasRef.current; if (!c) return;
    c.getContext("2d").clearRect(0, 0, c.width, c.height);
  };

  const checkGuess = () => {
    if (guess.toLowerCase().trim() === word?.toLowerCase()) {
      clearInterval(timerRef.current);
      setCorrect(true); setPhase("result");
    }
  };

  if (phase === "pick") return (
    <div className="scroll-area" style={{ padding:"24px 20px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <button className="btn-ghost" style={{ padding:"10px 14px" }} onClick={onBack}>←</button>
        <h2 style={{ fontSize:22 }}>Draw & Guess 🎨</h2>
      </div>
      <div className="dare-card" style={{ marginBottom:24, textAlign:"center" }}>
        <p style={{ fontSize:40 }} className="float">🎨</p>
        <h2 style={{ fontSize:22, marginTop:12 }}>You're Drawing!</h2>
        <p style={{ fontSize:14, color:"var(--text-soft)", marginTop:6 }}>Pick a secret word — Alex will guess!</p>
      </div>
      <p style={{ fontSize:13, fontWeight:700, color:"var(--text-soft)", marginBottom:12, textTransform:"uppercase", letterSpacing:"0.6px" }}>Choose Your Word</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
        {words.slice(0,9).map(w => (
          <button key={w} onClick={() => pickWord(w)} style={{
            padding:"12px 8px", borderRadius:14, background:"white",
            border:"1.5px solid rgba(201,184,232,0.4)", cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500,
            transition:"all 0.2s", color:"var(--text)"
          }}>{w}</button>
        ))}
      </div>
    </div>
  );

  if (phase === "result") return (
    <div className="scroll-area" style={{ padding:"32px 24px", textAlign:"center" }}>
      <div style={{ fontSize:80, marginBottom:16 }} className="float">{correct ? "🎉" : "⏰"}</div>
      <h2 style={{ fontSize:28, marginBottom:8 }}>{correct ? "Alex Guessed It!" : "Time's Up!"}</h2>
      <p style={{ fontSize:16, color:"var(--text-soft)", marginBottom:24 }}>The word was <strong style={{ color:"var(--rose-deep)" }}>{word}</strong></p>
      <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
        <button className="btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={() => { setPhase("pick"); setWord(null); setGuess(""); clearCanvas(); }}>
          Play Again 🔄
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ padding:"16px 20px", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <button className="btn-ghost" style={{ padding:"8px 12px" }} onClick={onBack}>←</button>
          <div style={{ flex:1 }}>
            {phase === "draw" && (
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ background:timer < 10 ? "var(--rose-deep)" : "var(--lav-deep)", color:"white",
                  borderRadius:10, padding:"4px 12px", fontSize:14, fontWeight:700 }}>⏱ {timer}s</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:12, color:"var(--text-soft)" }}>Drawing: <strong style={{ color:"var(--rose-deep)" }}>{word}</strong></p>
                </div>
              </div>
            )}
            {phase === "guess" && <p style={{ fontSize:14 }}>Alex is drawing! 👀</p>}
          </div>
        </div>
      </div>

      {phase === "draw" && (
        <div className="scroll-area" style={{ padding:"0 20px 20px" }}>
          <canvas ref={canvasRef} width={360} height={280} style={{
            borderRadius:20, background:"white", boxShadow:"var(--shadow)",
            touchAction:"none", cursor:"crosshair", width:"100%", display:"block", marginBottom:12
          }}
            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
            onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
          />
          <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
            {colors.map(c => (
              <button key={c} onClick={() => setColor(c)} style={{
                width:30, height:30, borderRadius:"50%", background:c, border:"none", cursor:"pointer",
                outline: color===c ? "3px solid rgba(0,0,0,0.3)" : "none", transition:"outline 0.1s"
              }} />
            ))}
            <div style={{ height:30, width:1, background:"rgba(201,184,232,0.3)", margin:"0 4px" }} />
            {[2,4,8,12].map(s => (
              <button key={s} onClick={() => setSize(s)} style={{
                width:30, height:30, borderRadius:"50%", background:"white", border:`2px solid ${size===s?"var(--rose-deep)":"rgba(201,184,232,0.4)"}`,
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"
              }}>
                <div style={{ width:s, height:s, borderRadius:"50%", background:color }} />
              </button>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <button className="btn-ghost" onClick={clearCanvas}>🗑 Clear</button>
            <button className="btn-primary" onClick={() => setPhase("guess")}>Send to Alex 📤</button>
          </div>
        </div>
      )}

      {phase === "guess" && (
        <div className="scroll-area" style={{ padding:"20px", textAlign:"center" }}>
          <div className="dare-card" style={{ marginBottom:20 }}>
            <p style={{ fontSize:40 }} className="bounce">🤔</p>
            <h2 style={{ fontSize:20, marginTop:12, marginBottom:8 }}>Alex Sent a Drawing!</h2>
            <canvas width={200} height={160} style={{ borderRadius:14, background:"#f9f0ff", width:200, height:160, border:"1px dashed rgba(201,184,232,0.5)" }} />
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <input className="love-input" placeholder="Your guess..." value={guess}
              onChange={e => setGuess(e.target.value)} onKeyDown={e => e.key==="Enter" && checkGuess()} />
            <button className="btn-primary" onClick={checkGuess}>→</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MINI CHALLENGES ────────────────────────────────────────────────── */
function ChallengeGame({ onBack }) {
  const [active, setActive] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef();

  const start = (ch) => {
    setActive(ch);
    setTimeLeft(ch.time);
    setRunning(true);
    setDone(false);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); setRunning(false); setDone(true); return 0; } return t-1; });
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div className="scroll-area" style={{ padding:"24px 20px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button className="btn-ghost" style={{ padding:"10px 14px" }} onClick={onBack}>←</button>
        <h2 style={{ fontSize:22 }}>Mini Challenges ⚡</h2>
      </div>

      {active ? (
        <div className="fade-in">
          <div className="dare-card" style={{ marginBottom:20, textAlign:"center" }}>
            <p style={{ fontSize:48, marginBottom:12 }} className={running ? "bounce" : ""}>{active.icon}</p>
            <h2 style={{ fontSize:22, marginBottom:8 }}>{active.title}</h2>
            <p style={{ fontSize:15, color:"var(--text-soft)", lineHeight:1.6 }}>{active.desc}</p>
            {running && (
              <div style={{ marginTop:20 }}>
                <div style={{ width:80, height:80, borderRadius:"50%",
                  background:`conic-gradient(var(--rose-deep) ${(timeLeft/active.time)*360}deg, #f0e0e8 0deg)`,
                  margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:"0 0 20px rgba(232,99,122,0.2)"
                }}>
                  <div style={{ width:60, height:60, borderRadius:"50%", background:"white",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:22, color:"var(--rose-deep)"
                  }}>{timeLeft}</div>
                </div>
              </div>
            )}
            {done && (
              <div className="pop-in">
                <p style={{ fontSize:48 }}>🎉</p>
                <p className="script" style={{ fontSize:28, color:"var(--rose-deep)" }}>Time's Up!</p>
                <p style={{ fontSize:14, color:"var(--text-soft)", marginTop:4 }}>Share your result with Alex! +{active.time} 💗</p>
              </div>
            )}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <button className="btn-ghost" onClick={() => { clearInterval(timerRef.current); setActive(null); setDone(false); }}>← Back</button>
            {done && <button className="btn-primary" onClick={() => start(active)}>Try Again 🔄</button>}
            {running && <button className="btn-ghost" onClick={() => { clearInterval(timerRef.current); setRunning(false); setDone(true); setTimeLeft(0); }}>⏹ Stop</button>}
          </div>
        </div>
      ) : (
        <div style={{ display:"grid", gap:12 }}>
          {MINI_CHALLENGES.map((ch, i) => (
            <div key={i} className="card" style={{
              display:"flex", alignItems:"center", gap:14, cursor:"pointer",
              animation:`fadeIn 0.4s ${i*0.06}s ease both`, transition:"all 0.2s"
            }} onClick={() => start(ch)}>
              <div style={{
                width:52, height:52, borderRadius:16, background:"linear-gradient(135deg,var(--blush),#ede0ff)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0
              }}>{ch.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:600, fontSize:15 }}>{ch.title}</p>
                <p style={{ fontSize:13, color:"var(--text-soft)", marginTop:2, lineHeight:1.4 }}>{ch.desc}</p>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <p style={{ fontSize:13, fontWeight:600, color:"var(--rose-deep)" }}>⏱ {ch.time}s</p>
                <p style={{ fontSize:11, color:"var(--text-soft)" }}>+{ch.time}💗</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MEMORY TIMELINE ────────────────────────────────────────────────── */
function MemoryScreen() {
  const [note, setNote] = useState("");
  const [memories, setMemories] = useState([
    { id:1, type:"moment", icon:"💌", text:"First 'I love you' over video call", date:"Feb 14", color:"#FDE8ED" },
    { id:2, type:"game", icon:"🏆", text:"Won our first trivia game together!", date:"Feb 18", color:"#EDE0FF" },
    { id:3, type:"note", icon:"📝", text:"You said my laugh is your favorite sound 🥺", date:"Feb 22", color:"#FFF0E0" },
    { id:4, type:"milestone", icon:"🔥", text:"7-day streak achieved!", date:"Mar 1", color:"#E0FFE8" },
    { id:5, type:"moment", icon:"🌙", text:"Fell asleep on the call together", date:"Mar 5", color:"#FDE8ED" },
  ]);

  const addMemory = () => {
    if (!note.trim()) return;
    setMemories(m => [{ id:Date.now(), type:"note", icon:"✍️", text:note, date:"Today", color:"#F3EEFF" }, ...m]);
    setNote("");
  };

  return (
    <div className="scroll-area" style={{ padding:"24px 20px" }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:26 }}>Memory Lane 💝</h1>
        <p style={{ fontSize:13, color:"var(--text-soft)", marginTop:2 }}>Your love story, one moment at a time</p>
      </div>

      {/* Add memory */}
      <div className="card" style={{ marginBottom:20 }}>
        <p style={{ fontSize:13, fontWeight:600, marginBottom:10 }}>✍️ Add a Memory</p>
        <div style={{ display:"flex", gap:10 }}>
          <input className="love-input" placeholder="Write a special moment..."
            value={note} onChange={e => setNote(e.target.value)}
            onKeyDown={e => e.key==="Enter" && addMemory()} />
          <button className="btn-primary" style={{ padding:"0 16px", flexShrink:0 }} onClick={addMemory}>💌</button>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position:"relative" }}>
        <div style={{ position:"absolute", left:26, top:0, bottom:0, width:2,
          background:"linear-gradient(to bottom, var(--rose), transparent)" }} />
        {memories.map((m, i) => (
          <div key={m.id} style={{
            display:"flex", gap:16, marginBottom:16, paddingLeft:8,
            animation:`fadeIn 0.4s ${i*0.08}s ease both`
          }}>
            <div style={{
              width:36, height:36, borderRadius:"50%", background:m.color,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:18, flexShrink:0, border:"3px solid white", boxShadow:"var(--shadow-sm)",
              zIndex:1, position:"relative"
            }}>{m.icon}</div>
            <div className="card" style={{ flex:1, padding:"12px 16px" }}>
              <p style={{ fontSize:14, lineHeight:1.5 }}>{m.text}</p>
              <p style={{ fontSize:11, color:"var(--text-soft)", marginTop:6, fontWeight:500 }}>📅 {m.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CHAT SCREEN ────────────────────────────────────────────────────── */
function ChatScreen() {
  const [messages, setMessages] = useState([
    { id:1, mine:false, text:"Can't stop thinking about you 💭", time:"7:42 PM" },
    { id:2, mine:true, text:"Same! I was literally just going to text you 🥺", time:"7:43 PM" },
    { id:3, mine:false, text:"Play trivia with me? 🧠", time:"7:44 PM" },
    { id:4, mine:true, text:"Yes!! But I'm warning you, I'm going to win 😤", time:"7:44 PM" },
    { id:5, mine:false, text:"We'll see about that 😏 Love you btw", time:"7:45 PM" },
    { id:6, mine:true, text:"Love you more 💗✨", time:"7:46 PM" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef();
  const [typing, setTyping] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { id:Date.now(), mine:true, text:input, time:"Now" };
    setMessages(m => [...m, userMsg]);
    const sentText = input;
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:"You are Alex, the loving partner of Mia in a long-distance relationship. Respond warmly, playfully, and affectionately — like a real partner texting. Keep replies to 1-2 sentences. Use occasional emojis. Be sweet and genuine.",
          messages:[
            ...messages.slice(-4).map(m => ({ role: m.mine ? "user" : "assistant", content: m.text })),
            { role:"user", content: sentText }
          ]
        })
      });
      const data = await res.json();
      const reply = data.content?.map(b=>b.text||"").join("").trim() || "💕";
      setMessages(m => [...m, { id:Date.now()+1, mine:false, text:reply, time:"Now" }]);
    } catch {
      setMessages(m => [...m, { id:Date.now()+1, mine:false, text:"💕", time:"Now" }]);
    }
    setTyping(false);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, typing]);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      {/* Header */}
      <div style={{ padding:"16px 20px 12px", borderBottom:"1px solid rgba(201,184,232,0.2)", flexShrink:0,
        background:"rgba(255,255,255,0.7)", backdropFilter:"blur(20px)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ position:"relative" }}>
            <div style={{ width:44, height:44, borderRadius:"50%",
              background:"linear-gradient(135deg,#C9B8E8,#F4A0B0)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>💜</div>
            <div style={{ position:"absolute", bottom:1, right:1, width:12, height:12,
              borderRadius:"50%", background:"#4CAF82", border:"2px solid white" }} />
          </div>
          <div>
            <p style={{ fontWeight:700, fontSize:16 }}>Alex 💜</p>
            <p style={{ fontSize:12, color:"#4CAF82", fontWeight:500 }}>● Online now</p>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
            <button className="btn-icon" style={{ background:"var(--blush)" }}>🎙</button>
            <button className="btn-icon" style={{ background:"#ede0ff" }}>📹</button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 20px", display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ textAlign:"center", marginBottom:8 }}>
          <span style={{ fontSize:11, color:"var(--text-soft)", background:"rgba(201,184,232,0.2)",
            padding:"4px 12px", borderRadius:99 }}>Today · 7:42 PM</span>
        </div>
        {messages.map((m, i) => (
          <div key={m.id} style={{ display:"flex", flexDirection:"column",
            alignItems: m.mine ? "flex-end" : "flex-start",
            animation:`fadeIn 0.3s ease both` }}>
            <div className={`chat-bubble ${m.mine ? "mine" : "theirs"}`}>{m.text}</div>
            <p style={{ fontSize:10, color:"var(--text-soft)", marginTop:3, paddingX:4 }}>{m.time}</p>
          </div>
        ))}
        {typing && (
          <div style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
            <div className="chat-bubble theirs" style={{ padding:"10px 16px" }}>
              <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"var(--lavender)",
                    animation:`bounce 1.2s ${i*0.2}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div style={{ paddingX:16, padding:"0 16px 8px", display:"flex", gap:8, overflowX:"auto" }}>
        {["Miss you 💕","Play a game? 🎮","Tell me something 🌸","Good night 🌙"].map(q => (
          <button key={q} onClick={() => setInput(q)} style={{
            whiteSpace:"nowrap", padding:"7px 13px", borderRadius:99,
            background:"rgba(255,255,255,0.8)", border:"1.5px solid rgba(201,184,232,0.4)",
            fontSize:12, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", color:"var(--text)",
            flexShrink:0, transition:"all 0.15s"
          }}>{q}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding:"8px 16px 16px", display:"flex", gap:10, flexShrink:0 }}>
        <input className="love-input" placeholder="Say something sweet... 💌" value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && send()}
          style={{ flex:1 }} />
        <button className="btn-primary" style={{ padding:"0 18px", flexShrink:0 }} onClick={send}>💌</button>
      </div>
    </div>
  );
}

/* ─── PROFILE SCREEN ─────────────────────────────────────────────────── */
function ProfileScreen() {
  const [tab, setTab] = useState("you");
  const profiles = {
    you: { emoji:"🧡", name:"Mia", age:24, location:"New York, USA", bio:"Sunsets, coffee & you 🌅", joined:"Jan 2024", level:6, hearts:340 },
    partner: { emoji:"💜", name:"Alex", age:26, location:"London, UK", bio:"Stars, music & missing you ✨", joined:"Jan 2024", level:6, hearts:380 },
  };
  const p = profiles[tab];

  return (
    <div className="scroll-area" style={{ padding:"24px 20px" }}>
      {/* Tab */}
      <div style={{ display:"flex", background:"rgba(201,184,232,0.15)", borderRadius:16, padding:4, marginBottom:24, gap:4 }}>
        {["you","partner"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex:1, padding:"10px", borderRadius:12, border:"none",
            background: tab===t ? "white" : "transparent",
            fontFamily:"'DM Sans',sans-serif", fontWeight: tab===t ? 600 : 400,
            color: tab===t ? "var(--rose-deep)" : "var(--text-soft)",
            cursor:"pointer", transition:"all 0.2s", fontSize:14,
            boxShadow: tab===t ? "var(--shadow-sm)" : "none"
          }}>{t === "you" ? "👤 You" : "💑 Alex"}</button>
        ))}
      </div>

      {/* Avatar */}
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{
          width:96, height:96, borderRadius:"50%", margin:"0 auto 12px",
          background:"linear-gradient(135deg, var(--rose), var(--lavender))",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:44, border:"4px solid white",
          boxShadow:"0 8px 32px rgba(244,160,176,0.4)"
        }} className="float">{p.emoji}</div>
        <h2 style={{ fontSize:26 }}>{p.name}</h2>
        <p style={{ fontSize:14, color:"var(--text-soft)", marginTop:2 }}>{p.location}</p>
        <p style={{ fontSize:14, marginTop:6, fontStyle:"italic", color:"var(--text-soft)" }}>"{p.bio}"</p>
        <div style={{ display:"flex", justifyContent:"center", gap:12, marginTop:14 }}>
          <div className="badge">✨ Level {p.level}</div>
          <div className="badge">❤️ {p.hearts} hearts</div>
        </div>
      </div>

      {/* Stats */}
      <div className="card" style={{ marginBottom:20 }}>
        <p style={{ fontSize:13, fontWeight:700, marginBottom:14, color:"var(--text-soft)", textTransform:"uppercase", letterSpacing:"0.5px" }}>💫 Stats</p>
        {[
          { label:"Games Played", val:"47", icon:"🎮" },
          { label:"Truths Answered", val:"23", icon:"💬" },
          { label:"Dares Completed", val:"18", icon:"⚡" },
          { label:"WYR Rounds", val:"31", icon:"💭" },
          { label:"Challenges Done", val:"12", icon:"🏆" },
          { label:"Messages Sent", val:"1.2k", icon:"💌" },
        ].map((s, i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"10px 0", borderBottom: i < 5 ? "1px solid rgba(201,184,232,0.15)" : "none" }}>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <span>{s.icon}</span>
              <p style={{ fontSize:14 }}>{s.label}</p>
            </div>
            <p style={{ fontWeight:700, fontSize:15, color:"var(--rose-deep)" }}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="card" style={{ marginBottom:20 }}>
        <p style={{ fontSize:13, fontWeight:700, marginBottom:14, color:"var(--text-soft)", textTransform:"uppercase", letterSpacing:"0.5px" }}>🏅 Badges</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:10 }}>
          {BADGES.map((b, i) => (
            <div key={i} style={{ textAlign:"center", opacity: b.earned ? 1 : 0.35 }}>
              <div style={{
                width:52, height:52, borderRadius:16, margin:"0 auto 6px",
                background: b.earned ? "linear-gradient(135deg,var(--blush),#ede0ff)" : "rgba(200,200,200,0.2)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:24, border: b.earned ? "1.5px solid rgba(244,160,176,0.4)" : "1.5px solid rgba(200,200,200,0.2)"
              }}>{b.icon}</div>
              <p style={{ fontSize:10, fontWeight:600, color: b.earned ? "var(--text)" : "var(--text-soft)", lineHeight:1.3 }}>{b.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN APP ───────────────────────────────────────────────────────── */
export default function App() {
  const [tab, setTab] = useState("home");
  const [activeGame, setActiveGame] = useState(null);

  const handleSetActiveGame = (gameId) => {
    setActiveGame(gameId);
    setTab("games");
  };

  const renderGame = () => {
    const back = () => setActiveGame(null);
    switch(activeGame) {
      case "trivia":    return <TriviaGame onBack={back} />;
      case "truth":     return <TruthDareGame onBack={back} />;
      case "wyr":       return <WYRGame onBack={back} />;
      case "draw":      return <DrawGame onBack={back} />;
      case "challenge": return <ChallengeGame onBack={back} />;
      case "memory":    return <MemoryScreen />;
      default:          return null;
    }
  };

  const renderScreen = () => {
    if (tab === "games" && activeGame) return renderGame();
    switch(tab) {
      case "home":    return <HomeScreen setTab={setTab} />;
      case "games":   return <GamesScreen setActiveGame={handleSetActiveGame} />;
      case "memory":  return <MemoryScreen />;
      case "chat":    return <ChatScreen />;
      case "profile": return <ProfileScreen />;
      default:        return <HomeScreen setTab={setTab} />;
    }
  };

  const navItems = [
    { id:"home",    icon:"🏠", label:"Home" },
    { id:"games",   icon:"🎮", label:"Games" },
    { id:"memory",  icon:"💝", label:"Memories" },
    { id:"chat",    icon:"💌", label:"Chat" },
    { id:"profile", icon:"👤", label:"Profile" },
  ];

  return (
    <>
      <FontLoader />
      <GlobalStyles />
      <style>{`
        html, body { height: 100%; margin: 0; display: flex; align-items: center; justify-content: center; background: #1a0a2e; }
        #root { height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; }
      `}</style>
      <div className="app-shell">
        {/* Status bar */}
        <div style={{ height:44, background:"rgba(255,255,255,0.6)", backdropFilter:"blur(20px)",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 20px", flexShrink:0, borderBottom:"1px solid rgba(244,160,176,0.15)" }}>
          <p style={{ fontSize:13, fontWeight:700 }}>9:41 AM</p>
          <div className="script" style={{ fontSize:16, color:"var(--rose-deep)", fontWeight:700 }}>LoveLink Play ❤️</div>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <span style={{ fontSize:14 }}>📶</span>
            <span style={{ fontSize:14 }}>🔋</span>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          {renderScreen()}
        </div>

        {/* Bottom Nav */}
        <nav className="bottom-nav">
          {navItems.map(n => (
            <button key={n.id} className={`nav-item ${tab === n.id ? "active" : ""}`}
              onClick={() => { setTab(n.id); if(n.id !== "games") setActiveGame(null); }}>
              <div style={{ position:"relative" }}>
                <span className="nav-icon">{n.icon}</span>
                {n.id === "chat" && <span className="notif-dot" />}
              </div>
              <span className="nav-label">{n.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
