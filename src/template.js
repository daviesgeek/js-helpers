"use strict";

var Template = {};

Template.find = function (name) {
  if(Template._cache[name])
    return Template.getFromCache(name);

  var templates = [].slice.call(document.getElementsByTagName('script')).filter(function (item) {
    return item.getAttribute('type') == 'text/template'
  })

  for (var i = 0; i < templates.length; i++) {
    Template.addtoCache(templates[i].getAttribute('name'), templates[i])
  }

  return Template.getFromCache(name)
}

Template.addtoCache = function (name, element) {
  Template._cache[name] = element
}

Template.getFromCache = function (name) {
  return Template._cache[name].innerHTML
}

Template._cache = {};

window.Template = Template;