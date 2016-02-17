window.State = __.Pop();
window.onpopstate = function(event) {
    window.State = __.Pop();
    T.StateCompile(false);
};
$(function(){ T.StateCompile(true); });