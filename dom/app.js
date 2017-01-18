DOM.onReady(function () {
  var element = DOM('#spanID');
  element.addClass('working');
  element.removeClass('working');
  console.log(element.getAttribute('class')));
});
