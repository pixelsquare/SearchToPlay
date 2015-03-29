var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d');

var FPS = 30;
var TO_RADIANS = Math.PI / 180;
var TEXT_TYPE = 'pt lighter calibri';
var KEY_PAUSE = 80, // P
	KEY_MUSIC = 77, // M
	KEY_ESC = 27; // ESC

var eventHandler = {
	add: function (to, type, func) {
		if (document.addEventListener) to.addEventListener(type, func, false);
		else if (document.attachEvent) to.attachEvent('on' + type, func);
		else to['on' + type] = func;
	},
	remove: function (to, type, func) {
		if (document.removeEventListener) to.removeEventListener(type, func, false);
		else if (document.detachEvent) to.detachEvent(type, func, false);
	}
}

var centerPos = { x: (canvas.width * 0.5), y: (canvas.height * 0.5) }
var mousePos = { x: 0, y: 0 }
var imageList = [];
var dbInfoList = [];
var arcadeInfoList = [];
var timeTrialInfoList = [];

var image = {
	background:		'images/bg4.png',
	mono:			'images/bg4mono.png',
	overlay:		'images/bg4.png',
	menuBg:			'images/menu_bg.png',
	endBG:			'images/gameEndBG.png',
	arcadeBtn:		'images/arcade_button.png',
	timeTrialBtn:	'images/time_trial_button.png',
	submitBtn:		'images/submitButton.png',
	leaderboardBtn:	'images/highscore_button.png',
	homeBtn:		'images/home_button.png',
	creditsBtn:		'images/credits_button.png',
	toArcadeBtn:	'images/toArcadeButton.png',
	toTimeTrialBtn:	'images/toTimeTrialButton.png'
}

var itemImage = {
	ball:			['images/colored/ball.png',				'images/bw/bw_ball.png'],
	balloon:		['images/colored/balloon.png',			'images/bw/bw_balloon.png'],
	basketball:		['images/colored/basketball.png',		'images/bw/bw_basketball.png'],
	billiardstick:	['images/colored/billiardstick.png',	'images/bw/bw_billiardstick.png'],
	books1:			['images/colored/books1.png',			'images/bw/bw_books1.png'],
	books2:			['images/colored/books2.png',			'images/bw/bw_books2.png'],
	bouquet:		['images/colored/bouquet.png',			'images/bw/bw_bouquet.png'],
	card:			['images/colored/card1.png',			'images/bw/bw_card1.png'],
	clock:			['images/colored/clock.png',			'images/bw/bw_clock.png'],
	coins:			['images/colored/coins.png',			'images/bw/bw_coins.png'],
	crowbar:		['images/colored/crowbar.png',			'images/bw/bw_crowbar.png'],
	crumpledpaper:	['images/colored/crumpledpaper.png',	'images/bw/bw_crumpledpaper.png'],
	dominos:		['images/colored/dominos1.png',			'images/bw/bw_dominos1.png'],
	electricfan:	['images/colored/electricfan.png',		'images/bw/bw_electricfan.png'],
	happybirthday:	['images/colored/happybirthday.png',	'images/bw/bw_happybirthday.png'],
	magazine:		['images/colored/magazine.png',			'images/bw/bw_magazine.png'],
	necklace:		['images/colored/necklace.png',			'images/bw/bw_necklace.png'],
	necktie:		['images/colored/necktie.png',			'images/bw/bw_necktie.png'],
	notes:			['images/colored/notes.png',			'images/bw/bw_notes.png'],
	openbook:		['images/colored/openbook.png',			'images/bw/bw_openbook.png'],
	pencil:			['images/colored/pencil.png',			'images/bw/bw_pencil.png'],
	pizza:			['images/colored/pizza.png',			'images/bw/bw_pizza.png'],
	schoolsupplies: ['images/colored/schoolsupplies1.png',	'images/bw/bw_schoolsupplies1.png'],
	shapetoys:		['images/colored/shapetoys.png',		'images/bw/bw_shapetoys.png'],
	shelf:			['images/colored/shelf.png',			'images/bw/bw_shelf.png'],
	smallbox:		['images/colored/smallbox.png',			'images/bw/bw_smallbox.png'],
	sofa:			['images/colored/sofa.png',				'images/bw/bw_sofa.png'],
	stair:			['images/colored/stair.png',			'images/bw/bw_stair.png'],
	table:			['images/colored/table.png',			'images/bw/bw_table.png'],
	teddybear:		['images/colored/teddybear.png',		'images/bw/bw_teddybear.png'],
	telephone:		['images/colored/telephone.png',		'images/bw/bw_telephone.png'],
	towel:			['images/colored/towel.png',			'images/bw/bw_towel.png'],
	towelstand:		['images/colored/towelstand.png',		'images/bw/bw_towelstand.png'],
	toys:			['images/colored/toys.png',				'images/bw/bw_toys.png'],
	triangle:		['images/colored/triangle.png',			'images/bw/bw_triangle.png']
}

var tipOfTheDay = [
	'This game is very easy',
	'Escaping can cause you additional 10 seconds',
	'Don\'t forget to submit your score!',
	'Be in the TOP 1 of the leaderboard chart!',
	'The shortest time wins!',
	'Never get bored, keep playing!'
];

var aspx = {
	submitTable: null,
	gvDbArcade: null,
	gvDbTimeTrial: null,
	hdfGameEndTime: null,
	hdfItemsPicked: null,
	hdfIsArcade: null
}

var gameControls = {
	isPaused: false,
	hasEscaped: false,
	isSubmitting: false,
	isTransitioning: false,
	isCreditShown: false,
	inGame: false,
	gameStart: false,
	isArcade: -1,
	isArcadeShown: false,
	enableAudio: true
}

var timeHandler = {
	gameTime: 0,
	timeElapsed: 0,
	maxTime: 12
}

var textAlignment = {
	left: 'left',
	right: 'right',
	center: 'center'
}

function fade() {
	var property = {
		fadingIn: false,
		fadingOut: false,
		alpha: 0,
		time: 0
	}
	var startCallback;
	var midCallback;
	var endCallback;

	this.fadeIn = function () { property = { fadingIn: true, fadingOut: false, alpha: 0, time: 0 }; }
	this.fadeOut = function () { property = { fadingIn: false, fadingOut: true, alpha: 1, time: 0 }; }
	this.reset = function () { property = { fadingIn: false, fadingOut: false, alpha: 0, time: 0 }; }
	this.startCallback = function (callback) { startCallback = callback; }
	this.midCallback = function (callback) { midCallback = callback; }
	this.endCallback = function (callback) { endCallback = callback; }
	this.getAlpha = function () { return property.alpha; }
	this.updateFade = function (dt) {
		if (property.alpha < 1 && property.fadingIn && !property.fadingOut) {
			gameControls.isTransitioning = true;
			if (startCallback != null) startCallback();
			property.time += dt;
			property.alpha = utilities.lerp(0, 1, property.time);
			if (property.alpha >= 1) {
				if (midCallback != null) midCallback();
				this.fadeOut();
			}
		}
		else if (property.alpha > 0 && !property.fadingIn && property.fadingOut) {
			property.time += dt;
			property.alpha = utilities.lerp(1, 0, property.time);
			if (property.alpha <= 0) {
				this.reset();
				if (endCallback != null) endCallback();
				gameControls.isTransitioning = false;
			}
		}
	}
}

var transitionFade = new fade();
var creditsFade = new fade();

function button(src, pos, scl, ang) {
	this.title = '';
	this.info = '';
	this.hovered = false;
	this.origScale = scl;
	this.scaleOffset = { x: 0.15, y: 0.15 };
	this.getPosition = function () { return { x: pos.x, y: pos.y} }

	var btnImg = new GameImage(src, pos, scl, ang);
	
	this.setScale = function (scl) { btnImg.scale = scl; }
	this.getImg = function () { return btnImg; }

	this.init = function () {
		this.hovered = false;
		this.origScale = scl;
		this.scaleOffset = { x: 0.15, y: 0.15 };
		this.getPosition = function () { return { x: pos.x, y: pos.y} }
	}

	this.onHover = function (pos) {
		if (btnImg.hitTest({ x: pos.x, y: pos.y }) && pos.canHover) {
			btnImg.scale = { x: (this.origScale.x + this.scaleOffset.x), y: (this.origScale.y + this.scaleOffset.y) };
			this.hovered = true;
		}
		else {
			btnImg.scale = this.origScale;
			this.hovered = false;
		}
	}

	this.onClick = function (pos) {
		return btnImg.hitTest({ x: pos.x, y: pos.y });
	}

	this.render = function () {
		btnImg.render();
		if (this.hovered) {
			if (this.title != '') utilities.printMessage(10, this.title, utilities.color1(255, 255, 255, 1), pos.x + (btnImg.getImgSize().w * 0.5), pos.y - (btnImg.getImgSize().h * 0.1));
			if (this.info != '') utilities.printMessage(10, this.info, utilities.color1(255, 255, 255, 1), pos.x, pos.y);
		}
	}
}

