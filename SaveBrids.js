var w = 35;//地板宽
var h = 35;//地板长
var curMap; //当前地图数据数组，初始与CurLevel相同，游戏中改变
var oldMap; //保存上次女孩移动前地图数据数组
var CurLevel;//当前级地图数据，游戏中不变，用来判断游戏是否结束
var iCurLevel = 0;//当前是第几关
var curMan;//当前女孩图片
var UseTime = 0;//当前关用时，单位：秒
var MoveTimes = 0;//移动次数 
var lastBombTime = 0;
//获取图片
var mycanvas = document.getElementById('myCanvas');
var context = mycanvas.getContext('2d');
var block = document.getElementById("block");
var box = document.getElementById("box");
var wall = document.getElementById("wall");
var ball = document.getElementById("ball");
var redbox = document.getElementById("redbox");
var pdown = document.getElementById("pdown");
var pup = document.getElementById("pup");
var pleft = document.getElementById("pleft");
var pright = document.getElementById("pright");
var msg = document.getElementById("msg");
var image2 = new Image();
image2.src = "Res/bomb.png";//爆炸图片
var myVar1, myVar2, myVar3, myVar4;//定时器变量
var bombtime = 0;//炸弹次数


//爆炸动画
var Bomb = function (image, x, y) {
	this.image = image;
	this.x = x;
	this.y = y;
	this.width = image.width / 6;
	this.height = image.height;
	this.frm = new Int8Array(4);
	this.dis = new Int8Array(4);
};
//获取当前位置
function Point(x, y) {
	this.x = x;
	this.y = y;
}
//人物初始位置
var per_position = new Point(5, 5);
//游戏初始化
function init() {
	timer = 0;
	lastBombTime = Date.now();
	initLevel();
	showMoveInfo();
}
//初始化关卡
function initLevel() {
	curMap = copyArray(levels[iCurLevel]);//拷贝的是一个副本
	oldMap = copyArray(curMap);
	CurLevel = copyArray(levels[iCurLevel]);
	curMan = pdown;
	DrawMap(curMap);    //画小鸟、墙、人物、目的地信息

}


//画通道，平铺方块
function InitMap() {
	for (var i = 0; i < CurLevel.length; i++) {
		for (var j = 0; j < CurLevel[i].length; j++) {
			context.drawImage(block, w * i, h * j, w, h);//w,h为32*32(即图片的大小)
		}
	}
}
//画游戏界面
function DrawMap(level) {
	InitMap();          //画通道，平铺方块(整个画面全是画方块)
	for (i = 0; i < level.length; i++)//行号
	{
		for (j = 0; j < level[i].length; j++)//列号
		{
			var pic = block;
			switch (level[i][j]) {
				case 0://通道
					pic = block;
					break;
				case 1://墙
					pic = wall;
					break;
				case 2://鸟巢
					pic = ball;
					break;
				case 3://小鸟
					pic = box;
					break;
				case 4://女孩
					pic = curMan;
					per_position.x = j;//x,y参照坐标系
					per_position.y = i;
					break;
				case 5://小鸟在鸟巢中
					pic = redbox;
					break;

			}
			context.drawImage(pic, w * j, h * i, pic.width, pic.height);//绘制函数
		}
	}
}


function go(dir) {
	var p1;
	var p2;

	switch (dir) {
		case "left":
			curMan = pleft; //人物图片为向左走的图片
			p1 = new Point(per_position.x - 1, per_position.y);
			p2 = new Point(per_position.x - 2, per_position.y);
			break;
		case "right":
			curMan = pright; //人物图片为向右走的图片
			p1 = new Point(per_position.x + 1, per_position.y);
			p2 = new Point(per_position.x + 2, per_position.y);
			break;
		case "up":
			curMan = pup;//人物图片为向上走的图片
			p1 = new Point(per_position.x, per_position.y - 1);
			p2 = new Point(per_position.x, per_position.y - 2);
			break;

		case "down":
			curMan = pdown; //人物图片为向下走的图片
			p1 = new Point(per_position.x, per_position.y + 1);
			p2 = new Point(per_position.x, per_position.y + 2);
			break;
	}
	if (TryGo(p1, p2))//如果能够移动
	{
		this.MoveTimes++;//次数加1
		showMoveInfo(); //显示移动次数信息
	}
	//InitMap();
	DrawMap(curMap);
	if (CheckFinish()) {
		alert("恭喜过关。");
		NextLevel(1);//开始下一关
	}
}

