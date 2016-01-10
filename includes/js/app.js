window.State = _HandleState();
window.onpopstate = function(event) {
    window.State = _HandleState();
    T.StateCompile(event);
};
$(function(){
    T.StateCompile();
});