const UNITS=[
{id:1,icon:'🔥',color:'#ed684d',title:'熱的影響與傳播',sub:'熱脹冷縮、熱的傳播、保溫與散熱',missions:[['熱脹冷縮實驗室','thermal'],['熱的傳播實驗室','transfer'],['保溫與散熱挑戰','insulate']]},
{id:2,icon:'🌦️',color:'#4d91e8',title:'多變的天氣',sub:'水與天氣、天氣圖、颱風與防災',missions:[['雲霧露霜實驗室','weather'],['水循環與鋒面','front'],['颱風防災中心','typhoon']]},
{id:3,icon:'🏞️',color:'#df7d45',title:'發現大地的奧祕',sub:'大地變動、岩石礦物土壤、防災與地景保育',missions:[['河流地形實驗室','river'],['岩石與礦物探索','rocks'],['防災與地景守護','quake']]},
{id:4,icon:'🧲',color:'#7659c8',title:'電磁與生活',sub:'地磁、電磁鐵、生活中的電磁應用',missions:[['地球的磁場實驗室','magnet'],['電磁鐵實驗室','electromagnet'],['電磁鐵的應用','emlife']]}
];
const $=id=>document.getElementById(id);
let completed=new Set(JSON.parse(localStorage.getItem('science6done_v3')||'[]'));
let currentUnit=1,currentMission=0,demo=false,timers=[];
const key=(u,t)=>`${u}-${t}`;
function cleanup(){timers.forEach(x=>{clearInterval(x);clearTimeout(x)});timers=[]}
function save(){localStorage.setItem('science6done_v3',JSON.stringify([...completed]));renderProgress();renderHome()}
function renderProgress(){
 const n=completed.size;$('doneCount').textContent=n;$('score').textContent=n*10;$('hudScore').textContent=n*10;$('progressFill').style.width=`${n/12*100}%`;
 $('rank').textContent='目前稱號：'+(n<3?'科學見習生':n<6?'實驗助理':n<9?'探究研究員':n<12?'首席科學家':'學期科學家');
 if(n===12){$('semesterFinal').classList.remove('locked');$('finalBtn').disabled=false;$('finalBtn').textContent='開始學期總挑戰'}
}
function renderHome(){
 $('unitCards').innerHTML=UNITS.map(u=>{const n=u.missions.filter(m=>completed.has(key(u.id,m[1]))).length;
 return `<article class="unit-card" style="--u:${u.color}"><h2>${u.icon} Unit ${u.id}</h2><h3>${u.title}</h3><p>${u.sub}</p><div class="bar"><span style="width:${n/3*100}%"></span></div><p style="min-height:auto">完成 ${n}/3</p><button class="btn" onclick="openUnit(${u.id})">進入第${u.id}單元</button></article>`}).join('')
}
function openUnit(uid,mid=0){
 cleanup();currentUnit=uid;currentMission=mid;const u=UNITS[uid-1];
 $('labTitle').textContent=`${u.icon} 第${uid}單元｜${u.title}`;
 $('missionTabs').innerHTML=u.missions.map((m,i)=>`<button class="tab ${i===mid?'on':''} ${completed.has(key(uid,m[1]))?'done':''}" onclick="openMission(${uid},${i})">${i+1}. ${m[0]}</button>`).join('');
 $('lab').classList.add('on');openMission(uid,mid);$('lab').scrollIntoView({behavior:'smooth',block:'start'})
}
function openMission(uid,mid){
 cleanup();currentUnit=uid;currentMission=mid;const u=UNITS[uid-1],m=u.missions[mid];
 [...document.querySelectorAll('.tab')].forEach((b,i)=>b.classList.toggle('on',i===mid));
 $('missionPanel').innerHTML=missionHTML(uid,m[1],m[0]);initMission(uid,m[1])
}
function nextMission(){const u=UNITS[currentUnit-1];if(currentMission<u.missions.length-1)openUnit(currentUnit,currentMission+1);else{$('lab').classList.remove('on');window.scrollTo({top:0,behavior:'smooth'})}}
function complete(k,msg){
 completed.add(k);save();const f=$('feedback');if(f){f.innerHTML='✅ '+msg;f.style.background='#e7f7ef';f.style.color='#176542'}
 const n=$('nextWrap');if(n)n.classList.add('show');
 [...document.querySelectorAll('.tab')].forEach((b,i)=>b.classList.toggle('done',completed.has(key(currentUnit,UNITS[currentUnit-1].missions[i][1]))))
}
function wrong(msg='再操作一次，從動畫中找證據。'){const f=$('feedback');if(f){f.textContent=msg;f.style.background='#fff1f1';f.style.color='#9f3240'}}
function choices(k,arr,correct,msg){
 return `<div class="row">${arr.map((a,i)=>`<button class="btn choice" onclick="${i===correct?`complete('${k}','${msg}')`:`wrong()`}">${a}</button>`).join('')}</div><div id="feedback" class="feedback">先觀察或操作，再作答。</div><div id="nextWrap" class="next-wrap"><button class="btn teal" onclick="nextMission()">下一關 →</button></div>`
}
function shell(title,stage,ctrl){return `<div class="mission-grid"><div class="stage">${stage}</div><div class="control"><h3>${title}</h3>${ctrl}</div></div>`}

