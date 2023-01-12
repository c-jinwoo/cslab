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
	["intro/logo.png"],
	["intro/btn_sound.png"],
	["intro/btn_start.png"],
	["intro/btn_method.png"],																	// 5
	["intro/layer.png"],										
	["intro/method/bg.png"],									
	["intro/method/btn_exit.png"],
	["intro/method/content.png"],
	["intro/method/btn_prev.png"],																// 10
	["intro/method/btn_next.png"],								
	["intro/method/dot.png"],									
	["intro/select/bg.png"],	
	["intro/select/btn_exit.png"],
	["intro/select/btn_start.png"],																// 15
	["intro/select/gender.png"],								
	["main/conv/bg.png"],										
	["main/conv/char.png"],
	["main/conv/btn_next.png"],
	["main/conv/btn_start.png"],																// 20
	["main/conv/press.png"],									
	["main/conv/btn_skip.png"],				
	["main/level.png"],		
	["main/top.png"],
	["main/right.png"],																			// 25
	["main/btm.png"],											
	["main/help.png"], 
	["main/sprite_character.png"],
	["main/yellow_text.png"],
	["main/blue_text.png"],																		// 30
	["main/gage.png"],											
	["main/folder.png"],				
	["main/exit/btn_exit.png"],
	["main/exit/bg.png"],
	["main/exit/yesno_btn.png"],																// 35
	["main/sprite_npc01.png"],								
	["main/sprite_npc02.png"],
	["main/sprite_npc03.png"],
	["main/sprite_npc04.png"],
	["main/sprite_npc05.png"],																	// 40
	["main/sprite_npc06.png"],								
	["main/sprite_npc07.png"],							
	["main/sprite_npc08.png"],
	["main/sprite_npc09.png"],
	["main/sprite_npc10.png"],																	// 45
	["main/text.png"],											
	["main/eff_success.png"],
	["main/eff_wrong.png"],
	["main/question.png"],
	["main/gage_red.png"],																		// 50
	["main/result/game_over.png"],								
	["main/result/game_clear.png"],
	["main/result/reset_btn.png"],
];
const aud_Arr = [
	["bgm.mp3"],																				// 0
	["btn_click.mp3"],
	["level.mp3"],
	["correct.mp3"],
	["wrong.mp3"],
];
const vid_Arr = [
];
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
const Intro_logo = function(){
	this.w = 516;
	this.h = 320;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 15;
	this.cx = 0;this.cy = 0;this.cw = 516;this.ch = 320;
	this.movingDown = true;
	this.draw = function(){
		try{ 
			if(this.y > 25){
				this.movingDown = false;
			}
			else if(this.y < 5){
				this.movingDown = true;
			}
			if(this.movingDown){
				this.y += 0.2;
			}
			else{
				this.y -= 0.2;
			}
			ctx.drawImage(cvs_Arr[2], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Intro_sound_btn = function(){
	this.x = 720;
	this.y = 45;
	this.w = 63;
	this.h = 62;
	this.cy = 0;this.cw = 63;this.ch = 62;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.clickable = false;
	this.draw = function(){
		try{ 
			if(volume){
				if(this.mouseOver){
					this.cx = 63;
				}
				else{
					this.cx = 0;
				}
			}
			else{
				if(this.mouseOver){
					this.cx = 189;
				}
				else{
					this.cx = 126;
				}
			}
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[3], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Intro_start_btn = function(){
	this.w = 162;
	this.h = 54;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 415;
	this.cy = 0;this.cw = 162;this.ch = 54;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.clickable = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 162;
			}
			else{
				this.cx = 0;
			}
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[4], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Intro_method_btn = function(){
	this.w = 162;
	this.h = 54;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 470;
	this.cy = 0;this.cw = 162;this.ch = 54;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.clickable = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 162;
			}
			else{
				this.cx = 0;
			}
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[5], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Intro_layer = function(){
	this.x = 0;this.y = 0;
	this.w = 800;
	this.h = 530;
	this.cx = 0;this.cy = 0;this.cw = 800;this.ch = 530;
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
			ctx.drawImage(cvs_Arr[6], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Method_bg = function(){
	this.w = 673;
	this.h = 411;
	this.x = 65;
	this.y = 110;
	this.cx = 0;this.cy = 0;this.cw = 673;this.ch = 411;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.draw = function(){
		try{ 
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y -= 2;
				}
				else{
					this.active = true;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y += 2;
				}
				else{
					this.active = false;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[7], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Method_exit_btn = function(){
	this.x = 685;
	this.y = 78;
	this.w = 73;
	this.h = 71;
	this.cy = 0;this.cw = 73;this.ch = 71;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 73;
			}
			else{
				this.cx = 0;
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[8], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Method_content = function(){
	this.w = 606;
	this.h = 274;
	this.x = 96;
	this.y = 181;
	this.cx = 0;this.cy = 0;this.cw = 620;this.ch = 290;
	this.idx = 0;
	this.slideRight = false;
	this.slideLeft = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[9], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Method_prev_btn = function(){
	this.x = 280;
	this.y = 461;
	this.w = 100;
	this.h = 42;
	this.cy = 0;this.cw = 100;this.ch = 42;
	this.mouseOver = false;
	this.on = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 100;
			}
			else{
				this.cx = 0;
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
			if(this.on){
				ctx.save();
				ctx.globalAlpha = this.globalAlpha;
				ctx.drawImage(cvs_Arr[10], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				ctx.restore();
			}
		}
		catch(e){}
	};
};
const Method_next_btn = function(){
	this.x = 440;
	this.y = 461;
	this.w = 100;
	this.h = 42;
	this.cy = 0;this.cw = 100;this.ch = 42;
	this.mouseOver = false;
	this.on = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 100;
			}
			else{
				this.cx = 0;
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
			if(this.on){
				ctx.save();
				ctx.globalAlpha = this.globalAlpha;
				ctx.drawImage(cvs_Arr[11], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				ctx.restore();
			}
		}
		catch(e){}
	};
};
const Method_dot = function(){
	this.x = 0;
	this.y = 477;
	this.w = 9;
	this.h = 8;
	this.cy = 0;this.cw = 11;this.ch = 10;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.draw = function(){
		try{ 
			if(this.active){
				this.cx = 0;
			}
			else{
				this.cx = 11;
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[12], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Select_bg = function(){
	this.w = 673;
	this.h = 399;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 120;
	this.cx = 0;this.cy = 0;this.cw = 673;this.ch = 399;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.draw = function(){
		try{ 
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y -= 2;
				}
				else{
					this.active = true;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y += 2;
				}
				else{
					this.active = false;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[13], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Select_exit_btn = function(){
	this.x = 685;
	this.y = 88;
	this.w = 73;
	this.h = 71;
	this.cy = 0;this.cw = 73;this.ch = 71;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 73;
			}
			else{
				this.cx = 0;
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[14], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Select_start_btn = function(){
	this.w = 144;
	this.h = 51;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 450;
	this.cy = 0;this.cw = 144;this.ch = 51;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 144;
			}
			else{
				this.cx = 0;
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[15], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Select_male_btn = function(){
	this.w = 310;
	this.h = 240;
	this.x = 90;
	this.y = 198;
	this.cy = 0;this.cw = 261;this.ch = 201;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.on = true;
	this.draw = function(){
		try{ 
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[16], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Select_female_btn = function(){
	this.w = 310;
	this.h = 240;
	this.x = 395;
	this.y = 198;
	this.cy = 201;this.cw = 261;this.ch = 201;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.on = false;
	this.draw = function(){
		try{ 
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
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y -= 2;
				}
			}
			else{
				this.active = false;
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y += 2;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[16], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Conv_user_bg = function(){
	this.w = 530;
	this.h = 188;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 220;
	this.cx = 0;this.cy = 0;this.cw = 530;this.ch = 188;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
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
					this.active = true;
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
					this.active = false;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[17], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Conv_pc_bg = function(){
	this.w = 530;
	this.h = 188;
	this.x = 230;
	this.y = 182;
	this.cx = 0;this.cy = 0;this.cw = 530;this.ch = 188;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.on = false;
	this.draw = function(){
		try{ 
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.x -= 5;
				}
				else{
					this.active = true;
					this.on = true;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					if(this.on){
						this.x += 5;
					}
					else{
						this.y += 2;
					}
				}
				else{
					this.active = false;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[17], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Conv_user_text = function(){
	this.x = 300;
	this.y = 260;
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
			ctx.font = "bold "+(20 * hR)+"px '나눔스퀘어'";ctx.fillStyle = "#070628";ctx.textAlign = "left";											
			for(let i=0;i<conv_user_result_Arr.length;i++){	
				ctx.fillText(conv_user_result_Arr[i], this.x * wR, (this.y + (i * 30)) * hR);
			}
			ctx.restore();
		}
		catch(e){}
	};
};
const Conv_pc_text = function(){
	this.x = 260;
	this.y = 220;
	this.globalAlpha = 0;
	this.appear = false;
	this.on = false;
	this.draw = function(){
		try{ 
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.x -= 5;
				}
				else{
					this.on = true;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					if(this.on){
						this.x += 5;
					}
					else{
						this.y += 2;
					}
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.font = "bold "+(20 * hR)+"px '나눔스퀘어'";ctx.fillStyle = "#070628";ctx.textAlign = "left";												
			for(let i=0;i<conv_pc_result_Arr.length;i++){	
				ctx.fillText(conv_pc_result_Arr[i], this.x * wR, (this.y + (i * 30)) * hR);
			}
			ctx.restore();
		}
		catch(e){}
	};
};
const Conv_user_char = function(){
	this.w = 252;
	this.h = 248;
	this.x = 50;
	this.y = 190;
	this.cx = 0;this.cy = 0;this.cw = 252;this.ch = 248;
	this.globalAlpha = 0;
	this.appear = false;
	this.on = false;
	this.draw = function(){
		try{
			if(gender == 1){
				this.cx = 0;
			}
			else{
				this.cx = 252;
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
			ctx.drawImage(cvs_Arr[18], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Conv_pc_char = function(){
	this.w = 252;
	this.h = 248;
	this.x = 620;
	this.y = 150;
	this.cx = 504;this.cy = 0;this.cw = 252;this.ch = 248;
	this.globalAlpha = 0;
	this.appear = false;
	this.on = false;
	this.draw = function(){
		try{
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.x -= 5;					
				}
				else{
					this.on = true;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					if(this.on){
						this.x += 5;
					}
					else{
						this.y += 2;
					}
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[18], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Conv_next_btn = function(){
	this.x = 0;
	this.y = 325;
	this.w = 51;
	this.h = 19;
	this.cy = 0;this.cw = 51;this.ch = 19;
	this.mouseOver = false;
	this.clickable = true;
	this.draw = function(){
		try{ 
			if(this.clickable){
				if(this.mouseOver){
					this.cx = 51;
				}
				else{
					this.cx = 0;
				}
				ctx.drawImage(cvs_Arr[19], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
		}
		catch(e){}
	};
};
const Conv_start_btn = function(){
	this.x = 140;
	this.y = 325;
	this.w = 513;
	this.h = 27;
	this.cx = 0;this.cw = 513;this.ch = 27;
	this.mouseOver = false;
	this.clickable = false;
	this.draw = function(){
		try{ 
			if(this.clickable){
				if(this.mouseOver){
					this.cy = 27;
				}
				else{
					this.cy = 0;
				}
				ctx.drawImage(cvs_Arr[20], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
		}
		catch(e){}
	};
};
const Conv_press = function(){
	this.w = 242;
	this.h = 45;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 490;
	this.cx = 0;this.cy = 0;this.cw = 242;this.ch = 45;
	this.globalAlpha = 0;
	this.ani = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
			this.ani++;
			if(this.ani >= 84){
				this.ani = 0;
			}
			this.cy = Math.floor(this.ani/6)*45;
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[21], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Conv_skip_btn = function(){
	this.x = 670;
	this.y = 60;
	this.w = 100;
	this.h = 41;
	this.cy = 0;this.cw = 100;this.ch = 41;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.clickable = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 100;
			}
			else{
				this.cx = 0;
			}
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[22], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_bg = function(){
	this.x = 0;this.y = 0;
	this.w = 800;
	this.h = 530;
	this.cx = 0;this.cy = 0;this.cw = 800;this.ch = 530;
	this.globalAlpha = 1;
	this.draw = function(){
		try{
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[1], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Main_level = function(){
	this.x = 0;
	this.y = 0;
	this.w = 800;
	this.h = 120;
	this.cx = 0;this.cw = 800;this.ch = 120;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.delay = 0;
	this.val = 0;
	this.draw = function(){
		try{
			if(this.active){
				this.cy = 120 * this.val;
				if(this.appear){
					if(this.globalAlpha < 0.95){
						this.globalAlpha += 0.05;
						this.y += 10;
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
						this.y -= 10;
					}
					else{
						this.active = false;
						this.val++;
						if(this.val % 2 == 1){
							uiCtrl(true);
						}
						else{
							if(stage < 6){
								convPopupCtrl(true);
							}
							else{
								gameClear = true;
							}
						}
					}
				}
				ctx.save();
				ctx.globalAlpha = this.globalAlpha;
				ctx.drawImage(cvs_Arr[23], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				ctx.restore();
			}
		}
		catch(e){}
	};
};
const Main_top = function(){
	this.x = 10;
	this.y = -40;
	this.w = 214;
	this.h = 58;
	this.cx = 0;this.cy = 0;this.cw = 214;this.ch = 58;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[24], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_right = function(){
	this.x = 788;
	this.y = 100;
	this.w = 240;
	this.h = 297;
	this.cx = 0;this.cy = 0;this.cw = 240;this.ch = 297;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.x -= 12;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.x += 12;
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
const Main_btm = function(){
	this.x = 0;
	this.y = 530;
	this.w = 802;
	this.h = 115;
	this.cx = 0;this.cy = 0;this.cw = 802;this.ch = 115;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y -= 6;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y += 6;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[26], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_help = function(){
	this.x = 215;
	this.y = -38;
	this.w = 516;
	this.h = 57;
	this.cx = 0;this.cy = 0;this.cw = 516;this.ch = 57;
	this.globalAlpha = 0;
	this.appear = false;
	this.ani = 0;
	this.draw = function(){
		try{
			this.ani++;
			if(this.ani >= 85){
				this.ani = 0;
			}
			this.cy = Math.floor(this.ani / 5) * 57;
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[27], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_top_lv = function(){
	this.x = 90;
	this.y = -5;
	this.fillStyle = "#FFCC00";
	this.font = "bold " + (22 * hR) + "px '나눔스퀘어'";
	this.textAlign = "left";
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.fillStyle = this.fillStyle;ctx.font = this.font;ctx.textAlign = this.textAlign;
			if(stage < 6){
				ctx.fillText(stage + "단계 업무", this.x * wR, this.y * hR);
			}
			else{
				ctx.fillText("마지막 업무!", this.x * wR, this.y * hR);
			}
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_right_char = function(){
	this.x = 808;
	this.y = 140;
	this.w = 145;
	this.h = 175;
	this.cy = 0;this.cw = 145;this.ch = 175;
	this.globalAlpha = 0;
	this.appear = false;
	this.ani = 0;
	this.angry = 0;//화남:1 아님:0
	this.draw = function(){
		try{
			this.ani++;
			if(this.ani >= 45){
				this.ani = 0;
			}
			this.cx = Math.floor(this.ani / 3) * 145;
			this.cy = (Math.floor(gender / 2) * 2 + this.angry) * 175;
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.x -= 12;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.x += 12;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[28], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_right_angry = function() {
	this.x = 968;
	this.y = 155;
	this.strokeStyle = "red";
	this.font = "bold " + (22 * hR) + "px '나눔스퀘어'";
	this.textAlign = "left";
	this.lineWidth = 1;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function() {
		try{
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.x -= 12;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.x += 12;
				}
			}
			ctx.save();
			ctx.strokeStyle = this.strokeStyle;
			ctx.font = this.font;
			ctx.textAlign = this.textAlign;
			ctx.lineWidth = this.lineWidth;
			ctx.strokeText("짜증",this.x * wR, this.y * hR);
			ctx.restore();
		}
		catch(e){}
	}
}
const Main_right_txt = function(){
	this.x = 0;
	this.y = 320;
	this.w = 18;
	this.h = 23;
	this.cy = 0;this.cw = 18;this.ch = 23;
	this.globalAlpha = 0;
	this.appear = false;
	this.val = 0;
	this.isYellow = false;
	this.draw = function(){
		try{
			this.cx = this.val * 18;
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.x -= 12;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.x += 12;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			if(this.isYellow){
				ctx.drawImage(cvs_Arr[29], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
			else{
				ctx.drawImage(cvs_Arr[30], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_right_gage = function(){
	this.x = 963;
	this.y = 325;
	this.w = 54;
	this.h = 50;
	this.chtmp = 50;
	this.cx = 0;this.cy = 200;this.cw = 54;this.ch = 50;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{
			if(this.ch < this.chtmp){
				this.y -= 5;
				this.h += 5;
				this.cy -= 5;
				this.ch += 5;
			}
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.x -= 12;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.x += 12;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[31], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
	this.reset = function(){
		this.y = 325;
		this.h = 50;
		this.cy = 200;
		this.ch = 50;
		this.chtmp = 50;
	};
};
const Main_folder = function(){
	this.x = 0;
	this.y = 532;
	this.w = 136;
	this.h = 110;
	this.cw = 136;this.ch = 110;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.mouseOver = false;
	this.type = 0;
	this.draw = function(){
		try{
			if(this.active){
				if(this.mouseOver){
					this.cx = 136;
				}
				else{
					this.cx = 0;
				}
			}
			else{
				this.cx = 272;
			}
			this.cy = this.type * 110;
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y -= 6;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y += 6;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[32], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_exit_btn = function(){
	this.x = 720;
	this.y = 10;
	this.w = 73;
	this.h = 71;
	this.cy = 0;this.cw = 73;this.ch = 71;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 73;
			}
			else{
				this.cx = 0;
			}
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
				}
				else{
					this.active = true;
				}
			}
			else{
				this.active = false;
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[8], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Black_layer = function(){
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
				ctx.fillStyle = "#000";ctx.fill();			
				ctx.restore();
			}
		}
		catch(e){}
	};
};
const Main_exit_bg = function(){
	this.w = 663;
	this.h = 245;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 663;this.ch = 245;
	this.active = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
				}
				else{
					this.active = true;
				}
			}
			else{
				this.active = false;
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[34], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_exit_yes_btn = function(){
	this.x = 240;
	this.y = 320;
	this.w = 144;
	this.h = 51;
	this.cx = 0;this.cy = 0;this.cw = 144;this.ch = 51;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{
			if(this.mouseOver){
				this.cx = 144;
			}
			else{
				this.cx = 0;
			}
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
				}
				else{
					this.active = true;
				}
			}
			else{
				this.active = false;
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[35], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_exit_no_btn = function(){
	this.x = 400;
	this.y = 320;
	this.w = 144;
	this.h = 51;
	this.cx = 0;this.cy = 0;this.cw = 144;this.ch = 51;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{
			if(this.mouseOver){
				this.cx = 432;
			}
			else{
				this.cx = 288;
			}
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
				}
				else{
					this.active = true;
				}
			}
			else{
				this.active = false;
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[35], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_npc = function(){
	this.x = 0;
	this.y = 210;
	this.w = 153;
	this.h = 245;
	this.cw = 153;this.ch = 245;
	this.type = 0;
	this.mouseOver = false;
	this.ani = 0;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.complete = false;
	this.success = false;
	this.ans = 0;
	this.aniFin = false;
	this.delay = 0;
	this.clickable = false;
	this.draw = function(){
		try{
			if(this.complete){
				if(this.success){
					if(this.ani > 0){
						this.cx = Math.floor(this.ani / 3) * 153;
						this.cy = 245;
						this.ani++;
						if(this.ani >= 29){
							this.ani = 0;
						}
					}
					else{
						this.delay++;
						if(this.delay >= 30){
							this.aniFin = true;
						}
						this.cx = 9 * 153;
						this.cy = 245;
					}
				}
				else{
					if(this.ani > 0){
						this.cx = Math.floor((this.ani % 33) / 3) * 153;
						this.cy = 490 + Math.floor(this.ani / 33) * 245;
						this.ani++;
						if(this.ani >= 44){
							this.ani = 0;
						}
					}
					else{
						this.delay++;
						if(this.delay >= 30){
							this.aniFin = true;
						}
						this.cx = 3 * 153;
						this.cy = 3 * 245;
					}
				}
			}
			else{
				if(this.mouseOver){
					this.ani++;
					if(this.ani >= 29){
						this.ani = 29;
					}
					this.cx = 153 + Math.floor(this.ani / 3) * 153;
					this.cy = 0;
				}
				else{
					this.cx = 0;
					this.cy = 0;
				}
			}
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y -= 2;
				}
				else{
					this.active = true;
				}
			}
			else{
				this.active = false;
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y += 2;
				}
				else{
					this.complete = false;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[36+this.type], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
	this.show = function(idx,ans){
		this.type = idx;
		this.ans = ans;
		this.delay = 0;
		this.complete = false;
		this.aniFin = false;
		this.appear = true;
		this.clickable = true;
		npcTotIdx++;
	};
	this.close = function(){
		this.appear = false;
	};
	this.comp = function(i){
		this.ani = 1;
		this.complete = true;
		if(i == 0){
			this.success = true;
		}
		else{
			this.success = false;
		}
		cur_mission++;
	};
};
const Main_text = function(){
	this.x = 0;this.y = 0;
	this.w = 59;
	this.h = 64;
	this.cx = 0;this.cy = 0;this.cw = 59;this.ch = 64;
	this.active = false;
	this.draw = function(){
		try{
			ctx.drawImage(cvs_Arr[46], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
	this.show = function(i){
		this.active = true;
		this.x = mouseX / wR - this.w * 0.5;
		this.y = mouseY / hR - this.h * 0.5;
	};
};
const Main_eff = function(){
	this.x = 0;this.y = 0;
	this.w = 180;
	this.h = 180;
	this.cx = 0;this.cy = 0;this.cw = 180;this.ch = 180;
	this.success = false;
	this.active = false;
	this.ani = 0;
	this.draw = function(){
		try{
			this.ani++;
			if(this.ani >= 23){
				this.active = false;
			}
			this.cx = Math.floor((this.ani % 12) / 3) * 180;
			this.cy = Math.floor(this.ani / 12) * 180;
			if(this.success){
				ctx.drawImage(cvs_Arr[47], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR); 
			}
			else{
				ctx.drawImage(cvs_Arr[48], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR); 
			}
		}
		catch(e){}
	};
	this.show = function(i){
		this.ani = 0;
		this.active = true;
		this.x = mouseX / wR - this.w * 0.5;
		this.y = mouseY / hR - this.h * 0.5;
		if(i == 0){
			this.success = true;
		}
		else{
			this.success = false;
		}
	};
};
const Main_baloon = function(){
	this.x = 0;this.y = 55;
	this.w = 250;
	this.h = 177;
	this.cx = 0;this.cy = 0;this.cw = 250;this.ch = 177;
	this.globalAlpha = 0;
	this.appear = false;
	this.val = 0;
	
	this.x_name = 0;
	this.y_name = 85;
	this.x_question = 0;
	this.y_question = 110;
	this.name_seed = [
		"<최희진 판사>",
		"<박승주 (시민)>",
		"<이승현 (시민)>",
		"<김하늬 (시민)>",
		"<유미애 (시민)>",
		"<김민수 감사원>",
		"<국회의원 최고봉>",
		"<국회의원 신선미>",
		"<법무부 박동우>",
		"<법무부 강희경>",
	];
	this.question_seed = [
		//위헌 법률 심판
		[
			"국회에서 만든 이 법률이 %헌법에*\n%어긋난다고 판단되니 *심사해 주시\n기 바랍니다.",
			"법원에서 이 법을 검토한 결과 %헌*\n%법에 위반*되는것 같으니 심판을\n청구합니다.",
			"법원에서 왔습니다. 이 법을 검토\n해 본 결과 %헌법에 위반*되는 것 같\n으니 심판을 청구합니다."
		],
		//헌법 소원 심판
		[
			"%법원에서 위헌심판을 신청*했지만\n%기각*되어서 직접 찾아왔습니다.\n이 법은 %헌법정신에 어긋납니다.*",
			"제가 유치장에 있었을때 %개인의*\n%인격권이 심하게 침해*당한 적이\n있어 심판을 청구하러 왔습니다."
		],
		//권한 쟁의 심판
		[
			"XX시에서 나왔습니다. ㅁㅁ시에\n서% 우리쪽에 권한이 있는 일을 추*\n%진*하여, 심판을 받으러 왔습니다.",
			"ㅇㅇ시와 ㅁㅁ지방자치단체가 서\n로% 권한여부를 두고 다투고 있어*\n%서* 심판을 받으러 왔습니다."
		],
		//탄핵 심판
		[
			"ㅇㅇㅇ국무총리가 %헌법을 위반*\n하는 행위를 하여 그 자리에서\n%물러나도록* 탄핵을 요청합니다!",
			"△△△장관이 %선거중립을 위반*\n하는 발언을 하였기 때문에 %물러*\n%나도록* 탄핵을 요청합니다!"
		],
		//정당 해산 심판
		[
			"ㅁㅁ정당의 목적이나 활동이\n%민주적 질서에 어긋나기* 때문에\n%해산*을 요청합니다!",
			"%XX당*이 이번 선거에서 했던 행동\n이 %민주주의를 크게 훼손*한다고\n보여지는 바, %해산을 요청*합니다!"
		]
	];
	this.name = "";
	this.color = "";
	this.question = new Array();
	this.colored = new Array();
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
			ctx.drawImage(cvs_Arr[49], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			
			ctx.textAlign = "center";ctx.fillStyle = "#000";
			ctx.font = "bold " + (22 * hR) + "px '나눔스퀘어'";
			ctx.fillText(this.name, this.x_name * wR, this.y_name * hR);

			ctx.textAlign = "left";
			ctx.font = "bold " + (14 * hR) + "px '나눔스퀘어'";
			for(let i=0;i<this.question.length;i++){
				let width_tmp = 0;
				let colorStartIdx = this.question[i].indexOf("%");
				let colorEndIdx = this.question[i].indexOf("*");
				let question_tmp = this.question[i].replace("%","");
				question_tmp = question_tmp.replace("*","");
				for(let j=0;j<question_tmp.length;j++){
					if(j > 0){
						width_tmp += ctx.measureText(question_tmp[j-1]).width;	
					}
					else{
						width_tmp += ctx.measureText(question_tmp[j]).width;
					}
					if(stage < 6){
						if(colorStartIdx != -1){
							if(colorStartIdx <= j && j <= colorEndIdx - 2){
								ctx.fillStyle = this.color;
							}
							else{
								ctx.fillStyle = "#000";
							}
						}
						else{
							ctx.fillStyle = "#000";
						}
					}
					else{
						ctx.fillStyle = "#000";
					}
					ctx.fillText(question_tmp[j], (this.x_question * wR + width_tmp), (this.y_question + 18 * i) * hR);
				}
			}
			ctx.restore();
		}
		catch(e){}
	};
	this.init = function(idx,ans){
		let rand = Math.floor(Math.random()*100)%this.question_seed[ans].length;
		this.question = this.question_seed[ans][rand].split("\n");
		this.name = this.name_seed[idx];
		if(ans == 0) {
			this.color = "#0F9FF2";
		}
		else if(ans == 1) {
			this.color = "#61E90E";
		}
		else if(ans == 2) {
			this.color = "red";
		}
		else if(ans == 3) {
			this.color = "#F4A904";
		}
		else if(ans == 4) {
			this.color = "#6633cc";
		}
	};
	this.show = function(){
		this.appear = true;
	};
	this.close = function(){
		this.appear = false;
	};
};
const Main_gage_red = function(){
	this.x = 0;this.y = 268;
	this.wBlk = 120;
	this.w = 0;
	this.h = 5;
	this.crpRedX = 0;this.crpRedY = 0;this.crpRedW = 5;this.crpRedH = 5;
	this.crpBlkX = 5;this.crpBlkY = 0;this.crpBlkW = 115;this.crpBlkH = 5;
	this.end = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.pause = false;
	this.draw = function(){
		try{
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y -= 2;
				}
				else{
					if(!this.pause){
						if(this.w < this.wBlk){
							this.w += 0.2;
						}
						else{
							this.end = true;
							this.pause = true;
						}
					}
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y += 2;
				}
				else{
					this.globalAlpha = 0;
					this.w = 0;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[50], this.crpBlkX, this.crpBlkY, this.crpBlkW, this.crpBlkH, this.x * wR, this.y * hR, this.wBlk * wR, this.h * hR);
			ctx.drawImage(cvs_Arr[50], this.crpRedX, this.crpRedY, this.crpRedW, this.crpRedH, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
	this.show = function(){
		this.appear = true;
		this.pause = false;
	};
	this.close = function(){
		this.appear = false;
	};
};
const Main_game_over = function(){
	this.w = 663;
	this.h = 335;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 663;this.ch = 335;
	this.draw = function(){
		try{
			ctx.drawImage(cvs_Arr[51], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Main_game_clear = function(){
	this.w = 662;
	this.h = 350;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 662;this.ch = 350;
	this.draw = function(){
		try{
			ctx.drawImage(cvs_Arr[52], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Main_reset_btn = function(){
	this.w = 145;
	this.h = 52;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 360;
	this.cx = 0;this.cy = 0;this.cw = 145;this.ch = 52;
	this.mouseOver = false;
	this.draw = function(){
		try{
			if(this.mouseOver){
				this.cx = 145;
			}
			else{
				this.cx = 0;
			}
			if(gameOver){
				this.y = 360;
			}
			else if(gameClear){
				this.y = 370;
			}
			ctx.drawImage(cvs_Arr[53], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
/* 객체 생성 */
let intro_start_btn = new Object(),
	intro_method_btn = new Object(),
	intro_sound_btn = new Object(),
	intro_layer = new Object(),
	method_bg = new Object(),
	method_content = new Object(),
	method_exit_btn = new Object(),
	method_prev_btn = new Object(),
	method_next_btn = new Object(),
	select_bg = new Object(),
	select_exit_btn = new Object(),
	select_start_btn = new Object(),
	select_male_btn = new Object(),
	select_female_btn = new Object(),
	conv_user_bg = new Object(),
	conv_pc_bg = new Object(),
	conv_user_text = new Object(),
	conv_pc_text = new Object(),
	conv_user_char = new Object(),
	conv_pc_char = new Object(),
	conv_skip_btn = new Object(),
	conv_next_btn = new Object(),
	conv_start_btn = new Object(),
	conv_press = new Object();
let main_level = new Object(),
	main_top = new Object(),
	main_right = new Object(),
	main_btm = new Object(),
	main_help = new Object(),
	main_top_lv = new Object(),
	main_right_char = new Object(),
	main_right_angry = new Object(),
	main_right_gage = new Object(),
	main_exit_btn = new Object(),
	black_layer = new Object(),
	main_text = new Object(),
	main_eff = new Object(),
	main_right_txt_arr = new Array(),
	main_folder_arr = new Array(),
	main_npc_arr = new Array(),
	main_baloon_arr = new Array(),
	main_gage_red_arr = new Array(),
	main_exit_bg = new Object(),
	main_exit_yes_btn = new Object(),
	main_exit_no_btn = new Object(),
	main_reset_btn = new Object();
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
let TOT_NPC_NUM = 3;																			// 총 npc 수 : 3
let TOT_FOLDER_NUM = 5;																			// 총 폴더 수 : 5
let npcClick = false;																			// npc 클릭 여부
let npcClickIdx = 0;																			// npc 클릭 인덱스
let npcTotIdx = 0;																				// npc 스테이지별 수
let tot_mission = 0;																			// 스테이지 미션 처리 갯수
let cur_mission = 0;																			// 스테이지 미션 전체 갯수
let stage = 0;																					// 스테이지 정보
let gameTime = 0;
let gameTimeInterval = new Object();
let gameOver = false;
let gameClear = false;
let gender = 1;																					// 성별 남:1 여:2
let convIdx = 0;																				// 인트로단계대화 순서
let convEnd = false;																			// 인트로단계대화 각 순서 종료여부
let typeInterval = new Object();																// 인트로단계대화 인터벌
let typingIdx = 0;																				// 인트로단계대화 글자인덱스
let typingColIdx = 0;																			// 인트로단계대화 줄인덱스
let conv_user_result_Arr = new Array();															// 인트로단계대화 유저멘트 배열
let conv_pc_result_Arr = new Array();															// 인트로단계대화 PC멘트 배열
let typeSplitText = new Array();																// 인트로단계대화 문장삽입용 배열
let method_dot_arr = new Array();
let conv_Arr = [
	[
		["오늘 헌법재판소 업무 체험 활동을","하러온 학생인데요, 헌법재판소는","크게 어떤 일들을 하나요?"],
		["나는 학생의 업무를 도와줄 헌법의","요정이라고 해! 헌법재판소에서 하는","일은 크게 5가지로 나눌 수 있지"],
		["헌법재판소가 하는 일이 다섯가지나..","뜨헉~","과연 일을 잘 배울 수 있을지"],
		["다양한 사건의 심판을 담당하는데,","위헌법률심판, 헌법소원심판, 권한쟁의","심판, 탄핵심판, 정당해산심판.."],
		["...뭐가 뭔지 모르겠어요 ㅠㅜ"],
		["응, 지금은 처음이라 잘 모르겠지만,","하나하나씩 배워보죠... 말하자면, 사건","청구 서류를 받는 일이에요"],
		["...서류요? 서류를 받아서 정리하는건","가요?"],
		['헌법재판소를 방문하시는 분들의 "사건"','"청구 서류"를 맞는 "서류 폴더"에 넣으','면 완료입니다!'],
		['그렇군요! 처음이라 일단은 한가지','서류만 처리하는게 좋을 거 같은데요','"위헌법률심판"이 어떨까요?'],
		["위헌법률심판이란, 법원에서 이 법률이","헌법에 맞는건지 심사를 요청해오는","심판을 말합니다"],
		["네,알겠습니다!"],
		["중요한 것은! 대사를 살펴보고, 서류를","클릭해서 서류폴더로 드래그 하는 것!","그럼 한번 시작해 볼까요?"],
		["열심히 해보겠습니다!"],
	],
	[
		["야호! 1단계 업무 완료! 이번에는 헌법","재판소에서 하는 일 중에 어떤 것을 배","워볼까요?"],
		['네, 아까는 한가지 서류만 분류해서 그','래도 쉬웠죠? 이번엔 "헌법소원심판"','청구서류도 같이 접수해볼게요.'],
		["헌법소원심판 청구서류요?"],
		["공권력에 의해 국민의 기본권이 침해당","했을 때, 직접 국민이 헌법재판소에 심","판들 청구하는 것을 말합니다."],
		["네~ 국민의 기본권,그리고 침해... 라,","그렇군요!"],
		["그리고, 법원에 신청한 위헌법률심판이","기각되어도 국민이 직접 헌법소원을 청","구할 수 있다는 점... 꼭 알아두세요!"],
		['"법원에서 위헌법률심판이 기각되면','국민이 직접..." 헷갈리지 않게 잘 알아','두겠습니다!'],
		["그럼 이번 업무도 파이팅! 전에 했던","업무도 같이 처리해야 하니 혼동되지","않게 주의하세요!"],
		["네, 알겠습니다. 잘 살펴보면서 업무처","리 해보겠습니다~!!"],
	],
	[	
		["야호! 2단계 업무 완료! 이번에는 헌법","재판소에서 하는 일 중에 어떤 것을 배","워볼까요?"],
		['이번엔 "권한쟁의심판" 청구서류도 같','이 접수해볼게요'],
		["권한쟁의심판 청구서류요?"],
		["권한쟁의심판이란, 국가기관이나 지방","자치단체 사이에 권한 등을 두고 분쟁","이 발생하면, 이를 심판하는 제도에요"],
		["기관 사이의 분쟁이라... 쉽게 말해 싸","움이 났을 때 중재를 하는 거군요!"],
		["그럼 이번 업무도 파이팅! 전에 했던","업무도 같이 처리해야 하니 혼동되지","않게 주의하세요!"],
		["네, 알겠습니다. 잘 살펴보면서 업무처","리 해보겠습니다~!!"],
	],
	[
		["야호! 3단계 업무 완료! 이번에는 헌법","재판소에서 하는 일 중에 어떤 것을 배","워볼까요?"],
		['이번엔 "탄핵심판" 청구서류도 같이 접','수해볼게요'],
		["탄핵심판 청구서류요?"],
		["대통령을 비롯한 고위 공직자가 헌법이","나 법률을 위반했을때 그 공직자를 파","면할 지 여부를 결정짓는 거에요..."],
		["아, 그렇군요..."],
		["그럼 이번 업무도 파이팅! 전에 했던","업무도 같이 처리해야 하니 혼동되지","않게 주의하세요!"],
		["네, 알겠습니다. 잘 살펴보면서 업무처","리 해보겠습니다~!!"],
	],
	[		
		["야호! 4단계 업무 완료! 이번에는 헌법","재판소에서 하는 일 중에 어떤 것을 배","워볼까요?"],
		['이번엔 "정당해산심판" 청구서류도 같','이 접수해볼게요.'],
		["정당해산심판 청구서류요?"],
		["정당의 목적이나 활동이 헌법에 어긋날","때, 헌법재판소에 정당을 해산시켜달라","고 제소할 수 있습니다."],
		["네, 알겠습니다 정당해산심판! 간단하","게 정당을 해산한다는 의미군요..."],
		["네 그럼 이번 업무도 파이팅! 이제 전","체적으로 5개의 업무를 동시에 처리해","야 하니, 얼심히 해주세요!"],
		["네, 잘 살펴보면서 업무처리 해보겠습","니다~!!"],
	],
	[		
		["야호! 5단계 업무 완료! 이제 모든 업무","를 처리할 수 있게 되었어요!"],
		["수고했어요~ 하지만 오늘 업무의 마지","막 관문이 남아있어요!"],
		["헉? 무슨 일이죠?"],
		["이전 업무와 같이 5가지 업무를 동시에","처리해 볼텐데요... 서류를 알아보기가","좀 더 어려울꺼에요!"],
		["그렇군요..."],
		["그래도 지금까지 일을 처리한 실력이","라면 잘 해낼 수 있을꺼에요!"],
		["네, 잘 살펴보면서 마지막으로 열심히","해보겠습니다!"] 
	]
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
	let intro_logo = new Intro_logo();
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
		for(let i=0;i<4;i++){
			method_dot_arr.push(new Method_dot());
			method_dot_arr[i].x = (382 + i * 15);
		}	
		setTimeout(function(){
			introBtnCtrl(true);
		},1000);
	})();
	function methodPopupFunc(){
		if(method_content.idx < 1){
			method_prev_btn.on = false;
			method_next_btn.on = true;
		}
		else if(method_content.idx > 2){
			method_prev_btn.on = true;
			method_next_btn.on = false;
		}
		else{
			method_prev_btn.on = true;
			method_next_btn.on = true;
		}
		if(method_content.slideRight){
			if(method_content.cx < method_content.idx * 620){
				method_content.cx += 20;
			}
			else{
				method_content.slideRight = false;
			}
		}
		else if(method_content.slideLeft){
			if(method_content.cx > method_content.idx * 620){
				method_content.cx -= 20;
			}
			else{
				method_content.slideLeft = false;
			}
		}
		for(let i=0;i<method_dot_arr.length;i++){
			if(i == method_content.idx){
				method_dot_arr[i].active = true;
			}
			else{
				method_dot_arr[i].active = false;
			}
		}
	}
	function draw(){	
		intro_bg.draw();intro_logo.draw();
		intro_start_btn.draw();intro_method_btn.draw();intro_sound_btn.draw();
		/* 팝업 레이어 */
		intro_layer.draw();
		/* 성별 선택 팝업 */
		if(select_bg.appear || select_bg.active){
			select_bg.draw();
			select_exit_btn.draw();select_start_btn.draw();
			select_male_btn.draw();select_female_btn.draw();
		}
		/* 게임 방법 팝업 */
		if(method_bg.appear || method_bg.active){
			method_bg.draw();method_content.draw();
			method_exit_btn.draw();method_prev_btn.draw();method_next_btn.draw();
			for(let i=0;i<method_dot_arr.length;i++){
				method_dot_arr[i].draw();
			}		
		}
	}
	introLoop = function(){
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		methodPopupFunc();
		draw();
		requestAnimFrame(introLoop);															// 게임 애니 시작
	};
	introLoop();
}
function main(){
	popup = false;
	pageType = "main";
	let main_bg = new Main_bg();
	let main_game_over = new Main_game_over();
	let main_game_clear = new Main_game_clear();
	(function(){
		main_level = new Main_level();
		main_top = new Main_top();
		main_right = new Main_right();
		main_btm = new Main_btm();
		main_help = new Main_help();
		main_top_lv = new Main_top_lv();
		main_right_char = new Main_right_char();
		main_right_angry = new Main_right_angry();
		main_right_gage = new Main_right_gage();
		main_exit_btn = new Main_exit_btn();
		black_layer = new Black_layer();
		main_text = new Main_text();
		main_eff = new Main_eff();
		main_exit_bg = new Main_exit_bg();
		main_exit_yes_btn = new Main_exit_yes_btn();
		main_exit_no_btn = new Main_exit_no_btn();
		main_reset_btn = new Main_reset_btn();
		main_right_txt_arr = new Array();
		main_folder_arr = new Array();
		main_npc_arr = new Array();
		main_baloon_arr = new Array();
		main_gage_red_arr = new Array();

		for(let i=0;i<5;i++){
			main_right_txt_arr.push(new Main_right_txt());
			main_right_txt_arr[i].x = (838 + i * 20);
			if(i < 3){
				main_right_txt_arr[i].isYellow = true;
			}
			else{
				main_right_txt_arr[i].isYellow = false;
			}
		}
		main_right_txt_arr[2].val = 10;
		
		for(let i=0;i<TOT_FOLDER_NUM;i++){
			main_folder_arr.push(new Main_folder());
			main_folder_arr[i].x = (30 + i * 150);
		}
		main_folder_arr[0].type = 3;main_folder_arr[1].type = 0;main_folder_arr[2].type = 4;
		main_folder_arr[3].type = 1;main_folder_arr[4].type = 2;
		for(let i=0;i<TOT_NPC_NUM;i++){
			main_npc_arr.push(new Main_npc());
			main_npc_arr[i].x = (50 + i * 160);

			main_baloon_arr.push(new Main_baloon());
			main_baloon_arr[i].x = i * 140;
			main_baloon_arr[i].x_name = main_baloon_arr[i].x + main_baloon_arr[i].w * 0.5;
			main_baloon_arr[i].x_question = i * 140;		

			main_gage_red_arr.push(new Main_gage_red());
			main_gage_red_arr[i].x = (60 + i * 160);
		}
		convPopupCtrl(true);
	})();
	function npcFinishFunc(){
		for(let i=0;i<TOT_NPC_NUM;i++){
			if(main_gage_red_arr[i].end){
				main_npc_arr[i].comp(1);
				main_right_char.angry = true;
				gageFunc();				
				main_gage_red_arr[i].end = false;
			}

			if(main_npc_arr[i].aniFin){
				main_npc_arr[i].close();
				main_baloon_arr[i].close();
				main_gage_red_arr[i].close();

				if(cur_mission >= tot_mission){
					clearInterval(gameTimeInterval);
					uiCtrl(false);
					setTimeout(function(){
						levelAlert();				
					},250);
				}
				main_npc_arr[i].aniFin = false;
			}
		}
	}
	function rightTextFunc(){
		main_right_txt_arr[0].val = Math.floor(cur_mission / 10);
		main_right_txt_arr[1].val = cur_mission % 10;
		if(tot_mission >= 10){
			main_right_txt_arr[3].val = Math.floor(tot_mission / 10);
			main_right_txt_arr[4].val = tot_mission % 10;
		}
		else{
			main_right_txt_arr[3].val = tot_mission % 10;
		}
	}
	function draw(){
		main_bg.draw();		
		if(gameOver){
			black_layer.draw();
			main_game_over.draw();
			main_reset_btn.draw();
		}
		else if(gameClear){
			black_layer.draw();
			main_game_clear.draw();
			main_reset_btn.draw();
		}
		else{
			main_level.draw();
			for(let i=0;i<TOT_NPC_NUM;i++){
				main_npc_arr[i].draw();
				main_baloon_arr[i].draw();
				main_gage_red_arr[i].draw();
			}
			main_top.draw();
			main_right.draw();
			main_btm.draw();
			main_help.draw();

			main_top_lv.draw();
			main_right_char.draw();
			main_right_angry.draw();
			main_right_gage.draw();
			main_exit_btn.draw();

			if(cur_mission >= 10){				
				main_right_txt_arr[0].draw();
			}
			if(tot_mission >= 10){
				main_right_txt_arr[4].draw();	
			}
			for(let i=1;i<4;i++){
				main_right_txt_arr[i].draw();	
			}
			for(let i=0;i<TOT_FOLDER_NUM;i++){
				main_folder_arr[i].draw();
			}
			if(main_text.active){
				main_text.draw();
			}
			if(main_eff.active){
				main_eff.draw();
			}
			/* 종료 팝업 */
			if(main_exit_bg.active || main_exit_bg.appear){
				black_layer.draw();
				main_exit_bg.draw();
				main_exit_yes_btn.draw();main_exit_no_btn.draw();
			}
			/* 대화 팝업 */
			conv_skip_btn.draw();
			conv_press.draw();
			conv_user_bg.draw();
			conv_pc_bg.draw();
			if((conv_user_bg.appear && conv_user_bg.active) || (conv_pc_bg.appear && conv_pc_bg.active)){
				conv_start_btn.draw();
				conv_next_btn.draw();
			}
			conv_user_char.draw();
			conv_pc_char.draw();
			if(conv_user_bg.appear || conv_user_bg.active){													
				conv_user_text.draw();
			}
			if(conv_pc_bg.appear || conv_pc_bg.active){													
				conv_pc_text.draw();
			}
		}
	}
	mainLoop = function(){
		ctx.clearRect(0, 0, cvs.width, cvs.height);	
		npcFinishFunc();
		rightTextFunc();
		draw();
		requestAnimFrame(mainLoop);															// 게임 애니 시작
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
		method_content.idx = 0;method_content.crpX = 0;											// 팝업 킬때 첫번째부터 시작
	}
	popup = bool;
	intro_layer.appear = bool;
	method_bg.appear = bool;
	method_content.appear = bool;
	method_exit_btn.appear = bool;
	method_prev_btn.appear = bool;
	method_next_btn.appear = bool;
	for(let i=0;i<method_dot_arr.length;i++){
		method_dot_arr[i].appear = bool;
	}		
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
function stageSetting(){
	audioPlay(3);
	stage++;
	cur_mission	= 0;
	npcTotIdx = 0;
	main_right_char.angry = false;
	if(stage < 6){
		main_folder_arr[stage-1].active = true;
		tot_mission = stage * 2;
	}
	else{
		tot_mission = 20;
	}
}
function convPopupCtrl(bool){
	popup = bool;
	if(bool){
		convIdx = 0;
		conv_user_bg = new Conv_user_bg();
		conv_user_text = new Conv_user_text();
		conv_user_char = new Conv_user_char();
		conv_pc_bg = new Conv_pc_bg();
		conv_pc_text = new Conv_pc_text();
		conv_pc_char = new Conv_pc_char();
		conv_next_btn = new Conv_next_btn();
		conv_start_btn = new Conv_start_btn();
	}
	else{
		conv_user_bg.on = false;
		conv_user_text.on = false;
		conv_user_char.on = false;
		conv_pc_bg.on = false;
		conv_pc_text.on = false;
		conv_pc_char.on = false;
		conv_pc_bg.appear = false;
		conv_pc_text.appear = false;
		conv_pc_char.appear = false;
	}
	intro_layer.appear = bool;
	conv_user_bg.appear = bool;
	conv_user_char.appear = bool;
	conv_user_text.appear = bool;
	conv_skip_btn.appear = bool;
	conv_press.appear = bool;

	if(bool){
		convFunc();
	}
	else{
		levelAlert();
		clearInterval(typeInterval);
	}
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
		for(let i=0;i<conv_Arr[stage][convIdx-1].length;i++){
			conv_user_result_Arr.push(new Array(""));
		}
	}
	else{
		conv_pc_result_Arr = new Array();
		for(let i=0;i<conv_Arr[stage][convIdx-1].length;i++){
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
	if(typingColIdx < conv_Arr[stage][convIdx-1].length){
		typeSplitText = conv_Arr[stage][convIdx-1][typingColIdx].split("");
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
		for(let i=0;i<conv_Arr[stage][convIdx-1].length;i++){
			let txt = conv_Arr[stage][convIdx-1][i];		
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
		if(convIdx >= conv_Arr[stage].length){
			conv_next_btn.clickable = false;
			conv_skip_btn.appear = false;
			conv_start_btn.clickable = true;
		}
		else{
			if(conv_user_bg.active){
				convPopupProcessCtrl(false);
			}
			else if(conv_pc_bg.active){
				convPopupProcessCtrl(true);
			}
		}
	}
}
function levelAlert(){
	if(main_level.val % 2 == 0){
		stageSetting();
	}
	main_level.active = true;
	main_level.appear = true;
}
function uiCtrl(bool){
	if(bool){
		main_right_gage.reset();
		gameTime= 0;
		gameTimeInterval = setInterval(npcStartFunc,1000);
	}
	main_top.appear = bool;
	main_right.appear = bool;
	main_btm.appear = bool;
	main_help.appear = bool;

	main_top_lv.appear = bool;
	main_right_char.appear = bool;
	main_right_angry.appear = bool;
	main_right_gage.appear = bool;
	main_exit_btn.appear = bool;
	for(let i=0;i<main_right_txt_arr.length;i++){
		main_right_txt_arr[i].appear = bool;
	}
	for(let i=0;i<main_folder_arr.length;i++){
		main_folder_arr[i].appear = bool;
	}
}
function exitCtrl(bool){
	if(bool){
		for(let i=0;i<TOT_NPC_NUM;i++){
			main_gage_red_arr[i].pause = true;
		}		
		clearInterval(gameTimeInterval);
	}
	else{	
		for(let i=0;i<TOT_NPC_NUM;i++){
			main_gage_red_arr[i].pause = false;
		}			
		gameTimeInterval = setInterval(npcStartFunc,1000);
	}
	popup = bool;
	main_exit_bg.appear = bool;
	main_exit_yes_btn.appear = bool;
	main_exit_no_btn.appear = bool;
}
function checkIfCorrect(idx){
	main_gage_red_arr[npcClickIdx].pause = true;
	if(idx == main_npc_arr[npcClickIdx].ans){
		audioPlay(3);
		main_npc_arr[npcClickIdx].comp(0);
		main_eff.show(0);
		main_right_char.angry = false;
	}
	else{
		audioPlay(4);
		main_npc_arr[npcClickIdx].comp(1);
		main_eff.show(1);
		main_right_char.angry = true;
		gageFunc();
	}
	main_npc_arr[npcClickIdx].clickable = false;
}
function gageFunc(){
	let diff = 0;
	if(stage == 1 || stage == 2){
		diff = 2;
	}
	else if(stage == 3 || stage == 4){
		diff = 4;
	}
	else if(stage == 5 || stage == 6){
		diff = 5;
	}	
	main_right_gage.chtmp += (200 / diff);
	if(main_right_gage.chtmp >= 250){
		clearInterval(gameTimeInterval);
		gameOver = true;
	}
}
function npcStartFunc(){
	if(gameTime % 6 == 0){
		if(npcTotIdx < tot_mission){
			let tmpArr = new Array();
			for(let i=0;i<TOT_NPC_NUM;i++){
				if(!main_npc_arr[i].appear && !main_npc_arr[i].complete){
					tmpArr.push(i);
				}
			}
			if(tmpArr.length > 0){
				let rand_loc = Math.floor(Math.random()*100)%tmpArr.length;
				let rand_idx = 0;
				let rand_ans = 0;
				
				if(stage == 1){
					rand_idx = Math.floor(Math.random()*100)%1;
				}
				else if(stage == 2){
					rand_idx = Math.floor(Math.random()*100)%5;
				}				
				else if(stage == 3){
					rand_idx = Math.floor(Math.random()*100)%6;
				}		
				else if(stage == 4){
					rand_idx = Math.floor(Math.random()*100)%8;	
				}	
				else{
					rand_idx = Math.floor(Math.random()*100)%10;
				}

				if(rand_idx == 0){
					rand_ans = 0;
				}
				else if(0 < rand_idx && rand_idx <= 4){
					rand_ans = 1;
				}
				else if(rand_idx == 5){
					rand_ans = 2;
				}
				else if(rand_idx == 6 || rand_idx == 7){
					rand_ans = 3;
				}
				else{
					rand_ans = 4;
				}
				main_npc_arr[tmpArr[rand_loc]].show(rand_idx,rand_ans);
				main_gage_red_arr[tmpArr[rand_loc]].show();
				main_baloon_arr[tmpArr[rand_loc]].init(rand_idx,rand_ans);
			}
		}
	}
	gameTime++;
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
			if(method_bg.appear && method_bg.active){
				if(mouseCd(method_exit_btn)){
					$("canvas").css("cursor","pointer");
					method_exit_btn.mouseOver = true;
				}
				else if(mouseCd(method_prev_btn)){
					if(method_prev_btn.on){
						$("canvas").css("cursor","pointer");
						method_prev_btn.mouseOver = true;
					}
				}
				else if(mouseCd(method_next_btn)){
					if(method_next_btn.on){
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
			else if(select_bg.appear && select_bg.active){
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
		}
	}
	if(pageType == "main") {
		if(!popup){
			if(gameOver || gameClear){
				if(mouseCd(main_reset_btn)){
					$("canvas").css("cursor","pointer");
					main_reset_btn.mouseOver = true;
				}
				else{
					main_reset_btn.mouseOver = false;
				}					
			}
			else{
				if(!npcClick){
					if(main_exit_btn.active && mouseCd(main_exit_btn)){
						$("canvas").css("cursor","pointer");
						main_exit_btn.mouseOver = true;
					}
					else{
						main_exit_btn.mouseOver = false;
					}		
					
					for(let i=0;i<TOT_NPC_NUM;i++){
						if(main_npc_arr[i].clickable && main_npc_arr[i].active && mouseCd(main_npc_arr[i])){
							$("canvas").css("cursor","pointer");
							main_npc_arr[i].mouseOver = true;
							main_baloon_arr[i].show();
						}
						else{
							main_npc_arr[i].mouseOver = false;
							main_baloon_arr[i].close();
						}
					}
				}
				else{
					main_text.x = mouseX / wR - main_text.w * 0.5;
					main_text.y = mouseY / hR - main_text.h * 0.5;
					for(let i=0;i<TOT_FOLDER_NUM;i++){
						if(main_folder_arr[i].active && mouseCd(main_folder_arr[i])){
							$("canvas").css("cursor","pointer");
							main_folder_arr[i].mouseOver = true;
						}
						else{
							main_folder_arr[i].mouseOver = false;
						}
					}
				}
			}
		}
		else{
			if((conv_user_bg.appear && conv_user_bg.active) || (conv_pc_bg.appear && conv_pc_bg.active)){
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
			else if(main_exit_bg.appear && main_exit_bg.active){
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
					main_exit_yes_btn.mouseOver = false;
					main_exit_no_btn.mouseOver = false;
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
		if(!popup){
			if(!gameOver && !gameClear){
				if(!npcClick){		
					for(let i=0;i<TOT_NPC_NUM;i++){
						if(main_npc_arr[i].clickable && main_npc_arr[i].active && mouseCd(main_npc_arr[i])){
							main_npc_arr[i].mouseOver = false;
							main_gage_red_arr[i].pause = true;
							main_text.show();
							npcClickIdx = i;
							npcClick = true;
						}
					}
				}
			}
		}
	}
});
document.addEventListener(mouseEv("up"),function(e){
	if(pageType == "intro") {
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
			if(method_bg.appear && method_bg.active){		
				if(mouseCd(method_exit_btn)){
					audioPlay(1);
					method_exit_btn.mouseOver = false;
					introBtnCtrl(true);
					methodPopupCtrl(false);
				}
				else if(mouseCd(method_prev_btn)){
					if(method_prev_btn.on){
						audioPlay(1);
						method_prev_btn.mouseOver = false;
						method_content.idx--;
						method_content.slideLeft = true;
					}
				}
				else if(mouseCd(method_next_btn)){
					if(method_next_btn.on){
						audioPlay(1);
						method_next_btn.mouseOver = false;
						method_content.idx++;
						method_content.slideRight = true;
					}
				}
			}
			else if(select_bg.appear && select_bg.active){
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
					setTimeout(function(){
						introLoop = function(){return;}
						main();
					},500);
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
		}
	}
	if(pageType == "main") {
		if(!popup){
			if(gameOver){
				main_reset_btn.mouseOver = false;
				if(mouseCd(main_reset_btn)){
					location.href = "index.html";
				}
			}
			else if(gameClear){
				main_reset_btn.mouseOver = false;
				if(mouseCd(main_reset_btn)){
					_isPorted ? parent.gameResult() : location.href = "index.html";
				}				
			}
			else{
				if(!npcClick){
					main_exit_btn.mouseOver = false;
					if(main_exit_btn.active && mouseCd(main_exit_btn)){
						audioPlay(1);
						exitCtrl(true);
					}	
				}
				else{
					npcClick = false;
					main_text.active = false;
					for(let i=0;i<TOT_NPC_NUM;i++){
						main_gage_red_arr[i].pause = false;
						main_baloon_arr[i].close();
					}
					for(let i=0;i<TOT_FOLDER_NUM;i++){
						main_folder_arr[i].mouseOver = false;
						if(main_folder_arr[i].active && mouseCd(main_folder_arr[i])){
							checkIfCorrect(i);
						}
					}
				}
			}
		}
		else{
			if((conv_user_bg.appear && conv_user_bg.active) || (conv_pc_bg.appear && conv_pc_bg.active)){
				if(mouseCd(conv_skip_btn)){
					if(conv_skip_btn.clickable){
						conv_skip_btn.mouseOver = false;
						convPopupCtrl(false);
					}
				}
				else if(mouseCd(conv_next_btn)){
					if(conv_next_btn.clickable){
						audioPlay(1);
						conv_next_btn.mouseOver = false;						
						if(convIdx >= conv_Arr[stage].length){
							conv_next_btn.clickable = false;
							conv_skip_btn.appear = false;
							conv_start_btn.clickable = true;
						}
						else{
							if(conv_user_bg.active){
								convPopupProcessCtrl(false);
							}
							else if(conv_pc_bg.active){
								convPopupProcessCtrl(true);
							}
						}
					}
				}
				else if(mouseCd(conv_start_btn)){
					if(conv_start_btn.clickable){
						conv_start_btn.mouseOver = false;
						convPopupCtrl(false);
					}
				}
				else{
					if(convIdx-1 < conv_Arr[stage].length){
						convSkipFunc();
					}
				}
			}
			else if(main_exit_bg.appear && main_exit_bg.active){
				main_exit_yes_btn.mouseOver = false;
				main_exit_no_btn.mouseOver = false;
				if(mouseCd(main_exit_yes_btn)){
					location.href = "index.html";
				}
				else if(mouseCd(main_exit_no_btn)){
					audioPlay(1);
					exitCtrl(false);
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