(function(){
 const prevMissionHTML=window.missionHTML;
 const prevInitMission=window.initMission;
 window.missionHTML=function(u,t,title){
  if(t!=='electromagnet') return prevMissionHTML(u,t,title);
  const k=key(u,t);
  const clips=Array.from({length:10},(_,i)=>`<span id="em7c${i}" class="em7-clip" style="left:${28+(i%5)*74}px;top:${82+Math.floor(i/5)*52}px;transition-delay:${i*.045}s">📎</span>`).join('');
  const stage=`<div class="em7"><div id="em7Scene" class="em7-scene"><div class="em7-title">電磁鐵吸力觀察區</div><div class="em7-field"></div><div class="em7-core"></div><div id="em7Coil" class="em7-coil"></div><div class="em7-wire"></div><div class="em7-wire r"></div><div id="em7Battery" class="em7-battery">🔋</div><div id="em7Clips" class="em7-clips">${clips}</div><div class="em7-counttag">目前吸起 <b id="em7VisualCount">0</b> / 10 個</div><div class="em7-note">畫面固定有 10 個迴紋針；只有被磁力吸起的數量會移到鐵芯旁。</div></div></div>`;
  const ctrl=`<div class="em7-controls"><div class="em7-control"><b>線圈圈數：<span id="em7CoilVal">20</span> 圈</b><input id="em7CoilRange" type="range" min="20" max="100" step="20" value="20"></div><div class="em7-control"><b>串聯電池：<span id="em7BatVal">1</span> 顆</b><input id="em7BatRange" type="range" min="1" max="3" step="1" value="1"></div></div><button id="em7Power" class="btn teal em7-power">⚡ 通電測試</button><div class="em7-observe"><div class="em7-stat">磁力指數<b id="em7Strength">弱</b></div><div class="em7-stat">吸起迴紋針<b id="em7Count">1</b></div><div class="em7-stat">通電狀態<b id="em7State">關</b></div></div><div class="em7-legend">觀察重點：增加線圈圈數或串聯電池數量時，吸起的迴紋針數量會增加；斷電後，吸起的迴紋針會掉回原處。</div><div class="prompt">其他條件相同時，增加線圈圈數或串聯電池數量，磁力通常會？</div>${choices(k,['變強','變弱'],0,'線圈圈數較多、串聯電池數量較多時，電磁鐵磁力通常較強。')}`;
  return shell(title,stage,ctrl);
 };
 window.initMission=function(u,t){
  if(t!=='electromagnet') return prevInitMission(u,t);
  let powered=false;
  const coil=$('em7CoilRange'),bat=$('em7BatRange'),scene=$('em7Scene');
  const basePos=Array.from({length:10},(_,i)=>({left:28+(i%5)*74,top:82+Math.floor(i/5)*52}));
  const liftPos=Array.from({length:10},(_,i)=>({left:70+i*31,top:i%2?8:31}));
  function calcCount(c,b){return Math.max(1,Math.min(10,Math.round((c/20)*b*.9)))}
  function strengthLabel(n){return n>=8?'強':n>=4?'中':'弱'}
  function update(){
   const c=+coil.value,b=+bat.value,n=calcCount(c,b);
   $('em7CoilVal').textContent=c;$('em7BatVal').textContent=b;$('em7Battery').textContent='🔋'.repeat(b);$('em7Coil').style.setProperty('--gap',Math.max(8,30-c/5)+'px');$('em7Strength').textContent=strengthLabel(n);$('em7Count').textContent=n;$('em7State').textContent=powered?'開':'關';$('em7VisualCount').textContent=powered?n:0;
   for(let i=0;i<10;i++){
    const el=$('em7c'+i);if(!el)continue;
    if(powered&&i<n){el.classList.add('lifted');el.style.left=liftPos[i].left+'px';el.style.top=liftPos[i].top+'px';el.style.transform='rotate('+(i%2?24:-18)+'deg) scale(1.05)'}
    else{el.classList.remove('lifted');el.style.left=basePos[i].left+'px';el.style.top=basePos[i].top+'px';el.style.transform='rotate('+(i%2?8:-7)+'deg)'}
   }
  }
  coil.oninput=update;bat.oninput=update;
  $('em7Power').onclick=()=>{powered=!powered;scene.classList.toggle('power',powered);$('em7Power').classList.toggle('on',powered);$('em7Power').textContent=powered?'⏹ 斷電':'⚡ 通電測試';update()};
  update();
 };
})();