//判断是否有墙
function judge() {
	var x = per_position.x;
	var y = per_position.y;
	if (x < 0) return false;
	if (y < 0) return false;
	if (y >= curMap.length) return false;
	if (x >= curMap[0].length) return false;

	//判断右边是否有墙
	if (x + 1 < curMap[0].length && curMap[y][x + 1] == 1) {
		var bomb = new Bomb(image2, x + 1, y);
		myVar1 = setInterval(function () {//启动定时器
			bomb.draw2(context, x + 1, y, 0);
		}, 1000 / 60);
	}
	if (x - 1 >= 0 && curMap[y][x - 1] == 1) {
		var bomb = new Bomb(image2, x - 1, y);
		myVar2 = setInterval(function () {
			bomb.draw2(context, x - 1, y, 1);
		}, 1000 / 60);
	}

	if (y + 1 < curMap.length && curMap[y + 1][x] == 1) {
		var bomb = new Bomb(image2, x, y + 1);
		myVar3 = setInterval(function () {
			bomb.draw2(context, x, y + 1, 2);
		}, 1000 / 60);
	}
	if (y - 1 >= 0 && curMap[y - 1][x] == 1) {
		var bomb = new Bomb(image2, x, y - 1);
		myVar4 = setInterval(function () {
			bomb.draw2(context, x, y - 1, 3);
		}, 1000 / 60);
	}
}

Bomb.prototype.draw2 = function (ctx, wallx, wally, dir) {
	ctx.save();
	// ctx.translate(this.x, this.y);
	switch (dir) {
		case 0:
			{
				if (this.frm[0] >= 6) {
					clearInterval(myVar1);
					curMap[wally][wallx] = 0;
					context.clearRect(0, 0, w * 16, h * 16);//清除上下文
					DrawMap(curMap);    //画小鸟、墙、人物、目的地信息
					this.frm[0] = 0;
					return;
				}
				break;
			}
		case 1:
			{
				if (this.frm[1] >= 6) {
					clearInterval(myVar2);
					curMap[wally][wallx] = 0;
					context.clearRect(0, 0, w * 16, h * 16);
					DrawMap(curMap);    //画小鸟、墙、人物、目的地信息
					this.frm[1] = 0;
					return;
				}
				break;
			}
		case 2:
			{
				if (this.frm[2] >= 6) {
					clearInterval(myVar3);
					curMap[wally][wallx] = 0;
					context.clearRect(0, 0, w * 16, h * 16);
					DrawMap(curMap);    //画小鸟、墙、人物、目的地信息
					this.frm[2] = 0;
					return;
				}
				break;
			}
		case 3:
			{
				if (this.frm[3] >= 6) {
					clearInterval(myVar4);
					curMap[wally][wallx] = 0;
					context.clearRect(0, 0, w * 16, h * 16);
					DrawMap(curMap);    //画小鸟、墙、人物、目的地信息
					this.frm[3] = 0;
					return;
				}
				break;
			}
	}
	ctx.drawImage(this.image, this.frm[dir] * this.width, 0, this.width, this.height, wallx * w, wally * h, this.width, this.height);
	ctx.restore();
	this.dis[dir]++;
	if (this.dis[dir] >= 10) {//10帧换图
		this.dis[dir] = 0;
		this.frm[dir]++;
	}
}

