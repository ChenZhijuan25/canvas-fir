window.onload=function(){
        var canvas=document.querySelector('#canvas');
        var ctx=canvas.getContext('2d');
         
        var ROW=15;//棋牌大小
        var z=[140.5,460.5];//棋牌星点位置数据
        var qizi={};//所有落子数据
        var kaiguan=localStorage.x?false:true;//标志该谁落子
        var huaqipan=function(){
        ctx.clearRect(0,0,600,600);
        for(var i=0;i<15;i++){
          ctx.beginPath();
          ctx.moveTo(20,i*40+20.5);
          ctx.lineTo(580,i*40+20.5);
          ctx.stroke();


          ctx.beginPath();
          ctx.moveTo(i*40+20.5,20);
          ctx.lineTo(i*40+20.5,580);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(300.5,300.5,3,0,Math.PI*2);
        ctx.fill();

        
        for(var i=0;i<z.length;i++){
          for(var j=0;j<z.length;j++){
            ctx.beginPath();
            ctx.arc(z[i],z[j],3,0,Math.PI*2);
            ctx.fill();
          }
        }
        }
        huaqipan()
       /* var lingrad=ctx.createLinearGradient(20,300,580,300);
        lingrad.addColorStop(0,'red');
        lingrad.addColorStop(0.2,'orange');
        lingrad.addColorStop(0.4,'yellow');
        lingrad.addColorStop(0.6,'green');
        lingrad.addColorStop(0.8,'blue');
        lingrad.addColorStop(1,'purple');

        ctx.lineWidth=6;
        ctx.lineCap='round';
        ctxstrokeStyle='lingrad';
        ctx.fillStyle=lingrad;

        ctx.fillRect(20,295,560,10)*/
        /*  *  x number   落子x坐标
            *  y number   落子y坐标
            *  color  bollean  true   黑色棋子
                              false   白色棋子
        */
        var luozi=function(x,y,color){
          var zx=x*40+20.5;
          var zy=y*40+20.5;
          var black=ctx.createRadialGradient(zx,zy,1,zx,zy,18);
          black.addColorStop(0.1,"#555");
          black.addColorStop(1,"black");
          var white=ctx.createRadialGradient(zx,zy,1,zx,zy,18);
          white.addColorStop(0.1,"#fff");
          white.addColorStop(1,"#eee");
          ctx.fillStyle=color?black:white;
          ctx.beginPath();
          ctx.arc(zx,zy,17,0,Math.PI*2);
          ctx.fill();
        }
        
        
        canvas.onclick=function(e){
          var x=Math.round((e.offsetX-20.5)/40);
          var y=Math.round((e.offsetY-20.5)/40);
          if(qizi[x+'_'+y]){return;}
          luozi(x,y,kaiguan);
          qizi[x+'_'+y]=kaiguan?'black':'white';

           if(kaiguan){
            if( panduan(x,y,'black') ){
              alert('黑棋赢');
              if(confirm('是否再来一局？')){
                localStorage.clear();
                qizi = {};
                huaqipan();
                kaiguan = true;
                return;
              }else{
                canvas.onclick  = null;
              }
            }
          }else{
            if( panduan(x,y,'white') ){
              alert('白棋赢');
              if(confirm('是否再来一局？')){
                localStorage.clear();
                qizi = {};
                huaqipan();
                kaiguan = true;
                return;
              }else{
                canvas.onclick = null;
              }
            }
         }

          kaiguan=!kaiguan;
          localStorage.date=JSON.stringify(qizi);
          if(!kaiguan){
            localStorage.x=1;
          }else{
            localStorage.removeItem('x');
          }
        }
        //判断输赢
        var xy=function(x,y){
           return x+'_'+y;
        }
        var panduan=function(x,y,color){
          var shuju=filter(color);
          var tx,ty,hang=1,shu=1,zuoxie=1,youxie=1;
          tx=x;ty=y;while(shuju[xy(tx-1,ty)]){tx--;hang++};
          tx=x;ty=y;while(shuju[xy(tx+1,ty)]){tx++;hang++};
          if(hang>=5){return true};
          tx=x;ty=y;while(shuju[xy(tx,ty-1)]){ty--;shu++};
          tx=x;ty=y;while(shuju[xy(tx,ty+1)]){ty++;shu++};
          if(shu>=5){return true};
          tx=x;ty=y;while(shuju[xy(tx-1,ty-1)]){tx--;ty--;zuoxie++};
          tx=x;ty=y;while(shuju[xy(tx+1,ty+1)]){tx++;ty++;zuoxie++};
          if(zuoxie>=5){return true};
          tx=x;ty=y;while(shuju[xy(tx+1,ty-1)]){tx++;ty--;youxie++};
          tx=x;ty=y;while(shuju[xy(tx-1,ty+1)]){tx--;ty++;youxie++};
          if(youxie>=5){return true};
        }
        var filter=function(color){
          var r={};
          for(var i in qizi){
            if(qizi[i]==color){
              r[i]=qizi[i];
            }
          }
          return r;
        }
        //如果本地存储中有棋牌数据，读取这些数据并绘制在页面中
        if(localStorage.date){
          qizi=JSON.parse(localStorage.date);
          for(var i in qizi){
            var x=i.split('_')[0];
            var y=i.split('_')[1];
            luozi(x,y,(qizi[i]=='black')?true:false);
          }
        }
        canvas.ondblclick=function(e){
          e.stopPropagation();
        }
        document.ondblclick=function(e){
          localStorage.clear();
          location.reload();
        }


/*// 画表
var canvas2=document.querySelector('#canvas2');
var ctx2=canvas2.getContext('2d');
var drawClock=function(){
  var d=new Date();
  var h=d.getHours();
  var s=d.getSeconds();
  var m=d.getMinutes();

  ctx2.clearRect(0,0,400,400);


  ctx2.save();//保存一个干净的画布
  
  ctx2.translate(200,200);//移动画布到原点中心
  //画最外边的表盘
  ctx2.save();
  ctx2.strokeStyle='#8d533a';
  //加阴影
  ctx2.shadowOffsetX=2;
  ctx2.shadowOffsetY=2;
  ctx2.shadowBlur=2;
  ctx2.shadowColor='rgba(0,0,0,0.3)'
  ctx2.lineWidth=8;
  ctx2.beginPath();
  ctx2.arc(0,0,130,0,Math.PI*2);
  ctx2.stroke();
  ctx2.restore();

  //化时间刻度
  ctx2.save();
  ctx2.lineWidth=4;
  ctx2.lineCap='round';
  for (var i = 1; i < 61; i++) {
    ctx2.rotate(Math.PI/30);
    ctx2.beginPath();
    if(i%5==0){
      ctx2.moveTo(90,0);
    }else{
      ctx2.moveTo(100,0);
    }
    ctx2.lineTo(110,0);
    ctx2.stroke();
  }
  ctx2.restore();

  //圆心
  ctx2.beginPath();
  ctx2.arc(0,0,5,0,Math.PI*2);
  ctx2.lineWidth=3;
  ctx2.stroke();

  //时针
  ctx2.save();
  ctx2.beginPath();
  var h2=360*((h*3600+m*60+s)/(12*3600))/180*Math.PI;
  ctx2.rotate(h2);
  ctx2.strokeStyle='#f08737';
  ctx2.lineWidth=8;
  ctx2.lineCap='round'
  ctx2.moveTo(0,0);
  ctx2.lineTo(0,-50);
  ctx2.stroke();
  ctx2.restore();

  //分针
  ctx2.save();
  ctx2.beginPath();

 var m2=360*((m*60+s)/(3600))/180*Math.PI;*/
   /*ctx2.rotate(Math.PI/30*m);

  

  ctx2.lineWidth=5;
  ctx2.strokeStyle='#f9ab29';
  ctx2.lineCap='round'
  ctx2.moveTo(0,0);
  ctx2.lineTo(0,-70);
  ctx2.stroke();
  ctx2.restore();

  //秒针
  ctx2.save();

  ctx2.beginPath();
  ctx2.rotate(Math.PI/30*s);
  // ctx2.rotate(x);
  ctx2.lineWidth=3;
  ctx2.lineCap='round';
  ctx2.strokeStyle='#ef131a';
  ctx2.moveTo(0,0);
  ctx2.lineTo(0,-80);
  ctx2.stroke();
  ctx2.restore();
 

  ctx2.restore();//复原一开始保存的那个干净的状态
  requestAnimationFrame(drawClock);
}

 
//drawClock(); 
requestAnimationFrame(drawClock); 

*/

      touch.on( '#sence' ,'swipe', function(e){
        e.preventDefault();
        if(e.direction){
          direct =  e.direction;
        }
      })

}