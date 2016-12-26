import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

let localization = require('counterpart');
let counterpart = new localization.Instance();

module.exports = function(template_name){
	let language = {}

	switch(Session.get('LANGUAGE') || 'en-EN') {
		case 'en-EN': counterpart.registerTranslations('en', require('./en-EN.js')); break;
		// case 'th-TH': language = require('./th-TH.js'); break;
	}

	let translate = function(obj){
		let text = counterpart.translate((typeof obj == 'string') ? [template_name, obj] : (typeof obj == 'object') ? ([template_name]).concat(obj) : obj);

		return text.indexOf('missing translation') != 0 ? text : (typeof obj == 'object') ? obj.join(' ') : obj;
	}

	Template[template_name].helpers({ translate: translate });
	return translate
}