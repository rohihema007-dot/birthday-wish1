(function(){
  var sky=document.getElementById('sky'), reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // floating bubbles + hearts
  function spawn(){
    if(!sky||reduce)return;
    var e=document.createElement('span'), r=Math.random();
    if(r<.55){var s=10+Math.random()*46;e.className='bub';e.style.width=e.style.height=s+'px';}
    else{e.className='hrt';e.textContent=['❤','💖','💕','💗'][Math.floor(Math.random()*4)];e.style.fontSize=(14+Math.random()*22)+'px';e.style.color=['#ff4d79','#ff8fab','#ffd6e0'][Math.floor(Math.random()*3)];}
    e.style.left=Math.random()*100+'%';
    e.style.setProperty('--dx',(Math.random()*120-60)+'px');
    e.style.setProperty('--rot',(Math.random()*60-30)+'deg');
    var d=7+Math.random()*8;e.style.animationDuration=d+'s';
    sky.appendChild(e);setTimeout(function(){e.remove()},d*1000);
  }
  setInterval(spawn,450);for(var i=0;i<8;i++)setTimeout(spawn,i*180);

  // confetti
  var cv=document.getElementById('confetti'),cx=cv.getContext('2d'),parts=[],run=false;
  function size(){cv.width=innerWidth;cv.height=innerHeight}size();addEventListener('resize',size);
  window.burst=function(n){
    var cols=['#ff4d79','#ffcf6e','#b794f6','#ffffff','#ff8fab','#6ee7b7'];
    for(var i=0;i<(n||160);i++)parts.push({x:innerWidth/2,y:innerHeight*.6,vx:(Math.random()-.5)*16,vy:-Math.random()*17-4,g:.35,s:5+Math.random()*7,c:cols[i%cols.length],r:Math.random()*6,vr:(Math.random()-.5)*.4,l:140+Math.random()*80});
    if(!run){run=true;tick()}
  };
  function tick(){
    cx.clearRect(0,0,cv.width,cv.height);
    parts=parts.filter(function(p){return p.l>0&&p.y<cv.height+20});
    parts.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.vx*=.99;p.r+=p.vr;p.l--;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);cx.restore()});
    if(parts.length)requestAnimationFrame(tick);else run=false;
  }

  // splash
  var enter=document.getElementById('enter'),splash=document.getElementById('splash');
  if(enter){enter.addEventListener('click',function(){splash.classList.add('gone');window.burst(200)});}

  // countdown + 12 AM gate
  var cd=document.getElementById('count');
  function openGate(live){
    document.body.classList.add('bday-on');
    if(window.unlockBoxes)window.unlockBoxes();
    if(live){window.burst(260);setTimeout(function(){window.burst(220)},900)}
  }
  if(cd){
    var t=new Date(cd.dataset.target).getTime(),first=true;
    (function upd(){
      var d=t-Date.now();
      if(d<=0){
        cd.innerHTML='<div class="today">🎉 Today is your Birthday! 🎉</div>';
        openGate(!first);return;
      }
      first=false;
      var D=Math.floor(d/864e5),H=Math.floor(d%864e5/36e5),M=Math.floor(d%36e5/6e4),S=Math.floor(d%6e4/1e3);
      cd.innerHTML=[[D,'days'],[H,'hrs'],[M,'min'],[S,'sec']].map(function(x){return '<div><b>'+x[0]+'</b><small>'+x[1]+'</small></div>'}).join('');
      setTimeout(upd,1000);
    })();
  }

  // cake
  var blow=document.getElementById('blow'),cake=document.getElementById('cakeBox'),msg=document.getElementById('cakeMsg');
  if(blow){blow.addEventListener('click',function(){
    var out=cake.classList.toggle('out');
    if(out){msg.textContent='Happy Birthday Kathir! 🎉 Un wish nadakkum ❤️';window.burst(220)}
    else{msg.textContent='Innoru thadava wish pannu 😘'}
    blow.textContent=out?'Relight 🕯️':'Blow 🎉';
  })}
  var party=document.getElementById('party');if(party)party.addEventListener('click',function(){window.burst(260)});

  // 3 surprise boxes: oru click = 3 photos + note
  function floaty(el){
    var r=el.getBoundingClientRect();
    ['💖','💕','💗','✨','🥰','💝','😍'].forEach(function(ch){
      var e=document.createElement('span');e.className='fl';e.textContent=ch;
      e.style.left=(r.left+r.width/2+(Math.random()*160-80))+'px';e.style.top=(r.top+r.height/2)+'px';
      e.style.setProperty('--dx',(Math.random()*100-50)+'px');
      document.body.appendChild(e);setTimeout(function(){e.remove()},1500);
    });
  }
  var cdEl=document.getElementById('count'),T=cdEl?new Date(cdEl.dataset.target).getTime():0;
  function isLocked(){return Date.now()<T}
  var boxes=document.querySelectorAll('.sset'),opened=0,prog=document.getElementById('progress'),fin=document.getElementById('finale');
  boxes.forEach(function(box){
    var btn=box.querySelector('.giftbig');
    btn.addEventListener('click',function(){
      if(box.classList.contains('open'))return;
      if(isLocked()){
        btn.classList.remove('nope');void btn.offsetWidth;btn.classList.add('nope');
        if(prog)prog.textContent='🔒 Countdown innum mudiyala da 😜 12 mani aana dhaan open aagum';
        return;
      }
      box.classList.add('open');btn.disabled=true;btn.setAttribute('aria-expanded','true');
      btn.querySelector('.gbox').textContent='💝';btn.querySelector('small').textContent='open aachu 💖';
      floaty(btn);window.burst(120);opened++;
      if(prog)prog.textContent=opened+' / '+boxes.length+' surprises open aachu 🎁';
      setTimeout(function(){box.querySelector('.reveal').scrollIntoView({behavior:'smooth',block:'center'})},250);
      if(opened===boxes.length&&fin){
        if(prog)prog.textContent='Ellaa surprises-um open aachu 🎉💖';
        setTimeout(function(){fin.classList.add('shown');window.burst(300);fin.scrollIntoView({behavior:'smooth',block:'center'})},1400);
      }
    });
  });

  function setLock(on){
    boxes.forEach(function(b){
      if(b.classList.contains('open'))return;
      b.classList.toggle('locked',on);
      b.querySelector('.gbox').textContent=on?'🔒':'🎁';
      b.querySelector('small').textContent=on?'countdown mudiyatum 💤':'tap pannu 💖';
    });
    if(prog&&!opened)prog.textContent=on?'🔒 Countdown mudinjadhum dhaan open aagum':'0 / '+boxes.length+' surprises open aachu 🎁';
  }
  window.unlockBoxes=function(){setLock(false);boxes.forEach(function(b){b.classList.remove('nope')})};
  setLock(isLocked());

  // photo viewer
  var v=document.getElementById('viewer');
  if(v)v.addEventListener('show.bs.modal',function(e){var f=e.relatedTarget;document.getElementById('viewerImg').src=f.dataset.src;document.getElementById('viewerCap').textContent=f.dataset.cap});

  // finale video: tap pannina play aagum (sound-oda)
  var vid=document.getElementById('bdayVideo'),vp=document.getElementById('vidPlay');
  if(vid&&vp){
    vp.addEventListener('click',function(){
      vid.muted=false;vid.volume=1;
      var pr=vid.play();if(pr&&pr.catch)pr.catch(function(){});
    });
    vid.addEventListener('play',function(){vp.classList.add('hide')});
    vid.addEventListener('pause',function(){vp.classList.remove('hide')});
    vid.addEventListener('ended',function(){vp.classList.remove('hide')});
  }
})();
