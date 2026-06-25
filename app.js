// Theme switcher
document.querySelectorAll('.theme-swatch').forEach(s=>{s.addEventListener('click',()=>{document.documentElement.setAttribute('data-theme',s.dataset.theme);document.querySelectorAll('.theme-swatch').forEach(x=>x.style.outline='none');s.style.outline='2px solid #fff'})});

// Tab navigation
function switchTab(id){document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));const btn=document.querySelector('[data-tab="'+id+'"]');if(btn)btn.classList.add('active');const panel=document.getElementById('tab-'+id);if(panel)panel.classList.add('active');if(id==='causes')setTimeout(animateBars,300);}
document.querySelectorAll('.tab-btn').forEach(b=>{b.addEventListener('click',()=>{switchTab(b.dataset.tab);if(b.dataset.tab==='resources'){renderMyths();randomAffirm();}if(b.dataset.tab==='quiz')initQuiz();})});

// Counter animation
function animateCounter(el,target){let cur=0;const step=Math.ceil(target/60);const t=setInterval(()=>{cur+=step;if(cur>=target){cur=target;clearInterval(t);}el.textContent=cur;},30);}
window.addEventListener('load',()=>{animateCounter(document.getElementById('hstat0'),75);animateCounter(document.getElementById('hstat1'),33);animateCounter(document.getElementById('hstat2'),80);});

// Scroll reveal
const ro=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));

// Cause bars
function animateBars(){document.querySelectorAll('.cause-item').forEach(item=>{const bar=item.querySelector('.cause-bar-fill');const pct=item.dataset.pct;if(bar){setTimeout(()=>{bar.style.width=pct+'%';bar.querySelector('span').style.opacity='1';},200);}});}

// Breathing
const TECHS={box:{name:'Box Breathing',desc:'Used by Navy SEALs. Inhale, hold, exhale, hold � each for 4 seconds.',steps:[{label:'Inhale',dur:4,cls:'expand'},{label:'Hold',dur:4,cls:'hold'},{label:'Exhale',dur:4,cls:'exhale'},{label:'Hold',dur:4,cls:''}]},478:{name:'4-7-8 Method',desc:'Natural tranquiliser. Inhale 4s, hold 7s, exhale 8s. Great before sleep.',steps:[{label:'Inhale',dur:4,cls:'expand'},{label:'Hold',dur:7,cls:'hold'},{label:'Exhale',dur:8,cls:'exhale'}]},belly:{name:'Belly Breathing',desc:'Diaphragmatic breathing. Slow deep breaths activate your rest response.',steps:[{label:'Inhale',dur:4,cls:'expand'},{label:'Exhale',dur:6,cls:'exhale'}]}};
let bTimer=null,bInterval=null,curTech='box',cycles=0,sIdx=0,cd=0;
document.querySelectorAll('.tech-btn').forEach(b=>{b.addEventListener('click',()=>{stopBreath();document.querySelectorAll('.tech-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');curTech=b.dataset.technique;const t=TECHS[curTech];document.getElementById('techName').textContent=t.name;document.getElementById('techDesc').textContent=t.desc;document.getElementById('breathText').textContent='Press Start';document.getElementById('breathSub').textContent='Ready';document.getElementById('breathCircle').className='breath-circle';document.getElementById('cycleCount').textContent='0';});});
document.getElementById('startBreath').addEventListener('click',startBreath);
document.getElementById('stopBreath').addEventListener('click',stopBreath);
function startBreath(){stopBreath();cycles=0;sIdx=0;document.getElementById('startBreath').style.display='none';document.getElementById('stopBreath').style.display='inline-block';renderDots();runStep();}
function runStep(){const steps=TECHS[curTech].steps;const s=steps[sIdx];cd=s.dur;const c=document.getElementById('breathCircle');c.className='breath-circle '+(s.cls||'');document.getElementById('breathText').textContent=s.label;document.getElementById('breathSub').textContent=cd+'s';hlDot(sIdx);bInterval=setInterval(()=>{cd--;document.getElementById('breathSub').textContent=cd+'s';if(cd<=0){clearInterval(bInterval);sIdx++;if(sIdx>=steps.length){sIdx=0;cycles++;document.getElementById('cycleCount').textContent=cycles;}if(cycles<10)bTimer=setTimeout(runStep,300);else stopBreath();}},1000);}
function stopBreath(){clearInterval(bInterval);clearTimeout(bTimer);document.getElementById('startBreath').style.display='inline-block';document.getElementById('stopBreath').style.display='none';document.getElementById('breathText').textContent='Press Start';document.getElementById('breathSub').textContent='Ready';document.getElementById('breathCircle').className='breath-circle';}
function renderDots(){const steps=TECHS[curTech].steps;document.getElementById('breathSteps').innerHTML=steps.map((s,i)=>`<div class="step-dot" id="dot${i}">${s.label} ${s.dur}s</div>`).join('');}
function hlDot(i){document.querySelectorAll('.step-dot').forEach((d,j)=>{d.style.background=j===i?'rgba(124,58,237,.5)':'rgba(255,255,255,.08)';d.style.color=j===i?'#fff':'#94a3b8';});}

