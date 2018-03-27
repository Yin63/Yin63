
// javascript:;
//**************************************

//*	1.	关于
//*		本地播放   
//*		作者：yni63 
//*		作者博客：www.yni63.win  
//*		已完成大多数常规功能
//*		请谨慎按需修改 	// 1.0
	
//*	2.	授权协议
//*		本项目采用MIT开源协议进行授权
//*		并在其基础之上须保留作者的版权注释	

/*Copyright (C) <2018.1.6> <yni63 // yni63.com>
//**************************************/


$(function(){
	
	var tabu = true;
	var sum = null;  // 换曲
	var ul = $('.tabul>div>ul');
	var audio = $('audio').get(0);
	var num = 0;
	audio.onoff=false;

	// 列表控件
	$('.icont1').click(function(){

		if(tabu){

			$('.tabul').css({'opacity':'1','display':'block'});
			$('.collect').css('display','none');
			plays($('.tabul>div>ul>li'));
			$('.collect ul').onff = false;
			tabu = false;
		}else{

			$('.tabul').css({'opacity':'0','display':'none'});
			tabu = true;
		}
		
	});

	// 静音控件
	$('.control-end').click(function(){

		if(audio.muted===false){
			$(this).find('i').html('&#xe796;');
			audio.muted=true;
			

		}else{
			$(this).find('i').html('&#xe600;');
			audio.muted=false;
		}
	})

	// 获取音频
	$('#btn').click(function(){

		var winwidth = $(window).width();

		if($('a > input[type=file]').get(0).files[0]===undefined){
			alert('请选择音频文件！'); return;
		}

		var files = $('a > input[type=file]').get(0).files;

		for(var i=0;i<files.length;i++){

			var li = document.createElement('li');

			var url = window.URL.createObjectURL(files[i]);

			$(li).attr({url:url});
			var muname = files[i].name;
			var Exp = /\W\./;
			Exp.test(muname);

			if(winwidth>768){
				li.innerHTML= '<span class="mpname">'+muname+'</span>'+' '+'<span>'+files[i].lastModifiedDate.toLocaleDateString()+' '+files[i].lastModifiedDate.toLocaleTimeString()+' '+(files[i].size/1024/1024).toFixed(2)+'MB</span><span class="ciont"><i class="iconfont">&#xe609;</i></span>';
			}else{
				if(muname.length>20 && Exp){
					muname = muname.substring(0,20) + '...';
				}else{
					muname = muname.substring(0,50);
				}
				li.innerHTML= '<span class="mpname">'+muname+'</span>'+'<span class="ciont"><i class="iconfont">&#xe609;</i></span>';
			}

			li.num = num;

			 ul.get(0).appendChild(li);

			 num++;

		}

		$('.icont1').click();
		$('a > input[type=file]').val('');
		house();
		
	})

	// 收藏
	function house(){

		var lens = $('.tabul ul>li').length;

		for(var i=0;i< lens;i++){

			$('.tabul ul span:last-child').eq(i).click(function(e){

				$(this).find('i').toggleClass('active');

				e.stopPropagation(); 
			})
		}
	};

	//点击播放
	function plays(obj){

		if(obj.length){

			for(var i=0;i<obj.length;i++){

				obj.eq(i).click(function(){

					audio.src= $(this).attr('url');audio.onoff=true;

					audio.play();$('.bgb>i').html('&#xe750;');

					num = this.num;
					$('.icontainer .option div').css('animation-play-state','running');
					setTimeout(function(){
						$('.end').html(conversion(audio.duration));
					},500)

				})
			}
		}
	}
		
	// 播放控件
	(function (){

		// 上一曲
		$('.bga').click(function(){

			warehouse();

		})

		// 暂停继续
		$('.bgb').click(function(){
	
			if( audio.paused && audio.onoff===true) {
	
				$('.bgb>i').html('&#xe750;');
				audio.play();
				$('.icontainer .option div').css('animation-play-state','running');
				

			}else if(audio.onoff===true){

				$('.bgb>i').html('&#xe74f;');
				audio.pause();
				$('.icontainer .option div').css('animation-play-state','paused');
			}else{
				alert('请先导入并选择歌曲！');
			}
		})

		// 下一曲
		$('.bgc').click(function(){

			warehouse(true);
		})
		
	})();

	//-----------------------------------------------------
	function warehouse(about){

		if (audio.onoff===true) {

			if(!sum){
				sum = num;
			}

			if(about){

				sum++;num = sum;

				if(sum>$('.tabul>div>ul>li').length-1){
					sum=0;num = sum;
				}

			}else{

				sum--;num = sum;

				if(sum<0){
					sum=$('.tabul>div>ul>li').length-1;	num = sum;
				}
			}

			var url = $('.tabul>div>ul>li').eq(sum).attr('url');

			audio.src = url;
			audio.play();

			setTimeout(function(){
				$('.end').html(conversion(audio.duration));
			},500)

		}else{
			alert('请先导入并选择歌曲！');
		}
	}

	//-----------------------------------------------------

	// 音频控制台
	audio.onended=function(){
		
		warehouse(true);
	}

	function audios(){

		// 我的收藏
		$('.icont2')[0].onoff = true;

		$('.icont2').click(function(){
			
			if($(this)[0].onoff){

				var sum = $('.tabul li .iconfont');

				if(sum.length==0){ return;}

				$('.collect').css('display','block');
				$('.tabul').css('display','none');

				var arr = [];

				for(var i=0;i<sum.length;i++){

					if (sum.eq(i).is('.active')) {

						arr.push($('.tabul li').get(i));
					};
				}

				for(var j=0;j<arr.length;j++){

					$('.collect>ul').get(0).innerHTML+=arr[j].outerHTML;
				}
				$(this)[0].onoff = false;
				plays($('.collect ul li'));
			}else{

				$(this)[0].onoff = true;
				$('.collect>ul').get(0).innerHTML='';
				$('.collect').css('display','none');
			}

		})

		// 单曲/全部 循环
		$('.icont3')[0].onoff = true;

		$('.icont3').click(function(){
			
			if($('.icont3')[0].onoff){

				$(this).find('i').html('&#xe601;');

				audio.onended=function(){

					audio.play();

				}

				$('.icont3')[0].onoff = false;

			}else{

				$(this).find('i').html('&#xe871;');

				audio.onended=function(){
						
						warehouse(true);

				}

				$('.icont3')[0].onoff = true;
			}
		})
	}

	audios();

	//  音乐进度条
	function conversion(value){
		var minute = Math.floor(value / 60);
		minute = minute.toString().length === 1 ? ('0' + minute) : minute;
		var second = Math.round(value % 60);
		 second = second.toString().length === 1 ? ('0' + second) : second;
		 return minute+ ':' + second;
	}

	(function (){

		var porgress = $('.progress');
		var start = $('.start');
		var porgressBar = $('.progressbar');
		var now = $('.now');
		var end = $('.end');

		clearInterval(porgress.timer);

		porgressBar.click(function(e){

			var coordStart = $(this).get(0).getBoundingClientRect().left;
			var coordEnd = e.pageX;
			var P = (coordEnd-coordStart) / $(this).outerWidth();

			now.css('width',P.toFixed(3) * 100 + '%');

			if(audio.onoff){
				audio.currentTime = P * audio.duration;
			}
			
		})

		porgress.timer = setInterval(function(){

			start.html(conversion(audio.currentTime));
			now.css('width',audio.currentTime / audio.duration.toFixed(3) * 100 + '%');

		},1000)

	})();

	// 补充 PC端 ===> 移动端

	$('#heden').on('click',function(){

		$('.online').toggle();
		$('.icontainer').toggle();
	})

})

$('button[type="button"]').on('click',function(){
	if($(this).attr('aria-expanded')){
		$('nav.navbar').css('opacity','1');
	}else{
		$('nav.navbar').css('opacity','.8');
	}
})

if($(window).width()<768){
	$('.online').css('height',($(window).height()-50)+'px');
	$('body').css('height',$(window).height()+'px');
}

$('nav div.collapse ul>:first').on('click',function(){
	if($(window).width()<768){
		$('.profile').animate({width:'100%'},'slow');
	}else{
		$('.profile').animate({width:'80%'},'slow');
	}
	setTimeout(function(){
		$('.profile .contxt').animate({opacity:'1'},'slow');
	},500)
	
})

$('.profile >.close').on('click',function(){
	$('.profile .contxt').animate({opacity:'0'},'slow');
	setTimeout(function(){
		$('.profile').animate({width:'0%'},'slow');
	},500)
})