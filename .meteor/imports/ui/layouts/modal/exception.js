import './exception.html';

Template.Exception.onRendered(() => {
  var uiEX = '.ui.modal.feature-exception';
  $(uiEX).modal({ closable: false, duration: 0 });
  $('.ui.button.refresh-exception').click(function(){
    location.reload();
  });

  $(uiEX+' div.description>p').html('Page not found');
  $(uiEX+' div.header').html('Not Found');
  $(uiEX).modal('show');  
  
});