// Backgrounds
var menuBg = new GameImage(image.menuBg, { x: 0, y: 0 }, { x: 1, y: 1 }, 0);
var background = new GameImage(image.background, { x: 0, y: 0 }, { x: 1, y: 1 }, 0);
var bgMono = new GameImage(image.mono, { x: 0, y: 0 }, { x: 1, y: 1 }, 0);
var endBg = new GameImage(image.endBG, { x: 0, y: 0 }, { x: 1, y: 1 }, 0);
var leaderboardBg = new GameImage(image.endBG, { x: 0, y: 0 }, { x: 1, y: 1 }, 0);

// Buttons
var arcadeBtn = new button(image.arcadeBtn, { x: centerPos.x * 0.78, y: centerPos.y * 1.19 }, { x: 1, y: 1 }, 0);
arcadeBtn.title = 'Arcade';
var timeTrialBtn = new button(image.timeTrialBtn, { x: centerPos.x * 0.9, y: centerPos.y * 1.08 }, { x: 1, y: 1 }, 0);
timeTrialBtn.title = 'Time Trial';
var leaderboardBtn = new button(image.leaderboardBtn, { x: centerPos.x * 1.4, y: centerPos.y * 1.1 }, { x: 1, y: 1 }, 0);
leaderboardBtn.title = 'Leaderboard';
var creditsBtn = new button(image.creditsBtn, { x: centerPos.x * 0.1, y: centerPos.y * 0.63 }, { x: 1, y: 1 }, 0);
creditsBtn.title = 'Credits';
var submitBtn = new button(image.submitBtn, { x: (centerPos.x - 50), y: (centerPos.y - 25) - 80 }, { x: 1, y: 1 }, 0);
var homeBtn = new button(image.homeBtn, { x: centerPos.x * 1.7, y: centerPos.y * 1.8 }, { x: 1, y: 1 }, 0);
var toArcadeBtn = new button(image.toArcadeBtn, {x: centerPos.x * 1.3, y: centerPos.y * 1.5}, {x:1, y:1} , 0);
var totimeTrialBtn = new button(image.toTimeTrialBtn, {x:centerPos.x * 1.3, y: centerPos.y * 1.5 }, {x:1, y:1}, 0);

// Items
var ball =				[new GameImage(itemImage.ball[0], { x: centerPos.x * 1.1, y: centerPos.y * 1.6 }, { x: 0.8, y: 0.8 }, 0),
						new GameImage(itemImage.ball[1], { x: centerPos.x * 1.1, y: centerPos.y * 1.6 }, { x: 0.8, y: 0.8 }, 0)];
var balloon =			[new GameImage(itemImage.balloon[0], { x: centerPos.x * 1.85, y: centerPos.y * 0.1 }, { x: 0.9, y: 0.9 }, 0),
						new GameImage(itemImage.balloon[1], { x: centerPos.x * 1.85, y: centerPos.y * 0.1 }, { x: 0.9, y: 0.9 }, 0)];
//var basketball =		[new GameImage(itemImage.basketball[0],		{ x: centerPos.x, y: centerPos.y }, { x: 1, y: 1 }, 0),
//						new GameImage(itemImage.basketball[1],		{ x: centerPos.x, y: centerPos.y }, { x: 1, y: 1 }, 0)];
var billiardstick =		[new GameImage(itemImage.billiardstick[0], { x: centerPos.x * 0.2, y: centerPos.y * 0.5 }, { x: 1, y: 1 }, 0),
						new GameImage(itemImage.billiardstick[1], { x: centerPos.x * 0.2, y: centerPos.y * 0.5 }, { x: 1, y: 1 }, 0)];
var books1 =			[new GameImage(itemImage.books1[0], { x: centerPos.x * 0.8, y: centerPos.y * 0.655 }, { x: 0.85, y: 0.85 }, 0),
						new GameImage(itemImage.books1[1], { x: centerPos.x * 0.8, y: centerPos.y * 0.655 }, { x: 0.85, y: 0.85 }, 0)];
var books2 =			[new GameImage(itemImage.books2[0], { x: centerPos.x * 1.6, y: centerPos.y * 0.43 }, { x: 0.8, y: 0.8 }, 0),
						new GameImage(itemImage.books2[1], { x: centerPos.x * 1.6, y: centerPos.y * 0.43 }, { x: 0.8, y: 0.8 }, 0)];
var bouquet =			[new GameImage(itemImage.bouquet[0], { x: centerPos.x * 0.68, y: centerPos.y }, { x: 0.9, y: 0.9 }, 0),
						new GameImage(itemImage.bouquet[1], { x: centerPos.x * 0.68, y: centerPos.y }, { x: 0.9, y: 0.9 }, 0)];
var card =				[new GameImage(itemImage.card[0], { x: centerPos.x * 0.6, y: centerPos.y * 1.775 }, { x: 1, y: 1 }, 0),
						new GameImage(itemImage.card[1], { x: centerPos.x * 0.6, y: centerPos.y * 1.775 }, { x: 1, y: 1 }, 0)];
var clock =				[new GameImage(itemImage.clock[0], { x: centerPos.x * -0.1, y: centerPos.y * 0.22 }, { x: 1, y: 1 }, 0),
						new GameImage(itemImage.clock[1], { x: centerPos.x * -0.1, y: centerPos.y * 0.22 }, { x: 1, y: 1 }, 0)];
var coins =				[new GameImage(itemImage.coins[0], { x: centerPos.x * 1.1, y: centerPos.y * 1.29 }, { x: 0.9, y: 0.9 }, 0),
						new GameImage(itemImage.coins[1], { x: centerPos.x * 1.1, y: centerPos.y * 1.29 }, { x: 0.9, y: 0.9 }, 0)];
var crowbar =			[new GameImage(itemImage.crowbar[0], { x: centerPos.x * 1.7, y: centerPos.y * 0.4 }, { x: 0.9, y: 0.9 }, 0),
						new GameImage(itemImage.crowbar[1], { x: centerPos.x * 1.7, y: centerPos.y * 0.4 }, { x: 0.9, y: 0.9 }, 0)];
var crumpledpaper =		[new GameImage(itemImage.crumpledpaper[0], { x: centerPos.x * 1.75, y: centerPos.y * 1.75 }, { x: 0.8, y: 0.8 }, 0),
						new GameImage(itemImage.crumpledpaper[1], { x: centerPos.x * 1.75, y: centerPos.y * 1.75 }, { x: 0.8, y: 0.8 }, 0)];
var dominos =			[new GameImage(itemImage.dominos[0], { x: centerPos.x * 1.3, y: centerPos.y * 1.62 }, { x: 0.9, y: 0.9 }, 0),
						new GameImage(itemImage.dominos[1], { x: centerPos.x * 1.3, y: centerPos.y * 1.62 }, { x: 0.9, y: 0.9 }, 0)];
var electricfan =		[new GameImage(itemImage.electricfan[0], { x: centerPos.x * 1.6, y: centerPos.y * 0.9 }, { x: 0.9, y: 0.9 }, 0),
						new GameImage(itemImage.electricfan[1], { x: centerPos.x * 1.6, y: centerPos.y * 0.9 }, { x: 0.9, y: 0.9 }, 0)];
var happybirthday =		[new GameImage(itemImage.happybirthday[0], { x: centerPos.x * 0.3, y: centerPos.y * 0.06 }, { x: 0.82, y: 0.82 }, 0),
						new GameImage(itemImage.happybirthday[1], { x: centerPos.x * 0.3, y: centerPos.y * 0.06 }, { x: 0.82, y: 0.82 }, 0)];
var magazine =			[new GameImage(itemImage.magazine[0], { x: centerPos.x * 1.32, y: centerPos.y * 1.2 }, { x: 0.9, y: 0.9 }, 0),
						new GameImage(itemImage.magazine[1], { x: centerPos.x * 1.32, y: centerPos.y * 1.2 }, { x: 0.9, y: 0.9 }, 0)];
