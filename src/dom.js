"use strict";

var DOM = function(selector) {
  var firstChar = selector.slice(0,1);
  var element;

  if (firstChar === '#') {
    element = DOM._getById(selector.slice(1));
  } else if (firstChar === '.') {
    element = DOM._getByClass(selector.slice(1));
  } else {
    element = DOM._getByTag(selector.slice(1));
  }

  return DOM._wrap(element);
};

DOM._readyHandlers = [];

DOM.onReady = function (func) {
  DOM._readyHandlers.push(func);
}

DOM._getById = function(id) {
  return document.getElementById(id);
};

DOM._getByClass = function(className) {
  return document.getElementsByClassName(className);
};

DOM._getByTag = function (tag) {
  return document.getElementsByTagName(tag);
};

DOM._wrap = function (element) {
  if(element instanceof Array) {
    return new Element(element);
  } else {
    return new Element([element]);
  }
};

DOM._isLoaded = function () {
  for (var i = 0; i < DOM._readyHandlers.length; i++) {
    DOM._readyHandlers[i]();
  }
}

document.addEventListener('DOMContentLoaded', DOM._isLoaded, false);

var Element = function (elements) {

  Object.defineProperty(this, '_elements', {
    value: elements,
    enumerable: false,
  });

  this._loop = function (array, func) {
    return function() {
      var results = [];
      for (var i = 0; i < array.length; i++) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(array[i]);
        results.push(func.apply(func, args));
      }

      results = results.filter(function (item) {
        return item && item !== undefined;
      });

      if (results.length == 1) {
        return results[0];
      } else if (results.length) {
        return results;
      } else {
        return this;
      }
    }
  };

  this.addClass = this._loop(this._elements, function (element, className) {
    if(element.className.split(' ').indexOf(className) === -1) {
      if(element.className.length) {
        element.className += ' ';
      }

      element.className += className;
    }
  });

  this.removeClass = this._loop(this._elements, function (element, className) {
    var classes = element.className.split(' '),
        index = classes.indexOf(className);

    if(index !== -1) {
      element.className = element.className.replace(className, '').trim();
    }
  })

  this.getAttribute = this._loop(this._elements, function (element, attribute) {
    return element.getAttribute(attribute);
  });

  this.setAttribute = this._loop(this._elements, function (element, attribute, value) {
    element.setAttribute(attribute, value);
  });

  this.removeAttribute = this._loop(this._elements, function (element, attribute) {
    element.removeAttribute(attribute);
  });

};

window.DOM = DOM;