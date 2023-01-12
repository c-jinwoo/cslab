/*
 *	회사명 : (주)씨에스랩
 *	작성자 : 최진우
 *	작성일 : 2020/10/30
 */
/* 캔버스 사이즈 설정 */
const cvs = document.getElementById("canvas"),													// 캔버스 객체 선언
	  ctx = cvs.getContext("2d");																// 캔버스 컨텍스트 선언
const device = deviceCheck();																	// 기기 확인용
const browser = browserCheck();																	// 브라우저 확인용
const absWidth = 800, absHeight = 530;															// 실제 절대 크기
const mobileLandscapeBg = "./image/bg_landscape.png";											// 모바일 가로모드 배경경로
const mobilePortraitBg = "./image/bg_portrait.png";												// 모바일 세로모드 배경경로
let wR = 1, hR = 1,																				// 디바이스 화면 비율(PC 디폴트 1)
	deviceAng = 0;																				// 디바이스 화면 회전값(모바일용)
(function(){
	if(device == "PC"){	
		cvsSet();	
	}					
	else{	
		setTimeout(function(){
			cvsSet();
		},500);	
	}
})();
/* 미디어 파일 설정 및 로드 */
let sourceLoadCnt = 0;																			// 총 로드 갯수
const cvs_Arr	= new Array(),																	// 이미지 랜더링 용 캔버스 배열
	  ctx_Arr	= new Array();																	// 이미지 랜더링 용 컨텍스트	배열 
