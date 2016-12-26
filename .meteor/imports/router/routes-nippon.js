import '../ui/layouts/sign';
import '../ui/layouts/main.js';

// const SignAccess = function(context, redirect) {
//   if(Meteor.userId()) {
//     if (Session.get('redirect')) {
//       redirect(Session.get('redirect'));
//     } else {
//       redirect('repository');
//       //redirect('dashboard', { username: Meteor.user().username });
//     }
//   }
// }

var nipponRoutes = FlowRouter.group({
  prefix: '/NipponSysits',
  // triggersEnter: [SignAccess],
  action: function(){
    
  }
});

nipponRoutes.route('/', {
  name: 'nippon',
  action: function() {
    BlazeLayout.render('app', { 
      navigator: 'Navigator',
      main: 'Nippon'
    });
  }
});
