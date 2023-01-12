/*
 *	회사명 : (주)씨에스랩
 *	작성자 : 최진우
 *	작성일 : 2020/10/08
 */
/* 캔버스 사이즈 설정 */
const cvs = document.getElementById("canvas"),													// 캔버스 객체 선언
	  ctx = cvs.getContext("2d");																// 캔버스 컨텍스트 선언
const device = connectIndexOfAgentFunc();														// 기기 확인용
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
let sourceLoadCnt = 0;																			// 소스 로드 갯수
const cvs_Arr = new Array(),																	// 이미지 프리 랜더링 용 캔버스 배열
	  ctx_Arr = new Array();																	// 이미지 프리 랜더링 용 컨텍스트 배열
const img_Arr = [	
	["load/loading.png"],																		// 0
	["intro/bg.png"],															
	["intro/btn_start.png"],
	["intro/btn_method.png"],
	["intro/btn_sound.png"],
	["intro/method/bg.png"],																	// 5
	["intro/method/btn_exit.png"],											
	["intro/method/content.png"],	
	["intro/method/btn_prev.png"],
	["intro/method/btn_next.png"],	
	["intro/method/dot.png"],																	// 10
	["main/stage1/bg.png"],													
	["main/stage2/bg.png"],	
	["main/stage3/bg.png"],	
	["main/stage4/bg.png"],	
	["main/stage5/bg.png"],																		// 15
	["main/stage1/land.png"],												
	["main/stage2/land.png"],
	["main/stage3/land.png"],
	["main/stage4/land.png"],
	["main/stage5/land.png"],																	// 20
	["main/mission/bg.png"],													
	["main/mission/number.png"],
	["main/mission/alert.png"],	
	["main/ui/readyGo.png"],		
	["main/ui/try.png"],																		// 25
	["main/ui/try_mark.png"],													
	["main/bottom/bg.png"],
	["main/bottom/mission.png"],		
	["main/bottom/number.png"],			
	["main/exit/bg.png"],																		// 30	
	["main/exit/btn_yes.png"],													
	["main/exit/btn_no.png"],			
	["main/exit/btn_exit.png"],
	["main/result/success/bg.png"],			
	["main/result/success/btn_next.png"],														// 35
	["main/result/over/bg.png"],												
	["main/result/over/btn_home.png"],
	["main/result/clear/bg.png"],											
	["main/result/clear/btn_home.png"],	
	["main/result/success/star.png"],															// 40
	["main/result/success/level.png"],											
	["main/asset/explode.png"],		
	["main/asset/success.png"],		
];
const aud_Arr	= [
	["bgm.mp3"],																				// 0
	["btn_click.mp3"],
	["shoot.mp3"],
	["hit.mp3"],
	["free.mp3"],
	["result.mp3"],
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
		(function(k){
			aud_Arr[k][1].onloadeddata = function(){
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
/* 오브젝트 선언 */
const Loading = function(){
	this.colCnt = 6;
	this.rowCnt = 2;
	this.sprCnt = 12;

	this.w = this.cw = cvs_Arr[0].width / this.colCnt;
	this.h = this.ch = cvs_Arr[0].height/ this.rowCnt;
	this.x = (absWidth - this.w) * 0.5;
	this.y = (absHeight - this.h) * 0.5;
	this.cx = 0;
	this.cy = 0;

	this.ani = 0;
	this.aniDelay = 3;
	this.aniFunc = function(){
		this.ani++;
		if(this.ani >= this.sprCnt * this.aniDelay){
			this.aniFinFunc();
		}
		this.cx = Math.floor((this.ani % (this.colCnt * this.aniDelay)) / this.aniDelay) * this.cw;
		this.cy = Math.floor(this.ani / (this.colCnt * this.aniDelay)) * this.ch;		
	};
	this.aniFinFunc = function(){
		this.ani = 0;
	};
	this.draw = function(){
		try{ 
			this.aniFunc();
			ctx.drawImage(cvs_Arr[0], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
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
	this.w = 175;
	this.h = 67;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 390;
	this.cy = 0;this.cw = 175;this.ch = 67;
	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 175;
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
	this.w = 175;
	this.h = 67;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 445;
	this.cy = 0;this.cw = 175;this.ch = 67;
	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 175;
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
	this.w = 70;
	this.h = 69;
	this.x = 700;
	this.y = 10;
	this.cy = 0;this.cw = 70;this.ch = 69;
	this.draw = function(){
		try{ 
			if(volume){
				this.cx = 0;
			}
			else{
				this.cx = 70;
			}
			ctx.drawImage(cvs_Arr[4], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Intro_layer = function(){
	this.x = 0;
	this.y = 0;
	this.w = 800;
	this.h = 530;
	this.globalAlpha = 0.5;
	this.draw = function(){
		try{ 
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
const Method_bg = function(){
	this.w = 689;
	this.h = 415;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 689;this.ch = 415;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[5], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Method_exit_btn = function(){
	this.w = 75;
	this.h = 74;
	this.x = 700;
	this.y = 30;
	this.cy = 0;this.cw = 75;this.ch = 74;
	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 75;
			}
			else{
				this.cx = 0;
			}
			ctx.drawImage(cvs_Arr[6], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Method_content = function(){
	this.w = 629;
	this.h = 277;
	this.x = 80;
	this.y = 130;
	this.cy = 0;this.cw = 629;this.ch = 277;
	this.val = 0;
	this.draw = function(){
		try{ 
			this.cx = this.val * 629;
			ctx.drawImage(cvs_Arr[7], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Method_prev_btn = function(){
	this.w = 98;
	this.h = 40;
	this.x = 280;
	this.y = 425;
	this.cy = 0;this.cw = 98;this.ch = 40;
	this.active = false;
	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseOver){
					this.cx = 98;
				}
				else{
					this.cx = 0;
				}
			}
			else{
				this.cx = 196;
			}
			ctx.drawImage(cvs_Arr[8], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Method_next_btn = function(){
	this.w = 98;
	this.h = 40;
	this.x = 430;
	this.y = 425;
	this.cy = 0;this.cw = 98;this.ch = 40;
	this.active = false;
	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.mouseOver){
					this.cx = 98;
				}
				else{
					this.cx = 0;
				}
			}
			else{
				this.cx = 196;
			}
			ctx.drawImage(cvs_Arr[9], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Method_dot = function(){
	this.x = 0;
	this.y = 440;
	this.w = 11;
	this.h = 10;
	this.cy = 0;this.cw = 11;this.ch = 10;
	this.active = false;
	this.draw = function(){
		try{ 
			if(this.active){
				this.cx = 0;
			}
			else{
				this.cx = 11;
			}
			ctx.drawImage(cvs_Arr[10], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Green_layer = function(){
	this.globalAlpha = 0;
	this.load = false;
	this.unload = false;
	this.draw = function(){
		try{ 
			if(this.load){
				if(this.globalAlpha < 0.95){
					this.globalAlpha += 0.05;
				}
				else{
					this.load = false;
					introLoop = function(){return;}
					main();
				}
			}
			if(this.unload){
				if(this.globalAlpha > 0.05){
					this.globalAlpha -= 0.05;
				}
				else{
					this.unload = false;
				}
			}
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
const Main_layer = function(){
	this.x = 0;
	this.y = 0;
	this.w = 800;
	this.h = 530;
	this.appear = true;
	this.globalAlpha = 0.5;
	this.draw = function(){
		try{ 
			if(this.appear){
				if(this.globalAlpha < 0.5){
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
			ctx.beginPath();
			ctx.rect(0, 0, cvs.width, cvs.height);
			ctx.fillStyle = "#FFF";ctx.fill();	
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
	this.idx = 0;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[11 + this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Main_land = function(){
	this.x = 0;
	this.y = 366;
	this.w = 800;
	this.h = 164;
	this.cx = 0;this.cy = 0;this.cw = 800;this.ch = 164;
	this.idx = 0;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[16 + this.idx], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Mission_bg = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 670;this.ch = 468;

	this.wFin = 670;
	this.wMax = this.wFin * 1.1;
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
					if(this.w < this.wMax){
						this.w += 20 * this.ratio_RE;
						this.h += 20 * this.ratio_RE * this.ratio_WH;
						this.x -= 10 * this.ratio_RE;
						this.y -= 10 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.wFin = 670;
					}
				}
				else{
					if(this.w > this.wFin){
						this.w -= 10 * this.ratio_RE;
						this.h -= 10 * this.ratio_RE * this.ratio_WH;
						this.x += 5 * this.ratio_RE;
						this.y += 5 * this.ratio_WH;
					}	
					else{
						this.load = true;
						this.open = false;
						this.w = this.wFin;
						this.opened = true;
					}
				}
			}
			if(this.close){				
				if(this.load){
					if(this.w < this.wMax){
						this.w += 10 * this.ratio_RE;
						this.h += 10 * this.ratio_RE * this.ratio_WH;
						this.x -= 5 * this.ratio_RE;
						this.y -= 5 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.wFin = 0;
					}
				}
				else{
					if(this.w > this.wFin){
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
const Mission_number = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cy = 0;this.cw = 191;this.ch = 191;

	this.wFin = 150;
	this.wMax = this.wFin * 1.1;
	this.ratio_WH = this.ch / this.cw;
	this.ratio_RE = 150 / 670;

	this.load = true;
	this.open = false;
	this.close = false;
	this.active = false;
	this.idx = 5;
	this.val = 0;
	this.draw = function(){
		try{ 
			if(this.active){
				if(this.idx == 0){
					this.cx = 0;this.cy = 0;
				}
				else if(this.idx == 1){
					this.cx = 191;this.cy = 0;
				}
				else if(this.idx == 2){
					this.cx = 382;this.cy = 0;
				}
				else if(this.idx == 3){
					this.cx = 0;this.cy = 191;
				}
				else if(this.idx == 4){
					this.cx = 191;this.cy = 191;
				}
			}
			else{
				this.cx = 382;this.cy = 191;
			}
			if(this.open){
				if(this.load){
					if(this.w < this.wMax){
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
						this.wFin = 150;
					}
				}
				else{
					if(this.w > this.wFin){
						this.w -= 10 * this.ratio_RE;
						this.h -= 10 * this.ratio_RE * this.ratio_WH;
						this.x += 5 * this.ratio_RE;
						this.y += 5 * this.ratio_RE * this.ratio_WH;		
					}	
					else{
						this.load = true;
						this.open = false;
						this.w = this.wFin;
					}
				}
			}
			if(this.close){				
				if(this.load){
					if(this.w < this.wMax){
						this.w += 10 * this.ratio_RE;
						this.h += 10 * this.ratio_RE * this.ratio_WH;
						this.x -= 5 * this.ratio_RE;
						this.y -= 5 * this.ratio_RE * this.ratio_WH;		
					}
					else{
						this.load = false;
						this.wFin = 0;
					}
				}
				else{
					if(this.w > this.wFin){
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
const Mission_alert = function(){
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
				if(this.x > cvs.width){
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
const Try_text = function(){
	this.x = 30;
	this.y = 10;
	this.w = 78;
	this.h = 34;
	this.cx = 0;this.cy = 0;this.cw = 78;this.ch = 34;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[25], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Try_mark = function(){
	this.x = 0;this.y = 5;
	this.w = 41;
	this.h = 41;
	this.cx = 0;this.cy = 0;this.cw = 41;this.ch = 41;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[26], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Bottom_bg = function(){
	this.x = 520;
	this.y = 472;
	this.w = 258;
	this.h = 56;
	this.cx = 0;this.cy = 0;this.cw = 258;this.ch = 56;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[27], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Bottom_mission = function(){
	this.x = 550;
	this.y = 490;
	this.w = 67;
	this.h = 31;
	this.cy = 0;this.cw = 67;this.ch = 31;
	this.idx = 0;
	this.draw = function(){
		try{ 
			this.cx = this.idx * 67;
			ctx.drawImage(cvs_Arr[28], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Bottom_score = function(){
	this.x = 0;
	this.y = 494;
	this.w = 18;
	this.h = 24;
	this.cy = 0;this.cw = 18;this.ch = 24;
	this.val = 0;
	this.draw = function(){
		try{ 
			this.cx = this.val * 18;
			ctx.drawImage(cvs_Arr[29], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Exit_bg = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 689;this.ch = 258;

	this.wFin = 689;
	this.wMax = this.wFin * 1.1;
	this.ratio_WH = this.ch / this.cw;
	this.ratio_RE = 689 / 689;

	this.active = false;
	this.load = true;
	this.open = false;
	this.close = false;
	this.draw = function(){
		try{ 
			if(this.open){
				if(this.load){
					if(this.w < this.wMax){
						this.w += 20 * this.ratio_RE;
						this.h += 20 * this.ratio_RE * this.ratio_WH;
						this.x -= 10 * this.ratio_RE;
						this.y -= 10 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.wFin = 689;
					}
				}
				else{
					if(this.w > this.wFin){
						this.w -= 10 * this.ratio_RE;
						this.h -= 10 * this.ratio_RE * this.ratio_WH;
						this.x += 5 * this.ratio_RE;
						this.y += 5 * this.ratio_WH;
					}	
					else{
						this.load = true;
						this.open = false;
						this.w = this.wFin;
					}
				}
			}
			if(this.close){				
				if(this.load){
					if(this.w < this.wMax){
						this.w += 10 * this.ratio_RE;
						this.h += 10 * this.ratio_RE * this.ratio_WH;
						this.x -= 5 * this.ratio_RE;
						this.y -= 5 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.wFin = 0;
					}
				}
				else{
					if(this.w > this.wFin){
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
			ctx.drawImage(cvs_Arr[30], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Exit_yes_btn = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cy = 0;this.cw = 148;this.ch = 54;

	this.wFin = 148;
	this.wMax = this.wFin * 1.1;
	this.ratio_WH = this.ch / this.cw;
	this.ratio_RE = 148 / 689;

	this.mouseOver = false;
	this.load = true;
	this.open = false;
	this.close = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 148;
			}
			else{
				this.cx = 0;
			}
			if(this.open){
				if(this.load){
					if(this.w < this.wMax){
						this.w += 20 * this.ratio_RE;
						this.h += 20 * this.ratio_RE * this.ratio_WH;
						this.x -= 20 * this.ratio_RE;
						this.y += 20 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.wFin = 148;
					}
				}
				else{
					if(this.w > this.wFin){
						this.w -= 10 * this.ratio_RE;
						this.h -= 10 * this.ratio_RE * this.ratio_WH;
						this.x += 10 * this.ratio_RE;
						this.y -= 15 * this.ratio_RE * this.ratio_WH;
					}	
					else{
						this.load = true;
						this.open = false;
						this.w = this.wFin;
					}
				}
			}
			if(this.close){				
				if(this.load){
					if(this.w < this.wMax){
						this.w += 10 * this.ratio_RE;
						this.h += 10 * this.ratio_RE * this.ratio_WH;
						this.x -= 10 * this.ratio_RE;
						this.y += 15 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.wFin = 0;
					}
				}
				else{
					if(this.w > this.wFin){
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
			ctx.drawImage(cvs_Arr[31], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Exit_no_btn = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cy = 0;this.cw = 148;this.ch = 54;

	this.wFin = 148;
	this.wMax = this.wFin * 1.1;
	this.ratio_WH = this.ch / this.cw;
	this.ratio_RE = 148 / 689;

	this.mouseOver = false;
	this.load = true;
	this.open = false;
	this.close = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 148;
			}
			else{
				this.cx = 0;
			}
			if(this.open){
				if(this.load){
					if(this.w < this.wMax){
						this.w += 20 * this.ratio_RE;
						this.h += 20 * this.ratio_RE * this.ratio_WH;
						this.x += 1 * this.ratio_RE;
						this.y += 20 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.wFin = 148;
					}
				}
				else{
					if(this.w > this.wFin){
						this.w -= 10 * this.ratio_RE;
						this.h -= 10 * this.ratio_RE * this.ratio_WH;
						this.x -= 1 * this.ratio_RE;
						this.y -= 15 * this.ratio_RE * this.ratio_WH;
					}	
					else{
						this.load = true;
						this.open = false;
						this.w = this.wFin;
					}
				}
			}
			if(this.close){				
				if(this.load){
					if(this.w < this.wMax){
						this.w += 10 * this.ratio_RE;
						this.h += 10 * this.ratio_RE * this.ratio_WH;
						this.x -= 1 * this.ratio_RE;
						this.y += 15 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.wFin = 0;
					}
				}
				else{
					if(this.w > this.wFin){
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
			ctx.drawImage(cvs_Arr[32], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Exit_btn = function(){
	this.w = 75;
	this.h = 74;
	this.x = 720;
	this.y = 10;
	this.cy = 0;this.cw = 75;this.ch = 74;
	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 75;
			}
			else{
				this.cx = 0;
			}
			ctx.drawImage(cvs_Arr[33], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Success_bg = function(){
	this.w = 674;
	this.h = 390;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 20;
	this.cx = 0;this.cy = 0;this.cw = 674;this.ch = 394;
	this.active = false;
	this.closed = false;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[34], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Success_star = function(){
	this.w = 148;
	this.h = 44;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 200;
	this.cx = 444;this.cy = 0;this.cw = 148;this.ch = 44;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[40], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Success_level = function(){	
	this.w = 71;
	this.h = 29;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = 260;
	this.cy = 0;this.cw = 71;this.ch = 29;
	this.draw = function(){
		try{ 
			this.cx = (stage - 1) * 71;
			ctx.drawImage(cvs_Arr[41], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Success_content = function(){
	this.draw = function(){
		try{ 
			ctx.textAlign = "center";	
			ctx.font = "bold "+ (22 * hR)+"px '나눔스퀘어'";ctx.fillStyle = "red";
			ctx.fillText(score, 400 * wR, 315 * hR);
		}
		catch(e){}
	};
};
const Success_next_btn = function(){
	this.w = 145;
	this.h = 51;
	this.x = 328;
	this.y = 340;
	this.cx = 0;this.cy = 0;this.cw = 145;this.ch = 51;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[35], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Over_bg = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cx = 0;this.cy = 0;this.cw = 674;this.ch = 331;

	this.wFin = 674;
	this.wMax = this.wFin * 1.1;
	this.ratio_WH = this.ch / this.cw;
	this.ratio_RE = 674 / 674;

	this.active = false;
	this.load = true;
	this.open = false;
	this.close = false;
	this.draw = function(){
		try{ 
			if(this.open){
				if(this.load){
					if(this.w < this.wMax){
						this.w += 20 * this.ratio_RE;
						this.h += 20 * this.ratio_RE * this.ratio_WH;
						this.x -= 10 * this.ratio_RE;
						this.y -= 12.5 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.wFin = 674;
					}
				}
				else{
					if(this.w > this.wFin){
						this.w -= 10 * this.ratio_RE;
						this.h -= 10 * this.ratio_RE * this.ratio_WH;
						this.x += 5 * this.ratio_RE;
						this.y += 5 * this.ratio_WH;
					}	
					else{
						this.load = true;
						this.open = false;
						this.w = this.wFin;
					}
				}
			}
			if(this.close){				
				if(this.load){
					if(this.w < this.wMax){
						this.w += 10 * this.ratio_RE;
						this.h += 10 * this.ratio_RE * this.ratio_WH;
						this.x -= 5 * this.ratio_RE;
						this.y -= 5 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.wFin = 0;
					}
				}
				else{
					if(this.w > this.wFin){
						this.w -= 20 * this.ratio_RE;
						this.h -= 20 * this.ratio_RE * this.ratio_WH;
						this.x += 10 * this.ratio_RE;
						this.y += 12.5 * this.ratio_WH;
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
			ctx.drawImage(cvs_Arr[36], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Over_content = function(){
	this.x = 400;
	this.fontSize_top = 0;
	this.fontSize_btm = 0;
	this.ratio_RE1 = 25 / 674;
	this.ratio_RE2 = 15 / 674;
	this.y_top = 240;
	this.y_btm = 280;
	this.draw = function(){
		try{ 
			if(this.fontSize_top < 25){
				this.fontSize_top += 20 * this.ratio_RE1;
			}
			if(this.fontSize_btm < 15){
				this.fontSize_btm += 20 * this.ratio_RE2;
			}
			ctx.textAlign = "center";	
			ctx.font = "bold "+this.fontSize_top+"px '나눔스퀘어'";ctx.fillStyle = "#72421E";
			ctx.fillText("당신의 점수는 "+score+"점 입니다.", this.x * wR, this.y_top * hR);
			ctx.font = "bold "+this.fontSize_btm+"px '나눔스퀘어'";ctx.fillStyle = "#000";
			ctx.fillText("안타깝네요. 좀더 노력해 보세요!", this.x * wR, this.y_btm * hR);
		}
		catch(e){}
	};
};
const Over_home_btn = function(){
	this.w = 0;this.h = 0;
	this.x = absWidth * 0.5 - this.w * 0.5;
	this.y = absHeight * 0.5 - this.h * 0.5;
	this.cy = 0;this.cw = 148;this.ch = 54;

	this.wFin = 148;
	this.wMax = this.wFin * 1.1;
	this.ratio_WH = this.ch / this.cw;
	this.ratio_RE = 148 / 674;

	this.load = true;
	this.open = false;
	this.close = false;
	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 148;
			}
			else{
				this.cx = 0;
			}
			if(this.open){
				if(this.load){
					if(this.w < this.wMax){
						this.w += 20 * this.ratio_RE;
						this.h += 20 * this.ratio_RE * this.ratio_WH;
						this.x -= 10 * this.ratio_RE;
						this.y += 20 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.wFin = 148;
					}
				}
				else{
					if(this.w > this.wFin){
						this.w -= 10 * this.ratio_RE;
						this.h -= 10 * this.ratio_RE * this.ratio_WH;
						this.x += 5 * this.ratio_RE;
						this.y -= 15 * this.ratio_RE * this.ratio_WH;
					}	
					else{
						this.load = true;
						this.open = false;
						this.w = this.wFin;
					}
				}
			}
			if(this.close){				
				if(this.load){
					if(this.w < this.wMax){
						this.w += 10 * this.ratio_RE;
						this.h += 10 * this.ratio_RE * this.ratio_WH;
						this.x -= 5 * this.ratio_RE;
						this.y += 15 * this.ratio_RE * this.ratio_WH;
					}
					else{
						this.load = false;
						this.wFin = 0;
					}
				}
				else{
					if(this.w > this.wFin){
						this.w -= 20 * this.ratio_RE;
						this.h -= 20 * this.ratio_RE *this.ratio_WH;
						this.x += 10 * this.ratio_RE;
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
			ctx.drawImage(cvs_Arr[37], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Clear_bg = function(){
	this.w = 685;
	this.h = 370;
	this.x = 60;
	this.y = 28;
	this.cx = 0;this.cy = 0;this.cw = 685;this.ch = 372;

	this.active = false;
	this.draw = function(){
		try{ 
			ctx.drawImage(cvs_Arr[38], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Clear_content = function(){
	this.x = 400;
	this.y = 250;
	this.draw = function(){
		try{ 
			ctx.textAlign = "center";	
			if(loggedIn){
				ctx.font = "bold "+(20 * hR)+"px '나눔스퀘어'";ctx.fillStyle = "#000";
				ctx.fillText(userId+"님!!", this.x * wR, this.y * hR);
				ctx.fillText("게임 '헌법 기본권 지키기'를 완료하였습니다.", this.x, (this.y + 30) * hR);
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
const Clear_home_btn = function(){
	this.w = 148;
	this.h = 53;
	this.x = 326;
	this.y = 330;
	this.cy = 0;this.cw = 148;this.ch = 54;

	this.mouseOver = false;
	this.draw = function(){
		try{ 
			if(this.mouseOver){
				this.cx = 148;
			}
			else{
				this.cx = 0;
			}
			ctx.drawImage(cvs_Arr[39], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
		}
		catch(e){}
	};
};
const Eff_Explode = function(){
	this.x = 0;
	this.y = 0;
	this.w = 83;
	this.h = 84;
	this.cy = 0;this.cw = 83;this.ch = 84;
	this.ani = 0;
	this.on = true;
	this.draw = function(){
		try{ 
			if(this.on){
				if(this.ani < 14 * 3){
					this.cx = Math.floor(this.ani / 3) * 83;
					this.ani++;
				}
				else{
					this.on = false;
				}
				ctx.drawImage(cvs_Arr[42], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
		}
		catch(e){}
	};
};
const Eff_Success = function(){
	this.x = 0;
	this.y = 0;
	this.w = 90;
	this.h = 90;
	this.cw = 180;this.ch = 180;
	this.ani = 0;
	this.on = true;
	this.draw = function(){
		try{ 
			if(this.on){
				if(this.ani < 8 * 3){
					this.cx = Math.floor(this.ani / 3) % 4 * 180;
					this.cy = Math.floor(this.ani / 12) * 180;
					this.ani++;
				}
				else{
					this.on = false;
				}
				ctx.drawImage(cvs_Arr[43], this.cx, this.cy, this.cw, this.ch, this.x * wR, this.y * hR, this.w * wR, this.h * hR);
			}
		}
		catch(e){}
	};
};
let intro_start_btn = new Object(),
	intro_method_btn = new Object(),
	intro_sound_btn = new Object(),
	method_bg = new Object(),
	method_exit_btn = new Object(),
	method_content = new Object(),
	method_prev_btn = new Object(),
	method_next_btn = new Object(),
	green_layer = new Object();
let main_layer = new Object(),
	exit_bg = new Object(),
	exit_yes_btn = new Object(),
	exit_no_btn = new Object(),
	exit_btn = new Object(),
	success_bg = new Object(),
	success_star = new Object(),
	success_level = new Object(),
	success_content = new Object(),
	success_next_btn = new Object(),
	over_bg = new Object(),
	over_content = new Object(),
	over_home_btn = new Object(),
	clear_bg = new Object(),
	clear_content = new Object(),
	clear_home_btn = new Object();
/* 변수 선언 */
let loggedIn = true;
let userId = "jihn011258@naver.com";
let	loadLoop, introLoop, mainLoop;																// 애니메이션 콜백용
let mouseX, mouseY;																				// 마우스 좌표 저장용
let volume = 1;																					// 전체 사운드 on/off
let popup = false;																				// 팝업 열려있는동안 백그라운드 마우스 이벤트 금지용
let pageType = "";																				// 페이지 종류 저장용
let stage = 0;																					// 레벨
let attempt = 3;																				// 목숨
let score = 0;																					// 현재 점수
let score_tmp = 0;																				// 올라갈 점수
let mission_num = 0;
let pointer = false;																			// 공 마우스 포인터용
let obj_Arr = new Array();
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
	let intro_layer = new Intro_layer();
	let method_dot_arr = new Array();
	(function(){	
		intro_start_btn = new Intro_start_btn();
		intro_method_btn = new Intro_method_btn();
		intro_sound_btn = new Intro_sound_btn();
		method_bg = new Method_bg();
		method_exit_btn = new Method_exit_btn();
		method_content = new Method_content();
		method_prev_btn = new Method_prev_btn();
		method_next_btn = new Method_next_btn();
		green_layer = new Green_layer();

		for(let i=0;i<3;i++){
			method_dot_arr.push(new Method_dot());
			method_dot_arr[i].x = (382 + i * 15);
		}		
	})();	
	function methodFunc(){
		if(method_content.val < 1){
			method_prev_btn.active = false;
			method_next_btn.active = true;
		}
		else if(method_content.val > 1){
			method_next_btn.active = false;
			method_prev_btn.active = true;
		}
		else{
			method_prev_btn.active = true;
			method_next_btn.active = true;
		}
		for(let i=0;i<method_dot_arr.length;i++){
			if(i == method_content.val){
				method_dot_arr[i].active = true;
			}
			else{
				method_dot_arr[i].active = false;
			}
		}		
	}
	function draw(){	
		intro_bg.draw();
		intro_start_btn.draw();
		intro_method_btn.draw();
		intro_sound_btn.draw();
		green_layer.draw();
		if(method_bg.active){
			intro_layer.draw();
			method_bg.draw();
			method_exit_btn.draw();
			method_content.draw();
			method_prev_btn.draw();
			method_next_btn.draw();
			for(let i=0;i<method_dot_arr.length;i++){
				method_dot_arr[i].draw();
			}		
		}
	}
	introLoop = function(){
		aud_Arr[0][1].play();
		ctx.clearRect(0, 0, cvs.width, cvs.height);			
		draw();
		methodFunc();
		requestAnimFrame(introLoop);															// 게임 애니 시작
	};
	introLoop();
}
function main(){
	pageType = "main";		
	let main_bg = new Main_bg();
	let main_land = new Main_land();
	let bottom_bg = new Bottom_bg();
	let bottom_mission = new Bottom_mission();
	let readyGo = new ReadyGo();
	let mission_bg = new Mission_bg();
	let mission_alert = new Mission_alert();
	let try_text = new Try_text();
	let mission_number_arr = new Array();	
	let try_mark_arr = new Array();
	let score_arr = new Array();
	let mission_arr = new Array(1, 1, 1, 2, 3);
	// 인게임 요소
	let world, ball, basket_front, basket_back, fly;
	(function(){
		main_layer = new Main_layer();
		exit_bg = new Exit_bg();
		exit_yes_btn = new Exit_yes_btn();
		exit_no_btn = new Exit_no_btn();
		exit_btn = new Exit_btn();
		success_bg = new Success_bg();
		success_star = new Success_star();
		success_level = new Success_level();
		success_content = new Success_content();
		success_next_btn = new Success_next_btn();
		over_bg = new Over_bg();
		over_content = new Over_content();
		over_home_btn = new Over_home_btn();
		clear_bg = new Clear_bg();
		clear_content = new Clear_content();
		clear_home_btn = new Clear_home_btn();
		/* 레벨 세팅 */
		for(let i=0;i<5;i++){
			mission_number_arr.push(new Mission_number());
			mission_number_arr[i].idx = i;
		}
		/* 목숨 세팅 */
		for(let i=0;i<3;i++){
			try_mark_arr.push(new Try_mark());
			try_mark_arr[i].x = (120 + 45 * i);
		}
		for(let i=0;i<4;i++){
			obj_Arr.push(new Array());
		}
		/* 인게임판 생성 */
		world = boxbox.createWorld(cvs);
		/* 처음 시작 */
		green_layer.unload = true;
		stageSettingFunc();
	})();	
	function stageSettingFunc(){
		audioPlay(5);
		stage++;
		mission_num = 0;
		attempt = 3;
			
		if(stage > 1){
			bottom_mission.idx++;
			boxReSet(true);
			boxInitSet();
			missionPopupFunc(true);
		}
		else{
			boxInitSet();
			setTimeout(function(){
				missionPopupFunc(true);
			},500);
		}
	}
	function boxInitSet(){
		popup = true;
		let bgConfig = {
			name: "bg",
			shape: "square",
			type: "static",
			x: wR * 400/30,
			width: wR * 800/30,
			imageStretchToFit: true,
			active: false
		};
		let borderConfig = {
			name: "border",
			shape: "square",
			type: "static",
			borderWidth: 0,
		};
		let boxConfig = {
			name: "left_box",
			shape: "square",
			type: "static",
			active: false,
			imageStretchToFit: true
		};
		obj_Arr[0].push(world.createEntity(bgConfig, {
			image: "./image/main/stage"+stage+"/bg.png",
			y: hR * 265/30,
			height: hR * 530/30
		}));
		obj_Arr[0].push(world.createEntity(bgConfig, {
			image: "./image/main/stage"+stage+"/land.png",
			y: hR * 448/30,
			height: hR * 164/30
		}));
		obj_Arr[0].push(world.createEntity(borderConfig, {
			x: wR * 6.6,
			y: hR * 0,
			width: wR * 50,
			height: hR * 0
		}));
		obj_Arr[0].push(world.createEntity(borderConfig, {
			x: wR * 6.6,
			y: hR * 15.5,
			width: wR * 50,
			height: hR * 0
		}));
		obj_Arr[0].push(world.createEntity(borderConfig, {
			x: wR * -1/30,
			y: hR * 0,
			width: wR * 1/30,
			height: hR * 50
		}));
		obj_Arr[0].push(world.createEntity(borderConfig, {
			x: wR * 799/30,
			y: hR * 0,	
			width: wR * 1/30,
			height: hR * 50
		}));
		obj_Arr[0].push(world.createEntity(boxConfig, {
			x: wR * 120/30,
			y: hR * 405/30,
			width: wR * 90/30,
			height: hR * 90/30,
			image: "./image/main/asset/left_box_1.png"
		}));
		obj_Arr[0].push(world.createEntity(boxConfig, {
			x: wR * 135/30,
			y: hR * 440/30,
			width: wR * 65/30,
			height: hR * 55/30,
			image: "./image/main/asset/left_box_2.png"
		}));
		boxLeftSet();
		boxRightSet();
	}
	function boxLeftSet(){
		let leftConfig = {
			name: "left",
			shape: "square",
			type: "static",
			active: false,
			imageOffsetY: hR * -0.5,
			imageStretchToFit: true
		};
		basket_back = world.createEntity(leftConfig, {
			x: wR * 125/30,
			y: hR * 340/30,
			width: wR * 45/30,
			height: hR * 22.5/30,
			image: "./image/main/asset/basket_back.png"
		});
		ball = world.createEntity({
			name: "ball",
			shape: "circle",
			type: "dynamic",
			image: "./image/main/asset/ball.png",
			x: wR * 115/30,
			y: hR * 320/30,
			radius: wR * 15/30,
			imageStretchToFit: true
		});
		ball.pin(wR * ball.position().x, 0);
		ball.mouseDraggable("enable");
		ball.onMousemove(function(e){
			if(this.isMouseDraggable()){
				pointer = true;
			}
		});
		ball.onMouseout(function(e){
			pointer = false;
		});
		ball.mouseDraggable({
			type : 'eventDrag',
			start: function(e,mouseDraggableInfos){
				if(!popup){
					this.onRender(boxLineFunc);
				}
			},
			drag: function(e,mouseDraggableInfos){
				if(!popup){
					if(this.isMouseDraggable()){
						pointer = true;
					}
					this._canvasPointerInfos = this._world.canvasPositionAt(mouseDraggableInfos.position.x,mouseDraggableInfos.position.y);
					
					// 당길 때 거리 계산
					let posiDistance = Math.sqrt(Math.pow(mouseDraggableInfos.position.x-this.position().x,2) + Math.pow(mouseDraggableInfos.position.y-this.position().y,2));
					if(posiDistance >= 1.5){posiDistance = 1.5;}			// 최대 당기는 거리 : 1.5
					let denominateX = Math.pow(mouseDraggableInfos.position.y-this.position().y,2) / Math.pow(mouseDraggableInfos.position.x-this.position().x,2) + 1;
					let denominateY = Math.pow(mouseDraggableInfos.position.x-this.position().x,2) / Math.pow(mouseDraggableInfos.position.y-this.position().y,2) + 1;
					let posiX = posiDistance/Math.sqrt(denominateX);
					let posiY = posiDistance/Math.sqrt(denominateY);				
					// 당기는 방향 계산
					let dirX, dirY;
					if(mouseDraggableInfos.position.x-this.position().x >= 0){
						dirX = 1;
					}
					else{
						dirX = -1;
					}
					if(mouseDraggableInfos.position.y-this.position().y >= 0){
						dirY = 1;
					}
					else{
						dirY = -1;
					}
					posiX *= dirX;posiY *= dirY;
					// 이미지 오프셋 설정
					this.imageOffsetX(posiX);
					this.imageOffsetY(posiY);
					basket_front.imageOffsetX(posiX);
					basket_front.imageOffsetY(-0.5+posiY);
					basket_back.imageOffsetX(posiX);
					basket_back.imageOffsetY(-0.5+posiY);
				}
			},
			stop: function(e,mouseDraggableInfos){
				if(!popup){
					audioPlay(2);
					this.unPin();
					pointer = false;
					ball.imageOffsetX(0);ball.imageOffsetY(0);
					basket_front.imageOffsetX(0);basket_front.imageOffsetY(-0.5);
					basket_back.imageOffsetX(0);basket_back.imageOffsetY(-0.5);

					this._canvasPointerInfos = null;
					this.mouseDraggable("disable");
					this.applyImpulse(21,this.position().x-mouseDraggableInfos.position.x, this.position().y-mouseDraggableInfos.position.y);
					setTimeout(function(){
						if(mission_num >= mission_arr[stage - 1]){
							if(stage < 5){
								successPopupFunc(true);
							}
							else{
								clearPopupFunc(true);
							}
						}
						else{
							if(attempt > 1){
								boxReSet(false);
								boxLeftSet();
								attempt--;
							}
							else{
								overPopupFunc(true);
							}	
						}
					},7500);
				}
			}
		});	
		ball.touchDraggable("enable");	
		ball.touchDraggable({
			type : 'eventDrag',
			start: function(e,touchDraggableInfos){
				alert("@");
				if(!popup){
					this.onRender(boxLineFunc);
				}
			},
			drag: function(e,touchDraggableInfos){
				alert("#");
				if(!popup){
					this._canvasPointerInfos = this._world.canvasPositionAt(wR * touchDraggableInfos.position.x,hR * touchDraggableInfos.position.y);
					
					// 당길 때 거리 계산
					let posiDistance = Math.sqrt(Math.pow(wR * (touchDraggableInfos.position.x-this.position().x),2) + Math.pow(hR * (touchDraggableInfos.position.y-this.position().y),2));
					if(posiDistance >= 1.5){posiDistance = 1.5;}			// 최대 당기는 거리 : 1.5
					let denominateX = Math.pow(hR * (touchDraggableInfos.position.y-this.position().y),2) / Math.pow(wR * (touchDraggableInfos.position.x-this.position().x),2) + 1;
					let denominateY = Math.pow(wR * (touchDraggableInfos.position.x-this.position().x),2) / Math.pow(hR * (touchDraggableInfos.position.y-this.position().y),2) + 1;
					let posiX = posiDistance/Math.sqrt(denominateX);
					let posiY = posiDistance/Math.sqrt(denominateY);				
					// 당기는 방향 계산
					let dirX, dirY;
					if(wR * (touchDraggableInfos.position.x-this.position().x) >= 0){
						dirX = 1;
					}
					else{
						dirX = -1;
					}
					if(hR * (touchDraggableInfos.position.y-this.position().y) >= 0){
						dirY = 1;
					}
					else{
						dirY = -1;
					}
					posiX *= dirX;posiY *= dirY;
					// 이미지 오프셋 설정
					this.imageOffsetX(wR * posiX);
					this.imageOffsetY(hR * posiY);
					basket_front.imageOffsetX(wR * posiX);
					basket_front.imageOffsetY(hR * (-0.5+posiY));
					basket_back.imageOffsetX(wR * posiX);
					basket_back.imageOffsetY(hR * (-0.5+posiY));
				}
			},
			stop: function(e,touchDraggableInfos){
				if(!popup){
					audioPlay(2);
					this.unPin();
					pointer = false;
					ball.imageOffsetX(0);ball.imageOffsetY(0);
					basket_front.imageOffsetX(0);basket_front.imageOffsetY(hR * -0.5);
					basket_back.imageOffsetX(0);basket_back.imageOffsetY(hR * -0.5);

					this._canvasPointerInfos = null;
					this.touchDraggable("disable");
					this.applyImpulse(21,wR * (this.position().x-touchDraggableInfos.position.x), hR * (this.position().y-touchDraggableInfos.position.y));
					setTimeout(function(){
						if(mission_num >= mission_arr[stage - 1]){
							if(stage < 5){
								successPopupFunc(true);
							}
							else{
								clearPopupFunc(true);
							}
						}
						else{
							if(attempt > 1){
								boxReSet(false);
								boxLeftSet();
								attempt--;
							}
							else{
								overPopupFunc(true);
							}	
						}
					},7500);
				}
			}
		});	



		wood = world.createEntity(leftConfig, {
			x: wR * 140/30,
			y: hR * 335/30,
			width: wR * 40/30,
			height: hR * 60/30,
			imageOffsetY: 0,
			image: "./image/main/asset/wood.png"
		});
		basket_front = world.createEntity(leftConfig, {
			x: wR * 115/30,
			y: hR * 345/30,
			width: wR * 32/30,
			height: hR * 18/30,
			image: "./image/main/asset/basket_front.png"
		});
	}
	function boxRightSet(){
		let boxConfig = {
			name: "right_box",shape: "square",type: "dynamic",imageStretchToFit: true
		};
		let pumpkinConfig = {
			name: "pumpkin",shape: "square",type: "dynamic",imageStretchToFit: true
		};
		let personFlyConfig = {
			shape: "square",type: "dynamic",imageStretchToFit: true,fixedRotation: true,active: false,
			width: wR * 60/30,
			height: hR * 120/30,
			init: function(){
				let _this = this;
				_this.image("./image/main/asset/person"+_this.name()+"_out.png");
				// 그림 이동
				setInterval(function(){
					_this.imageOffsetX(_this.imageOffsetX() - 1/30);
					_this.imageOffsetY(_this.imageOffsetY() - 1/30);
				}, 1000 / 60);
				// 요소 제거
				setTimeout(function(){
					_this.destroy();
					mission_num++;
				},3000);
			},				
		};
		let personConfig = {
			shape: "square",type: "dynamic",imageStretchToFit: true,
			init: function(){
				let _this = this;
				_this.image("./image/main/asset/person"+_this.name()+"_in.png");
			}
		};
		if(stage == 1){
			// 박스 1줄(3단)
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: wR * 660/30,
				y: hR * 440/30,
				width: wR * 60/30,
				height: hR * 60/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 60/30, 60/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: wR * 667.5/30,
				y: hR * 385/30,
				width: wR * 50/30,
				height: hR * 50/30,
				image: "./image/main/asset/right_box_2.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 50/30, 50/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: wR * 675/30,
				y: hR * 337.5/30,
				width: wR * 45/30,
				height: hR * 45/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 45/30, 45/30);
					}
				}
			}));
			// 사람(1명)
			obj_Arr[2].push(world.createEntity(personConfig,{
				name: "1",
				x: wR * 667.5/30,
				y: hR * 277.5/30,
				width: wR * 50/30,
				height: hR * 75/30,		
				onImpact: function(entity, normalForce){
					if(normalForce > 10){
						boxPersonExplode(this, 50/60, 75/60, personFlyConfig);
					}					
				}
			}));
		}
		else if(stage == 2){
			// 박스 1줄(1단)
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 600/30,
				y: 440/30,
				width: 60/30,
				height: 60/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 60/30, 60/30);
					}
				}
			}));
			// 박스 2줄(3단)
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 690/30,
				y: 420/30,
				width: 45/30,
				height: 45/30,
				image: "./image/main/asset/right_box_2.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 45/30, 45/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 700/30,
				y: 405/30,
				width: 45/30,
				height: 45/30,
				image: "./image/main/asset/right_box_2.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 45/30, 45/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 695/30,
				y: 390/30,
				width: 40/30,
				height: 40/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 40/30, 40/30);
					}
				}
			}));
			// 호박(2개)
			obj_Arr[1].push(world.createEntity(pumpkinConfig,{
				x: 600/30,
				y: 385/30,
				width: 50/30,
				height: 50/30,
				image: "./image/main/asset/pumpkin.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 50/30, 50/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(pumpkinConfig,{
				x: 600/30,
				y: 340/30,
				width: 40/30,
				height: 40/30,
				image: "./image/main/asset/pumpkin.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 40/30, 40/30);
					}
				}
			}));
			// 사람(1명)
			obj_Arr[2].push(world.createEntity(personConfig,{
				name: "2",
				x: 695/30,
				y: 320/30,
				width: 50/30,
				height: 75/30,		
				onImpact: function(entity, normalForce){
					if(normalForce > 10){
						boxPersonExplode(this, 50/60, 75/60, personFlyConfig);
					}					
				}
			}));
		}
		else if(stage == 3){
			// 박스 1줄(4단)
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 660/30,
				y: 442.5/30,
				width: 45/30,
				height: 45/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){ 
						boxObjExplode(this, 45/30, 45/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 655/30,
				y: 395/30,
				width: 50/30,
				height: 50/30,
				image: "./image/main/asset/right_box_2.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 50/30, 50/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 665/30,
				y: 347.5/30,
				width: 45/30,
				height: 45/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 45/30, 45/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 655/30,
				y: 300/30,
				width: 50/30,
				height: 50/30,
				image: "./image/main/asset/right_box_2.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 50/30, 50/30);
					}
				}
			}));
			// 박스 2줄(1단)
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 720/30,
				y: 432.5/30,
				width: 65/30,
				height: 65/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 65/30, 65/30);
					}
				}
			}));
			// 호박(2개)
			obj_Arr[1].push(world.createEntity(pumpkinConfig,{
				x: 580/30,
				y: 440/30,
				width: 50/30,
				height: 50/30,
				image: "./image/main/asset/pumpkin.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 50/30, 50/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(pumpkinConfig,{
				x: 665/30,
				y: 250/30,
				width: 50/30,
				height: 50/30,
				image: "./image/main/asset/pumpkin.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 50/30, 50/30);
					}
				}
			}));
			// 사람(1명)
			obj_Arr[2].push(world.createEntity(personConfig,{
				name: "3",
				x: 725/30,
				y: 360/30,
				width: 50/30,
				height: 75/30,		
				onImpact: function(entity, normalForce){
					if(normalForce > 10){
						boxPersonExplode(this, 50/60, 75/60, personFlyConfig);
					}					
				}
			}));
		}
		else if(stage == 4){
			// 박스 1줄(1단)
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 510/30,
				y: 442.5/30,
				width: 45/30,
				height: 45/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 45/30, 45/30);
					}
				}
			}));
			// 박스 2줄(5단)
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 630/30,
				y: 435/30,
				width: 60/30,
				height: 60/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 60/30, 60/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 645/30,
				y: 382.5/30,
				width: 45/30,
				height: 45/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 45/30, 45/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 640/30,
				y: 337.5/30,
				width: 45/30,
				height: 45/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 45/30, 45/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 635/30,
				y: 290/30,
				width: 50/30,
				height: 50/30,
				image: "./image/main/asset/right_box_2.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 50/30, 50/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 642.5/30,
				y: 242.5/30,
				width: 45/30,
				height: 45/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 45/30, 45/30);
					}
				}
			}));
			// 박스 3줄(2단)
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 720/30,
				y: 440/30,
				width: 50/30,
				height: 50/30,
				image: "./image/main/asset/right_box_2.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 50/30, 50/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 710/30,
				y: 390/30,
				width: 50/30,
				height: 50/30,
				image: "./image/main/asset/right_box_2.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 50/30, 50/30);
					}
				}
			}));
			// 호박(2개)
			obj_Arr[1].push(world.createEntity(pumpkinConfig,{
				image: "./image/main/asset/pumpkin.png",
				x: 510/30,
				y: 402.5/30,
				width: 40/30,
				height: 40/30,
				image: "./image/main/asset/pumpkin.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 40/30, 40/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(pumpkinConfig,{
				x: 510/30,
				y: 362.5/30,
				width: 40/30,
				height: 40/30,
				image: "./image/main/asset/pumpkin.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 40/30, 40/30);
					}
				}
			}));
			// 사람(2명)
			obj_Arr[2].push(world.createEntity(personConfig,{
				name: "1",
				x: 560/30,
				y: 445/30,
				width: 40/30,
				height: 60/30,		
				onImpact: function(entity, normalForce){
					if(normalForce > 10){
						boxPersonExplode(this, 40/60, 60/60, personFlyConfig);
					}					
				}
			}));
			obj_Arr[2].push(world.createEntity(personConfig, {
				name: "2",
				x: 710/30,
				y: 335/30,
				width: 40/30,
				height: 60/30,		
				onImpact: function(entity, normalForce){
					if(normalForce > 10){
						boxPersonExplode(this, 40/60, 60/60, personFlyConfig);
					}					
				}
			}));
		}
		else if(stage == 5){
			// 1줄(2단)
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 500/30,
				y: 442.5/30,
				width: 45/30,
				height: 45/30,
				image: "./image/main/asset/right_box_2.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 45/30, 45/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 495/30,
				y: 397.5/30,
				width: 45/30,
				height: 45/30,
				image: "./image/main/asset/right_box_2.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 45/30, 45/30);
					}
				}
			}));
			// 2줄(3단)
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 600/30,
				y: 435/30,
				width: 60/30,
				height: 60/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 60/30, 60/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 595/30,
				y: 385/30,
				width: 40/30,
				height: 40/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 40/30, 40/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 590/30,
				y: 350/30,
				width: 30/30,
				height: 30/30,
				image: "./image/main/asset/right_box_2.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 30/30, 30/30);
					}
				}
			}));
			// 3줄(2단)
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 655/30,
				y: 440/30,
				width: 50/30,
				height: 50/30,
				image: "./image/main/asset/right_box_2.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 50/30, 50/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 650/30,
				y: 395/30,
				width: 40/30,
				height: 40/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 40/30, 40/30);
					}
				}
			}));
			// 4줄(5단)
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 720/30,
				y: 435/30,
				width: 60/30,
				height: 60/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 60/30, 60/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 725/30,
				y: 385/30,
				width: 40/30,
				height: 40/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 40/30, 40/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 720/30,
				y: 345/30,
				width: 40/30,
				height: 40/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 40/30, 40/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 725/30,
				y: 310/30,
				width: 30/30,
				height: 30/30,
				image: "./image/main/asset/right_box_2.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 30/30, 30/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(boxConfig,{
				x: 730/30,
				y: 275/30,
				width: 40/30,
				height: 40/30,
				image: "./image/main/asset/right_box_1.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 40/30, 40/30);
					}
				}
			}));
			// 호박(3개)
			obj_Arr[1].push(world.createEntity(pumpkinConfig,{
				x: 445/30,
				y: 440/30,
				width: 50/30,
				height: 50/30,
				image: "./image/main/asset/pumpkin.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 50/30, 50/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(pumpkinConfig,{
				x: 495/30,
				y: 350/30,
				width: 50/30,
				height: 50/30,
				image: "./image/main/asset/pumpkin.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 50/30, 50/30);
					}
				}
			}));
			obj_Arr[1].push(world.createEntity(pumpkinConfig,{
				x: 590/30,
				y: 310/30,
				width: 50/30,
				height: 50/30,
				image: "./image/main/asset/pumpkin.png",			
				onImpact: function(entity, normalForce){
					if(normalForce > 20){
						boxObjExplode(this, 50/30, 50/30);
					}
				}
			}));
			// 사람(3명)
			obj_Arr[2].push(world.createEntity(personConfig,{
				name: "2",
				x: 550/30,
				y: 435/30,
				width: 40/30,
				height: 60/30,		
				onImpact: function(entity, normalForce){
					if(normalForce > 10){
						boxPersonExplode(this, 40/60, 60/60, personFlyConfig);
					}					
				}
			}));
			obj_Arr[2].push(world.createEntity(personConfig,{
				name: "3",
				x: 650/30,
				y: 345/30,
				width: 40/30,
				height: 60/30,		
				onImpact: function(entity, normalForce){
					if(normalForce > 10){
						boxPersonExplode(this, 40/60, 60/60, personFlyConfig);
					}					
				}
			}));
			obj_Arr[2].push(world.createEntity(personConfig,{
				name: "1",
				x: 725/30,
				y: 225/30,
				width: 40/30,
				height: 60/30,		
				onImpact: function(entity, normalForce){
					if(normalForce > 10){
						boxPersonExplode(this, 40/60, 60/60, personFlyConfig);
					}					
				}
			}));
		}
	}
	function boxLineFunc(){
		// 지지대에서 선 두개 그리기
		if(this._canvasPointerInfos){
			let _x1 = wR * 130;
			let _x2 = wR * 150;
			let _y = hR * 320;
			let basket_front_x = wR * ((basket_front.position().x + basket_front.imageOffsetX()) * 30 + 16);
			let basket_front_y = hR * ((basket_front.position().y + basket_front.imageOffsetY()) * 30 - 9);
			let basket_back_x = wR * ((basket_back.position().x + basket_back.imageOffsetX()) * 30 + 22.5);
			let basket_back_y = hR * ((basket_back.position().y + basket_back.imageOffsetY()) * 30 - 5);
			ctx.lineWidth = 1;ctx.strokeStyle = "#665B36";			
			ctx.beginPath();
			ctx.moveTo(_x1, _y);
			ctx.lineTo(basket_front_x , basket_front_y);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(_x2, _y);
			ctx.lineTo(basket_back_x , basket_back_y);
			ctx.stroke();
		}
	}
	function boxReSet(bool){
		basket_back.destroy();
		basket_front.destroy();
		ball.destroy();
		wood.destroy();
		if(bool){
			for(let i=0;i<obj_Arr[0].length;i++){
				obj_Arr[0][i].destroy();
			}
			for(let i=0;i<obj_Arr[1].length;i++){
				obj_Arr[1][i].destroy();
			}
			obj_Arr[3] = new Array();
		}
	}
	function boxObjExplode(_this, _thisW, _thisH){
		audioPlay(3);
		score_tmp += 500;
		obj_Arr[3].push(new Eff_Explode());
		obj_Arr[3][obj_Arr[3].length-1].x = (_this.position().x - _thisW * 0.5) * 30;
		obj_Arr[3][obj_Arr[3].length-1].y = (_this.position().y - _thisH * 0.5) * 30;
		obj_Arr[3][obj_Arr[3].length-1].width = _thisW * 30;
		obj_Arr[3][obj_Arr[3].length-1].height = _thisH * 30;
		_this.destroy();
	}
	function boxPersonExplode(_this, _thisHalfW, _thisHalfH, personFlyConfig){
		audioPlay(4);
		score_tmp += 600;
		obj_Arr[3].push(new Eff_Success());
		obj_Arr[3][obj_Arr[3].length-1].x = (_this.position().x - _thisHalfW) * 30;
		obj_Arr[3][obj_Arr[3].length-1].y = (_this.position().y - _thisHalfW) * 30;
		_this.destroy();
		obj_Arr[2].push(world.createEntity(personFlyConfig,{
			name: _this.name(),
			x: _this.position().x + _thisHalfW - 60/60,
			y: _this.position().y + _thisHalfH - 120/60						
		}));
	}
	function missionPopupFunc(bool){
		if(bool){
			mission_bg.active = bool;
			mission_bg.open = bool;
			main_layer.appear = bool;
			for(let i=0;i<mission_number_arr.length;i++){
				mission_number_arr[i].open = bool;
			}
		}
		else{
			mission_bg.close = !bool;
			for(let i=0;i<mission_number_arr.length;i++){
				mission_number_arr[i].close = !bool;
			}
		}
	}
	function logicFunc(){
		if(mission_bg.opened){
			mission_bg.delay++;
			if(mission_bg.delay > 60){
				mission_number_arr[stage - 1].active = true;
			}
			if(mission_bg.delay > 120){
				missionPopupFunc(false);
				mission_bg.delay = 0;
				mission_bg.opened = false;
			}
		}
		if(mission_bg.closed){
			mission_bg.w = 0;mission_bg.h = 0;
			mission_bg.x = absWidth * 0.5 - mission_bg.w * 0.5;
			mission_bg.y = absHeight * 0.5 - mission_bg.h * 0.5;
			for(let i=0;i<mission_number_arr.length;i++){
				mission_number_arr[i].load = true;
				mission_number_arr[i].close = false;
				mission_number_arr[i].w = 0;mission_number_arr[i].h = 0;
				mission_number_arr[i].x = absWidth * 0.5 - mission_number_arr[i].w * 0.5;
				mission_number_arr[i].y = absHeight * 0.5 - mission_number_arr[i].h * 0.5;
			}
			mission_alert.val = stage;
			mission_alert.active = true;
			mission_bg.closed = false;
		}		
		if(mission_alert.load){
			readyGo.active = true;
			mission_alert.load = false;
		}
		if(readyGo.halfload){
			main_layer.appear = false;
			readyGo.halfload = false;
		}
		if(readyGo.load){
			popup = false;
			readyGo.load = false;
		}
		if(success_bg.closed){
			stageSettingFunc();
			success_bg.closed = false;
		}
	}
	function scoreFunc(){
		if(score < score_tmp){
			score += 10;
		}
		score_arr = new Array();
		let scoreStr = score.toString();
		for(let i=0;i<scoreStr.length;i++){
			score_arr.push(new Bottom_score());
			score_arr[i].val = scoreStr[i];
			score_arr[i].x = (725 - 15 * (scoreStr.length - i));
		}		
	}
	function draw(){
		/* 상단 바 */
		try_text.draw();exit_btn.draw();
		for(let i=0;i<attempt;i++){
			try_mark_arr[i].draw();
		}
		/* 하단 바 */
		bottom_bg.draw();
		bottom_mission.draw();
		for(let i=0;i<score.toString().length;i++){
			score_arr[i].draw();
		}			
		for(let i=0;i<obj_Arr[3].length;i++){
			obj_Arr[3][i].draw();
		}
		/* 막 */
		main_layer.draw();green_layer.draw();
		/* 팝업 */
		if(mission_bg.active){
			mission_bg.draw();
			for(let i=0;i<mission_number_arr.length;i++){
				mission_number_arr[i].draw();
			}
		}
		if(mission_alert.active){
			mission_alert.draw();
		}
		if(readyGo.active){
			readyGo.draw();
		}
		if(success_bg.active){
			success_bg.draw();
			success_star.draw();
			success_level.draw();
			success_content.draw();
			success_next_btn.draw();
		}
		if(over_bg.active){
			over_bg.draw();
			over_content.draw();
			over_home_btn.draw();
		}	
		if(clear_bg.active){
			clear_bg.draw();
			clear_content.draw();
			clear_home_btn.draw();
		}
		if(exit_bg.active){
			exit_bg.draw();
			exit_yes_btn.draw();
			exit_no_btn.draw();
		}
	}
	mainLoop = function(){
		aud_Arr[0][1].play();
		logicFunc();scoreFunc();
		draw();
		requestAnimFrame(mainLoop);															// 게임 애니 시작
	};
	mainLoop();
}
/* 게임내부함수 */
function methodPopupFunc(bool){
	popup = bool;
	method_bg.active = bool;	
	if(bool){
		method_content.val = 0;
	}
}
function exitPopupFunc(bool){
	popup = bool;
	main_layer.appear = bool;
	if(bool){
		exit_bg.active = bool;
		exit_bg.open = bool;
		exit_yes_btn.open = bool;
		exit_no_btn.open = bool;
	}
	else{
		exit_bg.close = !bool;
		exit_yes_btn.close = !bool;
		exit_no_btn.close = !bool;
	}
}
function successPopupFunc(bool){
	if(bool){
		popup = bool;
		main_layer.appear = bool;
	}
	else{
		success_bg.closed = !bool;
	}
	success_bg.active = bool;
}
function overPopupFunc(bool){
	if(bool){
		popup = bool;
		main_layer.appear = bool;
		over_bg.active = bool;
		over_bg.open = bool;
		over_home_btn.open = bool;
	}
	else{
		over_bg.close = !bool;
		over_home_btn.close = !bool;
	}
}
function clearPopupFunc(bool){
	popup = bool;
	main_layer.appear = bool;
	clear_bg.active = bool;
}
/* 이벤트관련 */
document.addEventListener(mouseEv("move"),function(e){
	let event = (e.type == "mousemove" ? e : e.touches[0]);
	mouseX = event.pageX - $("canvas").offset().left;					
	mouseY = event.pageY - $("canvas").offset().top;
	$("canvas").css("cursor","initial");

	if(pageType == "intro"){
		if(!popup){
			if(mouseCd(intro_start_btn)){
				$("canvas").css("cursor","pointer");
				intro_start_btn.mouseOver = true;
				intro_method_btn.mouseOver = false;
			}
			else if(mouseCd(intro_method_btn)){
				if(!green_layer.load){
					$("canvas").css("cursor","pointer");
					intro_method_btn.mouseOver = true;
					intro_start_btn.mouseOver = false;
				}
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
					method_prev_btn.mouseOver = false;
					method_next_btn.mouseOver = false;
					method_exit_btn.mouseOver = false;
				}
			}
		}
	}
	else if(pageType == "main"){
		if(!popup){
			if(mouseCd(exit_btn)){
				$("canvas").css("cursor","pointer");
				exit_btn.mouseOver = true;
			}		
			else{
				exit_btn.mouseOver = false;
			}
			if(pointer){
				$("canvas").css("cursor","pointer");
			}
			else{
				$("canvas").css("cursor","initial");
			}
		}
		else{			
			if(success_bg.active){
				if(mouseCd(success_next_btn)){
					$("canvas").css("cursor","pointer");
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
			else if(clear_bg.active){
				if(mouseCd(clear_home_btn)){
					$("canvas").css("cursor","pointer");
					clear_home_btn.mouseOver = true;
				}	
				else{
					clear_home_btn.mouseOver = false;
				}
			}	
			else if(exit_bg.active){
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
		}		
	}
});
document.addEventListener(mouseEv("down"),function(e){ 
	let event = (e.type == "mousedown" ? e : e.touches[0]);
	mouseX = event.pageX - $("canvas").offset().left;					
	mouseY = event.pageY - $("canvas").offset().top;
});
document.addEventListener(mouseEv("up"),function(e){
	if(pageType == "intro"){
		if(!popup){
			if(mouseCd(intro_start_btn)){
				audioPlay(1);
				intro_start_btn.mouseOver = false;
				green_layer.load = true;
			}
			else if(mouseCd(intro_method_btn)){
				if(!green_layer.load){
					audioPlay(1);
					intro_method_btn.mouseOver = false;
					methodPopupFunc(true);
				}
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
					if(method_prev_btn.active){
						audioPlay(1);	
						method_content.val--;
						method_prev_btn.mouseOver = false;
					}
				}	
				else if(mouseCd(method_next_btn)){
					if(method_next_btn.active){	
						audioPlay(1);	
						method_content.val++;
						method_next_btn.mouseOver = false;
					}
				}
			}			
		}
	}
	else if(pageType == "main"){
		if(!popup){
			if(mouseCd(exit_btn)){	
				audioPlay(1);	
				exit_btn.mouseOver = false;
				exitPopupFunc(true);
			}		
		}
		else{	
			if(success_bg.active){
				if(mouseCd(success_next_btn)){	
					audioPlay(1);	
					successPopupFunc(false);
				}		
			}
			else if(over_bg.active){
				if(mouseCd(over_home_btn)){
					location.href = "index.html";
				}		
			}
			else if(clear_bg.active){
				if(mouseCd(clear_home_btn)){
					location.href = "index.html";
				}		
			}
			else if(exit_bg.active){
				if(mouseCd(exit_yes_btn)){
					exit_yes_btn.mouseOver = false;
					location.href = "index.html";
				}		
				else if(mouseCd(exit_no_btn)){	
					audioPlay(1);	
					exit_no_btn.mouseOver = false;
					exitPopupFunc(false);
				}
			}
		}
	}
	$("canvas").css("cursor","initial");
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
function connectIndexOfAgentFunc() {
	let deviceChk = "";	
	const agent = navigator.userAgent.toLowerCase();
	const isIOS = (agent.indexOf("iphone")>-1||agent.indexOf("ipad")>-1||agent.indexOf("ipod")>-1);
	const isANDROID = (agent.match('android') != null);
	const isMSIE80 = (agent.indexOf("msie 6.0")>-1||agent.indexOf("msie 7.0")>-1||agent.indexOf("msie 8.0")>-1);
	if(isANDROID){
		deviceChk = "Android";
	}
	else if(isIOS){
		deviceChk = "IOS";
	} 
	else if(isMSIE80){
		deviceChk = "PC";
	} 
	else{
		deviceChk = "PC";
	}	
	return deviceChk;
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