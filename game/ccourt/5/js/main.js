/*
 *	회사명 : (주)씨에스랩
 *	작성자 : 최진우
 *	작성일 : 2020/10/08
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
	["intro/btn_start.png"],
	["intro/btn_method.png"],
	["intro/btn_sound.png"],																	// 5
	["intro/layer.png"],
	["intro/method/bg.png"],	
	["intro/method/content.png"],
	["intro/method/btn_exit.png"],
	["intro/method/btn_prev.png"],																// 10
	["intro/method/btn_next.png"],
	["intro/method/dot.png"],
	["intro/select/bg.png"],	
	["intro/select/btn_exit.png"],
	["intro/select/btn_start.png"],																// 15
	["intro/select/gender.png"],
	["intro/conv/bg.png"],		
	["intro/conv/char.png"],	
	["intro/conv/btn_skip.png"],
	["intro/conv/btn_next.png"],																// 20
	["intro/conv/btn_start.png"],
	["intro/conv/press.png"],
	["main/bg.png"],
	["main/bg_quiz.png"],		
	["main/back_btn.png"],																		// 25
	["main/sprite_man.png"],
	["main/sprite_woman.png"],
	["main/login.png"],
	["main/count.png"],
	["main/level.png"],																			//30
	["main/quiz_start.png"],
	["main/start_btn.png"],
	["main/exit/bg.png"],
	["main/exit/yes_btn.png"],
	["main/exit/no_btn.png"],																	//35
	["main/btn_exit.png"],
	["main/quiz/bg_ox.png"],
	["main/quiz/bg_multi.png"],
	["main/quiz/airplane_line.png"],
	["main/quiz/airplane.png"],																	//40
	["main/quiz/itemChance.png"],
	["main/quiz/itemChance_text.png"],
	["main/quiz/sprite_ox.png"],
	["main/quiz/sprite_multi.png"],
	["main/quiz/num_timer.png"],																//45
	["main/stage_comp.png"],
	["main/result/success_stage.png"],
	["main/result/success_final.png"],	
	["main/result/return_btn.png"],
	["main/result/fail.png"],																	//50
	["main/result/image_ox.png"],
	["main/result/success_fail.png"],
];
const aud_Arr	= [
	["bgm.mp3"],																				// 0
	["btn_click.mp3"],
	["game_over.mp3"],
	["correct.mp3"],
	["wrong.mp3"],
	["question.mp3"],
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
const Intro_logo = function(){
	this.w = 468;
	this.h = 284;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = -30;
	this.cx = 0;this.cy = 0;this.cw = 468;this.ch = 284;
	this.movingDown = true;
	this.draw = function(){
		try{ 
			if(this.y > -20){
				this.movingDown = false;
			}
			else if(this.y < -30){
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
const Intro_start_btn = function(){
	this.w = 164;
	this.h = 57;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 415;
	this.cy = 0;this.cw = 164;this.ch = 57;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.clickable = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 164;
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
			ctx.drawImage(cvs_Arr[3], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Intro_method_btn = function(){
	this.w = 164;
	this.h = 57;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 470;
	this.cy = 0;this.cw = 164;this.ch = 57;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.clickable = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 164;
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
const Intro_sound_btn = function(){
	this.x = 720;
	this.y = 45;
	this.w = 65;
	this.h = 65;
	this.cy = 0;this.cw = 65;this.ch = 65;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.clickable = false;
	this.draw = function(){
		try{ 
			if(volume){
				if(this.mouseOver){
					this.cx = 130;
				}
				else{
					this.cx = 0;
				}
			}
			else{
				if(this.mouseOver){
					this.cx = 195;
				}
				else{
					this.cx = 65;
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
	this.w = 666;
	this.h = 405;
	this.x = 65;
	this.y = 110;
	this.cx = 0;this.cy = 0;this.cw = 666;this.ch = 405;
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
const Method_content = function(){
	this.w = 600;
	this.h = 270;
	this.x = 100;
	this.y = 185;
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
			ctx.drawImage(cvs_Arr[8], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Method_exit_btn = function(){
	this.x = 685;
	this.y = 78;
	this.w = 74;
	this.h = 74;
	this.cy = 0;this.cw = 74;this.ch = 74;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 74;
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
			ctx.drawImage(cvs_Arr[9], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Method_prev_btn = function(){
	this.x = 265;
	this.y = 461;
	this.w = 98;
	this.h = 40;
	this.cy = 0;this.cw = 98;this.ch = 40;
	this.mouseOver = false;
	this.on = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 98;
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
	this.x = 430;
	this.y = 461;
	this.w = 98;
	this.h = 40;
	this.cy = 0;this.cw = 98;this.ch = 40;
	this.mouseOver = false;
	this.on = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 98;
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
	this.cx = 0;this.cy = 0;this.cw = 11;this.ch = 10;
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
			ctx.drawImage(cvs_Arr[12], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Select_bg = function(){
	this.w = 625;
	this.h = 360;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 120;
	this.cx = 0;this.cy = 0;this.cw = 625;this.ch = 360;
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
	this.x = 670;
	this.y = 88;
	this.w = 74;
	this.h = 74;
	this.cy = 0;this.cw = 74;this.ch = 74;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 74;
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
	this.w = 163;
	this.h = 56;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 410;
	this.cy = 0;this.cw = 163;this.ch = 56;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 163;
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
	this.w = 261;
	this.h = 201;
	this.x = 140;
	this.y = 193;
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
	this.w = 261;
	this.h = 201;
	this.x = 405;
	this.y = 193;
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
	this.h = 188 ;
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
	this.draw = function(){
		try{ 
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.x -= 5;
				}
				else{
					this.active = true;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.x += 5;
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
	this.draw = function(){
		try{ 
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
	this.w = 241;
	this.h = 241;
	this.x = 50;
	this.y = 190;
	this.cx = 0;this.cy = 0;this.cw = 241;this.ch = 242;
	this.globalAlpha = 0;
	this.appear = false;
	this.on = false;
	this.draw = function(){
		try{
			if(gender == 1){
				this.cx = 0;
			}
			else{
				this.cx = 241;
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[18], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Conv_pc_char = function(){
	this.w = 241;
	this.h = 241;
	this.x = 620;
	this.y = 150;
	this.cx = 482;this.cy = 0;this.cw = 241;this.ch = 242;
	this.globalAlpha = 0;
	this.appear = false;
	this.on = true;
	this.draw = function(){
		try{
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[18], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Conv_skip_btn = function(){
	this.x = 670;
	this.y = 60;
	this.w = 103;
	this.h = 44;
	this.cy = 0;this.cw = 103;this.ch = 44;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.clickable = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 103;
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
			ctx.drawImage(cvs_Arr[19], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
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
				ctx.drawImage(cvs_Arr[20], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
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
					this.cy = 81;
				}
				else{
					this.cy = 54;
				}
				ctx.drawImage(cvs_Arr[21], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
		}
		catch(e){}
	};
};
const Conv_press = function(){
	this.w = 408;
	this.h = 45;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 490;
	this.cx = 0;this.cy = 0;this.cw = 408;this.ch = 45;
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
			ctx.drawImage(cvs_Arr[23], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Main_bg_quiz = function(){
	this.w = 723;
	this.h = 193;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = -40;
	this.cx = 0;this.cy = 0;this.cw = 723;this.ch = 193;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.draw = function(){
		try{
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y += 2;
				}
				else{
					this.active = true;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y -= 2;
				}
				else{
					this.active = false;
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
const Main_back_btn = function(){
	this.x = 30;
	this.y = 470;
	this.w = 97;
	this.h = 39;
	this.cy = 0;this.cw = 97;this.ch = 39;
	this.mouseOver = false;
	this.active = true;
	this.draw = function(){
		try{
			if(this.mouseOver){
				this.cx = 97;
			}
			else{
				this.cx = 0;
			}
			ctx.drawImage(cvs_Arr[25], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Main_char = function(){
	this.x = 315;
	this.y = 270;
	this.w = 163;
	this.h = 130;
	this.cx = 0;this.cy = 0;this.cw = 163;this.ch = 130;
	this.ani = 0;
	this.ani_normal = true;
	this.ani_correct = false;
	this.delay = 0;
	this.draw = function(){
		try{
			if(this.ani_normal){
				this.ani++;
				if(this.ani >= 60){
					this.ani = 0;
				}
			}
			else{
				if(this.ani_correct){
					if(this.ani >= 157){
						this.ani = 157;
					}
					else{
						this.ani++;						
					}
				}
				else{
					if(this.ani >= 119){
						this.ani = 75;
					}
					else{
						this.ani++;	
					}
				}
				this.delay++;
				if(this.delay == 80){
					quizSetting(false);
				}
				else if(this.delay == 90){
					this.delay = 0;
					quizAlert();
				}
			}
			this.cx = Math.floor((this.ani % 15) / 3) * 163;
			this.cy = Math.floor(this.ani / 15) * 130;
			ctx.drawImage(cvs_Arr[25 + gender], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
	this.status = function(val){
		if(val == "normal"){
			this.ani_normal = true;
			this.ani = 0;
		}
		else if(val == "correct"){
			this.ani_normal = false;
			this.ani_correct = true;
			this.ani = 120;
		}
		else if(val == "wrong"){
			this.ani_normal = false;
			this.ani_correct = false;
			this.ani = 75;
		}

	};
};
const Main_login = function(){
	this.w = 397;
	this.h = 45;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 152;
	this.cx = 0;this.cw = 397;this.ch = 45;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.ani = 0;
	this.draw = function(){
		try{
			this.ani++;
			if(this.ani >= 5 * 17){
				this.ani = 0;
			}
			this.cy = Math.floor(this.ani / 5) * 45;
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y += 2;
				}
				else{
					this.active = true;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y -= 2;
				}
				else{
					this.active = false;
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
const Main_count = function(){
	this.x = 0;
	this.y = 440;
	this.w = 14;
	this.h = 15;
	this.cx = 0;this.cy = 0;this.cw = 14;this.ch = 15;
	this.draw = function(){
		try{
			ctx.drawImage(cvs_Arr[29], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Main_level = function(){
	this.x = 0;
	this.y = 32;
	this.w = 157;
	this.h = 100;
	this.cw = 157;this.ch = 100;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.on = false;
	this.complete = false;
	this.val = 0;
	this.draw = function(){
		try{
			if(this.on){
				this.cx = (this.val % 2) * 2 * 157;
			}
			else{
				this.cx = ((this.val % 2) * 2 + 1) * 157;
			}
			this.cy = Math.floor(this.val / 2) * 100;

			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y += 2;
				}
				else{
					this.active = true;
				}
			}
			else{
				this.active = false;
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y -= 2;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[30], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_stage_comp = function(){
	this.x = 0;
	this.y = 52;
	this.w = 69;
	this.h = 54;
	this.cx = 0;this.cy = 0;this.cw = 69;this.ch = 54;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
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
			ctx.drawImage(cvs_Arr[46], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
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
const Main_quiz_pop_bg = function(){
	this.w = 639;
	this.h = 241;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 639;this.ch = 241;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;

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
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
				}
				else{
					this.active = false;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[31], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_quiz_pop_lv = function(){
	this.x = 250;
	this.y = 210;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.val = "";
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
			ctx.font = "bold "+(22 * hR)+"px '나눔스퀘어'";ctx.fillStyle = "#0B378E";ctx.textAlign = "center";
			ctx.fillText(this.val, this.x * wR, this.y * hR);
			ctx.restore();
		}
		catch(e){}
	};
	this.valSet = function(i){
		if(i == 0){
			this.val = "쉬움";
		}
		else if(i == 1){
			this.val = "보통";
		}
		else if(i == 2){
			this.val = "어려움";
		}
		else if(i == 3){
			this.val = "아주어려움";
		}
	};
};
const Main_quiz_pop_ment = function(){
	this.x = 480;
	this.y = 210;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.val = "스피드퀴즈를 시작합니다.";
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
			ctx.font = "bold "+(22 * hR)+"px '나눔스퀘어'";ctx.fillStyle = "#34393C";ctx.textAlign = "center";
			ctx.fillText(this.val, this.x * wR, this.y * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_quiz_pop_cd = function(){
	this.x = 400;
	this.y = 265;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.val = "합격조건 : 10문제 중 8문제 이상 맞추기";
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
			ctx.font = "bold "+(22 * hR)+"px '나눔스퀘어'";ctx.fillStyle = "#0469C1";ctx.textAlign = "center";
			ctx.fillText(this.val, this.x * wR, this.y * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_quiz_startbtn = function(){
	this.x = 315;
	this.y = 300;
	this.w = 163;
	this.h = 56;
	this.cx = 0;this.cy = 0;this.cw = 163;this.ch = 56;
	this.globalAlpha = 0;
	this.appear = false;
	this.mouseOver = false;
	this.draw = function(){
		try{
			if(this.mouseOver){
				this.cx = 163;
			}
			else{
				this.cx = 0;
			}
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
			ctx.drawImage(cvs_Arr[32], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();

		}
		catch(e){}
	};
};
const Main_exit_bg = function(){
	this.w = 666;
	this.h = 240;
	this.x = 67;
	this.y = 180;
	this.cx = 0;this.cy = 0;this.cw = 666;this.ch = 240;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
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
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
				}
				else{
					this.active = false;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[33], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_exit_yes = function(){
	this.x = 250;
	this.y = 360;
	this.w = 144;
	this.h = 50;
	this.cx = 0;this.cy = 0;this.cw = 144;this.ch = 50;
	this.globalAlpha = 0;
	this.appear = false;
	this.mouseOver = false;
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
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
				}
				else{
					this.active = false;
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
const Main_exit_no = function(){
	this.x = 400;
	this.y = 360;
	this.w = 144;
	this.h = 50;
	this.cx = 0;this.cy = 0;this.cw = 144;this.ch = 50;
	this.globalAlpha = 0;
	this.appear = false;
	this.mouseOver = false;
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
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
				}
				else{
					this.active = false;
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
const Quiz_alert = function(){
	this.x = 400;
	this.y = 100;
	this.w = 800;
	this.h = 130;
	this.val = 0;
	this.globalAlpha = 0;
	this.delay = 0;
	this.appear = false;
	this.load = false;
	this.active = false;
	this.draw = function() {
		if(this.active){
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y += 5;
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
					this.y -= 5;
				}
				else{
					quizSetting(true);
					this.active = false;
				}
			}
			
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.beginPath();
			ctx.rect(0, this.y * hR, this.w * wR, this.h * hR);
			ctx.fillStyle = "black";
			ctx.fill();
			ctx.restore();

			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.fillStyle = "yellow";ctx.font = "bold " + (50 * hR) + "px '나눔스퀘어'";ctx.textAlign = "center";
			ctx.fillText("문제 "+this.val, this.x * wR, (this.y + 85) * hR);
			ctx.restore();
		}
	}
	this.show = function(){
		this.active = true;
		this.appear = true;
		this.val++;
	};
};
const Quiz_bg = function(){
	this.w = 704;
	this.h = 263;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = -40;
	this.cx = 0;this.cy = 0;this.cw = 704;this.ch = 263;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.type = 0;
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
			ctx.drawImage(cvs_Arr[37+this.type], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_air_line = function(){
	this.x = 31.5;
	this.y = 232;
	this.w = 721;
	this.h = 27;
	this.cx = 0;this.cy = 0;this.cw = 721;this.ch = 27;
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
			ctx.drawImage(cvs_Arr[39], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_air = function(){
	this.x = 80;
	this.y = 222;
	this.w = 102;
	this.h = 37;
	this.cx = 0;this.cy = 0;this.cw = 102;this.ch = 37;
	this.globalAlpha = 0;
	this.appear = false;
	this.move = false;
	this.moveSet = false;
	this.targetX = 0;
	this.draw = function(){
		try{
			if(this.move){
				if(!this.moveSet){
					this.targetX = this.x + 35;
					this.moveSet = true;
				}
				if(this.x < this.targetX){
					this.x += 2.5;
				}
				else{
					this.move = false;
					this.moveSet = false;
				}
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
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[40], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_item_btn = function(){
	this.x = 570;
	this.y = 400;
	this.w = 217;
	this.h = 86;
	this.cx = 0;this.cy = 0;this.cw = 217;this.ch = 86;
	this.globalAlpha = 0;
	this.mouseOver = false;
	this.ifOX = false;
	this.appear = false;
	this.active = false;
	this.on = false;
	this.draw = function(){
		try{
			if(this.ifOX){
				this.cx = 434;
			}
			else{
				if(this.on){
					if(this.mouseOver){
						this.cx = 217;
					}
					else{
						this.cx = 0;
					}
				}
			}
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y += 2;
				}
				else{
					this.active = true;
				}
			}
			else{
				this.active = false;
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y -= 2;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[41], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_item_text = function(){
	this.x = 710;
	this.y = 402;
	this.w = 29;
	this.h = 21;
	this.cx = 0;this.cy = 0;this.cw = 29;this.ch = 21;
	this.globalAlpha = 0;
	this.appear = false;
	this.val = 3;
	this.draw = function(){
		try{
			this.cx = (3 - this.val) * 29;
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
			ctx.drawImage(cvs_Arr[42], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_info = function(){
	this.left_x = 160;
	this.right_x = 320;
	this.y = -7;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.idx = 0;
	this.val = 0;
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
			ctx.font = "bold "+(15 * hR)+"px '나눔스퀘어'";ctx.fillStyle = "#000";ctx.textAlign = "center";
			ctx.fillText("문제:"+this.idx+"/10", this.left_x * wR, this.y * hR);
			ctx.fillText("분야:"+this.val, this.right_x * wR, this.y * hR);
			ctx.restore();
		}
		catch(e){}
	};
	this.valSet = function(i){
		if(i == 0){
			this.val = "쉬움";
		}
		else if(i == 1){
			this.val = "보통";
		}
		else if(i == 2){
			this.val = "어려움";
		}
		else if(i == 3){
			this.val = "아주어려움";
		}
	};
};
const Quiz_title = function(){
	this.x = 85;
	this.y = 25;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.val = "";
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
			ctx.font = "bold "+(15 * hR)+"px '나눔스퀘어'";ctx.fillStyle = "#000";ctx.textAlign = "left";
			let tmp_arr = this.val.split("\n");
			for(let i=0;i<tmp_arr.length;i++){
				ctx.fillText(tmp_arr[i], this.x * wR, (this.y + i * 18) * hR);
			}
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_op = function(){
	this.x = 115;
	this.y = 110;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.val = new Array();
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
			ctx.font = "bold "+(15 * hR)+"px '나눔스퀘어'";ctx.fillStyle = "#000";ctx.textAlign = "left";
			for(let i=0;i<this.val.length;i++){
				ctx.fillText(this.val[i], this.x * wR, (this.y + i * 25) * hR);
			}
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_ans_ox = function(){
	this.x = 0;
	this.y = 148;
	this.w = 116;
	this.h = 41;
	this.cx = 0;this.cy = 0;this.cw = 116;this.ch = 41;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.type = 0;
	this.correct = false;
	this.complete = false;
	this.on = true;
	this.draw = function(){
		try{
			if(this.complete){
				if(this.correct){
					this.cx = 464;
				}
				else{
					this.cx = 580;
				}
			}
			else{
				if(this.type == 0){
					if(this.mouseOver){
						this.cx = 116;
					}
					else{
						this.cx = 0;
					}
				}
				else{
					if(this.mouseOver){
						this.cx = 348;
					}
					else{
						this.cx = 232;
					}
				}
			}
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y += 2;
				}
				else{
					this.active = true;
				}
			}
			else{
				this.active = false;
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y -= 2;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[43], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();


		}
		catch(e){}
	};
};
const Quiz_ans_da = function(){
	this.x = 0;
	this.y = 148;
	this.w = 41;
	this.h = 41;
	this.cx = 0;this.cy = 0;this.cw = 41;this.ch = 41;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.type = 0;
	this.correct = false;
	this.complete = false;
	this.on = true;
	this.draw = function(){
		try{
			if(this.complete){
				if(this.correct){
					this.cx = 328;
				}
				else{
					this.cx = 369;
				}
			}
			else{
				if(this.type == 0){
					if(this.mouseOver){
						this.cx = 41;
					}
					else{
						this.cx = 0;
					}
				}
				else if(this.type == 1){
					if(this.mouseOver){
						this.cx = 123;
					}
					else{
						this.cx = 82;
					}
				}
				else if(this.type == 2){
					if(this.mouseOver){
						this.cx = 205;
					}
					else{
						this.cx = 164;
					}
				}
				else if(this.type == 3){
					if(this.mouseOver){
						this.cx = 287;
					}
					else{
						this.cx = 246;
					}
				}
			}
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y += 2;
				}
				else{
					this.active = true;
				}
			}
			else{
				this.active = false;
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y -= 2;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[44], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_time = function(){
	this.x = 0;
	this.y = 39;
	this.w = 21;
	this.h = 30;
	this.cy = 0;this.cw = 21;this.ch = 30;
	this.globalAlpha = 0;
	this.appear = false;
	this.val = 0;
	this.draw = function(){
		try{
			this.cx = this.val * 21;
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
			ctx.drawImage(cvs_Arr[45], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_exit_btn = function(){
	this.x = 710;
	this.y = -28;
	this.w = 74;
	this.h = 74;
	this.cy = 0;this.cw = 74;this.ch = 74;
	this.mouseOver = false;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 74;
			}
			else{
				this.cx = 0;
			}
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y += 2;
				}
				else{
					this.active = true;
				}
			}
			else{
				this.active = false;
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y -= 2;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[36], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Result_success_bg = function(){
	this.w = 666;
	this.h = 405;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 666;this.ch = 405;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.type = 0;
	this.fontx = 290;
	this.fonty = 270;
	this.cnt = 0;
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
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
				}
				else{
					this.active = false;
					stageClear = false;
					uiCtrl(true);
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[47+this.type], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.font = "bold "+(15 * hR)+"px '나눔스퀘어'";ctx.fillStyle = "red";ctx.textAlign = "left";
			ctx.fillText("분야 : "+quiz_info.val,			this.fontx * wR,			this.fonty);
			ctx.fillText("정답 : "+this.cnt,				this.fontx * wR,			(this.fonty + 25) * hR);
			ctx.fillText("오답 : "+(10-this.cnt),			this.fontx * wR,			(this.fonty + 50) * hR);
			ctx.fillText("정답률 : "+(100*this.cnt/10)+"%",	this.fontx * wR,	(this.fonty + 75) * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Result_return_btn = function(){
	this.w = 144;
	this.h = 51;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 0;
	this.cy = 0;this.cw = 144;this.ch = 51;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
	this.mouseOver = false;
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
			ctx.drawImage(cvs_Arr[49], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Result_fail_bg = function(){
	this.w = 673;
	this.h = 331;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 673;this.ch = 331;
	this.globalAlpha = 0;
	this.appear = false;
	this.active = false;
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
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
				}
				else{
					this.active = false;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[50], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Result_ox = function(){
	this.w = 29;
	this.h = 32;
	this.x = 0;
	this.y = 198;
	this.cy = 0;this.cw = 28;this.ch = 32;
	this.globalAlpha = 0;
	this.appear = false;
	this.val = false;
	this.draw = function(){
		try{
			if(this.correct){
				this.cx = 0;
			}
			else{
				this.cx = 28;
			}
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
			ctx.drawImage(cvs_Arr[51], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Result_img = function(){
	this.w = 160;
	this.h = 109;
	this.x = 400;
	this.y = 250;
	this.cy = 0;this.cw = 160;this.ch = 109;
	this.globalAlpha = 0;
	this.appear = false;
	this.success = false;
	this.draw = function(){
		try{
			if(this.success){
				this.cx = 0;
			}
			else{
				this.cx = 160;
			}
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
			ctx.drawImage(cvs_Arr[52], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
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
	method_dot = new Object(),
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
let main_back_btn = new Object(),
	main_bg_quiz = new Object(),
	main_char = new Object(),
	main_login = new Object(),
	main_exit_bg = new Object(),
	main_exit_yes = new Object(),
	main_exit_no = new Object(),
	main_quiz_pop_bg = new Object(),
	main_quiz_pop_lv = new Object(),
	main_quiz_pop_ment = new Object(),
	main_quiz_pop_cd = new Object(),
	main_quiz_startbtn = new Object(),
	quiz_alert = new Object(),
	quiz_bg = new Object(),
	quiz_air_line = new Object(),
	quiz_air = new Object(),
	quiz_item_btn = new Object(),
	quiz_item_text = new Object(),
	quiz_info = new Object(),
	quiz_title = new Object(),
	quiz_op = new Object(),
	main_exit_btn = new Object(),
	black_layer = new Object(),
	result_success_bg = new Object(),
	result_fail_bg = new Object(),
	result_return_btn = new Object(),
	result_img = new Object();
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
let count = 3;																					// 현재목숨
let MAX_COUNT = 3;																				// 최대목숨
let MAX_LEVEL = 4;																				// 최대레벨
let quizLevel = 0;																				// 현재도전한 레벨
let maxQuizLv = 0;																				// 도전가능한 레벨
let stageClear = false;
let gameOver = false;
let gender = 1;																					// 성별 남:1 여:2
let convIdx = 0;																				// 인트로단계대화 순서
let convEnd = false;																			// 인트로단계대화 각 순서 종료여부
let typeInterval = new Object();																// 인트로단계대화 인터벌
let typingIdx = 0;																				// 인트로단계대화 글자인덱스
let typingColIdx = 0;																			// 인트로단계대화 줄인덱스
let conv_user_result_Arr = new Array(),															// 인트로단계대화 유저멘트 배열
	conv_pc_result_Arr = new Array(),															// 인트로단계대화 PC멘트 배열
	typeSplitText = new Array();																// 인트로단계대화 문장삽입용 배열
let quizInterval = new Object();
let quizTime = 15;
let main_level_arr = new Array(),
	main_stage_comp_arr = new Array(),
	quiz_ans_arr = new Array(),
	quiz_time_arr = new Array(),
	result_ox_arr = new Array();
let conv_Arr = [
	["헌법재판소 스피드퀴즈...도전하러","왔습니다! 어떻게 하는거죠?"],
	["안녕~ 나는 너를 도와줄 헌법의 요정!","스피드 퀴즈는 헌법과 헌법재판에 관한","문제를 푸는거란다."],
	["헌법과 헌법재판에 관한 문제라니...","제가 잘 풀 수 있을까요?"],
	["처음엔 어려울 수도 있겠지만...난이","도가 4가지로 구분되어있으니, 쉬운 문","제부터 차근차근 풀어나가면 될꺼야!"],
	["혹시 게임 중에 도움을 주는...뭐 그런","찬스 같은 건 없나요?"],
	["정답이 아닌 보기를 하나 지워주는","지우개 찬수가 있단다. 적절히 잘 활용","하면 문제를 푸는데 도움이 되겠지,"],
	["조금이나마 도움이 되겠네요!"],
	["아무튼 각 단계는 10문제씩 출제가","되고, 총 4단계로 구성되어 있으니,","끝까지 도달하는 것은 쉽지 않을꺼야,"],
	["한번에 통과하기는 힘들겠네요...","ㅠㅜ"],
	["그래, 하지만 여러 번 도전하다 보면","모든 단계를 정복할 수 있겠지!"],
	["네,","힘을 내서 도전해보겠습니다!"]
];
let quiz_array = [
	[
		["아시아헌법재판소연합(AACC) 회원기관의 \n헌법재판제도 및 이론연구 등을 담당하는\n연구사무국이 설치된 나라는?",1,"대한민국","중국","일본","대만"],
		["헌법에 대한 분쟁을 최종적으로 심판하여 \n헌법을 수호하는 기관은?",1,"헌법재판소","청와대","대법원","국회"],
		["헌법재판소의 조직, 운영과 심판절차에 관한\n것들을 적어놓은 법은?",1,"헌법재판소법","민사소송법","형사소송법","헌법"],
		["대한민국 헌법 제 1조에 의하면 대한민국의\n주권은 누구에게 있을까요?",4,"대통령","국회의원","국무총리","국민"],
		["국가가 보장하는 국민의 권리와 국민으로써\n국가에 할 의무를 적은 법은 무엇일까요?",3,"국가법","행정법","헌법","노동법"],
		["우리나라 모든 법의 기본이 되는 최고의 법은\n무엇일까요?",3,"형법","민법","헌법","행정법"],
		["헌법재판소의 선고와 변론은 모두 공개된다?",1],
		["2년 전에 기본권을 침해받은 것에 대해 \n헌법소원심판을 받을 수 있다?",2],
		["권한쟁의심판은 국민의 권리에 분쟁을 해결하기\n위한 것이다?",2],
		["헌법재판소에 1년에 접수되는 사건의 건수는\n1000건을 넘지 않는다?",2],
		["헌법재판소를 대표하고 헌법재판소의 사무를\n총괄하는 사람은 헌법재판소장이다?",1],
		["우리 국민의 기본권 보장과 국가의 조직 및\n운영에 관한 기본적인 사항을 정해 놓은 법은\n무엇일까요?",1,"헌법","민법","형법","행정법"],
		["국민이 자유롭고 평등하게, 행복하게 살 권리가\n있음을 규정한 법은 무엇일까요?",2,"국민법","헌법","민법","행복추구법"],
		["헌법에 규정된 국가기관이 아닌 것은?",4,"국회","법원","헌법재판소","미래창조과학부"],
		["우리나라 헌법이 처음 만들어진\n날은 언제일까요?",2,"1945년 8월 15일","1948년 7월 17일","1948년 8월 15일","1950년 6월 25일"],
		["대한민국 헌법 제1조에 의하면\n대한민국은 어떤 나라인가요?",1,"민주공화국","사회주의국가","왕정국가","공산주의국가"],
		["북한에도 헌법은 있다?",1],
		["징역형을 받았던 사람도 헌법재판관이\n될 수는 있다?",2],
		["헌법소원을 청구하기 위해서는 소정의 비용을\n지불해야 한다?",2],
		["헌법재판은 변호사(대리인)을 의무적으로\n선임해야만 한다?",1],
		["헌법소원은 인터넷을 통해서도 청구할 수 있다?",1],
		["주변사람이 기본권 침해를 당했을 때 내가 대신\n하여 헌법소원을 낼 수 있다?",2],
		["1년 안에 기본권을 침해받은 것에 대해\n헌법소원을 낼 수 있다?",1],
		["국민의 기본권을 보장하고 권력을 가진 기관을\n통제하는 역할을 하는 기관은?",1,"헌법재판소","검찰","대법원","감사원"],
		["아시아에서 최초로 헌법재판소를 만든 나라는?",2,"대만","대한민국","말레이시아","몽고"],
		["헌법의 이념과 가치를 수호해 국민의 기본권을\n지켜주는 곳은 헌법재판소이다?",1],
		["국민의 기본권을 보장하고 권력을 통제하는 것은\n대통령의 권한이다?",2],
		["대법원은 헌법재판소 상위기관이다?",1],
		["헌법재판소는 헌법상 독립된 기관이다?",1],
		["헌법재판소에서는 국가 간의 분쟁도 해결한다?",2],
		["헌법재판소가 내리는 결정은 모든 국가기관이\n 따라야만 한다?",1],
		["헌법재판소의 위헌 결정은 번복될 수 없는\n최종결정이다?",1],
		["1993년 한국건축문화대상을 수상한 건물은?",1,"헌법재판소 청사","청와대","63빌딩","대전엑스포 본관"],
		["헌법재판소는 우리나라에 단 하나뿐이다?",1],
		["헌법소원심판 청구는 국민이 직접 할 수 있다?",1],
	],
	[
		["천연기념물 8호로써 600살이 넘은 희귀수로\n하얀색을 띄는 헌법재판소 후원에 위치한\n나무의 이름은?",1,"재동백송","통의동백송","정2품송","바오밥나무"],
		["헌법 재판소의 위헌결정은 사건을 청구한\n사람 뿐 아니라 모든 국민에게 영향을 미친다?",1],
		["법원의 재판결과는 소송 당사자 에게만\n영향을 미친다?",1],
		["재판관이 7인 이상일 경우 사건에 대한\n결정 및 선고가 가능하다",1],
		["2014년 세계헌법재판회의는 각국의 대법원장과\n검찰총장이 참석한 회의이다?",2],
		["헌법재판소가 2014년 개최한 100개국 이상의\n헌법재판기관장과 국제기구의 대표가 참석한\n세계적 회의의 명칭은?",4,"세계검찰총장회의","APEC","세계헌법재판소장회의","세계헌법재판회의"],
		["헌법에 대한 분쟁을 최종적으로 심판하는\n기관은 대법원이다?",2],
		["2012년 창립총회를 연 아시아 헌법재판소연합\n초대 의장국은?",2,"일본","대한민국","중국","태국"],
		["헌법재판소는 우리나라 두 번째 대통령인\n윤보선 대통령의 고택과 담을 마주하고 있다?",1],
		["재동백송은 헌법재판소 청사가 지어질\n당시 다른곳에 옮겨와 심어졌다?",2],
		["헌법재판소는 경복궁과 창덕궁 사이\n북촌지역에 위치해 있다?",1],
		["헌법재판소 대심판정에 있는 좌석이\n아닌 것은?",4,"재판관석","속기사석","참여사무관석","피고석"],
		["헌법재판소 로비 입구 정면 화강암에\n 새겨진 헌법 조문은?",2,"헌법 제1조","헌법 제10조","헌법 제21조","헌법 제30조"],
		["헌법재판소에 가장 많이 청구되는\n심판의 종류는 정당해산심판이다?",2],
		["헌법재판소에 가장 많이 청구되는\n심판의 종류는 헌법소원심판이다?",1],
		["헌법재판관은 연임(임기를 마치고 한 번 더\n 하는 것)이 가능하다?",1],
		["헌법재판관은 탄핵의 대상이 아니다?",2],
		["헌법재판관이 탄핵의 대상이 되면 탄핵의 \n대상이 된 재판관은 본인 탄핵여부의 결정에\n참여 할 수 없다?",1],
		["헌법재판관 3명은 국회에서 선출한다?",1],
		["헌법재판관은 국회의 청문회를 거치지 않는다?",2],
		["법률이 헌법에 맞는지, 맞지 않는지의 여부를 \n판단하여 헌법에 맞지 않는 법을 없앨 수 있는\n헌법재판소의 심판 기능은?",1,"위헌법률심판","탄핵심판","정당해산심판","권한쟁의심판"],
		["국가기관이나 지방자치단체의 권한 다툼을\n해결하는 헌법재판소의 심판 기능은?",4,"위헌법률심판","탄핵심판","정당해산심판","권한쟁의심판"],
		["대통령과 같이 높은 지위에 있는 공무원이 \n헌법이나 법을 어긴 경우 그 자리에서 물러나게 \n하는 헌법재판소의 심판 기능은?",2,"위헌법률심판","탄핵심판","정당해산심판","권한쟁의심판"],
		["헌법재판소는 헌법에 쓰여 있는 기관은 아니다?",2],
		["선거관리에 관한 부분은 헌법에 쓰여 있지 않다?",2],
		["현재 재적 국회의원 절반이 찬성하면 헌법을\n개정 할 수 있다?",2],
		["대한민국 헌법에는 지방자치에 대한\n규정도 있다?",1],
		["현재 헌법개정을 위해서는 국민 투표를 통해\n투표를 한 국민 절반이상의 동의를 얻어야 한다?",1],
		["처음 만들어진 헌법에서는 대통령을 국민의\n손으로 직접 뽑지 않았다?",1],
		["헌법재판은 헌법을 지키기 위한 것이다?",1]
	],
	[
		["과거 헌법재판소 터에 위치했던 것이 아닌것은?",4,"제중원","박규수 선쟁 집터","창덕여고","맹사성 집터"],
		["헌법재판소의 선고와 변론이 이루어지는 공간\n으로 한옥을 모티브로 하여 지어진 곳은?",1,"대심판정","대강당","평의실","소심판정"],
		["40석 규모로 지정재판부에서 활용하며\n변론준비를 위한 재판이 열리는 곳은?",4,"대심판정","대강당","평의실","소심판정"],
		["위헌법률심판제청은 재판 중에 있는 사람의\n요청 없이도 판사의 판단으로\n헌법재판소에 할 수 있다?",1],
		["판사가 재판 당사자의 위헌법률심판제청\n신청을 받아들이지 않으면, 재판 당사자는\n헌법재판소에 헌법소원을 낼 수 있다?",1],
		["헌법이 규정한 국민의 의무가 아닌것은?",4,"교육의 의무","납세의 의무","국방의 의무","청구의 의무"],
		["헌법에 규정한 자유권이 아닌 것은?",4,"양심의 자유","신체의 자유","직업선택의 자유","교육의 자유"],
		["대한민국 헌법은 10개의 장, 130개의\n조항으로 구성되어 있다?",1],
		["세계적으로 헌법이 없는 나라도 있다?",2],
		["헌법은 성문법과 불문법의 체계로 나뉜다?",1],
		["재판관님들이 사건에 대해 토론하고 결정을\n내리는 곳은?",2,"평의실","대심판정 합의실","재판관 휴게실","소심판정"],
		["헌법재판소 설립 당시 청사가 있었던 곳은?",2,"재동(지금 위치)","정동","을지로","서초동"],
		["일명 ‘법을 통한 민주주의 유럽위원회’라\n불리며 헌법과 헌법재판제도를 국가들이 \n도입하고 운영할 수 있도록 도움을 주는 기관은?",1,"베니스위원회","유럽인권재판소","국제사법재판소","UN"],
		["문서의 형식을 갖춘 법을 성문법 이라고 한다?",1],
		["문서의 형식을 갖추지 않고 정해진\n절차에 따라 만들어지지 않은 법을\n불문법이라고 한다?",1],
		["재판관님들이 선고와 변론 때 대심판정에 입정\n하기 전 머무르기도 하며 재판 중 의견 조율이\n필요할 때 활용하기도 하는 이곳은?",2,"평의실","대심판정 합의실","재판관 휴게실","소심판정"],
		["일명 ‘법을 통한 민주주의 유럽위원회’라 불리며,\n헌법과 헌법재판제도를 국가들이 도입하고 운영\n할 수 있도록 도움을 주는 기관은?",1,"베니스위원회","유럽인권재판소","국제사법재판소","UN"],
		["문서의 형식을 갖춘 법을 성문법이라고 한다?",1],
		["문서의 형식을 갖추지 않고 정해진 절차에\n따라 만들어지지 않은 법을 불문법이라고 한다?",1],
		["대한민국의 헌법은 불문법이다?",2],
		["대한민국 헌법이 여러 차례 개정된 이유는\n대통령이 바뀌었기 때문이다?",2],
		["대한민국 헌법은 대한민국 임시정부의 헌법을\n기반으로 만들어졌다?",1],
		["처음 만들어진 대한민국 헌법에서는 초등교육을\n의무화 하지 않았다?",2],
		["대한민국 최초 헌법에 가장 큰 영향을 끼친\n사람은 ‘유진오’이다",1],
		["헌법에는 경제와 관련한 부분도 쓰여 있다?",1],
		["헌법의 하위법령으로는 법률, 명령과 조례,\n규칙이 있다?",1],
		["헌법재판의 역할이 아닌 것은?",4,"정의롭지 못한 법 없애기","잘못된 권력 통제하기","국민의 기본권 보장하기","잘못된 헌법 고치기"],
		["헌법재판이 통제하는 권력(공권력)의 종류가\n될 수 없는 것은?",4,"국회의 입법권","정부의 행정권","법원의 재판권","국민의 기본권"],
		["법에 의해 통치되는 국가를 이르는 말은?",1,"법치주의 국가","사회주의 국가","자유민주주의 국가","왕정국가"],
		["법치주의의 한계(법 그자체가 정의롭지 못할 때)\n를 극복하기 위해 등장한 권력통제 수단은?",3,"형사재판","인민재판","헌법재판","전범재판"],
		["전 세계적으로 헌법재판소에서 헌법재판을 하고\n있는 국가의 수는?",4,"약 10개","약 30개","약 70개","약 90개"],
		["헌법재판소장의 지휘를 받아 사무처를 통솔하는\n분은?",1,"헌법재판소사무처장","헌법재판소사무차장","헌법재판소장 비서실장","수석연구부장"],
		["헌법재판소사무처장을 보좌하며, 사무처장이 \n직무를 수행할 수 없을 때 이를 대행하는 분은?",2,"헌법재판소사무처장","헌법재판소사무차장","헌법재판소장 비서실장","수석연구부장"],
		["헌법재판소에서 일하는 사람이 아닌 것은?",3,"헌법재판관","헌법연구관","대법관","헌법연구위원"],
		["헌법재판소에 청구된 사건에 대한 연구와 \n조사업무를 담당하는 사람은?",2,"헌법재판관","헌법연구관(원)","심판사무국장","조사관"],
		["헌법연구관은 판사·검사·변호사의 자격을 가진\n사람만이 될 수 있다?",2],
		["헌법재판소에는 헌법연구관으로 근무하는\n판사와 검사들이 있다?",1],
		["징역형을 받았던 사람이라고 해서 헌법연구관이\n될 수 없는 건 아니다?",2],
		["헌법재판소 재판관 3인이 참석하는 재판부를\n지정재판부라고 한다?",1],
		["현재 헌법재판관으로 임명 되려면 법조인으로써\n최소 15년 이상 활동해야 한다?",1],
		["헌법재판소에 법률의 위헌여부 등을 묻는 심판을\n청구한 측을 일컫는 말은?",2,"원고","청구인","피고","배심원"],
		["위헌법률심판과 헌법소원심판에 대한 변론시 \n재판부에서 필요하다고 인정하는 경우 출석하여 \n해당 사건에 대한 전문적 의견 이야기 하는 \n사람을 일컫는 말은?",1,"참고인","원고","피고","증인"],
		["모든 심판절차에서 정부가 청구인이나 \n피청구인이 될 경우 어느 부처의 장관이 이를 \n대표할까요?",4,"국방부 장관","기획재정부 장관","교육부 장관","법무부 장관"],
		["헌법재판소 결정의 종류가 아닌 것은?",3,"위헌","헌법불합치","위법","합헌"],
		["헌법재판소에 접수되는 사건의 유형이 아닌\n것은?",3,"위헌법률심판","탄핵심판","특허소송","헌법소원심판"],
		["현대판 ‘신문고 제도’로 불리며 억울하게 침해된 \n국민의 기본권을 구제해주기 위한 헌법재판소 \n심판의 종류는?",1,"헌법소원심판","탄핵심판","정당해산심판","권한쟁의심판"],
		["법률이 헌법에 맞는지, 맞지 않는지의 여부를\n판단하여 헌법에 맞지 않는 법을 없앨 수\n있는 헌법재판소의 심판 기능은?",1,"헌법소원심판","탄핵심판","정당해산심판","권한쟁의심판"],
		["대통령과 같이 높은 지위에 있는 공무원이\n헌법이나 법을 어긴 경우 그 자리에서 물러나게\n하는 헌법재판소의 심판 기능은?",2,"헌법소원심판","탄핵심판","정당해산심판","권한쟁의심판"],
		["국가기관이나 지방자치단체의 권한 다툼을 \n해결하는 헌법재판소의 심판 기능은?",4,"헌법소원심판","탄핵심판","정당해산심판","권한쟁의심판"],
	],
	[
		["헌법재판관은 모두 몇 명일까요?",2,"7명","9명","11명","12명"],
		["헌법재판관의 임기는 몇 년일까요?",2,"4년","6년","9년","종신"],
		["초대 헌법재판소장님은 누구일까요?",4,"박한철","이강국","윤영철","조규광"],
		["헌법재판관의 지위는 대법관 (행정부의 장관)\n의 지위와 같다?",1],
		["헌법재판소에 청구되는 사건에 대한 심리는 \n서면(제출되는 서류)을 통한 심리를 원칙으로\n한다?",1],
		["헌법재판관의 정년은?",2,"65세","70세","75세","80세"],
		["공개변론을 열지 않아도 되는 헌법재판소\n심판 종류는?",1,"위헌법률심판","탄핵심판","정당해산심판","권한쟁의심판"],
		["헌법재판소는 국가가 어떠한 행위를 하지 않는 \n것(공권력의 불행사)에 대해서도 심판할 수 있다?",1],
		["헌법재판소장의 국가의전서열은 국무총리 보다\n높다?",1],
		["헌법재판소의 연구부는 전속부와 공동부로\n나뉜다?",1],
		["헌법재판관의 정년은?",2,"65세","70세","75세","80세"],
		["헌법재판소장의 정년은?",2,"65세","70세","75세","80세"],
		["헌법재판제도의 발전방안을 연구하고 다양한\n계층에 대한 헌법재판교육을 담당하는\n헌법재판소 소속기관은?",3,"재판부","사무처","헌법재판연구원","연구부"],
		["헌법재판소를 구성하는 조직이 아닌 것은?",4,"재판부","연구부","사무처","행정처"],
		["헌법재판소사무처에 속한 조직이 아닌 것은?",2,"심판사무국","대변인실","기획조정실","홍보심의관실"],
		["헌법재판소에 탄핵심판을 청구할 수 있는 곳은?",1,"국회","법무부","법원","검찰"],
		["국회의 탄핵소추(헌법재판소에 탄핵심판을 요청)\n대상이 아닌 사람은?",4,"대통령","장관","감사원장","국회의원"],
		["대통령 탄핵심판을 청구하기 위해서는 \n재적 국회의원 얼마의 동의가 있어야 할까?",3,"전부","절반","3분의2","3분의1"],
		["헌법재판소에 정당해산심판을 청구할 수 있는\n곳은?",1,"정부","법원","국회","감사원"],
		["권한쟁의에 대한 결정을 하기 위해서는 재판관\n9인중 몇 명의 찬성(심판정족수)이 있어야\n할까요?",1,"5명(과반수)","6명","7명","9명(전원)"],
		["공개변론을 열지 않아도 되는 헌법재판소\n심판 종류는?",1,"위헌법률심판","탄핵심판","정당해산심판","권한쟁의심판"],
		["헌법재판소의에 청구되는 사건에 대한 심리는\n서면(제출되는 서류)을 통한 심리를 원칙으로\n한다?",1],
		["헌법재판소의 지위라고 볼 수 없는 것은?",4,"기본권보장기관","헌법수호기관","권력통제기관","국제재판기관"],
		["대한민국 헌법은 총 몇 개의 조문으로 구성\n되어 있을까요?",1,"130개","660개","870개","1020개"],
		["우리나라 헌법은 처음 만들어진 뒤 몇 번\n바뀌었을까요?",4,"바뀌지 않았다.","1번","6번","9번"],
		["우리나라 헌법이 가장 최근에 바뀐 것은\n언제일까요?",1,"1987년 10월 29일","1988년 9월 17일","1993년 8월 7일","2002년 5월 30일"],
		["대한민국 헌법 제2장에서 규정하고 있는\n것은 무엇일까요?",1,"정부","국민의 권리와 의무","지방자치","헌법개정"],
		["헌법 중 헌법재판소는 몇 장에 규정되어\n있을까요?",2,"헌법 제1장","헌법 제3장","헌법 제6장","헌법 제10장"],
		["우리나라 헌법재판소가 출범한 날은?",3,"1948년 7월 17일","1948년 8월 15일","1987년 10월 29일","1988년 9월 1일"],
		["우리나라 헌법재판소가 만들어진 기반이 된\n개정헌법은?",4,"3차 개정헌법","4차 개정헌법","7차 개정헌법","9차 개정헌법"],
		["헌법재판소가 탄생하기 전 40년간 대법원과\n헌법위원회를 통해 이루어진 헌법재판 사건 중\n위헌이나 인용(국민의 기본권 침해 구제) 된\n건수는?",4,"4건","10건","약 100건","약 1,000건"],
		["헌법재판소의 행정에 관한 중요한 일들을\n의논하고 결정하기 위한 것은?",1,"선고","변론","평의","재판관회의"],
		["헌법재판소의 연구부는 전속부와 공동부로\n나뉜다?",4],
		["헌법재판소에 청구된 사건에 관해 의논하고\n결정하기 위한 것은?",1,"선고","변론","평의","재판관회의"],
		["헌법재판소에 청구된 사건들에 대한 최종 결정을\n발표하기 위한 것은?",3,"선고","변론","평의","재판관회의"],
		["헌법재판소의 청구된 사건들에 대해 청구인과\n피청구인, 참고인 등의 의견을 들어보기 위한\n것은?",1,"선고","변론","평의","재판관회의"],
		["헌법재판소 변론시 출석하지 않는 사람은?",2,"청구인","피청구인","참고인","배심원"],
		["헌법재판소의 위헌결정으로 해당 법률조항이\n없어지면, 그 법률에 의해 처벌받은 사람은 재심\n(법원에서 다시 재판을 여는 것)을 청구할 수\n있다?",4],
		["위헌법률심판제청은 사건을 담당하는 법원\n(판사)이 할 수 있다?",2],
		["대한민국 헌법재판소를 모델로 하여 자국의\n헌법재판제도를 갖춘 나라는?",1,"인도네시아","말레이시아","대만","몽골"],
		["법률이 헌법에 맞는지, 맞지 않는지의 여부를\n판단하여 헌법에 맞지 않는 법을 없앨 수\n있는 헌법재판소의 심판 기능은?",1,"위헌법률심판","탄핵심판","정당해산심판","권한쟁의심판"],
		["대통령과 같이 높은 지위에 있는 공무원이 헌법\n이나 법을 어긴 경우 그 자리에서 물러나게\n하는 헌법재판소의 심판 기능은?",2,"위헌법률심판","탄핵심판","정당해산심판","권한쟁의심판"],
		["국가기관이나 지방자치단체의 권한 다툼을 해결\n하는 헌법재판소의 심판 기능은?",4,"위헌법률심판","탄핵심판","정당해산심판","권한쟁의심판"],
		["헌법에 적혀있는 국민의 기본권이 정당한 \n이유없이 제한 받을 경우 그 권리를 구제하고 \n잘못된 제도를 고칠 수 있도록 하는 \n헌법재판소의 심판 기능은?",1,"위헌법률심판","탄핵심판","정당해산심판","권한쟁의심판"]
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
		},1000);
	})();
	function methodPopupFunc(){
		method_dot.x = (376 + method_content.idx * 14);
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
			method_dot.draw();
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
	let gameOverSound = false;
	let main_bg = new Main_bg();

	let cnt_arr = new Array();
	(function(){
		main_back_btn = new Main_back_btn();
		main_bg_quiz = new Main_bg_quiz();
		main_char = new Main_char();
		main_login = new Main_login();
		main_exit_bg = new Main_exit_bg();
		main_exit_yes = new Main_exit_yes();
		main_exit_no = new Main_exit_no();
		main_quiz_pop_bg = new Main_quiz_pop_bg();
		main_quiz_pop_lv = new Main_quiz_pop_lv();
		main_quiz_pop_ment = new Main_quiz_pop_ment();
		main_quiz_pop_cd = new Main_quiz_pop_cd();
		main_quiz_startbtn = new Main_quiz_startbtn();
		quiz_alert = new Quiz_alert();
		quiz_bg = new Quiz_bg();
		quiz_air_line = new Quiz_air_line();
		quiz_air = new Quiz_air();
		quiz_item_btn = new Quiz_item_btn();
		quiz_item_text = new Quiz_item_text();
		quiz_info = new Quiz_info();
		quiz_title = new Quiz_title();
		quiz_op = new Quiz_op();
		main_exit_btn = new Main_exit_btn();
		black_layer = new Black_layer();
		result_success_bg = new Result_success_bg();
		result_fail_bg = new Result_fail_bg();
		result_return_btn = new Result_return_btn();
		result_img = new Result_img();

		for(let i=0;i<MAX_LEVEL;i++){
			main_level_arr.push(new Main_level());
			main_level_arr[i].x = (80 + 165 * i);
			main_level_arr[i].val = i;

			main_stage_comp_arr.push(new Main_stage_comp());
			main_stage_comp_arr[i].x = (120 + 165 * i);
		}
		for(let i=0;i<MAX_COUNT;i++){
			cnt_arr.push(new Main_count());
			cnt_arr[i].x = (377 + 15 * i);
		}
		for(let i=0;i<2;i++){
			quiz_time_arr.push(new Quiz_time());
			quiz_time_arr[i].x = (540 + 21 * i);
		}
		for(let i=0;i<10;i++){
			result_ox_arr.push(new Result_ox());
			result_ox_arr[i].x = (205 + 40 * i);
		}

		uiCtrl(true);
	})();

	function quizTimeFunc(){
		quiz_time_arr[0].val = Math.floor(quizTime / 10);
		quiz_time_arr[1].val = quizTime % 10;
	}
	function draw(){
		main_bg.draw();
		if(gameOver){
			if(!gameOverSound){
				audioPlay(2);
				gameOverSound = true;
			}
			black_layer.draw();
			result_fail_bg.draw();
			result_return_btn.draw();
		}
		else if(stageClear){
			black_layer.draw();
			result_success_bg.draw();
			result_return_btn.draw();
			result_img.draw();
			for(let i=0;i<result_ox_arr.length;i++){
				result_ox_arr[i].draw();
			}
		}
		else{
			main_bg_quiz.draw();
			main_login.draw();
			main_char.draw();

			for(let i=0;i<main_level_arr.length;i++){
				main_level_arr[i].draw();
			}
			for(let i=0;i<main_stage_comp_arr.length;i++){
				if(main_stage_comp_arr[i].active){
					main_stage_comp_arr[i].draw();
				}
			}
			for(let i=0;i<count;i++){
				cnt_arr[i].draw();
			}

			quiz_alert.draw();
			quiz_bg.draw();
			quiz_info.draw();
			quiz_title.draw();
			quiz_op.draw();
			for(let i=0;i<quiz_ans_arr.length;i++){
				quiz_ans_arr[i].draw();
			}
			for(let i=0;i<quiz_time_arr.length;i++){
				if(i == 0){
					if(quiz_time_arr[i].val != 0){
						quiz_time_arr[i].draw();
					}
				}
				else{
					quiz_time_arr[i].draw();
				}
			}
			quiz_air_line.draw();
			quiz_air.draw();
			quiz_item_btn.draw();
			if(quiz_item_text.val > 0){
				quiz_item_text.draw();
			}
			main_exit_btn.draw();

			if(main_quiz_pop_bg.active || main_quiz_pop_bg.appear){
				black_layer.draw();
				main_quiz_pop_bg.draw();
				main_quiz_pop_lv.draw();
				main_quiz_pop_ment.draw();
				main_quiz_pop_cd.draw();
				main_quiz_startbtn.draw();
			}
			if(main_exit_bg.active || main_exit_bg.appear){
				black_layer.draw();
				main_exit_bg.draw();
				main_exit_yes.draw();
				main_exit_no.draw();
			}		
			if(main_back_btn.active){
				main_back_btn.draw();
			}
		}
	}
	mainLoop = function(){
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		quizTimeFunc();
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
		method_content.idx = 0;method_content.cx = 0;											// 팝업 킬때 첫번째부터 시작
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
function exitIntro(){
	clearInterval(typeInterval);
	introLoop = function(){return;}
	main();
}
function uiCtrl(bool){
	if(bool){
		count = 3;
		for(let i=0;i<MAX_LEVEL;i++){
			if(i < maxQuizLv){
				main_level_arr[i].on = true;
				main_level_arr[i].complete = true;
				main_stage_comp_arr[i].active = true;
			}
			else{
				if(i > maxQuizLv){
					main_level_arr[i].on = false;
				}
				else{
					main_level_arr[i].on = true;
				}
				main_level_arr[i].complete = false;
				main_stage_comp_arr[i].active = false;
			}
		}
	}
	main_bg_quiz.appear = bool;
	main_login.appear = bool;
	for(let i=0;i<main_level_arr.length;i++){
		main_level_arr[i].appear = bool;
	}
	for(let i=0;i<main_stage_comp_arr.length;i++){
		main_stage_comp_arr[i].appear = bool;
	}
}
function exitCtrl(bool){
	popup = bool;
	main_exit_bg.appear = bool;
	main_exit_yes.appear = bool;
	main_exit_no.appear = bool;
}
function quizPopupCtrl(bool){
	if(bool){
		main_quiz_pop_lv.valSet(quizLevel);
		quiz_item_text.val = 3;
	}
	else{
		quiz_alert.val = 0;
	}
	black_layer.appear = bool;
	main_quiz_pop_bg.appear = bool;
	main_quiz_pop_lv.appear = bool;
	main_quiz_pop_ment.appear = bool;
	main_quiz_pop_cd.appear = bool;	
	main_quiz_startbtn.appear = bool;
}
function quizAlert(){
	let quizIdx = quiz_alert.val;
	if(quizIdx >= 10){
		quiz_alert.val = 0;
		successPopupCtrl(true);
	}
	else{
		quiz_alert.show();
	}
	main_char.status("normal");
}
function quizSetting(bool){
	if(bool){
		audioPlay(5);
		let quizIdx = quiz_alert.val;
		quiz_ans_arr = new Array();
		// OX
		if(quiz_array[quizLevel][quizIdx-1].length <= 2){
			quiz_bg.type = 0;
			quiz_op.y = 158;
			quiz_op.val = new Array();quiz_op.val.push("O");quiz_op.val.push("X");
			for(let i=0;i<2;i++){
				quiz_ans_arr.push(new Quiz_ans_ox());
				quiz_ans_arr[i].type = i;
				quiz_ans_arr[i].x = (460 + 140 * i);
			}
			quiz_item_btn.ifOX = true;
		}
		// 다지선다
		else{
			quiz_bg.type = 1;
			quiz_op.y = 110;
			quiz_op.val = new Array();
			for(let i=2;i<6;i++){
				quiz_op.val.push(quiz_array[quizLevel][quizIdx-1][i]);
			}
			for(let i=0;i<4;i++){
				quiz_ans_arr.push(new Quiz_ans_da());
				quiz_ans_arr[i].type = i;
				quiz_ans_arr[i].x = (460 + 70 * i);
			}
			quiz_item_btn.ifOX = false;
		}
		if(quiz_item_text.val > 0){
			quiz_item_btn.on = true;
		}
		else{
			quiz_item_btn.on = false;
		}
		quiz_info.idx = quizIdx;
		quiz_info.valSet(quizLevel);
		quiz_title.val = quiz_array[quizLevel][quizIdx-1][0];

		quizTime = 15;
		quizTimeIntervalFunc();
		quiz_air = new Quiz_air();
	}
	quiz_bg.appear = bool;
	quiz_info.appear = bool;
	quiz_title.appear = bool;
	quiz_op.appear = bool;
	for(let i=0;i<quiz_ans_arr.length;i++){
		quiz_ans_arr[i].appear = bool;
	}
	for(let i=0;i<quiz_time_arr.length;i++){
		quiz_time_arr[i].appear = bool;
	}
	quiz_air_line.appear = bool;
	quiz_air.appear = bool;
	quiz_item_btn.appear = bool;
	quiz_item_text.appear = bool;
	main_exit_btn.appear = bool;
}
function quizTimeIntervalFunc(){	
	quizInterval = setInterval(function(){
		if(quizTime > 0){
			quizTime--;
			quiz_air.move = true;
		}
		else{
			clearInterval(quizInterval);
			main_char.status("wrong");
			count--;
			if(count <= 0){
				failPopupCtrl(true);
			}
		}
	},1000);
}
function quizCheck(val){
	clearInterval(quizInterval);
	let quizIdx = quiz_alert.val;
	let ans = quiz_array[quizLevel][quizIdx-1][1] - 1;
	
	quiz_ans_arr[val].complete = true;
	for(let i=0;i<quiz_ans_arr.length;i++){
		quiz_ans_arr[i].on = false;
	}
	if(ans == val){
		audioPlay(3);
		quiz_ans_arr[val].correct = true;
		result_ox_arr[quizIdx-1].correct = true;
		main_char.status("correct");
	}
	else{
		audioPlay(4);
		quiz_ans_arr[val].correct = false;
		result_ox_arr[quizIdx-1].correct = false;
		main_char.status("wrong");
		count--;
		if(count <= 0){
			failPopupCtrl(true);
		}
	}
}
function successPopupCtrl(bool){
	if(bool){
		stageClear = true;
		if(maxQuizLv >= MAX_LEVEL){
			result_success_bg.type = 1;
		}
		else{
			result_success_bg.type = 0;
		}
		result_return_btn.y = 405;

		let correctCnt = 0;
		for(let i=0;i<result_ox_arr.length;i++){
			if(result_ox_arr[i].correct){
				correctCnt++;
			}
		}
		result_success_bg.cnt = correctCnt;
		if(correctCnt >= 8){
			result_img.success = true;
		}
		else{
			result_img.success = false;
		}
	}
	else{
		if(result_success_bg.type == 1){
			_isPorted ? parent.gameResult() : location.href = "index.html";
		}
		else{
			if(result_img.success){
				maxQuizLv++;
			}
		}
	}
	popup = bool;
	result_success_bg.appear = bool;
	result_return_btn.appear = bool;
	result_img.appear = bool;
	for(let i=0;i<result_ox_arr.length;i++){
		result_ox_arr[i].appear = bool;
	}
}
function failPopupCtrl(bool){
	if(bool){
		gameOver = true;
		result_return_btn.y = 360;
	}
	popup = bool;
	result_fail_bg.appear = bool;
	result_return_btn.appear = bool;
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
				}
				else if(mouseCd(select_female_btn)){			
					$("canvas").css("cursor","pointer");
					select_female_btn.mouseOver = true;
				}				
				else{
					select_exit_btn.mouseOver = false;
					select_start_btn.mouseOver = false;
					select_male_btn.mouseOver = false;
					select_female_btn.mouseOver = false;
				}
			}
			else if((conv_user_bg.appear && conv_user_bg.active) || (conv_pc_bg.appear && conv_pc_bg.active)){
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
		if(!popup){
			for(let i=0;i<main_level_arr.length;i++){
				if(main_level_arr[i].on && main_level_arr[i].active && !main_level_arr[i].complete && mouseCd(main_level_arr[i])){			
					$("canvas").css("cursor","pointer");
				}
			}
			for(let i=0;i<quiz_ans_arr.length;i++){
				if(quiz_ans_arr[i].on && quiz_ans_arr[i].active && !quiz_ans_arr[i].complete && mouseCd(quiz_ans_arr[i])){			
					$("canvas").css("cursor","pointer");
					quiz_ans_arr[i].mouseOver = true;
				}
				else{
					quiz_ans_arr[i].mouseOver = false;
				}
			}
			if(main_exit_btn.active && mouseCd(main_exit_btn)){			
				$("canvas").css("cursor","pointer");
				main_exit_btn.mouseOver = true;
			}
			else if(quiz_item_btn.on && !quiz_item_btn.ifOX && quiz_item_btn.active && mouseCd(quiz_item_btn)){			
				$("canvas").css("cursor","pointer");
				quiz_item_btn.mouseOver = true;
			}
			else{
				main_exit_btn.mouseOver = false;
				quiz_item_btn.mouseOver = false;
			}
			if(main_quiz_pop_bg.active && main_quiz_pop_bg.appear){
				if(mouseCd(main_quiz_startbtn)){			
					$("canvas").css("cursor","pointer");
					main_quiz_startbtn.mouseOver = true;
				}
				else{
					main_quiz_startbtn.mouseOver = false;
				}
			}
		}
		else{
			if(main_exit_bg.active && main_exit_bg.appear){
				if(mouseCd(main_exit_yes)){			
					$("canvas").css("cursor","pointer");
					main_exit_yes.mouseOver = true;
				}
				else if(mouseCd(main_exit_no)){			
					$("canvas").css("cursor","pointer");
					main_exit_no.mouseOver = true;
				}
				else{
					main_exit_yes.mouseOver = false;
					main_exit_no.mouseOver = false;
				}
			}
			if(result_success_bg.active && result_success_bg.appear){				
				if(mouseCd(result_return_btn)){			
					$("canvas").css("cursor","pointer");
					result_return_btn.mouseOver = true;
				}
				else{
					result_return_btn.mouseOver = false;
				}
			}
			if(result_fail_bg.active && result_fail_bg.appear){				
				if(mouseCd(result_return_btn)){			
					$("canvas").css("cursor","pointer");
					result_return_btn.mouseOver = true;
				}
				else{
					result_return_btn.mouseOver = false;
				}
			}
		}
		if(main_back_btn.active && mouseCd(main_back_btn)){			
			$("canvas").css("cursor","pointer");
			main_back_btn.mouseOver = true;
		}
		else{
			main_back_btn.mouseOver = false;
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
			else if((conv_user_bg.appear && conv_user_bg.active) || (conv_pc_bg.appear && conv_pc_bg.active)){
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
						if(convIdx >= conv_Arr.length){
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
		if(!popup){
			main_exit_btn.mouseOver = false;
			quiz_item_btn.mouseOver = false;
			if(main_exit_btn.active && mouseCd(main_exit_btn)){	
				audioPlay(1);		
				exitCtrl(true);
				clearInterval(quizInterval);
			}
			if(quiz_item_btn.on && !quiz_item_btn.ifOX && quiz_item_btn.active && mouseCd(quiz_item_btn)){
				audioPlay(1);			
				let quizIdx = quiz_alert.val;
				let ans = quiz_array[quizLevel][quizIdx-1][1] - 1;
				let deleteans = (ans + Math.floor(Math.random()*100)%3 + 1) % 4; 
				quiz_ans_arr[deleteans].complete = true;
				quiz_ans_arr[deleteans].on = false;
				quiz_ans_arr[deleteans].correct = false;
				quiz_item_btn.on = false;
				quiz_item_text.val--;
			}
			for(let i=0;i<main_level_arr.length;i++){
				if(main_level_arr[i].active && main_level_arr[i].on && !main_level_arr[i].complete && mouseCd(main_level_arr[i])){						
					audioPlay(1);
					quizLevel = i;
					uiCtrl(false);
					quizPopupCtrl(true);	
				}
			}
			for(let i=0;i<quiz_ans_arr.length;i++){
				if(quiz_ans_arr[i].active && quiz_ans_arr[i].on && !quiz_ans_arr[i].complete && mouseCd(quiz_ans_arr[i])){			
					quiz_ans_arr[i].mouseOver = false;
					quiz_item_btn.on = false;
					quizCheck(i);
				}
			}
			if(main_quiz_pop_bg.active && main_quiz_pop_bg.appear){
				main_quiz_startbtn.mouseOver = false;
				if(mouseCd(main_quiz_startbtn)){	
					audioPlay(1);		
					main_back_btn.active = false;
					quizPopupCtrl(false);
					quizAlert();
				}
			}
		}
		else{
			if(main_exit_bg.active && main_exit_bg.appear){
				main_exit_yes.mouseOver = false;
				main_exit_no.mouseOver = false;
				if(mouseCd(main_exit_yes)){			
					location.href = "index.html";
				}
				if(mouseCd(main_exit_no)){	
					audioPlay(1);		
					exitCtrl(false);
					quizTimeIntervalFunc();
				}
			}
			if(result_success_bg.active && result_success_bg.appear){
				result_return_btn.mouseOver = false;
				if(mouseCd(result_return_btn)){	
					audioPlay(1);	
					successPopupCtrl(false);
				}
			}
			if(result_fail_bg.active && result_fail_bg.appear){	
				result_return_btn.mouseOver = false;			
				if(mouseCd(result_return_btn)){			
					location.href = "index.html";
				}
			}
		}
		main_back_btn.mouseOver = false;
		if(mouseCd(main_back_btn)){		
			audioPlay(1);	
			exitCtrl(true);
		}
	}
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
