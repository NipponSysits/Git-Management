import './error.html';

Template.error.onRendered(() => {
  $('.ui.basic.modal.feature-exception').modal();
  var onSignIn = function(){
    // $('.ui.dimmer.component').transition('hide');
    $(window).resize();
    $('.user-menu').hide();

    $('.ui.dimmer.prepare').fadeOut(300);
    $('.ui.panel.sign-in').fadeIn(300);
    $('.ui.access.grid').show();
  }
  onSignIn();

  
});