// Quiz
const QS=[{q:'How often have you felt nervous or anxious in the past 2 weeks?',opts:['Not at all','Several days','More than half the days','Nearly every day']},{q:'How often do you feel unable to control your worrying?',opts:['Not at all','Several days','More than half the days','Nearly every day']},{q:'How often do you have trouble relaxing?',opts:['Not at all','Several days','More than half the days','Nearly every day']},{q:'How often do you feel easily annoyed or irritable?',opts:['Not at all','Several days','More than half the days','Nearly every day']},{q:'How often are you afraid something awful might happen?',opts:['Not at all','Several days','More than half the days','Nearly every day']},{q:'How often do you feel overwhelmed by your academic workload?',opts:['Never','Sometimes','Often','Always']},{q:'How is your sleep quality lately?',opts:['Very good','Fairly good','Fairly bad','Very bad']},{q:'How often do you avoid tasks because they feel too stressful?',opts:['Rarely','Sometimes','Often','Almost always']},{q:'Do you have someone you can talk to about your feelings?',opts:['Yes always','Sometimes','Rarely','No never']},{q:'How would you rate your overall mental wellbeing right now?',opts:['Excellent','Good','Fair','Poor']}];
let qi=0,ans=[],qDone=false;
function initQuiz(){if(qDone)return;qi=0;ans=[];document.getElementById('quizResult').classList.add('hidden');document.getElementById('quizContainer').style.display='block';renderQ();}
function renderQ(){const q=QS[qi];document.getElementById('qNumber').textContent='Q'+(qi+1);document.getElementById('qText').textContent=q.q;document.getElementById('progressFill').style.width=((qi+1)/QS.length*100)+'%';document.getElementById('progressLabel').textContent='Question '+(qi+1)+' of '+QS.length;document.getElementById('nextBtn').style.display='none';const c=document.getElementById('qOptions');c.innerHTML='';q.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='q-option';b.textContent=o;b.onclick=()=>{document.querySelectorAll('.q-option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');ans[qi]=i;document.getElementById('nextBtn').style.display='inline-block';};c.appendChild(b);});}
document.getElementById('nextBtn').addEventListener('click',()=>{qi++;if(qi<QS.length)renderQ();else showResult();});
function showResult(){const score=ans.reduce((a,b)=>a+b,0);document.getElementById('quizContainer').style.display='none';const r=document.getElementById('quizResult');r.classList.remove('hidden');let emoji,level,desc,tips;if(score<=8){emoji='??';level='Low Stress Level';desc='You seem to be managing well. Keep up your healthy habits and stay mindful.';tips=['Maintain your sleep routine','Keep connecting with friends','Continue regular exercise','Practice gratitude daily'];}else if(score<=16){emoji='??';level='Moderate Stress';desc='You\'re experiencing some stress. Common, but worth addressing with healthy strategies.';tips=['Try daily breathing exercises','Break tasks into smaller steps','Limit social media use','Talk to a friend or mentor'];}else if(score<=22){emoji='??';level='High Stress';desc='Your stress levels are elevated. Actively manage these feelings and seek support.';tips=['Speak to a counsellor','Practice mindfulness daily','Set boundaries with commitments','Reduce caffeine'];}else{emoji='??';level='Severe � Please Seek Help';desc='Your responses suggest significant distress. Please reach out to a mental health professional soon.';tips=['Contact your campus counsellor today','Call a helpline (see Resources tab)','Talk to a trusted adult','Prioritise your mental health'];}r.innerHTML=`<div class="result-emoji">${emoji}</div><div class="result-level">${level}</div><p class="result-desc">${desc}</p><div class="result-tips"><h4>Recommended Steps:</h4><ul>${tips.map(t=>`<li>${t}</li>`).join('')}</ul></div><button class="btn-primary" onclick="resetQuiz()">Retake Quiz</button>`;}
function resetQuiz(){document.getElementById('quizResult').classList.add('hidden');document.getElementById('quizContainer').style.display='block';qi=0;ans=[];renderQ();}
initQuiz();

