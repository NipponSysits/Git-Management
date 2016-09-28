import '../ui/layouts/sign';
import '../ui/layouts/main.js';

const SignAccess = function(context, redirect) {
  if(Meteor.userId()) {
    if (Session.get('redirect')) {
      redirect(Session.get('redirect'));
    } else {
      redirect('repository');
      //redirect('dashboard', { username: Meteor.user().username });
    }
  }
}

var signRoutes = FlowRouter.group({
  prefix: '/Member',
  triggersEnter: [SignAccess],
  action: function(){
    
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