var express = require('express'), router = express.Router();

//  using GET, POST, PUT, DELETE, or any other HTTP request method.

router.get('/submit',function(req, res){
  	res.render('index', { menu: []});
});

router.post('/:id(__\\w+)',function(req, res){
 //    var id = req.params.id, com = null;
 //    var navigator = require('./../config/menu_navigator');
	// console.log("<", (req.ip == config.web.ip ? 'localhost' : req.ip), 'get.component('+id+')');
	
	// for (var i in navigator) { if(navigator[i].id == id) { com = navigator[i].com; break; } }

 //  	if(com != null) {
	// 	res.render('component/'+com, { menu: []});
	// } else {
	// 	res.status(404).send('Component Not Found 404');
	// }
	res.send('Component');
});

module.exports = router;