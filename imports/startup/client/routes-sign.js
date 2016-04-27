import '../../ui/layouts/sign';

var signRoutes = FlowRouter.group({
  prefix: '/Account',
  triggersEnter: [function(context, redirect, stop) {
    console.log('running group triggers');
    if(false) {
    	FlowRouter.go('home');
    	stop();
    }
  }]
});

// handling /admin route
signRoutes.route('/SignIn', {
  name: 'sign',
  action: function() {
    BlazeLayout.render('app', { sign: 'SignIn' });
  }
});

// handling /admin/posts
signRoutes.route('/TroubleSigning', {
  name: 'trouble',
  action: function() {
    BlazeLayout.render('app', { sign: 'Troubleshoot' });
  }
});