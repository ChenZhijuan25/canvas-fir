window.onload = function () {

  var
  canvas = document.querySelector('#canvas'),
  ctx = canvas.getContext('2d'),
  //棋盘大小
  ROW = 15,
  //所有的落子数据
  qizi = {};

  var _xx = 22;
  var _yy = 6.5;
  var _zz = 314;
  var W = document.documentElement.clientWidth;
  var z = [ 3*_xx + _yy, 11*_xx + _yy];
  var _r = 2;
  var _aa = 320;
  var _qizibanjing  = 9;

  if(W >= 768){
      canvas.width = 600;
      canvas.height = 600;
      _xx = 40;
      _yy = 20.5;
      _zz = 580;
      z = [140.5,460.5];
      _r = 3;
      _aa = 600;
      _qizibanjing  = 18;
      canvas.addEventListener('click',handle);
  }


  var huaqipan = function() {
    ctx.clearRect(0,0,600,600);
    for(var i = 0; i < ROW; i++){
      ctx.strokeStyle = '#24202e';

      ctx.beginPath();
      ctx.moveTo(_yy-0.5,i*_xx+ _yy);
      ctx.lineTo(_zz,i*_xx + _yy);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(i*_xx+_yy,_yy-0.5);
      ctx.lineTo(i*_xx+_yy,_zz);
      ctx.stroke();
    }

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(_aa/2+0.5,_aa/2+0.5,_r,0,Math.PI*2);
    ctx.fill();
    for(var i = 0; i < z.length; i++){
      for(var j = 0; j < z.length; j++){
        ctx.beginPath();
        ctx.arc(z[i],z[j],_r,0,Math.PI*2);
        ctx.fill();
      }
    }
  }
  huaqipan();

  /*
  *  x    number   落子x坐标
  *  y    number   落子y坐标
  *  color boolean  true代表黑子  false代表白子
  */
  var luozi = function (x,y,color) {
    var zx = _xx*x + _yy ;
    var zy = _xx*y + _yy;
    var black = ctx.createRadialGradient(zx,zy,1,zx,zy,18);
    black.addColorStop(0.1,'#555');
    black.addColorStop(1,'black');
    var white = ctx.createRadialGradient(zx,zy,1,zx,zy,18);
    white.addColorStop(0.1,'#fff');
    white.addColorStop(1,'#ddd');

    ctx.fillStyle = ( color == 'black') ?black:white;

    ctx.beginPath();
    ctx.arc(zx,zy,_qizibanjing,0,Math.PI*2);
    ctx.fill();
  }
  var kongbai = {};
  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 15; j++) {
      kongbai[ i + '-' + j] = true;
    }
  }

  var ai = function () {
    var max = -1000000; var xx = {};
    for ( var i  in kongbai){
      var pos = i;
      var x = panduan(Number(pos.split('-')[0]),Number(pos.split('-')[1]),'black');
      if( x > max ){
        max = x;
        xx.x = pos.split('-')[0];
        xx.y = pos.split('-')[1];
      }
    }

    var max2 = -1000000; var yy = {};
    for ( var i  in kongbai){
      var pos = i;
      var x = panduan(Number(pos.split('-')[0]),Number(pos.split('-')[1]),'white');
      if( x > max2 ){
        max2 = x;
        yy.x = pos.split('-')[0];
        yy.y = pos.split('-')[1];
      }
    }
    if( max2 >= max){
      return yy;
    }
    return xx;
  }

  function handle(e) {
    var x =  Math.round( (e.offsetX-_yy)/_xx );
    var y =  Math.round( (e.offsetY-_yy)/_xx );
    if(e.type == 'tap'){
      var x =  Math.round( (e.position.x - canvas.offsetLeft - _yy)/_xx );
      var y =  Math.round( (e.position.y - canvas.offsetTop - _yy)/_xx );
    }

    if( qizi[x+'-'+y] ){return;}
    luozi(x,y,'black');
    qizi[ x + '-' + y ] = 'black';
    delete kongbai[ x + '-' + y ];

    if( panduan(x,y,'black') >= 5 ){
      alert('黑棋赢');
      window.location.reload();
    }

    var pos = ai();
    luozi(pos.x,pos.y,'white');
    qizi[ pos.x + '-' + pos.y ] = 'white';
    delete kongbai[ pos.x + '-' + pos.y ];
    if( panduan(Number(pos.x),Number(pos.y),'white') >= 5 ){
        alert('白棋赢');
        window.location.reload();
    };
  }

  touch.on(canvas,'tap',handle);


  var houziAI  = function () {
    do{
      var x = Math.floor( Math.random()*15 );
      var y = Math.floor( Math.random()*15 );
    }while( qizi[ x + '-' + y ] )
    return {x:x,y:y};
  }
  var xy2id = function(x,y) {
    return x + '-' + y;
  }

  var panduan = function(x,y,color) {
    var shuju = filter(color);
    var tx,ty,hang = 1;shu = 1; zuoxie= 1;youxie = 1;
    tx=x;ty=y;while( shuju[ xy2id( tx-1,ty ) ]){tx--;hang++};
    tx=x;ty=y;while( shuju[ xy2id( tx+1,ty ) ]){tx++;hang++};
    tx=x;ty=y;while( shuju[ xy2id( tx,ty-1 ) ]){ty--;shu++};
    tx=x;ty=y;while( shuju[ xy2id( tx,ty+1 ) ]){ty++;shu++};
    tx=x;ty=y;while( shuju[ xy2id( tx+1,ty-1 ) ]){tx++;ty--;zuoxie++};
    tx=x;ty=y;while( shuju[ xy2id( tx-1,ty+1 ) ]){tx--;ty++;zuoxie++};
    tx=x;ty=y;while( shuju[ xy2id( tx-1,ty-1 ) ]){tx--;ty--;youxie++};
    tx=x;ty=y;while( shuju[ xy2id( tx+1,ty+1 ) ]){tx++;ty++;youxie++};
    return Math.max(hang,shu,zuoxie,youxie);
  }
  var filter = function(color) {
    var r = {};
    for(var i in qizi){
      if(qizi[i]  == color){
        r[i] = qizi[i];
      }
    }
    return r;
  }

  var play=document.getElementById('play');
  var kaiguan1=true,timer;
  var HH = 0;
  var mm = 0;
  var ss = 0;
  var str = '';
  play.onclick=function(){
    if(kaiguan1){
      // title.style.display='none';
      play.innerHTML='暂停';
      kaiguan1=false;
      timer = setInterval(function(){
      str = "";
      if(ss++==60){
        if(mm++==60){
          HH++;
          mm=0;
        }
        ss=0;
      }
      str+=HH<10?"0"+HH:HH;
      str+=":";
      str+=mm<10?"0"+mm:mm;
      str+=":";
      str+=ss<10?"0"+ss:ss;
      time.innerHTML = str;
      },1000);
    }else{
      // title.style.display='block';
      // title.innerHTML='五子棋';
      play.innerHTML='开始';
      kaiguan1=true;
      clearInterval(timer);
      time.innerHTML = str;
    }
  };
  var replay=document.getElementById('replay');
  replay.onclick=function(){
    location.reload();
  };

}
// canvas.addEventListener('touchstart',function(){
//   console.log('start')
// })
// canvas.addEventListener('touchmove',function(){
//   console.log('touchmove')
// })
// canvas.addEventListener('touchcancle',function(){
//   console.log('touchcancle')
// })
// canvas.addEventListener('touchend',function(){
//   console.log('touchend')
// })