function TryGo(p1, p2) //判断是否可以移动
{
	//越界处理
	if (p1.x < 0) return false;
	if (p1.y < 0) return false;
	if (p1.y >= curMap.length) return false;
	if (p1.x >= curMap[0].length) return false;

	if (curMap[p1.y][p1.x] == 1) return false;//如果是墙，不能通行
	if (curMap[p1.y][p1.x] == 3 || curMap[p1.y][p1.x] == 5)//如果是小鸟，继续判断前一格
	{
		if (curMap[p2.y][p2.x] == 1 || curMap[p2.y][p2.x] == 3 ||
			curMap[p2.y][p2.x] == 5)//前一格如果是墙或小鸟都不能前进				 
			return false;
		if (curMap[p2.y][p2.x] == 0 || curMap[p2.y][p2.x] == 2)//如果P2为通道或者目的地
		{
			oldMap = copyArray(curMap);		//记录现在地图
			//小鸟前进一格
			curMap[p2.y][p2.x] = 3;
			//如果原始地图是目的地或者是放到鸟巢的小鸟
			if (CurLevel[p2.y][p2.x] == 2 || CurLevel[p2.y][p2.x] == 5) {
				curMap[p2.y][p2.x] = 5;
			}
		}
	}
	canReDo = true;
	//女孩前进一格
	curMap[p1.y][p1.x] = 4;
	//处理女孩原来位置是否显示目的地还是通道平地
	var v = CurLevel[per_position.y][per_position.x];	//获取女孩原来位置原始地图信息
	if (v == 2 || v == 5)  //如果原来是目的地
		curMap[per_position.y][per_position.x] = 2;
	else
		curMap[per_position.y][per_position.x] = 0;//显示通道平地

	per_position = p1;//记录位置
	return true;
}

//判断是否完成本关
function CheckFinish() {
	for (var i = 0; i < curMap.length; i++)//行号
	{
		for (var j = 0; j < curMap[i].length; j++)//列号
		{
			if (CurLevel[i][j] == 2 && curMap[i][j] != 5 || CurLevel[i][j] == 5 && curMap[i][j] != 5)//如果目标位置上没放上箱子，则还没结束
			{
				return false;
			}
		}
	}
	return true;
}
//判断用户按键获取移动方向
function DoKeyDown(event) {
	event.preventDefault();
	switch (event.keyCode) {
		case 37://left
			go('left');
			break;
		case 38://up
			go('up');
			break;
		case 39://right
			go('right');
			break;
		case 40://down
			go('down');
			break;
		case 32://空格键
			if (Date.now() - lastBombTime >= 1500) {
				if (bombtime >= 3) {
					alert("炸弹使用次数以达上限");
					return;
				}
				judge();//判断小人周围是否有墙;
				bombtime++;
				lastBombTime = Date.now();
			}			
			break;

	}
}

function NextLevel(i)//初始化下i关
{
	bombtime--;
	//bombtime=0;
	iCurLevel = iCurLevel + i;
	if (iCurLevel < 0) {
		iCurLevel = 0;
		return;
	}
	var len = levels.length;
	if (iCurLevel > len - 1) {
		iCurLevel = len - 1;
		return;
	}
	initLevel();
	UseTime = 0;
	MoveTimes = 0;
	showMoveInfo();
}

var showHelp = false;
function DoHelp() {
	showHelp = !showHelp;
	if (showHelp)
		msg.innerHTML = "用键盘上的上、下、左、右键移动小女孩，空格放炸弹，把小鸟全部推到鸟巢的位置即可过关。" +
			"小鸟只可向前推，不能往后拉，并且小女孩一次只能推动一只小鸟。按下空格可炸毁周围上下左右的墙。"
			+ "炸弹数量有限制，但每完成一关获得一个炸弹。";
	else {
		msg.innerText = "	";
		showHelp = false;
	}

}
//显示游戏信息
function showMoveInfo() {
	msg1.innerHTML = "第" + (iCurLevel + 1) + "关 移动次数：" + MoveTimes + "炸弹数量：" + (3 - bombtime);
}
var canReDo = false;
function Redo() {
	if (canReDo == false)//不能撤销
		return;
	//恢复上次地图
	curMap = copyArray(oldMap);
	for (var i = 0; i < curMap.length; i++)//行号
	{
		for (var j = 0; j < curMap[i].length; j++)//列号
		{
			if (curMap[i][j] == 4)//如果此处是人
			{
				per_position = new Point(j, i);//更新人的位置
			}
		}
	}
	this.MoveTimes--; //次数减1
	canReDo = false;
	showMoveInfo(); //显示移动次数信息
	DrawMap(curMap); //画箱子、墙、人物、目的地信息
}
//克隆二维数组
function copyArray(arr) {
	var b = [];
	for (i = 0; i < arr.length; i++) {
		b[i] = arr[i].concat();//
	}
	return b;
}