var necklace =			[new GameImage(itemImage.necklace[0], { x: centerPos.x * 0.68, y: centerPos.y * 1.3 }, { x: 0.85, y: 0.85 }, 0),
						new GameImage(itemImage.necklace[1], { x: centerPos.x * 0.68, y: centerPos.y * 1.3 }, { x: 0.85, y: 0.85 }, 0)];
var necktie =			[new GameImage(itemImage.necktie[0], { x: centerPos.x * 1.5, y: centerPos.y * 0.98 }, { x: 0.85, y: 0.85 }, 0),
						new GameImage(itemImage.necktie[1], { x: centerPos.x * 1.5, y: centerPos.y * 0.98 }, { x: 0.85, y: 0.85 }, 0)];
var notes =				[new GameImage(itemImage.notes[0], { x: centerPos.x * -0.12, y: centerPos.y * 1.55 }, { x: 1, y: 1 }, 0),
						new GameImage(itemImage.notes[1], { x: centerPos.x * -0.12, y: centerPos.y * 1.55 }, { x: 1, y: 1 }, 0)];
var openbook =			[new GameImage(itemImage.openbook[0], { x: centerPos.x * 0.26, y: centerPos.y * 1.25 }, { x: 0.85, y: 0.85 }, 0),
						new GameImage(itemImage.openbook[1], { x: centerPos.x * 0.26, y: centerPos.y * 1.25 }, { x: 0.85, y: 0.85 }, 0)];
var pencil =			[new GameImage(itemImage.pencil[0], { x: centerPos.x * 0.35, y: centerPos.y * 0.66 }, { x: 0.7, y: 0.7 }, 0),
						new GameImage(itemImage.pencil[1], { x: centerPos.x * 0.35, y: centerPos.y * 0.66 }, { x: 0.7, y: 0.7 }, 0)];
var pizza =				[new GameImage(itemImage.pizza[0], { x: centerPos.x * 0.35, y: centerPos.y * 1.72 }, { x: 1, y: 1 }, 0),
						new GameImage(itemImage.pizza[1], { x: centerPos.x * 0.35, y: centerPos.y * 1.72 }, { x: 1, y: 1 }, 0)];
var schoolsupplies =	[new GameImage(itemImage.schoolsupplies[0], { x: centerPos.x * 1.3, y: centerPos.y * 1.765 }, { x: 1, y: 1 }, 0),
						new GameImage(itemImage.schoolsupplies[1], { x: centerPos.x * 1.3, y: centerPos.y * 1.765 }, { x: 1, y: 1 }, 0)];
var shapetoys =			[new GameImage(itemImage.shapetoys[0], { x: centerPos.x * -0.11, y: centerPos.y * 1.5 }, { x: 1, y: 1 }, 0),
						new GameImage(itemImage.shapetoys[1], { x: centerPos.x * -0.11, y: centerPos.y * 1.5 }, { x: 1, y: 1 }, 0)];
var shelf =				[new GameImage(itemImage.shelf[0], { x: centerPos.x * -0.4, y: centerPos.y * 0.55 }, { x: 1, y: 1 }, 0),
						new GameImage(itemImage.shelf[1], { x: centerPos.x * -0.4, y: centerPos.y * 0.55 }, { x: 1, y: 1 }, 0)];
var smallbox =			[new GameImage(itemImage.smallbox[0], { x: centerPos.x * 1.3, y: centerPos.y * 1.12 }, { x: 0.9, y: 0.9 }, 0),
						new GameImage(itemImage.smallbox[1], { x: centerPos.x * 1.3, y: centerPos.y * 1.12 }, { x: 0.9, y: 0.9 }, 0)];
var sofa =				[new GameImage(itemImage.sofa[0], { x: centerPos.x * 0.2, y: centerPos.y * 0.95 }, { x: 0.9, y: 0.9 }, 0),
						new GameImage(itemImage.sofa[1], { x: centerPos.x * 0.2, y: centerPos.y * 0.95 }, { x: 0.9, y: 0.9 }, 0)];
var stair =				[new GameImage(itemImage.stair[0], { x: centerPos.x * 1.6, y: centerPos.y * 0.35 }, { x: 0.7, y: 0.7 }, 0),
						new GameImage(itemImage.stair[1], { x: centerPos.x * 1.6, y: centerPos.y * 0.35 }, { x: 0.7, y: 0.7 }, 0)];
var table =				[new GameImage(itemImage.table[0], { x: centerPos.x * 0.01, y: centerPos.y * 1.27 }, { x: 0.85, y: 0.85 }, 0),
						new GameImage(itemImage.table[1], { x: centerPos.x * 0.01, y: centerPos.y * 1.27 }, { x: 0.85, y: 0.85 }, 0)];
var teddybear =			[new GameImage(itemImage.teddybear[0], { x: centerPos.x * 1.05, y: centerPos.y }, { x: 0.85, y: 0.85 }, 0),
						new GameImage(itemImage.teddybear[1], { x: centerPos.x * 1.05, y: centerPos.y }, { x: 0.85, y: 0.85 }, 0)];
var telephone =			[new GameImage(itemImage.telephone[0], { x: centerPos.x * 0.7, y: centerPos.y * 1.67 }, { x: 1, y: 1 }, 0),
						new GameImage(itemImage.telephone[1], { x: centerPos.x * 0.7, y: centerPos.y * 1.67 }, { x: 1, y: 1 }, 0)];
var towel =				[new GameImage(itemImage.towel[0], { x: centerPos.x * -0.1, y: centerPos.y * 0.67 }, { x: 1, y: 1 }, 0),
						new GameImage(itemImage.towel[1], { x: centerPos.x * -0.1, y: centerPos.y * 0.67 }, { x: 1, y: 1 }, 0)];
var towelstand =		[new GameImage(itemImage.towelstand[0], { x: centerPos.x * 1.71, y: centerPos.y * 0.54 }, { x: 0.9, y: 0.9 }, 0),
						new GameImage(itemImage.towelstand[1], { x: centerPos.x * 1.71, y: centerPos.y * 0.54 }, { x: 0.9, y: 0.9 }, 0)];
var toys =				[new GameImage(itemImage.toys[0], { x: centerPos.x * 0.37, y: centerPos.y * 0.65 }, { x: 0.85, y: 0.85 }, 0),
						new GameImage(itemImage.toys[1], { x: centerPos.x * 0.37, y: centerPos.y * 0.65 }, { x: 0.85, y: 0.85 }, 0)];
var triangle =			[new GameImage(itemImage.triangle[0], { x: centerPos.x * 1.05, y: centerPos.y * 1.3 }, { x: 0.95, y: 0.95 }, 0),
						new GameImage(itemImage.triangle[1], { x: centerPos.x * 1.05, y: centerPos.y * 1.3 }, { x: 0.95, y: 0.95 }, 0)];

