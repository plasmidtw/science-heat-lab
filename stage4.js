(function(){
 const oldMissionHTML=window.missionHTML;
 const oldInitTyphoon=window.initTyphoon;
 window.missionHTML=function(u,t,title){
  if(t!=='typhoon') return oldMissionHTML(u,t,title);
  const k=key(u,t);
  const stage=`<div class="ty4-wrap"><div id="ty4Map" class="ty4-map"><div class="ty4-ocean-lines"></div><div class="ty4-cone"></div><div class="ty4-taiwan"></div><div class="ty4-rain"></div>
   <div class="ty4-info"><h4>🌀 颱風資訊</h4>名稱：瑪娃（MAWAR）<br>中心氣壓：945 hPa<br>近中心最大風速：48 m/s<br>移動速度：25 km/h<br>移動方向：西北西<br>暴風半徑：約 200 km</div>
   <div class="ty4-legend"><b>風雨強度圖例</b><br><span style="background:#17bf83"></span>熱帶性低氣壓<br><span style="background:#f4c83e"></span>輕度颱風<br><span style="background:#ff8b42"></span>中度颱風<br><span style="background:#b245d6"></span>強烈颱風</div>
   <div class="ty4-tabs"><button class="on">路徑預測圖</button><button>衛星雲圖</button><button>降雨預測</button></div>
   <div class="ty4-tip">ⓘ 觀察路徑、風力與降雨變化</div>
   <div class="ty4-track">
    <span class="ty4-segment" style="left:78%;top:78%;width:82px;transform:rotate(-132deg)"></span>
    <span class="ty4-segment" style="left:70%;top:68%;width:98px;transform:rotate(-142deg)"></span>
    <span class="ty4-segment" style="left:60%;top:56%;width:105px;transform:rotate(-152deg)"></span>
    <span class="ty4-segment" style="left:50%;top:47%;width:100px;transform:rotate(-164deg)"></span>
    <span class="ty4-dot green" style="left:80%;top:80%"></span><span class="ty4-time" style="left:82%;top:82%">5/30 08:00</span>
    <span class="ty4-dot yellow" style="left:72%;top:70%"></span><span class="ty4-time" style="left:74%;top:65%">5/30 20:00</span>
    <span class="ty4-dot orange" style="left:62%;top:58%"></span><span class="ty4-time" style="left:64%;top:53%">5/31 08:00</span>
    <span class="ty4-dot red" style="left:52%;top:49%"></span><span class="ty4-time" style="left:44%;top:42%">5/31 20:00</span>
    <span class="ty4-dot purple" style="left:42%;top:39%"></span>
   </div>
   <div id="ty4Storm" class="ty4-storm">🌀</div><div class="ty4-current">現在位置<br>5/30 08:00</div>
   <div class="ty4-play"><button id="ty4Play" class="btn teal">▶</button><input id="ty4Timeline" type="range" min="0" max="4" value="0"><div class="speed">速度 <button data-tys="slow">慢</button><button data-tys="mid" class="on">中</button><button data-tys="fast">快</button></div><button id="ty4Replay" class="btn soft">↻ 重播</button></div>
  </div><div class="ty4-progress"><div id="tp1" class="on">① 侵襲前</div><div id="tp2">② 侵襲中</div><div id="tp3">③ 過後</div></div></div>`;
  const ctrl=`<div id="ty1" class="decision-stage on"><div class="prompt">任務 1｜根據預報資訊，選出颱風侵襲前「全部需要」完成的準備。（可複選）</div><div class="ty4-choice-list">
   <label class="ty4-choice"><input type="checkbox" value="safe">🏠 固定招牌、盆栽與容易被風吹落的物品</label>
   <label class="ty4-choice"><input type="checkbox" value="safe">🥫 準備至少數天的飲水、食物與常用藥品</label>
   <label class="ty4-choice"><input type="checkbox" value="safe">🔦 準備手電筒、電池、行動電源並清理排水</label>
   <label class="ty4-choice"><input type="checkbox" value="unsafe">🌊 到海邊觀浪並拍照記錄浪高</label>
   <label class="ty4-choice"><input type="checkbox" value="unsafe">🚗 趁風雨還小時安排山區露營</label>
  </div><button id="checkTy1" class="btn teal">檢查任務 1</button><div class="ty4-stage-note">判斷原則：降低掉落物、缺水斷電、積水與戶外暴露風險。</div></div>
  <div id="ty2" class="decision-stage"><div class="prompt">任務 2｜颱風期間，哪一項行動最安全？</div><div class="ty4-choice-list">
   <button id="tySafe" class="ty4-choice">🏠 留在堅固室內，遠離門窗並持續掌握警報</button>
   <button id="tyUnsafe" class="ty4-choice">🌧️ 趁風雨變小時到河邊查看水位</button>
   <button id="tyUnsafe2" class="ty4-choice">🚙 開車外出買東西或接送親友</button>
   <button id="tyUnsafe3" class="ty4-choice">🌊 到海邊觀浪或拍照</button>
  </div></div>
  <div id="ty3" class="decision-stage"><div class="prompt">任務 3｜颱風過後，哪個做法較適當？</div><div class="ty4-choice-list">
   <button id="tyAfter" class="ty4-choice">✅ 先確認環境安全，避開積水、倒塌物與掉落電線，再清理</button>
   <button id="tyAfterBad" class="ty4-choice">❌ 立刻涉水檢查低窪地區</button>
  </div></div>
  <div id="feedback" class="feedback">先播放路徑動畫、讀取預報資訊，再完成三階段防災決策。</div><div id="nextWrap" class="next-wrap"><button class="btn teal" onclick="nextMission()">下一關 →</button></div>`;
  return shell(title,stage,ctrl);
 };
 window.initTyphoon=function(k){
  let timer=null,step=0,speed=800;
  const positions=[['76%','69%'],['68%','59%'],['58%','49%'],['48%','40%'],['39%','31%']];
  function setStep(v){step=v;const s=$('ty4Storm');if(!s)return;s.style.left=positions[v][0];s.style.top=positions[v][1];$('ty4Timeline').value=v;$('ty4Map').classList.toggle('rain',v>=2)}
  function stop(){if(timer){clearInterval(timer);timer=null}$('ty4Play').textContent='▶'}
  function play(){if(timer){stop();return}$('ty4Play').textContent='⏸';timer=setInterval(()=>{step++;if(step>4){stop();step=0}setStep(step)},speed)}
  $('ty4Play').onclick=play;$('ty4Replay').onclick=()=>{stop();step=0;setStep(0)};$('ty4Timeline').oninput=e=>{stop();setStep(+e.target.value)};
  document.querySelectorAll('[data-tys]').forEach(b=>b.onclick=()=>{speed=b.dataset.tys==='slow'?1300:b.dataset.tys==='fast'?450:800;document.querySelectorAll('[data-tys]').forEach(x=>x.classList.toggle('on',x===b));if(timer){stop();play()}});
  document.querySelectorAll('.ty4-tabs button').forEach((b,i)=>b.onclick=()=>{document.querySelectorAll('.ty4-tabs button').forEach(x=>x.classList.toggle('on',x===b));$('ty4Map').classList.toggle('rain',i===2||step>=2)});
  $('checkTy1').onclick=()=>{const c=[...document.querySelectorAll('#ty1 input:checked')],safe=c.filter(x=>x.value==='safe').length,bad=c.some(x=>x.value==='unsafe');if(safe===3&&!bad){$('feedback').textContent='✅ 任務1完成：固定物品、備妥物資、準備照明電力並清理排水。';$('ty1').classList.remove('on');$('ty2').classList.add('on');$('tp1').classList.remove('on');$('tp2').classList.add('on')}else wrong('還有遺漏或不安全的選項。請依預報資訊思考掉落物、斷電缺水、積水與戶外風險。')};
  $('tySafe').onclick=()=>{$('feedback').textContent='✅ 任務2完成：颱風期間應留在安全室內、遠離門窗並持續掌握警報。';$('ty2').classList.remove('on');$('ty3').classList.add('on');$('tp2').classList.remove('on');$('tp3').classList.add('on')};
  ['tyUnsafe','tyUnsafe2','tyUnsafe3'].forEach(id=>$(id).onclick=()=>wrong('颱風期間河川、道路、山區與海邊都可能快速變得危險，不宜外出查看或拍照。'));
  $('tyAfter').onclick=()=>complete(k,'三階段防災決策完成：颱風前做好準備、期間安全避險、過後先確認環境安全再清理。');$('tyAfterBad').onclick=()=>wrong('積水可能有污染、坑洞或漏電風險；應先確認環境安全。');
  setStep(0);
 };
})();