function missionHTML(u,t,title){
 const k=key(u,t);
 if(t==='thermal') return shell(title,
 `<div class="thermal-world">
   <div class="thermal-box"><div class="flask"><div id="balloon" class="balloon"></div></div><div class="thermal-label">氣體</div></div>
   <div class="thermal-box"><div class="liquid-tube"><span id="liqLevel"></span></div><div class="thermal-label">液體</div></div>
   <div class="thermal-box"><div id="solidBridge" class="solid-bridge"></div><div class="solid-gap">固體長度變化雖小，但仍存在</div><div class="thermal-label">固體</div></div>
  </div>`,
 `<div class="action-label">調整溫度</div><div class="meter"><span id="tempVal">25</span>°C</div><input id="tempRange" type="range" min="5" max="80" value="25">
  <div class="stat-grid"><div class="stat">氣球<b id="gasObs">常溫</b></div><div class="stat">液柱<b id="liqObs">常溫</b></div><div class="stat">固體<b id="solidObs">變化小</b></div></div>
  <div class="prompt">把溫度先拉低、再拉高。受熱時，三種物質的體積通常有什麼共同趨勢？</div>${choices(k,['膨脹變大','收縮變小'],0,'氣體、液體、固體受熱時通常膨脹，遇冷時通常收縮；固體變化較不明顯。')}`);
 if(t==='transfer') return shell(title,
 `<div id="transferWorld" class="transfer-world">
   <div class="heat-fire">🔥</div><div id="metalRod" class="metal-rod"></div>
   <div class="heat-dot"></div><div class="pot"><span class="conv" style="animation-delay:0s"></span><span class="conv" style="animation-delay:.55s"></span><span class="conv" style="animation-delay:1.1s"></span></div>
   <div class="rays">☀️〰️〰️</div>
  </div>`,
 `<button id="runTransfer" class="btn teal">▶ 播放三種傳熱</button>
  <div class="stat-grid"><div class="stat">金屬棒<b>傳導</b></div><div class="stat">鍋中水<b>對流</b></div><div class="stat">遠距熱<b>輻射</b></div></div>
  <div class="prompt">金屬棒左端受熱後，熱主要往哪個方向傳？</div>${choices(k,['高溫處 → 低溫處','低溫處 → 高溫處'],0,'熱由高溫處往低溫處傳播；方式包含傳導、對流與輻射。')}`);
 if(t==='insulate') return shell(title,
 `<div class="insul-world">
   <div class="cup-set"><div class="steam">♨️</div><div class="mug"></div><div>一般杯</div><div id="plainTemp" class="temp-badge">80.0°C</div><div class="mini-chart"><div id="plainLine" class="chart-line" style="--linecolor:#ed684d;--angle:20deg"></div></div></div>
   <div class="cup-set"><div class="steam">♨️</div><div class="mug insulated"></div><div>保溫杯</div><div id="insTemp" class="temp-badge">80.0°C</div><div class="mini-chart"><div id="insLine" class="chart-line" style="--linecolor:#079da3;--angle:8deg"></div></div></div>
  </div>`,
 `<div class="action-label">模擬 10 分鐘散熱</div><button id="runCooling" class="btn teal">▶ 開始比較</button>
  <div class="prompt">哪個設計有助於減慢熱散失？</div>${choices(k,['真空層與空氣夾層等隔熱結構','讓金屬直接接觸更多空氣'],0,'減少傳導、對流與輻射，可以達到保溫效果。')}`);
 if(t==='weather') return shell(title,
 `<div class="weather-lab"><div id="weatherCloud" class="weather-cloud">☁️</div><div id="fogBank" class="fog-bank"></div><div class="leaf">🌿</div><div id="dewCrystal" class="dewcrystal">💧</div><div id="weatherStatus" class="weather-status">15°C｜露</div></div>`,
 `<div class="action-label">調整物體附近溫度</div><div class="meter"><span id="weatherTemp">15</span>°C</div><input id="weatherRange" type="range" min="-10" max="25" value="15">
  <div class="note">觀察水蒸氣遇冷後，靠近地面的現象如何隨溫度改變。</div>
  <div class="prompt">當物體溫度低於 0°C 時，較可能形成哪一種現象？</div>${choices(k,['露','霜'],1,'霜在物體溫度低於 0°C 時形成；露通常在 0°C 以上形成。')}`);
 if(t==='front') return shell(title,
 `<div id="waterCycle" class="watercycle">
   <div class="wc-sun">☀️</div><div class="wc-mountain"></div><div class="wc-snow">❄️</div><div class="wc-lake"></div><div class="wc-river"></div>
   <div id="wcCloud" class="wc-cloud">☁️</div><div id="heroDrop" class="hero-drop">💧</div>
   ${Array.from({length:8},(_,i)=>`<span class="vapor-particle" style="animation-delay:${i*.14}s"></span>`).join('')}
   ${Array.from({length:9},(_,i)=>`<span class="rain-drop" style="left:${55+i*3}%;animation-delay:${i*.09}s"></span>`).join('')}
   <div class="infiltration">⬇️⬇️</div>
   <span class="wc-label l1" id="lab1">1 蒸發</span><span class="wc-label l2" id="lab2">2 凝結</span><span class="wc-label l3" id="lab3">3 降水</span><span class="wc-label l4" id="lab4">4 匯集</span><span class="wc-label l5" id="lab5">5 滲入</span>
  </div>`,
 `<div class="playbar"><button id="cyclePlay" class="btn teal">▶ 播放</button><button id="cycleReset" class="btn soft">↻ 重播</button><div class="speed">速度 <button data-speed="1300">慢</button><button data-speed="850" class="on">中</button><button data-speed="500">快</button></div></div>
  <div class="stepper">${Array.from({length:5},()=>'<span class="stepdot"></span>').join('')}</div>
  <div class="cycle-list"><div class="cycle-step" id="cs1"><b>1 蒸發</b>：一滴水受熱成為水蒸氣，往空中移動。</div><div class="cycle-step" id="cs2"><b>2 凝結</b>：水蒸氣遇冷，聚集成雲滴。</div><div class="cycle-step" id="cs3"><b>3 降水</b>：雲滴變大，形成雨或雪降下。</div><div class="cycle-step" id="cs4"><b>4 匯集</b>：水沿地表流入河川、湖泊或海洋。</div><div class="cycle-step" id="cs5"><b>5 滲入</b>：部分水滲入地下。</div></div>
  <div id="frontBox" class="front-box"><div class="coldmass">冷氣團</div><div class="warmmass">暖氣團</div><div class="front-symbol">🌧️ 鋒面</div></div><button id="collideFront" class="btn soft">讓冷、暖氣團相遇</button>
  <div class="prompt">冷氣團與暖氣團相遇，在交界處通常形成什麼？</div>${choices(k,['鋒面','颱風眼'],0,'冷暖氣團交界形成鋒面；水循環則透過蒸發／蒸散、凝結、降水與回到地表持續進行。')}`);
 if(t==='typhoon') return shell(title,
 `<div class="typhoon-center"><div class="ty-map"><div class="cone"></div><div class="island"></div><div id="storm" class="storm">🌀</div>
   <span class="track-dot" style="left:82%;top:78%"></span><span class="track-dot" style="left:72%;top:67%"></span><span class="track-dot" style="left:62%;top:56%"></span><span class="track-dot" style="left:53%;top:45%"></span>
   <div class="ty-info"><b>模擬颱風預報</b><br>中心氣壓：逐漸降低<br>風雨：逐漸增強<br>預測路徑：接近臺灣</div></div>
   <div class="mission-progress"><span id="tp1" class="on">① 侵襲前</span><span id="tp2">② 侵襲中</span><span id="tp3">③ 過後</span></div></div>`,
 `<div id="ty1" class="decision-stage on"><div class="prompt">任務 1｜颱風接近前，請選出「全部需要」的準備。（可複選）</div>
   <div class="checklist">
    <label class="check-item"><input type="checkbox" value="safe">固定招牌、盆栽與容易被風吹落的物品</label>
    <label class="check-item"><input type="checkbox" value="safe">準備飲水、食物、手電筒與電池</label>
    <label class="check-item"><input type="checkbox" value="unsafe">到海邊觀浪拍照</label>
    <label class="check-item"><input type="checkbox" value="safe">清理排水溝並留意氣象警報</label>
   </div><button id="checkTy1" class="btn teal">檢查任務 1</button></div>
  <div id="ty2" class="decision-stage"><div class="prompt">任務 2｜颱風期間，哪一項行動較安全？</div>
   <div class="row"><button id="tySafe" class="btn choice">留在安全室內，遠離門窗並持續掌握警報</button><button id="tyUnsafe" class="btn choice">趁風雨變小時到河邊查看水位</button></div></div>
  <div id="ty3" class="decision-stage"><div class="prompt">任務 3｜颱風過後，哪個做法較適當？</div>
   <div class="row"><button id="tyAfter" class="btn choice">確認環境安全，避開積水與掉落電線，再進行清理</button><button id="tyAfterBad" class="btn choice">立刻涉水檢查所有地方</button></div></div>
  <div id="feedback" class="feedback">先讀預報資訊，再完成三階段防災決策。</div><div id="nextWrap" class="next-wrap"><button class="btn teal" onclick="nextMission()">下一關 →</button></div>`);
 if(t==='river') return shell(title,
 `<div class="river-stage"><div class="terrain"><div id="slope" class="slope"></div><div id="erosionCut" class="erosion-cut"></div><div id="riverWater" class="river-water"></div><div id="sedStream" class="sediment-stream">● · ● · ● ·</div><div id="delta" class="delta"></div><div class="zone z1">侵蝕</div><div class="zone z2">搬運</div><div class="zone z3">堆積</div></div>
  <div class="river-controls"><div><b>坡度：</b><span id="slopeVal">20</span>°</div><input id="slopeRange" type="range" min="5" max="45" value="20"><div><b>水量：</b><span id="waterVal">2</span>/4</div><input id="waterRange" type="range" min="1" max="4" value="2"></div></div>`,
 `<div class="stat-grid"><div class="stat">侵蝕<b id="erosionStat">中</b></div><div class="stat">搬運<b id="transportStat">中</b></div><div class="stat">堆積<b id="depositStat">中</b></div></div>
  <table class="obs-table"><tr><th>河段</th><th>你應看到的動畫證據</th></tr><tr><td>上游</td><td id="obsE">坡面被沖出較淺凹槽</td></tr><tr><td>中游</td><td id="obsT">少量泥沙向下游移動</td></tr><tr><td>下游</td><td id="obsD">流速變慢處形成堆積</td></tr></table>
  <div class="prompt">其他條件相同時，把坡度調陡後，哪兩種作用通常更明顯？</div>${choices(k,['侵蝕與搬運','只有堆積'],0,'坡度較陡時，流水侵蝕與搬運作用通常較明顯；流速較慢處容易堆積。')}`);
 if(t==='rocks') return shell(title,
 `<div class="rock-lab"><div class="sample"><div id="rockMain" class="rock-main">🪨</div><div id="magnify" class="magnify">◇◇</div></div><div class="test-panel"><div class="streak-plate"><span id="streakMark" class="streak-mark"></span></div><div id="rockResult" class="test-result">選擇檢驗工具，觀察岩石或礦物的特徵。</div></div></div>`,
 `<div class="row"><button id="magnifyBtn" class="btn soft">🔍 放大觀察</button><button id="streakBtn" class="btn soft">▭ 條痕測試</button><button id="hardBtn" class="btn soft">✦ 硬度比較</button></div>
  <div class="prompt">哪個敘述較符合課本概念？</div>${choices(k,['岩石可由一種或多種礦物組成','礦物是由土壤組成'],0,'岩石由礦物組成；觀察顏色、晶體、條痕與硬度等特徵，有助於認識礦物。')}`);
 if(t==='quake') return shell(title,
 `<div id="quakeRoom" class="quake-room"><div class="lamp">💡</div><div class="desk">🪑</div><div class="shelf">🗄️</div><div id="safeZone" class="safe-zone"></div></div>`,
 `<div class="quake-steps"><div id="qs1" class="quake-step on">① 正在搖晃</div><div id="qs2" class="quake-step">② 搖晃停止</div><div id="qs3" class="quake-step">③ 前往集合</div></div>
  <button id="startQuake" class="btn teal">▶ 模擬地震</button>
  <div id="quakeDecision" class="prompt">教室正在明顯搖晃，第一時間應怎麼做？</div>
  <div class="row"><button id="quakeSafe" class="btn choice">趴下、掩護、穩住</button><button id="quakeBad" class="btn choice">立刻衝下樓梯</button></div>
  <div id="feedback" class="feedback">先啟動模擬，依不同階段做判斷。</div><div id="nextWrap" class="next-wrap"><button class="btn teal" onclick="nextMission()">下一關 →</button></div>`);
 if(t==='magnet') return shell(title,
 `<div class="magnet-lab"><div class="field f1"></div><div class="field f2"></div><div class="field f3"></div><div class="earth">🌍</div><div id="moveMagnet" class="move-magnet">🧲</div><div class="compass"><div id="needle" class="needle"></div></div></div>`,
 `<div class="row"><button id="northMag" class="btn teal">N 極靠近</button><button id="southMag" class="btn teal">S 極靠近</button><button id="removeMag" class="btn soft">移開附近磁鐵</button></div>
  <div class="note">附近磁鐵會讓磁針偏轉；移開後，磁針再次受到地磁影響。</div>
  <div class="prompt">移開附近磁鐵，讓指北針自由轉動時，N 極通常指向哪裡？</div>${choices(k,['北方','南方'],0,'地球具有地磁；自由轉動的磁針 N 極通常指向北方。')}`);
 if(t==='electromagnet') return shell(title,
 `<div class="em-lab"><div id="emRig" class="em-rig"><div class="iron-core"></div><div id="coilWire" class="coil-wire"></div><div id="batteryPack" class="battery-pack">🔋</div><div id="clipPile" class="clip-pile">${Array.from({length:10},(_,i)=>`<span class="clip-fly" style="transition-delay:${i*.04}s">📎</span>`).join('')}</div></div><div class="strength-bar"><span id="strengthFill"></span></div></div>`,
 `<div class="action-label">線圈圈數：<b id="coilVal">40</b> 圈</div><input id="coilRange" type="range" min="20" max="100" step="20" value="40">
  <div class="action-label">串聯電池：<b id="batteryVal">1</b> 顆</div><input id="batteryRange" type="range" min="1" max="3" value="1">
  <button id="powerEm" class="btn teal">⚡ 通電測試</button><div class="stat-grid"><div class="stat">磁力指數<b id="strengthText">弱</b></div><div class="stat">吸起迴紋針<b id="clipCount">2</b></div><div class="stat">通電狀態<b id="powerText">關</b></div></div>
  <div class="prompt">其他條件相同時，增加線圈圈數或串聯電池數量，磁力通常會？</div>${choices(k,['變強','變弱'],0,'線圈圈數較多、串聯電池數量較多時，電磁鐵磁力通常較強。')}`);
 if(t==='emlife') return shell(title,
 `<div class="device-grid">
   <div class="device" data-device="bell"><div class="device-icon">🔔</div><b>電鈴</b><div class="mechanism">通電 → 電磁鐵吸引鐵片 → <span class="bell-hammer">敲擊鈴</span>。</div></div>
   <div class="device" data-device="crane"><div class="device-icon">🏗️</div><b>電磁起重機</b><div class="mechanism">通電產生磁力吸起鐵製物；斷電後釋放。</div></div>
   <div class="device" data-device="speaker"><div class="device-icon">🔊</div><b>喇叭</b><div class="mechanism">電流與磁場作用，使振動元件帶動空氣發聲。</div></div>
   <div class="device" data-device="train"><div class="device-icon">🚄</div><b>磁浮列車</b><div class="mechanism">利用磁力的吸引與排斥，達到懸浮與推進。</div></div>
  </div>`,
 `<div class="note">依序點四個裝置，打開「看不見的機構」。</div><div id="deviceCount" class="feedback">已探索 0 / 4 個裝置。</div>
  <div class="prompt">哪一個現象最能說明電磁鐵「可控制」的優點？</div>${choices(k,['通電時有磁性、斷電後磁性可消失或大幅減弱','不論是否通電都永遠一樣強'],0,'電磁鐵可藉由控制電流來控制磁性，因此適合用在電鈴、起重機等裝置。')}`);
}