// Myths & Facts
const MYTHS=[{myth:'Stress is always bad for you.',fact:'Moderate stress (eustress) can boost motivation and performance.'},{myth:'Anxiety means you\'re weak.',fact:'Anxiety is a medical condition, not a personality flaw or weakness.'},{myth:'Students shouldn\'t feel stressed � it\'s just school.',fact:'Academic stress is real and can be as serious as work-related stress.'},{myth:'You can just "get over" anxiety.',fact:'Anxiety often needs coping strategies, therapy, or support to manage.'}];
function renderMyths(){const g=document.getElementById('mythGrid');if(g.children.length>0)return;g.innerHTML=MYTHS.map(m=>`<div class="myth-item"><div class="myth-col"><div class="myth-lbl">? MYTH</div><p>${m.myth}</p></div><div class="fact-col"><div class="fact-lbl">? FACT</div><p>${m.fact}</p></div></div>`).join('');}

// Affirmations
const AFFIRM=['"I am capable of handling whatever comes my way."','"My feelings are valid, and I am not alone."','"Every step forward, no matter how small, is progress."','"I choose to be kind to myself today."','"I am stronger than my anxiety."','"It\'s okay to ask for help. That takes courage."','"I deserve rest, peace, and support."','"This moment of difficulty will pass."','"I am more than my grades or my productivity."','"I have overcome hard times before, and I will again."'];
function randomAffirm(){const el=document.getElementById('affirmText');el.style.opacity='0';setTimeout(()=>{el.textContent=AFFIRM[Math.floor(Math.random()*AFFIRM.length)];el.style.opacity='1';},250);}
document.getElementById('newAffirm').addEventListener('click',randomAffirm);
randomAffirm();

// -- Dark / Light mode toggle --
const modeToggle = document.getElementById('modeToggle');
let isDark = true;
modeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-mode', isDark ? 'dark' : 'light');
  modeToggle.textContent = isDark ? '?? Dark' : '?? Light';
});
document.documentElement.setAttribute('data-mode', 'dark');

// -- Animated Background Canvas --
(function(){
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, blobs = [];

  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  function getColors(){
    const light = document.documentElement.getAttribute('data-mode') === 'light';
    if(light) return ['rgba(251,113,133,', 'rgba(244,114,182,', 'rgba(253,164,175,', 'rgba(249,168,212,'];
    return ['rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(236,72,153,', 'rgba(16,185,129,'];
  }

  function makeBlob(){
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: 120 + Math.random() * 180,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: 0.07 + Math.random() * 0.1,
      ci: Math.floor(Math.random() * 4)
    };
  }

  for(let i = 0; i < 7; i++) blobs.push(makeBlob());

  function draw(){
    ctx.clearRect(0, 0, W, H);
    const cols = getColors();
    blobs.forEach(b => {
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      grad.addColorStop(0, cols[b.ci] + b.alpha + ')');
      grad.addColorStop(1, cols[b.ci] + '0)');
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      b.x += b.dx; b.y += b.dy;
      if(b.x < -b.r) b.x = W + b.r;
      if(b.x > W + b.r) b.x = -b.r;
      if(b.y < -b.r) b.y = H + b.r;
      if(b.y > H + b.r) b.y = -b.r;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// -- Extra reveal-left / reveal-right observer --
const ro2 = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal-left,.reveal-right').forEach(el => ro2.observe(el));

// -- Tab switch animation: re-trigger sh-title --
const origSwitch = window.switchTab;
window.switchTab = function(id) {
  origSwitch(id);
  const panel = document.getElementById('tab-' + id);
  if (!panel) return;
  const title = panel.querySelector('.sh-title');
  if (title) { title.style.animation='none'; void title.offsetWidth; title.style.animation=''; }
  // re-observe reveals inside new panel
  panel.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => {
    el.classList.remove('visible');
    setTimeout(() => el.classList.add('visible'), 80);
  });
  
  // Smooth scroll down to the tabs section
  const ts = document.getElementById('tabs-section');
  if (ts) {
    const y = ts.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({top: y, behavior: 'smooth'});
  }
};

// ── Mode toggle (fixed) ──
(function(){
  const btn = document.getElementById('modeToggle');
  if(!btn) return;
  let dark = true;
  btn.textContent = 'Dark Mode';
  btn.onclick = function(){
    dark = !dark;
    document.documentElement.setAttribute('data-mode', dark ? 'dark' : 'light');
    btn.textContent = dark ? 'Dark Mode' : 'Light Mode';
  };
  document.documentElement.setAttribute('data-mode','dark');
})();


