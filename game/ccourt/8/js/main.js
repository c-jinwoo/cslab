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
	["intro/char.png"],
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
	["main/ui/layer.png"],		
	["main/ui/readyGo.png"],	
	["main/ui/stage_alert.png"],																// 25
	["main/top/bg.png"],														
	["main/top/man.png"],		
	["main/top/number.png"],											
	["main/top/btn_exit.png"],		
	["main/btm/bg.png"],																		// 30
	["main/btm/stage.png"],	
	["main/btm/number.png"],													
	["main/exit/bg.png"],											
	["main/exit/btn_yes.png"],											
	["main/exit/btn_no.png"],																	// 35								
	["main/bg/btm.png"],									
	["main/bg/top.png"],									
	["main/bg/cloud.png"],								
	["main/bg/grass.png"],
	["main/bg/tile.png"],																		// 40
	["main/bg/sky.png"],																								
	["main/char/man.png"],	
	["main/char/woman.png"],	
	["main/obj/book.png"],		
	["main/obj/barricade.png"],																	// 45
	["main/obj/bomb.png"],	
	["main/obj/time.png"],	
	["main/obj/pin.png"],	
	["main/obj/quiz.png"],
	["main/obj/eff_correct.png"],																// 50
	["main/obj/eff_wrong.png"],	
	["main/obj/eff_time.png"],	
	["main/quiz/bg.png"],		
	["main/quiz/time.png"],		
	["main/quiz/btn.png"],																		// 55
	["main/quiz/result.png"],
	["main/clear/stage/bg.png"],
	["main/clear/stage/level_btn.png"],	
	["main/clear/finale/bg.png"],
	["main/clear/finale/home_btn.png"],															// 60
	["main/over/bg.png"],
	["main/over/home_btn.png"],
	["main/top/gage.png"],
	["main/ui/jump_btn.png"],
	["main/bg/building/1.png"],																	// 65
	["main/bg/building/2.png"],
	["main/bg/building/3.png"],
	["main/bg/building/4.png"],
	["main/bg/building/5.png"],
	["main/bg/building/common.png"],															// 70
];
const aud_Arr	= [
	["bgm.mp3"],		// 0
	["click.mp3"],
	["method.mp3"],
	["start.mp3"],
	["item_o.mp3"],
	["item_x.mp3"],		// 5
	["jump.mp3"],
	["quiz_o.mp3"],
	["result.mp3"],
	["over.mp3"],
	["collide.mp3"]		// 10
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
	
	Object.prototype.up = false;
	Object.prototype.down = false;

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
const Intro_char = function(){
	this.init({idx:2, x:30, y:10, w:323, h:433});
	this.vy = 0.5;
	this.alphaSet(1);
	this.alphaFunc = function(){
		if(this.y > 30 || this.y < 10){
			this.vy *= -1;
		}
		this.y += this.vy;
	};
};
const Intro_start_btn = function(){
	this.init({idx:3, col:2, spr:2, x:"center", y:425});
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
	this.init({idx:4, col:2, spr:2, x:"center", y:480});
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
	this.init({idx:5, col:2, spr:4, x:720, y:45, w:60, h:60});
	this.btnSet();
	this.alphaSet(0);
	this.mouseFunc = function(){
		if(this.mouseOver){
			this.cx = 73;
		}
		else{
			this.cx = 0;
		}
		if(volume){
			this.cy = 0;
		}
		else{
			this.cy = 71;
		}
	};
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
	this.init({idx:6});
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
	this.init({idx:7, x:65, y:110});
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
	this.init({idx:8, col:5, spr:5, x:100, y:185, w:600, h:270});
	this.slideRight = false;
	this.slideLeft = false;
	this.alphaSet(0);
};
const Method_exit_btn = function(){
	this.init({idx:9, col:2, spr:2, x:690, y:90, w:60, h:60});
	this.btnSet();
	this.alphaSet(0);
};
const Method_prev_btn = function(){
	this.init({idx:10, active:false, col:2, spr:2, x:270, y:456});
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
	this.init({idx:11, active:false, col:2, spr:2, x:440, y:456});
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
	this.init({idx:12, x:0, y:477, w:9, h:8});
	this.alphaSet(0);
};
const Select_bg = function(){
	this.init({idx:13, x:"center", y:120});
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
	this.init({idx:14, col:2, spr:2, x:670, y:100, w:60, h:60});
	this.btnSet();
	this.alphaSet(0);
};
const Select_start_btn = function(){
	this.init({idx:15, col:2, spr:2, x:"center", y:420});
	this.btnSet();
	this.alphaSet(0);
};
const Select_male_btn = function(){
	this.init({idx:16, col:4, spr:8, x:130, y:200});
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
	this.init({idx:16, col:4, spr:8, x:405, y:200});
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
	this.init({idx:17, x:"center", y:220});
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
	this.init({idx:17, x:230, y:182});
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
	this.init({idx:18, col:3, spr:3, x:50, y:190});
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
	this.init({idx:18, col:3, spr:3, x:620, y:150});
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
	this.init({idx:19, col:2, spr:2, x:670, y:60});
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
	this.init({idx:20, col:2, spr:2, x:0, y:325});
	this.clickable = true;
	this.btnSet();
};
const Conv_start_btn = function(){
	this.init({idx:21, active:false, col:1, spr:2, x:140, y:325});
	this.btnSet();
};
const Conv_press = function(){
	this.init({idx:22, col:1, spr:14, x:"center", y:490});
	this.alphaSet(0);
	this.aniSet(6);
};
const Main_layer = function(){
	this.init({idx:23});
	this.appear = true;
	this.alphaSet(1);
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
const Main_readyGo = function(){
	this.init({idx:24, col:5, spr:25, x:"center", y:"center"});
	this.aniReady = function(){
		this.active = true;
		this.cutSet(5);
	};
	this.aniStart = function(){
		this.ani = 75;
		this.aniSet(5);
	};
	this.aniFinFunc = function(){
		this.active = false;
		this.isAni = false;
		this.load = true;
	};
};
const Main_stage_alert = function(){
	this.init({idx:25, active:false, col:1, spr:5});
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
			}
			if(this.y < absHeight * 0.5 - this.h * 0.5){
				this.y += 8;
			}
			if(this.delay < 120){
				this.delay++;
			}
			else{
				this.delay = 0;
				this.appear = false;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
			}
			if(this.y > 0){
				this.y -= 8;
			}
			else{
				this.active = false;
				this.load = true;
			}
		}
	};
	this.start = function(){
		this.y = 0;
		this.globalAlpha = 0;
		this.active = true;
		this.appear = true;
	};
};
const Main_top_bg = function(){
	this.init({idx:26, x:"center", y:-45});
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
const Main_top_man = function(){
	this.init({idx:27, x:135, y:-33});
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
const Main_top_dist = function(){
	this.x = 480;
	this.y = 2;
	this.dist = 0;
	this.globalAlpha = 0;
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
			ctx.textAlign = "right";	
			ctx.font = (22 * hR) +"px '나눔스퀘어'";
			ctx.fillStyle = "#FFF";
			ctx.fillText(this.dist+"/"+(stage*100)+"M", this.x * wR, this.y * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_top_num = function(px){
	this.init({idx:28, col:1, spr:12, x:px, y:-28});
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
const Main_exit_btn = function(){
	this.init({idx:29, col:2, spr:2, x:720, y:5, w:60, h:60});
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
const Main_btm_bg = function(){
	this.init({idx:30, x:"center", y:508});
	this.alphaSet(0);
};
const Main_btm_stage = function(){
	this.init({idx:31, col:5, spr:5, x:255, y:527});
	this.alphaSet(0);
};
const Main_btm_num = function(px){
	this.init({idx:32, col:10, spr:10, x:px, y:528});
	this.alphaSet(0);
};
const Main_black_layer = function(){
	this.globalAlpha = 0.5;
	this.draw = function(){
		try{ 
			if(this.appear){
				if(this.globalAlpha < 0.5){
					this.globalAlpha += 0.025;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.025;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.beginPath();
			ctx.rect(0, 0, cvs.width, cvs.height);
			ctx.fillStyle = "#000";
			ctx.fill();			
			ctx.restore();
		}
		catch(e){}
	};
};
const Exit_bg = function(){
	this.init({idx:33, x:"center", y:"center"});
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
const Exit_yes_btn = function(){
	this.init({idx:34, col:2, spr:2, x:260, y:320});
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
const Exit_no_btn = function(){
	this.init({idx:35, col:2, spr:2, x:420, y:320});
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
const Main_bg_btm = function(){
	this.init({idx:36});
	this.oriY = this.y;
	this.tarY = this.y + 530;
	this.etcSet();
	this.etcFunc = function(){
		if(this.up){
			if(this.y > this.oriY){
				this.y -= 10;
			}
			else{
				this.y = this.oriY;
				this.up = false;
			}
		}
		if(this.down){
			if(this.y < this.tarY){
				this.y += 10;
			}
			else{
				this.y = this.tarY;
				this.down = false;
			}
		}
	};
};
const Main_bg_top = function(){
	this.init({idx:37, y:-530});
	this.oriY = this.y;
	this.tarY = this.y + 530;
	this.etcSet();
	this.etcFunc = function(){
		if(this.up){
			if(this.y > this.oriY){
				this.y -= 10;
			}
			else{
				this.y = this.oriY;
				this.up = false;
			}
		}
		if(this.down){
			if(this.y < this.tarY){
				this.y += 10;
			}
			else{
				this.y = this.tarY;
				this.down = false;
			}
		}
	};
};
const Main_bg_cloud = function(pi){
	this.init({idx:38, x:pi * 1600, y:150});
	this.movement = 2;
	this.oriY = this.y;
	this.tarY = this.y + 530;
	this.etcSet();
	this.etcFunc = function(){
		if(this.up){
			if(this.y > this.oriY){
				this.y -= 10;
			}
			else{
				this.y = this.oriY;
				this.up = false;
			}
		}
		if(this.down){
			if(this.y < this.tarY){
				this.y += 10;
			}
			else{
				this.y = this.tarY;
				this.down = false;
			}
		}
	};
};
const Main_bg_grass = function(pi){
	this.init({idx:39, x:pi * 1600, y:320});
	this.movement = 5;
	this.oriY = this.y;
	this.tarY = this.y + 530;
	this.etcSet();
	this.etcFunc = function(){
		if(this.up){
			if(this.y > this.oriY){
				this.y -= 10;
			}
			else{
				this.y = this.oriY;
				this.up = false;
			}
		}
		if(this.down){
			if(this.y < this.tarY){
				this.y += 10;
			}
			else{
				this.y = this.tarY;
				this.down = false;
			}
		}
	};
};
const Main_bg_tile = function(){
	this.init({idx:40, col:1, spr:4, x:0, y:390});
	this.aniSet(3);
	this.oriY = this.y;
	this.tarY = this.y + 530;
	this.etcSet();
	this.etcFunc = function(){
		if(this.up){
			if(this.y > this.oriY){
				this.y -= 10;
			}
			else{
				this.y = this.oriY;
				this.up = false;
			}
		}
		if(this.down){
			if(this.y < this.tarY){
				this.y += 10;
			}
			else{
				this.y = this.tarY;
				this.down = false;
			}
		}
	};
};
const Main_bg_sky = function(pi){
	this.init({idx:41, x:pi * 1600, y:-176});
	this.movement = 5;
	this.oriY = this.y;
	this.tarY = this.y + 530;
	this.etcSet();
	this.etcFunc = function(){
		if(this.up){
			if(this.y > this.oriY){
				this.y -= 10;
			}
			else{
				this.y = this.oriY;
				this.up = false;
			}
		}
		if(this.down){
			if(this.y < this.tarY){
				this.y += 10;
			}
			else{
				this.y = this.tarY;
				this.down = false;
			}
		}
	};
};
const Main_char_man = function(){
	this.init({idx:42, col:14, spr:70, x:50, y:310});

	this.oriY = 310;
	this.isSJump = false;
	this.isDJump = false;
	this.isUp = false;
	this.isDown = false;
	this.isHit = false;
	this.isAtSky = false;
	this.clickable = true;
	this.cy = 0;
	this.colCntType = 11;

	this.vy = 0;
	this.gravity = 0;
	this.aniSet(4);
	this.aniFunc = function(){
		this.ani++;
		if(this.ani >= this.colCntType * this.aniDelay){
			if(this.isSJump || this.isDJump || this.isUp || this.isDown){
				if(this.y > this.oriY){
					this.aniFinFunc();
				}
				else{
					this.ani = this.colCntType * this.aniDelay - 1;
				}
			}
			else if(this.isDown){
				this.ani = this.colCntType * this.aniDelay - 1;
			}
			else{
				this.aniFinFunc();
			}
		}
		this.cx = Math.floor((this.ani % (this.colCntType * this.aniDelay)) / this.aniDelay) * this.cw;
	};	
	this.aniFinFunc = function(){
		this.reset();
	};
	this.sJump = function(){
		this.isSJump = true;	this.isDJump = false;
		this.setAni(1, 11);
		this.vy = -10;
		this.gravity = 0.5;
		this.clickable = true;
	};
	this.dJump = function(){
		this.isSJump = false;	this.isDJump = true;
		this.setAni(2, 14);
		this.vy = -10;
		this.gravity = 0.5;
		this.clickable = false;
	};
	this.up = function(){
		this.isSJump = false;	this.isDJump = false;
		this.isUp = true;
		this.isAtSky = true;
		this.setAni(3, 13);
		this.vy = -11;
		this.gravity = 0.3;
		this.clickable = false;
	};
	this.down = function(){
		this.isSJump = false;	this.isDJump = false;
		this.isDown = true;
		this.isAtSky = false;
		this.setAni(2, 14);
		this.clickable = false;
	};
	this.hit = function(){
		this.isSJump = false;	this.isDJump = false;
		this.isHit = true;
		this.setAni(4, 11);
		this.y = this.oriY;
		this.clickable = false;
	};
	this.reset = function(){
		this.isSJump = false;	this.isDJump = false;
		this.isUp = false;		this.isDown = false;
		this.isHit = false;
		this.setAni(0, 11);
		this.y = this.oriY;
		this.clickable = true;
	};
	this.setAni = function(ch, col){
		this.ani = 0;
		this.cy = this.ch * ch;
		this.colCntType = col;
	};
};
const Main_char_woman = function(){
	this.init({idx:43, col:11, spr:55, x:50, y:310});

	this.oriY = 310;
	this.isSJump = false;
	this.isDJump = false;
	this.isUp = false;
	this.isDown = false;
	this.isHit = false;
	this.isAtSky = false;
	this.clickable = true;
	this.cy = 0;
	this.colCntType = 11;

	this.vy = 0;
	this.gravity = 0;
	this.aniSet(4);
	this.aniFunc = function(){
		this.ani++;
		if(this.ani >= this.colCntType * this.aniDelay){
			if(this.isSJump || this.isDJump || this.isUp || this.isDown){
				if(this.y > this.oriY){
					this.aniFinFunc();
				}
				else{
					this.ani = this.colCntType * this.aniDelay - 1;
				}
			}
			else if(this.isDown){
				this.ani = this.colCntType * this.aniDelay - 1;
			}
			else{
				this.aniFinFunc();
			}
		}
		this.cx = Math.floor((this.ani % (this.colCntType * this.aniDelay)) / this.aniDelay) * this.cw;
	};	
	this.aniFinFunc = function(){
		this.reset();
	};
	this.sJump = function(){
		this.isSJump = true;	this.isDJump = false;
		this.setAni(1, 11);
		this.vy = -10;
		this.gravity = 0.5;
		this.clickable = true;
	};
	this.dJump = function(){
		this.isSJump = false;	this.isDJump = true;
		this.setAni(2, 11);
		this.vy = -10;
		this.gravity = 0.5;
		this.clickable = false;
	};
	this.up = function(){
		this.isSJump = false;	this.isDJump = false;
		this.isUp = true;
		this.isAtSky = true;
		this.setAni(3, 11);
		this.vy = -11;
		this.gravity = 0.3;
		this.clickable = false;
	};
	this.down = function(){
		this.isSJump = false;	this.isDJump = false;
		this.isDown = true;
		this.isAtSky = false;
		this.setAni(2, 11);
		this.clickable = false;
	};
	this.hit = function(){
		this.isSJump = false;	this.isDJump = false;
		this.isHit = true;
		this.setAni(4, 11);
		this.y = this.oriY;
		this.clickable = false;
	};
	this.reset = function(){
		this.isSJump = false;	this.isDJump = false;
		this.isUp = false;		this.isDown = false;
		this.isHit = false;
		this.setAni(0, 11);
		this.y = this.oriY;
		this.clickable = true;
	};
	this.setAni = function(ch, col){
		this.ani = 0;
		this.cy = this.ch * ch;
		this.colCntType = col;
	};
};
const Obj = function(ptype, px, py, pcut){
	if(ptype == 0){			// 책
		this.init({idx:44, col:7, spr:35, y:Math.floor(py/3) * (-530) + 365 - (py%3) * 100, h:70});
		this.cutSet((stage - 1) * 7 + pcut);
	}
	else if(ptype == 1){	// 바리케이드(1층만있음)
		this.init({idx:45, y:400});
	}
	else if(ptype == 2){	// 폭탄
		this.init({idx:46, y:365-py*95});
	}
	else if(ptype == 3){	// 시계
		this.init({idx:47, y:365-py*95});
	}
	else if(ptype == 4){	// 꼬깔(1층만있음)
		this.init({idx:48, y:405});
	}
	else if(ptype == 5){	// 퀴즈(1층만있음)
		this.init({idx:49, y:380});
	}
	this.x = 800 + px*120 + 60 - this.w * 0.5;
	this.type = ptype;
	this.oriY = this.y;
	this.tarY = this.y + 530;
	this.hitable = true;
	this.etcSet();
	this.etcFunc = function(){
		if(this.up){
			if(this.y > this.oriY){
				this.y -= 10;
			}
			else{
				this.y = this.oriY;
				this.up = false;
			}
		}
		if(this.down){
			if(this.y < this.tarY){
				this.y += 10;
			}
			else{
				this.y = this.tarY;
				this.down = false;
			}
		}
	};
};
const Obj_eff = function(ptype, px, py){
	if(ptype == 0){
		this.init({idx:50, col:4, spr:8, x:px, y:py, w:70, h:70});
	}
	else if(ptype == 1){
		this.init({idx:51, col:4, spr:8, x:px, y:py, w:70, h:70});
	}
	else if(ptype == 2){
		this.init({idx:52, col:7, spr:14});
		this.x = px + 70 * 0.5 - this.w * 0.5;
		this.y = py + 70 * 0.5 - this.h * 0.5;
	}
	this.hitable = false;
	this.aniSet(5);
	this.aniFinFunc = function(){
		this.active = false;
	};
};
const Quiz_bg = function(){
	this.init({idx:53, x:"center", y:"center"});
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
const Quiz_title = function(){
	this.x = 400;this.y = 210;
	this.size = 18;
	this.color = "#663300";
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

			ctx.textAlign = "center";				
			ctx.font = (this.size * hR)+"px '나눔스퀘어'";
			ctx.fillStyle = this.color;
			
			let tmp_arr = quiz_arr[stage-1][0].split("\n");
			for(let i=0;i<tmp_arr.length;i++){
				ctx.fillText(tmp_arr[i], this.x * wR, (this.y + i * 25) * hR);
			}
			ctx.restore();
		}
		catch(e){}
	};
};
const Quiz_time = function(){
	this.init({idx:54, col:10, spr:10, x:375, y:365});
	this.cutSet(9);
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
const Quiz_left_btn = function(){
	this.init({idx:55, col:4, spr:4, x:90, y:275});
	this.alphaSet(0);
	this.size = 28;
	this.color = "#000";
	this.txt_x = 225;
	this.txt_y = 370;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseOver){
					this.cx = this.cw;
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
				ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				// 글자
				ctx.textAlign = "center";			
				ctx.font = (this.size * hR)+"px '나눔스퀘어'";
				ctx.fillStyle = this.color;				
				let tmp_arr = quiz_arr[stage-1][1].split("\n");
				for(let i=0;i<tmp_arr.length;i++){
					ctx.fillText(tmp_arr[i], this.txt_x * wR, (this.txt_y - (tmp_arr.length - 1) * 15 + i * 28) * hR);
				}	
				ctx.restore();
			}
		}
		catch(e){}
	};
};
const Quiz_right_btn = function(){
	this.init({idx:55, col:4, spr:4, x:475, y:275});
	this.alphaSet(0);
	this.size = 25;
	this.color = "#000";
	this.txt_x = 565;
	this.txt_y = 370;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseOver){
					this.cx = this.cw * 3;
				}
				else{
					this.cx = this.cw * 2;
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
				ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				// 글자
				ctx.textAlign = "center";			
				ctx.font = (this.size * hR)+"px '나눔스퀘어'";
				ctx.fillStyle = this.color;				
				let tmp_arr = quiz_arr[stage-1][2].split("\n");
				for(let i=0;i<tmp_arr.length;i++){
					ctx.fillText(tmp_arr[i], this.txt_x * wR, (this.txt_y - (tmp_arr.length - 1) * 15 + i * 28) * hR);
				}		
				ctx.restore();
			}
		}
		catch(e){}
	};
};
const Quiz_result = function(){
	this.init({idx:56, col:1, spr:3, x:0, y:"center"});
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
			}
			else{
				this.globalAlpha = 1;
				this.delay++;
				if(this.delay > 90){
					this.delay = 0;
					this.appear = false;
					this.load = true;
				}
			}
		}
		if(this.disappear){
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
			}
			else{
				this.globalAlpha = 0;
				this.disappear = false;
				this.unload = true;
			}
		}
	};
};
const Clear_bg = function(){
	this.init({idx:57, active:false, x:"center", y:100});
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
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
				}
				else{
					this.active = false;
					this.loaded = true;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Clear_content = function(){
	this.color1 = "#000";
	this.color2 = "#874607";
	this.color3 = "#CC3300";
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

			ctx.textAlign = "left";	
			
			ctx.font = "bold "+(25 * hR)+"px '나눔스퀘어'";
			ctx.fillStyle = this.color1;
			ctx.fillText("남은시간 : " + time, 350 * wR, 260 * hR);

			ctx.textAlign = "center";

			ctx.font = "bold "+(22 * hR)+"px '나눔스퀘어'";
			ctx.fillStyle = this.color2;
			ctx.fillText(time + " X 100 = " + split3digit(time * 100), 400 * wR, 300 * hR);

			ctx.font = "bold "+(25 * hR)+"px '나눔스퀘어'";
			ctx.fillStyle = this.color3;
			ctx.fillText(time * 100 +"점 추가", 400 * wR, 330 * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Clear_level_btn = function(){
	this.init({idx:58, col:2, spr:2, x:"center", y:340});
	this.globalAlpha = 0;
	this.appear = false;
	this.btnSet();
	this.draw = function(){
		try{ 
			if(this.colCnt > 1){
				if(this.mouseOver){
					this.cx = this.cw;
				}
				else{
					this.cx = 0;
				}
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
			ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Finale_bg = function(){
	this.init({idx:59, active:false, x:"center", y:50});
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
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
				}
				else{
					this.active = false;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Finale_content = function(){
	this.x = 400;
	this.y = 250;
	this.draw = function(){
		try{ 
			ctx.textAlign = "center";	
			if(loggedIn){
				ctx.font = "bold "+(20 * hR)+"px '나눔스퀘어'";
				ctx.fillStyle = "#000";
				ctx.fillText(userId+"님!!", this.x * wR, this.y * hR);
				ctx.fillText("게임 '헌법 런런런'을 완료하였습니다.", this.x * wR, (this.y + 30) * hR);
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
const Finale_home_btn = function(){
	this.init({idx:60, col:2, spr:2, x:"center", y:342, w:141, h:47});
	this.globalAlpha = 0;
	this.appear = false;
	this.btnSet();
	this.draw = function(){
		try{ 
			if(this.colCnt > 1){
				if(this.mouseOver){
					this.cx = this.cw;
				}
				else{
					this.cx = 0;
				}
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
			ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Over_bg = function(){
	this.init({idx:61, active:false, x:"center", y:50});
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
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
				}
				else{
					this.active = false;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Over_content = function(){
	this.color1 = "#874607";
	this.color2 = "#CC3300";
	this.s = 28;
	this.x1 = 200;
	this.x2 = 510;
	this.x3 = 530;
	this.y = 260;
	this.draw = function(){
		try{
			ctx.textAlign = "left";				
			ctx.font = "bold "+(this.s * hR)+"px '나눔스퀘어'";
			ctx.fillStyle = this.color1;
			ctx.fillText("당신의 점수는", this.x1 * wR, this.y * hR);
			ctx.fillText("입니다.", this.x3 * wR, this.y * hR);

			ctx.textAlign = "right";
			ctx.fillStyle = this.color2;
			ctx.fillText(score_tmp + " 점", this.x2 * wR, this.y * hR);
		}
		catch(e){}
	};
};
const Over_home_btn = function(){
	this.init({idx:62, col:2, spr:2, x:"center", y:332, w:141, h:47});
	this.globalAlpha = 0;
	this.appear = false;
	this.btnSet();
	this.draw = function(){
		try{ 
			if(this.colCnt > 1){
				if(this.mouseOver){
					this.cx = this.cw;
				}
				else{
					this.cx = 0;
				}
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
			ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_top_gage = function(){
	this.init({idx:63, x:140, y:-9});
	this.oriW = this.w;
	this.w = 0;

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
const Mobile_jump_btn = function(){
	this.init({idx:64, active:false, x:10, y:445, w:75, h:75});
};
const Main_building_stage = function(pidx){
	if(stage == 1){
		this.init({idx:65, col:4, spr:4});
	}
	else if(stage == 2){
		this.init({idx:66, col:2, spr:2});
	}
	else if(stage == 3){
		this.init({idx:67, col:2, spr:2});
	}
	else if(stage == 4){
		this.init({idx:68, col:4, spr:4});
	}
	else if(stage == 5){
		this.init({idx:69, col:2, spr:2});
	}
	this.cutSet(pidx);
	this.y = 390 - this.h;
	this.oriY = this.y;
	this.tarY = this.y + 530;
	this.movement = 5;
	this.etcSet();
	this.etcFunc = function(){
		if(this.up){
			if(this.y > this.oriY){
				this.y -= 10;
			}
			else{
				this.y = this.oriY;
				this.up = false;
			}
		}
		if(this.down){
			if(this.y < this.tarY){
				this.y += 10;
			}
			else{
				this.y = this.tarY;
				this.down = false;
			}
		}
	};
};
const Main_building_common = function(){
	this.init({idx:70, col:3, spr:3, x:1200, y:130});
	this.oriY = this.y;
	this.tarY = this.y + 530;
	this.movement = 5;
	this.etcSet();
	this.etcFunc = function(){
		if(this.up){
			if(this.y > this.oriY){
				this.y -= 10;
			}
			else{
				this.y = this.oriY;
				this.up = false;
			}
		}
		if(this.down){
			if(this.y < this.tarY){
				this.y += 10;
			}
			else{
				this.y = this.tarY;
				this.down = false;
			}
		}
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
let player = new Object(),
	main_black_layer = new Object(),
	main_top_dist = new Object(),
	main_top_gage = new Object(),
	main_layer = new Object(),
	main_readyGo = new Object(),
	main_exit_btn = new Object(),
	main_stage_alert = new Object(),
	main_btm_stage = new Object(),
	exit_bg = new Object(),
	exit_yes_btn = new Object(),
	exit_no_btn = new Object(),
	clear_bg = new Object(),
	clear_content = new Object(),
	clear_level_btn = new Object(),
	finale_bg = new Object(),
	finale_content = new Object(),
	finale_home_btn = new Object(),
	over_bg = new Object(),
	over_content = new Object(),
	over_home_btn = new Object(),
	quiz_bg = new Object(),
	quiz_title = new Object(),
	quiz_time = new Object(),
	quiz_result = new Object(),
	quiz_left_btn = new Object(),
	quiz_right_btn = new Object(),
	obj_arr = new Array(),
	main_bg_tile = new Object(),
	main_bg_arr = new Array(),
	main_bg_cloud_arr = new Array(),
	main_bg_grass_arr = new Array(),
	main_bg_building_arr = new Array(),
	main_bg_sky_arr = new Array(),
	main_building_common = new Object();
let mobile_jump_btn = new Object();
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
let gender = 1;																					// 성별 남:1 여:2
let convIdx = 0;																				// 인트로단계대화 순서
let convEnd = false;																			// 인트로단계대화 각 순서 종료여부
let typeInterval = new Object();																// 인트로단계대화 인터벌
let typingIdx = 0;																				// 인트로단계대화 글자인덱스
let typingColIdx = 0;																			// 인트로단계대화 줄인덱스
let conv_user_result_Arr = new Array(),															// 인트로단계대화 유저멘트 배열
	conv_pc_result_Arr = new Array(),															// 인트로단계대화 PC멘트 배열
	typeSplitText = new Array();																// 인트로단계대화 문장삽입용 배열
let stage = 0;																					// 레벨
let score = 0;																					// 점수
let score_tmp = 0;
let time = 90;																					// 게임시간 90초
let timeInterval = new Object();																// 게임시간 인터벌
let totalDist = 0;																				// 전체 거리 계산용
let isGamePlaying = false;																		// ui 제외 실제게임 진행여부
let isBgMoving = false;																			// 배경 이동여부
let isObjMoving = false;																		// 오브젝트 이동여부
let isQuizSet = false;																			// 퀴즈 세팅 여부
let quizInterval = new Object();																// 퀴즈시간 인터벌
let conv_Arr = [
	["이제 게임 시작이구나! 그런데 어떻게","해야 하는거지... 하나도 모르겠어!","잉잉 ㅠㅜ"],
	["안녕? 나는 너를 도와줄 헌법의 요정!","게임 중에는 '스페이스 바' 키를 사용!","누르면.. '점프'를 한단다!"],
	["아... 점프! 그리고 점프 뛰는 중에","'스페이스 바' 키를 한번 더 누르면","'2단 점프'도 가능하다고 들었어요!"],
	["응 그래! 똑똑하구나~ 그렇게 장애물을","피하면서 '헌법재판소와 연관된 단어","가 쓰여진 책'들을 모으면 된단다!"],
	["'헌법재판소와 연관된 단어가 쓰여진","책'이라... 그러면 단어가 쓰여진 책들","은 전부 먹으면 되는거에요?"],
	["단어 중에는 '헌법재판소와 관련 없는'","단어도 있으니, 그런 단어는 피하는 게","좋단다~ 점수가 깎이거든..."],
	["그리고, 달리는 도중 '시간'이 나오던","데, 시간이 다 되기 전에 '목표 거리'에","도착 못하면 게임이 끝나는 거에요?"],
	["그렇단다! 장애물들을 최대한 피하고,","'모래 시계'아이템으로 시간을 늘리고,","'갈림길 퀴즈'를 잘 통과해야 한단다~"],
	["갈림길 퀴즈? 달리는 중간에 나오는","'QUIZ'라고 쓰여진 팻말을 얘기하는","건가요?"],
	["그렇지~ '갈림길 퀴즈'에서 정답을 맞","추면 잠시동안 '편한 길'로 갈 수 있기","때문에 시간을 단축할 수 있어!"],
	["그렇군요, 갈림길 퀴즈가 나오면 문제","를 반드시 맞추어야겠어요!"],
	["그래, 서울의 이곳저곳을 거쳐가면서","마지막 목적지인 '헌법재판소'까지 단","어책들을 모으면서 잘 달려오렴!"],
	["알겠어요, 이제 한번 열심히 해볼께요!","아자아자!"]
];
let quiz_arr = [
	["1988년 출범 후, 헌법을 수호하여 대한민국을 진정한 민주주의 국가로\n발전시키는데 큰 역할을 한 기관은?", "교육부", "헌법\n재판소", 2],
	["헌법에 대한 분쟁을 최종적으로 심판하는 기관은?", "대법원", "헌법\n재판소", 2],
	["국민의 기본권을 보장하고 권력을 가진 기관을\n통제하는 역할을 하는 기관은?", "헌법\n재판소", "청와대", 1],
	["약100개국 이상의 헌법재판기관장과 국제기구의\n대표가 참석하는 2014년 세계헌법재판회의를 유치한 국가는?", "브라질", "대한민국", 2],
	["아시아헌법재판소연합의 창립을 주도한\n초대 의장국은?", "대한민국", "일본", 1]
];
let obj_info_arr = [
	// [x, y, type, 책일경우 cutidx] : 0 책 / 1 바리케이드 / 2 폭탄 / 3 시계 / 4 꼬깔 / 5 퀴즈
	[
		[0, 0, 0, 0],
		[1, 0, 0, 0],
		[2, 0, 0, 0],
		[3, 1, 0, 1],
		[4, 1, 0, 1],
		[5, 1, 0, 1],
		[6, 2, 0, 5],
		[7, 2, 0, 5],
		[8, 2, 0, 5],
		[9, 0, 1],
		[10, 2, 0, 2],
		[11, 1, 0, 3],
		[12, 0, 0, 0],
		[13, 1, 0, 1],
		[14, 2, 0, 5],
		[15, 0, 1],
		[16, 1, 0, 2],
		[17, 1, 0, 3],
		[18, 1, 0, 0],
		[19, 0, 0, 6],
		[20, 0, 0, 5],
		[21, 1, 0, 3],
		[22, 1, 0, 0],
		[23, 1, 0, 1],
		[24, 0, 0, 2],
		[25, 0, 0, 3],
		[26, 0, 1],		[26, 1, 0, 0],	
		[27, 1, 0, 1],
		[28, 0, 2],		[28, 1, 2],	
		[30, 1, 3],
		[31, 1, 3],
		[32, 1, 3],
		[34, 0, 5],

		// 하늘
		[36.5, 3, 0, 0],	[37, 3, 0, 0],		[37.5, 3, 0, 0],
		[38, 4, 0, 1],		[38.5, 4, 0, 1],	[39, 4, 0, 1],
		[39.5, 5, 0, 2],	[40, 5, 0, 2],		[40.5, 5, 0, 2],
		[41, 3, 0, 3],		[41.5, 3, 0, 3],	[42, 3, 0, 3],
		[42.5, 4, 0, 0],	[43, 4, 0, 0],		[43.5, 4, 0, 0],
		[44, 5, 0, 1],		[44.5, 5, 0, 1],	[45, 5, 0, 1],
		[45.5, 3, 0, 0],	[46, 4, 0, 1],		[46.5, 5, 0, 2],
		// 땅
		[35, 0, 2],		[35, 1, 2],		
		[36, 0, 2],		[36, 1, 2],		
		[37, 0, 2],		[37, 1, 2],		
		[38, 0, 2],		[38, 1, 2],		
		[39, 0, 2],		[39, 1, 2],		
		[40, 0, 2],		[40, 1, 2],		
		[41, 0, 2],		[41, 1, 2],		
		[42, 0, 2],		[42, 1, 2],		
		[43, 0, 2],		[43, 1, 2],		
		[44, 0, 2],		[44, 1, 2],		
		[45, 0, 2],		[45, 1, 2],		
		[46, 0, 2],		[46, 1, 2],	
		
		[50, 0, 3],		[50, 1, 3],		[50, 2, 3],			
		[52, 0, 1],		[52, 1, 0, 3],	
		[53, 1, 0, 0],
		[54, 0, 1],		[54, 1, 0, 1],	
		[55, 1, 0, 2],
		[56, 0, 1],		[56, 1, 0, 3],	
		[57, 1, 0, 0],
		[58, 0, 1],		[58, 1, 0, 1],	
		[59, 1, 0, 2],
		[60, 0, 1],		[60, 1, 0, 3],	
		[62, 1, 0, 0],
		[63, 1, 0, 1],
		[64, 1, 0, 5],
		[65, 0, 0, 2],
		[66, 0, 0, 3],
		[67, 0, 0, 6],
		[68, 1, 0, 5],
		[69, 1, 0, 6],
		[70, 2, 0, 0],
		[71, 2, 0, 1],
		[72, 2, 0, 2],
		[73, 1, 0, 3],
		[74, 1, 0, 0],
		[75, 1, 0, 5],
		[77, 0, 1],		[77, 1, 0, 2],	[77, 2, 0, 1],		
		[79, 0, 1],		[79, 1, 0, 0],	[79, 2, 0, 3],	
		[81, 0, 2],		[81, 1, 2],		
		[83, 0, 3],		[83, 1, 3],		[83, 2, 3],			
		[84, 0, 3],		[84, 1, 3],		[84, 2, 3],			
		[86, 0, 0, 0],	[86, 1, 0, 0],	[86, 2, 0, 0],	
		[87, 0, 0, 0],	[87, 1, 0, 0],	[87, 2, 0, 0],		
		[89, 0, 0, 1],	[89, 1, 0, 1],	[89, 2, 0, 1],		
		[90, 0, 0, 1],	[90, 1, 0, 1],	[90, 2, 0, 1],	
		[92, 0, 0, 2],	[92, 1, 0, 2],	[92, 2, 0, 2],		
		[93, 0, 0, 2],	[93, 1, 0, 2],	[93, 2, 0, 2],	
		[95, 0, 0, 3],	[95, 1, 0, 3],	[95, 2, 0, 3],		
		[96, 0, 0, 3],	[96, 1, 0, 3],	[96, 2, 0, 3],	
	],
	[
		[0, 0, 0, 0],
		[1, 0, 0, 0],	[1, 1, 0, 0],
		[2, 0, 0, 0],
		[3, 0, 4],		[3, 2, 0, 5],
		[4, 1, 0, 6],	[4, 2, 0, 5],
		[5, 2, 0, 5],
		[6, 0, 4],
		[7, 0, 0, 1],	[7, 1, 0, 1],
		[8, 0, 4],
		[9, 0, 0, 2],	[9, 1, 0, 2],
		[10, 0, 4],
		[11, 0, 0, 3],	[11, 1, 0, 3],
		[12, 0, 4],
		[13, 1, 0, 0],	
		[14, 0, 4],		[14, 1, 0, 1],
		[15, 1, 0, 2],
		[16, 1, 0, 3],
		[17, 0, 4],		[17, 1, 0, 0],
		[18, 1, 0, 1],
		[19, 0, 0, 2],
		[20, 0, 0, 5],
		[21, 0, 0, 6],
		[22, 0, 0, 3],
		[23, 1, 0, 5],
		[24, 1, 0, 6],
		[25, 1, 0, 0],
		[26, 1, 0, 1],
		[27, 0, 0, 2],
		[28, 0, 4],
		[29, 0, 0, 0],	[29, 1, 0, 3],
		[30, 0, 4],
		[31, 0, 0, 2],	[31, 1, 0, 1],
		[32, 0, 4],
		[34, 1, 3],
		[35, 1, 3],
		[36, 1, 3],
		[38, 0, 0, 2],	[38, 1, 0, 1],	[38, 2, 0, 0],
		[39, 0, 2],		[39, 1, 2],		[39, 2, 0, 3],
		[40, 0, 0, 2],	[40, 1, 0, 1],	[40, 2, 0, 0],
		[41, 0, 2],		[41, 1, 2],		[41, 2, 0, 3],
		[42, 0, 0, 2],	[42, 1, 0, 1],	[42, 2, 0, 0],
		[44, 0, 5],

		// 하늘
		[47.5, 3, 0, 0],	[48, 3, 0, 0],		[48.5, 3, 0, 0],
		[49, 4, 0, 1],		[49.5, 4, 0, 1],	[50, 4, 0, 1],
		[50.5, 5, 0, 2],	[51, 5, 0, 2],		[51.5, 5, 0, 2],
		[52, 3, 0, 3],		[52.5, 3, 0, 3],	[53, 3, 0, 3],
		[53.5, 4, 0, 0],	[54, 4, 0, 0],		[54.5, 4, 0, 0],
		[55, 5, 0, 1],		[55.5, 5, 0, 1],	[56, 5, 0, 1],
		[56.5, 3, 0, 2],	[57, 4, 0, 2],		[57.5, 5, 0, 2],
		// 땅
		[45, 0, 2],		[45, 1, 2],
		[46, 0, 2],		[46, 1, 2],
		[47, 0, 2],		[47, 1, 2],	
		[48, 0, 2],		[48, 1, 2],
		[49, 0, 2],		[49, 1, 2],
		[50, 0, 2],		[50, 1, 2],	
		[51, 0, 2],		[51, 1, 2],	
		[52, 0, 2],		[52, 1, 2],	
		[53, 0, 2],		[53, 1, 2],	
		[54, 0, 2],		[54, 1, 2],	
		[55, 0, 2],		[55, 1, 2],		
		[56, 0, 2],		[56, 1, 2],			
		[57, 0, 2],		[57, 1, 2],	
		
		[59, 0, 0, 0],	
		[60, 0, 0, 1],
		[61, 0, 0, 2],
		[62, 0, 4],		[62, 1, 0, 3],	
		[63, 0, 0, 0],
		[64, 0, 0, 1],
		[65, 0, 4],		[65, 1, 0, 2],
		[66, 0, 0, 3],
		[67, 0, 0, 1],
		[68, 0, 4],		[68, 1, 0, 2],
		[69, 0, 0, 3],
		[70, 0, 0, 0],
		[71, 0, 4],		[71, 1, 0, 0],
		[72, 0, 0, 1],
		[73, 0, 0, 2],
		[75, 0, 3],		[75, 1, 3],		[75, 2, 3],
		[77, 1, 2],	
		[78, 1, 0, 3],	[78, 2, 2],	
		[79, 1, 2],	
		[80, 1, 0, 0],	[80, 2, 2],	
		[81, 1, 2],	
		[82, 1, 0, 5],	[82, 2, 2],	
		[83, 1, 2],	
		[85, 0, 0, 1],	
		[86, 0, 0, 2],	
		[87, 0, 0, 3],
		[88, 1, 0, 6],	
		[89, 1, 0, 5],	
		[90, 1, 0, 6],	
		[91, 0, 0, 0],	
		[92, 0, 0, 1],	
		[93, 0, 0, 2],	
		[95, 0, 2],		[95, 1, 2],
		[98, 0, 3],		[98, 1, 3],		[98, 2, 3],	
		[99, 0, 3],		[99, 1, 3],		[99, 2, 3],
		[101, 0, 0, 0],	[101, 1, 0, 0],	[101, 2, 0, 0],
		[102, 0, 0, 0],	[102, 1, 0, 0],	[102, 2, 0, 0],
		[104, 0, 0, 1],	[104, 1, 0, 1],	[104, 2, 0, 1],
		[105, 0, 0, 1],	[105, 1, 0, 1],	[105, 2, 0, 1],
		[107, 0, 0, 2],	[107, 1, 0, 2],	[107, 2, 0, 2],
		[108, 0, 0, 2],	[108, 1, 0, 2],	[108, 2, 0, 2],
		[110, 0, 0, 3],	[110, 1, 0, 3],	[110, 2, 0, 3],
		[111, 0, 0, 3],	[111, 1, 0, 3],	[111, 2, 0, 3],
	],
	[
		[0, 0, 0, 0],	[0, 1, 0, 0],
		[2, 0, 0, 1],	[2, 1, 0, 1],
		[4, 0, 0, 5],	[4, 1, 0, 5],
		[6, 0, 0, 6],	[6, 1, 0, 6],
		[8, 0, 1],		[8, 1, 0, 2],
		[9, 0, 1],		[9, 1, 0, 3],
		[10, 0, 1],		[10, 1, 0, 4],
		[12, 0, 0, 0],
		[13, 0, 0, 1],	[13, 1, 0, 1],
		[14, 0, 1],		[14, 1, 0, 2],	[14, 2, 0, 2],
		[15, 0, 0, 3],	[15, 1, 0, 3],
		[16, 0, 0, 4],
		[18, 0, 0, 0],	[18, 1, 0, 0],	[18, 2, 0, 5],
		[20, 0, 0, 1],	[20, 1, 0, 6],	[20, 2, 0, 1],
		[22, 0, 0, 5],	[22, 1, 0, 2],	[22, 2, 0, 2],
		[24, 1, 0, 3],
		[25, 0, 1],		[25, 1, 0, 0],
		[26, 1, 0, 1],
		[27, 1, 0, 2],
		[28, 0, 0, 5],
		[29, 0, 0, 6],
		[30, 1, 3],
		[31, 1, 3],
		[32, 1, 3],
		[33, 0, 0, 5],
		[34, 0, 0, 6],
		[35, 1, 0, 0],
		[36, 1, 0, 1],
		[37, 0, 1],		[37, 1, 0, 2],
		[38, 1, 0, 3],	
		[40, 0, 0, 5],	[40, 1, 2],		[40, 2, 0, 0],
		[42, 0, 0, 6],	[42, 1, 2],		[42, 2, 0, 1],
		[44, 0, 0, 2],	[44, 1, 2],		[44, 2, 0, 5],
		[46, 0, 0, 3],	[46, 1, 2],		[46, 2, 0, 6],
		[48, 0, 0, 5],	[48, 1, 2],		[48, 2, 0, 4],	
		[50, 0, 5],
		
		// 하늘
		[52, 3, 0, 0],		[52.5, 3, 0, 0],	[53, 3, 0, 0],
		[53.5, 4, 0, 1],	[54, 4, 0, 1],		[54.5, 4, 0, 1],
		[55, 5, 0, 2],		[55.5, 5, 0, 2],	[56, 5, 0, 2],
		[56.5, 3, 0, 3],	[57, 3, 0, 3],		[57.5, 3, 0, 3],
		[58, 4, 0, 4],		[58.5, 4, 0, 4],	[59, 4, 0, 4],
		[59.5, 5, 0, 0],	[60, 5, 0, 1],		[60.5, 5, 0, 2],
		// 땅
		[51, 0, 2],		[51, 1, 2],		
		[52, 0, 2],		[52, 1, 2],		
		[53, 0, 2],		[53, 1, 2],		
		[54, 0, 2],		[54, 1, 2],		
		[55, 0, 2],		[55, 1, 2],		
		[56, 0, 2],		[56, 1, 2],		
		[57, 0, 2],		[57, 1, 2],		
		[58, 0, 2],		[58, 1, 2],		
		[59, 0, 2],		[59, 1, 2],		
		[60, 0, 2],		[60, 1, 2],	

		[63, 0, 0, 0],
		[64, 0, 0, 1],
		[65, 0, 0, 2],
		[66, 0, 0, 3],
		[67, 0, 0, 4],
		[68, 1, 0, 0],
		[69, 1, 0, 1],
		[70, 1, 0, 2],
		[71, 1, 0, 3],
		[72, 1, 0, 4],
		[73, 2, 0, 0],
		[74, 2, 0, 1],
		[75, 2, 0, 2],
		[76, 2, 0, 3],
		[77, 2, 0, 4],
		[79, 0, 3],		[79, 1, 3],		[79, 2, 3],
		[81, 1, 2],		[81, 2, 2],
		[82, 1, 0, 5],	[82, 2, 0, 5],
		[83, 0, 1],		[83, 2, 0, 5],
		[84, 1, 0, 5],	[84, 2, 0, 5],
		[85, 1, 2],		[85, 2, 2],
		[86, 1, 0, 6],	[86, 2, 0, 6],
		[87, 0, 1],		[87, 2, 0, 6],
		[88, 1, 0, 6],	[88, 2, 0, 6],
		[89, 1, 2],		[89, 2, 2],
		[90, 1, 0, 5],	[90, 2, 0, 5],
		[91, 0, 1],		[91, 2, 0, 5],
		[92, 1, 0, 5],	[92, 2, 0, 5],
		[93, 1, 2],		[93, 2, 2],
		[95, 0, 1],		[95, 1, 0, 0],	
		[96, 0, 1],		[96, 1, 0, 1],	
		[97, 0, 1],		[97, 1, 0, 2],	
		[99, 0, 0, 3],	[99, 1, 0, 5],	
		[100, 0, 0, 4],	[100, 1, 0, 6],	
		[102, 0, 2],	[102, 1, 2],	
		[104, 0, 3],	[104, 1, 3],	[104, 2, 3],
		[105, 0, 3],	[105, 1, 3],	[105, 2, 3],
		[107, 0, 0, 0],	[107, 1, 0, 0],	[107, 2, 0, 0],
		[108, 0, 0, 0],	[108, 1, 0, 0],	[108, 2, 0, 0],	
		[110, 0, 0, 1],	[110, 1, 0, 1],	[110, 2, 0, 1],
		[111, 0, 0, 1],	[111, 1, 0, 1],	[111, 2, 0, 1],	
		[113, 0, 0, 2],	[113, 1, 0, 2],	[113, 2, 0, 2],
		[114, 0, 0, 2],	[114, 1, 0, 2],	[114, 2, 0, 2],	
		[116, 0, 0, 3],	[116, 1, 0, 3],	[116, 2, 0, 3],
		[117, 0, 0, 3],	[117, 1, 0, 3],	[117, 2, 0, 3],	
		[119, 0, 0, 4],	[119, 1, 0, 4],	[119, 2, 0, 4],
		[120, 0, 0, 4],	[120, 1, 0, 4],	[120, 2, 0, 4],			
	],
	[
						[0, 1, 0, 0],
						[1, 1, 0, 1],
						[2, 1, 0, 2],
						[3, 1, 0, 5],
						[4, 1, 0, 6],
						[5, 1, 0, 5],
						[6, 1, 0, 3],
						[7, 1, 0, 4],
						[8, 1, 0, 0],
						[9, 1, 0, 1],
		[11, 0, 0, 6],	[11, 1, 0, 6],
		[13, 0, 0, 5],	[13, 1, 0, 5],
						[15, 1, 0, 2],	[15, 2, 0, 2],
						[17, 1, 0, 3],	[17, 2, 0, 3],
		[19, 0, 4],		[19, 1, 0, 0],
		[20, 0, 4],		[20, 1, 0, 1],
		[21, 0, 4],		[21, 1, 0, 2],
		[22, 0, 4],		[22, 1, 0, 3],
		[24, 0, 0, 4],
		[25, 0, 4],		[25, 1, 0, 0],
		[26, 0, 0, 1],
		[27, 0, 4],		[27, 1, 0, 2],
		[28, 0, 0, 3],
		[29, 0, 4],		[29, 1, 0, 4],
		[30, 0, 0, 0],
		[31, 0, 4],		[31, 1, 0, 1],
		[32, 0, 0, 2],
		[33, 0, 4],		[33, 1, 0, 3],
		[34, 0, 0, 4],
						[36, 1, 0, 5],
						[37, 1, 0, 6],
						[38, 1, 0, 5],
						[39, 1, 0, 6],
		[40, 0, 0, 0],
		[41, 0, 0, 1],
		[42, 0, 0, 2],
						[43, 1, 0, 3],
						[44, 1, 0, 4],
						[45, 1, 0, 0],
										[46, 2, 0, 1],
		[47, 0, 2],		[47, 1, 2],		[47, 2, 0, 2],
										[48, 2, 0, 3],
		[50, 0, 3],		[50, 1, 3],		[50, 2, 3],
		[52, 0, 5],
		
		// 하늘
		[54, 3, 0, 0],		[54.5, 3, 0, 0],	[55, 3, 0, 0],
		[55.5, 4, 0, 1],	[56, 4, 0, 1],		[56.5, 4, 0, 1],
		[57, 5, 0, 2],		[57.5, 5, 0, 2],	[58, 5, 0, 2],
		[58.5, 3, 0, 3],	[59, 3, 0, 3],		[59.5, 3, 0, 3],
		[60, 4, 0, 4],		[60.5, 4, 0, 4],	[61, 4, 0, 4],
		[61.5, 5, 0, 0],	[62, 5, 0, 1],		[62.5, 5, 0, 2],
		//땅
		[53, 0, 2],		[53, 1, 2],		
		[54, 0, 2],		[54, 1, 2],		
		[55, 0, 2],		[55, 1, 2],		
		[56, 0, 2],		[56, 1, 2],		
		[57, 0, 2],		[57, 1, 2],		
		[58, 0, 2],		[58, 1, 2],		
		[59, 0, 2],		[59, 1, 2],		
		[60, 0, 2],		[60, 1, 2],		
		[61, 0, 2],		[61, 1, 2],		
		[62, 0, 2],		[62, 1, 2],
										[66, 2, 0, 4],
										[67, 2, 0, 0],
										[68, 2, 0, 1],
						[69, 1, 0, 2],
						[70, 1, 0, 3],
						[71, 1, 0, 4],
		[72, 0, 0, 0],
		[73, 0, 0, 1],
		[74, 0, 0, 2],
		[76, 0, 3],		[76, 1, 3],		[76, 2, 3],
		[78, 0, 0, 5],	[78, 1, 0, 3],
						[79, 1, 0, 4],
		[80, 0, 0, 6],	[80, 1, 0, 0],
						[81, 1, 0, 1],
		[82, 0, 0, 5],	[82, 1, 0, 2],
						[83, 1, 0, 3],
		[84, 0, 0, 6],	[84, 1, 0, 4],
						[85, 1, 0, 0],
		[86, 0, 0, 5],	[86, 1, 0, 1],
		[88, 1, 2],		[88, 2, 0, 2],
		[89, 0, 4],		[89, 1, 0, 3],
		[90, 1, 2],		[90, 2, 0, 4],
		[91, 0, 4],		[91, 1, 0, 0],
		[92, 1, 2],		[92, 2, 0, 1],
		[93, 0, 4],		[93, 1, 0, 2],
		[94, 1, 2],		[94, 2, 0, 3],
		[95, 0, 4],		[95, 1, 0, 4],
						[97, 1, 0, 6],	[97, 2, 0, 5],
		[98, 0, 0, 0],	[98, 1, 0, 6],	[98, 2, 0, 5],
						[99, 1, 0, 6],	[99, 2, 0, 5],
		[101, 0, 4],
		[102, 0, 2],	[102, 1, 2],
		[104, 0, 3],	[104, 1, 3],	[104, 2, 3],
		[105, 0, 3],	[105, 1, 3],	[105, 2, 3],
		[107, 0, 0, 0],	[107, 1, 0, 0],	[107, 2, 0, 0],
		[108, 0, 0, 0],	[108, 1, 0, 0],	[108, 2, 0, 0],
		[110, 0, 0, 1],	[110, 1, 0, 1],	[110, 2, 0, 1],
		[111, 0, 0, 1],	[111, 1, 0, 1],	[111, 2, 0, 1],
		[113, 0, 0, 2],	[113, 1, 0, 2],	[113, 2, 0, 2],
		[114, 0, 0, 2],	[114, 1, 0, 2],	[114, 2, 0, 2],
		[116, 0, 0, 3],	[116, 1, 0, 3],	[116, 2, 0, 3],
		[117, 0, 0, 3],	[117, 1, 0, 3],	[117, 2, 0, 3],
		[119, 0, 0, 4],	[119, 1, 0, 4],	[119, 2, 0, 4],
		[120, 0, 0, 4],	[120, 1, 0, 4],	[120, 2, 0, 4],
	],
	[	
		[0, 0, 1],		[0, 1, 0, 0],	[0, 2, 0, 0],
		[1, 0, 2],		[1, 1, 2],		[1, 2, 0, 0],
		[3, 0, 1],		[3, 1, 0, 1],	[3, 2, 0, 1],
		[4, 0, 2],		[4, 1, 2],		[4, 2, 0, 1],
		[6, 0, 1],		[6, 1, 0, 2],	[6, 2, 0, 2],
		[7, 0, 2],		[7, 1, 2],		[7, 2, 0, 2],
		[9, 0, 1],		[9, 1, 0, 3],	[9, 2, 0, 3],
		[10, 0, 2],		[10, 1, 2],		[10, 2, 0, 3],
		[12, 0, 1],		[12, 1, 0, 4],
		[13, 0, 1],						[13, 2, 0, 0],
		[14, 0, 1],		[14, 1, 0, 1],
		[15, 0, 1],						[15, 2, 0, 2],
		[16, 0, 1],		[16, 1, 0, 3],
		[18, 0, 0, 4],
						[19, 1, 0, 0],
										[20, 2, 0, 1],
		[21, 0, 0, 2],
						[22, 1, 0, 3],
										[23, 2, 0, 4],
						[25, 1, 0, 5],
						[26, 1, 0, 5],
						[27, 1, 0, 0],
										[28, 2, 0, 1],
										[29, 2, 0, 2],
										[30, 2, 0, 3],						
						[31, 1, 0, 6],						
						[32, 1, 0, 6],						
						[33, 1, 0, 4],
		[34, 0, 0, 0],
		[35, 0, 0, 1],
		[36, 0, 0, 2],					
						[37, 1, 0, 5],						
						[38, 1, 0, 5],						
						[39, 1, 0, 3],
						[41, 1, 2],		[41, 2, 2],
						[42, 1, 0, 4],
						[43, 1, 0, 0],
						[44, 1, 0, 1],
						[45, 1, 2],		[45, 2, 2],
						[46, 1, 0, 2],
						[47, 1, 0, 3],
						[48, 1, 0, 4],
						[49, 1, 2],		[49, 2, 2],
						[50, 1, 0, 5],
						[51, 1, 0, 6],
						[52, 1, 0, 5],
						[53, 1, 2],		[53, 2, 2],
		[54, 0, 1],
		[55, 0, 1],
		[56, 0, 1],
		[57, 0, 5],

		// 하늘
		[59, 3, 0, 0],		[59.5, 3, 0, 0],	[60, 3, 0, 0],
		[60.5, 4, 0, 1],	[61, 4, 0, 1],		[61.5, 4, 0, 1],
		[62, 5, 0, 2],		[62.5, 5, 0, 2],	[63, 5, 0, 2],
		[63.5, 3, 0, 3],	[64, 3, 0, 3],		[64.5, 3, 0, 3],
		[65, 4, 0, 4],		[65.5, 4, 0, 4],	[66, 4, 0, 4],
		[66.5, 5, 0, 0],	[67, 5, 0, 1],		[67.5, 5, 0, 2],
		// 땅
		[58, 0, 2],		[58, 1, 2],		
		[59, 0, 2],		[59, 1, 2],		
		[60, 0, 2],		[60, 1, 2],		
		[61, 0, 2],		[61, 1, 2],		
		[62, 0, 2],		[62, 1, 2],		
		[63, 0, 2],		[63, 1, 2],		
		[64, 0, 2],		[64, 1, 2],		
		[65, 0, 2],		[65, 1, 2],		
		[66, 0, 2],		[66, 1, 2],		
		[67, 0, 2],		[67, 1, 2],

						[71, 1, 0, 0],
						[72, 1, 0, 1],
						[73, 1, 0, 2],
						[74, 1, 0, 3],
						[75, 1, 0, 4],
		[79, 0, 2],
		[80, 0, 2],
		[81, 0, 2],		[81, 1, 0, 0],	[81, 2, 2],
		[82, 0, 0, 1],	[82, 1, 2],		[82, 2, 0, 1],
		[83, 0, 2],		[83, 1, 0, 2],	[83, 2, 2],
		[84, 0, 0, 3],	[84, 1, 2],		[84, 2, 0, 3],
		[85, 0, 2],		[85, 1, 0, 4],	[85, 2, 2],
		[86, 0, 0, 0],	[86, 1, 2],		[86, 2, 0, 0],
		[87, 0, 2],		[87, 1, 0, 1],	[87, 2, 2],
		[88, 0, 0, 2],	[88, 1, 2],		[88, 2, 0, 2],
		[89, 0, 2],		[89, 1, 0, 3],	[89, 2, 2],
		[90, 0, 0, 4],	[90, 1, 2],		[90, 2, 0, 4],
		[91, 0, 2],		[91, 1, 0, 0],	[91, 2, 2],
		[92, 0, 0, 1],	[92, 1, 2],		[92, 2, 0, 1],
		[93, 0, 2],		[93, 1, 0, 2],	[93, 2, 2],
		[94, 0, 0, 3],	[94, 1, 2],		[94, 2, 0, 3],
		[95, 0, 2],		[95, 1, 0, 4],	[95, 2, 2],
		[96, 0, 0, 0],	[96, 1, 2],		[96, 2, 0, 0],
		[97, 0, 2],		[97, 1, 0, 1],	[97, 2, 2],
		[98, 0, 0, 2],	[98, 1, 2],		[98, 2, 0, 2],
		[99, 0, 2],		[99, 1, 0, 3],	[99, 2, 2],
		[100, 0, 0, 4],	[100, 1, 2],	[100, 2, 0, 4],
		[102, 0, 1],	[102, 1, 0, 0],	
		[103, 0, 1],					[103, 2, 0, 1],	
		[104, 0, 1],	[104, 1, 0, 2],	
		[105, 0, 1],					[105, 2, 0, 3],	
		[106, 0, 1],	[106, 1, 0, 4],	
		[108, 0, 3],	[108, 1, 3],	[108, 2, 3],
		[109, 0, 3],	[109, 1, 3],	[109, 2, 3],
		[111, 0, 0, 0],	[111, 1, 0, 0],	[111, 2, 0, 0],
		[112, 0, 0, 0],	[112, 1, 0, 0],	[112, 2, 0, 0],
		[114, 0, 0, 1],	[114, 1, 0, 1],	[114, 2, 0, 1],
		[115, 0, 0, 1],	[115, 1, 0, 1],	[115, 2, 0, 1],
		[117, 0, 0, 2],	[117, 1, 0, 2],	[117, 2, 0, 2],
		[118, 0, 0, 2],	[118, 1, 0, 2],	[118, 2, 0, 2],
		[120, 0, 0, 3],	[120, 1, 0, 3],	[120, 2, 0, 3],
		[121, 0, 0, 3],	[121, 1, 0, 3],	[121, 2, 0, 3],
		[123, 0, 0, 4],	[123, 1, 0, 4],	[123, 2, 0, 4],
		[124, 0, 0, 4],	[124, 1, 0, 4],	[124, 2, 0, 4]
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
	let intro_bg = new Intro_bg(),
		intro_char = new Intro_char();
	(function(){
		intro_start_btn = new Intro_start_btn();		intro_method_btn = new Intro_method_btn();
		intro_sound_btn = new Intro_sound_btn();		intro_layer = new Intro_layer();
		method_bg = new Method_bg();					method_content = new Method_content();
		method_exit_btn = new Method_exit_btn();		method_prev_btn = new Method_prev_btn();
		method_next_btn = new Method_next_btn();		method_dot = new Method_dot();
		select_bg = new Select_bg();					select_exit_btn = new Select_exit_btn();
		select_start_btn = new Select_start_btn();		select_male_btn = new Select_male_btn();
		select_female_btn = new Select_female_btn();
		conv_user_bg = new Conv_user_bg();				conv_pc_bg = new Conv_pc_bg();
		conv_user_text = new Conv_user_text();			conv_pc_text = new Conv_pc_text();
		conv_user_char = new Conv_user_char();			conv_pc_char = new Conv_pc_char();
		conv_skip_btn = new Conv_skip_btn();			conv_next_btn = new Conv_next_btn();
		conv_start_btn = new Conv_start_btn();			conv_press = new Conv_press();

		convIdx = 0;
		setTimeout(function(){
			introBtnCtrl(true);
		},100);
	})();
	function methodPopupFunc(){
		method_dot.x = 376 + method_content.cutIdx * 14;
		if(method_content.cutIdx < 1){
			method_prev_btn.active = false;
			method_next_btn.active = true;
		}
		else if(method_content.cutIdx > 3){
			method_prev_btn.active = true;
			method_next_btn.active = false;
		}
		else{
			method_prev_btn.active = true;
			method_next_btn.active = true;
		}
		if(method_content.slideRight){
			if(method_content.cx < method_content.cutIdx * 620){
				method_content.cx += 20;
			}
			else{
				method_content.slideRight = false;
			}
		}
		else if(method_content.slideLeft){
			if(method_content.cx > method_content.cutIdx * 620){
				method_content.cx -= 20;
			}
			else{
				method_content.slideLeft = false;
			}
		}
	}
	function draw(){	
		intro_bg.draw();intro_char.draw();
		intro_start_btn.draw();intro_method_btn.draw();intro_sound_btn.draw();
		/* 팝업 레이어 */
		intro_layer.draw();
		/* 성별 선택 팝업 */
		if(select_bg.appear || select_bg.load){
			select_bg.draw();
			select_exit_btn.draw();select_start_btn.draw();
			select_male_btn.draw();select_female_btn.draw();
		}
		/* 게임 방법 팝업 */
		if(method_bg.appear || method_bg.load){
			method_bg.draw();method_content.draw();
			method_exit_btn.draw();method_prev_btn.draw();method_next_btn.draw();
			method_dot.draw();
		}
		/* 대화 팝업 */
		conv_skip_btn.draw();
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
		conv_press.draw();
	}
	introLoop = function(){
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		methodPopupFunc();
		draw();
		requestAnimFrame(introLoop);
	}; 
	introLoop();
}
function main(){
	pageType = "main";
	let	main_top_bg = new Main_top_bg(),
		main_top_man = new Main_top_man(),
		main_btm_bg = new Main_btm_bg(),
		main_top_score_arr = new Array(),
		main_btm_time_arr = new Array();
	
	(function(){
		main_black_layer = new Main_black_layer();		main_layer = new Main_layer();		
		main_top_dist = new Main_top_dist();			main_top_gage = new Main_top_gage();
		main_stage_alert = new Main_stage_alert();		main_btm_stage = new Main_btm_stage();
		main_readyGo = new Main_readyGo();				main_exit_btn = new Main_exit_btn();
		
		quiz_bg = new Quiz_bg();			quiz_title = new Quiz_title();			quiz_time = new Quiz_time();
		quiz_result = new Quiz_result();	quiz_left_btn = new Quiz_left_btn();	quiz_right_btn = new Quiz_right_btn();

		exit_bg = new Exit_bg();			exit_yes_btn = new Exit_yes_btn();		exit_no_btn = new Exit_no_btn();
		clear_bg = new Clear_bg();			clear_content = new Clear_content();	clear_level_btn = new Clear_level_btn();
		finale_bg = new Finale_bg();		finale_content = new Finale_content();	finale_home_btn = new Finale_home_btn();
		over_bg = new Over_bg();			over_content = new Over_content();		over_home_btn = new Over_home_btn();
		mobile_jump_btn = new Mobile_jump_btn();


		for(let i=0;i<8;i++){
			(i < 4) ? main_top_score_arr.push(new Main_top_num(500 + 20 * i)) : main_top_score_arr.push(new Main_top_num(490 + 20 * i));
		}
		main_top_score_arr[3].cutSet(10);
		main_top_score_arr[7].cutSet(11);
		for(let i=0;i<2;i++){
			main_btm_time_arr.push(new Main_btm_num(519 + 18 * i));
		}		
		// 배경
		main_bg_tile = new Main_bg_tile();		
		main_bg_arr = new Array();
		main_bg_cloud_arr = new Array();
		main_bg_grass_arr = new Array();
		main_bg_sky_arr = new Array();
		for(let i=0;i<2;i++){
			main_bg_arr.push(new Main_bg_btm(), new Main_bg_top());
			main_bg_cloud_arr.push(new Main_bg_cloud(i));
			main_bg_grass_arr.push(new Main_bg_grass(i));
			main_bg_sky_arr.push(new Main_bg_sky(i));
		}	
		// 플레이어 생성
		(gender == 1) ? player = new Main_char_man() : player = new Main_char_woman();		

		// 게임시작
		stageSetting();
	})();
	function logicFunc(){
		if(main_stage_alert.load){
			main_readyGo.aniStart();
			main_stage_alert.load = false;
		}
		if(main_readyGo.load){
			if(device != "PC"){mobile_jump_btn.active = true;}
			
			if(stage > 1){
				score_tmp += time * 100;
				score = score_tmp;
			}
			time = 90;

			uiCtrl(true);
			gameTimeFunc(true);
			main_layer.appear = false;
			main_readyGo.load = false;
		}
		if(quiz_result.load){
			quiz_result.disappear = true;
			main_black_layer.appear = false;
			quiz_result.load = false;	
		}
		if(quiz_result.unload){	
			if(quiz_result.cutIdx == 0){
				objMoveUpDownFunc(true);								// 정답일 시 배경이동
			}
			popup = false;		
			quiz_result.unload = false;	
		}
	}
	function objFunc(){
		if(isGamePlaying){
			if(popup){
				player.isAni = false;
				isBgMoving = false;
				isObjMoving = false;
			}
			else{				
				player.isAni = true;
			}
			if(player.isHit || player.isUp){
				isBgMoving = false;
				isObjMoving = false;
			}
			else{
				if(!popup){
					isBgMoving = true;
					if(obj_arr[obj_arr.length-1].x + obj_arr[obj_arr.length-1].w <= 0){
						isObjMoving = false;
						uiCtrl(false);
						gameTimeFunc(false);
						clearPopupCtrl(true);
						if(device != "PC"){mobile_jump_btn.active = false;}
					}
					else{
						isObjMoving = true;
					}
				}
			}
		}
		else{
			isBgMoving = true;
		}

		// 배경 이동관련
		let bgMoveFunc = function(arr){
			for(let i=0;i<arr.length;i++){
				if(arr[i].x + arr[i].w < 0){
					(i == 0) ? (arr[0].x = arr[1].x + arr[1].w) : (arr[1].x = arr[0].x + arr[0].w);
				}
				arr[i].x -= arr[i].movement;
			}
		}
		if(isBgMoving){
			main_bg_tile.isAni = true;
			bgMoveFunc(main_bg_cloud_arr);
			bgMoveFunc(main_bg_grass_arr);
			bgMoveFunc(main_bg_sky_arr);
			if(obj_arr.length > 0){
				if(obj_arr[0].x < 800){
					for(let i=0;i<main_bg_building_arr.length;i++){
						if(main_bg_building_arr[i].x + main_bg_building_arr[i].w > 0){
							main_bg_building_arr[i].x -= main_bg_building_arr[i].movement;
						}		
					}
				}
			}
			if(isGamePlaying){
				if(main_bg_building_arr.length > 0){
					let isThere = false;
					for(let i=0;i<main_bg_building_arr.length;i++){
						if(0 <= main_bg_building_arr[i].x && main_bg_building_arr[i].x <= 1200){
							isThere = true;
						}		
					}
					if(main_bg_building_arr[main_bg_building_arr.length-1].x < 1200){
						isThere = true;
					}

					if(main_building_common.x + main_building_common.w > 0){
						main_building_common.x -= main_building_common.movement;
					}
					else{
						if(!isThere){
							main_building_common.cutSet(Math.floor(Math.random()*100) % 3);
							main_building_common.x = 800;
						}
					}
				}
			}
		}
		else{
			main_bg_tile.isAni = false;
		}

		// 오브젝트 이동관련
		if(isObjMoving){
			if(obj_arr.length > 0){
				for(let i=0;i<obj_arr.length;i++){
					if(obj_arr[i].x + obj_arr[i].w > 0){
						obj_arr[i].x -= 5;
					}
				}
			}
		}

		if(player.isAtSky){
			let lastBombIdx = 0;
			if(stage == 1){
				lastBombIdx = 79;
			}
			else if(stage == 2){
				lastBombIdx = 108;
			}
			else if(stage == 3){
				lastBombIdx = 102;
			}
			else if(stage == 4){
				lastBombIdx = 98;
			}
			else if(stage == 5){
				lastBombIdx = 113;
			}

			if(player.x > obj_arr[lastBombIdx].x){
				objMoveUpDownFunc(false);
			}
		}
	}
	function playerFunc(){
		if(!player.isHit){
			if(player.isSJump || player.isDJump || player.isUp || player.isDown){
				if(player.y > player.oriY){
					player.reset();
				}
				else{
					player.y += player.vy;
					player.vy += player.gravity;
				}
			}

			// 아이템 충돌관련
			for(let i=0;i<obj_arr.length;i++){
				if(obj_arr[i].hitable){
					// 책
					if(obj_arr[i].type == 0){
						if(obj_arr[i].x + obj_arr[i].w * 0.75 < player.x + player.w && player.x < obj_arr[i].x + obj_arr[i].w * 0.25 && obj_arr[i].y + obj_arr[i].h * 0.75 < player.y + player.h && player.y < obj_arr[i].y + obj_arr[i].h * 0.25){						
							let isCorrect = (obj_arr[i].cutIdx % 7) < 5;
							if(isCorrect){
								aud_Arr[4][1].currentTime =0;
								aud_Arr[4][1].play();
								obj_arr[i] = new Obj_eff(0, obj_arr[i].x, obj_arr[i].y);
								score_tmp += 240;
							}
							else{
								aud_Arr[5][1].currentTime =0;
								aud_Arr[5][1].play();
								obj_arr[i] = new Obj_eff(1, obj_arr[i].x, obj_arr[i].y);
								time--;
							}
						}
					}
					// 시계
					else if(obj_arr[i].type == 3){
						if(obj_arr[i].x + obj_arr[i].w * 0.7 < player.x + player.w && player.x < obj_arr[i].x + obj_arr[i].w * 0.3 && obj_arr[i].y + obj_arr[i].h * 0.7 < player.y + player.h && player.y < obj_arr[i].y + obj_arr[i].h * 0.3){	
							aud_Arr[4][1].currentTime =0;
							aud_Arr[4][1].play();
							time += 2;
							obj_arr[i] = new Obj_eff(2, obj_arr[i].x, obj_arr[i].y);							
						}
					}
					// 퀴즈
					else if(obj_arr[i].type == 5){
						if(obj_arr[i].x + obj_arr[i].w < player.x + player.w && player.x < obj_arr[i].x + obj_arr[i].w){	
							if(!isQuizSet){
								quizPopupCtrl(true);
								quizTimeFunc(true);
								isQuizSet = true;
							}
						}
					}
					// 나머지 방해물(바리케이드, 폭탄, 꼬깔)
					else if(obj_arr[i].type == 1 || obj_arr[i].type == 2 || obj_arr[i].type == 4){
						if(obj_arr[i].x + obj_arr[i].w * 0.6 < player.x + player.w * 0.6 && player.x + player.w * 0.2 < obj_arr[i].x + obj_arr[i].w * 0.4 && obj_arr[i].y + obj_arr[i].h * 0.75 < player.y + player.h && player.y < obj_arr[i].y + obj_arr[i].h * 0.25){	
							// 같은 x위치의 다른 방해물은 더이상 안부딪힘
							for(let j=0;j<obj_info_arr[stage-1].length;j++){
								if(obj_info_arr[stage-1][i][0] == obj_info_arr[stage-1][j][0] && obj_arr[i].type == obj_info_arr[stage-1][j][2]){
									obj_arr[j].hitable = false;
								}
							}
							aud_Arr[10][1].currentTime =0;
							aud_Arr[10][1].play();
							player.hit();
						}
					}
				}
			}
		}
	}
	function uiFunc(){
		// 상단바 점수
		if(score < score_tmp){
			score += 24;
		}
		main_top_score_arr[0].cutSet(Math.floor(score / 100000));
		main_top_score_arr[1].cutSet(Math.floor((score % 100000) / 10000));
		main_top_score_arr[2].cutSet(Math.floor((score % 10000) / 1000));
		main_top_score_arr[4].cutSet(Math.floor((score % 1000) / 100));
		main_top_score_arr[5].cutSet(Math.floor((score % 100) / 10));
		main_top_score_arr[6].cutSet(score % 10);

		// 상단바 거리
		main_top_dist.dist = stage * 100 - Math.floor((obj_arr[obj_arr.length - 1].x * stage * 100) / totalDist);
		if(main_top_dist.dist >= stage * 100){
			main_top_dist.dist = stage * 100;
		}

		// 상단바 게이지
		let ratio = main_top_dist.dist / (stage * 100);
		if(ratio >= 1){
			ratio = 1;
		}
		main_top_gage.w = main_top_gage.cw = Math.floor(ratio  * main_top_gage.oriW);
		main_top_man.x = main_top_gage.x + main_top_gage.w - main_top_man.w * 0.5;
	
		// 하단바 시간
		main_btm_time_arr[0].cutSet(Math.floor(time / 10));
		main_btm_time_arr[1].cutSet(time % 10);
	}
	function uiCtrl(bool){
		isGamePlaying = bool;
		main_exit_btn.appear = bool;
		// 상단바 
		main_top_bg.appear = bool;
		main_top_man.appear = bool;
		main_top_dist.appear = bool;
		main_top_gage.appear = bool;
		for(let i=0;i<main_top_score_arr.length;i++){
			main_top_score_arr[i].appear = bool;
		}
		// 하단바
		main_btm_bg.appear = bool;
		main_btm_stage.appear = bool;
		for(let i=0;i<main_btm_time_arr.length;i++){
			main_btm_time_arr[i].appear = bool;
		}
	}
	function objMoveUpDownFunc(bool){
		if(bool){
			for(let i=0;i<main_bg_arr.length;i++){
				main_bg_arr[i].down = true;
			}		
			for(let i=0;i<main_bg_cloud_arr.length;i++){
				main_bg_cloud_arr[i].down = true;
			}	
			for(let i=0;i<main_bg_grass_arr.length;i++){
				main_bg_grass_arr[i].down = true;
			}	
			for(let i=0;i<main_bg_sky_arr.length;i++){
				main_bg_sky_arr[i].down = true;
			}
			for(let i=0;i<obj_arr.length;i++){
				obj_arr[i].down = true;
			}
			for(let i=0;i<main_bg_building_arr.length;i++){
				main_bg_building_arr[i].down = true;
			}
			main_building_common.down = true;
			main_bg_tile.down = true;
			main_exit_btn.appear = false;
			player.up();
		}
		else{
			for(let i=0;i<main_bg_arr.length;i++){
				main_bg_arr[i].up = true;
			}		
			for(let i=0;i<main_bg_cloud_arr.length;i++){
				main_bg_cloud_arr[i].up = true;
			}	
			for(let i=0;i<main_bg_grass_arr.length;i++){
				main_bg_grass_arr[i].up = true;
			}
			for(let i=0;i<main_bg_sky_arr.length;i++){
				main_bg_sky_arr[i].up = true;
			}		
			for(let i=0;i<obj_arr.length;i++){
				obj_arr[i].up = true;
			}
			for(let i=0;i<main_bg_building_arr.length;i++){
				main_bg_building_arr[i].up = true;
			}
			main_building_common.up = true;
			main_bg_tile.up = true;				
			main_exit_btn.appear = true;
			player.down();	
		}
	}
	function draw(){
		// 배경
		for(let i=0;i<main_bg_arr.length;i++){
			main_bg_arr[i].draw();
		}		
		for(let i=0;i<main_bg_cloud_arr.length;i++){
			main_bg_cloud_arr[i].draw();
		}	

		for(let i=0;i<main_bg_building_arr.length;i++){
			main_bg_building_arr[i].draw();
		}
		main_building_common.draw();

		for(let i=0;i<main_bg_grass_arr.length;i++){
			main_bg_grass_arr[i].draw();
		}	
		for(let i=0;i<main_bg_sky_arr.length;i++){
			main_bg_sky_arr[i].draw();
		}	
		main_bg_tile.draw();

		// 오브젝트		
		for(let i=0;i<obj_arr.length;i++){
			obj_arr[i].draw();
		}
		player.draw();
	
		main_layer.draw();
		main_readyGo.draw();
		main_stage_alert.draw();

		// 상하단바UI		
		main_exit_btn.draw();
		main_top_bg.draw();		main_top_man.draw();		main_top_dist.draw(); main_top_gage.draw();
		main_btm_bg.draw();		main_btm_stage.draw();
		for(let i=0;i<main_top_score_arr.length;i++){
			main_top_score_arr[i].draw();
		}
		if(time > 10){
			main_btm_time_arr[0].draw();
		}
		main_btm_time_arr[1].draw();
		mobile_jump_btn.draw();

		// 팝업
		main_black_layer.draw();
		quiz_result.draw();
		if(exit_bg.appear || exit_bg.load){
			exit_bg.draw();
			exit_yes_btn.draw();
			exit_no_btn.draw();
		}
		if(quiz_bg.appear || quiz_bg.load){
			quiz_bg.draw();
			quiz_title.draw();
			quiz_time.draw();
			quiz_left_btn.draw();
			quiz_right_btn.draw();
		}	
		if(over_bg.active || over_bg.appear){
			over_bg.draw();
			over_content.draw();
			over_home_btn.draw();
		}
		if(clear_bg.active || clear_bg.appear){
			clear_bg.draw();
			clear_content.draw();
			clear_level_btn.draw();
		}
		if(finale_bg.active || finale_bg.appear){
			finale_bg.draw();
			finale_content.draw();
			finale_home_btn.draw();
		}	
	}
	mainLoop = function(){
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		uiFunc();
		logicFunc();
		objFunc();
		playerFunc();
		draw();
		requestAnimFrame(mainLoop);
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
		method_content.cutSet(0);
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
function stageSetting(){
	popup = false;
	isGamePlaying = false;
	isBgMoving = true;
	isObjMoving = false;
	isQuizSet = false;

	stage++;
	main_stage_alert.cutSet(stage - 1);
	main_btm_stage.cutSet(stage - 1);

	main_layer = new Main_layer();
	main_building_common = new Main_building_common();

	main_top_dist.dist = 0;
	main_stage_alert.start();
	main_readyGo.aniReady();
	audioPlay(3);

	obj_arr = new Array();
	for(let i=0;i<obj_info_arr[stage-1].length;i++){
		let x_coor = obj_info_arr[stage-1][i][0];
		let y_coor = obj_info_arr[stage-1][i][1];
		let type = obj_info_arr[stage-1][i][2];
		let cutIdx = (obj_info_arr[stage-1][i].length > 3) ? obj_info_arr[stage-1][i][3] : 0;
		obj_arr.push(new Obj(type, x_coor, y_coor, cutIdx));
	}

	totalDist = obj_arr[obj_arr.length-1].x;

	main_bg_building_arr = new Array();
	let building_cnt = [4, 2, 2, 4, 2];
	for(let i=0;i<building_cnt[stage-1];i++){
		main_bg_building_arr.push(new Main_building_stage(i));
		if(i == 0){
			main_bg_building_arr[i].x = 800;
		}
		else if(i == building_cnt[stage-1]-1){
			main_bg_building_arr[i].x = obj_arr[obj_arr.length-1].x;
		}
		else{
			main_bg_building_arr[i].x = 800 * 5 * i;
		}
	}

}
function gameTimeFunc(bool){
	if(bool){
		timeInterval = setInterval(function(){
			if(isGamePlaying && !popup){
				if(time > 0){
					time--;
				}
				else{
					overPopupCtrl(true);
					clearInterval(timeInterval);
				}
			}			
		},1000);
	}
	else{
		clearInterval(timeInterval);
	}
}
function quizPopupCtrl(bool){
	if(bool){
		popup = true;
		main_black_layer.appear = true;
		quiz_time.cutSet(9);
	}
	quiz_bg.appear = bool;
	quiz_title.appear = bool;
	quiz_time.appear = bool;
	quiz_left_btn.appear = bool;
	quiz_right_btn.appear = bool;
}
function quizTimeFunc(bool){
	if(bool){
		quizInterval = setInterval(function(){
			if(quiz_time.cutIdx > 0){
				quiz_time.cutSet(--quiz_time.cutIdx);
			}
			else{
				clearInterval(quizInterval);
				quizPopupCtrl(false);
				quizResultFunc(2);
			}
		},1000);
	}
	else{
		clearInterval(quizInterval);
	}
}
function quizResultFunc(ans){
	let myans = ans;
	let reans = quiz_arr[stage-1][3];

	quizPopupCtrl(false);
	quizTimeFunc(false);

	if(myans == reans){
		audioPlay(7);
		quiz_result.cutSet(0);
	}
	else{
		quiz_result.cutSet(1);
	}
	quiz_result.appear = true;
}
function exitIntro(){
	clearInterval(typeInterval);
	introLoop = function(){return;}
	main();
}
function exitPopupCtrl(bool){
	popup = bool;
	main_black_layer.appear = bool;
	exit_bg.appear = bool;
	exit_yes_btn.appear = bool;
	exit_no_btn.appear = bool;
}
function clearPopupCtrl(bool){
	popup = bool;
	main_black_layer.appear = bool;
	audioPlay(8);
	if(stage < 5){
		clear_bg.appear = bool;
		clear_content.appear = bool;
		clear_level_btn.appear = bool;
	}
	else{
		finale_bg.appear = bool;
		finale_content.appear = bool;
		finale_home_btn.appear = bool;
	}
}
function overPopupCtrl(bool){
	audioPlay(9);
	popup = bool;
	main_black_layer.appear = bool;
	over_bg.appear = bool;
	over_home_btn.appear = bool;
}
function split3digit(num){
	var val = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return val;
}
/* 이벤트관련 */
document.addEventListener("keydown",function(e){
	let keyCode = e.keyCode;
	if(keyCode == 32){
		if(!popup){
			if(player.isHit || player.isUp || player.isDown ){
				return;
			}
			if(player.isSJump){
				player.dJump();
				aud_Arr[6][1].currentTime =0;
				aud_Arr[6][1].play();
			}
			else{
				if(player.clickable){
					player.sJump();
					aud_Arr[6][1].currentTime =0;
					aud_Arr[6][1].play();
				}
			}
		}
	}
});
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
		if(!popup){
			if(main_exit_btn.clickable){
				if(mouseCd(main_exit_btn)){
					$("canvas").css("cursor","pointer");
					main_exit_btn.mouseOver = true;
				}
				else{
					main_exit_btn.mouseOver = false;
				}
			}
		}
		else{
			if(exit_bg.appear && exit_bg.load){
				if(mouseCd(exit_yes_btn)){
					$("canvas").css("cursor","pointer");
					exit_yes_btn.mouseOver = true;
					exit_no_btn.mouseOver = false;
				}
				else if(mouseCd(exit_no_btn)){
					$("canvas").css("cursor","pointer");
					exit_no_btn.mouseOver = true;
					exit_yes_btn.mouseOver = false;
				}
				else{
					exit_yes_btn.mouseOver = false;
					exit_no_btn.mouseOver = false;
				}
			}
			if(quiz_bg.appear && quiz_bg.load){
				if(mouseCd(quiz_left_btn)){
					$("canvas").css("cursor","pointer");
					quiz_left_btn.mouseOver = true;
				}
				else if(mouseCd(quiz_right_btn)){
					$("canvas").css("cursor","pointer");
					quiz_right_btn.mouseOver = true;	
				}
				else{
					quiz_left_btn.mouseOver = false;	
					quiz_right_btn.mouseOver = false;	
				}
			}
			if(over_bg.active && over_bg.appear){
				if(mouseCd(over_home_btn)){
					$("canvas").css("cursor","pointer");
					over_home_btn.mouseOver = true;
				}
				else{
					over_home_btn.mouseOver = false;
				}
			}
			if(clear_bg.active && clear_bg.appear){
				if(mouseCd(clear_level_btn)){
					$("canvas").css("cursor","pointer");
					clear_level_btn.mouseOver = true;
				}
				else{
					clear_level_btn.mouseOver = false;
				}
			}
			if(finale_bg.active && finale_bg.appear){
				if(mouseCd(finale_home_btn)){
					$("canvas").css("cursor","pointer");
					finale_home_btn.mouseOver = true;
				}
				else{
					finale_home_btn.mouseOver = false;
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
				if(mobile_jump_btn.active && mouseCd(mobile_jump_btn)){
					if(player.isHit || player.isUp || player.isDown ){
						return;
					}
					if(player.isSJump){
						player.dJump();
						aud_Arr[6][1].currentTime =0;
						aud_Arr[6][1].play();
					}
					else{
						if(player.clickable){
							player.sJump();
							aud_Arr[6][1].currentTime =0;
							aud_Arr[6][1].play();
						}
					}
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
						method_content.cutIdx--;
						method_content.slideLeft = true;
					}
				}
				else if(mouseCd(method_next_btn)){
					if(method_next_btn.active){
						audioPlay(2);
						method_next_btn.mouseOver = false;
						method_content.cutIdx++;
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
		if(!popup){
			if(main_exit_btn.clickable){
				if(mouseCd(main_exit_btn)){
					audioPlay(1);
					exitPopupCtrl(true);
					main_exit_btn.mouseOver = false;
				}
			}
		}
		else{
			if(exit_bg.appear && exit_bg.load){
				if(mouseCd(exit_yes_btn)){
					location.href = "index.html";
					exit_yes_btn.mouseOver = false;
				}
				else if(mouseCd(exit_no_btn)){
					audioPlay(1);
					exitPopupCtrl(false);
					exit_no_btn.mouseOver = false;
				}
			}
			if(quiz_bg.appear && quiz_bg.load){
				if(mouseCd(quiz_left_btn)){
					quizResultFunc(1);
					quiz_left_btn.mouseOver = false;
				}
				else if(mouseCd(quiz_right_btn)){
					quizResultFunc(2);
					quiz_right_btn.mouseOver = false;					
				}
			}
			if(over_bg.active && over_bg.appear){
				over_home_btn.mouseOver = false;
				if(mouseCd(over_home_btn)){
					location.href = "index.html";
				}
			} 
			if(clear_bg.active && clear_bg.appear){
				clear_level_btn.mouseOver = false;
				if(mouseCd(clear_level_btn)){
					clearPopupCtrl(false);
					stageSetting();
				}
			}
			if(finale_bg.active && finale_bg.appear){
				finale_home_btn.mouseOver = false;
				if(mouseCd(finale_home_btn)){
					_isPorted ? parent.gameResult() : location.href = "index.html";
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
