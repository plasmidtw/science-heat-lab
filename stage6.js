(function(){
 const prevMissionHTML=window.missionHTML;
 const prevInitMission=window.initMission;
 window.missionHTML=function(u,t,title){
  if(t!=='rocks') return prevMissionHTML(u,t,title);
  const k=key(u,t);
  const stage=`<div class="rk6"><div id="rk6Scene" class="rk6-scene">
    <div class="rk6-bench"></div>
    <div class="rk6-sample"><div class="rk6-rock"></div><div class="rk6-crystal rk6-c1"></div><div class="rk6-crystal rk6-c2"></div><div class="rk6-crystal rk6-c3"></div></div>
    <div class="rk6-lens"><div class="rk6-lenscrystals"></div></div>
    <div class="rk6-result"><h4>觀察結果</h4><div id="rk6Result">先選擇一種檢驗工具。</div><div class="rk6-badges"><span class="rk6-badge">顆粒</span><span class="rk6-badge">晶體</span><span class="rk6-badge">條痕</span><span class="rk6-badge">硬度</span></div></div>
    <div class="rk6-tools"><div class="rk6-tool"><b>條痕板</b><div class="rk6-plate"><div class="rk6-streak"></div></div></div><div class="rk6-tool"><b>硬度比較</b><div style="text-align:center"><span class="rk6-nail">🔩</span><div class="rk6-scratch"></div></div></div></div>
   </div>
   <div class="rk6-controls"><button id="rk6Magnify" class="btn soft">🔍 放大觀察</button><button id="rk6Streak" class="btn soft">▭ 條痕測試</button><button id="rk6Hard" class="btn soft">✦ 硬度比較</button><button id="rk6Reset" class="btn soft">↻ 重置</button></div></div>`;
  const ctrl=`<div class="rk6-observe"><div class="rk6-card">放大觀察<b id="rk6Obs1">尚未</b></div><div class="rk6-card">條痕測試<b id="rk6Obs2">尚未</b></div><div class="rk6-card">硬度比較<b id="rk6Obs3">尚未</b></div></div>
   <div class="rk6-note">真正辨認礦物時，通常要綜合外觀、晶體、條痕、硬度等多項特徵，而不是只看顏色。</div>
   <div class="prompt">完成三種檢驗後，哪個敘述較符合課本概念？</div>
   ${choices(k,['岩石可由一種或多種礦物組成','礦物是由土壤組成'],0,'岩石可由一種或多種礦物組成；觀察晶體、條痕、硬度等特徵，有助於辨認礦物。')}`;
  return shell(title,stage,ctrl);
 };
 window.initMission=function(u,t){
  if(t!=='rocks') return prevInitMission(u,t);
  const scene=$('rk6Scene');
  const result=$('rk6Result');
  let seen={m:false,s:false,h:false};
  function sync(){
   $('rk6Obs1').textContent=seen.m?'完成':'尚未';$('rk6Obs2').textContent=seen.s?'完成':'尚未';$('rk6Obs3').textContent=seen.h?'完成':'尚未';
  }
  $('rk6Magnify').onclick=()=>{seen.m=true;scene.classList.add('magnify');result.innerHTML='🔍 <b>放大觀察：</b>可看見顆粒大小、晶體形狀與光澤差異。';sync()};
  $('rk6Streak').onclick=()=>{seen.s=true;scene.classList.add('streak');result.innerHTML='▭ <b>條痕測試：</b>礦物在條痕板上留下粉末顏色；條痕色可能和外觀顏色不同。';sync()};
  $('rk6Hard').onclick=()=>{seen.h=true;scene.classList.add('hardness');result.innerHTML='✦ <b>硬度比較：</b>用不同材料刮擦，觀察是否留下刮痕，可比較相對硬度。';sync()};
  $('rk6Reset').onclick=()=>{seen={m:false,s:false,h:false};scene.classList.remove('magnify','streak','hardness');result.textContent='先選擇一種檢驗工具。';sync()};
  sync();
 };
})();