import { Template } from 'meteor/templating';

import './sign-in.html';

let toPanelSignId = function(self){
  self.$('.ui.button.sign-in').css({ 'border-radius': 0 });
  self.$('.ui.button.sign-back, .or.sign-or').hide();
  self.$('.form.sign-in .sign-image').hide();
  self.$('.form.sign-in .sign-id').show();
}

let toPanelSignImage = function(self, email){
  self.$('.ui.button.sign-in').removeAttr('style');
  self.$('.ui.button.sign-back, .or.sign-or').show();
  self.$('.form.sign-in .sign-id').hide();
  self.$('.form.sign-in .sign-image').show();
  self.$('.ui.sign-in.form').form('get field','email').val(email);
  self.$('.form.sign-in .sign-avartar').avatar(email, 256);
  self.$('.form.sign-in .sign-email').html(email);
}

Template.SignIn.events({
  'change .ui.remember-id input': function(event) {
  	T.Storage('signin-remember-id', event.target.checked ? 'check': 'uncheck');
  },
  'click #sign-trouble': function(event){
  	// $('.form.sign-in').transition('fade right', function(){
  		FlowRouter.go('trouble');
  	// });
  },
  'click .sign-in.button': function(){
  	console.log('click .sign-in.button');

  	return false;
  },
  'click .sign-back.button': function(){
  	toPanelSignId(self);
  }
});

Template.SignIn.helpers({
  rememberId: function () {
    return '';
  }
});

Template.SignIn.onRendered(function() {
  var self = this;
  T.Storage('signin-username', 'kem@ns.co.th');
  $('.ui.remember-id').checkbox(T.Storage('signin-remember-id') || 'uncheck');  // 

  if(T.Storage('signin-remember-id') == 'check' && T.Storage('signin-username')) {
    toPanelSignImage(self, T.Storage('signin-username'));
  } else {
    toPanelSignId(self);
  }
});