const base = 10, rate = 1.2;
let calcExp = function(lv){
	return lv <= 0 ? 0 : calcNext(lv) + calcExp(lv-1);
}

let calcNext = function(lv){
	return Math.ceil(base*Math.pow(rate,lv));
}

let calcPercent = function(exp) {
	let lv = calcLevel(exp);
	return Math.floor((exp - calcExp(lv-1)) * 100 / calcNext(lv)) + '%';
};

let calcLevel = function(exp){
	let lv = 1;
	while (exp > 0) { exp -= calcNext(lv); lv++; }
	return lv-(exp==0 ? 0 : 1);
}

var level = function(exp){
	this.level = calcLevel(exp);
	this.exp = exp - calcExp(this.level - 1);
	this.next = calcNext(this.level);
	this.percent = calcPercent(exp);
}


for (var i = 1; i <= 30; i+=1) {
	var user = new level(i);
	console.log('\tExperience:', i,'\tLv.'+user.level, '\tExp '+ user.exp + '/' + user.next, '('+user.percent+')');
}


// 	{
//   get : function(exp){

//   },
//   exp : function(lv){  },
//   calcNext : function(lv) {  },
//   calcPercent : function(exp){  }
// }