(function(){
 const previousMissionHTML=window.missionHTML;
 const previousInitMission=window.initMission;
 window.missionHTML=function(u,t,title){
  if(t!=='river') return previousMissionHTML(u,t,title);
  const k=key(u,t);
  const stage=`<div class="rv5">
    <div class="rv5-head"><h3>河流作用示意圖</h3><p>觀察河水由高處流向低處時，侵蝕、搬運與堆積如何依序出現。</p></div>
    <div id="rv5Scene" class="rv5-scene">
      <div class="rv5-skyglow"></div><div class="rv5-bed"></div><div class="rv5-bank"></div><div class="rv5-water"></div>
      <div class="rv5-fall"></div><div class="rv5-splash">💦</div><div id="rv5Erode" class="rv5-erodecut"></div>
      <div id="rv5Delta" class="rv5-delta"></div><div class="rv5-grass">🌱🌿</div>
      <div id="rv5Peb1" class="rv5-pebbles">● • ● • •</div><div id="rv5Peb2" class="rv5-pebbles mid">● • ● •</div><div id="rv5Peb3" class="rv5-pebbles down">• • •</div>
      <div class="rv5-arrow a1">→</div><div class="rv5-arrow a2">→</div><div class="rv5-arrow a3">→</div><div class="rv5-arrow a4">→</div><div class="rv5-arrow a5">→</div>
      <div class="rv5-label er"><b>侵蝕</b><small>上游坡度較陡<br>流速快，削切河床與兩側。</small></div>
      <div class="rv5-label tr"><b>搬運</b><small>中游持續流動<br>帶走泥沙與石塊。</small></div>
      <div class="rv5-label dp"><b>堆積</b><small>下游坡度較緩<br>流速減慢，泥沙沉積。</small></div>
    </div>
    <div class="rv5-controls">
      <div class="rv5-control"><b>上游坡度</b><input id="rvSlope" type="range" min="5" max="45" value="25"><span><b id="rvSlopeVal">25</b>°</span></div>
      <div class="rv5-control"><b>水量</b><input id="rvWater" type="range" min="1" max="4" value="2"><span><b id="rvWaterVal">2</b>/4</span></div>
    </div>
    <div class="rv5-reminder">💧 小提醒：河水由高處流向低處。坡度大、流速快時侵蝕與搬運較強；流速降低後，較容易發生堆積。</div>
  </div>`;
  const ctrl=`<div class="rv5-stats"><div class="rv5-stat">侵蝕<b id="rvEStat">中</b><span class="rv5-mini">河床／河岸削切</span></div><div class="rv5-stat">搬運<b id="rvTStat">中</b><span class="rv5-mini">泥沙往下游</span></div><div class="rv5-stat">堆積<b id="rvDStat">中</b><span class="rv5-mini">下游沉積</span></div></div>
    <div class="rv5-flowdir">畫面中水流方向：左上游 → 右下游。</div>
    <div class="prompt">其他條件相同時，把上游坡度調得更陡，哪兩種作用通常更明顯？</div>
    ${choices(k,['侵蝕與搬運','只有堆積'],0,'坡度較陡時，水流速度通常較快，侵蝕與搬運作用更明顯；到較平緩、流速較慢的下游，堆積較容易發生。')}`;
  return shell(title,stage,ctrl);
 };
 window.initMission=function(u,t){
  if(t!=='river') return previousInitMission(u,t);
  const slope=$('rvSlope'),water=$('rvWater');
  const txt=v=>v<.36?'弱':v<.7?'中':'強';
  function update(){
    const s=+slope.value,w=+water.value;$('rvSlopeVal').textContent=s;$('rvWaterVal').textContent=w;
    const eros=Math.min(1,.18+s/45*.62+w/4*.28);
    const trans=Math.min(1,.12+s/45*.54+w/4*.42);
    const dep=Math.max(.18,Math.min(1,(1-s/45)*.46+w/4*.42));
    $('rv5Scene').style.setProperty('--rv-erosion',(.42+eros*.75).toFixed(2));
    $('rv5Scene').style.setProperty('--rv-speed',Math.max(.65,2.6-trans*1.75).toFixed(2)+'s');
    $('rv5Scene').style.setProperty('--rv-deposit',(.55+dep*.62).toFixed(2));
    $('rvEStat').textContent=txt(eros);$('rvTStat').textContent=txt(trans);$('rvDStat').textContent=txt(dep);
    const op=.45+trans*.55;['rv5Peb1','rv5Peb2','rv5Peb3'].forEach(id=>$(id).style.opacity=op);
  }
  slope.oninput=update;water.oninput=update;update();
 };
})();