function scrollList(args) {
	this.list = [];
	this.title = args.title;
	this.highlightTitle = args.highlightTitle;
	this.titleOffset = args.titleOffset;
	this.textAlign = textAlignment.left;
	this.highlightColor = { r: 255, g: 0, b: 0, a: 1 };
	this.titleColor = { r: 0, g: 0, b: 0, a: 1 };
	this.scrollBox = args.scrollBox;
	this.scrollSize = 5;
	this.curIndx = 0;
	this.indxOffset = -3;

	this.showHoverBox = args.showHoverBox;
	this.textAlphaOffset = 0.3;
	this.textAlpha = { min: 0.3, max: 1 };
	this.titleAlphaOffset = 0.5;
	this.titleAlpha = { min: 0.5, max: 1 };
	this.isHovering = false;

	this.init = function () {
		this.textAlign = textAlignment.left;
		this.scrollSize = 5;
		this.curIndx = 0;
		this.indxOffset = -3;
		this.textAlphaOffset = 0.3;
		this.textAlpha = { min: 0.3, max: 1 };
		this.isHovering = false;
	}

	this.render = function (dt) {
		this.xPos = 0;
		if (this.textAlign == textAlignment.left) this.xPos = this.scrollBox.x;
		else if (this.textAlign == textAlignment.right) this.xPos = this.scrollBox.x + this.scrollBox.w;
		else if (this.textAlign == textAlignment.center) this.xPos = this.scrollBox.x + this.scrollBox.w * 0.5;
		else this.textAlign = textAlignment.left;

		if (this.showHoverBox) {
			if (this.isHovering && this.textAlphaOffset < this.textAlpha.max) this.textAlphaOffset += 3 * dt;
			else if (!this.isHovering && this.textAlphaOffset > this.textAlpha.min) this.textAlphaOffset -= 3 * dt;

			ctx.save();
			ctx.fillStyle = 'black';
			ctx.strokeWith = 1;
			ctx.beginPath();
			ctx.rect(this.scrollBox.x - (this.scrollBox.w * 0.5), this.scrollBox.y - (this.scrollBox.h * 0.2), this.scrollBox.w, this.scrollBox.h);
			ctx.strokeStyle = utilities.color1(0, 0, 0, this.textAlphaOffset);
			ctx.stroke();
			ctx.restore();
		}

		if (this.title != '') {
			if (this.highlightTitle) {
				if (this.isHovering && this.titleAlphaOffset < this.titleAlpha.max) this.titleAlphaOffset += 3 * dt;
				else if (!this.isHovering && this.titleAlphaOffset > this.titleAlpha.min) this.titleAlphaOffset -= 3 * dt;
			}
			else
				this.titleAlphaOffset = 1;

			var tmpColor = this.titleColor;
			tmpColor = { r: this.titleColor.r, g: this.titleColor.g, b: this.titleColor.b, a: this.titleAlphaOffset };
			utilities.printMessage(21, this.title, utilities.color2(tmpColor), this.xPos + this.titleOffset.x, this.scrollBox.y + this.titleOffset.y);
		}

		if (this.list.length > 0) {
			this.sizeOffset = this.scrollSize + 1;
			this.curIndx = this.indxOffset + 3;

			for (var i = 1; i < this.sizeOffset; i++) {
				if (this.list[i + this.indxOffset] != null) {
					var tmpColor = this.list[i + this.indxOffset].textColor;
					if (i == this.sizeOffset * 0.5) {
						utilities.printMessage(20, this.list[i + this.indxOffset].text, utilities.color2(tmpColor), this.xPos, this.scrollBox.y + (i * 25));
					}

					if (i < this.sizeOffset * 0.5) {
						tmpColor = { r: tmpColor.r, g: tmpColor.g, b: tmpColor.b, a: i * 0.2 };
						utilities.printMessage(((5 * i) * 1.5), this.list[i + this.indxOffset].text, utilities.color2(tmpColor), this.xPos, this.scrollBox.y + (i * 25));
					}

					if (i > this.sizeOffset * 0.5) {
						tmpColor = { r: tmpColor.r, g: tmpColor.g, b: tmpColor.b, a: (this.sizeOffset - i) * 0.2 };
						utilities.printMessage((5 * (this.sizeOffset - i)) * 1.5, this.list[i + this.indxOffset].text, utilities.color2(tmpColor), this.xPos, this.scrollBox.y + (i * 25));
					}
				}
			}
		}
	}

	this.moveList = function (delta) {
		if (this.isHovering) {
			if (delta > 0 && (this.indxOffset + 3) < (this.list.length - 1) || delta < 0 && (this.indxOffset + 3) > 0) {
				this.indxOffset += delta;
			}
		}
	}

	this.onHover = function (pos) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(this.scrollBox.x - (this.scrollBox.w * 0.5), this.scrollBox.y - (this.scrollBox.h * 0.2), this.scrollBox.w, this.scrollBox.h);
		this.isHovering = ctx.isPointInPath(pos.x, pos.y);
		ctx.restore();
	}
}

var leaderboard = new scrollList({ title: 'Arcade Leaderboard', titleOffset: { x: 0, y: -50 },
	scrollBox: { x: centerPos.x, y: centerPos.y * 1.1, w: 450, h: 180 }, showHoverBox: true, highlightTitle: false });
var dbRank = new scrollList({ title: 'Rank', titleOffset: { x: 0, y: 0 },
	scrollBox: { x: centerPos.x * 0.4, y: centerPos.y * 1.1, w: 100, h: 180 }, showHoverBox: false, highlightTitle: false });
var dbName = new scrollList({ title: 'Name', titleOffset: { x: 0, y: 0 },
	scrollBox: { x: centerPos.x * 0.85, y: centerPos.y * 1.1, w: 250, h: 180 }, showHoverBox: false, highlightTitle: false });
var dbScore = new scrollList({ title: 'Score', titleOffset: { x: 0, y: 0 },
	scrollBox: { x: centerPos.x * 1.25, y: centerPos.y * 1.1, w: 100, h: 180 }, showHoverBox: false, highlightTitle: false });
var dbTime = new scrollList({ title: 'Time', titleOffset: { x: 0, y: 0 },
	scrollBox: { x: centerPos.x * 1.55, y: centerPos.y * 1.1, w: 100, h: 180 }, showHoverBox: false, highlightTitle: false });
var items = new scrollList({ title: 'Items', titleOffset: { x: 0, y: 0 },
	scrollBox: { x: centerPos.x * 1.7, y: centerPos.y * 0.7, w: 250, h: 180 }, showHoverBox: false, highlightTitle: true });
items.titleColor = { r: 255, g: 255, b: 255, a: 1 };

var itemList = [];
var tmpList = [];
var maxItemCount = 10;
var itemsFound = 0;
var bgMusic = new Audio('audio/Snowflakes.wav');

