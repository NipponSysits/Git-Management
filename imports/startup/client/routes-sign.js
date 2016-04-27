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

FlowRouter.route('/SignAccount', {
  name: 'sign',
  action() {
  	BlazeLayout.render('app_body', { sign: 'SignIn' });
  },
});

// handling /admin route
signRoutes.route('/SignIn', {
  name: 'sign',
  action: function() {
    BlazeLayout.render('app_body', { sign: 'SignIn' });
  },
  triggersEnter: [function(context, redirect) {
    console.log('running /admin trigger');
  }]
});

// handling /admin/posts
signRoutes.route('/TroubleSigning', {
  name: 'trouble',
  action: function() {
    BlazeLayout.render('app_body', { sign: 'SignIn' });
  }
});