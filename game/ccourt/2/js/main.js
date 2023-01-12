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
	["intro/btn_start.png"],
	["intro/btn_method.png"],
	["intro/btn_sound.png"],
	["intro/method/bg.png"],																	// 5
	["intro/method/content.png"],												
	["intro/method/btn_exit.png"],
	["intro/method/btn_prev.png"],
	["intro/method/btn_next.png"],
	["intro/method/dot.png"],																	// 10
	["main/bg.png"],															
	["main/top.png"],		
	["main/bottom.png"],	
	["main/life.png"],	
	["main/level.png"],																			// 15
	["main/score.png"],															
	["main/score_unit.png"],
	["main/select/bg.png"],
	["main/select/char.png"],
	["main/select/btn_start.png"],																// 20
	["main/level/bg.png"],													
	["main/level/level_circle.png"],		
	["main/level/level_alert.png"],		
	["main/readyGo.png"],	
	["main/bg/map01_01.png"],																	// 25
	["main/bg/map01_02.png"],													
	["main/bg/map02.png"],	
	["main/bg/map03.png"],	
	["main/bg/map04.png"],	
	["main/bg/map05.png"],																		// 30
	["main/bg/map06.png"],														
	["main/char/male.png"],	
	["main/char/female.png"],	
	["main/platform/1_1.png"],	
	["main/platform/1_2.png"],																	// 35
	["main/platform/1_3.png"],												
	["main/platform/2_1.png"],	
	["main/platform/2_2.png"],	
	["main/platform/2_3.png"],	
	["main/platform/3_1.png"],																	// 40
	["main/platform/3_2.png"],													
	["main/platform/3_3.png"],	
	["main/platform/3_4.png"],	
	["main/item/item.png"],	
	["main/enemy/bee.png"],																		// 45
	["main/enemy/bird.png"],													
	["main/enemy/space.png"],	
	["main/exit/bg.png"],	
	["main/exit/btn_cont.png"],	
	["main/exit/btn_exit.png"],																	// 50
	["main/over/bg.png"],														
	["main/over/btn_home.png"],	
	["main/quiz/bg.png"],	
	["main/quiz/btn_hint.png"],	
	["main/quiz/btn_o.png"],																	// 55
	["main/quiz/btn_x.png"],														
	["main/quiz/time.png"],	
	["main/quiz/time_num.png"],
	["main/quiz/bg_hint.png"],
	["main/success/bg.png"],																	// 60
	["main/success/level.png"],												
	["main/success/btn_next.png"],
	["main/quiz/panel.png"],
	["main/quiz/result.png"],
	["main/quiz/result_o.png"],																	// 65
	["main/quiz/result_x.png"],												
	["main/quiz/btn_close.png"],
	["main/level/level_star.png"],
	["main/clear/bg.png"],
	["main/clear/btn_home.png"],																// 70
	["main/item/eff.png"],	
	["main/mobile/left.png"],	
	["main/mobile/right.png"],		
	["main/mobile/jump.png"],			
];
const aud_Arr	= [
	["bgm.mp3"],																				// 0
	["btn_click.mp3"],
	["level.mp3"],
	["jump.mp3"],
	["item.mp3"],
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
/* 객체 프로토타입 설정 */
{
	Object.prototype.init = function(info){
		this.idx	= info.idx;
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
	};
	Object.prototype.isAni = false;	
	Object.prototype.ani = 0;
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
	Object.prototype.isBtn = false;
	Object.prototype.mouseOver = false;
	Object.prototype.mouseDown = false;
	Object.prototype.clickable = false;
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
	Object.prototype.cutIdx = 0;
	Object.prototype.cutSet = function(cutIdx){
		this.cutIdx = (cutIdx == null) ? this.cutIdx : cutIdx;
		this.cx = (this.cutIdx % this.colCnt) * this.cw;
		this.cy = Math.floor(this.cutIdx / this.colCnt) * this.ch;
	};
	Object.prototype.isAlpha = false;
	Object.prototype.appear = false;
	Object.prototype.disappear = false;
	Object.prototype.load = false;
	Object.prototype.globalAlpha = 1;
	Object.prototype.alphaSet = function(globalAlpha){
		this.isAlpha = true;
		this.globalAlpha = (globalAlpha == null) ? this.globalAlpha : globalAlpha;
	}
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
	Object.prototype.draw = function(){
		try{ 
			if(this.active){
				if(this.isAni){
					this.aniFunc();
				}
				if(this.isBtn){
					this.mouseFunc();
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
		catch(e){}
	};
	Object.prototype.drawVid = function(i){
		try{ 
			ctx.drawImage(vid_Arr[i][2].video, 0, 0, cvs.width, cvs.height);
		}
		catch(e){}
	};
	Object.prototype.drawTxt = function(txt, x, y, size, color, align){
		try{ 
			ctx.font = "bold "+(size * hR)+"px '맑은고딕'";
			ctx.fillStyle = color;
			ctx.textAlign = align;
			ctx.fillText(txt, x * wR, y * hR);	
		}
		catch(e){}
	};
	Object.prototype.colCnt = 1;
	Object.prototype.rowCnt = 1;
	Object.prototype.sprCnt = 1;
	Object.prototype.delay = 0;
	Object.prototype.val = 0;
}
/* 오브젝트 선언 */
const Loading = function(){
	this.init({idx:0, col:6, spr:12, x:"center", y:"center"});
	this.aniSet(3);
};
const Intro_bg = function(){
	this.x = 0;this.y = 0;
	this.w = 800;
	this.h = 530;
	this.cx = 0;this.cy = 0;this.cw = 800;this.ch = 530;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[1], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Intro_start_btn = function(){
	this.x = 600;
	this.y = 380;
	this.w = 177;
	this.h = 60;
	this.cy = 0;this.cw = 177;this.ch = 61;
	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 177;
			}
			else{
				this.cx = 0;
			}
			ctx.drawImage(cvs_Arr[2], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Intro_method_btn = function(){
	this.x = 600;
	this.y = 440;
	this.w = 177;
	this.h = 60;
	this.cy = 0;this.cw = 177;this.ch = 61;
	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 177;
			}
			else{
				this.cx = 0;
			}
			ctx.drawImage(cvs_Arr[3], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Intro_sound_btn = function(){
	this.x = 740;
	this.y = 5;
	this.w = 55;
	this.h = 55;
	this.cy = 0;this.cw = 71;this.ch = 70;
	this.draw = function(){
		try{ 
			if(volume){
				this.cx = 0;
			}
			else{
				this.cx = 71;
			}
			ctx.drawImage(cvs_Arr[4], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const White_layer = function(){
	this.appear = false;
	this.disappear = false;
	this.globalAlpha = 0.5;
	this.draw = function(){
		try{ 
			if(this.disappear){
				if(this.globalAlpha > 0){
					this.globalAlpha -= 0.05;
				}
				else{
					this.disappear = false;
				}
			}
			if(this.appear){
				if(this.globalAlpha < 0.5){
					this.globalAlpha += 0.05;
				}
				else{
					this.appear = false;
				}
			}
			if(this.globalAlpha > 0){
				ctx.save();
				ctx.globalAlpha = this.globalAlpha;
				ctx.beginPath();
				ctx.rect(0, 0, cvs.width, cvs.height);
				ctx.fillStyle = "#FFF";ctx.fill();			
				ctx.restore();
			}
		}
		catch(e){}
	};
};
const Method_bg = function(){
	this.w = 665;
	this.h = 400;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 665;this.ch = 400;
	this.active = false;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[5], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Method_content = function(){
	this.x = 80;
	this.y = 140;
	this.w = 609;
	this.h = 260;
	this.cx = 0;this.cw = 609;this.ch = 260;
	this.idx = 0;
	this.draw = function(){
		try{ 
			this.cy = this.idx * 260;
			ctx.drawImage(cvs_Arr[6], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Method_exit_btn = function(){
	this.x = 690;
	this.y = 40;
	this.w = 65;
	this.h = 65;
	this.cy = 0;this.cw = 75;this.ch = 72;
	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 75;
			}
			else{
				this.cx = 0;
			}
			ctx.drawImage(cvs_Arr[7], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Method_prev_btn = function(){
	this.x = 265;
	this.y = 410;
	this.w = 103;
	this.h = 46;
	this.cy = 0;this.cw = 103;this.ch = 46;
	this.mouseOver = false;
	this.active = false;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseOver){
					this.cx = 103;
				}
				else{
					this.cx = 0;
				}
			}
			else{
				this.cx = 206;
			}
			ctx.drawImage(cvs_Arr[8], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Method_next_btn = function(){
	this.x = 425;
	this.y = 410;
	this.w = 103;
	this.h = 46;
	this.cy = 0;this.cw = 103;this.ch = 46;
	this.mouseOver = false;
	this.active = false;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseOver){
					this.cx = 103;
				}
				else{
					this.cx = 0;
				}
			}
			else{
				this.cx = 206;
			}
			ctx.drawImage(cvs_Arr[9], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Method_dot = function(){
	this.x = 0;
	this.y = 430;
	this.w = 10;
	this.h = 9;
	this.cx = 0;this.cy = 0;this.cw = 11;this.ch = 10;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[10], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Green_layer = function(){
	this.globalAlpha = 0;
	this.draw = function(){
		try{ 
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.beginPath();
			ctx.rect(0, 0, cvs.width, cvs.height);
			ctx.fillStyle = "#00FF66";ctx.fill();			
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_bg = function(){
	this.x = 0;this.y = 0;
	this.w = 800;
	this.h = 500;
	this.cx = 0;this.cy = 0;this.cw = 800;this.ch = 500;
	this.idx = 0;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[this.idx+25], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Main_top = function(){
	this.x = 0;
	this.y = -8;
	this.w = 320;
	this.h = 65;
	this.cx = 0;this.cy = 0;this.cw = 320;this.ch = 65;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[12], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Main_bottom = function(){
	this.x = 520;
	this.y = 470;
	this.w = 268;
	this.h = 77;
	this.cx = 0;this.cy = 0;this.cw = 268;this.ch = 77;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[13], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Main_exit_btn = function(){
	this.x = 735;
	this.y = 5;
	this.w = 65;
	this.h = 65;
	this.cy = 0;this.cw = 75;this.ch = 72;
	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 75;
			}
			else{
				this.cx = 0;
			}
			ctx.drawImage(cvs_Arr[7], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Main_life = function(){
	this.x = 0;
	this.y = 10;
	this.w = 31;
	this.h = 28;
	this.cx = 0;this.cy = 0;this.cw = 31;this.ch = 28;
	this.active = true;
	this.draw = function(){
		try{ 
			if(this.active){
				ctx.drawImage(cvs_Arr[14], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
		}
		catch(e){}
	};
};
const Main_level = function(){
	this.x = 560;
	this.y = 495;
	this.w = 60;
	this.h = 25;
	this.cx = 0;this.cw = 60;this.ch = 25;
	this.active = true;
	this.draw = function(){
		try{ 
			this.cy = (level - 1) * 25;
			ctx.drawImage(cvs_Arr[15], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Main_score = function(){
	this.x = 0;
	this.y = 494;
	this.w = 20;
	this.h = 25;
	this.cy = 0;this.cw = 20;this.ch = 25;
	this.val = 0;
	this.draw = function(){
		try{ 
			this.cx = this.val * 20;
			ctx.drawImage(cvs_Arr[16], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Main_score_unit = function(){
	this.x = 730;
	this.y = 494;
	this.w = 24;
	this.h = 27;
	this.cx = 0;this.cy = 0;this.cw = 24;this.ch = 27;
	this.val = 0;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[17], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Select_bg = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 625;this.ch = 360;

	this.widthFin = 625;
	this.widthMax = this.widthFin * 1.1;
	this.ratio_WH = this.ch / this.cw;
	this.ratio_RE = 625 / 625;

	this.active = false;
	this.load = true;
	this.open = false;
	this.close = false;
	this.draw = function(){
		try{ 
			if(this.open){
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 20 * this.ratio_RE;
						this.h += 20 * this.ratio_RE * this.ratio_WH;
						this.x -= 10 * this.ratio_RE;
						this.y -= 10 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.widthFin = 625;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 10 * this.ratio_RE;
						this.h -= 10 * this.ratio_RE * this.ratio_WH;
						this.x += 5 * this.ratio_RE;
						this.y += 5 * this.ratio_WH;
					}	
					else{
						this.load = true;
						this.open = false;
						this.w = this.widthFin;
					}
				}
			}
			if(this.close){				
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 10 * this.ratio_RE;
						this.h += 10 * this.ratio_RE * this.ratio_WH;
						this.x -= 5 * this.ratio_RE;
						this.y -= 5 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.widthFin = 0;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 20 * this.ratio_RE;
						this.h -= 20 * this.ratio_RE * this.ratio_WH;
						this.x += 10 * this.ratio_RE;
						this.y += 10 * this.ratio_WH;
					}
					else{
						this.load = true;
						this.close = false;
						this.w = 0;this.h = 0;
						this.x = absWidth * 0.5 - this.w * 0.5;
						this.y = absHeight * 0.5 - this.h * 0.5;
						this.active = false;
					}
				}
			}
			ctx.drawImage(cvs_Arr[18], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Select_char_btn = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cw = 255;this.ch = 199;

	this.widthFin = 255;
	this.widthMax = this.widthFin * 1.1;
	this.ratio_WH = this.ch / this.cw;
	this.ratio_RE = 255 / 625;

	this.val = 0;
	this.active = false;
	this.load = true;
	this.open = false;
	this.close = false;
	this.draw = function(){
		try{ 
			if(this.active){this.cx = 255;}
			else{this.cx = 0;}
			this.cy = (this.val - 1) * 199;
 
			if(this.open){
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 20 * this.ratio_RE;
						this.h += 20 * this.ratio_RE * this.ratio_WH;
						if(this.val == 1){
							this.x -= 20 * this.ratio_RE;
						}
						else{
							this.x += 1 * this.ratio_RE;
						}
						this.y -= 10 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.widthFin = 255;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 10 * this.ratio_RE;
						this.h -= 10 * this.ratio_RE * this.ratio_WH;
						if(this.val == 1){
							this.x += 10 * this.ratio_RE;
						}
						else{
							this.x -= 0.5 * this.ratio_RE;
						}
						this.y += 5 * this.ratio_RE * this.ratio_WH;
					}	
					else{
						this.load = true;
						this.open = false;
						this.w = this.widthFin;
					}
				}
			}
			if(this.close){				
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 10 * this.ratio_RE;
						this.h += 10 * this.ratio_RE * this.ratio_WH;
						if(this.val == 1){
							this.x -= 10 * this.ratio_RE;
						}
						else{
							this.x += 0.5 * this.ratio_RE;
						}
						this.y -= 5 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.widthFin = 0;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 20 * this.ratio_RE;
						this.h -= 20 * this.ratio_RE *this.ratio_WH;
						if(this.val == 1){
							this.x += 20 * this.ratio_RE;
						}
						else{
							this.x -= 1 * this.ratio_RE;
						}
						this.y += 10 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = true;
						this.close = false;
						this.w = 0;this.h = 0;
						this.x = absWidth * 0.5 - this.w * 0.5;
						this.y = absHeight * 0.5 - this.h * 0.5;
					}
				}
			}
			ctx.drawImage(cvs_Arr[19], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Select_start_btn = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cy = 0;this.cw = 144;this.ch = 49;

	this.widthFin = 144;
	this.widthMax = this.widthFin * 1.1;
	this.ratio_WH = this.ch / this.cw;
	this.ratio_RE = 144 / 625;

	this.mouseOver = false;
	this.load = true;
	this.open = false;
	this.close = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 144;
			}
			else{
				this.cx = 0;
			}
			if(this.open){
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 20 * this.ratio_RE;
						this.h += 20 * this.ratio_RE * this.ratio_WH;
						this.x -= 10 * this.ratio_RE;
						this.y += 45 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.widthFin = 144;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 10 * this.ratio_RE;
						this.h -= 10 * this.ratio_RE * this.ratio_WH;
						this.x += 5 * this.ratio_RE;
						this.y -= 10 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = true;
						this.open = false;
						this.w = this.widthFin;
					}
				}

			}
			if(this.close){				
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 10 * this.ratio_RE;
						this.h += 10 * this.ratio_RE * this.ratio_WH;
						this.x -= 5 * this.ratio_RE;
						this.y += 10 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.widthFin = 0;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 20 * this.ratio_RE;
						this.h -= 20 * this.ratio_RE * this.ratio_WH;
						this.x += 10 * this.ratio_RE;
						this.y -= 45 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = true;
						this.close = false;
						this.w = 0;this.h = 0;
						this.x = absWidth * 0.5 - this.w * 0.5;
						this.y = absHeight * 0.5 - this.h * 0.5;
					}
				}
			}
			ctx.drawImage(cvs_Arr[20], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Level_bg = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 670;this.ch = 468;

	this.widthFin = 670;
	this.widthMax = this.widthFin * 1.1;
	this.ratio_WH = this.ch / this.cw;
	this.ratio_RE = 670 / 670;

	this.active = false;
	this.load = true;
	this.open = false;
	this.close = false;
	this.opened = false;
	this.closed = false;
	this.delay = 0;
	this.draw = function(){
		try{ 
			if(this.open){
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 20 * this.ratio_RE;
						this.h += 20 * this.ratio_RE * this.ratio_WH;
						this.x -= 10 * this.ratio_RE;
						this.y -= 10 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.widthFin = 670;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 10 * this.ratio_RE;
						this.h -= 10 * this.ratio_RE * this.ratio_WH;
						this.x += 5 * this.ratio_RE;
						this.y += 5 * this.ratio_WH;
					}	
					else{
						this.load = true;
						this.open = false;
						this.w = this.widthFin;
						this.opened = true;
					}
				}
			}
			if(this.close){				
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 10 * this.ratio_RE;
						this.h += 10 * this.ratio_RE * this.ratio_WH;
						this.x -= 5 * this.ratio_RE;
						this.y -= 5 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.widthFin = 0;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 20 * this.ratio_RE;
						this.h -= 20 * this.ratio_RE * this.ratio_WH;
						this.x += 10 * this.ratio_RE;
						this.y += 10 * this.ratio_WH;
					}
					else{
						this.load = true;
						this.close = false;
						this.active = false;
						this.closed = true;
					}
				}
			}
			ctx.drawImage(cvs_Arr[21], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Level_level = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cy = 0;this.cw = 191;this.ch = 191;

	this.widthFin = 150;
	this.widthMax = this.widthFin * 1.1;
	this.ratio_WH = this.ch / this.cw;
	this.ratio_RE = 150 / 670;

	this.load = true;
	this.open = false;
	this.close = false;
	this.idx = 0;
	this.val = 0;
	this.draw = function(){
		try{ 
			this.cx = this.val * 191;

			if(this.open){
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 20 * this.ratio_RE;
						this.h += 20 * this.ratio_RE * this.ratio_WH;
						if(this.idx == 0){
							this.x -= 30 * this.ratio_RE;
							this.y -= 12.5 * this.ratio_RE * this.ratio_WH;							
						}
						else if(this.idx == 1){
							this.x -= 10 * this.ratio_RE;
							this.y -= 12.5 * this.ratio_RE * this.ratio_WH;		
						}
						else if(this.idx == 2){
							this.x += 10 * this.ratio_RE;
							this.y -= 12.5 * this.ratio_RE * this.ratio_WH;		
						}
						else if(this.idx == 3){
							this.x -= 20 * this.ratio_RE;
							this.y += 5 * this.ratio_RE * this.ratio_WH;		
						}
						else if(this.idx == 4){
							this.y += 5 * this.ratio_RE * this.ratio_WH;		
						}
					}
					else{
						this.load = false;
						this.widthFin = 150;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 10 * this.ratio_RE;
						this.h -= 10 * this.ratio_RE * this.ratio_WH;
						this.x += 5 * this.ratio_RE;
						this.y += 5 * this.ratio_RE * this.ratio_WH;		
					}	
					else{
						this.load = true;
						this.open = false;
						this.w = this.widthFin;
					}
				}
			}
			if(this.close){				
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 10 * this.ratio_RE;
						this.h += 10 * this.ratio_RE * this.ratio_WH;
						this.x -= 5 * this.ratio_RE;
						this.y -= 5 * this.ratio_RE * this.ratio_WH;		
					}
					else{
						this.load = false;
						this.widthFin = 0;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 20 * this.ratio_RE;
						this.h -= 20 * this.ratio_RE * this.ratio_WH;
						if(this.idx == 0){
							this.x += 30 * this.ratio_RE;
							this.y += 12.5 * this.ratio_RE * this.ratio_WH;							
						}
						else if(this.idx == 1){
							this.x += 10 * this.ratio_RE;
							this.y += 12.5 * this.ratio_RE * this.ratio_WH;		
						}
						else if(this.idx == 2){
							this.x -= 10 * this.ratio_RE;
							this.y += 12.5 * this.ratio_RE * this.ratio_WH;		
						}
						else if(this.idx == 3){
							this.x += 20 * this.ratio_RE;
							this.y -= 5 * this.ratio_RE * this.ratio_WH;		
						}
						else if(this.idx == 4){
							this.y -= 5 * this.ratio_RE * this.ratio_WH;		
						}
					}
				}
			}
			ctx.drawImage(cvs_Arr[22], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Level_star = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 360;this.cy = 0;this.cw = 120;this.ch = 70;

	this.widthFin = 120;
	this.widthMax = this.widthFin * 1.1;
	this.ratio_WH = this.ch / this.cw;
	this.ratio_RE = 120 / 670;

	this.load = true;
	this.open = false;
	this.close = false;
	this.active = false;
	this.idx = 0;
	this.val = 0;
	this.draw = function(){
		try{ 
			if(this.open){
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 20 * this.ratio_RE;
						this.h += 20 * this.ratio_RE * this.ratio_WH;
						if(this.idx == 0){
							this.x -= 40 * this.ratio_RE;
							this.y -= 30 * this.ratio_RE * this.ratio_WH;							
						}
						else if(this.idx == 1){
							this.x -= 15 * this.ratio_RE;
							this.y -= 30 * this.ratio_RE * this.ratio_WH;		
						}
						else if(this.idx == 2){
							this.x += 10 * this.ratio_RE;
							this.y -= 30 * this.ratio_RE * this.ratio_WH;		
						}
						else if(this.idx == 3){
							this.x -= 27.5 * this.ratio_RE;
							this.y += 10 * this.ratio_RE * this.ratio_WH;		
						}
						else if(this.idx == 4){
							this.x -= 2.5 * this.ratio_RE;
							this.y += 10 * this.ratio_RE * this.ratio_WH;		
						}
					}
					else{
						this.load = false;
						this.widthFin = 120;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 10 * this.ratio_RE;
						this.h -= 10 * this.ratio_RE * this.ratio_WH;
						this.x += 5 * this.ratio_RE;
						this.y += 5 * this.ratio_RE * this.ratio_WH;		
					}	
					else{
						this.load = true;
						this.open = false;
						this.w = this.widthFin;
					}
				}
			}
			if(this.close){				
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 10 * this.ratio_RE;
						this.h += 10 * this.ratio_RE * this.ratio_WH;
						this.x -= 5 * this.ratio_RE;
						this.y -= 5 * this.ratio_RE * this.ratio_WH;		
					}
					else{
						this.load = false;
						this.widthFin = 0;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 20 * this.ratio_RE;
						this.h -= 20 * this.ratio_RE * this.ratio_WH;
						if(this.idx == 0){
							this.x += 40 * this.ratio_RE;
							this.y += 30 * this.ratio_RE * this.ratio_WH;							
						}
						else if(this.idx == 1){
							this.x += 15 * this.ratio_RE;
							this.y += 30 * this.ratio_RE * this.ratio_WH;		
						}
						else if(this.idx == 2){
							this.x -= 10 * this.ratio_RE;
							this.y += 30 * this.ratio_RE * this.ratio_WH;		
						}
						else if(this.idx == 3){
							this.x += 27.5 * this.ratio_RE;
							this.y -= 10 * this.ratio_RE * this.ratio_WH;		
						}
						else if(this.idx == 4){
							this.x += 2.5 * this.ratio_RE;
							this.y -= 10 * this.ratio_RE * this.ratio_WH;		
						}
					}
				}
			}
			if(this.active){
				ctx.drawImage(cvs_Arr[68], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
		}
		catch(e){}
	};
};
const Level_alert = function(){
	this.w = 800;
	this.h = 120;
	this.x = -800;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cw = 800;this.ch = 120;

	this.active = false;
	this.val = 0;
	this.delay = 0;
	this.open = true;
	this.load = false;
	this.draw = function(){
		try{ 
			this.cy = (this.val - 1) * 120;
			if(this.open){
				if(this.x < 0){
					this.x += 20;
				}
				else{
					this.open = false;
				}
			}
			else{
				this.delay++;
				if(this.delay > 60){
					this.x += 20;
				}
				if(this.x > absWidth){
					this.delay = 0;
					this.open = true;
					this.active = false;
					this.load = true;
					this.x = -800;
				}
			}
			ctx.drawImage(cvs_Arr[23], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const ReadyGo = function(){
	this.w = 201;
	this.h = 89;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cw = 201;this.ch = 89;

	this.active = false;
	this.ani = 0;
	this.halfload = false;
	this.load = false;
	this.draw = function(){
		try{ 
			this.ani++;
			this.cx = Math.floor(this.ani / 5)%5 * 201;
			this.cy = Math.floor(this.ani / 25) * 89;
			if(this.ani == 60){
				this.halfload = true;
			}
			if(this.ani > 124){
				this.ani = 0;
				this.active = false;
				this.load = true;
			}
			ctx.drawImage(cvs_Arr[24], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Player = function() {
	this.isLeft = false;
	this.isRight = false;
	this.isMovingLeft = false;
	this.isMovingRight = false;
	this.jumpSet = false;
	this.isJump = false;
	this.isDead = false;
	this.isReached = false;
	this.isControl = false;
	this.hit = false;
	this.hitAni = true;
	this.hitCnt = 0;
	this.appear = false;
	this.globalAlpha = 0;
	this.vx = 4;	
	this.vy = 0;
	this.gravity = 0;
	this.w = 112;
	this.h = 158;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 300;
	this.cw = 112;this.ch = 158;
	
	this.ani = 0;
	this.draw = function() {		
		try{
			if(this.isJump){
				if(this.isLeft){
					this.ani++;
					this.cx = Math.floor(this.ani / 4)%12 * 112;
					this.cy = 632;
				}
				else if(this.isRight){
					this.ani++;
					this.cx = Math.floor(this.ani / 4)%12 * 112;
					this.cy = 158;
				}
				if(this.ani > 47){
					this.isJump = false;
					this.isMoving = false;
				}
			}
			else{
				if(this.isMoving){
					this.ani++;
					this.cx = Math.floor(this.ani / 4)%11 * 112;
					if(this.isLeft){
						this.cy = 474;
					}
					else if(this.isRight){
						this.cy = 0;
					}
				}
				else{
					if(this.isLeft){
						this.cx = 112;
						this.cy = 790;
					}
					else if(this.isRight){
						this.cx = 112;
						this.cy = 316;
					}
					else{
						this.cx = 0;
						this.cy = 316;
					}
				}
			}
			if(this.appear){
				if(this.globalAlpha < 1){
					this.globalAlpha += 0.05;
				}
				else{
					this.appear = false;
				}
			}
			if(this.hit){
				if(this.hitAni){
					if(this.globalAlpha > 0.2){ 
						this.globalAlpha -= 0.04;
					}
					else{
						this.globalAlpha = 0.2;
						this.hitAni = false;
					}
				}
				else{
					if(this.globalAlpha < 1){
						this.globalAlpha += 0.04;
					}
					else{
						this.globalAlpha = 1;
						this.hitAni = true;
						this.hitCnt++;
						if(this.hitCnt > 1){
							this.hitCnt = 0;
							this.hit = false;
						}
					}
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			if(gender == 1){
				ctx.drawImage(cvs_Arr[32], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);	
			}
			else{
				ctx.drawImage(cvs_Arr[33], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}		
			ctx.restore();
		}
		catch(e){}			
	};
};
const Platform = function() {
	this.x = 0;
	this.y = 0;//그리는값
	this.ytmp = 0;//실제값
	this.w = 0;this.h = 0;
	this.cx = 0;this.cy = 0;this.cw = 0;this.ch = 0;
	this.vx = 2;
	this.vy = 2;
	this.isBreak = false;
	this.hadItem = false;
	this.breakCnt = 0;
	this.onSet = false;
	this.type = 0;
	this.ani = 0;
	this.active = true;
	this.init = function(){
		if(this.type == 0){
			this.w = 188;
			this.h = 53;
			this.cw = 188;
			this.ch = 53;
		}
		else if(this.type == 1){
			this.w = 183;
			this.h = 63;
			this.cw = 183;
			this.ch = 63;
		}
		else if(this.type == 2){
			this.w = 164;
			this.h = 79;
			this.cw = 164;
			this.ch = 79;
		}
		else if(this.type == 3){
			this.w = 173;
			this.h = 56;
			this.cw = 173;
			this.ch = 56;
		}
		else if(this.type == 4){
			this.w = 168;
			this.h = 90;
			this.cw = 168;
			this.ch = 90;
		}
		else if(this.type == 5){
			this.w = 169;
			this.h = 56;
			this.cw = 169;
			this.ch = 56;
		}
		else if(this.type == 6){
			this.w = 173;
			this.h = 57;
			this.cw = 173;
			this.ch = 57;
		}
		else if(this.type == 7){
			this.w = 187;
			this.h = 74;
			this.cw = 187;
			this.ch = 74;
		}
		else if(this.type == 8){
			this.w = 230;
			this.h = 78;
			this.cw = 230;
			this.ch = 78;
		}
		else if(this.type == 9){
			this.w = 381;
			this.h = 223;
			this.cw = 381;
			this.ch = 223;
		}
	}
	this.draw = function() {		
		try{
			if(this.active){
				ctx.drawImage(cvs_Arr[this.type + 34], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);		
			}
		}
		catch(e){}			
	};
};
const StartLine = function(){
	this.y = 458;
	this.active = true;
}
const Item = function() {
	this.x = 0;
	this.y = 0;
	this.w = 0;this.h = 0;
	this.cx = 0;this.cy = 0;this.cw = 0;this.ch = 0;
	this.onSet = false;
	this.type = 0;
	this.active = false;
	this.init = function(){
		if(this.type == 0){
			this.w = 83;
			this.h = 65;
			this.cx = 0;
			this.cy = 0;
			this.cw = 83;
			this.ch = 65;
		}
		else if(this.type == 1){
			this.w = 83;
			this.h = 65;
			this.cx = 83;
			this.cy = 0;
			this.cw = 83;
			this.ch = 65;
		}
		else if(this.type == 2){
			this.w = 83;
			this.h = 65;
			this.cx = 166;
			this.cy = 0;
			this.cw = 83;
			this.ch = 65;
		}
		else if(this.type == 3){
			this.w = 83;
			this.h = 65;
			this.cx = 249;
			this.cy = 0;
			this.cw = 83;
			this.ch = 65;
		}
		else if(this.type == 4){
			this.w = 83;
			this.h = 65;
			this.cx = 332;
			this.cy = 0;
			this.cw = 83;
			this.ch = 65;
		}
		else if(this.type == 5){
			this.w = 51;
			this.h = 62;
			this.cx = 0;
			this.cy = 65;
			this.cw = 51;
			this.ch = 62;
		}
		else if(this.type == 6){
			this.w = 51;
			this.h = 62;
			this.cx = 51;
			this.cy = 65;
			this.cw = 51;
			this.ch = 62;
		}
		else if(this.type == 7){
			this.w = 51;
			this.h = 62;
			this.cx = 102;
			this.cy = 65;
			this.cw = 51;
			this.ch = 62;
		}
		this.active = true;
	}
	this.draw = function() {		
		try{
			if(this.active){
				ctx.drawImage(cvs_Arr[44], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
		}
		catch(e){}			
	};
};
const Item_eff = function() {
	this.x = 0;
	this.y = 0;
	this.w = 180;
	this.h = 180
	this.cw = 180;this.ch = 180;
	this.active = false;
	this.ani = 0;
	this.draw = function() {		
		try{
			this.ani++;
			if(this.ani >= 24){
				this.ani = 0;
				this.active = false;
			}
			this.cx = Math.floor(this.ani / 3) % 4 * 180;
			this.cy = Math.floor(this.ani / 12) * 180;
			ctx.drawImage(cvs_Arr[71], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}			
	};
};
const Enemy = function() {
	this.x = 0;
	this.y = 0;
	this.w = 0;this.h = 0;
	this.cx = 0;this.cy = 0;this.cw = 0;this.ch = 0;
	this.vx = 1;
	this.onSet = false;
	this.type = 0;
	this.ani = 0;
	this.active = false;
	this.isLeft = false;
	this.isRight = true;
	this.init = function(){
		if(this.type == 0){
			this.w = 68;
			this.h = 57;
			this.cw = 68;
			this.ch = 57;
		}
		else if(this.type == 1){
			this.w = 65;
			this.h = 63;
			this.cw = 65;
			this.ch = 63;
		}
		else if(this.type == 2){
			this.w = 80;
			this.h = 58;
			this.cw = 80;
			this.ch = 58;
		}
		this.active = true;
	}
	this.draw = function() {		
		try{
			if(this.active){
				this.ani++;
				if(this.type == 0){
					this.cx = Math.floor(this.ani / 4) % 9 * 68;
					if(this.isLeft){
						this.cy = 0;
					}
					else if(this.isRight){
						this.cy = 57;
					}
					if(this.ani > 35){
						this.ani = 0;
					}
				}
				else if(this.type == 1){
					this.cx = Math.floor(this.ani / 4) % 7 * 65;
					if(this.isLeft){
						this.cy = 0;
					}
					else if(this.isRight){
						this.cy = 63;
					}
					if(this.ani > 27){
						this.ani = 0;
					}
				}
				else if(this.type == 2){
					this.cx = Math.floor(this.ani / 4) % 7 * 80;
					if(this.isLeft){
						if(this.ani < 28){
							this.cy = 116;
						}
						else{
							this.cy = 174;
						}
					}
					else if(this.isRight){
						if(this.ani < 28){
							this.cy = 0;
						}
						else{
							this.cy = 58;
						}
					}
					if(this.ani > 55){
						this.ani = 0;
					}
				}
				ctx.drawImage(cvs_Arr[this.type + 45], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);		
			}
		}
		catch(e){}			
	};
};
const Exit_bg = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 664;this.ch = 234;

	this.widthFin = 664;
	this.widthMax = this.widthFin * 1.1;
	this.ratio_WH = this.ch / this.cw;
	this.ratio_RE = 664 / 664;

	this.active = false;
	this.load = true;
	this.open = false;
	this.close = false;
	this.draw = function(){
		try{ 
			if(this.open){
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 20 * this.ratio_RE;
						this.h += 20 * this.ratio_RE * this.ratio_WH;
						this.x -= 10 * this.ratio_RE;
						this.y -= 10 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.widthFin = 664;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 10 * this.ratio_RE;
						this.h -= 10 * this.ratio_RE * this.ratio_WH;
						this.x += 5 * this.ratio_RE;
						this.y += 5 * this.ratio_WH;
					}	
					else{
						this.load = true;
						this.open = false;
						this.w = this.widthFin;
					}
				}
			}
			if(this.close){				
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 10 * this.ratio_RE;
						this.h += 10 * this.ratio_RE * this.ratio_WH;
						this.x -= 5 * this.ratio_RE;
						this.y -= 5 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.widthFin = 0;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 20 * this.ratio_RE;
						this.h -= 20 * this.ratio_RE * this.ratio_WH;
						this.x += 10 * this.ratio_RE;
						this.y += 10 * this.ratio_WH;
					}
					else{
						this.load = true;
						this.close = false;
						this.w = 0;this.h = 0;
						this.x = absWidth * 0.5 - this.w * 0.5;
						this.y = absHeight * 0.5 - this.h * 0.5;
						this.active = false;
					}
				}
			}
			ctx.drawImage(cvs_Arr[48], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Exit_cont_btn = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cy = 0;this.cw = 143;this.ch = 50;

	this.widthFin = 143;
	this.widthMax = this.widthFin * 1.1;
	this.ratio_WH = this.ch / this.cw;
	this.ratio_RE = 143 / 664;

	this.mouseOver = false;
	this.load = true;
	this.open = false;
	this.close = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 143;
			}
			else{
				this.cx = 0;
			}
			if(this.open){
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 20 * this.ratio_RE;
						this.h += 20 * this.ratio_RE * this.ratio_WH;
						this.x -= 20 * this.ratio_RE;
						this.y += 20 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.widthFin = 143;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 10 * this.ratio_RE;
						this.h -= 10 * this.ratio_RE * this.ratio_WH;
						this.x += 10 * this.ratio_RE;
						this.y -= 10 * this.ratio_RE * this.ratio_WH;
					}	
					else{
						this.load = true;
						this.open = false;
						this.w = this.widthFin;
					}
				}
			}
			if(this.close){				
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 10 * this.ratio_RE;
						this.h += 10 * this.ratio_RE * this.ratio_WH;
						this.x -= 10 * this.ratio_RE;
						this.y += 10 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.widthFin = 0;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 20 * this.ratio_RE;
						this.h -= 20 * this.ratio_RE *this.ratio_WH;
						this.x += 20 * this.ratio_RE;
						this.y -= 20 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = true;
						this.close = false;
						this.w = 0;this.h = 0;
						this.x = absWidth * 0.5 - this.w * 0.5;
						this.y = absHeight * 0.5 - this.h * 0.5;
					}
				}
			}
			ctx.drawImage(cvs_Arr[49], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Exit_exit_btn = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cy = 0;this.cw = 143;this.ch = 50;

	this.widthFin = 143;
	this.widthMax = this.widthFin * 1.1;
	this.ratio_WH = this.ch / this.cw;
	this.ratio_RE = 143 / 664;

	this.mouseOver = false;
	this.load = true;
	this.open = false;
	this.close = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 143;
			}
			else{
				this.cx = 0;
			}
			if(this.open){
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 20 * this.ratio_RE;
						this.h += 20 * this.ratio_RE * this.ratio_WH;
						this.x += 1 * this.ratio_RE;
						this.y += 20 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.widthFin = 143;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 10 * this.ratio_RE;
						this.h -= 10 * this.ratio_RE * this.ratio_WH;
						this.x -= 1 * this.ratio_RE;
						this.y -= 10 * this.ratio_RE * this.ratio_WH;
					}	
					else{
						this.load = true;
						this.open = false;
						this.w = this.widthFin;
					}
				}
			}
			if(this.close){				
				if(this.load){
					if(this.w < this.widthMax){
						this.w += 10 * this.ratio_RE;
						this.h += 10 * this.ratio_RE * this.ratio_WH;
						this.x -= 1 * this.ratio_RE;
						this.y += 10 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.widthFin = 0;
					}
				}
				else{
					if(this.w > this.widthFin){
						this.w -= 20 * this.ratio_RE;
						this.h -= 20 * this.ratio_RE *this.ratio_WH;
						this.x += 1 * this.ratio_RE;
						this.y -= 20 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = true;
						this.close = false;
						this.w = 0;this.h = 0;
						this.x = absWidth * 0.5 - this.w * 0.5;
						this.y = absHeight * 0.5 - this.h * 0.5;
					}
				}
			}
			ctx.drawImage(cvs_Arr[50], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Over_bg = function(){	
	this.w = 665;
	this.h = 322;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 665;this.ch = 322;

	this.active = false;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[51], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Over_home_btn = function(){
	this.w = 144;
	this.h = 51;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 365;
	this.cy = 0;this.cw = 144;this.ch = 51;

	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 144;
			}
			else{
				this.cx = 0;
			}
			ctx.drawImage(cvs_Arr[52], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Over_score = function(){
	this.x = 420;
	this.y = 310;
	this.draw = function(){
		try{ 
			ctx.font = "bold "+(30 * hR)+"px '나눔스퀘어'";ctx.fillStyle = "#CC3300";ctx.textAlign = "center";
			ctx.fillText(score, this.x * wR, this.y * hR);
		}
		catch(e){}
	};
};
const Quiz_bg = function(){	
	this.w = 389;
	this.h = 393;
	this.x = 50;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 389;this.ch = 393;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.draw = function(){
		try{ 
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
				}
				else{
					this.active = false;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[53], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_hint_btn = function(){	
	this.w = 61;
	this.h = 43;
	this.x = 375;
	this.y = 150;
	this.cx = 0;this.cy = 0;this.cw = 61;this.ch = 43;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[54], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_close_btn = function(){	
	this.w = 103;
	this.h = 46;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 325;
	this.cx = 0;this.cy = 0;this.cw = 103;this.ch = 46;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[67], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_o_btn = function(){	
	this.w = 58;
	this.h = 58;
	this.x = 150;
	this.y = 200;
	this.cx = 0;this.cy = 0;this.cw = 58;this.ch = 58;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[55], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_x_btn = function(){	
	this.w = 64;
	this.h = 58;
	this.x = 250;
	this.y = 200;
	this.cx = 0;this.cy = 0;this.cw = 64;this.ch = 58;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[56], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_time = function(){	
	this.w = 161;
	this.h = 64;
	this.x = 620;
	this.y = 260;
	this.cx = 0;this.cy = 0;this.cw = 161;this.ch = 64;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[57], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_time_num = function(){	
	this.w = 30;
	this.h = 33;
	this.x = 695;
	this.y = 275;
	this.cy = 0;this.cw = 30;this.ch = 33;
	this.val = 9;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
			this.cx = this.val * 30;
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[58], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_content = function(){
	this.x = 100;
	this.y = 150;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.textAlign = "left";ctx.fillStyle = "#000";ctx.font = "bold "+(15 * hR)+"px '나눔스퀘어'";
			let txt = quiz_arr[quizIdx-1][0].split("\n");
			for(let i=0;i<txt.length;i++){				
				ctx.fillText(txt[i], this.x * wR, (this.y + i * 20) * hR);
			}
			ctx.restore();
		}
		catch(e){}
	};
};
const Hint_bg = function(){	
	this.w = 434;
	this.h = 387;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 434;this.ch = 387;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.draw = function(){
		try{ 
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
				}
				else{
					this.active = false;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[59], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Hint_content = function(){
	this.x = 235;
	this.y = 220;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.textAlign = "left";ctx.fillStyle = "#000";ctx.font = "bold "+(25 * hR)+"px '나눔스퀘어'";
			let txt = quiz_arr[quizIdx-1][2].split("\n");
			for(let i=0;i<txt.length;i++){				
				ctx.fillText(txt[i], this.x * wR, (this.y + i * 30) * hR);
			}
			ctx.restore();
		}
		catch(e){}
	};
};
const Success_bg = function(){	
	this.w = 662;
	this.h = 382;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 25;
	this.cx = 0;this.cy = 0;this.cw = 662;this.ch = 382;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.draw = function(){
		try{ 
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
				}
				else{
					this.active = false;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[60], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Success_level = function(){	
	this.w = 71;
	this.h = 29;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 270;
	this.cy = 0;this.cw = 71;this.ch = 29;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
			this.cx = (level - 1) * 71;
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[61], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Success_score= function(){
	this.x = 400;
	this.y = 325;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.textAlign = "center";ctx.fillStyle = "#cc3300";ctx.font = "bold "+(25 * hR)+"px '나눔스퀘어'";		
			ctx.fillText(score, this.x * wR, this.y * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Success_next_btn = function(){	
	this.w = 144;
	this.h = 49;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 345;
	this.cx = 0;this.cy = 0;this.cw = 144;this.ch = 49;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[62], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_layer = function(){
	this.appear = false;
	this.globalAlpha = 0;
	this.draw = function(){
		try{ 
			if(this.appear){
				if(this.globalAlpha < 0.5){
					this.globalAlpha += 0.05;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.beginPath();
			ctx.rect(0, 0, cvs.width, cvs.height);
			ctx.fillStyle = "#FFF";ctx.fill();			
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_panel = function(){
	this.w = 800;
	this.h = 120;
	this.x = -800;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 800;this.ch = 120;

	this.active = false;
	this.val = 0;
	this.delay = 0;
	this.open = true;
	this.load = false;
	this.draw = function(){
		try{ 
			if(this.open){
				if(this.x < 0){
					this.x += 20;
				}
				else{
					this.open = false;
				}
			}
			else{
				this.delay++;
				if(this.delay > 120){
					this.x += 20;
				}
				if(this.x > absWidth){
					this.delay = 0;
					this.open = true;
					this.active = false;
					this.load = true;
				}
			}
			ctx.drawImage(cvs_Arr[63], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Quiz_result = function(){	
	this.w = 620;
	this.h = 74;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cw = 620;this.ch = 74;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.delay = 0;
	this.delay2 = 0;
	this.val = 0;
	this.draw = function(){
		try{ 
			this.cy = this.val * 74;
			this.delay++;
			if(this.delay > 50){
				if(this.appear){
					if(this.globalAlpha < 0.95){
						this.globalAlpha += 0.05;
					}
					else{
						this.delay2++;
						if(this.delay2 > 50){
							this.appear = false;
							this.delay2 = 0;
						}
					}
				}
				else{
					if(this.globalAlpha > 0.05){
						this.globalAlpha -= 0.05;
					}
					else{
						this.delay = 0;
					}
				}
				ctx.save();
				ctx.globalAlpha = this.globalAlpha;
				ctx.drawImage(cvs_Arr[64], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				ctx.restore();
			}
		}
		catch(e){}
	};
};
const Quiz_result_o = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 307;this.ch = 307;

	this.widthFin = 307;
	this.widthMax = this.widthFin * 1.1;
	this.ratio_WH = this.ch / this.cw;
	this.ratio_RE = 307 / 307;

	this.active = false;
	this.load = true;
	this.open = false;
	this.close = false;
	this.delay = 0;
	this.delay2 = 0;
	this.draw = function(){
		try{ 
			this.delay++;
			if(this.delay > 40){
				if(this.open){
					if(this.load){
						if(this.w < this.widthMax){
							this.w += 14 * this.ratio_RE;
							this.h += 14 * this.ratio_RE * this.ratio_WH;
							this.x -= 7 * this.ratio_RE;
							this.y -= 7 * this.ratio_RE * this.ratio_WH;
						}
						else{
							this.load = false;
							this.widthFin = 307;
						}
					}
					else{
						if(this.w > this.widthFin){
							this.w -= 2 * this.ratio_RE;
							this.h -= 2 * this.ratio_RE * this.ratio_WH;
							this.x += 1 * this.ratio_RE;
							this.y += 1 * this.ratio_WH;
						}	
						else{
							this.delay2++;
							if(this.delay2 > 70){
								this.load = true;
								this.open = false;
								this.w = this.widthFin;
								this.delay2 = 0;
								this.close = true;
							}						
						}
					}
				}
				if(this.close){				
					if(this.load){
						if(this.w < this.widthMax){
							this.w += 2 * this.ratio_RE;
							this.h += 2 * this.ratio_RE * this.ratio_WH;
							this.x -= 1 * this.ratio_RE;
							this.y -= 1 * this.ratio_RE * this.ratio_WH;
						}
						else{
							this.load = false;
							this.widthFin = 0;
						}
					}
					else{
						if(this.w > this.widthFin){
							this.w -= 14 * this.ratio_RE;
							this.h -= 14 * this.ratio_RE * this.ratio_WH;
							this.x += 7 * this.ratio_RE;
							this.y += 7 * this.ratio_WH;
						}
						else{
							this.load = true;
							this.close = false;
							this.w = 0;this.h = 0;
							this.x = absWidth * 0.5 - this.w * 0.5;
							this.y = absHeight * 0.5 - this.h * 0.5;
							this.active = false;
							this.delay = 0;
						}
					}
				}
			}
			ctx.drawImage(cvs_Arr[65], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Quiz_result_x = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 296;this.ch = 266;

	this.widthFin = 296;
	this.widthMax = this.widthFin * 1.1;
	this.ratio_WH = this.ch / this.cw;
	this.ratio_RE = 296 / 296;

	this.active = false;
	this.load = true;
	this.open = false;
	this.close = false;
	this.delay = 0;
	this.delay2 = 0;
	this.draw = function(){
		try{ 
			this.delay++;
			if(this.delay > 40){
				if(this.open){
					if(this.load){
						if(this.w < this.widthMax){
							this.w += 14 * this.ratio_RE;
							this.h += 14 * this.ratio_RE * this.ratio_WH;
							this.x -= 7 * this.ratio_RE;
							this.y -= 7 * this.ratio_RE * this.ratio_WH;
						}
						else{
							this.load = false;
							this.widthFin = 296;
						}
					}
					else{
						if(this.w > this.widthFin){
							this.w -= 2 * this.ratio_RE;
							this.h -= 2 * this.ratio_RE * this.ratio_WH;
							this.x += 1 * this.ratio_RE;
							this.y += 1 * this.ratio_WH;
						}	
						else{
							this.delay2++;
							if(this.delay2 > 70){
								this.load = true;
								this.open = false;
								this.w = this.widthFin;
								this.delay2 = 0;
								this.close = true;
							}						
						}
					}
				}
				if(this.close){				
					if(this.load){
						if(this.w < this.widthMax){
							this.w += 2 * this.ratio_RE;
							this.h += 2 * this.ratio_RE * this.ratio_WH;
							this.x -= 1 * this.ratio_RE;
							this.y -= 1 * this.ratio_RE * this.ratio_WH;
						}
						else{
							this.load = false;
							this.widthFin = 0;
						}
					}
					else{
						if(this.w > this.widthFin){
							this.w -= 14 * this.ratio_RE;
							this.h -= 14 * this.ratio_RE * this.ratio_WH;
							this.x += 7 * this.ratio_RE;
							this.y += 7 * this.ratio_WH;
						}
						else{
							this.load = true;
							this.close = false;
							this.w = 0;this.h = 0;
							this.x = absWidth * 0.5 - this.w * 0.5;
							this.y = absHeight * 0.5 - this.h * 0.5;
							this.active = false;
							this.delay = 0;
						}
					}
				}
			}
			ctx.drawImage(cvs_Arr[66], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Clear_bg = function(){
	this.w = 685;
	this.h = 372;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 685;this.ch = 372;
	this.active = false;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[69], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Clear_home_btn = function(){
	this.w = 137;
	this.h = 45;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 380;
	this.cy = 0;this.cw = 137;this.ch = 45;
	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 137;
			}
			else{
				this.cx = 0;
			}
			ctx.drawImage(cvs_Arr[70], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Clear_content = function(){
	this.x = 400;
	this.y = 275;
	this.draw = function(){
		try{ 
			ctx.textAlign = "center";	
			if(loggedIn){
				ctx.font = "bold "+(20 * hR)+"px '나눔스퀘어'";ctx.fillStyle = "#000";
				ctx.fillText(userId+"님!!", this.x * wR, this.y * hR);
				ctx.fillText("게임 '헌법맨'을 완료하였습니다.", this.x * wR, (this.y + 30) * hR);
				ctx.fillText("축하합니다!", this.x * wR, (this.y + 60) * hR);
			}
			else{
				ctx.font = "bold "+(17 * hR)+"px '나눔스퀘어'";ctx.fillStyle = "#bcbcbc";
				ctx.fillText("어린이 헌법재판소 사이트에 회원으로 가입하시면", this.x * wR, this.y * hR);
				ctx.fillText("다양한 콘텐츠를 체계적으로 즐길 수 있습니다.", this.x * wR, (this.y + 20) * hR);
				ctx.fillStyle = "#000";
				ctx.fillText("회원 가입 후에 다시 도전해보세요!", this.x * wR, (this.y + 45) * hR);
			}
		}
		catch(e){}
	};
};
const Mobile_left_btn = function(){
	this.init({idx:72, x:20, y:400});
};
const Mobile_right_btn = function(){
	this.init({idx:73, x:150, y:400});
};
const Mobile_jump_btn = function(){
	this.init({idx:74, x:620, y:300});
};
let intro_start_btn = new Object(),
	intro_method_btn = new Object(),
	intro_sound_btn = new Object(),
	white_layer = new Object(),
	method_bg = new Object(),
	method_content = new Object(),
	method_exit_btn = new Object(),
	method_prev_btn = new Object(),
	method_next_btn = new Object(),
	green_layer = new Object();
let main_exit_btn = new Object(),
	select_bg = new Object(),
	select_male_btn = new Object(),
	select_female_btn = new Object(),
	select_start_btn = new Object(),
	level_bg = new Object(),
	level_arr = new Array(),
	level_star_arr = new Array(),
	player = new Object(),
	exit_bg = new Object(),
	exit_cont_btn = new Object(),
	exit_exit_btn = new Object(),
	over_bg = new Object(),
	over_home_btn = new Object(),
	over_score = new Object(),
	quiz_bg = new Object(),
	quiz_hint_btn = new Object(),
	quiz_o_btn = new Object(),
	quiz_x_btn = new Object(),
	quiz_time = new Object(),
	quiz_time_num = new Object(),
	quiz_content = new Object(),
	hint_bg = new Object(),
	hint_content = new Object(),
	success_bg = new Object(),
	success_level = new Object(),
	success_score = new Object(),
	success_next_btn = new Object(),
	quiz_close_btn = new Object(),
	quiz_layer = new Object(),
	quiz_panel = new Object(),
	quiz_result = new Object(),
	quiz_result_o = new Object(),
	quiz_result_x = new Object(),
	clear_bg = new Object(),
	clear_content = new Object(),
	clear_home_btn = new Object(),
	mobile_left_btn = new Object(),
	mobile_right_btn = new Object(),
	mobile_jump_btn = new Object();
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
let gender = 1;																					// 남자:1 여자:2 (디폴트 1)
let CONST_LIFE = 5;																				// 시작 목숨 (5고정)
let life = 5;																					// 목숨
let level = 0;																					// 레벨
let score = 0;																					// 현재 점수
let score_tmp = 0;																				// 올라갈 점수
let gameStart = false;																			// 인트로->메인 여부
let stageSet = true;
let quizSubmit = false;
let quizIdx = 0;
let quizInterval = new Object();																// 퀴즈 시간 인터벌
let quizTime = 9;																				// 퀴즈 시간 9초
let quiz_arr = [
	["우리나라 헌법은 1948년 7월 17일\n처음 만들어졌다.", 1, ""],
	["헌법재판소는 국민의 기본권을 보장하고\n권력을 가진 기관을 통제하는 역할을\n한다.", 1, ""],
	["헌법이 처음 만들어진 날을 기념하기\n위해 매년 7월 17일을 기념일로 정하고\n있는데, 이날을 제헌절이라고 한다.", 1, ""],
	["대한민국 헌법 제1조에 의하면\n대한민국의 주권은 국민에게 있다.", 1, ""],
	["헌법소원은 인터넷을 통해서도\n청구할 수 있다.", 1, ""],
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
	let intro_bg = new Intro_bg();	
	let method_dot = new Method_dot();
	(function(){
		intro_start_btn = new Intro_start_btn();
		intro_method_btn = new Intro_method_btn();
		intro_sound_btn = new Intro_sound_btn();
		white_layer = new White_layer();
		method_bg = new Method_bg();
		method_content = new Method_content();
		method_exit_btn = new Method_exit_btn();
		method_prev_btn = new Method_prev_btn();
		method_next_btn = new Method_next_btn();
		green_layer = new Green_layer();
	})();	
	function methodPopupFunc(){
		method_dot.x = (373 + method_content.idx * 13);
		if(method_content.idx < 1){
			method_prev_btn.active = false;
			method_next_btn.active = true;
		}
		else if(method_content.idx > 2){
			method_prev_btn.active = true;
			method_next_btn.active = false;
		}
		else{
			method_prev_btn.active = true;
			method_next_btn.active = true;
		}
	}
	function gameStartFunc(){
		if(gameStart){
			if(green_layer.globalAlpha < 0.95){
				green_layer.globalAlpha += 0.05;
			}
			else{
				introLoop = function(){return;}
				main();
			}
		}
	}
	function draw(){	
		intro_bg.draw();
		intro_start_btn.draw();
		intro_method_btn.draw();
		intro_sound_btn.draw();
		if(method_bg.active){
			white_layer.draw();
			method_bg.draw();
			method_content.draw();
			method_exit_btn.draw();
			method_prev_btn.draw();
			method_next_btn.draw();
			method_dot.draw();
		}
		if(gameStart){
			green_layer.draw();
		}
	}
	introLoop = function(){
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		methodPopupFunc();
		gameStartFunc();
		draw();
		requestAnimFrame(introLoop);
	};
	introLoop();
}
function main(){
	pageType = "main";	
	let bgIdx = 0;
	let reachedPlatformIdx = 0;
	let objDown = false;

	let main_top = new Main_top();
	let main_bottom = new Main_bottom();
	let main_level = new Main_level();
	let main_score_unit = new Main_score_unit();
	let level_alert = new Level_alert();
	let readyGo = new ReadyGo();
	let item = new Item();
	let item_eff = new Item_eff();
	let enemy = new Enemy();
	let startLine = new StartLine();
	let main_bg_arr = new Array();
	let life_arr = new Array();
	let score_arr = new Array();
	let platform_arr = new Array();
	(function(){
		main_exit_btn = new Main_exit_btn();
		select_bg = new Select_bg();
		select_male_btn = new Select_char_btn();
		select_female_btn = new Select_char_btn();
		select_start_btn = new Select_start_btn();
		level_bg = new Level_bg();
		level_arr = new Array();
		level_star_arr = new Array();
		player = new Player();
		exit_bg = new Exit_bg();
		exit_cont_btn = new Exit_cont_btn();
		exit_exit_btn = new Exit_exit_btn();
		over_bg = new Over_bg();
		over_home_btn = new Over_home_btn();
		over_score = new Over_score();
		quiz_bg = new Quiz_bg();
		quiz_hint_btn = new Quiz_hint_btn();
		quiz_o_btn = new Quiz_o_btn();
		quiz_x_btn = new Quiz_x_btn();
		quiz_time = new Quiz_time();
		quiz_time_num = new Quiz_time_num();
		quiz_content = new Quiz_content();
		hint_bg = new Hint_bg();
		hint_content = new Hint_content();
		success_bg = new Success_bg();
		success_level = new Success_level();
		success_score = new Success_score();
		success_next_btn = new Success_next_btn();
		quiz_close_btn = new Quiz_close_btn();
		quiz_layer = new Quiz_layer();
		quiz_panel = new Quiz_panel();
		quiz_result = new Quiz_result();
		quiz_result_o = new Quiz_result_o();
		quiz_result_x = new Quiz_result_x();
		clear_bg = new Clear_bg();
		clear_content = new Clear_content();
		clear_home_btn = new Clear_home_btn();
		mobile_left_btn = new Mobile_left_btn();
		mobile_right_btn = new Mobile_right_btn();
		mobile_jump_btn = new Mobile_jump_btn();

		popup = true;
		/* 성별 선택 */
		select_male_btn.val = 1;select_female_btn.val = 2;
		/* 레벨 세팅 */
		for(let i=0;i<5;i++){
			level_arr.push(new Level_level());
			level_arr[i].idx = i;
			level_star_arr.push(new Level_star());
			level_star_arr[i].idx = i;
		}
		/* 게임 시작 */
		stageSet = false;
	})();
	function init(){
		if(gameStart){
			if(green_layer.globalAlpha > 0.05){
				green_layer.globalAlpha -= 0.05;
			}
			else{
				gameStart = false;
				selectPopupFunc(true);
			}
		}
	}
	function stageSetting(){
		level++;
		life = 5;
		quizSet = false;
		quizSubmit = false;
		startLine = new StartLine();
		player = new Player();
		item = new Item();
		enemy = new Enemy();
		if(level > 1){
			level_star_arr[level-2].active = true;
		}
		/* 맵 세팅 */		
		main_bg_arr = new Array();
		for(let i=0;i<4+(level+4)*3;i++){
			main_bg_arr.push(new Main_bg());
			main_bg_arr[i].y = (530 - (i + 1) * 500);
			if(i < 2){
				main_bg_arr[i].idx = i;
			}
			else if(2 <= i && i < 2 + level + 4){
				main_bg_arr[i].idx = 2;
			}
			else if(2 + level + 4 <= i && i < 2 + level + 5){
				main_bg_arr[i].idx = 3;
			}
			else if(2 + level + 5 <= i && i < 2 + level + 5 + level + 4){
				main_bg_arr[i].idx = 4;
			}
			else if(2 + level + 5 + level + 4 <= i && i < 2 + level + 5 + level + 5){
				main_bg_arr[i].idx = 5;
			}
			else{
				main_bg_arr[i].idx = 6;
			}
		}
		/* 발판 초기화 */
		platform_arr = new Array();
		for(let i=0;i<4;i++) {
			platform_arr.push(new Platform());
			platform_arr[i].init();
			if(i == 0){
				platform_arr[i].x = absWidth * 0.5 - platform_arr[i].w * 0.5;
			}
			else{
				platform_arr[i].x = platform_arr[i-1].x + (Math.floor(Math.random()*100)%9 - 4) * absWidth * 0.1;
			}
			if(platform_arr[i].x < 0){
				platform_arr[i].x = -1 * platform_arr[i].x;
			}
			if(platform_arr[i].x > absWidth - platform_arr[i].w){
				platform_arr[i].x = absWidth - 2 * platform_arr[i].w;
			}
			platform_arr[i].y = (300 - 100 * i);
			platform_arr[i].ytmp = platform_arr[i].y;
			platform_arr[i].active = false;
		}
		/* 목숨 초기화 */
		life_arr = new Array();
		for(let i=0;i<CONST_LIFE;i++){
			life_arr.push(new Main_life());
			life_arr[i].x = (120 + 35 * i);
		}
	}
	function popupFunc(){
		/* 레벨 세팅 관련 */
		if(!stageSet){
			stageSetting();
			stageSet = true;
		}
		/* 레벨 팝업 관련 로직 */
		if(level_bg.opened){
			level_bg.delay++;
			if(level_bg.delay >= 60){
				level_arr[level-1].val = level;
				for(let i=0;i<platform_arr.length;i++){
					platform_arr[i].active = true;
				}
			}
			if(level_bg.delay >= 120){
				levelPopupFunc(false);
				level_bg.opened = false;
				level_bg.delay = 0;
			}
		}
		if(level_bg.closed){
			level_bg.w = 0;level_bg.h = 0;
			level_bg.x = absWidth * 0.5 - level_bg.w * 0.5;
			level_bg.y = absHeight * 0.5 - level_bg.w * 0.5;
			for(let i=0;i<level_arr.length;i++){
				level_arr[i].load = true;
				level_arr[i].close = false;
				level_arr[i].w = 0;level_arr[i].h = 0;
				level_arr[i].x = absWidth * 0.5 - level_arr[i].w * 0.5;
				level_arr[i].y = absHeight * 0.5 - level_arr[i].h * 0.5;
				level_star_arr[i].load = true;
				level_star_arr[i].close = false;
				level_star_arr[i].w = 0;level_star_arr[i].h = 0;
				level_star_arr[i].x = absWidth * 0.5 - level_star_arr[i].w * 0.5;
				level_star_arr[i].y = absHeight * 0.5 - level_star_arr[i].h * 0.5;
			}
			level_alert.val = level;
			level_alert.active = true;
			level_bg.closed = false;
		}
		/* 레벨 알림 관련 로직 */
		if(level_alert.load){
			readyGo.active = true;
			level_alert.load = false;
		}
		/* 레디고 관련 로직 */
		if(readyGo.halfload){
			audioPlay(2);
			white_layer.disappear = true;
			readyGo.halfload = false;
		}
		if(readyGo.load){
			popup = false;
			player.appear = true;
			player.isControl = true;
			readyGo.load = false;
		}
	}
	function bgFunc(){		
		for(let i=0;i<main_bg_arr.length;i++){
			if(main_bg_arr[i].y + main_bg_arr[i].h > 0){
				bgIdx = main_bg_arr[i].idx;
			}
		}
	}
	function playerFunc(){
		/* 키 제어 */
		$(document).keydown(function(e){
			let keyCode = e.keyCode;
			if(keyCode == 37){
				if(player.isControl && !player.isDead){
					player.isMoving = true;
					player.isLeft = true;player.isRight = false;
				}
			}
			if(keyCode == 39){
				if(player.isControl && !player.isDead){
					player.isMoving = true;
					player.isRight = true;player.isLeft = false;
				}
			}
			if(keyCode == 32){
				if(player.isControl && !player.isDead){
					player.isJump = true;
				}
			}
		});
		$(document).keyup(function(e){
			let keyCode = e.keyCode;		
			if(keyCode == 37){
				if(player.isControl && !player.isDead){
					player.isLeft = true;
					player.isMoving = false;
					player.ani = 0;
				}
			}
			if(keyCode == 39){
				if(player.isControl && !player.isDead){
					player.isRight = true;
					player.isMoving = false;
					player.ani = 0;
				}
			}
			if(keyCode == 32){
				if(player.isControl && !player.isDead){
					aud_Arr[3][1].play();
				}
			}
		});
		if(device != "PC"){
			if(player.isControl && !player.isDead){
				if(mobile_left_btn.mouseDown){
					player.isMoving = true;
					player.isLeft = true;player.isRight = false;
				}
				else if(mobile_right_btn.mouseDown){
					player.isMoving = true;
					player.isRight = true;player.isLeft = false;	
				}
				else{
					player.isMoving = false;
					player.ani = 0;
				}
			}
		}
		/* 좌우 이동 */
		if(player.isMoving){
			if(player.isLeft){
				player.x -= player.vx;
				if(player.x < 0){
					player.x = 0;
				}
			}
			if(player.isRight){
				player.x += player.vx;
				if(player.x > absWidth - player.w){
					player.x = absWidth - player.w;
				}
			}
		}
		/* 점프 */
		if(player.isJump){
			if(!player.isLeft && !player.isRight){
				player.isRight = true;
			}
			if(!player.jumpSet){
				player.ani = 0;
				player.vy = -13;
				player.gravity = 0.5;
				player.jumpSet = true;
			}
		}
		/* 생명- 여부 */
		if(player.isDead){
			overPopupFunc(true);
			player.isDead = false;
		}
		/* 충돌 여부 확인 */
		collide();
	}
	function collide(){
		player.isReached = false;
		if(player.vy > 0){
			if(player.y + player.h >= startLine.y){
				if(startLine.active){
					player.isReached = true;
				}
			}
			for(let i=0;i<platform_arr.length;i++){
				if(platform_arr[i].type == 9){
					if(platform_arr[i].x < player.x + player.w * 0.5 && player.x + player.w * 0.5 < platform_arr[i].x + platform_arr[i].w && platform_arr[i].ytmp + platform_arr[i].h * 0.7 <= player.y + player.h && player.y + player.h < platform_arr[i].ytmp + platform_arr[i].h){
						if(platform_arr[i].active){
							objFunc(i);
							player.isReached = true;
						}
					}
				}
				else{
					if(platform_arr[i].x < player.x + player.w * 0.5 && player.x + player.w * 0.5 < platform_arr[i].x + platform_arr[i].w && platform_arr[i].ytmp + platform_arr[i].h * 0.5 <= player.y + player.h && player.y + player.h < platform_arr[i].ytmp + platform_arr[i].h){
						if(platform_arr[i].active){
							objFunc(i);
							player.isReached = true;
						}
					}
				}
			}
		}
		if(item.x < player.x + player.w * 0.75 && player.x + player.w * 0.25 < item.x + item.w && item.y + item.h > player.y && player.y + player.h > item.y){
			if(item.active){
				score_tmp += 500;
				audioPlay(4);
				item.active = false;
				item_eff.x = item.x + item.w * 0.5 - item_eff.w * 0.5;
				item_eff.y = item.y + item.h * 0.5 - item_eff.h * 0.5;
				item_eff.active = true;
				for(let i=0;i<platform_arr.length;i++){
					platform_arr[i].hasItem = false;
				}
			}
		}
		if(!player.hit && enemy.x < player.x + player.w * 0.75 && player.x + player.w * 0.25 < enemy.x + enemy.w && enemy.y + enemy.h > player.y + player.h * 0.1 && player.y + player.h * 0.9 > enemy.y){
			if(enemy.active){
				life--;
				enemy.active = false;
				player.hit = true;
				if(life <= 0){
					player.isDead = true;
				}
			}
		}
		if(player.isReached){
			player.isJump = false;
			player.jumpSet = false;	
		}		
		else{
			player.y += player.vy;
			player.vy += player.gravity;

			if(player.y > absHeight){
				life--;
				if(life > 0){
					player.vy = -22;
				}
				else{
					if(!popup){
						player.isDead = true;
					}
				}
			}
		}
	}
	function objFunc(idx){
		let obj = platform_arr[idx];
		if(obj.type == 9){
			player.isMoving = false;
			player.isLeft = false;
			player.isRight = false;
			player.isControl = false;
			if(!quizSet){
				setTimeout(function(){
					quizPopupFunc(true);
				},1000);
				quizSet = true;
			}
		}
		else{
			/* 오브젝트 내리기 */
			if(obj.ytmp < 420){
				if(main_bg_arr[main_bg_arr.length-1].y < 0){
					if(startLine.active){
						startLine.active = false;
					}
					for(let i=0;i<main_bg_arr.length;i++){
						main_bg_arr[i].y += 10;
					}
					for(let i=0;i<platform_arr.length;i++){
						platform_arr[i].y += 10;
						platform_arr[i].ytmp += 10;
					}
					player.y = obj.ytmp + obj.h * 0.5 - player.h;
					if(enemy.active){
						enemy.y += 10;
					}
				}
			}
			/* 부숴지는 발판 */
			if(obj.type % 3 == 1){
				obj.isBreak = true;
			}
			/* 움직이는 발판 */
			else if(obj.type % 3 == 2){
				if(!player.isMoving){
					player.x += obj.vx;
				}
			}
		}
	}
	function platformFunc(){		
		for(let i=0;i<platform_arr.length;i++){
			/* 부숴지는 발판 */
			if(platform_arr[i].type % 3 == 1){
				if(platform_arr[i].isBreak){
					if(platform_arr[i].ytmp + platform_arr[i].h * 1.1 < platform_arr[i].y + platform_arr[i].h || platform_arr[i].y + platform_arr[i].h < platform_arr[i].ytmp + platform_arr[i].h * 0.9){
						platform_arr[i].vy *= -1;
						platform_arr[i].breakCnt++;
						if(platform_arr[i].breakCnt > 10){
							platform_arr[i].active = false;
						}
					}
					platform_arr[i].y += platform_arr[i].vy;
				}
			}
			/* 움직이는 발판 */
			else if(platform_arr[i].type % 3 == 2) {
				if(platform_arr[i].x < 0 || platform_arr[i].x + platform_arr[i].w > absWidth){
					platform_arr[i].vx *= -1;
				}
				platform_arr[i].x += platform_arr[i].vx;		
			}	
		}
		
		/* 발판 삭제 */
		if(platform_arr[0].y >= absHeight - platform_arr[0].h){
			if(platform_arr[0].hasItem){
				item.active = false;
			}
			platform_arr.splice(0,1);
		}
		/* 발판 추가 */
		if(platform_arr[platform_arr.length-1].y > 0.25 * absHeight && platform_arr.length < 5){
			if(platform_arr[platform_arr.length-1].type != 9){ // 마지막 발판 나오면 더이상 추가 안함
				platform_arr.push(new Platform());
				let newIdx = platform_arr.length - 1;	
				let rand = Math.floor(Math.random()*100)%10;

				if(main_bg_arr[main_bg_arr.length-1].y + main_bg_arr[main_bg_arr.length-1].h * 0.5 > 0){
					platform_arr[newIdx].type = 9;
					platform_arr[newIdx].init();
					platform_arr[newIdx].x = absWidth - platform_arr[newIdx].w;
					platform_arr[newIdx].y = platform_arr[newIdx].y - platform_arr[newIdx].h * 0.5;
					platform_arr[newIdx].ytmp = platform_arr[newIdx].y;
				}
				else{
					if(rand < 8){
						rand = 0;
					}
					else if(8 <= rand && rand < 9){
						rand = 1;
					}
					else{
						rand = 2;
					}
					if(bgIdx < 3){
						platform_arr[newIdx].type = rand;
					}
					else if(3 <= bgIdx && bgIdx < 5){
						platform_arr[newIdx].type = rand + 3;
					}
					else{
						platform_arr[newIdx].type = rand + 6;
					}	
					platform_arr[newIdx].init();
					/* x좌표 설정 */
					if(main_bg_arr[main_bg_arr.length-1].y + main_bg_arr[main_bg_arr.length-1].h > 0){
						platform_arr[newIdx].x = absWidth * 0.5 - platform_arr[newIdx].w * 0.5;
					}
					else{
						platform_arr[newIdx].x = platform_arr[newIdx-1].x + (Math.floor(Math.random()*100)%7-3) * absWidth * 0.1;
						if(platform_arr[newIdx].x < 0){
							platform_arr[newIdx].x = 0 - 1 * platform_arr[newIdx].x;
						}
						if(platform_arr[newIdx].x > absWidth - platform_arr[newIdx].w){
							platform_arr[newIdx].x = absWidth - 2 * platform_arr[newIdx].w;
						}
					}	
					let rand2 = Math.floor(Math.random()*100)%10;
					/* 발판 추가하면서 10% 확률로 아이템 추가 */
					if(rand2 < 3 && platform_arr[newIdx].type % 3 == 0 && !item.active && platform_arr[newIdx].type != 9){
						platform_arr[newIdx].hasItem = true;
						item = new Item();
						item.type = Math.floor(Math.random()*100)%8;
						item.init();
						item.x = platform_arr[newIdx].x + platform_arr[newIdx].w * 0.5 - item.w * 0.5;
						item.y = platform_arr[newIdx].y + platform_arr[newIdx].h * 0.5 - item.h;
					}			
					/* 발판 추가하면서 10% 확률로 적 추가 */
					if(rand2 > 7 && !enemy.active){
						enemy = new Enemy();
						enemy.type = Math.floor(Math.random()*100)%3;
						enemy.init();
						enemy.x = absWidth * 0.5;
					}
				}			
			}
		}
	}
	function itemFunc(){
		let idx = 0;
		for(let i=0;i<platform_arr.length;i++){
			if(platform_arr[i].hasItem){
				item.y = platform_arr[i].y + platform_arr[i].h * 0.5 - item.h;
			}
		}
	}
	function lifeFunc(){
		for(let i=0;i<life_arr.length;i++){
			if(i < life){
				life_arr[i].active = true;
			}
			else{
				life_arr[i].active = false;
			}
		}
	}
	function scoreFunc(){
		if(score < score_tmp){
			score += 10;
		}
		score_arr = new Array();
		let scoreStr = score.toString();
		for(let i=0;i<scoreStr.length;i++){
			score_arr.push(new Main_score());
			score_arr[i].val = scoreStr[i];
			score_arr[i].x = (725 - 15 * (scoreStr.length - i));
		}		
	}
	function enemyFunc(){
		if(enemy.active){
			if(enemy.x < 0 || enemy.x + enemy.w > absWidth){
				enemy.vx *= -1;
				if(enemy.isLeft){
					enemy.isLeft = false;
					enemy.isRight = true;
				}
				else if(enemy.isRight){
					enemy.isLeft = true;
					enemy.isRight = false;
				}
			}
			enemy.x += enemy.vx;
			
			if(enemy.y >= absHeight - enemy.h){
				enemy.active = false;
			}
		}	
	}
	function draw(){
		for(let i=0;i<main_bg_arr.length;i++){
			main_bg_arr[i].draw();
		}
		for(let i=0;i<platform_arr.length;i++){
			platform_arr[i].draw();
		}
		item.draw();enemy.draw();
		player.draw();
		/* 상단 영역 */
		main_exit_btn.draw();main_top.draw();		
		for(let i=0;i<life_arr.length;i++){
			life_arr[i].draw();			
		}
		if(item_eff.active){
			item_eff.draw();
		}
		/* 하단 영역 */
		main_bottom.draw();main_level.draw();main_score_unit.draw();
		for(let i=0;i<score.toString().length;i++){
			score_arr[i].draw();
		}					

		if(device != "PC"){
			mobile_left_btn.draw();
			mobile_right_btn.draw();
			mobile_jump_btn.draw();
		}

		if(gameStart){
			green_layer.draw();
		}
		if(!hint_bg.active){
			white_layer.draw();
		}
		/* 이후 팝업 */
		if(select_bg.active){
			select_bg.draw();
			select_male_btn.draw();
			select_female_btn.draw();
			select_start_btn.draw();
		}
		if(level_bg.active){
			level_bg.draw();
			for(let i=0;i<level_arr.length;i++){
				level_arr[i].draw();
				level_star_arr[i].draw();
			}
		}
		if(level_alert.active){
			level_alert.draw();
		}
		if(readyGo.active){
			readyGo.draw();
		}
		if(quiz_bg.active){
			//quiz_hint_btn.draw();
			quiz_bg.draw();
			quiz_content.draw();
			quiz_o_btn.draw();
			quiz_x_btn.draw();
			quiz_time.draw();
			quiz_time_num.draw();
			
			if(hint_bg.active){
				white_layer.draw();
				hint_bg.draw();
				hint_content.draw();
				quiz_close_btn.draw();
			}
		}
		if(exit_bg.active){
			exit_bg.draw();
			exit_cont_btn.draw();
			exit_exit_btn.draw();
		}
		if(quiz_result.active){
			white_layer.draw();
			quiz_panel.draw();
			quiz_result_o.draw();quiz_result_x.draw();
			quiz_result.draw();
		}
		if(over_bg.active){
			white_layer.draw();
			over_bg.draw();
			over_home_btn.draw();	
			over_score.draw();
		}
		if(success_bg.active){
			white_layer.draw();
			success_bg.draw();
			success_level.draw();
			success_score.draw();
			success_next_btn.draw();
		}
		if(clear_bg.active){
			white_layer.draw();
			clear_bg.draw();
			clear_content.draw();
			clear_home_btn.draw();
		}
	}
	mainLoop = function(){
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		init();
		popupFunc();bgFunc();
		playerFunc();platformFunc();itemFunc();enemyFunc();

		lifeFunc();scoreFunc();
		draw();
		requestAnimFrame(mainLoop);																// 게임 애니 시작
	};
	mainLoop();
}
/* 게임내부함수 */  
function methodPopupFunc(bool){
	popup = bool;
	method_bg.active = bool;
	if(bool){
		method_content.idx = 0;
	}
}
function selectPopupFunc(bool){
	if(bool){
		select_bg.active = bool;
		select_bg.open = bool;
		select_male_btn.open = bool;
		select_female_btn.open= bool;
		select_start_btn.open = bool;
	}
	else{
		select_bg.close = !bool;
		select_male_btn.close = !bool;
		select_female_btn.close= !bool;
		select_start_btn.close = !bool;
	}
}
function levelPopupFunc(bool){
	if(bool){
		level_bg.active = bool;
		level_bg.open = bool;
		for(let i=0;i<level_arr.length;i++){
			level_arr[i].open = bool;
			level_star_arr[i].open = bool;
		}
	}
	else{
		level_bg.close = !bool;
		for(let i=0;i<level_arr.length;i++){
			level_arr[i].close = !bool;
			level_star_arr[i].close = !bool;
		}
	}
}
function exitPopupFunc(bool){
	popup = bool;
	if(bool){
		white_layer.appear = bool;
		exit_bg.active = bool;
		exit_bg.open = bool;
		exit_cont_btn.open = bool;
		exit_exit_btn.open = bool;
	}
	else{
		white_layer.disappear = !bool;
		exit_bg.close = !bool;
		exit_cont_btn.close = !bool;
		exit_exit_btn.close = !bool;
	}
}
function overPopupFunc(bool){
	white_layer.appear = bool;
	popup = bool;
	over_bg.active = bool;
}
function quizPopupFunc(bool){
	if(bool){
		quizSetting();
		quiz_bg.active = bool;
	}
	popup = bool;
	quiz_hint_btn.appear = bool;
	quiz_bg.appear = bool;
	quiz_o_btn.appear = bool;
	quiz_x_btn.appear = bool;
	quiz_time.appear = bool;
	quiz_time_num.appear = bool;
	quiz_content.appear = bool;
}
function hintPopupFunc(bool){
	white_layer.appear = bool;
	hint_bg.active = bool;
	hint_bg.appear = bool;
	hint_content.appear = bool;
	quiz_close_btn.appear = bool;
}
function successPopupFunc(bool){
	success_bg.active = bool;
	success_bg.appear = bool;
	success_level.appear = bool;
	success_score.appear = bool;
	success_next_btn.appear = bool;
}
function quizSetting(){
	quizIdx++;
	quizTime = 9;
	quiz_time_num.val = 9;
	quizInterval = setInterval(function(){
		quiz_time_num.val = quizTime;		
		quizTime--;
		if(quizTime < 0){
			overPopupFunc(true);
			clearInterval(quizInterval);
		}
	},1000);
}
function quizCheck(idx){
	let correct = (idx == quiz_arr[quizIdx-1][1]);
	resultAniFunc(correct);
	clearInterval(quizInterval);
}
function resultAniFunc(result){
	white_layer.appear = true;
	quiz_result.active = true;
	quiz_panel.delay = 0;
	quiz_result.delay = 0;
	quiz_result_o.delay = 0;
	quiz_result_x.delay = 0;
	if(result){
		quiz_result.val = 0;
		quiz_result_o.open = true;
	}
	else{
		quiz_result.val = 1;
		quiz_result_x.open = true;
	}
	quiz_result.appear = true;
	quiz_layer.appear = true;
	setTimeout(function(){
		if(result){
			if(level < 5){
				successPopupFunc(true);
			}
			else{
				clear_bg.active = true;
			}
		}
		else{
			overPopupFunc(true);
		}
		quiz_panel.x = -800;
		quiz_result.active = false;
	}, 5000);
}
/* 이벤트관련 */
let event_arr = new Array();
let mouseXarr = new Array();
let mouseYarr = new Array();
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

	if(device != "PC"){
		if(pageType == "main"){
			if(!popup){
				event_arr = new Array();
				for(let i=0;i<e.touches.length;i++){
					event_arr[i] = e.touches[i];
					mouseXarr[i] = event_arr[i].pageX - $("canvas").offset().left;					
					mouseYarr[i] = event_arr[i].pageY - $("canvas").offset().top;

					if(mobile_left_btn.x * wR < mouseXarr[i] && mouseXarr[i] < (mobile_left_btn.x + mobile_left_btn.w) * wR && mobile_left_btn.y * hR < mouseYarr[i] && mouseYarr[i] < (mobile_left_btn.y + mobile_left_btn.h) * hR){
						mobile_left_btn.mouseDown = true;
					}
					else{
						mobile_left_btn.mouseDown = false;
					}
					if(mobile_right_btn.x * wR < mouseXarr[i] && mouseXarr[i] < (mobile_right_btn.x + mobile_right_btn.w) * wR && mobile_right_btn.y * hR < mouseYarr[i] && mouseYarr[i] < (mobile_right_btn.y + mobile_right_btn.h) * hR){
						mobile_right_btn.mouseDown = true;
					}
					else{
						mobile_right_btn.mouseDown = false;
					}
				}
			}
		}
	}
	if(pageType == "intro"){
		if(!popup){
			if(mouseCd(intro_start_btn)){
				$("canvas").css("cursor","pointer");
				intro_start_btn.mouseOver = true;
				intro_method_btn.mouseOver = false;	
			}
			else if(mouseCd(intro_method_btn)){
				$("canvas").css("cursor","pointer");
				intro_method_btn.mouseOver = true;
				intro_start_btn.mouseOver = false;
			}	
			else if(mouseCd(intro_sound_btn)){
				$("canvas").css("cursor","pointer");
			}		
			else{
				intro_start_btn.mouseOver = false;
				intro_method_btn.mouseOver = false;	
			}
		}	
		else{
			if(method_bg.active){
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
		}
	}
	else if(pageType == "main"){
		if(!popup){
			if(mouseCd(main_exit_btn)){
				$("canvas").css("cursor","pointer");
				main_exit_btn.mouseOver = true;
			}		
			else{
				main_exit_btn.mouseOver = false;
			}
		}
		else{
			if(select_bg.active){
				if(mouseCd(select_male_btn)){
					$("canvas").css("cursor","pointer");
					select_male_btn.mouseOver = true;
				}		
				else if(mouseCd(select_female_btn)){
					$("canvas").css("cursor","pointer");
					select_female_btn.mouseOver = true;
				}	
				else if(mouseCd(select_start_btn)){
					$("canvas").css("cursor","pointer");
					select_start_btn.mouseOver = true;
				}
				else{
					select_male_btn.mouseOver = false;
					select_female_btn.mouseOver = false;
					select_start_btn.mouseOver = false;
				}
			}
			else if(exit_bg.active){
				if(mouseCd(exit_cont_btn)){
					$("canvas").css("cursor","pointer");
					exit_cont_btn.mouseOver = true;
					exit_exit_btn.mouseOver = false;
				}		
				else if(mouseCd(exit_exit_btn)){
					$("canvas").css("cursor","pointer");
					exit_exit_btn.mouseOver = true;
					exit_cont_btn.mouseOver = false;
				}
				else{
					exit_cont_btn.mouseOver = false;
					exit_exit_btn.mouseOver = false;
				}
			}
			else if(over_bg.active){
				if(mouseCd(over_home_btn)){
					$("canvas").css("cursor","pointer");
					over_home_btn.mouseOver = true;
				}
				else{
					over_home_btn.mouseOver = false;
				}
			}
			else if(success_bg.active){
				if(mouseCd(success_next_btn)){
					$("canvas").css("cursor","pointer");	
				}
			}
			else if(clear_bg.active){
				if(mouseCd(clear_home_btn)){
					$("canvas").css("cursor","pointer");	
					clear_home_btn.mouseOver = true;
				}
				else{
					clear_home_btn.mouseOver = false;
				}				
			}
			else if(quiz_bg.active){
				if(hint_bg.active){
					if(mouseCd(quiz_close_btn)){
						$("canvas").css("cursor","pointer");	
					}
				}
				else{
					/*if(mouseCd(quiz_hint_btn)){
						$("canvas").css("cursor","pointer");
					}
					else */
					if(mouseCd(quiz_o_btn)){
						$("canvas").css("cursor","pointer");
					}
					else if(mouseCd(quiz_x_btn)){
						$("canvas").css("cursor","pointer");
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

	if(device != "PC"){
		if(pageType == "main"){
			if(!popup){
				event_arr = new Array();
				for(let i=0;i<e.touches.length;i++){
					event_arr[i] = e.touches[i];
					mouseXarr[i] = event_arr[i].pageX - $("canvas").offset().left;					
					mouseYarr[i] = event_arr[i].pageY - $("canvas").offset().top;

					if(mobile_left_btn.x * wR < mouseXarr[i] && mouseXarr[i] < (mobile_left_btn.x + mobile_left_btn.w) * wR && mobile_left_btn.y * hR < mouseYarr[i] && mouseYarr[i] < (mobile_left_btn.y + mobile_left_btn.h) * hR){
						mobile_left_btn.mouseDown = true;
					}
					if(mobile_right_btn.x * wR < mouseXarr[i] && mouseXarr[i] < (mobile_right_btn.x + mobile_right_btn.w) * wR && mobile_right_btn.y * hR < mouseYarr[i] && mouseYarr[i] < (mobile_right_btn.y + mobile_right_btn.h) * hR){
						mobile_right_btn.mouseDown = true;
					}
					if(mobile_jump_btn.x * wR < mouseXarr[i] && mouseXarr[i] < (mobile_jump_btn.x + mobile_jump_btn.w) * wR && mobile_jump_btn.y * hR < mouseYarr[i] && mouseYarr[i] < (mobile_jump_btn.y + mobile_jump_btn.h) * hR){
						if(player.isControl && !player.isDead){
							player.isJump = true;
							aud_Arr[3][1].play();
						}
					}
				}
			}
		}
	}
});
document.addEventListener(mouseEv("up"),function(e){	
	if(device != "PC"){
		if(pageType == "main"){
			if(!popup){
				let isMoveBtn = false;
				let isJumpBtn = false;
				for(let i=0;i<event_arr.length;i++){
					if(mobile_left_btn.x * wR < mouseXarr[i] && mouseXarr[i] < (mobile_left_btn.x + mobile_left_btn.w) * wR && mobile_left_btn.y * hR < mouseYarr[i] && mouseYarr[i] < (mobile_left_btn.y + mobile_left_btn.h) * hR){
						isMoveBtn = true;
					}
					if(mobile_right_btn.x * wR < mouseXarr[i] && mouseXarr[i] < (mobile_right_btn.x + mobile_right_btn.w) * wR && mobile_right_btn.y * hR < mouseYarr[i] && mouseYarr[i] < (mobile_right_btn.y + mobile_right_btn.h) * hR){
						isMoveBtn = true;
					}
					if(mobile_jump_btn.x * wR < mouseXarr[i] && mouseXarr[i] < (mobile_jump_btn.x + mobile_jump_btn.w) * wR && mobile_jump_btn.y * hR < mouseYarr[i] && mouseYarr[i] < (mobile_jump_btn.y + mobile_jump_btn.h) * hR){
						isJumpBtn = true;
					}
				}
				if(isMoveBtn && !isJumpBtn){
					if(mobile_left_btn.mouseDown){
						mobile_left_btn.mouseDown = false;
					}
					if(mobile_right_btn.mouseDown){
						mobile_right_btn.mouseDown = false;
					}

				}
			}
		}
	}
	if(pageType == "intro"){
		if(!popup){
			if(mouseCd(intro_start_btn)){
				audioPlay(1);
				intro_start_btn.mouseOver = false;
				gameStart = true;
			}
			else if(mouseCd(intro_method_btn)){
				audioPlay(1);
				intro_method_btn.mouseOver = false;		
				methodPopupFunc(true);
			}	
			else if(mouseCd(intro_sound_btn)){
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
		else{
			if(method_bg.active){
				if(mouseCd(method_exit_btn)){
					audioPlay(1);
					method_exit_btn.mouseOver = false;
					methodPopupFunc(false);
				}	
				else if(mouseCd(method_prev_btn)){
					audioPlay(1);
					method_prev_btn.mouseOver = false;
					if(method_prev_btn.active){
						method_content.idx--;
					}
				}	
				else if(mouseCd(method_next_btn)){
					audioPlay(1);
					method_next_btn.mouseOver = false;
					if(method_next_btn.active){
						method_content.idx++;
					}
				}	
			}	
		}
	}
	else if(pageType == "main"){
		if(!popup){
			if(mouseCd(main_exit_btn)){
				audioPlay(1);
				main_exit_btn.mouseOver = false;
				exitPopupFunc(true);
			}		
		}	
		else{			
			if(select_bg.active){
				if(mouseCd(select_male_btn)){
					audioPlay(1);
					select_male_btn.mouseOver = false;
					select_male_btn.active = true;
					select_female_btn.active = false;
					gender = 1;
				}		
				else if(mouseCd(select_female_btn)){
					audioPlay(1);
					select_female_btn.mouseOver = false;
					select_male_btn.active = false;
					select_female_btn.active = true;
					gender = 2;
				}
				else if(mouseCd(select_start_btn)){
					audioPlay(1);
					select_start_btn.mouseOver = false;
					selectPopupFunc(false);
					setTimeout(function(){
						levelPopupFunc(true);
					},500);
				}
			}
			else if(exit_bg.active){
				if(mouseCd(exit_cont_btn)){
					audioPlay(1);
					exit_cont_btn.mouseOver = false;
					exitPopupFunc(false);
				}		
				else if(mouseCd(exit_exit_btn)){
					exit_exit_btn.mouseOver = false;
					location.href = "index.html";
				}
			}
			else if(over_bg.active){
				if(mouseCd(over_home_btn)){
					over_home_btn.mouseOver = false;
					location.href = "index.html";
				}
			}
			else if(success_bg.active){
				if(mouseCd(success_next_btn)){
					audioPlay(1);
					quizPopupFunc(false);
					successPopupFunc(false);
					stageSet = false;
					setTimeout(function(){
						levelPopupFunc(true);			
					},1000);
				}
			}
			else if(clear_bg.active){
				if(mouseCd(clear_home_btn)){
					clear_home_btn.mouseOver = false;
					_isPorted ? parent.gameResult() : location.href = "index.html";
				}
			}
			else if(quiz_bg.active){
				if(hint_bg.active){
					if(mouseCd(quiz_close_btn)){
						audioPlay(1);
						hint_bg.active = false;
					}
				}
				else{
					/*if(mouseCd(quiz_hint_btn)){
						audioPlay(1);
						hintPopupFunc(true);
					}
					else */
					if(mouseCd(quiz_o_btn)){
						if(!quizSubmit){
							audioPlay(1);
							quizCheck(1);
							quizSubmit = true;
						}
					}
					else if(mouseCd(quiz_x_btn)){
						if(!quizSubmit){
							audioPlay(1);
							quizCheck(2);
							quizSubmit = true;
						}
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