const img_Arr	= [	
	["load/loading.png"],																		// 0
	["intro/bg.png"],															
	["intro/boy.png"],		
	["intro/logo.png"],	
	["intro/btn_start.png"],	
	["intro/btn_method.png"],																	// 5
	["intro/btn_sound.png"],													
	["intro/layer.png"],
	["intro/method/bg.png"],	
	["intro/method/content.png"],
	["intro/method/btn_exit.png"],																// 10
	["intro/method/btn_prev.png"],												
	["intro/method/btn_next.png"],											
	["intro/method/dot.png"],	
	["intro/select/bg.png"],	
	["intro/select/btn_exit.png"], 																// 15
	["intro/select/btn_start.png"],												
	["intro/select/gender.png"],	
	["intro/conv/bg.png"],		
	["intro/conv/char.png"],	
	["intro/conv/btn_skip.png"],																// 20
	["intro/conv/btn_next.png"],													
	["intro/conv/btn_start.png"],
	["intro/conv/press.png"],		
	["main/bg.png"],			
	["main/stage_alert.png"],																	// 25
	["main/btn_exit.png"],														
	["main/shadow.png"],	
	["main/exit/bg.png"],		
	["main/exit/btn_yes.png"],		
	["main/exit/btn_no.png"],																	// 30
	["main/try/bg.png"],														
	["main/try/btn_yes.png"],		
	["main/try/btn_no.png"],	
	["main/ui/top.png"],	
	["main/ui/btm.png"],																		// 35
	["main/ui/stage.png"],														
	["main/ui/heart.png"],			
	["main/ui/attempt.png"],		
	["main/ui/top_gage.png"],		
	["main/over/bg.png"],																		// 40
	["main/over/btn_home.png"],													
	["main/clear/bg.png"],														
	["main/clear/btn_home.png"],	
	["main/asset/1/person1.png"],
	["main/asset/1/person2.png"],																// 45
	["main/asset/1/person3.png"],											
	["main/asset/1/mp_fill.png"],		
	["main/asset/1/mp1.png"],		
	["main/asset/1/mp2.png"],	
	["main/asset/1/mp1_down.png"],																// 50
	["main/asset/1/card.png"],													
	["main/asset/1/card_down.png"],	
	["main/asset/1/baloon1.png"],					
	["main/asset/1/baloon2.png"],			
	["main/asset/1/baloon3.png"],																// 55
	["main/asset/1/baloon4.png"],											
	["main/asset/1/baloon5.png"],					
	["main/asset/1/baloon6.png"],				
	["main/asset/1/baloon7.png"],	
	["main/asset/1/baloon8.png"],																// 60
	["main/asset/1/baloon9.png"],										
	["main/asset/2/person1.png"],
	["main/asset/2/person2.png"],
	["main/asset/2/person3.png"],
	["main/asset/2/rock.png"],																	// 65
	["main/asset/2/jh.png"],												
	["main/asset/2/jh_fill.png"],
	["main/asset/2/book.png"],
	["main/asset/2/book_down.png"],		
	["main/asset/2/baloon1.png"],																// 70	
	["main/asset/2/baloon2.png"],												
	["main/asset/2/baloon3.png"],
	["main/asset/2/baloon4.png"],
	["main/asset/2/baloon5.png"],
	["main/asset/2/baloon6.png"],																// 75
	["main/asset/2/baloon7.png"],												
	["main/asset/2/baloon8.png"],		
	["main/asset/2/baloon9.png"],
	["main/asset/3/person1.png"],
	["main/asset/3/person2.png"],																// 80
	["main/asset/3/rock1.png"],												
	["main/asset/3/rock2.png"],
	["main/asset/3/rock3.png"],
	["main/asset/3/rock_fill.png"],
	["main/asset/3/info.png"],																	// 85
	["main/asset/3/baloon1.png"],												
	["main/asset/3/baloon2.png"],
	["main/asset/3/baloon3.png"],
	["main/asset/3/baloon4.png"],
	["main/asset/3/baloon5.png"],																// 90
	["main/asset/3/baloon6.png"],												
	["main/asset/3/baloon7.png"],	
	["main/asset/4/person1.png"],
	["main/asset/4/person2.png"],
	["main/asset/4/person3.png"],																// 95
	["main/asset/4/board_fill.png"],											
	["main/asset/4/board1.png"],
	["main/asset/4/board1_down.png"],
	["main/asset/4/board2.png"],
	["main/asset/4/board2_down.png"],															// 100
	["main/asset/4/board3.png"],												
	["main/asset/4/board3_down.png"],
	["main/asset/4/baloon.png"],
	["main/asset/4/baloon1.png"],	
	["main/asset/4/baloon2.png"],																// 105										
	["main/asset/4/baloon3.png"],												
	["main/asset/4/baloon4.png"],
	["main/asset/4/baloon5.png"],
	["main/asset/4/baloon6.png"],
	["main/asset/4/baloon7.png"],																// 110									
	["main/asset/4/baloon8.png"],												
	["main/asset/4/baloon9.png"],
	["main/asset/5/person1.png"],
	["main/asset/5/person2.png"],
	["main/asset/5/person3.png"],																// 115
	["main/asset/5/person4.png"],										
	["main/asset/5/trash.png"],
	["main/asset/5/info.png"],
	["main/asset/5/jewel.png"],
	["main/asset/5/jewel_down.png"],															// 120
	["main/asset/5/news.png"],													
	["main/asset/5/news_down.png"],
	["main/asset/5/can.png"],
	["main/asset/5/can_down.png"],
	["main/asset/5/grass.png"],																	// 125
	["main/asset/5/baloon1.png"],												
	["main/asset/5/baloon2.png"],												
	["main/asset/5/baloon3.png"],												
	["main/asset/5/baloon4.png"],
	["main/asset/5/baloon5.png"],																// 130
	["main/asset/5/baloon6.png"],											
	["main/asset/5/baloon7.png"],												
	["main/asset/5/baloon8.png"],											
	["main/asset/5/baloon9.png"],
	["main/asset/5/baloon10.png"],																// 135 											
	["main/asset/5/baloon11.png"],												
	["main/asset/5/baloon12.png"],
	["main/asset/6/person1.png"],
	["main/asset/6/person2.png"],
	["main/asset/6/person3.png"],																// 140
	["main/asset/6/chair1.png"],												
	["main/asset/6/chair2.png"],
	["main/asset/6/chair3.png"],
	["main/asset/6/person4.png"],
	["main/asset/6/person4_down.png"],															// 145
	["main/asset/6/book1.png"],													
	["main/asset/6/book1_down.png"],
	["main/asset/6/book2.png"],
	["main/asset/6/book2_down.png"],
	["main/asset/6/cloth.png"],																	// 150
	["main/asset/6/cloth_down.png"],											
	["main/asset/6/chair1_filled.png"],	
	["main/asset/6/bar.png"],
	["main/asset/6/baloon1.png"],												
	["main/asset/6/baloon2.png"],																// 155											
	["main/asset/6/baloon3.png"],												
	["main/asset/6/baloon4.png"],
	["main/asset/6/baloon5.png"],
	["main/asset/6/baloon6.png"],												
	["main/asset/6/baloon7.png"],																// 160										
	["main/asset/6/baloon8.png"],												
	["main/asset/6/baloon9.png"],
	["main/asset/6/baloon10.png"],												
	["main/asset/6/baloon11.png"],												
	["main/asset/6/baloon12.png"],																// 165
	["main/result_alert.png"],													
	["main/eff_correct.png"],	
	["main/eff_wrong.png"],			
];
const aud_Arr	= [
	["bgm.mp3"],
	["btn_click.mp3"],	
	["method.mp3"],	
	["correct.mp3"],	
	["wrong.mp3"],	
	["nextlevel.mp3"],	
	["gameOver.mp3"],	
];
const vid_Arr	= [	
];
const Txt		= function(){};																	// 텍스트 프로토타입용 객체
const Vid		= function(){};																	// 비디오 프로토타입용 객체
(function(){						
	device == "PC" ? cvsSet() : setTimeout(function(){cvsSet();},500);							// 기기 별 캔버스 사이즈 설정

	for(let i=0;i<img_Arr.length;i++){
		img_Arr[i].push(document.createElement("img"));
		img_Arr[i][1].src = "image/" + img_Arr[i][0];
		cvs_Arr.push(document.createElement("canvas"));
		ctx_Arr.push(cvs_Arr[i].getContext("2d"));
		(function(k){
			img_Arr[k][1].onload = function(){
				cvs_Arr[k].width = img_Arr[k][1].width;
				cvs_Arr[k].height = img_Arr[k][1].height;
				ctx_Arr[k].drawImage(img_Arr[k][1], 0, 0);
				if(k == 0){
					load();
				}
				loadContent();
			};
		})(i);
	}
	for(let i=0;i<aud_Arr.length;i++){
		aud_Arr[i].push(document.createElement("audio"));
		aud_Arr[i][1].src = "audio/" + aud_Arr[i][0];
		aud_Arr[i][1].preload = "auto";
		aud_Arr[i][1].load();
		if(i == 0){
			aud_Arr[i][1].loop = true;
		}
		(function(k){
			aud_Arr[k][1].onloadeddata = function(){
				if(k == 0 && browser != "Chrome"){
					aud_Arr[k][1].play();
				}
				loadContent();
			};
		})(i);
	}
	for(let i=0;i<vid_Arr.length;i++){
		vid_Arr[i].push(document.createElement("video"));
		vid_Arr[i][1].src = "video/" + vid_Arr[i][0];
		vid_Arr[i][1].playsInline = true;
		vid_Arr[i][1].autoplay = true;
		vid_Arr[i][1].loop = false;
		vid_Arr[i][1].volume = 0;
		(function(k){
			vid_Arr[k][1].onloadeddata = function(){
				vid_Arr[k][1].pause();
				vid_Arr[k][1].volume = 1;
				loadContent();
			};
		})(i);
	}
})();
/* 프로토타입 */
{
	Object.prototype.idx = 0;			Object.prototype.colCnt = 1;
	Object.prototype.rowCnt = 1;		Object.prototype.sprCnt = 1;
	Object.prototype.ani = 0;			Object.prototype.x_ori = 0;
	Object.prototype.y_ori = 0;			Object.prototype.x_diff = 0;
	Object.prototype.y_diff = 0;		Object.prototype.cutIdx = 0;
	Object.prototype.val = 0;			Object.prototype.delay = 0;
	Object.prototype.globalAlpha = 1;

	Object.prototype.isAni = false;		Object.prototype.isBtn = false;
	Object.prototype.mouseOver = false;	Object.prototype.mouseDown = false;
	Object.prototype.isEtc = false;		Object.prototype.isDrag = false;
	Object.prototype.isAlpha = false;	Object.prototype.appear = false;
	Object.prototype.disappear = false;	Object.prototype.load = false;
	Object.prototype.unload = false;

	/* 초기 세팅 */
	Object.prototype.init = function(info){
		try{
			this.idx	= (info.idx == null)	? log("이미지 idx 오류")					: info.idx;
			this.active = (info.active == null) ? true									: info.active;

			if(info.col != null && info.spr != null){
				this.colCnt = info.col;
				this.sprCnt = info.spr;
				this.rowCnt = Math.ceil(this.sprCnt / this.colCnt);
			}

			this.cw		= (info.cw == null)		? cvs_Arr[this.idx].width / this.colCnt	: info.cw;
			this.ch		= (info.ch == null)		? cvs_Arr[this.idx].height/ this.rowCnt	: info.ch;
			this.cx		= (info.cx == null)		? 0										: info.cx;
			this.cy		= (info.cy == null)		? 0										: info.cy;
			this.w		= (info.w == null)		? cvs_Arr[this.idx].width / this.colCnt	: info.w;
			this.h		= (info.h == null)		? cvs_Arr[this.idx].height/ this.rowCnt	: info.h;
			this.x		= (info.x == null)		? 0										: (info.x == "center" ? (absWidth - this.w) * 0.5	: info.x);
			this.y		= (info.y == null)		? 0										: (info.y == "center" ? (absHeight - this.h) * 0.5	: info.y);
		}
		catch(e){log("이미지 init 오류");}		
	};
	/* 애니메이션 세팅 */
	Object.prototype.aniSet = function(aniDelay){
		this.isAni		= true;
		this.aniDelay	= aniDelay;
	};
	Object.prototype.aniFunc = function(){
		this.ani++;
		if(this.ani >= this.sprCnt * this.aniDelay){
			this.aniFinFunc();
		}
		this.cx = Math.floor((this.ani % (this.colCnt * this.aniDelay)) / this.aniDelay) * this.cw;
		this.cy = Math.floor(this.ani / (this.colCnt * this.aniDelay)) * this.ch;		
	};
	Object.prototype.aniFinFunc = function(){
		this.ani = 0;
	};
	/* 버튼 세팅 */
	Object.prototype.btnSet = function(){
		this.isBtn = true;
	};
	Object.prototype.mouseFunc = function(){
		if(this.colCnt > 1){
			if(this.mouseDown){
				this.cx = this.cw * 2;
			}
			else if(this.mouseOver){
				this.cx = this.cw;
			}
			else{
				this.cx = 0;
			}
		}
		if(this.rowCnt > 1){
			if(this.mouseDown){
				this.cy = this.ch * 2;
			}
			else if(this.mouseOver){
				this.cy = this.ch;
			}
			else{
				this.cy = 0;
			}
		}
	};
	/* 기타 세팅 */
	Object.prototype.etcSet = function(){
		this.isEtc = true;
	};
	Object.prototype.etcFunc = function(){
		log("etcFunc 정의 필요.");
		this.isEtc = false;
	};
	/* 투명도 세팅 */
	Object.prototype.alphaSet = function(globalAlpha){
		this.isAlpha = true;
		this.globalAlpha = (globalAlpha == null) ? this.globalAlpha : globalAlpha;
	};
	Object.prototype.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y -= 2;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y += 2;
			}
		}
	};
	/* 단일 세팅 */
	Object.prototype.cutSet = function(cutIdx){
		this.cutIdx = (cutIdx == null) ? this.cutIdx : cutIdx;
		this.cx = (this.cutIdx % this.colCnt) * this.cw;
		this.cy = Math.floor(this.cutIdx / this.colCnt) * this.ch;
		this.isAni = false;
	};
	/* 드래그 세팅 */
	Object.prototype.dragSet = function(){
		this.x_ori = this.x;
		this.y_ori = this.y;
	};
	Object.prototype.dragDown = function(){
		this.isDrag = true;
		this.x_diff = mouseX / wR - this.x;
		this.y_diff = mouseY / hR - this.y;
	};
	Object.prototype.dragMove = function(){
		this.x = mouseX / wR - this.x_diff;
		this.y = mouseY / hR - this.y_diff;
	};
	Object.prototype.dragUp = function(bool){
		this.isDrag = false;
		if(bool){
			this.x = this.x_ori;
			this.y = this.y_ori;
		}
	};
	/* 그리기 */
	Object.prototype.draw = function(){
		try{ 
			if(this.active){
				if(this.isAni){
					this.aniFunc();
				}
				if(this.isBtn){
					this.mouseFunc();
				}
				if(this.isEtc){
					this.etcFunc();
				}
				if(this.isAlpha){
					this.alphaFunc();
					ctx.save();
					ctx.globalAlpha = this.globalAlpha;
				}
				ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				if(this.isAlpha){			
					ctx.restore();
				}
			}
		}
		catch(e){log("이미지 draw 오류");}
	};
	/* 동영상 세팅 */
	Vid.prototype.init = function(info){
		try{
			this.idx	= (info.idx == null)	? log("비디오 idx 오류")	: info.idx; 
			this.active = (info.active == null) ? true					: info.active;
			this.x		= (info.x == null)		? 0						: info.x;
			this.y		= (info.y == null)		? 0						: info.y;
			this.w		= (info.w == null)		? absWidth				: info.w;
			this.h		= (info.h == null)		? absHeight				: info.h;
		}
		catch(e){log("비디오 init 오류");}
	}; 
	Vid.prototype.play = function(){
		vid_Arr[this.idx][1].play();
	}; 
	Vid.prototype.pause = function(){
		vid_Arr[this.idx][1].pause();
	}; 
	Vid.prototype.stop = function(){
		vid_Arr[this.idx][1].currentTime = 0;
		vid_Arr[this.idx][1].pause();
	}; 
	Vid.prototype.duration = function(){
		return vid_Arr[this.idx][1].duration;
	}; 
	Vid.prototype.time = function(time){
		if(time == null){
			return vid_Arr[this.idx][1].currentTime;
		}
		else{
			vid_Arr[this.idx][1].currentTime = time;
		}
	}; 
	Vid.prototype.volume = function(volume){
		if(volume == null){
			return vid_Arr[this.idx][1].volume;
		}
		else{
			vid_Arr[this.idx][1].volume = volume;
		}
	}; 
	Vid.prototype.draw = function(){
		try{ 
			if(this.active){
				ctx.drawImage(vid_Arr[this.idx][1], this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
		}
		catch(e){log("비디오 draw 오류");}
	};
	/* 텍스트 세팅 */
	Txt.prototype.init = function(info){
		try{
			this.txt	= (info.txt == null)	? "텍스트를 입력해주세요."	: info.txt;
			this.x		= (info.x == null)		? absWidth * 0.5	: info.x;
			this.y		= (info.y == null)		? absHeight * 0.5	: info.y;
			this.size	= (info.size == null)	? 20				: info.size;
			this.color	= (info.color == null)	? "#000"			: info.color;
			this.align	= (info.align == null)	? "center"			: info.align;
			this.w		= ctx.measureText(this.txt).width;
		}
		catch(e){log("텍스트 init 오류");}
	}; 
	Txt.prototype.draw = function(){
		try{ 
			ctx.font = "bold "+(this.size * hR)+"px '맑은고딕'";
			ctx.fillStyle = this.color;
			ctx.textAlign = this.align;
			ctx.fillText(this.txt, this.x * wR, this.y * hR);	
		}
		catch(e){log("텍스트 draw 오류");}
	};
}
/* 미디어 오브젝트 선언 */
const Loading = function(){
	this.init({idx:0, col:6, spr:12, x:"center", y:"center"});
	this.aniSet(3);
};
const Intro_bg = function(){
	this.init({idx:1});
};
const Intro_boy = function(){
	this.init({idx:2, x:360, y:20});
	this.vy = 0.125;
};
const Intro_logo = function(){
	this.init({idx:3, x:"center", y:125});
	this.vy = -0.125;
};
const Intro_start_btn = function(){
	this.init({idx:4, col:2, spr:2, x:"center", y:425});
	this.btnSet();
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y -= 2;
			}
			else{
				this.clickable = true;
			}
		}
		else{
			this.clickable = false;
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y += 2;
			}
		}
	};
};
const Intro_method_btn = function(){
	this.init({idx:5, col:2, spr:2, x:"center", y:480});
	this.btnSet();
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y -= 2;
			}
			else{
				this.clickable = true;
			}
		}
		else{
			this.clickable = false;
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y += 2;
			}
		}
	};
};
const Intro_sound_btn = function(){
	this.init({idx:6, col:2, spr:4, x:720, y:58});
	this.btnSet();
	this.mouseFunc = function(){
		if(this.mouseOver){
			this.cx = 56;
		}
		else{
			this.cx = 0;
		}
		if(volume){
			this.cy = 0;
		}
		else{
			this.cy = 56;
		}

	};
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y -= 2;
			}
			else{
				this.clickable = true;
			}
		}
		else{
			this.clickable = false;
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y += 2;
			}
		}
	};
};
const Intro_layer = function(){
	this.init({idx:7});
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
			}
		}
	};
};
const Method_bg = function(){
	this.init({idx:8, x:65, y:110});
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y -= 2;
			}
			else{
				this.load = true;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y += 2;
			}
			else{
				this.load = false;
			}
		}
	};
};
const Method_content = function(){
	this.init({idx:9, col:4, spr:4, x:100, y:185, w:600, h:270});
	this.pageIdx = 0;
	this.slideRight = false;
	this.slideLeft = false;
	this.alphaSet(0);
};
const Method_exit_btn = function(){
	this.init({idx:10, col:2, spr:2, x:690, y:90, w:60, h:60});
	this.btnSet();
	this.alphaSet(0);
};
const Method_prev_btn = function(){
	this.init({idx:11, active:false, col:2, spr:2, x:270, y:463});
	this.btnSet();
	this.alphaSet(0);
	this.draw = function(){
		try{ 
			if(this.isAni){
				this.aniFunc();
			}
			if(this.isBtn){
				this.mouseFunc();
			}
			this.alphaFunc();
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			if(this.active){
				ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}		
			ctx.restore();
		}
		catch(e){}
	};
};
const Method_next_btn = function(){
	this.init({idx:12, active:false, col:2, spr:2, x:435, y:463});
	this.btnSet();
	this.alphaSet(0);
	this.draw = function(){
		try{ 
			if(this.isAni){
				this.aniFunc();
			}
			if(this.isBtn){
				this.mouseFunc();
			}
			this.alphaFunc();
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			if(this.active){
				ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}		
			ctx.restore();
		}
		catch(e){}
	};
};
const Method_dot = function(){
	this.init({idx:13, x:0, y:477});
	this.alphaSet(0);
};
const Select_bg = function(){
	this.init({idx:14, x:"center", y:120});
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y -= 2;
			}
			else{
				this.load = true;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y += 2;
			}
			else{
				this.load = false;
			}
		}
	};
};
const Select_exit_btn = function(){
	this.init({idx:15, col:2, spr:2, x:690, y:100, w:60, h:60});
	this.btnSet();
	this.alphaSet(0);
};
const Select_start_btn = function(){
	this.init({idx:16, col:2, spr:2, x:"center", y:443});
	this.btnSet();
	this.alphaSet(0);
};
const Select_male_btn = function(){
	this.init({idx:17, col:4, spr:8, x:90, y:195, w:310, h:240});
	this.cy = 0;
	this.on = true;
	this.alphaSet(0);
	this.btnSet();
	this.mouseFunc = function(){
		if(this.on){
			if(this.mouseOver){
				this.cx = 261;
			}
			else{
				this.cx = 0;
			}
		}
		else{
			if(this.mouseOver){
				this.cx = 783;
			}
			else{
				this.cx = 522;
			}
		}
	};
};
const Select_female_btn = function(){
	this.init({idx:17, col:4, spr:8, x:400, y:195, w:310, h:240});
	this.cy = 201;
	this.on = false;
	this.alphaSet(0);
	this.btnSet();
	this.mouseFunc = function(){
		if(this.on){
			if(this.mouseOver){
				this.cx = 261;
			}
			else{
				this.cx = 0;
			}
		}
		else{
			if(this.mouseOver){
				this.cx = 783;
			}
			else{
				this.cx = 522;
			}
		}
	};
};
const Conv_user_bg = function(){
	this.init({idx:18, x:"center", y:220});
	this.on = false;
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				if(this.on){
					this.x += 5;
				}
				else{
					this.y -= 2;
				}
			}
			else{
				this.load = true;
				this.on = true;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				if(this.on){
					this.x -= 5;
				}
				else{
					this.y += 2;
				}
			}
			else{
				this.load = false;
			}
		}
	};
};
const Conv_pc_bg = function(){
	this.init({idx:18, x:230, y:182});
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.x -= 5;
			}
			else{
				this.load = true;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.x += 5;
			}
			else{
				this.load = false;
			}
		}
	};
};
const Conv_user_text = function(){
	this.x = 300;this.y = 260;
	this.globalAlpha = 0;
	this.appear = false;
	this.on = false;
	this.draw = function(){
		try{ 
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					if(this.on){
						this.x += 5;
					}
					else{
						this.y -= 2;
					}
				}
				else{
					this.on = true;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					if(this.on){
						this.x -= 5;
					}
					else{
						this.y += 2;
					}
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;	
			ctx.font = "bold "+(20 * hR)+"px '나눔스퀘어'";
			ctx.fillStyle = "#8C5932";
			ctx.textAlign = "left";											
			for(let i=0;i<conv_user_result_Arr.length;i++){	
				ctx.fillText(conv_user_result_Arr[i], this.x * wR, (this.y + i * 30) * hR);
			}
			ctx.restore();
		}
		catch(e){}
	};
};
const Conv_pc_text = function(){
	this.x = 260;this.y = 220;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
			if(this.appear){
				if(this.globalAlpha < 0.95){7
					this.globalAlpha += 0.05;
					this.x -= 5;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.x += 5;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.font = "bold "+(20 * hR)+"px '나눔스퀘어'";
			ctx.fillStyle = "#8C5932";
			ctx.textAlign = "left";												
			for(let i=0;i<conv_pc_result_Arr.length;i++){	
				ctx.fillText(conv_pc_result_Arr[i], this.x * wR, (this.y + i * 30) * hR);
			}
			ctx.restore();
		}
		catch(e){}
	};
};
const Conv_user_char = function(){
	this.init({idx:19, col:3, spr:3, x:50, y:190});
	this.on = false;
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(gender == 1){
			this.cutSet(0);
		}
		else{
			this.cutSet(1);
		}
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				if(this.on){
					this.x += 5;
				}
				else{
					this.y -= 2;
				}
			}
			else{
				this.on = true;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.x -= 5;
			}
		}
	};
};
const Conv_pc_char = function(){
	this.init({idx:19, col:3, spr:3, x:620, y:150});
	this.cutSet(2);
	this.on = true;
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.x -= 5;					
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.x += 5;
			}
		}
	};
};
const Conv_skip_btn = function(){
	this.init({idx:20, col:2, spr:2, x:670, y:60});
	this.btnSet();
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y -= 2;
			}
			else{
				this.clickable = true;
			}
		}
		else{
			this.clickable = false;
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y += 2;
			}
		}
	};
};
const Conv_next_btn = function(){
	this.init({idx:21, col:2, spr:2, x:0, y:325});
	this.clickable = true;
	this.btnSet();
};
const Conv_start_btn = function(){
	this.init({idx:22, active:false, col:1, spr:2, x:140, y:325});
	this.clickable = false;
	this.btnSet();
};
const Conv_press = function(){
	this.init({idx:23, col:1, spr:14, x:"center", y:490});
	this.alphaSet(0);
	this.aniSet(6);
};
const Main_bg = function(){
	this.init({idx:24, col:7, spr:7});
	this.draw = function(){
		try{ 
			if(gameOver || gameClear){
				this.cx = 4800;
			}
			else{
				this.cx = (stage - 1) * 800;
			}
			ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Main_stage_alert = function(){
	this.x = 0;
	this.y = 120;
	this.w = 800;
	this.h = 120;
	this.cx = 0;this.cw = 800;this.ch = 120;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.load = false;
	this.delay = 0;
	this.draw = function(){
		try{ 
			this.cy = (stage - 1) * 120;
			if(this.appear){
				this.active = true;
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y += 4;
				}
				else{
					this.delay++;
					if(this.delay > 60){
						this.appear = false;
						this.delay = 0;
					}
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y -= 4;
				}
				else{
					this.load = true;
					this.active = false;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[25], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_exit_btn = function(){
	this.init({idx:26, col:2, spr:2, x:720, y:10, w:60, h:60});
	this.btnSet();
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
			}
			else{
				this.clickable = true;
			}
		}
		else{
			this.clickable = false;
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
			}
		}
	};
};
const Main_shadow = function(){
	this.init({idx:27});
	this.draw = function(){
		try{ 
			if(!gameOver && !gameClear){
				if(this.appear){
					if(this.globalAlpha < 0.95){
						this.globalAlpha += 0.05;
					}
				}
				else{
					if(this.globalAlpha > 0.05){
						this.globalAlpha -= 0.05;
					}
				}
			}
			else{
				this.globalAlpha = 1;
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_exit_bg = function(){
	this.init({idx:28, x:"center", y:"center"});
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
			}
			else{
				this.load = true;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
			}
			else{
				this.load = false;
			}
		}
	};
};
const Main_exit_yes_btn = function(){
	this.init({idx:29, col:2, spr:2, x:250, y:320});
	this.btnSet();
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
			}
		}
	};
};
const Main_exit_no_btn = function(){
	this.init({idx:30, col:2, spr:2, x:410, y:320});
	this.btnSet();
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
			}
		}
	};
};
const Main_try_bg = function(){
	this.init({idx:31, x:"center", y:"center"});
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
			}
			else{
				this.load = true;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
			}
			else{
				this.load = false;
			}
		}
	};
};
const Main_try_yes_btn = function(){
	this.init({idx:32, col:2, spr:2, x:410, y:320});
	this.btnSet();
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
			}
		}
	};
};
const Main_try_no_btn = function(){
	this.init({idx:33, col:2, spr:2, x:250, y:320});
	this.btnSet();
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
			}
		}
	};
};
const Main_top_bg = function(){
	this.init({idx:34, x:"center", y:-38});
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y += 2;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y -= 2;
			}
		}
	};
};
const Main_btm_bg = function(){
	this.init({idx:35, x:"center", y:514});
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y -= 2;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y += 2;
			}
		}
	};
};
const Main_top_stage = function(){
	this.init({idx:36, col:6, spr:6, x:220, y:-20});
	this.alphaSet(0);
	this.alphaFunc = function(){
		this.cx = (stage - 1) * 42;
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y += 2;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y -= 2;
			}
		}
	};
};
const Main_top_gage = function(){
	/* 게이지 마스크 */
	this.x_bg = 658;
	this.w_bg = 0;
	this.cx_bg = 299;this.cy_bg = 0;this.cw_bg = 1;this.ch_bg = 11;
	/* 게이지 본체 */
	this.x = 358;
	this.y = -11;
	this.w = 300;
	this.h = 11;	
	this.cx = 0;this.cy = 11;this.cw = 300;this.ch = 11;
	/* 속성 설정값 */
	this.ani = 0;
	this.globalAlpha = 0;
	this.x_ratio = 0.5;
	this.appear = false;
	this.pause = true;
	this.over = false;
	this.draw = function(){
		try{ 
			if(!this.pause){
				this.aniFunc();
			}
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y += 2;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y -= 2;
				}
			}
			/* 본체 애니 */
			this.ani++;
			if(this.ani >= 16){
				this.ani = 0;
			}
			this.cy = (Math.floor(this.ani / 4) + 1) * 11;	
			ctx.save();
			ctx.globalAlpha = this.globalAlpha; 
			/* 게이지 본체 */
			ctx.drawImage(cvs_Arr[39], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			/* 게이지 마스크 */
			ctx.drawImage(cvs_Arr[39], this.cx_bg, this.cy_bg, this.cw_bg, this.ch_bg, this.x_bg * wR, this.y * hR, this.w_bg * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
	this.aniFunc = function(){	
		/* 마스크 애니 */
		this.x_bg -= this.x_ratio;
		this.w_bg += this.x_ratio;
		this.cx_bg -= this.x_ratio;
		this.cw_bg += this.x_ratio;
		if(this.cw_bg >= 300){
			this.pause = true;
			this.over = true;
		}		
	}
};
const Main_btm_heart = function(){
	this.init({idx:37, col:2, spr:2, x:0, y:533});
	this.on = true;
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.on){
			this.cx = 0;
		}
		else{
			this.cx = 27;
		}
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y -= 2;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y += 2;
			}
		}
	};
};
const Main_btm_attempt = function(){
	this.init({idx:38, col:3, spr:9, x:530, y:530});
	this.success = 0;
	this.total = 0;
	this.alphaSet(0);
	this.alphaFunc = function(){
		this.cx = this.success * 45;
		this.cy = (this.total - 1) * 30;
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y -= 2;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y += 2;
			}
		}
	};
};
const Main_over_bg = function(){
	this.init({idx:40, x:"center", y:"center"});
};
const Main_over_home_btn = function(){
	this.init({idx:41, col:2, spr:2, x:"center", y:360});
	this.btnSet();
};
const Main_clear_bg = function(){
	this.init({idx:42, x:"center", y:"center"});
};
const Main_clear_home_btn = function(){
	this.init({idx:43, col:2, spr:2, x:"center", y:370});
	this.btnSet();
};
const Main_clear_content = function(){
	this.x = 400;
	this.y = 275;
	this.draw = function(){
		try{ 
			ctx.textAlign = "center";	
			if(loggedIn){
				ctx.font = "bold "+(20 * hR)+"px '나눔스퀘어'";
				ctx.fillStyle = "#000";
				ctx.fillText(userId+"님!!", this.x * wR, this.y * hR);
				ctx.fillText("게임 '헌법재판 헌법재판관'을 완료하였습니다.", this.x * wR, (this.y + 30) * hR);
				ctx.fillText("축하합니다!", this.x * wR, (this.y + 60) * hR);
			}
			else{
				ctx.font = "bold "+(17 * hR)+"px '나눔스퀘어'";
				ctx.fillStyle = "#bcbcbc";
				ctx.fillText("어린이 헌법재판소 사이트에 회원으로 가입하시면", this.x * wR, this.y * hR);
				ctx.fillText("다양한 콘텐츠를 체계적으로 즐길 수 있습니다.", this.x * wR, (this.y + 20) * hR);
				ctx.fillText("회원 가입 후에 다시 도전해보세요!", this.x * wR, (this.y + 45) * hR);
			}
		}
		catch(e){}
	};
};
const Main_result_alert = function(){
	this.x = 0;
	this.y = 120;
	this.width = 800;
	this.height = 120;
	this.cx = 0;this.cw = 800;this.ch = 120;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.load = false;
	this.correct = false;
	this.delay = 0;
	this.draw = function(){
		try{ 
			if(this.correct){
				this.cy = 0;
			}
			else{
				this.cy = 120;
			}
			if(this.appear){
				this.active = true;
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y += 4;
				}
				else{
					this.delay++;
					if(this.delay > 60){
						this.appear = false;
						this.delay = 0;
					}
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y -= 4;
				}
				else{
					this.load = true;
					this.active = false;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[166], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_eff = function(){
	this.x = 0;this.y = 0;
	this.w = 180;
	this.h = 180;
	this.cw = 180;this.ch = 180;
	this.active = false;
	this.ani = 0;
	this.correct = true;
	this.draw = function(){
		try{
			if(this.active){
				this.ani++;
				if(this.ani >= 31){
					this.ani = 0;
					this.active = false;
				}
				this.cx = Math.floor(this.ani / 4) % 4 * 180;
				this.cy = Math.floor(this.ani / 16) * 180;
				if(this.correct){
					ctx.drawImage(cvs_Arr[167], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
				else{
					ctx.drawImage(cvs_Arr[168], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
			}
		}
		catch(e){}
	};
};
/* 인게임 오브젝트 객체들 
 * 스테이지 별 타겟(놓는곳) 아이템 : filled, mouseOver 
 * 스테이지 별 클릭(이동) 아이템 : active, mouseOver, mouseDown, sizeSet()
 */
const As_baloon = function(pidx, px, py){
	this.init({idx:pidx, active:false, x:px, y:py});
	this.itemMatched = false;
};
const As_1_person1 = function(){
	this.x = 10;
	this.y = 225;
	this.w = 115;
	this.h = 243;
	this.cy = 0;this.cw = 115;this.ch = 243;
	this.mouseOver = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.ani++;
				if(this.ani >= 44){
					this.ani = 0;
				}
				this.cx = (Math.floor(this.ani / 3) + 1) * 115;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[44], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_1_person2 = function(){
	this.x = 220;this.y = 210;
	this.w = 119;
	this.h = 276;
	this.cy = 0;this.cw = 119;this.ch = 276;
	this.mouseOver = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.ani++;
				if(this.ani >= 91){
					this.ani = 0;
				}
				this.cx = (Math.floor(this.ani / 4) + 1) * 119;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[45], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_1_person3 = function(){
	this.x = 620;
	this.y = 220;
	this.w = 120;
	this.h = 281;
	this.cw = 120;this.ch = 281;
	this.mouseOver = false;
	this.filled = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.filled){
				this.cy = 281;
			}
			else{
				this.cy = 0;
			}
			if(this.mouseOver){
				this.ani++;
				if(this.ani >= 44){
					this.ani = 0;
				}
				this.cx = (Math.floor(this.ani / 3) + 1) * 120;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[46], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_1_mp_fill = function(){
	this.x = 380;
	this.y = 245;
	this.w = 47;
	this.h = 117;
	this.cy = 0;this.cw = 47;this.ch = 117;
	this.mouseOver = false;
	this.filled = false;
	this.draw = function(){
		try{ 
			if(this.filled){
				this.cx = 94;
			}
			else{
				if(this.mouseOver){
					this.cx = 47;
				}
				else{
					this.cx = 0;
				}
			}
			ctx.drawImage(cvs_Arr[47], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_1_mp1 = function(){
	this.x = this.oriX = 310;
	this.y = this.oriY = 440;
	this.w = 139;
	this.h = 58;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 0;this.cy = 0;this.cw = 34;this.ch = 102;
					ctx.drawImage(cvs_Arr[50], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
				else{
					if(this.mouseOver){
						this.cx = 139;
					}
					else{
						this.cx = 0;
					}
					this.cy = 0;this.cw = 139;this.ch = 58;
					ctx.drawImage(cvs_Arr[48], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		if(this.mouseDown){
			this.w = 34;
			this.h = 102;
		}
		else{
			this.w = 139;
			this.h = 58;
		}
	};
};
const As_1_mp2 = function(){
	this.x = this.oriX = 480;
	this.y = this.oriY = 425;
	this.w = 132;
	this.h = 53;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 94;this.cy = 0;this.cw = 47;this.ch = 117;
					ctx.drawImage(cvs_Arr[47], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
				else{
					if(!this.filled){
						if(this.mouseOver){
							this.cx = 132;
						}
						else{
							this.cx = 0;
						}
						this.cy = 0;this.cw = 132;this.ch = 53;
					}
					ctx.drawImage(cvs_Arr[49], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		if(this.mouseDown){
			this.w = 47;
			this.h = 117;
		}
		else{
			this.w = 132;
			this.h = 53;
		}
	};
};
const As_1_card = function(){
	this.x = this.oriX = 80;
	this.y = this.oriY = 475;
	this.w = 125;
	this.h = 36;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 0;this.cy = 0;this.cw = 65;this.ch = 110;
					ctx.drawImage(cvs_Arr[52], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
				else{
					if(!this.filled){
						if(this.mouseOver){
							this.cx = 125;
						}
						else{
							this.cx = 0;
						}
						this.cy = 0;this.cw = 125;this.ch = 36;
					}
					ctx.drawImage(cvs_Arr[51], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		if(this.mouseDown){
			this.w = 65;
			this.h = 110;
		}
		else{
			this.w = 125;
			this.h = 36;
		}
	};
};
const As_2_person1 = function(){
	this.x = 80;
	this.y = 165;
	this.w = 88;
	this.h = 258;
	this.cy = 0;this.cw = 88;this.ch = 258;
	this.mouseOver = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.ani++;
				if(this.ani >= 47){
					this.ani = 0;
				}
				this.cx = (Math.floor(this.ani / 3) + 1) * 88;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[62], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_2_person2 = function(){
	this.x = 480;
	this.y = 220;
	this.w = 137;
	this.h = 281;
	this.cy = 0;this.cw = 137;this.ch = 281;
	this.mouseOver = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.ani++;
				if(this.ani >= 59){
					this.ani = 0;
				}
				this.cx = (Math.floor(this.ani / 4) + 1) * 137;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[63], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_2_person3 = function(){
	this.x = 650;
	this.y = 200;
	this.w = 93;
	this.h = 193;
	this.cw = 93;this.ch = 193;
	this.mouseOver = false;
	this.filled = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.filled){
				this.cy = 193;
			}
			else{
				this.cy = 0;
			}
			if(this.mouseOver){
				this.ani++;
				if(this.ani >= 44){
					this.ani = 0;
				}
				this.cx = (Math.floor(this.ani / 3) + 1) * 93;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[64], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_2_rock = function(){
	this.x = this.oriX = 220;
	this.y = this.oriY = 290;
	this.w = 127;
	this.h = 198;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 254;this.cy = 0;this.cw = 127;this.ch = 198;
				}
				else{
					if(this.mouseOver){
						this.cx = 127;
					}
					else{
						this.cx = 0;
					}
					this.cy = 0;this.cw = 127;this.ch = 198;
				}
				ctx.drawImage(cvs_Arr[65], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		this.w = 127;
		this.h = 198;
	};
};
const As_2_jh = function(){
	this.x = this.oriX = 660;
	this.y = this.oriY = 420;
	this.w = 104;
	this.h = 96;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 208;this.cy = 0;this.cw = 104;this.ch = 96;
				}
				else{
					if(!this.filled){
						if(this.mouseOver){
							this.cx = 104;
						}
						else{
							this.cx = 0;
						}
						this.cy = 0;this.cw = 104;this.ch = 96;
					}
				}
				ctx.drawImage(cvs_Arr[66], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		this.w = 104;
		this.h = 96;
	};
};
const As_2_jh_fill = function(){
	this.x = 350;
	this.y = 225;
	this.w = 86;
	this.h = 75;
	this.cy = 0;this.cw = 86;this.ch = 75;
	this.mouseOver = false;
	this.filled = false;
	this.draw = function(){
		try{ 
			if(this.filled){
				this.cx = 172;
			}
			else{
				if(this.mouseOver){
					this.cx = 86;
				}
				else{
					this.cx = 0;
				}
			}
			ctx.drawImage(cvs_Arr[67], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_2_book = function(){
	this.x = this.oriX = 20;
	this.y = this.oriY = 420;
	this.w = 109;
	this.h = 86;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 0;this.cy = 0;this.cw = 47;this.ch = 59;
					ctx.drawImage(cvs_Arr[69], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
				else{
					if(!this.filled){
						if(this.mouseOver){
							this.cx = 109;
						}
						else{
							this.cx = 0;
						}
						this.cy = 0;this.cw = 109;this.ch = 86;
					}
					ctx.drawImage(cvs_Arr[68], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		if(this.mouseDown){
			this.w = 47;
			this.h = 59;
		}
		else{
			this.w = 109;
			this.h = 86;
		}
	};
};
const As_3_person1 = function(){
	this.x = 35;
	this.y = 240;
	this.w = 102;
	this.h = 263;
	this.cy = 0;this.cw = 102;this.ch = 263;
	this.mouseOver = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.ani++;
				if(this.ani >= 44){
					this.ani = 0;
				}
				this.cx = (Math.floor(this.ani / 3) + 1) * 102;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[79], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_3_person2 = function(){
	this.x = 670;
	this.y = 200;
	this.w = 111;
	this.h = 306;
	this.cy = 0;this.cw = 111;this.ch = 306;
	this.mouseOver = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.ani++;
				if(this.ani >= 59){
					this.ani = 0;
				}
				this.cx = (Math.floor(this.ani / 4) + 1) * 111;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[80], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_3_rock1 = function(){
	this.x = this.oriX = 250;
	this.y = this.oriY = 290;
	this.w = 143;
	this.h = 237;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 286;this.cy = 0;this.cw = 143;this.ch = 237;
				}
				else{
					if(this.mouseOver){
						this.cx = 143;
					}
					else{
						this.cx = 0;
					}
					this.cy = 0;this.cw = 143;this.ch = 237;
				}
				ctx.drawImage(cvs_Arr[81], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		this.w = 143;
		this.h = 237;
	};
};
const As_3_rock2 = function(){
	this.x = this.oriX = 565;
	this.y = this.oriY = 190;
	this.w = 111;
	this.h = 232;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 222;this.cy = 0;this.cw = 111;this.ch = 232;
				}
				else{
					if(this.mouseOver){
						this.cx = 111;
					}
					else{
						this.cx = 0;
					}
					this.cy = 0;this.cw = 111;this.ch = 232;
				}
				ctx.drawImage(cvs_Arr[82], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		this.w = 111;
		this.h = 232;
	};
};
const As_3_rock3 = function(){
	this.x = this.oriX = 430;
	this.y = this.oriY = 340;
	this.w = 149;
	this.h = 179;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 298;this.cy = 0;this.cw = 149;this.ch = 179;
				}
				else{
					if(this.mouseOver){
						this.cx = 149;
					}
					else{
						this.cx = 0;
					}
					this.cy = 0;this.cw = 149;this.ch = 179;
				}
				ctx.drawImage(cvs_Arr[83], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		this.w = 149;
		this.h = 179;
	};
};
const As_3_rock_fill = function(){
	this.x = 360;
	this.y = 185;
	this.w = 78;
	this.h = 155;
	this.cy = 0;this.cw = 78;this.ch = 155;
	this.mouseOver = false;
	this.filled = false;
	this.draw = function(){
		try{ 
			if(this.filled){
				this.cx = 156;
			}
			else{
				if(this.mouseOver){
					this.cx = 78;
				}
				else{
					this.cx = 0;
				}
			}
			ctx.drawImage(cvs_Arr[84], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_3_info = function(){
	this.x = 180;
	this.y = 300;
	this.w = 122;
	this.h = 107;
	this.cy = 0;this.cw = 122;this.ch = 107;
	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 122;
			}
			else{
				this.cx = 0;
			}
			ctx.drawImage(cvs_Arr[85], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_4_person1 = function(){
	this.x = 30;
	this.y = 330;
	this.w = 95;
	this.h = 197;
	this.cy = 0;this.cw = 95;this.ch = 197;
	this.mouseOver = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.ani++;
				if(this.ani >= 44){
					this.ani = 0;
				}
				this.cx = (Math.floor(this.ani / 3) + 1) * 95;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[93], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_4_person2 = function(){
	this.x = 470;
	this.y = 330;
	this.w = 88;
	this.h = 192;
	this.cy = 0;this.cw = 88;this.ch = 192;
	this.mouseOver = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.ani++;
				if(this.ani >= 59){
					this.ani = 0;
				}
				this.cx = (Math.floor(this.ani / 4) + 1) * 88;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[94], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_4_person3 = function(){
	this.x = 660;
	this.y = 350;
	this.w = 123;
	this.h = 172;
	this.cw = 123;this.ch = 172;
	this.mouseOver = false;
	this.filled = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.filled){
				this.cy = 172;
			}
			else{
				this.cy = 0;
			}
			if(this.mouseOver){
				this.ani++;
				if(this.ani >= 44){
					this.ani = 0;
				}
				this.cx = (Math.floor(this.ani / 3) + 1) * 123;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[95], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_4_board_fill = function(){
	this.x = 340;
	this.y = 370;
	this.w = 53;
	this.h = 100;
	this.cy = 0;this.cw = 53;this.ch = 100;
	this.mouseOver = false;
	this.filled = false;
	this.draw = function(){
		try{ 
			if(this.filled){
				this.cx = 106;
			}
			else{
				if(this.mouseOver){
					this.cx = 53;
				}
				else{
					this.cx = 0;
				}
			}
			ctx.drawImage(cvs_Arr[96], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_4_board1 = function(){
	this.x = this.oriX = 125;
	this.y = this.oriY = 475;
	this.w = 126;
	this.h = 29;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 0;this.cy = 0;this.cw = 47;this.ch = 95;
					ctx.drawImage(cvs_Arr[98], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
				else{
					if(this.mouseOver){
						this.cx = 126;
					}
					else{
						this.cx = 0;
					}
					this.cy = 0;this.cw = 126;this.ch = 29;
					ctx.drawImage(cvs_Arr[97], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		if(this.mouseDown){
			this.w = 47;
			this.h = 95;
		}
		else{
			this.w = 126;
			this.h = 29;
		}
	};
};
const As_4_board2 = function(){
	this.x = this.oriX = 125;
	this.y = this.oriY = 350;
	this.w = 132;
	this.h = 29;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 0;this.cy = 0;this.cw = 47;this.ch = 96;
					ctx.drawImage(cvs_Arr[100], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
				else{
					if(this.mouseOver){
						this.cx = 132;
					}
					else{
						this.cx = 0;
					}
					this.cy = 0;this.cw = 132;this.ch = 29;
					ctx.drawImage(cvs_Arr[99], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		if(this.mouseDown){
			this.w = 47;
			this.h = 96;
		}
		else{
			this.w = 132;
			this.h = 29;
		}
	};
};
const As_4_board3 = function(){
	this.x = this.oriX = 560;
	this.y = this.oriY = 460;
	this.w = 137;
	this.h = 31;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 0;this.cy = 0;this.cw = 53;this.ch = 99;
					ctx.drawImage(cvs_Arr[102], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
				else{
					if(this.mouseOver){
						this.cx = 137;
					}
					else{
						this.cx = 0;
					}
					this.cy = 0;this.cw = 137;this.ch = 31;
					ctx.drawImage(cvs_Arr[101], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		if(this.mouseDown){
			this.w = 53;
			this.h = 99;
		}
		else{
			this.w = 137;
			this.h = 31;
		}
	};
};
const As_4_baloon = function(){
	this.x = this.oriX = 500;
	this.y = this.oriY = 100;
	this.w = 110;
	this.h = 168;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 220;this.cy = 0;this.cw = 110;this.ch = 168;
				}
				else{
					if(this.mouseOver){
						this.cx = 110;
					}
					else{
						this.cx = 0;
					}
					this.cy = 0;this.cw = 110;this.ch = 168;
				}
				ctx.drawImage(cvs_Arr[103], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		this.w = 110;
		this.h = 168;
	};
};
const As_5_person1 = function(){
	this.x = 300;
	this.y = 140;
	this.w = 58;
	this.h = 114;
	this.cy = 0;this.cw = 58;this.ch = 114;
	this.mouseOver = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.ani++;
				if(this.ani >= 44){
					this.ani = 0;
				}
				this.cx = (Math.floor(this.ani / 3) + 1) * 58;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[113], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_5_person2 = function(){
	this.x = 450;
	this.y = 145;
	this.w = 53;
	this.h = 112;
	this.cw = 53;this.ch = 112;
	this.mouseOver = false;
	this.filled = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.filled){
				this.cy = 112;
			}
			else{
				this.cy = 0;
			}
			if(this.mouseOver){
				this.ani++;
				if(this.ani >= 59){
					this.ani = 0;
				}
				this.cx = (Math.floor(this.ani / 4) + 1) * 53;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[114], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_5_person3 = function(){
	this.x = 60;
	this.y = 250;
	this.w = 94;
	this.h = 260;
	this.cy = 0;this.cw = 94;this.ch = 260;
	this.mouseOver = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.ani++;
				if(this.ani >= 44){
					this.ani = 0;
				}
				this.cx = (Math.floor(this.ani / 3) + 1) * 94;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[115], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_5_person4 = function(){
	this.x = 100;
	this.y = 230;
	this.w = 116;
	this.h = 283;
	this.cw = 116;this.ch = 283;
	this.mouseOver = false;
	this.filled = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.filled){
				this.cy = 283;
			}
			else{
				this.cy = 0;
			}
			if(this.mouseOver){
				this.ani++;
				if(this.ani >= 44){
					this.ani = 0;
				}
				this.cx = (Math.floor(this.ani / 3) + 1) * 116;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[116], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_5_trash = function(){
	this.x = 550;
	this.y = 185;
	this.w = 42;
	this.h = 60;
	this.cy = 0;this.cw = 42;this.ch = 60;
	this.mouseOver = false;
	this.filled = false;
	this.draw = function(){
		try{ 
			if(this.filled){
				this.cx = 84;
			}
			else{
				if(this.mouseOver){
					this.cx = 42;
				}
				else{
					this.cx = 0;
				}
			}
			ctx.drawImage(cvs_Arr[117], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_5_info = function(){
	this.x = 560;
	this.y = 230;
	this.w = 245;
	this.h = 285;
	this.cy = 0;this.cw = 245;this.ch = 285;
	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 245;
			}
			else{
				this.cx = 0;
			}
			ctx.drawImage(cvs_Arr[118], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_5_jewel = function(){
	this.x = this.oriX = 530;
	this.y = this.oriY = 370;
	this.w = 86;
	this.h = 82;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 0;this.cy = 0;this.cw = 73;this.ch = 66;
					ctx.drawImage(cvs_Arr[120], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
				else{
					if(this.mouseOver){
						this.cx = 86;
					}
					else{
						this.cx = 0;
					}
					this.cy = 0;this.cw = 86;this.ch = 82;
					ctx.drawImage(cvs_Arr[119], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		if(this.mouseDown){
			this.w = 73;
			this.h = 66;
		}
		else{
			this.w = 86;
			this.h = 82;
		}
	};
};
const As_5_news = function(){
	this.x = this.oriX = 240;
	this.y = this.oriY = 350;
	this.w = 156;
	this.h = 61;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 0;this.cy = 0;this.cw = 61;this.ch = 97;
					ctx.drawImage(cvs_Arr[122], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
				else{
					if(this.mouseOver){
						this.cx = 156;
					}
					else{
						this.cx = 0;
					}
					this.cy = 0;this.cw = 156;this.ch = 61;
					ctx.drawImage(cvs_Arr[121], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		if(this.mouseDown){
			this.w = 61;
			this.h = 97;
		}
		else{
			this.w = 156;
			this.h = 61;
		}
	};
};
const As_5_can = function(){
	this.x = this.oriX = 375;
	this.y = this.oriY = 400;
	this.w = 93;
	this.h = 49;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 0;this.cy = 0;this.cw = 43;this.ch = 57;
					ctx.drawImage(cvs_Arr[124], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
				else{
					if(this.mouseOver){
						this.cx = 93;
					}
					else{
						this.cx = 0;
					}
					this.cy = 0;this.cw = 93;this.ch = 49;
					ctx.drawImage(cvs_Arr[123], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		if(this.mouseDown){
			this.w = 43;
			this.h = 57;
		}
		else{
			this.w = 93;
			this.h = 49;
		}
	};
};
const As_5_grass = function(){
	this.x = 450;
	this.y = 310;
	this.w = 349;
	this.h = 225;
	this.cx = 0;this.cy = 0;this.cw = 349;this.ch = 225;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[125], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_6_person1 = function(){
	this.x = 225;
	this.y = 160;
	this.w = 109;
	this.h = 118;
	this.cy = 0;this.cw = 109;this.ch = 118;
	this.mouseOver = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.ani++;
				if(this.ani >= 44){
					this.ani = 0;
				}
				this.cx = (Math.floor(this.ani / 3) + 1) * 109;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[138], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_6_person2 = function(){
	this.x = 400;
	this.y = 155;
	this.w = 95;
	this.h = 120;
	this.cy = 0;this.cw = 95;this.ch = 120;
	this.mouseOver = false;
	this.filled = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.filled){
				this.cy = 120;
			}
			else{
				this.cy = 0;
			}
			if(this.mouseOver){
				this.ani++;
				if(this.filled){
					if(this.ani >= 59){
						this.ani = 0;
					}
				}
				else{
					if(this.ani >= 44){
						this.ani = 0;
					}
				}
				this.cx = (Math.floor(this.ani / 3) + 1) * 95;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[139], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_6_person3 = function(){
	this.x = 660;
	this.y = 150;
	this.w = 92;
	this.h = 133;
	this.cw = 92;this.ch = 133;
	this.mouseOver = false;
	this.filled = false;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.filled){
				this.cy = 133;
			}
			else{
				this.cy = 0;
			}
			if(this.mouseOver){
				this.ani++;
				if(this.ani >= 44){
					this.ani = 0;
				}
				this.cx = (Math.floor(this.ani / 3) + 1) * 92;
			}
			else{
				this.cx = 0;
				this.ani = 0;
			}
			ctx.drawImage(cvs_Arr[140], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_6_chair1 = function(){
	this.x = 165;
	this.y = 215;
	this.w = 66;
	this.h = 64;
	this.cy = 0;this.cw = 66;this.ch = 64;
	this.mouseOver = false;
	this.filled = false;
	this.draw = function(){
		try{ 
			if(this.filled){
				if(this.mouseOver){
					this.ani++;
					if(this.ani >= 44){
						this.ani = 0;
					}
					this.cx = (Math.floor(this.ani / 3) + 1) * 88;
				}
				else{
					this.cx = 0;
					this.ani = 0;
				}
				this.cy = 0;this.cw = 88;this.ch = 123;
				this.x = 150;
				this.y = 155;
				this.w = 88;
				this.h = 123;
				ctx.drawImage(cvs_Arr[152], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);				
			}
			else{
				if(this.mouseOver){
					this.cx = 66;
				}
				else{
					this.cx = 0;
				}
				this.cy = 0;this.cw = 66;this.ch = 64;
				this.w = 66;
				this.h = 64;
				ctx.drawImage(cvs_Arr[141], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
		}
		catch(e){}
	};
};
const As_6_chair2 = function(){
	this.x = 100;
	this.y = 400;
	this.w = 166;
	this.h = 271;
	this.cy = 0;this.cw = 166;this.ch = 271;
	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 166;
			}
			else{
				this.cx = 0;
			}
			ctx.drawImage(cvs_Arr[142], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_6_chair3 = function(){
	this.x = 600;
	this.y = 400;
	this.w = 166;
	this.h = 271;
	this.cy = 0;this.cw = 166;this.ch = 271;
	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 166;
			}
			else{
				this.cx = 0;
			}
			ctx.drawImage(cvs_Arr[143], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const As_6_person4 = function(){
	this.x = this.oriX = 250;
	this.y = this.oriY = 330;
	this.w = 125;
	this.h = 294;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 0;this.cy = 0;this.cw = 72;this.ch = 172;
					ctx.drawImage(cvs_Arr[145], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
				else{
					if(this.mouseOver){
						this.ani++;
						if(this.ani >= 44){
							this.ani = 0;
						}
						this.cx = (Math.floor(this.ani / 3) + 1) * 125;
					}
					else{
						this.cx = 0;
					}
					this.cy = 0;this.cw = 125;this.ch = 294;
					ctx.drawImage(cvs_Arr[144], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		if(this.mouseDown){
			this.w = 72;
			this.h = 172;
		}
		else{
			this.w = 125;
			this.h = 294;
		}
	};
};
const As_6_book1 = function(){
	this.x = this.oriX = 50;
	this.y = this.oriY = 340;
	this.w = 134;
	this.h = 66;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 0;this.cy = 0;this.cw = 58;this.ch = 70;
					ctx.drawImage(cvs_Arr[147], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
				else{
					if(this.mouseOver){
						this.cx = 134;
					}
					else{
						this.cx = 0;
					}
					this.cy = 0;this.cw = 134;this.ch = 66;
					ctx.drawImage(cvs_Arr[146], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		if(this.mouseDown){
			this.w = 58;
			this.h = 70;
		}
		else{
			this.w = 134;
			this.h = 66;
		}
	};
};
const As_6_book2 = function(){
	this.x = this.oriX = 510;
	this.y = this.oriY = 375;
	this.w = 73;
	this.h = 41;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 0;this.cy = 0;this.cw = 46;this.ch = 56;
					ctx.drawImage(cvs_Arr[149], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
				else{
					if(this.mouseOver){
						this.cx = 73;
					}
					else{
						this.cx = 0;
					}
					this.cy = 0;this.cw = 73;this.ch = 41;
					ctx.drawImage(cvs_Arr[148], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		if(this.mouseDown){
			this.w = 46;
			this.h = 56;
		}
		else{
			this.w = 73;
			this.h = 41;
		}
	};
};
const As_6_cloth = function(){
	this.x = this.oriX = 660;
	this.y = this.oriY = 350;
	this.w = 102;
	this.h = 63;
	this.mouseOver = false;
	this.mouseDown = false;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseDown){
					this.cx = 0;this.cy = 0;this.cw = 93;this.ch = 115;
					ctx.drawImage(cvs_Arr[151], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
				else{
					if(this.mouseOver){
						this.cx = 102;
					}
					else{
						this.cx = 0;
					}
					this.cy = 0;this.cw = 102;this.ch = 63;
					ctx.drawImage(cvs_Arr[150], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				}
			}
		}
		catch(e){}
	};
	this.sizeSet = function(){
		if(this.mouseDown){
			this.w = 93;
			this.h = 115;
		}
		else{
			this.w = 102;
			this.h = 63;
		}
	};
};
const As_6_bar = function(){
	this.x = 0;
	this.y = 455;
	this.w = 800;
	this.h = 79;
	this.cx = 0;this.cy = 0;this.cw = 800;this.ch = 79;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[153], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
let intro_start_btn = new Object(),
	intro_method_btn = new Object(),
	intro_sound_btn = new Object(),
	intro_layer = new Object();
let method_bg = new Object(),
	method_content = new Object(),
	method_exit_btn = new Object(),
	method_prev_btn = new Object(),
	method_next_btn = new Object(),
	method_dot = new Object();
let select_bg = new Object(),
	select_exit_btn = new Object(),
	select_start_btn = new Object(),
	select_male_btn = new Object(),
	select_female_btn = new Object();
let conv_user_bg = new Object(),
	conv_pc_bg = new Object(),
	conv_user_text = new Object(),
	conv_pc_text = new Object(),
	conv_user_char = new Object(),
	conv_pc_char = new Object(),
	conv_skip_btn = new Object(),
	conv_next_btn = new Object(),
	conv_start_btn = new Object(),
	conv_press = new Object();
let main_exit_btn = new Object(),
	main_shadow = new Object(),
	main_exit_bg = new Object(),
	main_exit_yes_btn = new Object(),
	main_exit_no_btn = new Object(),
	main_try_bg = new Object(),
	main_try_yes_btn = new Object(),
	main_try_no_btn = new Object(),
	main_btm_attempt = new Object(),
	main_result_alert = new Object(),
	main_over_home_btn = new Object(),
	main_clear_home_btn = new Object(),
	main_top_gage = new Object(),
	main_eff = new Object();
/* 인게임 객체 */
let as_1_person1 = new Object(),
	as_1_person2 = new Object(),
	as_1_person3 = new Object(),
	as_1_mp_fill = new Object(),
	as_1_mp1 = new Object(),
	as_1_mp2 = new Object(),
	as_1_card = new Object();
let as_2_person1 = new Object(),
	as_2_person2 = new Object(),
	as_2_person3 = new Object(),
	as_2_rock = new Object(),
	as_2_jh = new Object(),
	as_2_jh_fill = new Object(),
	as_2_book = new Object();
let as_3_person1 = new Object(),
	as_3_person2 = new Object(),
	as_3_rock1 = new Object(),
	as_3_rock2 = new Object(),
	as_3_rock3 = new Object(),
	as_3_rock_fill = new Object(),
	as_3_info = new Object();
let as_4_person1 = new Object(),
	as_4_person2 = new Object(),
	as_4_person3 = new Object(),
	as_4_board_fill = new Object(),
	as_4_board1 = new Object(),
	as_4_board2 = new Object(),
	as_4_board3 = new Object(),
	as_4_baloon = new Object();
let as_5_person1 = new Object(),
	as_5_person2 = new Object(),
	as_5_person3 = new Object(),
	as_5_person4 = new Object(),
	as_5_trash = new Object(),
	as_5_info = new Object(),
	as_5_jewel = new Object(),
	as_5_news = new Object(),
	as_5_can = new Object();
let as_6_person1 = new Object(),
	as_6_person2 = new Object(),
	as_6_person3 = new Object(),
	as_6_chair1 = new Object(),
	as_6_chair2 = new Object(),
	as_6_chair3 = new Object(),
	as_6_person4 = new Object(),
	as_6_book1 = new Object(),
	as_6_book2 = new Object(),
	as_6_cloth = new Object();
/* 연동 변수 */
let loggedIn = true;
let userId = "id";
let _isPorted = false;
if(_isPorted){
	userId = parent.userId;
}
/* 유틸 변수 */
let	loadLoop = new Object(), 
	introLoop = new Object(), 
	mainLoop = new Object();
let mouseX = 0,																					// 마우스 X좌표
	mouseY = 0;																					// 마우스 Y좌표
let volume = 1,																					// 사운드 On:1 Off:0
	popup = false,																				// 팝업 체크용
	pageType = "",																				// 페이지 종류
	userInit = (browser == "Chrome") ? false : true;											// 음악재생용 유저클릭 여부
/* 인게임 변수 */
let clickedItem;																				// 클릭한 객체 저장용
let targetItem;																					// 붙히는 객체 저장용
let stage = 0;																					// 단계
let gender = 1;																					// 성별 남:1 여:2
let life = 3;																					// 하트갯수
let MAX_STAGE = 6;																				// 총 스테이지 갯수
let stageLoad = false;
let itemClicked = false;																		// 아이템 클릭 여부
let itemCorrect = false;																		// 아이템 정답 여부
let gameClear = false;																			// 게임클리어여부
let gameOver = false;																			// 게임종료여부
let convIdx = 0;																				// 인트로단계대화 순서
let convEnd = false;																			// 인트로단계대화 각 순서 종료여부
let typeInterval = new Object();																// 인트로단계대화 인터벌
let typingIdx = 0;																				// 인트로단계대화 글자인덱스
let typingColIdx = 0;																			// 인트로단계대화 줄인덱스
let conv_user_result_Arr = new Array(),															// 인트로단계대화 유저멘트 배열
	conv_pc_result_Arr = new Array(),															// 인트로단계대화 PC멘트 배열
	typeSplitText = new Array(),																// 인트로단계대화 문장삽입용 배열
	main_heart_Arr = new Array(),																// 하단 하트
	baloon_arr = new Array();
let baloon_info_arr = [
	/* [x, y, w, h, cvs_arr[idx], 아이템풍선여부] */
	[
		[170, 330, 53, true],
		[510, 320, 54, true],
		[200, 120, 55, false],
		[170, 130, 56, false],
		[20, 80, 57, false],
		[280, 100, 58, false],
		[440, 120, 59, false],
		[460, 120, 60, false],
		[160, 330, 61, true],
	],
	[
		[160, 60, 70, false],
		[300, 105, 71, false],
		[470, 100, 72, false],
		[460, 120, 73, false],
		[150, 180, 74, true],
		[510, 315, 75, true],
		[245, 70, 76, false],
		[270, 120, 77, false],
		[105, 300, 78, true],
	],
	[
		[120, 120, 86, false],
		[50, 130, 87, false],
		[120, 200, 88, true],
		[400, 80, 89, false],
		[390, 220, 90, true],
		[380, 140, 91, true],
		[440, 120, 92, false],	
	],
	[
		[100, 250, 104, false],
		[300, 250, 105, false],
		[540, 280, 106, false],
		[500, 280, 107, false],
		[120, 320, 108, true],
		[120, 200, 109, true],
		[570, 320, 110, true],
		[210, 225, 111, false],
		[205, 225, 112, false],	
	],
	[
		[130, 60, 126, false],
		[500, 60, 127, false],
		[500, 60, 128, false],
		[50, 130, 129, false],
		[190, 150, 130, false],
		[190, 150, 131, false],
		[330, 270, 132, true],
		[200, 200, 133, true],
		[600, 80, 134, false],	
		[600, 80, 135, false],	
		[400, 80, 136, false],	
		[350, 280, 137, true],	
	],
	[
		[0, 60, 154, false],
		[350, 220, 155, true],
		[300, 45, 156, false],
		[300, 35, 157, false],
		[470, 60, 158, false],
		[430, 60, 159, false],
		[80, 110, 160, false],
		[120, 80, 161, false],
		[400, 210, 162, true],
		[80, 270, 163, true],
		[150, 180, 164, true],
		[320, 220, 165, true],	
	]
];
let conv_Arr = [
	["저는 헌법재판소의 명탐정... 이 되고","싶은데, 어떻게 하면 될까요?"],
	["안녕? 나는 헌법을 수호하는 요정이야,","너의 목표는... 헌법재판소 주변에 모든","것들을 정상으로 되돌리는 것이야~"],
	["정상으로요...?"],
	["그래, 게임을 하다보면 물건이 바닥에","있다던가, 누가 뭘 필요로 하는데 없다","던지, 이런 어색한 상황이 보일거야."],
	["누가 뭐를 필요로 하는지... 그런걸","어떻게 알 수 있어요?"],
	["여기저기 마우스 커서를 대면, 화면 위","에 힌트가 나타날꺼야. 그걸 읽고 문제","를 해결해야 하는 거지."],
	["아 그렇군요, 그럼 이제 문제들을 해결","하러 가야겠어요!"],
	["잠깐, 알아두어야 할 몇가지! 목표 중에","는 움직일 수 있는 것과 못 움직이는 것","두 가지가 있다는 점, 그리고..."],
	["그리고...?"],
	["문제해결을 대충 하면 하트가 줄어들어","서 게임이 중간에 끝난다는 점! 또한 줄","어드는 시간을 주의할 것!"],
	["넵 명심하겠습니다! 그럼 이제부터","나도 명탐정이 되어볼까나!!"]
];
/* 페이지 함수 */
function load(){
	pageType = "load";
	let loading = new Loading();
	function draw(){	
		loading.draw();
	}
	loadLoop = function(){
		ctx.clearRect(0, 0, cvs.width, cvs.height);	
		draw();
		requestAnimFrame(loadLoop);
	};
	loadLoop();
}
function intro(){
	pageType = "intro";	
	let intro_bg = new Intro_bg(),
		intro_boy = new Intro_boy(),
		intro_logo = new Intro_logo();
	(function(){	
		intro_start_btn = new Intro_start_btn();
		intro_method_btn = new Intro_method_btn();
		intro_sound_btn = new Intro_sound_btn();
		intro_layer = new Intro_layer();
		method_bg = new Method_bg();
		method_content = new Method_content();
		method_exit_btn = new Method_exit_btn();
		method_prev_btn = new Method_prev_btn();
		method_next_btn = new Method_next_btn();
		method_dot = new Method_dot();
		select_bg = new Select_bg();
		select_exit_btn = new Select_exit_btn();
		select_start_btn = new Select_start_btn();
		select_male_btn = new Select_male_btn();
		select_female_btn = new Select_female_btn();
		conv_user_bg = new Conv_user_bg();
		conv_pc_bg = new Conv_pc_bg();
		conv_user_text = new Conv_user_text();
		conv_pc_text = new Conv_pc_text();
		conv_user_char = new Conv_user_char();
		conv_pc_char = new Conv_pc_char();
		conv_skip_btn = new Conv_skip_btn();
		conv_next_btn = new Conv_next_btn();
		conv_start_btn = new Conv_start_btn();
		conv_press = new Conv_press();

		convIdx = 0;
		setTimeout(function(){
			introBtnCtrl(true);
		},100);
	})();	
	function bgFunc(){
		if(intro_boy.y > 25 || intro_boy.y < 20){
			intro_boy.vy *= -1;
		}
		intro_boy.y += intro_boy.vy;

		if(intro_logo.y > 125 || intro_logo.y < 120){
			intro_logo.vy *= -1;
		}
		intro_logo.y += intro_logo.vy;		
	}
	function methodPopupFunc(){
		method_dot.x = (373 + method_content.pageIdx * 15);
		if(method_content.pageIdx < 1){
			method_prev_btn.active = false;
			method_next_btn.active = true;
		}
		else if(method_content.pageIdx > 2){
			method_prev_btn.active = true;
			method_next_btn.active = false;
		}
		else{
			method_prev_btn.active = true;
			method_next_btn.active = true;
		}
		if(method_content.slideRight){
			if(method_content.cx < method_content.pageIdx * method_content.cw){
				method_content.cx += 20;
			}
			else{
				method_content.slideRight = false;
			}
		}
		else if(method_content.slideLeft){
			if(method_content.cx > method_content.pageIdx * method_content.cw){
				method_content.cx -= 20;
			}
			else{
				method_content.slideLeft = false;
			}
		}
	}
	function draw(){	
		intro_bg.draw();intro_boy.draw();intro_logo.draw();
		intro_start_btn.draw();intro_method_btn.draw();intro_sound_btn.draw();
		intro_layer.draw();
		if(method_bg.appear || method_bg.load){
			method_bg.draw();method_content.draw();
			method_exit_btn.draw();method_prev_btn.draw();method_next_btn.draw();
			method_dot.draw();
		}
		if(select_bg.appear || select_bg.load){
			select_bg.draw();
			select_exit_btn.draw();select_start_btn.draw();
			select_male_btn.draw();select_female_btn.draw();
		}
		conv_skip_btn.draw();
		conv_press.draw();
		conv_user_bg.draw();
		conv_pc_bg.draw();
		if((conv_user_bg.appear && conv_user_bg.load) || (conv_pc_bg.appear && conv_pc_bg.load)){
			conv_start_btn.draw();
			conv_next_btn.draw();
		}
		conv_user_char.draw();
		conv_pc_char.draw();
		if(conv_user_bg.appear || conv_user_bg.load){													
			conv_user_text.draw();
		}
		if(conv_pc_bg.appear || conv_pc_bg.load){													
			conv_pc_text.draw();
		}
	}
	introLoop = function(){
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		bgFunc();
		methodPopupFunc();
		draw();
		requestAnimFrame(introLoop);															// 게임 애니 시작
	}; 
	introLoop();
}
function main(){
	pageType = "main";	
	let gameOverSound = false;
	let main_bg = new Main_bg();
		main_stage_alert = new Main_stage_alert(),
		main_top_bg = new Main_top_bg(),
		main_btm_bg = new Main_btm_bg(),
		main_top_stage = new Main_top_stage(),
		main_over_bg = new Main_over_bg(),
		main_clear_bg = new Main_clear_bg(),
		main_clear_content = new Main_clear_content();
	let	as_5_grass = new As_5_grass();
	let	as_6_bar = new As_6_bar();
	(function(){
		main_exit_btn = new Main_exit_btn();			main_shadow = new Main_shadow();
		main_exit_bg = new Main_exit_bg();				main_exit_yes_btn = new Main_exit_yes_btn();
		main_exit_no_btn = new Main_exit_no_btn();		main_try_bg = new Main_try_bg();
		main_try_yes_btn = new Main_try_yes_btn();		main_try_no_btn = new Main_try_no_btn();
		main_btm_attempt = new Main_btm_attempt();		main_result_alert = new Main_result_alert();
		main_over_home_btn = new Main_over_home_btn();	main_clear_home_btn = new Main_clear_home_btn();
		main_top_gage = new Main_top_gage();			main_eff = new Main_eff();
		/* 인게임 객체 */
		as_1_person1 = new As_1_person1();				as_1_person2 = new As_1_person2();
		as_1_person3 = new As_1_person3();				as_1_mp_fill = new As_1_mp_fill();
		as_1_mp1 = new As_1_mp1();						as_1_mp2 = new As_1_mp2();
		as_1_card = new As_1_card();
		as_2_person1 = new As_2_person1();				as_2_person2 = new As_2_person2();
		as_2_person3 = new As_2_person3();				as_2_rock = new As_2_rock();
		as_2_jh = new As_2_jh();						as_2_jh_fill = new As_2_jh_fill();
		as_2_book = new As_2_book();
		as_3_person1 = new As_3_person1();				as_3_person2 = new As_3_person2();
		as_3_rock1 = new As_3_rock1();					as_3_rock2 = new As_3_rock2();
		as_3_rock3 = new As_3_rock3();					as_3_rock_fill = new As_3_rock_fill();
		as_3_info = new As_3_info();
		as_4_person1 = new As_4_person1();				as_4_person2 = new As_4_person2();
		as_4_person3 = new As_4_person3();				as_4_board_fill = new As_4_board_fill();
		as_4_board1 = new As_4_board1();				as_4_board2 = new As_4_board2();
		as_4_board3 = new As_4_board3();				as_4_baloon = new As_4_baloon();
		as_5_person1 = new As_5_person1();				as_5_person2 = new As_5_person2();
		as_5_person3 = new As_5_person3();				as_5_person4 = new As_5_person4();
		as_5_trash = new As_5_trash();					as_5_info = new As_5_info();
		as_5_jewel = new As_5_jewel();					as_5_news = new As_5_news();
		as_5_can = new As_5_can();
		as_6_person1 = new As_6_person1();				as_6_person2 = new As_6_person2();
		as_6_person3 = new As_6_person3();				as_6_chair1 = new As_6_chair1();
		as_6_chair2 = new As_6_chair2();				as_6_chair3 = new As_6_chair3();
		as_6_person4 = new As_6_person4();				as_6_book1 = new As_6_book1();
		as_6_book2 = new As_6_book2();					as_6_cloth = new As_6_cloth();

		popup = false;
		/* 하단 하트 삽입 */
		for(let i=0;i<3;i++){
			main_heart_Arr.push(new Main_btm_heart());
			main_heart_Arr[i].x = (283 + 33 * i);
		}
		/* 말풍선 배열 */
		for(let i=0;i<MAX_STAGE;i++){
			baloon_arr.push(new Array());
			for(let j=0;j<baloon_info_arr[i].length;j++){
				baloon_arr[i].push(new As_baloon(baloon_info_arr[i][j][2], baloon_info_arr[i][j][0], baloon_info_arr[i][j][1]));
				baloon_arr[i][j].itemMatched = baloon_info_arr[i][j][3];
			}
		}
		/* 게임 시작 */
		stageSetting();
	})();	
	function stageSetting(){
		stage++;
		life = 3;
		stageLoad = false;
		/* 말풍선 모두 제거 */
		for(let j=0;j<MAX_STAGE;j++){
			for(let i=0;i<baloon_arr[j].length;i++){
				baloon_arr[j][i].active = false;
			}
		}
		/* 하단 문제해결횟수 설정 */
		main_btm_attempt.success = 0;
		main_top_gage = new Main_top_gage();
		if(stage == 1){
			main_top_gage.x_ratio = 0.4;
			main_btm_attempt.total = 2;
		}
		else if(stage == 2){
			main_top_gage.x_ratio = 0.4;
			main_btm_attempt.total = 2;
		}
		else if(stage == 3){
			main_top_gage.x_ratio = 0.5;
			main_btm_attempt.total = 1;
		}
		else if(stage == 4){
			main_top_gage.x_ratio = 0.4;
			main_btm_attempt.total = 2;
		}
		else if(stage == 5){
			main_top_gage.x_ratio = 0.2;
			main_btm_attempt.total = 3;
		}
		else if(stage == 6){
			main_top_gage.x_ratio = 0.2;
			main_btm_attempt.total = 3;
		}
		main_stage_alert.appear = true;
	}
	function processFunc(){
		if(main_stage_alert.load){
			uiCtrl(true);
			main_top_gage.pause = false;
			main_exit_btn.appear = true;
			main_stage_alert.load = false;
			stageLoad = true;
		}
		if(main_result_alert.load){
			popup = false;
			if(main_result_alert.correct){
				// 스테이지 클리어일 경우
				if(main_btm_attempt.success >= main_btm_attempt.total - 1){
					if(stage >= MAX_STAGE){
						gameClear = true;
					}
					else{
						uiCtrl(false);
						setTimeout(function(){							
							audioPlay(5);
							stageSetting();
						},500);
					}
				}
				else{
					main_top_gage.pause = false;
					main_exit_btn.appear = true;
					main_btm_attempt.success++;
				}
			}
			else{
				main_top_gage.pause = false;
				main_exit_btn.appear = true;
				life--;
			}
			main_result_alert.load = false;
		}
		if(main_top_gage.over){
			gameOver = true;
		}
	}
	function lifeFunc(){
		for(let i=0;i<main_heart_Arr.length;i++){
			if(i < life){
				main_heart_Arr[i].on = true;
			}
			else{
				main_heart_Arr[i].on = false;
			}
		}
		if(life <= 0){
			gameOver = true;
		}
	}
	function uiCtrl(bool){
		main_top_bg.appear = bool;
		main_btm_bg.appear = bool;
		main_top_stage.appear = bool;
		main_top_gage.appear = bool;
		main_btm_attempt.appear = bool;
		for(let i=0;i<main_heart_Arr.length;i++){
			main_heart_Arr[i].appear = bool;
		}
	}
	function draw(){
		main_bg.draw();
		if(gameClear){
			main_shadow.draw();
			main_clear_bg.draw();
			main_clear_home_btn.draw();
			main_clear_content.draw();
		}
		else if(gameOver){
			if(!gameOverSound){						
				audioPlay(6);				
				gameOverSound = true;
			}
			main_shadow.draw();
			main_over_bg.draw();
			main_over_home_btn.draw();
		}
		else{
			main_exit_btn.draw();
			/* 레벨 별 오브젝트 */
			if(stageLoad){
				if(stage == 1){
					as_1_person1.draw();as_1_person2.draw();as_1_person3.draw();as_1_mp_fill.draw();
					as_1_mp1.draw();as_1_mp2.draw();as_1_card.draw();
				}
				else if(stage == 2){
					as_2_person1.draw();as_2_person2.draw();as_2_person3.draw();as_2_jh_fill.draw();
					as_2_rock.draw();as_2_jh.draw();as_2_book.draw();
				}	
				else if(stage == 3){
					as_3_person1.draw();as_3_person2.draw();as_3_info.draw();as_3_rock_fill.draw();
					as_3_rock1.draw();as_3_rock2.draw();as_3_rock3.draw();
				}
				else if(stage == 4){
					as_4_person1.draw();as_4_person2.draw();as_4_person3.draw();as_4_board_fill.draw();
					as_4_board1.draw();as_4_board2.draw();as_4_board3.draw();as_4_baloon.draw();
				}
				else if(stage == 5){
					as_5_person1.draw();as_5_person2.draw();as_5_person3.draw();as_5_person4.draw();as_5_trash.draw();as_5_info.draw();
					as_5_jewel.draw();as_5_news.draw();as_5_can.draw();
					as_5_grass.draw();
				}
				else if(stage == 6){
					as_6_person1.draw();as_6_person2.draw();as_6_person3.draw();as_6_chair1.draw();as_6_chair2.draw();as_6_chair3.draw();
					as_6_person4.draw();as_6_book1.draw();as_6_book2.draw();as_6_cloth.draw();
					as_6_bar.draw();
				}
				for(let i=0;i<baloon_arr.length;i++){
					for(let j=0;j<baloon_arr[i].length;j++){
						if(baloon_arr[i][j].itemMatched){
							if(!itemClicked){
								baloon_arr[i][j].draw();
							}
						}
						else{
							baloon_arr[i][j].draw();
						}
					}
				}
			}
			main_eff.draw();
			/* 시도할때팝업은 암막 여기에 생김 */
			if(main_try_bg.appear || main_try_bg.load){
				main_shadow.draw();
			}
			/* 상단 바 */
			main_top_gage.draw();
			main_top_bg.draw();	
			main_top_stage.draw();
			/* 하단 바 */
			main_btm_bg.draw();
			main_btm_attempt.draw();
			for(let i=0;i<main_heart_Arr.length;i++){
				main_heart_Arr[i].draw();
			}		
			/* 단계 알림 */
			if(main_stage_alert.appear || main_stage_alert.active){
				main_stage_alert.draw();
			}
			/* 결과 알림 */
			if(main_result_alert.appear || main_result_alert.active){
				main_result_alert.draw();
			}
			/* 이후 팝업 */
			if(main_exit_bg.appear || main_exit_bg.load){
				main_shadow.draw();
				main_exit_bg.draw();
				main_exit_yes_btn.draw();
				main_exit_no_btn.draw();
			}
			if(main_try_bg.appear || main_try_bg.load){
				main_try_bg.draw();
				main_try_yes_btn.draw();
				main_try_no_btn.draw();
			}	
		}
	}
	mainLoop = function(){
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		processFunc();
		lifeFunc();
		draw();
		requestAnimFrame(mainLoop);																// 게임 애니 시작
	};
	mainLoop();
}
/* 게임내부함수 */ 
function introBtnCtrl(bool){
	intro_start_btn.appear = bool;
	intro_method_btn.appear = bool;
	intro_sound_btn.appear = bool;
}
function methodPopupCtrl(bool){
	if(bool){
		method_content.pageIdx = 0;
		method_content.cutSet(0);																// 팝업 킬때 첫번째부터 시작
	}
	popup = bool;
	intro_layer.appear = bool;
	method_bg.appear = bool;
	method_content.appear = bool;
	method_exit_btn.appear = bool;
	method_prev_btn.appear = bool;
	method_next_btn.appear = bool;
	method_dot.appear = bool;
}
function selectPopupCtrl(bool){
	if(bool){
		select_male_btn.on = true;select_female_btn.on = false;									// 팝업 킬때 남자 활성화
	}
	popup = bool;
	intro_layer.appear = bool;
	select_bg.appear = bool;
	select_exit_btn.appear = bool;
	select_start_btn.appear = bool;
	select_male_btn.appear = bool;
	select_female_btn.appear = bool;
}
function convPopupCtrl(bool){
	popup = bool;
	intro_layer.appear = bool;
	conv_user_bg.appear = bool;
	conv_skip_btn.appear = bool;
	conv_user_char.appear = bool;
	conv_user_text.appear = bool;
	conv_press.appear = bool;

	convFunc();
}
function convPopupProcessCtrl(bool){
	conv_user_bg.appear = bool;
	conv_user_char.appear = bool;
	conv_user_text.appear = bool;
	conv_pc_bg.appear = !bool;
	conv_pc_char.appear = !bool;
	conv_pc_text.appear = !bool;

	convFunc();
}
function convFunc(){
	convIdx++;
	convEnd = false;
	if(convIdx % 2 == 1){
		conv_user_result_Arr = new Array();
		for(let i=0;i<conv_Arr[convIdx-1].length;i++){
			conv_user_result_Arr.push(new Array(""));
		}
	}
	else{
		conv_pc_result_Arr = new Array();
		for(let i=0;i<conv_Arr[convIdx-1].length;i++){
			conv_pc_result_Arr.push(new Array(""));
		}
	}
	typingColIdx = 0;
	typingIdx = 0;
	clearInterval(typeInterval);
	typeInterval = setInterval(convTypeFunc,50);
	/* 다음버튼 */
	if(convIdx % 2 == 1){
		conv_next_btn.x = 590;
	}
	else{
		conv_next_btn.x = 160;
	}
} 
function convTypeFunc(){
	if(typingColIdx < conv_Arr[convIdx-1].length){
		typeSplitText = conv_Arr[convIdx-1][typingColIdx].split("");
		if(typingIdx < typeSplitText.length){
			if(convIdx % 2 == 1){
				conv_user_result_Arr[typingColIdx] += typeSplitText[typingIdx];
			}
			else{
				conv_pc_result_Arr[typingColIdx] += typeSplitText[typingIdx];
			}
			typingIdx++;
		}
		else{
			typingColIdx++;
			typingIdx = 0;
		}
	}
	else{
		convEnd = true;
		typingColIdx = 0;
		clearInterval(typeInterval);
	}
}
function convSkipFunc(){
	if(!convEnd){
		clearInterval(typeInterval);
		if(convIdx % 2 == 1){
			conv_user_result_Arr = new Array();
		}
		else{
			conv_pc_result_Arr = new Array();
		}
		for(let i=0;i<conv_Arr[convIdx-1].length;i++){
			let txt = conv_Arr[convIdx-1][i];		
			if(convIdx % 2 == 1){
				conv_user_result_Arr.push(txt);
			}
			else{
				conv_pc_result_Arr.push(txt);
			}
		}
		convEnd = true;
	}
	else{						
		if(convIdx >= conv_Arr.length){
			conv_next_btn.active = false;
			conv_next_btn.clickable = false;
			conv_start_btn.active = true;
			conv_start_btn.clickable = true;
			conv_skip_btn.appear = false;
		}
		else{
			if(conv_user_bg.load){
				convPopupProcessCtrl(false);
			}
			else if(conv_pc_bg.load){
				convPopupProcessCtrl(true);
			}
		}
	}
}
function exitIntro(){
	clearInterval(typeInterval);
	introLoop = function(){return;}
	main();
}
function exitPopupCtrl(bool){
	popup = bool;
	main_shadow.appear = bool;
	main_exit_bg.appear = bool;
	main_exit_yes_btn.appear = bool;
	main_exit_no_btn.appear = bool;
	main_top_gage.pause = bool;
}
function tryPopupCtrl(bool){
	if(clickedItem != null){
		popup = bool;
		main_shadow.appear = bool;
		main_try_bg.appear = bool;
		main_try_yes_btn.appear = bool;
		main_try_no_btn.appear = bool;
		if(bool){
			main_top_gage.pause = true;
			main_exit_btn.appear = !bool;
		}	
		else{
			itemClicked = false;
		}
	}
}
function resultAlertCtrl(){
	popup = true;
	
	main_result_alert.correct = itemCorrect;
	main_result_alert.appear = true;

	if(itemCorrect){
		audioPlay(3);
		targetItem.filled = true;
		clickedItem.active = false;
		main_eff.correct = true;
		clickedItem = null;
	}
	else{
		audioPlay(4);
		itemResetFunc();
		main_eff.correct = false;
	}
	main_eff.x = targetItem.x + targetItem.w * 0.5 - main_eff.w * 0.5;
	main_eff.y = targetItem.y + targetItem.h * 0.5 - main_eff.h * 0.5;
	main_eff.active = true;
}
function itemClickFunc(_item){	
	clickedItem = _item;
	if(clickedItem.active){
		clickedItem.mouseDown = true;
		clickedItem.sizeSet();
		clickedItem.x = mouseX / wR - clickedItem.w * 0.5;
		clickedItem.y = mouseY / hR - clickedItem.h * 0.5;
		itemClicked = true;
	}
}
function itemDragFunc(){
	clickedItem.x = mouseX / wR - clickedItem.w * 0.5;
	clickedItem.y = mouseY / hR - clickedItem.h * 0.5;
}
function itemCheckFunc(_target, _click){	
	targetItem = _target;
	targetItem.mouseOver = false;
	if(_click == null){
		itemCorrect = false;
	}
	else{
		if(clickedItem == _click){
			itemCorrect = true;
		}
		else{
			itemCorrect = false;
		}
	}
	/* 해당 스테이지의 말풍선 모두 제거 */
	for(let i=0;i<baloon_arr[stage-1].length;i++){
		baloon_arr[stage-1][i].active = false;
	}
}
function itemResetFunc(){
	if(clickedItem != null){
		clickedItem.mouseOver = false;
		clickedItem.mouseDown = false;
		clickedItem.sizeSet();
		clickedItem.x = clickedItem.oriX;
		clickedItem.y = clickedItem.oriY;
		itemClicked = false;
	}
}
/* 이벤트관련 */
document.addEventListener("touchmove",function(e){
	if(e.scale !== 1){
		e.preventDefault();
	}
},{passive:false});
document.addEventListener(mouseEv("move"),function(e){
	let event = (e.type == "mousemove" ? e : e.touches[0]);
	mouseX = event.pageX - $("canvas").offset().left;					
	mouseY = event.pageY - $("canvas").offset().top;
	$("canvas").css("cursor","auto");

	if(pageType == "intro"){
		if(!popup){
			if(mouseCd(intro_start_btn)){
				if(intro_start_btn.clickable){
					$("canvas").css("cursor","pointer");
					intro_start_btn.mouseOver = true;
					intro_method_btn.mouseOver = false;
				}
			}
			else if(mouseCd(intro_method_btn)){
				if(intro_method_btn.clickable){
					$("canvas").css("cursor","pointer");
					intro_start_btn.mouseOver = false;
					intro_method_btn.mouseOver = true;
				}
			}
			else if(mouseCd(intro_sound_btn)){
				if(intro_sound_btn.clickable){
					$("canvas").css("cursor","pointer");
					intro_sound_btn.mouseOver = true;
				}
			}
			else{
				intro_start_btn.mouseOver = false;
				intro_method_btn.mouseOver = false;
				intro_sound_btn.mouseOver = false;
			}
		}		
		else{
			if(method_bg.appear && method_bg.load){
				if(mouseCd(method_exit_btn)){
					$("canvas").css("cursor","pointer");
					method_exit_btn.mouseOver = true;
				}
				else if(mouseCd(method_prev_btn)){
					if(method_prev_btn.active){
						$("canvas").css("cursor","pointer");
						method_prev_btn.mouseOver = true;
				}
				}
				else if(mouseCd(method_next_btn)){
					if(method_next_btn.active){
						$("canvas").css("cursor","pointer");
						method_next_btn.mouseOver = true;
					}
				}
				else{
					method_exit_btn.mouseOver = false;
					method_prev_btn.mouseOver = false;
					method_next_btn.mouseOver = false;
				}
			}
			else if(select_bg.appear && select_bg.load){
				if(mouseCd(select_exit_btn)){
					$("canvas").css("cursor","pointer");
					select_exit_btn.mouseOver = true;
				}
				else if(mouseCd(select_start_btn)){
					$("canvas").css("cursor","pointer");
					select_start_btn.mouseOver = true;
				}
				else if(mouseCd(select_male_btn)){
					$("canvas").css("cursor","pointer");
					select_male_btn.mouseOver = true;
					select_female_btn.mouseOver = false;
				}
				else if(mouseCd(select_female_btn)){
					$("canvas").css("cursor","pointer");
					select_female_btn.mouseOver = true;
					select_male_btn.mouseOver = false;
				}				
				else{
					select_exit_btn.mouseOver = false;
					select_start_btn.mouseOver = false;
					select_male_btn.mouseOver = false;
					select_female_btn.mouseOver = false;
				}
			}
			else if((conv_user_bg.appear && conv_user_bg.load) || (conv_pc_bg.appear && conv_pc_bg.load)){
				if(mouseCd(conv_skip_btn)){
					if(conv_skip_btn.clickable){
						$("canvas").css("cursor","pointer");
						conv_skip_btn.mouseOver = true;
					}
				}
				else{
					conv_skip_btn.mouseOver = false;
				}
				if(conv_next_btn.clickable){
					if(mouseCd(conv_next_btn)){
						$("canvas").css("cursor","pointer");
						conv_next_btn.mouseOver = true;
					}
					else{
						conv_next_btn.mouseOver = false;
					}
				}
				else if(conv_start_btn.clickable){
					if(mouseCd(conv_start_btn)){
						$("canvas").css("cursor","pointer");
						conv_start_btn.mouseOver = true;
					}
					else{
						conv_start_btn.mouseOver = false;
					}
				}
			}
		}
	}
	else if(pageType == "main"){
		if(gameClear){
			if(mouseCd(main_clear_home_btn)){
				$("canvas").css("cursor","pointer");
				main_clear_home_btn.mouseOver = true;
			}
			else{
				main_clear_home_btn.mouseOver = false;
			}
		}
		else if(gameOver){
			if(mouseCd(main_over_home_btn)){
				$("canvas").css("cursor","pointer");
				main_over_home_btn.mouseOver = true;
			}
			else{
				main_over_home_btn.mouseOver = false;
			}
		}
		else{
			if(!popup){
				if(stageLoad){
					if(itemClicked){
						itemDragFunc();
					}
					else{
						if(mouseCd(main_exit_btn)){
							if(main_exit_btn.clickable){
								$("canvas").css("cursor","pointer");
								main_exit_btn.mouseOver = true;
							}
						}
						else{
							main_exit_btn.mouseOver = false;
						}
					}
					if(stage == 1){
						if(!itemClicked){
							if(mouseCd(as_1_mp1)){
								$("canvas").css("cursor","pointer");
								as_1_mp1.mouseOver = true;
								baloon_arr[0][0].active = true;
								as_1_person2.mouseOver = false;
								baloon_arr[0][5].active = false;
							}
							else if(mouseCd(as_1_mp2)){
								$("canvas").css("cursor","pointer");
								if(as_1_mp2.active){
									as_1_mp2.mouseOver = true;
									baloon_arr[0][1].active = true;
								}
							}
							else if(mouseCd(as_1_card)){
								$("canvas").css("cursor","pointer");
								if(as_1_card.active){
									as_1_card.mouseOver = true;
									baloon_arr[0][8].active = true;
								}
							}
							else{
								as_1_mp1.mouseOver = false;
								as_1_mp2.mouseOver = false;
								as_1_card.mouseOver = false;
								baloon_arr[0][0].active = false;
								baloon_arr[0][1].active = false;
								baloon_arr[0][8].active = false;
							}
						}
						if(mouseCd(as_1_person1)){
							$("canvas").css("cursor","pointer");
							as_1_person1.mouseOver = true;
							baloon_arr[0][4].active = true;
						}
						else if(mouseCd(as_1_person2)){
							$("canvas").css("cursor","pointer");
							as_1_person2.mouseOver = true;
							baloon_arr[0][5].active = true;
							as_1_mp1.mouseOver = false;
							baloon_arr[0][0].active = false;
						}
						else if(mouseCd(as_1_person3)){
							$("canvas").css("cursor","pointer");
							as_1_person3.mouseOver = true;
							if(as_1_person3.filled){
								baloon_arr[0][7].active = true;
							}
							else{
								baloon_arr[0][6].active = true;
							}
						}
						else if(mouseCd(as_1_mp_fill)){
							$("canvas").css("cursor","pointer");
							as_1_mp_fill.mouseOver = true;
							if(as_1_mp_fill.filled){
								baloon_arr[0][3].active = true;
							}
							else{
								baloon_arr[0][2].active = true;
							}
						}
						else{
							as_1_person1.mouseOver = false;
							as_1_person2.mouseOver = false;
							as_1_person3.mouseOver = false;
							as_1_mp_fill.mouseOver = false;
							baloon_arr[0][2].active = false;
							baloon_arr[0][3].active = false;
							baloon_arr[0][4].active = false;
							baloon_arr[0][5].active = false;
							baloon_arr[0][6].active = false;
							baloon_arr[0][7].active = false;
						}
					}
					else if(stage == 2){
						if(!itemClicked){
							if(mouseCd(as_2_rock)){
								$("canvas").css("cursor","pointer");
								as_2_rock.mouseOver = true;
								baloon_arr[1][4].active = true;
							}
							else if(mouseCd(as_2_jh)){
								$("canvas").css("cursor","pointer");
								if(as_2_jh.active){
									as_2_jh.mouseOver = true;
									baloon_arr[1][5].active = true;
								}
							}
							else if(mouseCd(as_2_book)){
								$("canvas").css("cursor","pointer");
								as_2_person1.mouseOver = false;
								baloon_arr[1][0].active = false;
								if(as_2_book.active){
									as_2_book.mouseOver = true;
									baloon_arr[1][8].active = true;
								}
							}
							else{
								as_2_rock.mouseOver = false;
								as_2_jh.mouseOver = false;
								as_2_book.mouseOver = false;
								baloon_arr[1][4].active = false;
								baloon_arr[1][5].active = false;
								baloon_arr[1][8].active = false;
							}
						}
						if(mouseCd(as_2_person1)){
							$("canvas").css("cursor","pointer");
							as_2_person1.mouseOver = true;
							baloon_arr[1][0].active = true;
							as_2_book.mouseOver = false;
							baloon_arr[1][8].active = false;
						}
						else if(mouseCd(as_2_person2)){
							$("canvas").css("cursor","pointer");
							as_2_person2.mouseOver = true;
							baloon_arr[1][1].active = true;
						}
						else if(mouseCd(as_2_person3)){
							$("canvas").css("cursor","pointer");
							as_2_person3.mouseOver = true;
							if(as_2_person3.filled){
								baloon_arr[1][3].active = true;
							}
							else{
								baloon_arr[1][2].active = true;
							}
						}
						else if(mouseCd(as_2_jh_fill)){
							$("canvas").css("cursor","pointer");
							as_2_jh_fill.mouseOver = true;
							if(as_2_jh_fill.filled){
								baloon_arr[1][7].active = true;
							}
							else{
								baloon_arr[1][6].active = true;
							}
						}
						else{
							as_2_person1.mouseOver = false;
							as_2_person2.mouseOver = false;
							as_2_person3.mouseOver = false;
							as_2_jh_fill.mouseOver = false;
							baloon_arr[1][0].active = false;
							baloon_arr[1][1].active = false;
							baloon_arr[1][2].active = false;
							baloon_arr[1][3].active = false;
							baloon_arr[1][6].active = false;
							baloon_arr[1][7].active = false;
						}
					}
					else if(stage == 3){
						if(!itemClicked){
							if(mouseCd(as_3_rock1)){
								$("canvas").css("cursor","pointer");
								as_3_rock1.mouseOver = true;
								baloon_arr[2][2].active = true;
								as_3_info.mouseOver = false;
								as_3_rock_fill.mouseOver = false;
								baloon_arr[2][1].active = false;
								baloon_arr[2][3].active = false;
							}
							else if(mouseCd(as_3_rock2)){
								$("canvas").css("cursor","pointer");
								as_3_rock3.mouseOver = false;
								as_3_person2.mouseOver = false;
								baloon_arr[2][4].active = false;
								baloon_arr[2][6].active = false;
								if(as_3_rock2.active){
									as_3_rock2.mouseOver = true;
									baloon_arr[2][5].active = true;
								}
							}
							else if(mouseCd(as_3_rock3)){
								$("canvas").css("cursor","pointer");
								as_3_rock3.mouseOver = true;
								as_3_rock2.mouseOver = false;
								as_3_rock_fill.mouseOver = false;
								as_3_info.mouseOver = false;
								baloon_arr[2][4].active = true;
								baloon_arr[2][5].active = false;
							}
							else{
								as_3_rock1.mouseOver = false;
								as_3_rock2.mouseOver = false;
								as_3_rock3.mouseOver = false;
								baloon_arr[2][2].active = false;
								baloon_arr[2][5].active = false;
								baloon_arr[2][4].active = false;
							}
						}
						if(mouseCd(as_3_person1)){
							$("canvas").css("cursor","pointer");
							as_3_person1.mouseOver = true;
							baloon_arr[2][0].active = true;
						}
						else if(mouseCd(as_3_person2)){
							$("canvas").css("cursor","pointer");
							as_3_person2.mouseOver = true;
							baloon_arr[2][6].active = true;
							as_3_rock2.mouseOver = false;
							baloon_arr[2][5].active = false;
						}
						else if(mouseCd(as_3_info)){
							$("canvas").css("cursor","pointer");
							as_3_info.mouseOver = true;
							//baloon_arr[2][1].active = true;
							as_3_rock1.mouseOver = false;
							baloon_arr[2][2].active = false;
						}
						else if(mouseCd(as_3_rock_fill)){
							$("canvas").css("cursor","pointer");
							as_3_rock_fill.mouseOver = true;
							baloon_arr[2][3].active = true;
							as_3_rock1.mouseOver = false;
							as_3_rock3.mouseOver = false;
							baloon_arr[2][2].active = false;
						}
						else{
							as_3_person1.mouseOver = false;
							as_3_person2.mouseOver = false;
							as_3_info.mouseOver = false;
							as_3_rock_fill.mouseOver = false;
							baloon_arr[2][0].active = false;
							//baloon_arr[2][1].active = false;
							baloon_arr[2][3].active = false;
							baloon_arr[2][6].active = false;
						}
					}
					else if(stage == 4){
						if(!itemClicked){
							if(mouseCd(as_4_board1)){
								$("canvas").css("cursor","pointer");
								as_4_board1.mouseOver = true;
								baloon_arr[3][4].active = true;
							}
							else if(mouseCd(as_4_board2)){
								$("canvas").css("cursor","pointer");
								if(as_4_board2.active){
									as_4_board2.mouseOver = true;
									baloon_arr[3][5].active = true;
								}
							}
							else if(mouseCd(as_4_board3)){
								$("canvas").css("cursor","pointer");
								as_4_board3.mouseOver = true;
								baloon_arr[3][6].active = true;
							}
							else if(mouseCd(as_4_baloon)){
								$("canvas").css("cursor","pointer");
								as_4_baloon.mouseOver = true;
							}
							else{
								as_4_board1.mouseOver = false;
								as_4_board2.mouseOver = false;
								as_4_board3.mouseOver = false;
								as_4_baloon.mouseOver = false;
								baloon_arr[3][4].active = false;
								baloon_arr[3][5].active = false;
								baloon_arr[3][6].active = false;
							}
						}
						if(mouseCd(as_4_person1)){
							$("canvas").css("cursor","pointer");
							as_4_person1.mouseOver = true;
							baloon_arr[3][0].active = true;
						}
						else if(mouseCd(as_4_person2)){
							$("canvas").css("cursor","pointer");
							as_4_person2.mouseOver = true;
							baloon_arr[3][1].active = true;
						}
						else if(mouseCd(as_4_person3)){
							$("canvas").css("cursor","pointer");
							as_4_person3.mouseOver = true;
							if(as_4_person3.filled){
								baloon_arr[3][3].active = true;
							}
							else{
								baloon_arr[3][2].active = true;
							}
						}
						else if(mouseCd(as_4_board_fill)){
							$("canvas").css("cursor","pointer");
							as_4_board_fill.mouseOver = true;
							if(as_4_board_fill.filled){
								baloon_arr[3][8].active = true;
							}
							else{
								baloon_arr[3][7].active = true;
							}
						}
						else{
							as_4_person1.mouseOver = false;
							as_4_person2.mouseOver = false;
							as_4_person3.mouseOver = false;
							as_4_board_fill.mouseOver = false;
							baloon_arr[3][0].active = false;
							baloon_arr[3][1].active = false;
							baloon_arr[3][2].active = false;
							baloon_arr[3][3].active = false;
							baloon_arr[3][7].active = false;
							baloon_arr[3][8].active = false;
						}
					}
					else if(stage == 5){
						if(!itemClicked){
							if(mouseCd(as_5_jewel)){
								$("canvas").css("cursor","pointer");
								if(as_5_jewel.active){
									as_5_jewel.mouseOver = true;
									as_5_info.mouseOver = false;
									baloon_arr[4][6].active = true;
									baloon_arr[4][10].active = false;
								}
							}
							else if(mouseCd(as_5_news)){
								$("canvas").css("cursor","pointer");
								if(as_5_news.active){
									as_5_news.mouseOver = true;
									as_5_can.mouseOver = false;
									baloon_arr[4][7].active = true;
									baloon_arr[4][11].active = false;
								}
							}
							else if(mouseCd(as_5_can)){
								$("canvas").css("cursor","pointer");
								if(as_5_can.active){
									as_5_can.mouseOver = true;
									as_5_news.mouseOver = false;
									baloon_arr[4][11].active = true;
									baloon_arr[4][7].active = false;
								}
							}
							else{
								as_5_jewel.mouseOver = false;
								as_5_news.mouseOver = false;
								as_5_can.mouseOver = false;
								baloon_arr[4][6].active = false;
								baloon_arr[4][7].active = false;
								baloon_arr[4][11].active = false;
							}
						}
						if(mouseCd(as_5_person1)){
							$("canvas").css("cursor","pointer");
							as_5_person1.mouseOver = true;
							baloon_arr[4][0].active = true;
						}
						else if(mouseCd(as_5_person2)){
							$("canvas").css("cursor","pointer");
							as_5_person2.mouseOver = true;
							as_5_person1.mouseOver = false;
							if(as_5_person2.filled){
								baloon_arr[4][2].active = true;
							}
							else{
								baloon_arr[4][1].active = true;
							}
						}
						else if(mouseCd(as_5_person3)){
							$("canvas").css("cursor","pointer");
							as_5_person3.mouseOver = true;
							as_5_person4.mouseOver = false;
							baloon_arr[4][3].active = true;
							baloon_arr[4][4].active = false;
							baloon_arr[4][5].active = false;
						}
						else if(mouseCd(as_5_person4)){
							$("canvas").css("cursor","pointer");
							as_5_person4.mouseOver = true;
							as_5_person3.mouseOver = false;
							baloon_arr[4][3].active = false;
							if(as_5_person4.filled){
								baloon_arr[4][5].active = true;
							}
							else{
								baloon_arr[4][4].active = true;
							}
						}
						else if(mouseCd(as_5_trash)){
							$("canvas").css("cursor","pointer");
							as_5_trash.mouseOver = true;
							if(as_5_trash.filled){
								baloon_arr[4][9].active = true;
							}
							else{
								baloon_arr[4][8].active = true;
							}
						}
						else if(mouseCd(as_5_info)){
							$("canvas").css("cursor","pointer");
							as_5_info.mouseOver = true;
							as_5_jewel.mouseOver = false;
							baloon_arr[4][10].active = true;
							baloon_arr[4][6].active = false;
						}
						else{
							as_5_person1.mouseOver = false;
							as_5_person2.mouseOver = false;
							as_5_person3.mouseOver = false;
							as_5_person4.mouseOver = false;
							as_5_trash.mouseOver = false;
							as_5_info.mouseOver = false;
							baloon_arr[4][0].active = false;
							baloon_arr[4][1].active = false;
							baloon_arr[4][2].active = false;
							baloon_arr[4][3].active = false;
							baloon_arr[4][4].active = false;
							baloon_arr[4][5].active = false;
							baloon_arr[4][8].active = false;
							baloon_arr[4][9].active = false;
							baloon_arr[4][10].active = false;
						}
					}
					else if(stage == 6){
						if(!itemClicked){
							if(mouseCd(as_6_person4)){
							$("canvas").css("cursor","pointer");
								if(as_6_person4.active){
									as_6_person4.mouseOver = true;
									baloon_arr[5][1].active = true;
								}
							}
							else if(mouseCd(as_6_book1)){
								$("canvas").css("cursor","pointer");
								if(as_6_book1.active){
									as_6_book1.mouseOver = true;
									baloon_arr[5][10].active = true;
								}
							}
							else if(mouseCd(as_6_book2)){
								$("canvas").css("cursor","pointer");
								as_6_chair2.mouseOver = false;
								baloon_arr[5][9].active = false;
								if(as_6_book2.active){
									as_6_book2.mouseOver = true;
									baloon_arr[5][11].active = true;
								}
							}
							else if(mouseCd(as_6_cloth)){
								$("canvas").css("cursor","pointer");
								as_6_chair3.mouseOver = false;
								baloon_arr[5][10].active = false;
								if(as_6_cloth.active){
									as_6_cloth.mouseOver = true;
									baloon_arr[5][8].active = true;
								}
							}
							else{
								as_6_person4.mouseOver = false;
								as_6_book1.mouseOver = false;
								as_6_book2.mouseOver = false;
								as_6_cloth.mouseOver = false;
								baloon_arr[5][1].active = false;
								baloon_arr[5][8].active = false;
								baloon_arr[5][10].active = false;
								baloon_arr[5][11].active = false;
							}
						}
						if(mouseCd(as_6_person1)){
							$("canvas").css("cursor","pointer");
							as_6_person1.mouseOver = true;
							baloon_arr[5][0].active = true;
							as_6_chair1.mouseOver = false;
							baloon_arr[5][6].active = false;
							baloon_arr[5][7].active = false;
						}
						else if(mouseCd(as_6_person2)){
							$("canvas").css("cursor","pointer");
							as_6_person2.mouseOver = true;
							if(as_6_person2.filled){
								baloon_arr[5][3].active = true;
							}
							else{
								baloon_arr[5][2].active = true;
							}
						}
						else if(mouseCd(as_6_person3)){
							$("canvas").css("cursor","pointer");
							as_6_person3.mouseOver = true;
							if(as_6_person3.filled){
								baloon_arr[5][5].active = true;
							}
							else{
								baloon_arr[5][4].active = true;
							}
						}
						else if(mouseCd(as_6_chair1)){
							$("canvas").css("cursor","pointer");
							as_6_chair1.mouseOver = true;
							as_6_person1.mouseOver = false;
							baloon_arr[5][0].active = false;
							if(as_6_chair1.filled){
								baloon_arr[5][7].active = true;
							}
							else{
								baloon_arr[5][6].active = true;
							}
						}
						else if(mouseCd(as_6_chair2)){
							$("canvas").css("cursor","pointer");
							as_6_chair2.mouseOver = true;
							baloon_arr[5][9].x = 80;
							baloon_arr[5][9].active = true;
							as_6_book1.mouseOver = false;
							baloon_arr[5][10].active = false;
						}
						else if(mouseCd(as_6_chair3)){
							$("canvas").css("cursor","pointer");
							as_6_chair3.mouseOver = true;
							baloon_arr[5][9].x = 490;
							baloon_arr[5][9].active = true;
							as_6_cloth.mouseOver = false;
							baloon_arr[5][8].active = false;
						}					
						else{
							as_6_person1.mouseOver = false;
							as_6_person2.mouseOver = false;
							as_6_person3.mouseOver = false;
							as_6_chair1.mouseOver = false;
							as_6_chair2.mouseOver = false;
							as_6_chair3.mouseOver = false;
							baloon_arr[5][0].active = false;
							baloon_arr[5][2].active = false;
							baloon_arr[5][3].active = false;
							baloon_arr[5][4].active = false;
							baloon_arr[5][5].active = false;
							baloon_arr[5][6].active = false;
							baloon_arr[5][7].active = false;
							baloon_arr[5][9].active = false;
						}
					}
				}
			}
			else{
				if(main_exit_bg.appear && main_exit_bg.load){
					if(mouseCd(main_exit_yes_btn)){
						$("canvas").css("cursor","pointer");
						main_exit_yes_btn.mouseOver = true;
						main_exit_no_btn.mouseOver = false;		
					}				
					else if(mouseCd(main_exit_no_btn)){
						$("canvas").css("cursor","pointer");
						main_exit_no_btn.mouseOver = true;	
						main_exit_yes_btn.mouseOver = false;		
					}
					else{
						main_exit_no_btn.mouseOver = false;	
						main_exit_yes_btn.mouseOver = false;	
					}
				}
				else if(main_try_bg.appear && main_try_bg.load){
					if(mouseCd(main_try_yes_btn)){
						$("canvas").css("cursor","pointer");
						main_try_yes_btn.mouseOver = true;
						main_try_no_btn.mouseOver = false;		
					}				
					else if(mouseCd(main_try_no_btn)){
						$("canvas").css("cursor","pointer");
						main_try_no_btn.mouseOver = true;	
						main_try_yes_btn.mouseOver = false;		
					}
					else{
						main_try_yes_btn.mouseOver = false;	
						main_try_no_btn.mouseOver = false;	
					}
				}		
			}
		}
	}
});
document.addEventListener(mouseEv("down"),function(e){ 
	let event = (e.type == "mousedown" ? e : e.touches[0]);
	mouseX = event.pageX - $("canvas").offset().left;					
	mouseY = event.pageY - $("canvas").offset().top;

	if(!userInit){
		if(aud_Arr.length > 0){
			aud_Arr[0][1].play();
		}
		userInit = true;
	}

	if(pageType == "main"){
		if(!gameClear && !gameOver && !popup && stageLoad){
			if(stage == 1){
				if(mouseCd(as_1_mp1)){
					audioPlay(1);
					itemClickFunc(as_1_mp1);
				}
				else if(mouseCd(as_1_mp2)){
					audioPlay(1);
					itemClickFunc(as_1_mp2);
				}
				else if(mouseCd(as_1_card)){
					audioPlay(1);
					itemClickFunc(as_1_card);
				}
			}
			else if(stage == 2){
				if(mouseCd(as_2_jh)){
					audioPlay(1);
					itemClickFunc(as_2_jh);
				}
				else if(mouseCd(as_2_rock)){
					audioPlay(1);
					itemClickFunc(as_2_rock);
				}
				else if(mouseCd(as_2_book)){
					audioPlay(1);
					itemClickFunc(as_2_book);
				}
			}
			else if(stage == 3){
				if(mouseCd(as_3_rock1)){
					audioPlay(1);
					itemClickFunc(as_3_rock1);
				}
				else if(mouseCd(as_3_rock2)){
					audioPlay(1);
					itemClickFunc(as_3_rock2);
				}
				else if(mouseCd(as_3_rock3)){
					audioPlay(1);
					itemClickFunc(as_3_rock3);
				}
			}
			else if(stage == 4){
				if(mouseCd(as_4_board1)){
					audioPlay(1);
					itemClickFunc(as_4_board1);
				}
				else if(mouseCd(as_4_board2)){
					audioPlay(1);
					itemClickFunc(as_4_board2);
				}
				else if(mouseCd(as_4_board3)){
					audioPlay(1);
					itemClickFunc(as_4_board3);
				}
				else if(mouseCd(as_4_baloon)){
					audioPlay(1);
					itemClickFunc(as_4_baloon);
				}
			}
			else if(stage == 5){
				if(mouseCd(as_5_jewel)){
					audioPlay(1);
					itemClickFunc(as_5_jewel);
				}
				else if(mouseCd(as_5_news)){
					audioPlay(1);
					itemClickFunc(as_5_news);
				}
				else if(mouseCd(as_5_can)){
					audioPlay(1);
					itemClickFunc(as_5_can);
				}
			}
			else if(stage == 6){
				if(mouseCd(as_6_person4)){
					audioPlay(1);
					itemClickFunc(as_6_person4);
				}
				else if(mouseCd(as_6_book1)){
					audioPlay(1);
					itemClickFunc(as_6_book1);
				}
				else if(mouseCd(as_6_book2)){
					audioPlay(1);
					itemClickFunc(as_6_book2);
				}
				else if(mouseCd(as_6_cloth)){
					audioPlay(1);
					itemClickFunc(as_6_cloth);
				}
			}
		}
	}
});
document.addEventListener(mouseEv("up"),function(e){
	if(pageType == "intro"){
		if(!popup){
			if(mouseCd(intro_start_btn)){
				if(intro_start_btn.clickable){
					audioPlay(1);
					intro_start_btn.mouseOver = false;
					introBtnCtrl(false);
					selectPopupCtrl(true);
				}
			}
			else if(mouseCd(intro_method_btn)){
				if(intro_method_btn.clickable){
					audioPlay(1);
					intro_method_btn.mouseOver = false;
					introBtnCtrl(false);
					methodPopupCtrl(true);
				}
			}
			else if(mouseCd(intro_sound_btn)){
				if(intro_sound_btn.clickable){
					intro_sound_btn.mouseOver = false;
					if(volume){
						volume = 0;
					}
					else{
						volume = 1;
					}
					for(let i=0;i<aud_Arr.length;i++){
						aud_Arr[i][1].volume = volume;
					}
					audioPlay(1);
				}
			}
		}
		else{
			if(method_bg.appear && method_bg.load){		
				if(mouseCd(method_exit_btn)){
					audioPlay(1);
					method_exit_btn.mouseOver = false;
					introBtnCtrl(true);
					methodPopupCtrl(false);
				}
				else if(mouseCd(method_prev_btn)){
					if(method_prev_btn.active){
						audioPlay(2);
						method_prev_btn.mouseOver = false;
						method_content.pageIdx--;
						method_content.slideLeft = true;
					}
				}
				else if(mouseCd(method_next_btn)){
					if(method_next_btn.active){
						audioPlay(2);
						method_next_btn.mouseOver = false;
						method_content.pageIdx++;
						method_content.slideRight = true;
					}
				}
			}
			else if(select_bg.appear && select_bg.load){
				if(mouseCd(select_exit_btn)){
					audioPlay(1);
					select_exit_btn.mouseOver = false;
					introBtnCtrl(true);
					selectPopupCtrl(false);
				}
				else if(mouseCd(select_start_btn)){
					audioPlay(1);
					select_start_btn.mouseOver = false;
					selectPopupCtrl(false);
					convPopupCtrl(true);
				}
				else if(mouseCd(select_male_btn)){
					audioPlay(1);
					select_male_btn.mouseOver = false;
					select_male_btn.on = true;
					select_female_btn.on = false;
					gender = 1;
				}
				else if(mouseCd(select_female_btn)){
					audioPlay(1);
					select_female_btn.mouseOver = false;
					select_male_btn.on = false;
					select_female_btn.on = true;
					gender = 2;
				}	
			}
			else if((conv_user_bg.appear && conv_user_bg.load) || (conv_pc_bg.appear && conv_pc_bg.load)){
				if(mouseCd(conv_skip_btn)){
					if(conv_skip_btn.clickable){
						audioPlay(1);
						conv_skip_btn.mouseOver = false;
						exitIntro();
					}
				}
				else if(mouseCd(conv_next_btn)){
					if(conv_next_btn.clickable){
						audioPlay(1);
						conv_next_btn.mouseOver = false;	
						convSkipFunc();
					}
				}
				else if(mouseCd(conv_start_btn)){
					if(conv_start_btn.clickable){
						audioPlay(1);
						conv_start_btn.mouseOver = false;
						exitIntro();
					}
				}
				else{
					if(convIdx-1 < conv_Arr.length){
						convSkipFunc();
					}
				}
			}
		}
	}
	else if(pageType == "main"){
		if(gameClear){
			if(mouseCd(main_clear_home_btn)){
				_isPorted ? parent.gameResult() : location.href = "index.html";
			}			
		}
		else if(gameOver){
			if(mouseCd(main_over_home_btn)){
				location.href = "index.html";
			}
		}
		else{
			if(!popup){
				if(stageLoad){
					if(itemClicked){
						if(stage == 1){
							if(mouseCd(as_1_person1)){
								itemCheckFunc(as_1_person1, null);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_1_person2)){
								itemCheckFunc(as_1_person2, null);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_1_person3)){
								itemCheckFunc(as_1_person3, as_1_card);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_1_mp_fill)){
								itemCheckFunc(as_1_mp_fill, as_1_mp2);
								tryPopupCtrl(true);
							}
							else{
								itemResetFunc();
							}
						}
						else if(stage == 2){
							if(mouseCd(as_2_person1)){
								itemCheckFunc(as_2_person1, null);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_2_person2)){
								itemCheckFunc(as_2_person2, null);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_2_person3)){
								itemCheckFunc(as_2_person3, as_2_book);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_2_jh_fill)){
								itemCheckFunc(as_2_jh_fill, as_2_jh);
								tryPopupCtrl(true);
							}
							else{
								itemResetFunc();
							}
						}
						else if(stage == 3){
							if(mouseCd(as_3_person1)){
								itemCheckFunc(as_3_person1, null);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_3_person2)){
								itemCheckFunc(as_3_person2, null);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_3_rock_fill)){
								itemCheckFunc(as_3_rock_fill, as_3_rock2);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_3_info)){
								itemCheckFunc(as_3_info, null);
								tryPopupCtrl(true);
							}
							else{
								itemResetFunc();
							}
						}
						else if(stage == 4){
							if(mouseCd(as_4_person1)){
								itemCheckFunc(as_4_person1, null);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_4_person2)){
								itemCheckFunc(as_4_person2, null);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_4_person3)){
								itemCheckFunc(as_4_person3, as_4_baloon);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_4_board_fill)){
								itemCheckFunc(as_4_board_fill, as_4_board2);
								tryPopupCtrl(true);
							}
							else{
								itemResetFunc();
							}
						}
						else if(stage == 5){
							if(mouseCd(as_5_person1)){
								itemCheckFunc(as_5_person1, null);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_5_person2)){
								itemCheckFunc(as_5_person2, as_5_news);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_5_person3)){
								itemCheckFunc(as_5_person3, null);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_5_person4)){
								itemCheckFunc(as_5_person4, as_5_jewel);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_5_trash)){
								itemCheckFunc(as_5_trash, as_5_can);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_5_info)){
								itemCheckFunc(as_5_info, null);
								tryPopupCtrl(true);
							}
							else{
								itemResetFunc();
							}
						}
						else if(stage == 6){
							if(mouseCd(as_6_person1)){
								itemCheckFunc(as_6_person1, null);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_6_person2)){
								itemCheckFunc(as_6_person2, as_6_book1);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_6_person3)){
								itemCheckFunc(as_6_person3, as_6_cloth);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_6_chair1)){
								itemCheckFunc(as_6_chair1, as_6_person4);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_6_chair2)){
								itemCheckFunc(as_6_chair2, null);
								tryPopupCtrl(true);
							}
							else if(mouseCd(as_6_chair3)){
								itemCheckFunc(as_6_chair3, null);
								tryPopupCtrl(true);
							}
							else{
								itemResetFunc();
							}
						}

					}
					else{
						if(mouseCd(main_exit_btn)){
							if(main_exit_btn.clickable){
								audioPlay(1);
								main_exit_btn.mouseOver = false;
								exitPopupCtrl(true);
							}
						}
					}
				}
			}
			else{
				if(main_exit_bg.appear && main_exit_bg.load){
					if(mouseCd(main_exit_yes_btn)){
						location.href = "index.html";
					}				
					else if(mouseCd(main_exit_no_btn)){
						audioPlay(1);
						main_exit_no_btn.mouseOver = false;
						exitPopupCtrl(false);		
					}
				}
				else if(main_try_bg.appear && main_try_bg.load){
					if(mouseCd(main_try_yes_btn)){
						main_try_yes_btn.mouseOver = false;		
						tryPopupCtrl(false);
						resultAlertCtrl();
					}				
					else if(mouseCd(main_try_no_btn)){
						audioPlay(1);
						main_try_no_btn.mouseOver = false;	
						main_exit_btn.appear = true;
						tryPopupCtrl(false);
						itemResetFunc();
					}
				}		
			}
		}
	}
	$("canvas").css("cursor","auto");
});
document.addEventListener("DOMContentLoaded", function(){
	if(device != "PC"){
		$(window).trigger("orientationchange"); 
	}
});
window.addEventListener("orientationchange", function(){
	if(device != "PC"){
		setTimeout(function(){
			if(deviceAng != window.orientation){
				cvsSet();
			}
		},500);
	}
});
window.addEventListener("resize", function(){
	cvsSet();
});
window.requestAnimFrame = (function(){
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame		||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};	
})();
/* 내부 유틸 */
function loadContent(){
	sourceLoadCnt++;
	if(sourceLoadCnt >= aud_Arr.length + img_Arr.length + vid_Arr.length){
		loadLoop = function(){return;}
		intro();
	}
}
function audioPlay(idx){
	for(let i=1;i<aud_Arr.length;i++){
		aud_Arr[i][1].pause();
		aud_Arr[i][1].currentTime =0;
	}
	aud_Arr[idx][1].play();
}
/* 외부 유틸 */
function log(txt){
	return console.log(txt);
}
function deviceCheck(){
	const agt = navigator.userAgent.toLowerCase(); 
	if(agt.indexOf("iphone") != -1 || agt.indexOf("ipad") != -1 || agt.indexOf("ipod") != -1){
		return "IOS";
	}
	else if(agt.match('android') != null){
		return "Android";
	}
	else{
		return "PC";
	}
}
function browserCheck(){ 
	const agt = navigator.userAgent.toLowerCase(); 
	if(agt.indexOf("chrome") != -1) return 'Chrome'; 
	if(agt.indexOf("opera") != -1) return 'Opera'; 
	if(agt.indexOf("staroffice") != -1) return 'Star Office'; 
	if(agt.indexOf("webtv") != -1) return 'WebTV'; 
	if(agt.indexOf("beonex") != -1) return 'Beonex'; 
	if(agt.indexOf("chimera") != -1) return 'Chimera'; 
	if(agt.indexOf("netpositive") != -1) return 'NetPositive'; 
	if(agt.indexOf("phoenix") != -1) return 'Phoenix'; 
	if(agt.indexOf("firefox") != -1) return 'Firefox'; 
	if(agt.indexOf("safari") != -1) return 'Safari'; 
	if(agt.indexOf("skipstone") != -1) return 'SkipStone'; 
	if(agt.indexOf("netscape") != -1) return 'Netscape'; 
	if(agt.indexOf("mozilla/5.0") != -1) return 'Mozilla'; 
	if(agt.indexOf("msie") != -1){ 
    	let rv = -1; 
		if (navigator.appName == 'Microsoft Internet Explorer') { 
			let ua = navigator.userAgent; var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})"); 
		if (re.exec(ua) != null) 
			rv = parseFloat(RegExp.$1); 
		} 
		return 'Internet Explorer '+rv; 
	} 
}
function cvsSet(){
	const vWidth	= Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	const vHeight	= Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	const currRatio = vWidth / vHeight;
	const realRatio = absWidth / absHeight;
	
	const widthBase = function(){
		cvs.width	= vWidth;			cvs.height = cvs.width / realRatio;
		$(cvs).css("margin-top", (vHeight - cvs.height) * 0.5 + "px");
	};
	const heightBase = function(){
		cvs.height	= vHeight;			cvs.width = cvs.height * realRatio;	
		$(cvs).css("margin-top", 0);
	};
	if(device == "PC"){
		if(currRatio > realRatio){
			vWidth > vHeight ? heightBase() : widthBase();
		}
		else{
			widthBase();
		}
	}
	else{
		deviceAng = window.orientation;
		$(".canvas_wrapper").css("height", vHeight + "px");
		if(deviceAng == 0 || deviceAng == 180){
			$(".canvas_wrapper").css("background","url('" + mobilePortraitBg + "') no-repeat 100% 100% / 100% 100%");
			widthBase();
		}
		else{
			$(".canvas_wrapper").css("background","url('" + mobileLandscapeBg + "') no-repeat 100% 100% / 100% 100%");
			heightBase();
		}
	}
	wR = cvs.width / absWidth;	
	hR = cvs.height / absHeight;
}
function mouseCd(obj){
	return obj.x * wR < mouseX && mouseX < (obj.x + obj.w) * wR && obj.y * hR < mouseY && mouseY < (obj.y + obj.h) * hR;
}
function mouseEv(action){
	let result = "";

	if(action == "move"){
		result = (device == "PC") ? "mousemove" : "touchmove";
	}
	else if(action == "down"){
		result = (device == "PC") ? "mousedown" : "touchstart";
	}
	else if(action == "up"){
		result = (device == "PC") ? "mouseup"	: "touchend";
	}
	return result;
}