const base = 10, rate = 1.2;

let calcExp = function(lv){
	return lv <= 0 ? 0 : calcNext(lv) + calcExp(lv-1);
}

let calcNext = function(lv){
	return Math.ceil(base*Math.pow(rate,lv));
}

let calcPercent = function(exp) {
	let lv = calcLevel(exp);
	return ((exp - calcExp(lv-1)) * 100 / calcNext(lv)).toFixed(2) + '%';
};

let calcLevel = function(exp){
	let lv = 1;
	while (exp > 0) { exp -= calcNext(lv); lv++; }
	return lv-(exp==0 ? 0 : 1);
}


module.exports = function(exp){
	let level = calcLevel(exp);
	return {
		level: level,
	  exp: exp - calcExp(level - 1),
	  next: calcNext(level),
	  percent: calcPercent(exp)
	}
}