function initMission(u,t){
 if(t==='thermal'){
  const update=()=>{const v=+$('tempRange').value;$('tempVal').textContent=v;const p=(v-5)/75;$('balloon').style.transform=`translateX(-50%) scale(${.65+p*.65})`;$('liqLevel').style.height=`${22+p*62}%`;$('solidBridge').style.transform=`scaleX(${.96+p*.08})`;$('gasObs').textContent=v>45?'膨脹':v<15?'收縮':'接近常溫';$('liqObs').textContent=v>45?'上升':v<15?'下降':'接近常溫';$('solidObs').textContent=v>45?'微幅膨脹':v<15?'微幅收縮':'變化小'};$('tempRange').oninput=update;update()
 }
 if(t==='transfer') $('runTransfer').onclick=()=>{$('transferWorld').classList.add('run');$('metalRod').style.setProperty('--heat','92%')}
 if(t==='insulate') $('runCooling').onclick=()=>{let n=0,a=80,b=80;const id=setInterval(()=>{n++;a-=1.55;b-=.55;$('plainTemp').textContent=a.toFixed(1)+'°C';$('insTemp').textContent=b.toFixed(1)+'°C';$('plainLine').style.setProperty('--angle',`${20+n*.8}deg`);$('insLine').style.setProperty('--angle',`${8+n*.28}deg`);if(n>=10)clearInterval(id)},220);timers.push(id)}
 if(t==='weather'){
  const update=()=>{const v=+$('weatherRange').value;$('weatherTemp').textContent=v;$('weatherStatus').textContent=v<0?`${v}°C｜霜`:`${v}°C｜露`;$('dewCrystal').textContent=v<0?'❄️':'💧';$('fogBank').style.opacity=v<8?.75:.2;$('weatherCloud').style.transform=`scale(${v<5?1.08:.92})`};$('weatherRange').oninput=update;update()
 }
 if(t==='front') initWaterCycle()
 if(t==='typhoon') initTyphoon(key(u,t))
 if(t==='river') initRiver()
 if(t==='rocks'){
  $('magnifyBtn').onclick=()=>{$('magnify').classList.toggle('on');$('rockResult').textContent='放大後可觀察晶體、顆粒與光澤等特徵。'};
  $('streakBtn').onclick=()=>{$('streakMark').classList.add('on');$('rockResult').textContent='條痕測試觀察礦物粉末的顏色，可能和外觀看起來的顏色不同。'};
  $('hardBtn').onclick=()=>{$('rockMain').style.transform='rotate(-8deg) scale(1.06)';$('rockResult').textContent='可用不同材料嘗試刮擦，比較礦物相對硬度。'}
 }
 if(t==='quake') initQuake(key(u,t))
 if(t==='magnet'){
  $('northMag').onclick=()=>{$('needle').style.transform='rotate(70deg)';$('moveMagnet').style.left='62%';$('moveMagnet').style.top='23%'};
  $('southMag').onclick=()=>{$('needle').style.transform='rotate(-70deg)';$('moveMagnet').style.left='65%';$('moveMagnet').style.top='58%'};
  $('removeMag').onclick=()=>{$('needle').style.transform='rotate(0deg)';$('moveMagnet').style.left='10%';$('moveMagnet').style.top='20%'}
 }
 if(t==='electromagnet') initEM()
 if(t==='emlife'){
  const seen=new Set();document.querySelectorAll('.device').forEach(d=>d.onclick=()=>{d.classList.toggle('on');seen.add(d.dataset.device);$('deviceCount').textContent=`已探索 ${seen.size} / 4 個裝置。${seen.size===4?' 很好，四種應用都看過了！':''}`})
 }
}
function initWaterCycle(){
 let step=0,running=false,speed=850;
 const dots=[...document.querySelectorAll('.stepdot')],steps=[1,2,3,4,5];
 function reset(){step=0;running=false;$('waterCycle').classList.remove('play','raining','infiltrate');$('wcCloud').classList.remove('built');$('heroDrop').className='hero-drop';$('heroDrop').textContent='💧';$('heroDrop').style.cssText='';dots.forEach(d=>d.classList.remove('on'));steps.forEach(i=>{$(`cs${i}`).classList.remove('on');$(`lab${i}`).classList.remove('on')});$('cyclePlay').textContent='▶ 播放'}
 function show(s){
  dots.forEach((d,i)=>d.classList.toggle('on',i<s));steps.forEach(i=>{$(`cs${i}`).classList.toggle('on',i===s);$(`lab${i}`).classList.toggle('on',i===s)});
  const drop=$('heroDrop'),world=$('waterCycle');
  if(s===1){world.classList.add('play');drop.textContent='💧';drop.style.left='24%';drop.style.bottom='46%';drop.style.opacity='.85'}
  if(s===2){world.classList.remove('play');$('wcCloud').classList.add('built');drop.textContent='💧';drop.style.left='54%';drop.style.bottom='70%';drop.style.opacity='.45'}
  if(s===3){world.classList.add('raining');drop.textContent='💧';drop.style.left='67%';drop.style.bottom='31%';drop.style.opacity='1'}
  if(s===4){world.classList.remove('raining');drop.textContent='💧';drop.style.left='55%';drop.style.bottom='20%';drop.style.opacity='1'}
  if(s===5){world.classList.add('infiltrate');drop.textContent='💧';drop.style.left='82%';drop.style.bottom='7%';drop.style.opacity='.7'}
 }
 function tick(){if(!running)return;step++;if(step>5){running=false;$('cyclePlay').textContent='▶ 再播一次';return}show(step);const id=setTimeout(tick,speed);timers.push(id)}
 $('cyclePlay').onclick=()=>{if(running){running=false;$('cyclePlay').textContent='▶ 繼續';return}if(step>=5)reset();running=true;$('cyclePlay').textContent='⏸ 暫停';tick()};
 $('cycleReset').onclick=reset;document.querySelectorAll('[data-speed]').forEach(b=>b.onclick=()=>{speed=+b.dataset.speed;document.querySelectorAll('[data-speed]').forEach(x=>x.classList.toggle('on',x===b))});
 $('collideFront').onclick=()=>{$('frontBox').classList.add('collide')};reset()
}
function initTyphoon(k){
 $('checkTy1').onclick=()=>{const c=[...document.querySelectorAll('#ty1 input:checked')],safe=c.filter(x=>x.value==='safe').length,bad=c.some(x=>x.value==='unsafe');if(safe===3&&!bad){$('feedback').textContent='✅ 任務1完成：固定物品、備妥物資、清理排水並留意警報。';$('ty1').classList.remove('on');$('ty2').classList.add('on');$('tp1').classList.remove('on');$('tp2').classList.add('on')}else wrong('還有不安全或遺漏的選項。颱風前應降低掉落、缺水斷電與積水風險。')};
 $('tySafe').onclick=()=>{$('feedback').textContent='✅ 任務2完成：風雨期間留在安全室內並持續掌握警報。';$('ty2').classList.remove('on');$('ty3').classList.add('on');$('tp2').classList.remove('on');$('tp3').classList.add('on')};$('tyUnsafe').onclick=()=>wrong('河川、海邊與低窪地在颱風期間可能快速變危險，不宜前往查看。');
 $('tyAfter').onclick=()=>complete(k,'三階段防災決策完成：颱風前做好準備、期間避險、過後確認環境安全再清理。');$('tyAfterBad').onclick=()=>wrong('颱風過後仍可能有積水、倒塌物與掉落電線等危險，需先確認安全。')
}
function initRiver(){
 const update=()=>{const s=+$('slopeRange').value,w=+$('waterRange').value;$('slopeVal').textContent=s;$('waterVal').textContent=w;const e=Math.min(1,(s/45*.72+w/4*.38)),tr=Math.min(1,(s/45*.65+w/4*.45)),dep=Math.min(1,(1-s/45)*.45+w/4*.5);
 $('slope').style.transform=`skewY(${-s/6}deg)`;$('riverWater').style.height=`${34+w*8}px`;$('riverWater').style.setProperty('--flowspeed',`${1.7-(s/45*.7+w/4*.45)}s`);$('sedStream').style.setProperty('--flowspeed',`${1.8-(s/45*.7+w/4*.5)}s`);$('erosionCut').style.setProperty('--erosion',`${.25+e*1.25}`);$('delta').style.setProperty('--deposit',`${.45+dep*.75}`);
 const word=x=>x>.7?'強':x>.4?'中':'弱';$('erosionStat').textContent=word(e);$('transportStat').textContent=word(tr);$('depositStat').textContent=word(dep);
 $('obsE').textContent=e>.7?'凹槽加深，土石明顯被沖刷':e>.4?'坡面出現凹槽，部分土石被帶走':'沖刷較輕微';
 $('obsT').textContent=tr>.7?'大量泥沙快速往下游移動':tr>.4?'泥沙持續往下游移動':'泥沙移動較慢';
 $('obsD').textContent=dep>.7?'下游形成明顯扇形堆積':'下游流速變慢處可見堆積'};
 $('slopeRange').oninput=update;$('waterRange').oninput=update;update()
}
function initQuake(k){
 let stage=1;
 $('startQuake').onclick=()=>{$('quakeRoom').classList.add('shaking');$('feedback').textContent='正在搖晃：先保護自己，不要急著移動。'};
 $('quakeBad').onclick=()=>wrong('搖晃時衝樓梯容易跌倒或被掉落物砸傷。');
 $('quakeSafe').onclick=()=>{if(stage===1){$('quakeRoom').classList.remove('shaking');$('safeZone').classList.add('on');$('feedback').textContent='✅ 第一階段：趴下、掩護、穩住。現在假設搖晃停止。';$('qs1').classList.remove('on');$('qs2').classList.add('on');$('quakeDecision').textContent='搖晃停止後，接下來應怎麼做？';$('quakeSafe').textContent='依老師指示、確認安全後疏散';$('quakeBad').textContent='回去拿忘記的物品';stage=2}else if(stage===2){$('feedback').textContent='✅ 第二階段：確認安全後依規劃路線疏散。';$('qs2').classList.remove('on');$('qs3').classList.add('on');$('quakeDecision').textContent='到達集合地點後，最重要的是？';$('quakeSafe').textContent='點名、回報狀況並等待指示';$('quakeBad').textContent='自行離開集合地點';stage=3}else complete(k,'地震應變三步驟完成：搖晃時趴下掩護穩住；停止後依指示疏散；到集合地點點名並等待指示。')}
}
function initEM(){
 let on=false;const update=()=>{const c=+$('coilRange').value,b=+$('batteryRange').value,str=Math.min(10,Math.round(c/20*b*1.2));$('coilVal').textContent=c;$('batteryVal').textContent=b;$('batteryPack').textContent='🔋'.repeat(b);$('strengthFill').style.width=`${str*10}%`;$('strengthText').textContent=str>=8?'強':str>=5?'中':'弱';$('clipCount').textContent=str;$('coilWire').style.backgroundSize=`${Math.max(14,35-c/4)}px 100%`;if(on){[...document.querySelectorAll('.clip-fly')].forEach((x,i)=>x.style.transform=i<str?'translate(-80px,-100px) rotate(25deg)':'')}};$('coilRange').oninput=update;$('batteryRange').oninput=update;$('powerEm').onclick=()=>{on=!on;$('emRig').classList.toggle('active',on);$('powerText').textContent=on?'開':'關';$('powerEm').textContent=on?'⏹ 斷電':'⚡ 通電測試';update()};update()
}
function finalQuiz(){if(completed.size<12&&!demo)return;$('finalBox').innerHTML=`<div class="control" style="max-width:760px;margin:18px auto;text-align:left"><h3>跨單元科學判斷</h3><p>① 熱由高溫處往低溫處傳播。</p><p>② 冷暖氣團交界可形成鋒面。</p><p>③ 坡度較陡時流水侵蝕與搬運通常較明顯。</p><p>④ 增加線圈圈數或串聯電池數量，通常可增強電磁鐵磁力。</p><div class="prompt">以上四項是否都符合本學期核心概念？</div><button class="btn teal" onclick="graduate()">四項都正確</button> <button class="btn choice" onclick="this.parentElement.querySelector('.prompt').textContent='再回四個單元找動畫證據。'">至少一項錯誤</button></div>`}
function graduate(){$('certificate').classList.add('show');$('certName').textContent=$('studentName').value.trim()||'同學';$('certificate').scrollIntoView({behavior:'smooth'})}
$('finalBtn').onclick=finalQuiz;$('homeBtn').onclick=()=>{cleanup();$('lab').classList.remove('on');window.scrollTo({top:0,behavior:'smooth'})};
$('teacherBtn').onclick=()=>$('teacherModal').classList.add('show');$('closeTeacher').onclick=()=>$('teacherModal').classList.remove('show');$('toggleKey').onclick=()=>$('answerKey').classList.toggle('show');
$('unlockAll').onclick=()=>{demo=true;UNITS.forEach(u=>u.missions.forEach(m=>completed.add(key(u.id,m[1]))));save();$('teacherModal').classList.remove('show')};
$('resetProgress').onclick=()=>{if(confirm('確定清除這台裝置上的學習進度？')){completed.clear();localStorage.removeItem('science6done_v3');save();$('teacherModal').classList.remove('show')}};
renderHome();renderProgress();