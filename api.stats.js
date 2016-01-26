// =IF(YEAR<1,
// 	0,
// 	IF(YEAR==2,
// 		51*60,
// 		IF(YEAR<3,
// 			(51*60*J6/365),
// 			IF(YEAR==4,
// 				68*60,
// 				IF(YEAR<5,
// 				(51*60*(365-J6)/365)+(68*60*J6/365),
// 				IF(YEAR<6,(68*60*(365-J6)/365)+(85*60*J6/365),102*60))
// 			)
// 		)
// 	)
// )

var assign = new Date('2013-04-29');

var QuotaSick = 51*60; // 51 Hour
var QuotaVacation = 0;
var YEAR = 1;
var MONTH = 1;
var DAY = 1;

if(YEAR<1) {
	51*60*DAY/365
} else {
	51*60
}

if(YEAR<1) {
	0
} else if(YEAR==2){
	51*60
} else if(YEAR<3) {
	(51*60*DAY/365)
} else if(YEAR==4) {
	68*60
} else if(YEAR<5) {
	(51*60*(365-DAY)/365)+(68*60*DAY/365)
} else if(YEAR<6) {
	(68*60*(365-DAY)/365)+(85*60*DAY/365),102*60)
}