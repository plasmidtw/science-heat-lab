(function(){
 const prevMissionHTML=window.missionHTML;
 const prevInitMission=window.initMission;
 window.missionHTML=function(u,t,title){
  if(t==='rocks'){
   const k=key(u,t);
   const stage=`<div class="rk6"><div id="rk6Scene" class="rk6-scene"><div class="rk6-bench"></div><div class="rk6-sample"><div class="rk6-rock"></div><div class="rk6-crystal rk6-c1"></div><div class="rk6-crystal rk6-c2"></div><div class="rk6-crystal rk6-c3"></div></div><div class="rk6-lens"><div class="rk6-lenscrystals"></div></div><div class="rk6-result"><h4>觀察結果</h4><div id="rk6Result">先選擇一種檢驗工具。</div><div class="rk6-badges"><span class="rk6-badge">顆粒</span><span class="rk6-badge">晶體</span><span class="rk6-badge">條痕</span><span class="rk6-badge">硬度</span></div></div><div class="rk6-tools"><div class="rk6-tool"><b>條痕板</b><div class="rk6-plate"><div class="rk6-streak"></div></div></div><div class="rk6-tool"><b>硬度比較</b><div style="text-align:center"><span class="rk6-nail">🔩</span><div class="rk6-scratch"></div></div></div></div></div><div class="rk6-controls"><button id="rk6Magnify" class="btn soft">🔍 放大觀察</button><button id="rk6Streak" class="btn soft">▭ 條痕測試</button><button id="rk6Hard" class="btn soft">✦ 硬度比較</button><button id="rk6Reset" class="btn soft">↻ 重置</button></div></div>`;
   const ctrl=`<div class="rk6-observe"><div class="rk6-card">放大觀察<b id="rk6Obs1">尚未</b></div><div class="rk6-card">條痕測試<b id="rk6Obs2">尚未</b></div><div class="rk6-card">硬度比較<b id="rk6Obs3">尚未</b></div></div><div class="rk6-note">真正辨認礦物時，通常要綜合外觀、晶體、條痕、硬度等多項特徵，而不是只看顏色。</div><div class="prompt">完成三種檢驗後，哪個敘述較符合課本概念？</div>${choices(k,['岩石可由一種或多種礦物組成','礦物是由土壤組成'],0,'岩石可由一種或多種礦物組成；觀察晶體、條痕、硬度等特徵，有助於辨認礦物。')}`;
   return shell(title,stage,ctrl);
  }
  if(t==='electromagnet'){
   const k=key(u,t),clips=Array.from({length:10},(_,i)=>`<span id="em7c${i}" class="em7-clip" style="left:${28+(i%5)*74}px;top:${82+Math.floor(i/5)*52}px;transition-delay:${i*.045}s">📎</span>`).join('');
   const stage=`<div class="em7"><div id="em7Scene" class="em7-scene"><div class="em7-title">電磁鐵吸力觀察區</div><div class="em7-field"></div><div class="em7-core"></div><div id="em7Coil" class="em7-coil"></div><div class="em7-wire"></div><div class="em7-wire r"></div><div id="em7Battery" class="em7-battery">🔋</div><div class="em7-clips">${clips}</div><div class="em7-counttag">目前吸起 <b id="em7VisualCount">0</b> / 10 個</div><div class="em7-note">共有 10 個迴紋針；只有實際被磁力吸起的數量會移到鐵芯旁。</div></div></div>`;
   const ctrl=`<div class="em7-controls"><div class="em7-control"><b>線圈圈數：<span id="em7CoilVal">20</span> 圈</b><input id="em7CoilRange" type="range" min="20" max="100" step="20" value="20"></div><div class="em7-control"><b>串聯電池：<span id="em7BatVal">1</span> 顆</b><input id="em7BatRange" type="range" min="1" max="3" value="1"></div></div><button id="em7Power" class="btn teal em7-power">⚡ 通電測試</button><div class="em7-observe"><div class="em7-stat">磁力指數<b id="em7Strength">弱</b></div><div class="em7-stat">吸起迴紋針<b id="em7Count">1</b></div><div class="em7-stat">通電狀態<b id="em7State">關</b></div></div><div class="em7-legend">增加線圈圈數或串聯電池數量時，吸起的迴紋針數量會增加；斷電後，迴紋針會掉回原處。</div><div class="prompt">其他條件相同時，增加線圈圈數或串聯電池數量，磁力通常會？</div>${choices(k,['變強','變弱'],0,'線圈圈數較多、串聯電池數量較多時，電磁鐵磁力通常較強。')}`;
   return shell(title,stage,ctrl);
  }
  return prevMissionHTML(u,t,title);
 };
 window.initMission=function(u,t){
  if(t==='rocks'){
   const scene=$('rk6Scene'),result=$('rk6Result');let seen={m:false,s:false,h:false};
   function sync(){$('rk6Obs1').textContent=seen.m?'完成':'尚未';$('rk6Obs2').textContent=seen.s?'完成':'尚未';$('rk6Obs3').textContent=seen.h?'完成':'尚未'}
   $('rk6Magnify').onclick=()=>{seen.m=true;scene.classList.remove('rk6-streak-on','rk6-hard-on');scene.classList.add('rk6-magnify-on');result.innerHTML='🔍 <b>放大觀察：</b>可看見顆粒大小、晶體形狀與光澤差異。';sync()};
   $('rk6Streak').onclick=()=>{seen.s=true;scene.classList.remove('rk6-magnify-on','rk6-hard-on');scene.classList.add('rk6-streak-on');result.innerHTML='▭ <b>條痕測試：</b>礦物在條痕板上留下粉末顏色；條痕色可能和外觀顏色不同。';sync()};
   $('rk6Hard').onclick=()=>{seen.h=true;scene.classList.remove('rk6-magnify-on','rk6-streak-on');scene.classList.add('rk6-hard-on');result.innerHTML='✦ <b>硬度比較：</b>用不同材料刮擦，觀察是否留下刮痕，可比較相對硬度。';sync()};
   $('rk6Reset').onclick=()=>{seen={m:false,s:false,h:false};scene.classList.remove('rk6-magnify-on','rk6-streak-on','rk6-hard-on');result.textContent='先選擇一種檢驗工具。';sync()};sync();return;
  }
  if(t==='electromagnet'){
   let powered=false;const coil=$('em7CoilRange'),bat=$('em7BatRange'),scene=$('em7Scene');
   const base=Array.from({length:10},(_,i)=>({left:28+(i%5)*74,top:82+Math.floor(i/5)*52}));
   const lift=Array.from({length:10},(_,i)=>({left:62+i*31,top:i%2?10:34}));
   function count(c,b){return Math.max(1,Math.min(10,Math.round((c/20)*b*.9)))}
   function update(){const c=+coil.value,b=+bat.value,n=count(c,b);$('em7CoilVal').textContent=c;$('em7BatVal').textContent=b;$('em7Battery').textContent='🔋'.repeat(b);$('em7Coil').style.setProperty('--gap',Math.max(8,30-c/5)+'px');$('em7Strength').textContent=n>=8?'強':n>=4?'中':'弱';$('em7Count').textContent=n;$('em7State').textContent=powered?'開':'關';$('em7VisualCount').textContent=powered?n:0;for(let i=0;i<10;i++){const el=$('em7c'+i);if(powered&&i<n){el.classList.add('lifted');el.style.left=lift[i].left+'px';el.style.top=lift[i].top+'px';el.style.transform='rotate('+(i%2?24:-18)+'deg) scale(1.05)'}else{el.classList.remove('lifted');el.style.left=base[i].left+'px';el.style.top=base[i].top+'px';el.style.transform='rotate('+(i%2?8:-7)+'deg)'}}}
   coil.oninput=update;bat.oninput=update;$('em7Power').onclick=()=>{powered=!powered;scene.classList.toggle('power',powered);$('em7Power').classList.toggle('on',powered);$('em7Power').textContent=powered?'⏹ 斷電':'⚡ 通電測試';update()};update();return;
  }
  return prevInitMission(u,t);
 };
})();