var events = {
	init: function () {
		eventHandler.add(canvas, 'mousemove', events.mouseMove);
		eventHandler.add(window, 'keydown', events.keyDown);
		eventHandler.add(canvas, 'mousedown', events.mouseDown);
		eventHandler.add(canvas, 'mouseup', events.mouseUp);
		eventHandler.add(canvas, 'mousewheel', events.mouseWheel);
		eventHandler.add(canvas, 'DOMMouseScroll', events.mouseWheel);
		eventHandler.add(canvas, 'onmousewheel', events.mouseWheel);

		aspx.submitTable = document.getElementById('submitDiv');
		aspx.gvDbArcade = document.getElementById('gvDbArcade');
		aspx.gvDbTimeTrial = document.getElementById('gvDbTimeTrial');
		aspx.hdfGameEndTime = document.getElementById('hdfGameEndTime');
		aspx.hdfItemsPicked = document.getElementById('hdfItemsPicked');
		aspx.hdfIsArcade = document.getElementById('hdfIsArcade');

		for (var i = 1; i < aspx.gvDbArcade.rows.length; i++) {
			arcadeInfoList.push({ name: aspx.gvDbArcade.rows[i].cells[0].innerHTML,
				time: aspx.gvDbArcade.rows[i].cells[1].innerHTML,
				score: aspx.gvDbArcade.rows[i].cells[2].innerHTML
			});
		}

		for (var i = 1; i < aspx.gvDbTimeTrial.rows.length; i++) {
			timeTrialInfoList.push({ name: aspx.gvDbTimeTrial.rows[i].cells[0].innerHTML,
				time: aspx.gvDbTimeTrial.rows[i].cells[1].innerHTML,
				score: aspx.gvDbTimeTrial.rows[i].cells[2].innerHTML
			});
		}

		for (var i = 0; i < arcadeInfoList.length; i++) {
			dbRank.list.push({ text: (i + 1).toString(), textColor: { r: 0, g: 0, b: 0, a: 1} });
			dbName.list.push({ text: arcadeInfoList[i].name, textColor: { r: 0, g: 0, b: 0, a: 1} });
			dbScore.list.push({ text: arcadeInfoList[i].score, textColor: { r: 0, g: 0, b: 0, a: 1} });
			dbTime.list.push({ text: utilities.toHHMMSS(arcadeInfoList[i].time), textColor: { r: 0, g: 0, b: 0, a: 1} });
		}

		itemList.push({ name: 'Book1', img: books1 }); itemList.push({ name: 'Book2', img: books2 });
		itemList.push({ name: 'Crowbar', img: crowbar }); itemList.push({ name: 'Pencil', img: pencil });
		itemList.push({ name: 'Billiard Stick', img: billiardstick }); itemList.push({ name: 'Electric fan', img: electricfan });
		itemList.push({ name: 'Sofa', img: sofa }); itemList.push({ name: 'Toys', img: toys });
		itemList.push({ name: 'Teddy bear', img: teddybear }); itemList.push({ name: 'Necktie', img: necktie });
		itemList.push({ name: 'Small box', img: smallbox }); itemList.push({ name: 'Clock', img: clock });
		itemList.push({ name: 'Dominos', img: dominos }); itemList.push({ name: 'Telephone', img: telephone });
		itemList.push({ name: 'Table', img: table }); itemList.push({ name: 'Coins', img: coins });
		itemList.push({ name: 'Necklace', img: necklace }); itemList.push({ name: 'Magazine', img: magazine });
		itemList.push({ name: 'Triangle', img: triangle }); itemList.push({ name: 'Openbook', img: openbook });
		itemList.push({ name: 'Bouquet', img: bouquet }); itemList.push({ name: 'Notes', img: notes });
		itemList.push({ name: 'Shape toys', img: shapetoys }); itemList.push({ name: 'Shelf', img: shelf });
		itemList.push({ name: 'Happy birthday', img: happybirthday }); //	itemList.push({name: 'Basketball', img:basketball}); 
		itemList.push({ name: 'Ball', img: ball }); itemList.push({ name: 'Balloon', img: balloon });
		itemList.push({ name: 'Towel stand', img: towelstand }); itemList.push({ name: 'Pizza', img: pizza });
		itemList.push({ name: 'Crumpled paper', img: crumpledpaper }); itemList.push({ name: 'Stair', img: stair });
		itemList.push({ name: 'School supplies', img: schoolsupplies }); itemList.push({ name: 'Towel', img: towel });
		itemList.push({ name: 'Card', img: card });

		items.list = [];
		for (var i = 0; i < itemList.length; i++) {
			tmpList.push({ name: itemList[i].name, img: itemList[i].img });
		}

		tmpList.sort(function () { return (Math.round(Math.random()) - 0.5); });
		for (var i = 0; i < tmpList.length; i++) {
			for (var j = 0; j < itemList.length; j++) {
				if (i < maxItemCount) {
					if (tmpList[i].name == itemList[j].name) {
						items.list.push({ text: itemList[j].name, textColor: { r: 255, g: 255, b: 255, a: 1} });
					}
				}
				else {
					if (tmpList[i].name == itemList[j].name) { itemList[j].img[0].enableCollision = false; }
				}
				itemList[j].img[1].enableCollision = false;
			}
		}

		bgMusic.load();
		bgMusic.loop = true;
		bgMusic.volume = 0;

		gameLoop.start();
		loadProperties.reset();
	},
	mouseMove: function (e) {
		if (!gameControls.isPaused && !gameControls.isTransitioning) {
			mousePos = utilities.getMousePos(e);
			if (scene == gameScene.menu) {
				leaderboardBtn.onHover({ x: mousePos.x, y: mousePos.y, canHover: utilities.btnSingleHover(leaderboardBtn) });
				creditsBtn.onHover({ x: mousePos.x, y: mousePos.y, canHover: utilities.btnSingleHover(creditsBtn) });
				timeTrialBtn.onHover({ x: mousePos.x, y: mousePos.y, canHover: utilities.btnSingleHover(timeTrialBtn) });
				arcadeBtn.onHover({ x: mousePos.x, y: mousePos.y, canHover: utilities.btnSingleHover(arcadeBtn) });
			}
			if (scene == gameScene.end && !gameControls.isSubmitting) {
				submitBtn.onHover({ x: mousePos.x, y: mousePos.y, canHover: utilities.btnSingleHover(submitBtn) });
			}
			if (scene == gameScene.end || scene == gameScene.leaderboard) {
				homeBtn.onHover({ x: mousePos.x, y: mousePos.y, canHover: utilities.btnSingleHover(homeBtn) });
				toArcadeBtn.onHover({ x: mousePos.x, y: mousePos.y, canHover: utilities.btnSingleHover(toArcadeBtn) });
				totimeTrialBtn.onHover({ x: mousePos.x, y: mousePos.y, canHover: utilities.btnSingleHover(totimeTrialBtn) });
				leaderboard.onHover({ x: mousePos.x, y: mousePos.y });
			}
			if (scene == gameScene.arcade || scene == gameScene.timeTrial) {
				items.onHover({ x: mousePos.x, y: mousePos.y });
			}
		}
	},
	mouseDown: function (e) {
		if (!gameControls.isPaused && !gameControls.isTransitioning) {
			if (scene == gameScene.menu) {
				if (arcadeBtn.onClick({ x: mousePos.x, y: mousePos.y })) {
					gameScene.gameInit();
					timeHandler = { gameTime: 0, timeElapsed: 0, maxTime: 12 };
					transitionFade.fadeIn();
					transitionFade.midCallback(function () { scene = gameScene.arcade; utilities.resetButtons(); gameControls.isArcade = 1;  });
				}
				if (timeTrialBtn.onClick({ x: mousePos.x, y: mousePos.y })) {
					gameScene.gameInit();
					timeHandler = { gameTime: 0, timeElapsed: 0, maxTime: 12 };
					timeHandler.gameTime = timeHandler.maxTime;
					transitionFade.fadeIn();
					transitionFade.midCallback(function () { scene = gameScene.timeTrial; utilities.resetButtons(); gameControls.isArcade = 0; });
				}
				if (leaderboardBtn.onClick({ x: mousePos.x, y: mousePos.y })) {
					gameScene.leaderboardInit();
					transitionFade.fadeIn();
					transitionFade.midCallback(function () { scene = gameScene.leaderboard; utilities.resetButtons(); });
				}
				if (creditsBtn.onClick({ x: mousePos.x, y: mousePos.y }) && !gameControls.isCreditShown) {
					creditsFade.fadeIn();
					gameControls.isCreditShown = true;
				}
			}
			if (scene == gameScene.end || scene == gameScene.leaderboard) {
				if (homeBtn.onClick({ x: mousePos.x, y: mousePos.y })) {
					gameScene.menuInit();
					transitionFade.fadeIn();
					transitionFade.midCallback(function () {
						scene = gameScene.menu; utilities.resetButtons();
						gameControls = { isPaused: false, hasEscaped: false, isSubmitting: false,
							isTransitioning: false, isCreditShown: false, inGame: false, gameStart: false, isArcade: -1
						};
						timeHandler = { gameTime: 0, timeElapsed: 0, maxTime: 12 };
					});
				}
				if (toArcadeBtn.onClick({ x: mousePos.x, y: mousePos.y })) {
					transitionFade.fadeIn();
					transitionFade.midCallback(function () {
						gameControls.isArcadeShown = false;
						totimeTrialBtn.getImg().enableCollision = true;
						leaderboard.title = 'Arcade Leaderboard';

						dbRank.list = []; dbName.list = []; dbScore.list = []; dbTime.list = [];
						for (var i = 0; i < arcadeInfoList.length; i++) {
							dbRank.list.push({ text: (i + 1).toString(), textColor: { r: 0, g: 0, b: 0, a: 1} });
							dbName.list.push({ text: arcadeInfoList[i].name, textColor: { r: 0, g: 0, b: 0, a: 1} });
							dbScore.list.push({ text: arcadeInfoList[i].score, textColor: { r: 0, g: 0, b: 0, a: 1} });
							dbTime.list.push({ text: utilities.toHHMMSS(arcadeInfoList[i].time), textColor: { r: 0, g: 0, b: 0, a: 1} });
						}
					});
				}
				if (totimeTrialBtn.onClick({ x: mousePos.x, y: mousePos.y })) {
					transitionFade.fadeIn();
					transitionFade.midCallback(function () {
						gameControls.isArcadeShown = true;
						toArcadeBtn.getImg().enableCollision = true;
						leaderboard.title = 'Time Trial Leaderboard';

						dbRank.list = []; dbName.list = []; dbScore.list = []; dbTime.list = [];
						for (var i = 0; i < timeTrialInfoList.length; i++) {
							dbRank.list.push({ text: (i + 1).toString(), textColor: { r: 0, g: 0, b: 0, a: 1} });
							dbName.list.push({ text: timeTrialInfoList[i].name, textColor: { r: 0, g: 0, b: 0, a: 1} });
							dbScore.list.push({ text: timeTrialInfoList[i].score, textColor: { r: 0, g: 0, b: 0, a: 1} });
							dbTime.list.push({ text: utilities.toHHMMSS(timeTrialInfoList[i].time), textColor: { r: 0, g: 0, b: 0, a: 1} });
						}
					});
				}
			}
			if (scene == gameScene.end) {
				if (submitBtn.onClick({ x: mousePos.x, y: mousePos.y })) {
					gameControls.isSubmitting = !gameControls.isSubmitting;
					gameControls.isPaused = !gameControls.isPaused;
					aspx.submitTable.style.display = 'block';
					aspx.hdfGameEndTime.value = parseFloat(timeHandler.gameTime).toFixed(2);
					aspx.hdfItemsPicked.value = itemsFound;
					aspx.hdfIsArcade.value = gameControls.isArcade;
					utilities.resetButtons();
				}
			}
			if ((scene == gameScene.arcade || scene == gameScene.timeTrial) && gameControls.gameStart) {
				var hitOnce = false;
				for (var i = 0; i < itemList.length; i++) {
					for (var j = 0; j < items.list.length; j++) {
						if (itemList[i].img[0].hitTest({ x: mousePos.x, y: mousePos.y }) && itemList[i].img[0].enableCollision &&
								itemList[i].name == items.list[j].text && !hitOnce) {
							items.list[j] = { text: itemList[i].name, textColor: { r: 255, g: 0, b: 0, a: 1} };
							itemList[i].img[0].enableCollision = false;
							items.indxOffset = j - 3;
							itemsFound++;
							mainGame.radius += 5;
							hitOnce = true;
							break;
						}
					}
				}
			}
		}
	},
	mouseUp: function (e) {
		if (!gameControls.isPaused) { }
	},
	mouseWheel: function (e) {
		if (!gameControls.isPaused && !gameControls.isTransitioning) {
			var wheelDelta = 0;
			if (!e) e = window.event;
			if (e.detail) {
				if (e.wheelDelta) wheelDelta = e.wheelDelta / e.detail / 40 * e.detail > 0 ? 1 : -1; // Opera
				else wheelDelta = -e.detail / 3; 													// Firefox
			}
			else wheelDelta = e.wheelDelta / 120; 													// IE / Safari / Chrome

			if (wheelDelta) {
				if (leaderboard.isHovering) {
					dbRank.isHovering = dbName.isHovering = dbScore.isHovering = dbTime.isHovering = leaderboard.isHovering;
					dbRank.moveList(wheelDelta);
					dbName.moveList(wheelDelta);
					dbScore.moveList(wheelDelta);
					dbTime.moveList(wheelDelta);
				}
				if (items.isHovering && gameControls.gameStart) {
					items.moveList(wheelDelta);
				}
			}

			if (e.preventDefault)
				e.preventDefault();
			e.returnValue = false;
		}
	},
	keyDown: function (e) {
		if (e.keyCode == KEY_ESC) {
			if (!gameControls.isPaused && !gameControls.isTransitioning) {
				if (gameControls.isSubmitting) {
					gameControls.isPaused = !gameControls.isPaused;
					aspx.submitTable.style.display = 'none';
					gameControls.isSubmitting = !gameControls.isSubmitting;
				}
				if (gameControls.gameStart && (scene == gameScene.arcade || scene == gameScene.timeTrial)) {
					gameControls.hasEscaped = true;
					gameControls.inGame = false;
					gameControls.gameStart = false;
					gameScene.leaderboardInit();
					transitionFade.fadeIn();
					transitionFade.midCallback(function () {
						if (scene == gameScene.arcade) { timeHandler.gameTime += 10; }
						if (scene == gameScene.timeTrial) { timeHandler.gameTime = timeHandler.timeElapsed + 10; }
						scene = gameScene.end;
						utilities.populateLeaderboard();
					});
				}
			}
		}
		if (e.keyCode == KEY_MUSIC) {
			if (!gameControls.isPaused && !gameControls.isTransitioning) { gameControls.enableAudio = !gameControls.enableAudio; }
		}
		if (e.keyCode == KEY_PAUSE) {
			if (!gameControls.isSubmitting && !gameControls.isTransitioning) {
				gameControls.isPaused = !gameControls.isPaused;
				if (gameControls.isPaused && bgMusic.volume != 0) bgMusic.volume = 0;
				else if (!gameControls.isPaused && bgMusic.volume != 1) bgMusic.volume = 1;
			}
		}
	}
}

