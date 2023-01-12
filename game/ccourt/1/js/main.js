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
	["main/bg.png"],	
	["main/top_bg.png"],	
	["main/top_text.png"],	
	["main/char.png"],																			// 25
	["main/btn_exit.png"],															
	["main/shadow.png"],	
	["main/alert.png"],															
	["main/bubble_think.png"],	
	["main/exit/bg.png"],																		// 30
	["main/exit/btn_yes.png"],														
	["main/exit/btn_no.png"],		
	["main/quiz/bg.png"],		
	["main/quiz/btn_pro.png"],		
	["main/quiz/btn_con.png"],																	// 35
	["main/quiz/btn_more.png"],														
	["main/quiz/result.png"],	
	["main/num_step.png"],	
	["main/num_time.png"],													
	["main/bubble_result.png"],																	// 40							
	["main/over/bg.png"],															
	["main/over/btn_home.png"],	
	["main/result/bg.png"],	
	["main/result/btn_next.png"],	
	["main/result/judge.png"],																	// 45
	["main/result/correct.png"],													
	["main/result/wrong.png"],								
	["main/clear/bg.png"],	
	["main/clear/btn_home.png"],					
	["main/relate/bg.png"],																		// 50
	["main/relate/btn_close.png"],														
];
const aud_Arr = [
	["bgm.mp3"],																				// 0
	["btn_click.mp3"],
	["method.mp3"],
	["level.mp3"],
	["result.mp3"],
	["answer.mp3"],																				// 5
	["gameover.mp3"],	
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
	this.init({idx:1});
};
const Intro_logo = function(){
	this.init({idx:2, x:520, y:90});
	this.movingDown = true;
	this.alphaSet(1);
	this.alphaFunc = function(){
		if(this.y > 110){
			this.movingDown = false;
		}
		else if(this.y < 90){
			this.movingDown = true;
		}
		this.movingDown ? this.y += 0.5 : this.y -= 0.5;		
	};
};
const Intro_start_btn = function(){
	this.init({idx:3, col:2, spr:2, x:550, y:425});
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
	this.init({idx:4, col:2, spr:2, x:550, y:480});
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
	this.init({idx:8, col:4, spr:4, x:100, y:185, w:600, h:270});
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
	this.init({idx:10, active:false, col:2, spr:2, x:265, y:455});
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
	this.init({idx:11, active:false, col:2, spr:2, x:430, y:455});
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
	this.clickable = false;
	this.btnSet();
};
const Main_bg = function(){
	this.init({idx:22});
};
const Main_top_bg = function(){
	this.init({idx:23, x:"center", y:-45});
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
const Main_top_text = function(){
	this.init({idx:24, col:5, spr:13, x:"center", y:20});
	this.alphaSet(0);
	this.aniSet(5);
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
const Main_char = function(){
	this.init({idx:25, col:2, spr:2, x:677, y:176});
	if(gender == 1){
		this.cutSet(0);
	}
	else{
		this.cutSet(1);
	}
};
const Main_exit_btn = function(){
	this.init({idx:26, col:2, spr:2, x:725, y:-30, w:60, h:60});
	this.btnSet();
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y += 2;
			}
			else{
				this.clickable = true;
			}
		}
		else{
			this.clickable = false;
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y -= 2;
			}
		}
	};
};
const Main_shadow = function(){
	this.init({idx:27});
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
const Main_alert = function(){
	this.init({idx:28, col:1, spr:4, y:50});
	this.cutSet(0);
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y += 10;
			}
			else{
				if(this.y > 200){
					this.y -= 5;
				}
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y -= 10;
			}
			else{
				this.y = 50;
			}
		}
	};
};
const Main_bubble = function(px){
	this.x = px;	this.y = 145;
	this.w = 78;	this.h = 69;
	this.cy = 0;	this.cw = 78;	this.ch = 69;
	this.globalAlpha = 0;
	this.appear = false;	this.active = false;
	this.ani = 0;
	this.think = false;
	this.imgIdx = 0;
	this.val = 0;				// 합헌 : 1 위헌 : 2

	this.draw = function(){
		try{ 
			if(this.appear){
				this.active = true;
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y -= 1;
				}
				else{
					if(this.y < 131){
						this.y += 0.5;
					}
				}
			}
			else{
				this.active = false;
				this.globalAlpha = 0;
				this.y = 145;
			}

			if(this.think){
				this.imgIdx = 29;
				this.cx = Math.floor(this.ani/20)%3*78;
				this.ani++;
				if(this.ani > 59){
					this.ani = 0;
				}
			}
			else{
				this.imgIdx = 40;
				this.cx = (this.val - 1) * 78;
			}
			if(this.active){
				ctx.save();
				ctx.globalAlpha = this.globalAlpha;
				ctx.drawImage(cvs_Arr[this.imgIdx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
				ctx.restore();
			}			
		}
		catch(e){}
	};
};
const Main_exit_bg = function(){
	this.init({idx:30, x:"center", y:"center"});
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
	this.init({idx:31, col:2, spr:2, x:250, y:315});
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
	this.init({idx:32, col:2, spr:2, x:400, y:315});
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
const Main_quiz_bg = function(){
	this.init({idx:33, x:10, y:360});
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y -= 4;
			}
			else{
				if(this.y < 300){
					this.y += 1;
				}
				else{
					this.load = true;
				}
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y += 4;
			}
			else{
				this.y = 360;
				this.load = false;
			}
		}
	};
};
const Main_quiz_pro_btn = function(){
	this.init({idx:34, col:2, spr:2, x:660, y:390});
	this.clickable = true;
	this.btnSet();
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y -= 4;
			}
			else{
				if(this.y < 330){
					this.y += 1;
				}
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y += 4;
			}
			else{
				this.y = 390;
			}
		}
	};
};
const Main_quiz_con_btn = function(){
	this.init({idx:35, col:2, spr:2, x:660, y:460});
	this.clickable = true;
	this.btnSet();
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y -= 4;
			}
			else{
				if(this.y < 400){
					this.y += 1;
				}
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y += 4;
			}
			else{
				this.y = 460;
			}
		}
	};
};
const Main_quiz_more_btn = function(){
	this.init({idx:36, col:2, spr:2, x:510, y:370});
	this.btnSet();
	this.alphaSet(0);
	this.alphaFunc = function(){
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y -= 4;
			}
			else{
				if(this.y < 310){
					this.y += 1;
				}
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y += 4;
			}
			else{
				this.y = 370;
			}
		}
	};
};
const Main_quiz_title = function(){
	this.x = 30;this.y = 400;
	this.globalAlpha = 0;
	this.idx = 0;
	this.draw = function(){
		try{ 
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y -= 4;
				}
				else{
					if(this.y < 340){
						this.y += 1;
					}
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y += 4;
				}
				else{
					this.y = 400;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.font = "bold "+(18 * hR)+"px '나눔스퀘어'";
			ctx.fillStyle = "#333333";
			ctx.textAlign = "left";	
			if(this.idx == 1){
				ctx.fillText("첫번째 안건 : "+quiz_Arr[this.idx-1][0], this.x * wR, this.y * hR);
			}
			else if(this.idx == 2){
				ctx.fillText("두번째 안건 : "+quiz_Arr[this.idx-1][0], this.x * wR, this.y * hR);
			}
			else if(this.idx == 3){
				ctx.fillText("세번째 안건 : "+quiz_Arr[this.idx-1][0], this.x * wR, this.y * hR);
			}
			else if(this.idx == 4){
				ctx.fillText("네번째 안건 : "+quiz_Arr[this.idx-1][0], this.x * wR, this.y * hR);
			}
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_quiz_body = function(){
	this.x = 30;this.y = 440;
	this.globalAlpha = 0;
	this.idx = 0;
	this.draw = function(){
		try{ 
			if(this.appear){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
					this.y -= 4;
				}
				else{
					if(this.y < 380){
						this.y += 1;
					}
				}
			}
			else{
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
					this.y += 4;
				}
				else{
					this.y = 440;
				}
			}
			ctx.save();
			ctx.globalAlpha = this.globalAlpha;
			ctx.font = "bold "+(18 * hR)+"px '나눔스퀘어'";
			ctx.fillStyle = "#333333";
			ctx.textAlign = "left";	
			let text = quiz_Arr[this.idx-1][1].split("\n");
			for(let i=0;i<text.length;i++){
				ctx.fillText(text[i], this.x * wR, (this.y + 25 * i) * hR);	
			}
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_quiz_result = function(){
	this.init({idx:37, col:1, spr:2, x:0, y:375, w:640, h:190});
	this.val = 1;
	this.alphaSet(0);
	this.alphaFunc = function(){
		this.cy = (this.val - 1) * this.ch;
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;

				this.w -= 4;
				this.h -= 4;
				this.x += 2;
				this.y += 2;
			}
		}
		else{
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y += 4;
			}
			else{
				this.w = 640;
				this.h = 190;
				this.x = 0;
				this.y = 375;
			}
		}
	};
};
const Main_num_quiz = function(){
	this.init({idx:38, col:4, spr:4, x:350, y:-15});
	this.alphaSet(0);
	this.alphaFunc = function(){
		this.cx = this.val * this.cw;
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y += 2;
			}
			else{
				this.load = true;
			}
		}
		else{
			this.load = false;
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y -= 2;
			}
		}
	};
};
const Main_num_time = function(px, pval){
	this.init({idx:39, col:11, spr:11, x:px, y:-20});
	this.val = pval;
	this.alphaSet(0);
	this.alphaFunc = function(){
		this.cx = this.val * this.cw;
		if(this.appear){
			if(this.globalAlpha < 0.95){
				this.globalAlpha += 0.05;
				this.y += 2;
			}
			else{
				this.load = true;
			}
		}
		else{
			this.load = false;
			if(this.globalAlpha > 0.05){
				this.globalAlpha -= 0.05;
				this.y -= 2;
			}
		}
	};
};
const Main_over_bg = function(){
	this.init({idx:41, x:"center", y:"center"});
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
const Main_over_home_btn = function(){
	this.init({idx:42, col:2, spr:2, x:325, y:365});
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
const Main_result_bg = function(){
	this.init({idx:43, x:"center", y:"center"});
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
const Main_result_next_btn = function(){
	this.init({idx:44, col:2, spr:2, x:325, y:450});
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
const Main_result_title = function(){
	this.x = 400;this.y = 120;
	this.globalAlpha = 0;
	this.percent = 0;
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
			ctx.font = "bold "+(25 * hR)+"px '나눔스퀘어'";
			ctx.fillStyle = "#000";
			ctx.textAlign = "center";	
			ctx.fillText("헌법재판소와 당신의 결정 일치도는 "+this.percent+"% 입니다.", this.x * wR, this.y * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_result_judge = function(py){
	this.init({idx:45, col:2, spr:2, x:580, y:py});
	this.alphaSet(0);
	this.alphaFunc = function(){
		this.cx = this.val * this.cw;
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
const Main_result_correct = function(py){
	this.init({idx:46, col:2, spr:2, x:670, y:py});
	this.alphaSet(0);
	this.alphaFunc = function(){
		this.cx = this.val * this.cw;
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
const Main_result_wrong = function(py){
	this.init({idx:47, active:false, x:60, y:py});
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
const Main_result_content = function(pidx, py){
	this.x = 75;
	this.y = py;
	this.globalAlpha = 0;
	this.idx = pidx;
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
			ctx.font = "bold "+(20 * hR)+"px '나눔스퀘어'";
			ctx.fillStyle = "#333333";		
			ctx.fillText(quiz_Arr[this.idx][0], this.x * wR, (this.y + 10) * hR);
			ctx.font = "bold "+(15 * hR)+"px '나눔스퀘어'";
			ctx.fillStyle = "#E08567";	
			if(my_judge_Arr[this.idx] == 1){
				ctx.fillText("나의 결정 : 합헌", this.x * wR, (this.y + 30) * hR);	
			}
			else{
				ctx.fillText("나의 결정 : 위헌", this.x * wR, (this.y + 30) * hR);	
			}
			/*ctx.font = "bold "+(15 * hR)+"px '나눔스퀘어'";
			ctx.fillStyle = "#4D926D";	
			ctx.fillText(quiz_Arr[this.idx][5], this.x * wR, (this.y + 40) * hR);
			ctx.restore();*/
		}
		catch(e){}
	};
};
const Main_clear_bg = function(){
	this.init({idx:48, x:"center", y:"center"});
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
const Main_clear_home_btn = function(){
	this.init({idx:49, col:2, spr:2, x:325, y:375});
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
const Main_clear_content = function(){
	this.x = 400;this.y = 275;
	this.globalAlpha = 0;
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
				ctx.fillStyle = "#000";
				ctx.fillText("회원 가입 후에 다시 도전해보세요!", this.x * wR, (this.y + 45) * hR);
			}
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_relate_bg = function(){
	this.init({idx:50, x:"center", y:"center"});
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
const Main_relate_close_btn = function(){
	this.init({idx:51, col:2, spr:2, x:325, y:430, w:150, h:50});
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
const Main_relate_title = function(){
	this.x = 260;this.y = 95;
	this.globalAlpha = 0;
	this.idx = 0;
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
			ctx.font = "bold "+(25 * hR)+"px '나눔스퀘어'";
			ctx.fillStyle = "#000";
			ctx.textAlign = "left";	
			ctx.fillText(quiz_Arr[this.idx-1][0], this.x * wR, this.y * hR);
			ctx.restore();
		}
		catch(e){}
	};
};
const Main_relate_content = function(){
	this.x = 100;this.y = 110;
	this.globalAlpha = 0;
	this.idx = 0;
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
			ctx.font = "bold "+(23 * hR)+"px '나눔스퀘어'";
			ctx.textAlign = "left";	
			let last_y = this.y;
			for(let i=0;i<quiz_Arr[this.idx-1][6].length;i++){
				ctx.fillStyle = "#704242";
				ctx.fillText(quiz_Arr[this.idx-1][6][i][0], this.x * wR, (last_y + 50) * hR);				
				ctx.fillStyle = "#006633";
				let txt = quiz_Arr[this.idx-1][6][i][1].split("\n");
				for(let j=0;j<txt.length;j++){
					ctx.fillText(txt[j], this.x * wR, (last_y + 50 + 25 + 25 * j) * hR);
					if(j == txt.length - 1){
						last_y += 50 + 25 + 25 * j;
					}
				}
			}
			ctx.restore();
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
	conv_start_btn = new Object();
let main_exit_btn = new Object(),
	main_shadow = new Object(),
	main_exit_bg = new Object(),
	main_exit_yes_btn = new Object(),
	main_exit_no_btn = new Object(),
	main_quiz_bg = new Object(),
	main_quiz_pro_btn = new Object(),
	main_quiz_con_btn = new Object(),
	main_quiz_more_btn = new Object(),
	main_quiz_result = new Object(),
	main_over_bg = new Object(),
	main_over_home_btn = new Object(),
	main_result_bg = new Object(),
	main_result_next_btn = new Object(),
	main_result_title = new Object(),
	main_clear_bg = new Object(),
	main_clear_home_btn = new Object(),
	main_clear_content = new Object(),
	main_relate_bg = new Object(),
	main_relate_close_btn = new Object(),
	main_relate_title = new Object(),
	main_relate_content = new Object();
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
let roundSet = false;																			// 라운드 진행용
let gender = 1;																					// 성별 남:1 여:2
let convIdx = 0;																				// 인트로단계대화 순서
let convEnd = false;																			// 인트로단계대화 각 순서 종료여부
let typeInterval = new Object();																// 인트로단계대화 인터벌
let typingIdx = 0;																				// 인트로단계대화 글자인덱스
let typingColIdx = 0;																			// 인트로단계대화 줄인덱스
let time = 180;																					// 게임시간 3분
let timeInterval = new Object();																// 게임시간 인터벌
let bubbleTime = 0;																				// 말풍선 시간 체크용
let quizIdx = 0;																				// 퀴즈 번호
let conv_user_result_Arr = new Array(),															// 인트로단계대화 유저멘트 배열
	conv_pc_result_Arr = new Array(),															// 인트로단계대화 PC멘트 배열
	typeSplitText = new Array(),																// 인트로단계대화 문장삽입용 배열
	time_Arr = new Array(),																		// 게임시간 삽입용 배열
	my_judge_Arr = new Array(),																	// 퀴즈 제출 답안용 배열
	main_bubble_Arr = new Array(),																// 말풍선 배열 배열
	main_result_judge_Arr = new Array(),														// 결과 정답 배열
	main_result_correct_Arr = new Array(),														// 결과 정답체크 배열
	main_result_wrong_Arr = new Array(),														// 결과 암막 배열
	main_result_content_Arr = new Array();														// 결과 내용 배열
let conv_Arr = [
	["어린이 헌법재판관이라...","처음이라 뭐가 뭔지 모르겠어요 ㅠㅜ","내가 재판관이 되어보는건가..."],
	["안녕~ 나는 너를 도와줄 헌법의 요정!","네가 해볼 것은 헌법재판소에서 사건","결정 체험을 해 보는 것이란다."],
	["사건 결정이라 하면... 유죄, 무죄 뭐","이런 걸 말하는 건가요?"],
	["그건 형사재판이고, 헌법재판소에서는","우리가 지키는 법이 옳은지 판단하는","일을 하지! 합헌, 위헌... 이렇게..."],
	["음... 들어보긴 했는데, 무슨 뜻인지는","잘 모르겠네요... 합헌? 위헌?","무슨 뜻이죠?"],
	["합헌은 '헌법에 합치'된다!","위헌은 '헌법에 위배'된다!","...라는 의미란다."],
	["사건을 잘 살펴본다음... 헌법에 맞나","안맞나를 판단하는... 중요한 일이군요!"],
	["그래 이제 어떻게 게임을 해야하는 지","좀 알 것 같니?"],
	["네! 열심히 해볼게요!"]
];
let quiz_Arr = [
	[
		"우리나라는 남성만이 의무적으로 군대에 간다",
		"우리나라는 남성만이 의무적으로 군대에 가고 있습니다. 이는 남녀에 \n대한 차별로 평등권을 보장하고 있는 우리나라 헌법에 위배되는\n것일까요 합치되는 것일까요?",
		1,
		[1,1,2,1,2,1,1,1],
		[8,2,4,5,3,1,7,6],
		"어린이 헌법재판관 결정 결과 : 남성만 군대에 가는 것을 헌법에 합치된다고 판단을 했기",
		[
			[
				"헌법 제39조 1항 :",
				"모든 국민은 법률이 정하는 바에 의하여 국방의 의무를 진다."
			]
		]
	],
	[
		"군복무 남성의 공무원 가산점?",
		"군대를 다녀온 남자가 공무원 채용시험 응시할 경우 과목별로 3~5%의\n가산점을 주도록 하는 법이 있습니다. 이러한 법은 병역을 의무화 하고,\n기회 평등의 권리를 부여하고 있는 우리나라 헌법에 위배되는 것일까요\n합치되는 것일까요?",
		2,
		[2,2,2,1,1,2,2,2],
		[1,2,4,5,3,8,7,6],
		"어린이 헌법재판관 결정 결과 : 군복무 남성의 공무원 가산점은 헌법에 위배된다고 판단",
		[
			[
				"헌법 제11조 :",
				"모든 국민은 법 앞에 평등하다. 누구든지 성별·종교 또는\n사회적 신분에 의하여 정치적·경제적·사회적·문화적 생활의\n모든 영역에 있어 차별을 받지 아니한다."
			],
			[
				"헌법 제25조 :",
				"모든 국민은 법률이 정하는 바에 의하여 공무담임권을 가진다."
			],
			[
				"헌법 제39조 1항 :",
				"모든 국민은 법률이 정하는 바에 의하여 국방의 의무를 진다."
			]
		]
	],
	[
		"인터넷 게시판 이용 시 본인 확인?",
		"인터넷 게시판에 댓글을 달 때 본인확인을 하도록 하는 법은 표현의 \n자유를 보장하고 있는 우리나라 헌법에 위배되는 것일까요 합치되는\n것일까요?",
		2,
		[2,1,2,2,1,2,2,2],
		[3,7,8,6,2,5,4,1],
		"어린이 헌법재판관 결정 결과 : 인터넷 게시판 이용 시 본인 확인을 하는 것은 헌법에 위",
		[
			[
				"헌법 제17조 :",
				"모든 국민은 사생활의 비밀과 자유를 침해받지 아니한다."
			],
			[
				"헌법 제21조 1항 :",
				"모든 국민은 언론·출판의 자유와 집회·결사의 자유를 가진다."
			]

		]
	],
	[
		"공무원 시험 응시 나이 제한?",
		"공무원 시험에 응시할 수 있는 나이에 제한을 둔 것은 국민 누구나 \n나라의 업무를 담당할 수 있는 권리(공무담임권)을 보장하고 있는 \n우리나라 헌법에 위배되는 것일까요 합치되는 것일까요?",
		2,
		[2,2,2,1,1,2,2,2],
		[1,2,4,5,3,8,7,6],
		"어린이 헌법재판관 결정 결과 : 공무원 시험 응시 나이를 제한하는 것은 헌법에 위배된",
		[
			[
				"헌법 제25조 :",
				"모든 국민은 법률이 정하는 바에 의하여 공무담임권을 가진다."
			]
		]
	],
	[
		"위안부 할머니 보상 요구",
		"우리나라 정부가 일본에 대해 일제시대 위안부 할머니들에 대한 보상을\n적극적으로 요구하지 않는 것은 배상청구를 국가의 의무로 하고 있는 \n헌법에 위배되는 것일까요 합치되는 것일까요?",
		2,
		[2,1,2,2,1,2,2,2],
		[3,7,8,6,2,5,4,1],
		"어린이 헌법재판관 결정 결과 : 위안부 할머니 보상 요구를 헌법에 위배된다고 판단을",
		[
			[
				"헌법 제10조 :",
				"모든 국민은 인간으로서의 존업과 가치를 가지며,\n행복을 추구할 권리를 가진다. 국가는 개인이 가지는\n불가침의 기본적 인권을 확인하고 이를 보장할 의무를 진다."
			]
		]
	],
	[
		"동성동본 결혼 불가?",
		"동성동본(예를 들면 김해 김씨끼리)은 결혼을 할 수 없도록 한 법은\n행복을 추구할 수 있도록 한 우리 나라 헌법에 위배되는 것일까요\n합치되는 것일까요?",
		2,
		[2,2,2,1,1,2,2,2],
		[1,2,4,5,3,8,7,6],
		"어린이 헌법재판관 결정 결과 : 동성동본이 결혼을 할 수 없는 것을 헌법에 위배된다고",
		[
			[
				"헌법 제10조 :",
				"모든 국민은 인간으로서의 존업과 가치를 가지며,\n행복을 추구할 권리를 가진다. 국가는 개인이 가지는\n불가침의 기본적 인권을 확인하고 이를 보장할 의무를 진다."
			],
			[
				"헌법 제36조 1항 :",
				"혼인과 가족생활은 개인의 존업과 양성의 평등을 기초로\n성립되고 유지되어야 하며, 국가는 이를 보장한다."
			]
		]
	],
	[
		"낳아 준 아버지의 성만 따라야 한다?",
		"나를 낳아 준 아버지의 성만을 따르도록 한 법이 있습니다. 그래서 \n어머니가 재혼을 하셔서 새로운 아버지가 생기더라도, 새로운 아버지의 \n성은 따를 수가 없습니다. 이 법은 개인의 존엄과 남녀평등을 보장하는 \n우리 헌법에 위배되는 것일까요 합치되는 것일까요?",
		2,
		[2,1,2,2,1,2,2,2],
		[3,7,8,6,2,5,4,1],
		"어린이 헌법재판관 결정 결과 : 낳아 준 아버지의 성만 따라야 하는 것은 헌법에 위배된",
		[
			[
				"헌법 제10조 :",
				"모든 국민은 인간으로서의 존업과 가치를 가지며,\n행복을 추구할 권리를 가진다. 국가는 개인이 가지는\n불가침의 기본적 인권을 확인하고 이를 보장할 의무를 진다."
			],
			[
				"헌법 제36조 1항 :",
				"혼인과 가족생활은 개인의 존업과 양성의 평등을 기초로\n성립되고 유지되어야 하며, 국가는 이를 보장한다."
			]
		]
	],
	[
		"영화의 내용을 사전 검열?",
		"영화가 만들어지면 영화관에서 상영되기 이전에 국가기관에서 이를 \n먼저 보고 논의하여 영화의 내용을 일부 삭제토록 하거나 상영이 되지 \n못하도록 하는 법이 있었습니다. 이는 검열을 금지하고 있는 우리나라 \n헌법에 위배되는 것일까요 합치되는 것일까요?",
		2,
		[2,2,2,1,1,2,2,2],
		[1,2,4,5,3,8,7,6],
		"어린이 헌법재판관 결정 결과 : 영화의 내용을 사전 검열 하는 것은 헌법에 위배된다고",
		[
			[
				"헌법 제21조 1항 :",
				"모든 국민은 언론·출판의 자유와 집회·결사의 자유를 가진다."
			],
			[
				"헌법 제21조 2항 :",
				"언론·출판에 대한 허가나 검열과 집회·결사에 대한 허가는\n인정되지 아니한다."
			]
		]
	],
	[
		"일하는 외국인 청년의 차별?",
		"우리나라에 연수를 와 일하고 있는 외국인 청년이 있습니다. 야근도 \n많이 하며 열심히 일했지만, 야근 수당을 받을 수 없었습니다. \n근로기준법이 있었지만 대한민국 근로자가 아니라는 이유였습니다. \n이는 외국인 산업연수생에 대한 차별로 이러한 행위는 우리나라 헌법에\n위배되는 것일까요 합치되는 것일까요?",
		2,
		[2,1,2,2,1,2,2,2],
		[3,7,8,6,2,5,4,1],
		"어린이 헌법재판관 결정 결과 : 일하는 외국인 청년을 차별하는 것은 헌법에 위배된다고",
		[
			[
				"헌법 제6조 2항 :",
				"외국인은 국제법과 조약이 정하는 바에 의하여\n그 지위가 보장된다."
			]
		]
	],
	[
		"대한민국 국적 영주권자들의 선거 참여?",
		"대한민국의 국적을 가지고 있지만 주민등록이 되어 있지 않은 \n영주권자들이 있습니다. 이들에게는 공직선거법이라는 것에 따라 \n선거에 참여할 수 있는 권리가 없는데요. 이는 대한민국 국민에게 \n선거권 및 평등권을 부여하고 있는 우리나라 헌법에 위배되는 것일까요\n합치되는 것일까요?",
		2,
		[2,2,2,1,1,2,2,2],
		[1,2,4,5,3,8,7,6],
		"어린이 헌법재판관 결정 결과 : 대한민국 국적 영주권자들의 선거 참여를 헌법에 위배된",
		[
			[
				"헌법 제11조 :",
				"모든 국민은 법 앞에 평등하다. 누구든지 성별·종교 또는\n사회적 신분에 의하여 정치적·경제적·사회적·문화적 생활의\n모든 영역에 있어 차별을 받지 아니한다."
			],
			[
				"헌법 제24조 :",
				"모든 국민은 법률이 정하는 바에 의하여 선거권을 가진다."
			]
		]
	],
	[
		"공무원의 특정 정치세력 지지?",
		"공무원은 국가에 대한 봉사자입니다. 정치적인 일들에 대해 중립의 \n지킬 의무도 있습니다. 하지만, 공무원도 국민의 한 사람으로 표현의 \n자유를 가지고 있기도 합니다. 만약 공무원이 특정 정치세력에 대해 \n공식적으로 지지를 표현하는 것을 처벌하는 법이 있다면, 이는 헌법에 \n위배되는 것일까요 합치되는 것일까요?",
		1,
		[2,1,2,1,1,1,1,1],
		[7,1,8,4,3,6,2,5],
		"어린이 헌법재판관 결정 결과 : 공무원이 특정 정치세력을 지지하는 것을 헌법에 합치된",
		[
			[
				"헌법 제7조 2항 :",
				"공무원의 신분과 정치적 중립성은 법률이 정하는 바에 \n의하여 보장된다."
			]
		]
	],
	[
		"과외 금지법!",
		"과외금지법이 있습니다. 과외 즉 사교육을 금지하는 법입니다.\n이로 인해 학생들은 학원과 같은 사교육 시설에 가서 공부를 할 수가 \n없고, 학원도 운영될 수 없습니다. 이 법은 교육권과 직업선택의 자유를 \n보장하는 우리나라 헌법에 비추어 헌법에 위배되는 것일까요 합치되는 \n것일까요?",
		2,
		[2,2,2,1,1,2,2,2],
		[1,2,4,5,3,8,7,6],
		"어린이 헌법재판관 결정 결과 : 과외를 금지하는 법이 헌법에 위배된다고 판단을 했기에",
		[
			[
				"헌법 제15조 :",
				"모든 국민은 직업선택의 자유를 가진다."
			],
			[
				"헌법 제31조 4항 :",
				"교육의 자주성·전문성·정치적 중립성 및 대학의 자율성은\n법률이 정하는 바에 의하여 보장된다."
			]
		]
	],
	[
		"학원 운영시간 제한!",
		"학원교습시간을 제한하는 법이 있습니다. 학원을 밤 10시까지만 \n운영하도록 하고 10시 이후에는 운영하지 못하도록 한 법입니다.\n자유롭게 늦게까지 학원에서 공부하고자 하는 학생들도 있겠지만, \n청소년들의  건강을 염려하여 만들어진 법입니다. 이 법은 헌법에\n위배되는 것일까요 합치되는 것일까요?",
		1,
		[1,1,2,1,2,1,1,1],
		[8,2,4,5,3,1,7,6],
		"어린이 헌법재판관 결정 결과 : 학원의 운영시간을 제한하는 것이 헌법에 합치된다고 판",
		[
			[
				"헌법 제10조 :",
				"모든 국민은 인간으로서의 존업과 가치를 가지며,\n행복을 추구할 권리를 가진다. 국가는 개인이 가지는\n불가침의 기본적 인권을 확인하고 이를 보장할 의무를 진다."
			],
			[
				"헌법 제34조 4항 :",
				"국가는 노인과 청소년의 복지향상을 위한 정책을 실시할\n의무를 진다."
			]
		]
	],
	[
		"청소년은 밤에 게임 금지!",
		"셧다운제라는 것이 있습니다. 16세 미만의 청소년에게는 심야시간 \n인터넷 게임을 제공하지 못하도록 한 법입니다. 우리나라 국민에게는 \n게임을 하고 게임을 공급할 자유가 있지만, 청소년들의 건강과 게임\n중독을  염려하여 만들어진 법입니다. 이 법은 헌법에 위배되는 \n것일까요 합치되는 것일까요?",
		1,
		[2,1,2,1,1,1,1,1],
		[7,1,8,4,3,6,2,5],
		"어린이 헌법재판관 결정 결과 : 청소년이 밤에 게임을 못하게 한 것은 헌법에 합치된다.",
		[
			[
				"헌법 제10조 :",
				"모든 국민은 인간으로서의 존업과 가치를 가지며,\n행복을 추구할 권리를 가진다. 국가는 개인이 가지는\n불가침의 기본적 인권을 확인하고 이를 보장할 의무를 진다."
			],
			[
				"헌법 제34조 4항 :",
				"국가는 노인과 청소년의 복지향상을 위한 정책을 실시할\n의무를 진다."
			]
		]
	],
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
		intro_logo = new Intro_logo();
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
		conv_start_btn = new Conv_start_btn();

		convIdx = 0;
		setTimeout(function(){
			introBtnCtrl(true);
		},1000);
	})();
	function methodPopupFunc(){
		method_dot.x = 376 + method_content.cutIdx * 14;
		if(method_content.cutIdx < 1){
			method_prev_btn.active = false;
			method_next_btn.active = true;
		}
		else if(method_content.cutIdx > 2){
			method_prev_btn.active = true;
			method_next_btn.active = false;
		}
		else{
			method_prev_btn.active = true;
			method_next_btn.active = true;
		}
		if(method_content.slideRight){
			if(method_content.cx < method_content.cutIdx * method_content.cw){
				method_content.cx += 20;
			}
			else{
				method_content.slideRight = false;
			}
		}
		else if(method_content.slideLeft){
			if(method_content.cx > method_content.cutIdx * method_content.cw){
				method_content.cx -= 20;
			}
			else{
				method_content.slideLeft = false;
			}
		}
	}
	function draw(){	
		intro_bg.draw();		intro_logo.draw();
		intro_start_btn.draw();	intro_method_btn.draw();
		intro_sound_btn.draw();	intro_layer.draw();
		/* 성별 선택 팝업 */
		if(select_bg.appear || select_bg.load){
			select_bg.draw();
			select_exit_btn.draw();select_start_btn.draw();
			select_male_btn.draw();select_female_btn.draw();
		}
		/* 게임 방법 팝업 */
		if(method_bg.appear || method_bg.load){
			method_bg.draw();		method_content.draw();
			method_exit_btn.draw();	method_prev_btn.draw();
			method_next_btn.draw();	method_dot.draw();
		}
		/* 대화 팝업 */
		conv_skip_btn.draw();
		conv_user_bg.draw();
		conv_pc_bg.draw();
		if((conv_user_bg.appear && conv_user_bg.load) || (conv_pc_bg.appear && conv_pc_bg.load)){
			conv_start_btn.draw();	conv_next_btn.draw();
		}
		conv_user_char.draw();		conv_pc_char.draw();
		if(conv_user_bg.appear	|| conv_user_bg.load){													
			conv_user_text.draw();
		}
		if(conv_pc_bg.appear	|| conv_pc_bg.load){													
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
	pageType = "main";
	let main_bg = new Main_bg(),
		main_top_bg = new Main_top_bg(),
		main_top_text = new Main_top_text(),
		main_char = new Main_char(),
		main_alert = new Main_alert(),
		main_num_quiz = new Main_num_quiz(),
		main_quiz_title = new Main_quiz_title(),
		main_quiz_body = new Main_quiz_body();
	(function(){
		main_exit_btn = new Main_exit_btn();			main_shadow = new Main_shadow();
		main_exit_bg = new Main_exit_bg();				main_exit_yes_btn = new Main_exit_yes_btn();
		main_exit_no_btn = new Main_exit_no_btn();		main_quiz_bg = new Main_quiz_bg();
		main_quiz_pro_btn = new Main_quiz_pro_btn();	main_quiz_con_btn = new Main_quiz_con_btn();
		main_quiz_more_btn = new Main_quiz_more_btn();	main_quiz_result = new Main_quiz_result();
		main_over_bg = new Main_over_bg();				main_over_home_btn = new Main_over_home_btn();
		main_result_bg = new Main_result_bg();			main_result_next_btn = new Main_result_next_btn();
		main_result_title = new Main_result_title();	main_clear_bg = new Main_clear_bg();
		main_clear_home_btn = new Main_clear_home_btn();main_clear_content = new Main_clear_content();
		main_relate_bg = new Main_relate_bg();			main_relate_close_btn = new Main_relate_close_btn();
		main_relate_title = new Main_relate_title();	main_relate_content = new Main_relate_content();

		popup = false;
		/* 문제 셔플 */	
		quizShuffleFunc();

		let time_info_arr = [
			[505,0],
			[520,3],
			[532,10],
			[544,0],
			[559,0],
		];
		let bubble_info_arr = [10, 100, 190, 280, 360, 440, 520, 610, 690];
		/* 상단 시간 1회 세팅 */
		for(let i=0;i<5;i++){
			time_Arr.push(new Main_num_time(time_info_arr[i][0], time_info_arr[i][1]));
		}
		/* 중간 말풍선 세팅 */
		for(let i=0;i<9;i++){
			main_bubble_Arr.push(new Main_bubble(bubble_info_arr[i]));
		}
		/* 결과 배열 세팅 */
		for(let i=0;i<4;i++){
			main_result_judge_Arr.push(new Main_result_judge(130 + 78 * i));
			main_result_correct_Arr.push(new Main_result_correct(130 + 78 * i));
			main_result_wrong_Arr.push(new Main_result_wrong(130 + 78 * i));
			main_result_content_Arr.push(new Main_result_content(i, 155 + 78 * i));
		}
		/* 게임 시작 */
		roundSet = true;
	})();
	function quizShuffleFunc(){
		let rand, tmp;
		for(let i=0;i<quiz_Arr.length;i++){	
			rand = Math.floor(Math.random()*i);
			tmp = quiz_Arr[i];
			quiz_Arr[i] = quiz_Arr[rand];
			quiz_Arr[rand] = tmp;
		}
	}
	function roundFunc(){
		if(roundSet){
			roundSetting();
			roundSet = false;
		}
	}
	function roundSetting(){
		if(quizIdx < 4){
			main_alert.cutSet(quizIdx);															// 단계 인덱스 경고창
			bubbleTime = time;																	// 말풍선 등장시간 계산용	
			objAppearFunc(false);
			setTimeout(function(){
				quizSettingFunc();
				timeControlFunc(true);
				objAppearFunc(true);		
			},1000);
		}
		else{
			objAppearFunc(false);
			gameResultPopupCtrl(true);
		}
	}
	function objAppearFunc(bool){
		quizAppearFunc(bool);
		if(bool){	
			main_alert.appear = !bool;	
			if(quizIdx <= 1){
				topAppearFunc(bool);
				main_bubble_Arr[8].globalAlpha = 1;												// 유저 말풍선 초기진입시 다름
				main_bubble_Arr[8].y = 130;														// 유저 말풍선 초기진입시 다름
			}	
			main_bubble_Arr[8].think = bool;
			main_bubble_Arr[8].appear = bool;
			main_exit_btn.appear = bool;
		}
		else{
			if(quizIdx < 4){
				audioPlay(3);
				main_alert.appear = !bool;
			}
			else{
				topAppearFunc(bool);
			}
			main_quiz_result.appear = bool;
			for(let i=0;i<main_bubble_Arr.length;i++){
				main_bubble_Arr[i].appear = bool;
			}
		}
	}
	function quizAppearFunc(bool){
		main_quiz_bg.appear = bool;
		main_quiz_more_btn.appear = bool;main_quiz_more_btn.clickable = bool;
		main_quiz_pro_btn.appear = bool;main_quiz_pro_btn.clickable = bool;
		main_quiz_con_btn.appear = bool;main_quiz_con_btn.clickable = bool;
		main_quiz_title.appear = bool;
		main_quiz_body.appear = bool;
	}
	function topAppearFunc(bool){
		main_top_bg.appear = bool;
		main_top_text.appear = bool;
		main_num_quiz.appear = bool;
		for(let i=0;i<time_Arr.length;i++){
			time_Arr[i].appear = bool;
		}
	}
	function quizSettingFunc(){
		quizIdx++;
		main_quiz_title.idx++;
		main_quiz_body.idx++;
		main_relate_title.idx++;
		main_relate_content.idx++;
		main_num_quiz.val = 4 - quizIdx;
	}
	function draw(){
		main_bg.draw();	
		// 상단바
		main_top_bg.draw();main_top_text.draw();main_exit_btn.draw();
		main_num_quiz.draw();
		for(let i=0;i<time_Arr.length;i++){
			time_Arr[i].draw();
		}
		// 중간 말풍선 및 캐릭터
		main_char.draw();
		for(let i=0;i<main_bubble_Arr.length;i++){
			main_bubble_Arr[i].draw();
		}
		// 단계시작 경고창
		main_alert.draw();
		// 퀴즈
		if(main_quiz_bg.appear || main_quiz_bg.load){
			main_quiz_bg.draw();
			main_quiz_more_btn.draw();
			main_quiz_pro_btn.draw();
			main_quiz_con_btn.draw();
			main_quiz_title.draw();
			main_quiz_body.draw();
			main_quiz_result.draw();
		}
		// 이후 팝업
		main_shadow.draw();
		// 관계법령 팝업
		if(main_relate_bg.appear || main_relate_bg.load){
			main_relate_bg.draw();
			main_relate_close_btn.draw();
			main_relate_title.draw();
			main_relate_content.draw();
		}
		// 종료 팝업
		if(main_exit_bg.appear || main_exit_bg.load){
			main_exit_bg.draw();
			main_exit_yes_btn.draw();
			main_exit_no_btn.draw();
		}
		// 게임결과 시 팝업
		if(main_result_bg.appear || main_result_bg.load){
			main_result_bg.draw();
			main_result_next_btn.draw();
			main_result_title.draw();
			for(let i=0;i<4;i++){
				main_result_wrong_Arr[i].draw();
				main_result_content_Arr[i].draw();
				main_result_judge_Arr[i].draw();
				main_result_correct_Arr[i].draw();
			}
		}
		// 게임클리어 시 팝업
		if(main_clear_bg.appear || main_clear_bg.load){
			main_clear_bg.draw();
			main_clear_home_btn.draw();
			main_clear_content.draw();
		}
		// 게임오버 시 팝업
		if(main_over_bg.appear || main_over_bg.load){
			main_over_bg.draw();
			main_over_home_btn.draw();
		}
	}
	mainLoop = function(){
		ctx.clearRect(0, 0, cvs.width, cvs.height);
		roundFunc();
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
		for(var i=0;i<conv_Arr[convIdx-1].length;i++){
			var txt = conv_Arr[convIdx-1][i];		
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
function relatePopupCtrl(bool){
	popup = bool;
	main_shadow.appear = bool;
	main_relate_bg.appear = bool;
	main_relate_close_btn.appear = bool;
	main_relate_title.appear = bool;
	main_relate_content.appear = bool;
}
function exitPopupCtrl(bool){
	popup = bool;
	main_shadow.appear = bool;
	main_exit_bg.appear = bool;
	main_exit_yes_btn.appear = bool;
	main_exit_no_btn.appear = bool;
	timeControlFunc(!bool);
}
function gameOverPopupCtrl(bool){
	popup = bool;
	main_shadow.appear = bool;
	main_over_bg.appear = bool;
	main_over_home_btn.appear = bool;
}
function gameResultPopupCtrl(bool){
	if(bool){
		// 제목 퍼센트 계산
		let percent = 0;
		for(let i=0;i<my_judge_Arr.length;i++){
			if(my_judge_Arr[i] == quiz_Arr[i][2]){
				percent += 25;
			}
		}
		main_result_title.percent = percent;
		// 정답 및 결과
		for(let i=0;i<4;i++){
			if(my_judge_Arr[i] == quiz_Arr[i][2]){
				main_result_correct_Arr[i].val = 0;
				main_result_wrong_Arr[i].on = false;
			}
			else{
				main_result_correct_Arr[i].val = 1;
				main_result_wrong_Arr[i].on = true;
			}			
			main_result_judge_Arr[i].val = quiz_Arr[i][2] - 1;
		}
	}
	popup = bool;
	main_shadow.appear = bool;
	main_result_bg.appear = bool;
	main_result_next_btn.appear = bool;
	main_result_title.appear = bool;
	for(let i=0;i<4;i++){
		main_result_wrong_Arr[i].appear = bool;
		main_result_judge_Arr[i].appear = bool;
		main_result_correct_Arr[i].appear = bool;
		main_result_content_Arr[i].appear = bool;
	}
}
function gameClearPopupCtrl(bool){
	popup = bool;
	main_shadow.appear = bool;
	main_clear_bg.appear = bool;
	main_clear_home_btn.appear = bool;
	main_clear_content.appear = bool;
}
function timeControlFunc(bool){
	if(bool){
		timeInterval = setInterval(function(){		
			// 시간 설정
			let timeMin = Math.floor(time / 60);
			let timeSec = time % 60;
			let timeSecFst = Math.floor(timeSec / 10);
			let timeSecSnd = timeSec % 10;
			time_Arr[1].val = timeMin;
			time_Arr[3].val = timeSecFst;
			time_Arr[4].val = timeSecSnd;
			// 버블 설정
			let idx = Math.floor((bubbleTime - time)/8)-1;
			if(((bubbleTime - time)%8 == 0) && (bubbleTime > time) && idx < 8){
				main_bubble_Arr[quiz_Arr[quizIdx-1][4][idx]-1].val = quiz_Arr[quizIdx-1][3][idx];
				main_bubble_Arr[quiz_Arr[quizIdx-1][4][idx]-1].appear = true;
			}
			time--;
			if(time < 0){
				gameOverPopupCtrl(true);
				clearInterval(timeInterval);
			}
		},1000);
	}
	else{
		clearInterval(timeInterval);
	}
}
function quizResultFunc(val){
	timeControlFunc(false);
	my_judge_Arr.push(val);
	main_bubble_Arr[8].val = val;
	main_bubble_Arr[8].think = false;
	main_quiz_pro_btn.clickable = false;
	main_quiz_con_btn.clickable = false;
	main_quiz_more_btn.clickable = false;
	main_exit_btn.appear = false;
	let idx = 0;
	let resultInterval = setInterval(function(){
		if(idx < main_bubble_Arr.length - 1){
			if(!main_bubble_Arr[idx].active){
				main_bubble_Arr[idx].val = quiz_Arr[quizIdx-1][3][idx];
				main_bubble_Arr[idx].appear = true;
			}
			idx++;
		}
		else{
			clearInterval(resultInterval);
			setTimeout(function(){
				main_quiz_result.val = quiz_Arr[quizIdx-1][2];
				main_quiz_result.appear = true;
				audioPlay(5);
			},1000);
			setTimeout(function(){
				roundSet = true;
			},4000);
		}
	},200);
}
function exitIntro(){
	clearInterval(typeInterval);
	introLoop = function(){return;}
	main();
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
			if(mouseCd(main_exit_btn)){
				if(main_exit_btn.clickable){
					$("canvas").css("cursor","pointer");
					main_exit_btn.mouseOver = true;
				}
			}
			else if(mouseCd(main_quiz_more_btn)){
				if(main_quiz_more_btn.clickable){
					$("canvas").css("cursor","pointer");
					main_quiz_more_btn.mouseOver = true;
				}
			}
			else if(mouseCd(main_quiz_pro_btn)){
				if(main_quiz_pro_btn.clickable){
					$("canvas").css("cursor","pointer");
					main_quiz_pro_btn.mouseOver = true;
				}
			}
			else if(mouseCd(main_quiz_con_btn)){
				if(main_quiz_con_btn.clickable){
					$("canvas").css("cursor","pointer");
					main_quiz_con_btn.mouseOver = true;
				}
			}
			else{
				main_exit_btn.mouseOver = false;		main_quiz_more_btn.mouseOver = false;
				main_quiz_pro_btn.mouseOver = false;	main_quiz_con_btn.mouseOver = false;
			}
		}
		else{
			if(main_exit_bg.appear && main_exit_bg.load){
				if(mouseCd(main_exit_yes_btn)){
					$("canvas").css("cursor","pointer");
					main_exit_yes_btn.mouseOver = true;	main_exit_no_btn.mouseOver = false;		
				}				
				else if(mouseCd(main_exit_no_btn)){
					$("canvas").css("cursor","pointer");
					main_exit_no_btn.mouseOver = true;	main_exit_yes_btn.mouseOver = false;		
				}
				else{
					main_exit_no_btn.mouseOver = false;	main_exit_yes_btn.mouseOver = false;	
				}
			}
			else if(main_over_bg.appear && main_over_bg.load){
				if(mouseCd(main_over_home_btn)){
					$("canvas").css("cursor","pointer");
					main_over_home_btn.mouseOver = true;
				}	
				else{
					main_over_home_btn.mouseOver = false;	
				}
			}
			else if(main_result_bg.appear && main_result_bg.load){
				if(mouseCd(main_result_next_btn)){
					$("canvas").css("cursor","pointer");
					main_result_next_btn.mouseOver = true;
				}	
				else{
					main_result_next_btn.mouseOver = false;	
				}
			}
			else if(main_clear_bg.appear && main_clear_bg.load){
				if(mouseCd(main_clear_home_btn)){
					$("canvas").css("cursor","pointer");
					main_clear_home_btn.mouseOver = true;
				}	
				else{
					main_clear_home_btn.mouseOver = false;	
				}
			}
			else if(main_relate_bg.appear && main_relate_bg.load){
				if(mouseCd(main_relate_close_btn)){
					$("canvas").css("cursor","pointer");
					main_relate_close_btn.mouseOver = true;
				}	
				else{
					main_relate_close_btn.mouseOver = false;	
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
			if(mouseCd(main_exit_btn)){
				if(main_exit_btn.clickable){
					audioPlay(1);
					main_exit_btn.mouseOver = false;
					exitPopupCtrl(true);
				}
			}
			else if(mouseCd(main_quiz_more_btn)){
				if(main_quiz_more_btn.clickable){
					audioPlay(1);
					main_quiz_more_btn.mouseOver = false;
					relatePopupCtrl(true);
				}
			}
			else if(mouseCd(main_quiz_pro_btn)){
				if(main_quiz_pro_btn.clickable){
					audioPlay(4);
					main_quiz_pro_btn.mouseOver = false;
					quizResultFunc(1);
				}
			}
			else if(mouseCd(main_quiz_con_btn)){
				if(main_quiz_con_btn.clickable){
					audioPlay(4);
					main_quiz_con_btn.mouseOver = false;
					quizResultFunc(2);
				}
			}
		}
		else{
			if(main_exit_bg.appear && main_exit_bg.load){
				if(mouseCd(main_exit_yes_btn)){
					main_exit_yes_btn.mouseOver = false;
					location.href = "index.html";
				}				
				else if(mouseCd(main_exit_no_btn)){
					audioPlay(1);
					main_exit_no_btn.mouseOver = false;
					exitPopupCtrl(false);		
				}
			}
			else if(main_over_bg.appear && main_over_bg.load){
				if(mouseCd(main_over_home_btn)){
					main_over_home_btn.mouseOver = false;
					location.href = "index.html";
				}	
			}
			else if(main_result_bg.appear && main_result_bg.load){
				if(mouseCd(main_result_next_btn)){
					audioPlay(1);
					main_result_next_btn.mouseOver = false;						
					let result = 0;
					for(let i=0;i<my_judge_Arr.length;i++){
						if(my_judge_Arr[i] == quiz_Arr[i][2]){
							result++;
						}
					}
					gameResultPopupCtrl(false);
					if(result < 3){
						audioPlay(6);
						gameOverPopupCtrl(true);
					}
					else{

						gameClearPopupCtrl(true);
					}
				}	
			}
			else if(main_clear_bg.appear && main_clear_bg.load){
				if(mouseCd(main_clear_home_btn)){
					main_clear_home_btn.mouseOver = false;
					_isPorted ? parent.gameResult() : location.href = "index.html";
				}	
			}
			else if(main_relate_bg.appear && main_relate_bg.load){
				if(mouseCd(main_relate_close_btn)){
					audioPlay(1);
					main_relate_close_btn.mouseOver = false;
					relatePopupCtrl(false);
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