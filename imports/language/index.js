import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

module.exports = function(template_name){
	let language = {}
	switch(Session.get('LANGUAGE') || 'en-EN') {
		case 'en-EN': language = require('./en-EN.js'); break;
		case 'th-TH': language = require('./th-TH.js'); break;
	}

	if(language[template_name] == undefined) throw 'Language is not found.';

	language = language[template_name];
	for (var id in language) {
		language[id] = function() { return language[id]; }
	}
	// SET LANGUAGE
	Template[template_name].helpers(language);
}