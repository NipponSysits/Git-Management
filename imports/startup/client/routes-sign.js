import '../../ui/layouts/sign';

var signRoutes = FlowRouter.group({
  prefix: '/Member',
  action: function(){
    
  }
});

signRoutes.route('/SignIn', {
  name: 'sign',
  action: function() {
    BlazeLayout.render('app', { sign: 'SignIn' });
  }
});

signRoutes.route('/Troubleshoot', {
  name: 'trouble',
  action: function() {
    BlazeLayout.render('app', { sign: 'Troubleshoot' });
  }
});

signRoutes.route('/ForgotPassword', {
  name: 'forgot',
  action: function() {
    BlazeLayout.render('app', { sign: 'Forgot' });
  }
});
signRoutes.route('/Newbie', {
  name: 'register',
  action: function() {
    BlazeLayout.render('app', { sign: 'Register' });
  }
});