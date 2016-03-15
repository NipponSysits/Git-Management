Router.route('/', function(){

  this.render('signIn', { to: 'sign' });
}, { name: 'home' });

Router.route('/Troubleshoot', { 
  name: 'forgot',
  yieldRegions: { 'signForgot': {to: 'sign'} },
});

 //  template: 'Post',
 // yieldRegions: {
 //    'MyAside': {to: 'aside'},
 //    'MyFooter': {to: 'footer'}
 //  },
 //  onBeforeAction: function () { this.next(); },
 //  onAfterAction: function () { this.next(); },