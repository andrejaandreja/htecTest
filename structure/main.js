/**
 * pocetno ucitavanje main div-a i inicijalizovanje objekta dispatcher-a
 */
window.onload = function() {
    const mainDiv = document.getElementById('main-div');
    const dispatcher = new Dispatcher(mainDiv);
}