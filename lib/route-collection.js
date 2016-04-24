Router.route('/', function(){
  this.render('signIn', { to: 'sign' });
}, { name: 'home' });

Router.route('/:username', function(){
  this.render('dashboard');
}, { name: 'dashboard' });

Router.route('/Troubleshoot', { 
  name: 'trouble',
  yieldRegions: { 'signTroubleshoot': {to: 'sign'} },
});

Router.route('/ForgotPassword', { 
  name: 'forgot',
  yieldRegions: { 'signForgot': {to: 'sign'} },
});

Router.route('/CreateAccount', { 
  name: 'register',
  yieldRegions: { 'signRegister': {to: 'sign'} },
});



 //  template: 'Post',
 // yieldRegions: {
 //    'MyAside': {to: 'aside'},
 //    'MyFooter': {to: 'footer'}
 //  },
 //  onBeforeAction: function () { this.next(); },
 //  onAfterAction: function () { this.next(); },