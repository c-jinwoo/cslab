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
	["main/time.png"],
	["main/gage_bak.png"],
	["main/top_gage.png"],
	["main/level.png"],																			// 15
	["main/ready_go.png"],
	["main/num_game_1.png"],
	["main/num_game_2.png"],
	["main/num_game_3.png"],
	["main/exit/bg.png"],																		// 20
	["main/exit/btn_continue.png"],
	["main/exit/btn_quit.png"],
	["main/block.png"],
	["main/eff.png"],
	["main/over/bg.png"],																		// 25
	["main/over/home_btn.png"],
	["main/clear/info/bg.png"],
	["main/clear/info/cont_btn.png"],	
	["main/clear/stage/bg.png"],
	["main/clear/stage/level_btn.png"],															// 30
	["main/clear/finale/bg.png"],
	["main/clear/finale/home_btn.png"],	
];
const aud_Arr	= [
	["bgm.mp3"],																				// 0
	["slide.mp3"],
	["matched.mp3"],
	["level.mp3"],
	["click.mp3"],
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
		log("alphaFunc 정의 필요.");
		this.isAlpha = false;	
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
const Intro_start_btn = function(){
	this.init({idx:2, col:2, spr:2, x:314, y:385});
	this.btnSet();
};
const Intro_method_btn = function(){
	this.init({idx:3, col:2, spr:2, x:"center", y:440});
	this.btnSet();
};
const Intro_sound_btn = function(){
	this.init({idx:4, col:2, spr:2, w:55, h:55, x:740, y:5});
	this.btnSet();
};
const Method_bg = function(){
	this.init({idx:5, active:false});
};
const Method_content = function(){
	this.init({idx:6, col:1, spr:5, x:95, y:137});
	this.cutSet();
};
const Method_exit_btn = function(){
	this.init({idx:7, col:2, spr:2, w:65, h:65, x:690, y:40});
	this.btnSet();
};
const Method_prev_btn = function(){
	this.init({idx:8, active:false, col:2, spr:2, x:260, y:415});
	this.btnSet();
};
const Method_next_btn = function(){
	this.init({idx:9, active:false, col:2, spr:2, x:440, y:419});
	this.btnSet();
};
const Method_dot = function(pi){
	this.init({idx:10, col:2, spr:2, x:365 + 15 * pi, y:433});
};
const Green_layer = function(){
	this.globalAlpha = 0;
	this.draw = function(){
		try{ 
			ctx.save();			
			ctx.globalAlpha = this.globalAlpha;		ctx.beginPath();
			ctx.rect(0, 0, cvs.width, cvs.height);	ctx.fillStyle = "#00FF66";	ctx.fill();			
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_bg = function(){
	this.init({idx:11});
};
const Main_time = function(){
	this.init({idx:12, x:115});
};
const Main_gage_bak = function(){
	this.init({idx:13, x:177, y:20});
};
const Main_top_gage = function(){
	this.init({idx:14, col:1, spr:4, w:400, x:178, y:20});
	this.oriW = 400;
	this.oriCW = 300;
	this.pause = false;
	this.aniSet(8);
	this.alphaSet(1);
	this.alphaFunc = function(){
		let ratio = time / 60;
		if(ratio > 1){
			ratio = 1;
		}
		this.w = this.oriW * ratio;
		this.cw = this.oriCW * ratio;
	};
};
const White_layer = function(){
	this.globalAlpha = 0;
	this.appear = false;
	this.disappear = false;
	this.loaded = false;
	this.unloaded = false;
	this.draw = function(){
		try{ 
			if(this.appear){
				if(this.globalAlpha < 0.475){
					this.globalAlpha += 0.025;
				}
				else{
					this.loaded = true;
					this.appear = false;
				}
			}
			if(this.disappear){
				if(this.globalAlpha > 0.025){
					this.globalAlpha -= 0.025;
				}
				else{
					this.unloaded = true;
					this.disappear = false;
				}
			}
			ctx.save();			
			ctx.globalAlpha = this.globalAlpha;		ctx.beginPath();
			ctx.rect(0, 0, cvs.width, cvs.height);	ctx.fillStyle = "#FFF";	ctx.fill();			
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_stage = function(){
	this.init({idx:15, active:false, col:1, spr:5, x:-800, y:"center"});
	this.loaded = false;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.x < 0){
					this.x += 20;
				}
				else{
					if(this.delay < 60){
						this.delay++;
						this.x = 0;
					}
					else{
						if(this.x < 800 * wR){
							this.x += 20;
						}
						else{
							this.active = false;
							this.loaded = true;
							this.x = -800;
							this.delay = 0;
						}
					}
				}
			}
			ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Main_readygo = function(){
	this.init({idx:16, active:false, col:5, spr:25, x:"center", y:"center"});
	this.loaded = false;
	this.aniSet(5);
	this.aniFunc = function(){
		if(this.active){
			this.ani++;
			this.cx = Math.floor((this.ani % (this.colCnt * this.aniDelay)) / this.aniDelay) * this.cw;
			this.cy = Math.floor(this.ani / (this.colCnt * this.aniDelay)) * this.ch;
			if(this.ani >= this.sprCnt * this.aniDelay){
				this.ani = 0;
				this.active = false;
				this.loaded = true;
			}
		}
	};
};
const Num_type1 = function(){
	this.init({idx:17, col:10, spr:10});
	this.val = 0;
	this.draw = function(){
		try{ 
			this.cx = this.val * this.cw;
			ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Num_type2 = function(){
	this.init({idx:18, col:10, spr:10});
	this.val = 0;
	this.draw = function(){
		try{ 
			this.cx = this.val * this.cw;
			ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Num_type3 = function(){
	this.init({idx:19, col:10, spr:10, w:15, h:20});
	this.val = 0;
	this.draw = function(){
		try{ 
			this.cx = this.val * this.cw;
			ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Main_exit_btn = function(){
	this.init({idx:7, col:2, spr:2, w:65, h:65, x:735, y:10});
	this.btnSet();
};
const Popup_layer = function(){
	this.globalAlpha = 0;
	this.appear = false;
	this.draw = function(){
		try{ 
			if(this.appear){
				if(this.globalAlpha < 0.45){
					this.globalAlpha += 0.025;
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.025;
				}
			}
			ctx.save();				ctx.globalAlpha = this.globalAlpha;
			ctx.beginPath();		ctx.rect(0, 0, cvs.width, cvs.height);
			ctx.fillStyle = "#FFF";	ctx.fill();	
			ctx.restore();
		}
		catch(e){}
	};
};
const Exit_bg = function(){
	this.init({idx:20, active:false, x:"center", y:50});
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
const Exit_cont_btn = function(){
	this.init({idx:21, col:2, spr:2, x:250, y:330});
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
const Exit_quit_btn = function(){
	this.init({idx:22, col:2, spr:2, x:400, y:330});
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
const Main_block = function(pi){
	this.init({idx:23, col:5, spr:5, x:187 + (pi % 8) * 54, y:-1080 + 54 * Math.floor(pi / 8)});
	this.num = pi;
	this.cutSet(Math.floor(Math.random() * 100) % 5);
	this.cutIdx_tmp = 5;
	this.action = "";
	this.isMovingLeft = false;
	this.isMovingRight = false;
	this.isMovingDown = false;
	this.isMovingUp = false;
	this.isBreaking = false;
	this.isBroken = false;
	this.isFalling = false;
	this.downVal = 0;
	this.aniCx = 0;
	this.aniCy = 0;
	this.aniCw = 48;
	this.aniCh = 48;
	this.ani = 0;
	this.draw = function(){
		try{ 
			if(this.isBreaking){
				this.ani++;
				if(this.ani >= 8 * 5){
					this.ani >= 8 * 5 - 1;
					this.isBreaking = false;
					this.isBroken = true;
				}
				this.aniCx = Math.floor((this.ani % (4 * 5)) / 5) * this.aniCw;
				this.aniCy = Math.floor(this.ani / (4 * 5)) * this.aniCh;		

				ctx.drawImage(cvs_Arr[24], this.aniCx, this.aniCy, this.aniCw, this.aniCh, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				
			}
			else{
				if(!this.isBroken){
					if(this.y < startLine){
						let amount = (this.y + this.h) - startLine;
						if(amount > 0){
							ctx.drawImage(cvs_Arr[this.idx], this.cx, this.h - amount, this.cw, amount, this.x * wR, startLine * hR, this.w * wR, amount * hR);
						}
					}
					else{
						ctx.drawImage(cvs_Arr[this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
					}
				}
			}
		}
		catch(e){}
	};
	this.right = function(){
		this.action = "right";
		this.isMovingRight = true;
	};
	this.left = function(){
		this.action = "left";
		this.isMovingLeft = true;
	};
	this.up = function(){
		this.action = "up";
		this.isMovingUp = true;
	};
	this.down = function(){
		this.action = "down";
		this.isMovingDown = true;
	};
	this.reset = function(){
		this.x = 187 + (this.num % 8) * 54;
		this.y = -360 + 54 * Math.floor(this.num / 8);
		this.downVal = 0;
		this.isBreaking = false;
		this.isBroken = false;
		if(this.num < 64){
			this.cutSet(Math.floor(Math.random() * 100) % 5);
		}
		else{
			if(this.cutIdx_tmp < 5){
				this.cutSet(this.cutIdx_tmp);
				this.cutIdx_tmp = 5;
			}
		}
	};
};
const Over_bg = function(){
	this.init({idx:25, active:false, x:"center", y:50});
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
	this.init({idx:26, col:2, spr:2, x:"center", y:332, w:141, h:47});
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
const Info_bg = function(){
	this.init({idx:27, active:false, col:5, spr:5, x:"center"});
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
const Info_cont_btn = function(){
	this.init({idx:28, col:2, spr:2, x:"center", y:400});
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
const Clear_bg = function(){
	this.init({idx:29, active:false, x:"center", y:50});
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
			ctx.fillText("남은시간 : " + time, 350 * wR, 210 * hR);

			ctx.textAlign = "center";

			ctx.font = "bold "+(22 * hR)+"px '나눔스퀘어'";
			ctx.fillStyle = this.color2;
			ctx.fillText(time + " X 100 = " + split3digit(time * 100), 400 * wR, 250 * hR);

			ctx.font = "bold "+(25 * hR)+"px '나눔스퀘어'";
			ctx.fillStyle = this.color3;
			ctx.fillText(time * 100 +"점 추가", 400 * wR, 280 * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Clear_level_btn = function(){
	this.init({idx:30, col:2, spr:2, x:"center", y:290});
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
	this.init({idx:31, active:false, x:"center", y:50});
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
				ctx.fillText("게임 '헌법팡'을 완료하였습니다.", this.x * wR, (this.y + 30) * hR);
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
	this.init({idx:32, col:2, spr:2, x:"center", y:342, w:141, h:47});
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
/* 미디어 오브젝트 생성 */
let intro_start_btn = new Object(),
	intro_method_btn = new Object(),
	intro_sound_btn = new Object(),
	method_bg = new Object(),
	method_content = new Object(),
	method_exit_btn = new Object(),
	method_prev_btn = new Object(),
	method_next_btn = new Object(),
	method_dot_arr = new Array(),
	green_layer = new Object();
let white_layer = new Object(),
	main_gage_bak = new Object(),
	main_top_gage = new Object(),
	main_stage = new Object(),
	main_readygo = new Object(),
	stage_num = new Object(),
	popup_layer = new Object(),
	exit_bg = new Object(),
	exit_cont_btn = new Object(),
	exit_quit_btn = new Object(),
	over_bg = new Object(),
	over_content = new Object(),
	over_home_btn = new Object(),
	info_bg = new Object(),
	info_cont_btn = new Object(),
	clear_bg = new Object(),
	clear_content = new Object(),
	clear_level_btn = new Object(),
	finale_bg = new Object(),
	finale_content = new Object(),
	finale_home_btn = new Object(),
	usr_arr = new Array(),
	usr_cnt_arr = new Array(),
	tot_cnt_arr = new Array(),
	score_arr = new Array(),
	time_arr = new Array();
/* 연동 변수 */
let loggedIn = true;
let userId = "id";
let _isPorted = false;
if(_isPorted){
	userId = parent.userId;
}
/* 내부 변수 */
let	loadLoop = new Object(), 
	introLoop = new Object(), 
	mainLoop = new Object();
let mouseX = 0,																					// 마우스 X좌표
	mouseY = 0,																					// 마우스 Y좌표
	mouseXtmp = 0;																				// 유저진행 시 클릭 후 이동범위 체크용
	mouseYtmp = 0;																				// 유저진행 시 클릭 후 이동범위 체크용
let volume = 1,																					// 사운드 On:1 Off:0
	popup = false,																				// 팝업 체크용
	pageType = "",																				// 페이지 종류
	userInit = (browser == "Chrome") ? false : true;											// 음악재생용 유저클릭 여부
/* 인게임 변수 */
const BLOCK_TYPE_NUM = 5;																		// 블록 타입 수
const startLine = 70;																			// 게임판 y좌표(블럭 초기이동 제어용)
const blockSpeed = 3;																			// 블럭 움직이는 속도
let gameStart = false;																			// 인트로 -> 메인 진행 여부
let stage = 0;																					// 스테이지
let time = 60;																					// 시간
let timeInterval = new Object();																// 시간 함수
let score = 0;																					// 점수 표시용
let score_tmp = 0;																				// 점수 계산용
let block_arr = new Array();																	// 블럭배열
let block_coor_arr = new Array();																// 블럭좌표배열
let clickIdx = 0;																				// 유저진행 시 클릭한 블럭인덱스
let targetIdx = 0;																				// 유저진행 시 바뀌는 블럭인덱스
let blockCombo = 0;																				// 연속 블록 파괴 콤보수
let isBlockReady = false;																		// 블록 초기에 다 내려왔는지 여부
let isBlockSet = false;																			// 블록 제자리 정착 여부
let isBlockClicked = false;																		// 블럭 클릭 여부
let isUserMoving = false;																		// 유저진행 여부
let isUserClickable = false;																	// 유저제어가능 여부
let isMovingFw = -1;																			// 유저진행 시 블럭 바꾸기/돌아가기 여부
let isGameRunning = false;
let gameClear = false;
/* 페이지 함수 */
function load(){
	let loading = new Loading();
	loadLoop = function(){
		ctx.clearRect(0, 0, cvs.width, cvs.height);	
		loading.draw();
		requestAnimFrame(loadLoop);
	};
	loadLoop();
}
function intro(){
	pageType = "intro";
	let intro_bg = new Intro_bg();
	(function(){
		intro_start_btn = new Intro_start_btn();
		intro_method_btn = new Intro_method_btn();
		intro_sound_btn = new Intro_sound_btn();
		method_bg = new Method_bg();
		method_content = new Method_content();
		method_exit_btn = new Method_exit_btn();
		method_prev_btn = new Method_prev_btn();
		method_next_btn = new Method_next_btn();
		green_layer = new Green_layer();

		method_dot_arr = new Array();
		for(let i=0;i<5;i++){
			method_dot_arr.push(new Method_dot(i));
		}
	})();
	function methodPopupFunc(){
		if(method_content.cutIdx < 1){
			method_prev_btn.active = false;
			method_next_btn.active = true;
		}
		else if(method_content.cutIdx > 3){
			method_next_btn.active = false;
			method_prev_btn.active = true;
		}
		else{
			method_prev_btn.active = true;
			method_next_btn.active = true;
		}
		for(let i=0;i<method_dot_arr.length;i++){
			if(i == method_content.cutIdx){
				method_dot_arr[i].active = true;
			}
			else{
				method_dot_arr[i].active = false;
			}
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
			method_bg.draw();
			method_content.draw();
			method_exit_btn.draw();
			method_prev_btn.draw();
			method_next_btn.draw();
			for(let i=0;i<method_dot_arr.length;i++){
				method_dot_arr[i].draw();
			}
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
		requestAnimFrame(introLoop);															// 게임 애니 시작
	};
	introLoop();
}
function main(){
	pageType = "main";	
	let main_bg = new Main_bg(),
		main_time = new Main_time(),
		main_gage_bak = new Main_gage_bak();
	(function(){
		white_layer = new White_layer();
		main_top_gage = new Main_top_gage();
		main_stage = new Main_stage();
		main_readygo = new Main_readygo();
		stage_num = new Num_type3();
		main_exit_btn = new Main_exit_btn();
		popup_layer = new Popup_layer();
		exit_bg = new Exit_bg();		exit_cont_btn = new Exit_cont_btn();	exit_quit_btn = new Exit_quit_btn();
		over_bg = new Over_bg();		over_content = new Over_content();		over_home_btn = new Over_home_btn();
		info_bg = new Info_bg();		info_cont_btn = new Info_cont_btn();
		clear_bg = new Clear_bg();		clear_content = new Clear_content();	clear_level_btn = new Clear_level_btn();
		finale_bg = new Finale_bg();	finale_content = new Finale_content();	finale_home_btn = new Finale_home_btn();

		usr_cnt_arr = new Array();
		tot_cnt_arr = new Array();
		score_arr = new Array();
		time_arr = new Array();

		for(let i=0;i<BLOCK_TYPE_NUM;i++){
			// 맞춘 블럭 갯수
			usr_cnt_arr.push(new Array(new Num_type1(), new Num_type1()));
			for(let j=0;j<usr_cnt_arr[i].length;j++){
				usr_cnt_arr[i][j].x = 68 + 13 * j;
				usr_cnt_arr[i][j].y = 120 + 78 * i;
			}
			// 전체 블럭 갯수
			tot_cnt_arr.push(new Array(new Num_type2(), new Num_type2()));
			for(let j=0;j<tot_cnt_arr[i].length;j++){
				tot_cnt_arr[i][j].x = 104 + 10 * j;
				tot_cnt_arr[i][j].y = 122 + 78 * i;
			}
		}
		stage_num.x = 683;	stage_num.y = 501;

		stageSetting();
	})();
	function leftMenuFunc(){
		for(let i=0;i<BLOCK_TYPE_NUM;i++){
			usr_cnt_arr[i][0].val = Math.floor(usr_arr[i] / 10);
			usr_cnt_arr[i][1].val = Math.floor(usr_arr[i] % 10);
			tot_cnt_arr[i][0].val = Math.floor((stage+5) / 10);
			tot_cnt_arr[i][1].val = Math.floor((stage+5) % 10);
		}		
	}
	function numberFunc(){
		// 게임 시간
		time_arr = new Array();
		let timeStr = time.toString();
		for(let i=0;i<timeStr.length;i++){
			time_arr.push(new Num_type3());
			time_arr[i].val = timeStr[i];
			time_arr[i].x = 632 - (timeStr.length - i) * 20;
			time_arr[i].y = 9;
			time_arr[i].w = 25;
			time_arr[i].h = 30;
		}
		
		// 게임 점수
		if(score < score_tmp){score += 10;}
		score_arr = new Array();
		let scoreStr = score.toString();
		for(let i=0;i<scoreStr.length;i++){
			score_arr.push(new Num_type3());
			score_arr[i].val = scoreStr[i];
			score_arr[i].x = 765 - (scoreStr.length - i) * 10;
			score_arr[i].y = 501;
			score_arr[i].w = 15;
			score_arr[i].h = 20;
		}
	}
	function aniFunc(){
		if(gameStart){
			if(green_layer.globalAlpha > 0.05){
				green_layer.globalAlpha -= 0.05;
			}
			else{
				gameStart = false;
				white_layer.appear = true;
			}
		}
		if(white_layer.loaded){
			main_stage.active = true;
			white_layer.loaded = false;
		}
		if(main_stage.loaded){
			main_readygo.active = true;
			main_stage.loaded = false;
		}
		if(main_readygo.loaded){
			white_layer.disappear = true;
			main_readygo.loaded = false;

			popup = false;
			isGameRunning = true;
		}
		if(!clear_bg.active && clear_bg.loaded){
			stageSetting();
			clear_bg.loaded = false;
		}
	}
	function blockFunc(){
		if(isGameRunning){
			if(!isBlockReady){
				if(block_arr[64].y < startLine){
					// 초기 게임판 이동
					for(let i=0;i<block_arr.length;i++){
						block_arr[i].y += blockSpeed*4;
					}
				}
				else{
					// 초기 좌표 저장
					for(let i=0;i<block_arr.length;i++){
						block_coor_arr.push(new Array(block_arr[i].x, block_arr[i].y));
					}
					timeCtrl(true);
					isBlockReady = true;	
				}
			}
			else{	
				if(isUserMoving){
					let isReached = false;
					for(let i=0;i<block_arr.length;i++){
						if(block_arr[i].isMovingRight){
							if(block_arr[i].x < block_coor_arr[i+1][0]){
								block_arr[i].x += blockSpeed;
							}
							else{
								block_arr[i].x = block_coor_arr[i+1][0];
								block_arr[i].isMovingRight = false;
								isReached = true;
							}
						}
						else if(block_arr[i].isMovingLeft){
							if(block_arr[i].x > block_coor_arr[i-1][0]){
								block_arr[i].x -= blockSpeed;
							}
							else{
								block_arr[i].x = block_coor_arr[i-1][0];
								block_arr[i].isMovingLeft = false;
								isReached = true;
							}
						}
						else if(block_arr[i].isMovingUp){
							if(block_arr[i].y > block_coor_arr[i-8][1]){
								block_arr[i].y -= blockSpeed;
							}
							else{
								block_arr[i].y = block_coor_arr[i-8][1];
								block_arr[i].isMovingUp = false;
								isReached = true;
							}
						}
						else if(block_arr[i].isMovingDown){
							if(block_arr[i].y < block_coor_arr[i+8][1]){
								block_arr[i].y += blockSpeed;
							}
							else{
								block_arr[i].y = block_coor_arr[i+8][1];
								block_arr[i].isMovingDown = false;
								isReached = true;
							}
						}
					}
					if(isReached){
						blockChange();
						blockCheck();
						isReached = false;
					}
				}
				else{
					let isBreaking = false;
					for(let i=0;i<block_arr.length;i++){
						if(block_arr[i].isBreaking){
							isBreaking = true;
						}
					}
					
					if(!isBreaking){
						for(let i=0;i<block_arr.length;i++){
							if(block_arr[i].isFalling){
								if(block_arr[i].y < block_coor_arr[i + block_arr[i].downVal * 8][1]){
									block_arr[i].y += blockSpeed;
								}
								else{
									block_arr[i].y = block_coor_arr[i + block_arr[i].downVal * 8][1];
									block_arr[i + block_arr[i].downVal * 8].cutIdx_tmp = block_arr[i].cutIdx;
									block_arr[i].isFalling = false;
								}
							}
						}

						let isFalling = false;
						for(let i=0;i<block_arr.length;i++){
							if(block_arr[i].isFalling){
								isFalling = true;
							}
						}
						if(!isFalling){
							if(!isBlockSet){
								for(let i=0;i<block_arr.length;i++){
									block_arr[i].reset();
								}
								blockCheck();
							}
						}
							
					}
				}					
			}
		}
	}
	function draw(){
		// UI
		main_bg.draw();
		main_gage_bak.draw();
		main_top_gage.draw();
		main_time.draw();
		stage_num.draw();
		main_exit_btn.draw();
		for(let i=0;i<BLOCK_TYPE_NUM;i++){
			if(usr_cnt_arr[i][0].val > 0){
				usr_cnt_arr[i][0].draw();
			}
			usr_cnt_arr[i][1].draw();

			if(tot_cnt_arr[i][0].val > 0){
				tot_cnt_arr[i][0].draw();
			}
			tot_cnt_arr[i][1].draw();
		}
		for(let i=0;i<time_arr.length;i++){
			time_arr[i].draw();
		}
		for(let i=0;i<score_arr.length;i++){
			score_arr[i].draw();
		}
		
		// 게임판
		for(let i=0;i<block_arr.length;i++){
			block_arr[i].draw();
		}

		white_layer.draw();
		main_readygo.draw();
		main_stage.draw();		
		green_layer.draw();

		if(gameClear){
			popup_layer.draw();
		}
		// 이후 팝업
		if(exit_bg.active || exit_bg.appear){
			popup_layer.draw();
			exit_bg.draw();
			exit_cont_btn.draw();
			exit_quit_btn.draw();
		}
		if(over_bg.active || over_bg.appear){
			popup_layer.draw();
			over_bg.draw();
			over_content.draw();
			over_home_btn.draw();
		}
		if(info_bg.active || info_bg.appear){
			info_bg.draw();
			info_cont_btn.draw();
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
		leftMenuFunc();
		numberFunc();
		aniFunc();
		blockFunc();
		draw();
		requestAnimFrame(mainLoop);
	};
	mainLoop();
}
/* 진행 함수 */
function stageSetting(){
	popup = true;
	stage++;
	main_stage.cutSet(stage-1);
	stage_num.val = stage;
	
	// 유저 맞춘 갯수 초기화
	usr_arr = new Array();
	for(let i=0;i<BLOCK_TYPE_NUM;i++){
		usr_arr.push(0);
	}
	// 시간 및 게이지 초기화
	time = 60;
	main_top_gage = new Main_top_gage();
	
	// 블록 초기화
	isBlockReady = false;
	block_arr = new Array();
	block_coor_arr = new Array();
	for(let i=0;i<128;i++){
		block_arr.push(new Main_block(i));
	}

	gameClear = false;
	isBlockSet = false;
	isGameRunning = false;
	isUserClickable = false;
	if(stage > 1){
		white_layer.appear = true;
	}
	audioPlay(3);
}	
function methodPopupFunc(bool){
	if(bool){
		method_content.cutSet(0);
	}
	popup = bool;
	method_bg.active = bool;
}
function exitPopupCtrl(bool, isByBtn){
	if(isByBtn){
		popup = bool;
		popup_layer.appear = bool;
		timeCtrl(!bool);
	}
	exit_bg.appear = bool;
	exit_cont_btn.appear = bool;
	exit_quit_btn.appear = bool;
}
function overPopupCtrl(bool){
	popup = bool;
	popup_layer.appear = bool;
	over_bg.appear = bool;
	over_home_btn.appear = bool;
}
function infoPopupCtrl(bool){
	if(bool){
		popup = bool;
		popup_layer.appear = bool;
		info_bg.cutSet(stage - 1);
		timeCtrl(false);
	}
	info_bg.appear = bool;
	info_cont_btn.appear = bool;
}
function clearPopupCtrl(bool){
	if(bool){
		score_tmp += time * 100;
		score = score_tmp;
	}
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
function blockAction(){
	blockCombo = 0;
	isBlockSet = false;
	isUserMoving = true;	
	isBlockClicked = false;

	audioPlay(1);

	if(block_arr[clickIdx].action == "left"){
		targetIdx = clickIdx - 1;
		block_arr[clickIdx].left();
		block_arr[targetIdx].right();
	}
	else if(block_arr[clickIdx].action == "right"){
		targetIdx = clickIdx + 1;		
		block_arr[clickIdx].right();
		block_arr[targetIdx].left();
	}
	else if(block_arr[clickIdx].action == "down"){
		targetIdx = clickIdx + 8;
		block_arr[clickIdx].down();
		block_arr[targetIdx].up();
	}
	else if(block_arr[clickIdx].action == "up"){
		targetIdx = clickIdx - 8;
		block_arr[clickIdx].up();
		block_arr[targetIdx].down();
	}
}
function blockChange(){
	let tmp_coor = 0,
		tmp_cut = 0;
	if(block_arr[clickIdx].action == "left" || block_arr[clickIdx].action == "right"){
		tmp_coor = block_arr[clickIdx].x;
		block_arr[clickIdx].x = block_arr[targetIdx].x;
		block_arr[targetIdx].x = tmp_coor;
	}
	else{
		tmp_coor = block_arr[clickIdx].y;
		block_arr[clickIdx].y = block_arr[targetIdx].y;
		block_arr[targetIdx].y = tmp_coor;
	}
	tmp_cut = block_arr[clickIdx].cutIdx;
	block_arr[clickIdx].cutSet(block_arr[targetIdx].cutIdx);
	block_arr[targetIdx].cutSet(tmp_cut);	
	
	// 되돌아가는 여부 확인			
	isMovingFw *= -1;
	if(isMovingFw == -1){
		isUserMoving = false;
	}
}
function blockCheck(){
	let match_arr = new Array();
	let tmp_arr = new Array();

	for(let i=64;i<block_arr.length;i++){
		// 가로 확인
		if(0 < i%8 && i%8 < 7){
			if((block_arr[i-1].cutIdx == block_arr[i].cutIdx) && (block_arr[i].cutIdx == block_arr[i+1].cutIdx)){
				let check = false;
				for(let j=0;j<tmp_arr.length;j++){
					if((tmp_arr[j] == i-1) || (tmp_arr[j] == i) || (tmp_arr[j] == i+1)){
						check = true;
					}
				}
				if(!check){
					usr_arr[block_arr[i].cutIdx]++;
				}
				tmp_arr.push(i-1, i, i+1);				
			}
		}
		// 세로 확인
		if(71 < i && i < 120){
			if((block_arr[i-8].cutIdx == block_arr[i].cutIdx) && (block_arr[i].cutIdx == block_arr[i+8].cutIdx)){
				let check = false;
				for(let j=0;j<tmp_arr.length;j++){
					if((tmp_arr[j] == i-8) || (tmp_arr[j] == i) || (tmp_arr[j] == i+8)){
						check = true;
					}
				}
				if(!check){
					usr_arr[block_arr[i].cutIdx]++;
				}	
				tmp_arr.push(i-8, i, i+8);
			}
		}
	}
	// 중복제거
	$.each(tmp_arr, function(i, el){
		if($.inArray(el, match_arr) === -1){
			match_arr.push(el);
		}
	});

	if(match_arr.length > 0){
		audioPlay(2);
		time++;
		blockCombo++;
		score_tmp += blockCombo*100;

		isUserClickable = false;

		if(isUserMoving){
			isMovingFw = -1;
			isUserMoving = false;
		}

		for(let i=0;i<match_arr.length;i++){
			block_arr[match_arr[i]].ani = 0;
			block_arr[match_arr[i]].isBreaking = true;
			
			for(let j=0;j<match_arr[i];j++){
				if(j % 8 == match_arr[i] % 8){
					if(!block_arr[j].isBreaking){
						block_arr[j].downVal++;
						block_arr[j].isFalling = true;
					}
				}
			}
		}
	}
	else{
		isBlockSet = true;
		isUserClickable = true;
		
		if(isUserMoving){
			blockAction();
		}
		else{
			if(!gameClear){
				let check = false;
				for(let i=0;i<BLOCK_TYPE_NUM;i++){
					if(usr_arr[i] < stage + 5){
						check = true;
					}
				}
				if(!check){
					exitPopupCtrl(false, false);
					over_bg.appear = false;
					infoPopupCtrl(true);
					isGameRunning = false;
					gameClear = true;
				}
			}				
		}
	}
}
function timeCtrl(bool){
	if(bool){
		timeInterval = setInterval(function(){
			if(isGameRunning){
				if(time > 0){
					time--;
				}
				else{
					overPopupCtrl(true);
					isGameRunning = false;
				}
			}
		},1000);
	}
	else{
		clearInterval(timeInterval);
	}
}
function split3digit(num){
	var val = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return val;
}
/* 이벤트 */
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
			if(isBlockReady){	
				if(!isUserMoving && isUserClickable){
					for(let i=64;i<block_arr.length;i++){
						if(mouseCd(block_arr[i])){
							$("canvas").css("cursor","pointer");
						}
					}
					if(isBlockClicked){
						if((mouseXtmp - mouseX) / wR > 5){
							if(clickIdx % 8 == 0) return;	
							block_arr[clickIdx].action = "left";
							blockAction();
						}
						else if((mouseX - mouseXtmp) / wR > 5){
							if(clickIdx % 8 == 7) return;	
							block_arr[clickIdx].action = "right";
							blockAction();
						}
						else if((mouseY - mouseYtmp) / hR > 5){
							if(Math.floor((clickIdx - 64) / 8) == 7) return;
							block_arr[clickIdx].action = "down";
							blockAction();
						}
						else if((mouseYtmp - mouseY) / hR > 5){
							if(Math.floor((clickIdx - 64) / 8) == 0) return;
							block_arr[clickIdx].action = "up";	
							blockAction();
						}
					}
				}
			}
			if(mouseCd(main_exit_btn)){
				$("canvas").css("cursor","pointer");
				main_exit_btn.mouseOver = true;
			}
			else{
				main_exit_btn.mouseOver = false;
			}
		}
		else{
			if(exit_bg.active && exit_bg.appear){
				if(mouseCd(exit_cont_btn)){
					$("canvas").css("cursor","pointer");
					exit_cont_btn.mouseOver = true;
					exit_quit_btn.mouseOver = false;
				}
				else if(mouseCd(exit_quit_btn)){
					$("canvas").css("cursor","pointer");
					exit_quit_btn.mouseOver = true;
					exit_cont_btn.mouseOver = false;
				}
				else{
					exit_cont_btn.mouseOver = false;
					exit_quit_btn.mouseOver = false;
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
			if(info_bg.active && info_bg.appear){
				if(mouseCd(info_cont_btn)){
					$("canvas").css("cursor","pointer");
					info_cont_btn.mouseOver = true;
				}
				else{
					info_cont_btn.mouseOver = false;
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
			if(over_bg.active && over_bg.appear){
				if(mouseCd(over_home_btn)){
					$("canvas").css("cursor","pointer");
					over_home_btn.mouseOver = true;
				}
				else{
					over_home_btn.mouseOver = false;
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
			if(isBlockReady){	
				if(!isBlockClicked && !isUserMoving && isUserClickable){
					for(let i=64;i<block_arr.length;i++){
						if(mouseCd(block_arr[i])){
							mouseXtmp = mouseX;
							mouseYtmp = mouseY;
							clickIdx = i;
							isBlockClicked = true;			
						}
					}
				}
			}
		}
	}
});
document.addEventListener(mouseEv("up"),function(){
	if(pageType == "intro"){
		if(!popup){
			if(mouseCd(intro_start_btn)){
				audioPlay(4);
				intro_start_btn.mouseOver = false;
				gameStart = true;
			}
			else if(mouseCd(intro_method_btn)){
				audioPlay(4);
				intro_method_btn.mouseOver = false;		
				methodPopupFunc(true);
			}
			else if(mouseCd(intro_sound_btn)){
				if(volume){
					volume = 0;
					intro_sound_btn.mouseOver = true;
				}
				else{
					volume = 1;
					intro_sound_btn.mouseOver = false;
				}
				for(let i=0;i<aud_Arr.length;i++){
					aud_Arr[i][1].volume = volume;
				}
				audioPlay(4);
			}
		}
		else{
			if(method_bg.active){
				if(mouseCd(method_exit_btn)){
					audioPlay(4);
					method_exit_btn.mouseOver = false;
					methodPopupFunc(false);
				}
				else if(mouseCd(method_prev_btn)){
					audioPlay(4);
					method_prev_btn.mouseOver = false;
					if(method_prev_btn.active){
						method_content.cutSet(--method_content.cutIdx);
					}
				}
				else if(mouseCd(method_next_btn)){
					audioPlay(4);
					method_next_btn.mouseOver = false;
					if(method_next_btn.active){
						method_content.cutSet(++method_content.cutIdx);
					}
				}
			}
		}
	}	
	else if(pageType == "main"){
		if(!popup){
			if(isBlockClicked){
				isBlockClicked = false;
			}
			main_exit_btn.mouseOver = false;
			if(mouseCd(main_exit_btn)){
				audioPlay(4);
				exitPopupCtrl(true, true);
			}
		}
		else{
			if(exit_bg.active && exit_bg.appear){
				exit_cont_btn.mouseOver = false;
				exit_quit_btn.mouseOver = false;
				if(mouseCd(exit_cont_btn)){
					audioPlay(4);
					exitPopupCtrl(false, true);					
				}
				else if(mouseCd(exit_quit_btn)){
					location.href = "index.html";
				}
			}
			if(finale_bg.active && finale_bg.appear){
				finale_home_btn.mouseOver = false;
				if(mouseCd(finale_home_btn)){
					_isPorted ? parent.gameResult() : location.href = "index.html";
				}
			}
			if(info_bg.active && info_bg.appear){
				info_cont_btn.mouseOver = false;
				if(mouseCd(info_cont_btn)){
					audioPlay(4);
					infoPopupCtrl(false);
					clearPopupCtrl(true);
				}
			}
			if(clear_bg.active && clear_bg.appear){
				clear_level_btn.mouseOver = false;
				if(mouseCd(clear_level_btn)){
					audioPlay(4);
					clearPopupCtrl(false);
				}
			}
			if(over_bg.active && over_bg.appear){
				over_home_btn.mouseOver = false;
				if(mouseCd(over_home_btn)){
					location.href = "index.html";
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