eventHandler.add(window, 'load', events.init);

function GameImage(src, pos, scl, ang) {
	this.position = pos;
	this.scale = scl;
	this.angle = ang;
	this.source = src;
	this.enableCollision = true;

	var imgInit = false;
	var img = new Image();
	img.src = this.source;
	imageList.push(this);
	img.onload = function () { imgInit = true; }

	this.getImgInit = function () { return imgInit; }
	this.getImgSize = function () { return { w: img.width, h: img.height} }

	this.render = function () {
		if (imgInit) {
			ctx.save();
			ctx.translate(this.position.x + (img.width * 0.5), this.position.y + (img.height * 0.5));
			ctx.rotate(this.angle * TO_RADIANS);
			ctx.scale(this.scale.x, this.scale.y);
			ctx.translate(-(img.width * 0.5), -(img.height * 0.5));
			ctx.drawImage(img, 0, 0);
			ctx.restore();

//			if (this.enableCollision) {
//				ctx.save();
//				ctx.fillStyle = 'black';
//				ctx.strokeWith = 1;
//				ctx.beginPath();
//				ctx.rect(this.position.x + ((img.width * (1 - this.scale.x)) * 0.5), this.position.y + ((img.height * (1 - this.scale.y)) * 0.5), img.width * this.scale.x, img.height * this.scale.y);
//				ctx.stroke();
//				ctx.restore();
//			}
		}
	}

	this.hitTest = function (pos) {
		if (this.enableCollision) {
			ctx.save();
			ctx.beginPath();
			ctx.rect(this.position.x + ((img.width * (1 - this.scale.x)) * 0.5), this.position.y + ((img.height * (1 - this.scale.y)) * 0.5), img.width * this.scale.x, img.height * this.scale.y);
			return ctx.isPointInPath(pos.x, pos.y);
			ctx.restore();
		}
	}
}

var loadProperties = {
	curLoad: 0,
	loadHeight: 10,
	loadWidth: 100,
	totdIndx: 0,
	isLoading: true,
	hasLoaded: false,
	reset: function () {
		this.curLoad = 0;
		this.loadHeight = 10;
		this.loadWidth = 100;
		this.totdIndx = Math.floor(Math.random() * tipOfTheDay.length);
		this.isLoading = true;
		this.hasLoaded = false;
	},
	loadBar: function () {
		ctx.save();
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = utilities.color1(225, 225, 225, 1);
		ctx.fill();
		ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = '0.3';
		ctx.translate((canvas.width * 0.5 - loadProperties.loadWidth * 0.5) + centerPos.x * 0.99, centerPos.y + centerPos.y * 0.99);
		ctx.translate(-centerPos.x, -centerPos.y);
		ctx.rect(0, 0, loadProperties.loadWidth + 6, loadProperties.loadHeight + 6);
		ctx.stroke();
		ctx.restore();

		ctx.save();
		ctx.translate((centerPos.x - loadProperties.loadWidth * 0.5) + centerPos.x, centerPos.y * 2);
		ctx.translate(-centerPos.x, -centerPos.y);
		ctx.fillStyle = utilities.color1(125, 125, 125, 1);
		ctx.fillRect(0, 0, loadProperties.curLoad, loadProperties.loadHeight);
		ctx.restore();
	}
}

