Router.route('/', function(){

  this.render('signIn', { to: 'sign' });
}, { name: 'home' });

Router.route('/Forgot', { 
  yieldRegions: { 'signForgot': {to: 'sign'} },
  name: 'forgot' 
});
 //  template: 'Post',
 // yieldRegions: {
 //    'MyAside': {to: 'aside'},
 //    'MyFooter': {to: 'footer'}
 //  },
 //  onBeforeAction: function () { this.next(); },
 //  onAfterAction: function () { this.next(); },