var mainGame = {
	maxRadius: 100,
	radius: 0,
	visionDecreaseSpd: 2,
	init: function () {
		this.maxRadius = 100;
		this.radius = 0;
	},
	backOverlay: function () {
		bgMono.render();
		ctx.save();
		ctx.globalAlpha = 0.2;
		for (var i = 0; i < itemList.length; i++) {
			itemList[i].img[1].render();
		}
		ctx.globalAlpha = 1;
		ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.shadowBlur = 10;
		ctx.shadowColor = 'black';

		ctx.arc(mousePos.x, mousePos.y, this.radius, 0, Math.PI * 2, true);

		ctx.lineWidth = 2;
		ctx.strokeStyle = '#333333';
		ctx.stroke();
		ctx.clip();
		ctx.closePath();
	},
	frontOverlay: function () {
		ctx.beginPath();
		ctx.arc(mousePos.x, mousePos.y, this.radius, 0, Math.PI * 2, true);
		ctx.clip();
		ctx.closePath();

		background.render();
		for (var i = 0; i < itemList.length; i++) {
			itemList[i].img[0].render();
		}

		ctx.beginPath();
		if (gameControls.isTransitioning && (scene == gameScene.arcade || scene == gameScene.timeTrial))
			ctx.fillStyle = utilities.color1(0, 0, 0, transitionFade.getAlpha());
		ctx.shadowBlur = 15;
		ctx.arc(mousePos.x, mousePos.y, this.radius, 0, Math.PI * 2, true);
		ctx.stroke();
		if (gameControls.isTransitioning) ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
}

var creditText = [
{ name: 'Zheanne Nicole Ibrahim', info: 'Artist' },
{ name: 'Jeremy Plana', info: 'Artist' },
{ name: 'Anthony Ganzon', info: 'Developer' },
{ name: 'Team Banana P', info: 'All rights reserved 2014'}];

var creditIndx = 0;
var tmpSize = 0;
var indx = 1;
var changeScene = false;
function loadAssets() {
	if (indx - 1 < imageList.length && imageList[indx - 1].getImgInit()) {
		tmpSize++;
		indx++;
	}
	loadProperties.curLoad = (tmpSize / imageList.length) * 100;
}

var gameScene = {
	loading: function (dt) {
		if (loadProperties.curLoad >= loadProperties.loadWidth && !changeScene) {
			changeScene = true; gameScene.menuInit();
			transitionFade.fadeIn();
			transitionFade.midCallback(function () { scene = gameScene.menu; });
			transitionFade.endCallback(function () { bgMusic.volume = 1; bgMusic.play(); });
		}
		loadProperties.loadBar();
		if (!changeScene) utilities.printMessage(10, 'Loading... ' + parseInt(loadProperties.curLoad) + '%', utilities.color1(125, 125, 125, 1), centerPos.x, centerPos.y * 0.97);
		else utilities.printMessage(10, 'Complete! ' + parseInt(loadProperties.curLoad) + '%', utilities.color1(125, 125, 125, 1), centerPos.x, centerPos.y * 0.97);
		utilities.printMessage(10, 'TIP OF THE DAY!', utilities.color1(125, 125, 125, 1), centerPos.x, centerPos.y * 1.1);
		utilities.printMessage(10, tipOfTheDay[loadProperties.totdIndx], utilities.color1(125, 125, 125, 1), centerPos.x, centerPos.y * 1.15);
	},
	menuInit: function () {
		timeTrialBtn.init();
		arcadeBtn.init();
		leaderboardBtn.init();
		creditsBtn.init();
	},
	menu: function (dt) {
		menuBg.render();
		timeTrialBtn.render();
		arcadeBtn.render();
		leaderboardBtn.render();
		creditsBtn.render();
	},
	gameInit: function () {
		mainGame.init();

		items.list = [];
		itemsFound = 0;
		for (var i = 0; i < itemList.length; i++) {
			itemList[i].img[0].enableCollision = true;
		}

		tmpList.sort(function () { return (Math.round(Math.random()) - 0.5); });
		for (var i = 0; i < tmpList.length; i++) {
			for (var j = 0; j < itemList.length; j++) {
				if (i < maxItemCount) {
					if (tmpList[i].name == itemList[j].name) {
						items.list.push({ text: itemList[j].name, textColor: { r: 255, g: 255, b: 255, a: 1} });
					}
				}
				else {
					if (tmpList[i].name == itemList[j].name) { itemList[j].img[0].enableCollision = false; }
				}
				itemList[j].img[1].enableCollision = false;
			}
		}
		items.init();
		gameControls.inGame = true;
	},
	gameOptions: function (dt) {
		if (!gameControls.gameStart && mainGame.radius < mainGame.maxRadius && !gameControls.isTransitioning && !gameControls.isPaused) {
			mainGame.radius += 20 * dt;
			if (mainGame.radius >= mainGame.maxRadius) {
				gameControls.gameStart = true;
			}
		}
		utilities.printMessage(20, utilities.toHHMMSS(timeHandler.gameTime), utilities.color1(125, 125, 125, 1), centerPos.x, centerPos.y * 0.085);
		utilities.printMessage(10, 'Items Found (' + itemsFound + '/' + items.list.length + ')', utilities.color1(125, 125, 125, 1), centerPos.x * 1.79, centerPos.y * 0.07);
		utilities.printMessage(10, '(P) Pause/Resume', utilities.color1(125, 125, 125, 1), centerPos.x * 0.2, centerPos.y * 1.95);
		utilities.printMessage(10, '(ESC) End Game', utilities.color1(125, 125, 125, 1), centerPos.x * 0.55, centerPos.y * 1.95);
		// highlight
		utilities.highlight(utilities.color1(175, 175, 175, 0), utilities.color1(255, 255, 255, items.titleAlphaOffset * 0.5),
					utilities.color1(175, 175, 175, 0), { x: items.scrollBox.x, y: items.scrollBox.y * 1.32, w: 200, h: 30 });
		items.render(dt);

		if (gameControls.inGame && itemsFound >= items.list.length) {
			gameControls.inGame = false;
			gameControls.gameStart = false;
			this.leaderboardInit();
			transitionFade.fadeIn();
			transitionFade.midCallback(function () { scene = gameScene.end; timeHandler.gameTime = timeHandler.timeElapsed; utilities.populateLeaderboard(); });
		}
	},
	arcade: function (dt) {
		if (gameControls.gameStart && !gameControls.isPaused) { timeHandler.gameTime += dt; timeHandler.timeElapsed += dt; }
		if (gameControls.gameStart && mainGame.radius > 1) { mainGame.radius -= mainGame.visionDecreaseSpd * dt; }
		if (gameControls.gameStart && mainGame.radius <= 1) {
			gameControls.inGame = false;
			gameControls.gameStart = false;
			this.leaderboardInit();
			transitionFade.fadeIn();
			transitionFade.midCallback(function () { scene = gameScene.end; timeHandler.gameTime = timeHandler.timeElapsed; utilities.populateLeaderboard(); });
		}
		mainGame.backOverlay();
		mainGame.frontOverlay();
		utilities.printMessage(10, 'Arcade Game', utilities.color1(125, 125, 125, 1), centerPos.x * 0.15, centerPos.y * 0.07);
		this.gameOptions(dt);
	},
	timeTrial: function (dt) {
		if (gameControls.gameStart && !gameControls.isPaused && timeHandler.gameTime >= 0) { timeHandler.gameTime -= dt; timeHandler.timeElapsed += dt; }
		if (gameControls.gameStart && mainGame.radius > 1) { mainGame.radius -= timeHandler.maxTime * (timeHandler.maxTime * 0.002); }
		if (gameControls.inGame && timeHandler.gameTime < 0 || (gameControls.gameStart && mainGame.radius <= 1)) {
			timeHandler.gameTime = 0;
			gameControls.inGame = false;
			gameControls.gameStart = false;
			this.leaderboardInit();
			transitionFade.fadeIn();
			transitionFade.midCallback(function () { scene = gameScene.end; timeHandler.gameTime = timeHandler.maxTime; utilities.populateLeaderboard() });
		}
		mainGame.backOverlay();
		mainGame.frontOverlay();
		utilities.printMessage(10, 'Time Trial Game', utilities.color1(125, 125, 125, 1), centerPos.x * 0.18, centerPos.y * 0.07);
		this.gameOptions(dt);
	},
	leaderboardInit: function () {
		dbRank.init();
		dbName.init();
		dbScore.init();
		dbTime.init();
		leaderboard.init();
		leaderboard.scrollBox = { x: centerPos.x, y: centerPos.y * 1.1, w: 450, h: 180 };
		dbRank.scrollBox = { x: centerPos.x * 0.4, y: centerPos.y * 1.1, w: 100, h: 180 };
		dbName.scrollBox = { x: centerPos.x * 0.85, y: centerPos.y * 1.1, w: 250, h: 180 };
		dbScore.scrollBox = { x: centerPos.x * 1.25, y: centerPos.y * 1.1, w: 100, h: 180 };
		dbTime.scrollBox = { x: centerPos.x * 1.55, y: centerPos.y * 1.1, w: 100, h: 180 };
		submitBtn.init();
		homeBtn.init();
	},
	end: function (dt) {
		endBg.render();
		utilities.printMessage(25, 'Thank you for playing!', utilities.color1(255, 255, 255, 1), centerPos.x, centerPos.y * 0.38);
		if (gameControls.hasEscaped) {
			utilities.printMessage(15, 'Time: ' + utilities.toHHMMSS(timeHandler.gameTime), utilities.color1(255, 255, 255, 1), centerPos.x, centerPos.y * 0.47);
			utilities.printMessage(15, 'Items: ' + itemsFound + '/' + items.list.length, utilities.color1(255, 255, 255, 1), centerPos.x, centerPos.y * 0.55);
			utilities.printMessage(12, 'Escape Penalty +10', utilities.color1(255, 0, 0, 1), centerPos.x, centerPos.y * 0.61);
		}
		else {
			utilities.printMessage(15, 'Time: ' + utilities.toHHMMSS(timeHandler.gameTime), utilities.color1(255, 255, 255, 1), centerPos.x, centerPos.y * 0.5);
			utilities.printMessage(15, 'Items: ' + itemsFound + '/' + items.list.length, utilities.color1(255, 255, 255, 1), centerPos.x, centerPos.y * 0.6);
		}

		// highlight
		utilities.highlight(utilities.color1(255, 255, 255, 0), utilities.color1(255, 255, 255, 0.6),
					utilities.color1(255, 255, 255, 0), { x: leaderboard.scrollBox.x, y: leaderboard.scrollBox.y * 1.2, w: 550, h: 30 });

		dbRank.render(dt);
		dbName.render(dt);
		dbScore.render(dt);
		dbTime.render(dt);
		leaderboard.render(dt);
		submitBtn.render();
		homeBtn.render();
	},
	leaderboard: function (dt) {
		leaderboardBg.render();

		if (leaderboard.scrollBox.y != centerPos.y * 0.9) {
			leaderboard.scrollBox.y = dbRank.scrollBox.y = dbName.scrollBox.y = dbScore.scrollBox.y = dbTime.scrollBox.y = centerPos.y * 0.9;
		}

		dbRank.render(dt);
		dbName.render(dt);
		dbScore.render(dt);
		dbTime.render(dt);
		leaderboard.render(dt);
		homeBtn.render();
		if (gameControls.isArcadeShown) {
			toArcadeBtn.render();
			totimeTrialBtn.getImg().enableCollision = false;
		}
		else {
			totimeTrialBtn.render();
			toArcadeBtn.getImg().enableCollision = false;
		}
	},
	credits: function (dt) {
		if (gameControls.isCreditShown) {
			if (!gameControls.isPaused) creditsFade.updateFade(dt);
			creditsFade.startCallback(function () { gameControls.isTransitioning = false });
			creditsFade.endCallback(function () {
				if (creditIndx < creditText.length - 1) {
					creditIndx++;
					creditsFade.fadeIn();
				}
				else if (creditIndx == creditText.length - 1) {
					creditIndx = 0;
					gameControls.isCreditShown = false;
				}
			});
			utilities.printMessage(13, creditText[creditIndx].info, utilities.color1(255, 255, 255, creditsFade.getAlpha()), centerPos.x, centerPos.y * 1.73);
			utilities.printMessage(15, creditText[creditIndx].name, utilities.color1(255, 255, 255, creditsFade.getAlpha()), centerPos.x, centerPos.y * 1.8);
		}
	},
	screenFade: function (dt) {
		transitionFade.updateFade(dt);
		ctx.save();
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = utilities.color1(0, 0, 0, transitionFade.getAlpha());
		ctx.fill();
		ctx.restore();
	},
	pause: function (dt) {
		if (gameControls.isPaused) {
			ctx.save();
			ctx.rect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = utilities.color1(0, 0, 0, 0.7);
			ctx.fill();
			ctx.restore();

			if (!gameControls.isSubmitting) {
				utilities.printMessage(25, 'Game', utilities.color1(255, 255, 255, 1), centerPos.x, centerPos.y * 0.9);
				utilities.printMessage(25, 'Paused', utilities.color1(255, 255, 255, 1), centerPos.x, centerPos.y);
				utilities.printMessage(10, '(Press "P" to unpause)', utilities.color1(255, 255, 255, 1), centerPos.x, centerPos.y * 1.05);
			}
		}
	}
}

var scene = gameScene.loading;
var then = Date.now();
var gameLoop = {
	start: function () {
		then = Date.now();
		this.assetsLoad = setInterval(loadAssets, 100);
		this.updateInterval = setInterval(this.update, 1000 / FPS);
	},
	pause: function () {
		clearInterval(this.updateInterval);
		delete this.updateInterval;
	},
	resume: function () {
		if (!this.updateInterval) this.start();
	},
	update: function () {
		var now = Date.now();
		var delta = (now - then) / 1000;
		then = now;
		gameLoop.render(delta);
	},
	render: function (dt) {
		ctx.save();
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (scene == gameScene.loading) gameScene.loading(dt);
		else if (scene == gameScene.menu) gameScene.menu(dt);
		else if (scene == gameScene.arcade) gameScene.arcade(dt);
		else if (scene == gameScene.timeTrial) gameScene.timeTrial(dt);
		else if (scene == gameScene.end) gameScene.end(dt);
		else if (scene == gameScene.leaderboard) gameScene.leaderboard(dt);
		else gameScene.menu(dt);

		if (scene == gameScene.menu) gameScene.credits(dt);
		else { creditIndx = 0; gameControls.isCreditShown = false }
		gameScene.pause(dt);
		gameScene.screenFade(dt);
		utilities.printMessage(15, 'v1.1', utilities.color1(125, 125, 125, 1), centerPos.x * 1.92, centerPos.y * 1.96);
		ctx.restore();
	}
}

var utilities = {
	color1: function (r, g, b, a) {
		return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
	},
	color2: function (col) {
		return 'rgba(' + col.r + ',' + col.g + ',' + col.b + ',' + col.a + ')';
	},
	lerp: function (frm, to, time) {
		return (frm + time * (to - frm));
	},
	populateLeaderboard: function () {
		if (gameControls.isArcade) {
			leaderboard.title = 'Arcade Leaderboard';

			dbRank.list = []; dbName.list = []; dbScore.list = []; dbTime.list = [];
			for (var i = 0; i < arcadeInfoList.length; i++) {
				dbRank.list.push({ text: (i + 1).toString(), textColor: { r: 0, g: 0, b: 0, a: 1} });
				dbName.list.push({ text: arcadeInfoList[i].name, textColor: { r: 0, g: 0, b: 0, a: 1} });
				dbScore.list.push({ text: arcadeInfoList[i].score, textColor: { r: 0, g: 0, b: 0, a: 1} });
				dbTime.list.push({ text: utilities.toHHMMSS(arcadeInfoList[i].time), textColor: { r: 0, g: 0, b: 0, a: 1} });
			}
		}
		else {
			leaderboard.title = 'Time Trial Leaderboard';

			dbRank.list = []; dbName.list = []; dbScore.list = []; dbTime.list = [];
			for (var i = 0; i < timeTrialInfoList.length; i++) {
				dbRank.list.push({ text: (i + 1).toString(), textColor: { r: 0, g: 0, b: 0, a: 1} });
				dbName.list.push({ text: timeTrialInfoList[i].name, textColor: { r: 0, g: 0, b: 0, a: 1} });
				dbScore.list.push({ text: timeTrialInfoList[i].score, textColor: { r: 0, g: 0, b: 0, a: 1} });
				dbTime.list.push({ text: utilities.toHHMMSS(timeTrialInfoList[i].time), textColor: { r: 0, g: 0, b: 0, a: 1} });
			}
		}
	},
	btnSingleHover: function (btn) {
		return btn.hovered != (!creditsBtn.hovered && !leaderboardBtn.hovered &&
			!arcadeBtn.hovered && !timeTrialBtn.hovered && !submitBtn.hovered && !homeBtn.hovered &&
			!toArcadeBtn.hovered && !totimeTrialBtn.hovered);
	},
	highlight: function (startColor, midColor, endColor, box) {
		ctx.save();
		ctx.translate(box.x - (box.w * 0.5), box.y - (box.h * 0.5));
		var grd = ctx.createLinearGradient(0, 0, box.w, box.h);
		grd.addColorStop(0, startColor);
		grd.addColorStop(0.5, midColor);
		grd.addColorStop(1, endColor);
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, box.w, box.h);
		ctx.restore();
	},
	resetButtons: function () {
		creditsBtn.hovered = leaderboardBtn.hovered = arcadeBtn.hovered =
		timeTrialBtn.hovered = submitBtn.hovered = homeBtn.hovered = false;
		creditsBtn.setScale(creditsBtn.origScale); leaderboardBtn.setScale(leaderboardBtn.origScale);
		timeTrialBtn.setScale(timeTrialBtn.origScale); arcadeBtn.setScale(arcadeBtn.origScale);
		submitBtn.setScale(submitBtn.origScale); homeBtn.setScale(homeBtn.origScale);
	},
	toHHMMSS: function (t) {
		var hrs = Math.floor(t / 3600);
		var mins = Math.floor((t - (hrs * 3600)) / 60);
		var secs = t - (hrs * 3600) - (mins * 60);

		//if (hrs < 10) hrs = '0' + hrs;
		(t > 60 && mins < 10) ? mins = '0' + mins + ':' : mins = '';
		(secs < 10) ? secs = '0' + secs.toFixed(2) : secs = secs.toFixed(2);

		var time = mins + secs;
		return time;
	},
	getMousePos: function (e) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	},
	printMessage: function (size, str, color, x, y) {
		ctx.save();
		ctx.textAlign = 'center';
		ctx.font = size + TEXT_TYPE;
		ctx.fillStyle = color;
		ctx.fillText(str, x, y);
		ctx.restore();
	}
}