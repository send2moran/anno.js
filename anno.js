// Generated by CoffeeScript 1.7.1
var Anno, AnnoButton,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Anno = (function() {
  var _returnFromOnShow;

  function Anno(arg) {
    var key, options, others, val;
    if (arg.__proto__ === Array.prototype) {
      options = arg.shift();
      others = arg;
    } else {
      options = arg;
    }
    if (options instanceof Anno) {
      console.warn('Anno constructor parameter is already an Anno object.');
    }
    if (options == null) {
      console.warn("new Anno() created with no options.  It's recommended to supply at least target and content.");
    }
    for (key in options) {
      val = options[key];
      if (key === 'chainTo' || key === 'start' || key === 'show' || key === 'hide' || key === 'hideAnno' || key === 'chainSize' || key === 'chainIndex' || key === 'version') {
        console.warn("Anno: Overriding '" + key + "' is not recommended.  Can you override a delegated function instead?");
      }
    }
    for (key in options) {
      val = options[key];
      this[key] = val;
    }
    if ((others != null ? others.length : void 0) > 0) {
      this.chainTo(new Anno(others));
    }
    return;
  }

  Anno.setDefaults = function(options) {
    var key, val, _results;
    _results = [];
    for (key in options) {
      val = options[key];
      _results.push(Anno.prototype[key] = val);
    }
    return _results;
  };

  Anno.prototype.chainTo = function(obj) {
    if (obj != null) {
      if (this._chainNext == null) {
        this._chainNext = obj instanceof Anno ? obj : new Anno(obj);
        this._chainNext._chainPrev = this;
      } else {
        this._chainNext.chainTo(obj);
      }
    } else {
      console.error("Can't chainTo a null object.");
    }
    return this;
  };

  Anno.prototype._chainNext = null;

  Anno.prototype._chainPrev = null;

  Anno.chain = function(array) {
    console.warn('Anno.chain([...]) is deprecated.  Use `new Anno([...])` instead.');
    return new Anno(array);
  };

  Anno.prototype.chainSize = function() {
    if (this._chainNext != null) {
      return this._chainNext.chainSize();
    } else {
      return 1 + this.chainIndex();
    }
  };

  Anno.prototype.chainIndex = function(index) {
    var find;
    if (index != null) {
      return (find = function(curr, i, u) {
        var ci;
        if (curr != null) {
          ci = curr.chainIndex();
          if ((0 <= ci && ci < i)) {
            return find(curr._chainNext, i, u);
          } else if ((i < ci && ci <= u)) {
            return find(curr._chainPrev, i, u);
          } else if (ci === i) {
            return curr;
          }
        } else {
          return console.error("Couldn't switch to index '" + i + "'. Chain size is '" + u + "'");
        }
      })(this, index, this.chainSize());
    } else {
      if (this._chainPrev != null) {
        return 1 + this._chainPrev.chainIndex();
      } else {
        return 0;
      }
    }
  };

  Anno.prototype.show = function() {
    var $target, lastButton;
    $target = this.targetFn();
    if (this._annoElem != null) {
      console.warn("Anno elem for '" + this.target + "' has already been generated.  Did you call show() twice?");
    }
    this._annoElem = this.annoElem();
    this.showOverlay();
    this.emphasiseTarget();
    $target.after(this._annoElem);
    this._annoElem.addClass('anno-target-' + this.arrowPositionFn());
    this.positionAnnoElem();
    setTimeout(((function(_this) {
      return function() {
        return _this._annoElem.removeClass('anno-hidden');
      };
    })(this)), 10);
    $target.scrollintoview();
    setTimeout(((function(_this) {
      return function() {
        return _this._annoElem.scrollintoview();
      };
    })(this)), 300);
    lastButton = this._annoElem.find('button').last();
    if (this.rightArrowClicksLastButton) {
      lastButton.keydown(function(evt) {
        if (evt.keyCode === 39) {
          return $(this).click();
        }
      });
    }
    if (this.autoFocusLastButton) {
      if ($target.find(':focus').length === 0) {
        lastButton.focus();
      }
    }
    this._returnFromOnShow = this.onShow(this, $target, this._annoElem);
    return this;
  };

  Anno.prototype.start = function() {
    return this.show();
  };

  Anno.prototype.rightArrowClicksLastButton = true;

  Anno.prototype.autoFocusLastButton = true;

  Anno.prototype.onShow = function(anno, $target, $annoElem) {};

  _returnFromOnShow = null;

  Anno.prototype.hide = function() {
    this.hideAnno();
    this.hideOverlay();
    return this;
  };

  Anno.prototype.hideAnno = function() {
    this.deemphasiseTarget();
    if (this._annoElem != null) {
      this._annoElem.addClass('anno-hidden');
      setTimeout((function(_this) {
        return function() {
          var _ref;
          if ((_ref = _this._annoElem) != null) {
            _ref.remove();
          }
          return _this._annoElem = null;
        };
      })(this), 300);
      this.onHide(this, this.targetFn(), this._annoElem, this._returnFromOnShow);
    } else {
      console.warn("Can't hideAnno() for '" + this.target + "' when @_annoElem is null.  Did you call hideAnno() twice?");
    }
    return this;
  };

  Anno.prototype.onHide = function(anno, $target, $annoElem, returnFromOnShow) {};

  Anno.prototype.switchTo = function(otherAnno) {
    if (otherAnno != null) {
      this.hideAnno();
      return otherAnno.show();
    } else {
      console.warn("Can't switchTo a null object. Hiding completely instead. ");
      return this.hide();
    }
  };

  Anno.prototype.switchToChainNext = function() {
    return this.switchTo(this._chainNext);
  };

  Anno.prototype.switchToChainPrev = function() {
    return this.switchTo(this._chainPrev);
  };

  Anno.prototype.target = 'h1';

  Anno.prototype.targetFn = function() {
    var r;
    if (typeof this.target === 'string') {
      r = $(this.target).filter(':not(.anno-placeholder)');
      if (r.length === 0) {
        console.error("Couldn't find Anno.target '" + this.target + "'.");
      }
      if (r.length > 1) {
        console.warn("Anno target '" + this.target + "' matched " + r.length + " elements. Targeting the first one.");
      }
      return r.first();
    } else if (this.target instanceof jQuery) {
      if (this.target.length > 1) {
        console.warn("Anno jQuery target matched " + this.target.length + " elements. Targeting the first one.");
      }
      return this.target.first();
    } else if (this.target instanceof HTMLElement) {
      return $(this.target);
    } else if (typeof this.target === 'function') {
      return this.target();
    } else {
      console.error("Unrecognised Anno.target. Please supply a jQuery selector string, a jQuery " + "object, a raw DOM element or a function returning a jQuery element. target:");
      return console.error(this.target);
    }
  };

  Anno.prototype.annoElem = function() {
    this._annoElem = $("<div class='anno anno-hidden " + this.className + "'>\n  <div class='anno-inner'>  <div class='anno-arrow'></div>  </div>\n</div>");
    this._annoElem.find('.anno-inner').append(this.contentElem()).append(this.buttonsElem());
    return this._annoElem;
  };

  Anno.prototype._annoElem = null;

  Anno.prototype.className = '';

  Anno.prototype.content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

  Anno.prototype.contentFn = function() {
    return this.content;
  };

  Anno.prototype.contentElem = function() {
    return $("<div class='anno-content'>" + this.contentFn() + "</div>");
  };

  Anno.prototype.showOverlay = function() {
    var e;
    if ($('.anno-overlay').length === 0) {
      $('body').append(e = this.overlayElem().addClass('anno-hidden'));
      return setTimeout((function() {
        return e.removeClass('anno-hidden');
      }), 10);
    } else {
      return $('.anno-overlay').replaceWith(this.overlayElem());
    }
  };

  Anno.prototype.overlayElem = function() {
    return $("<div class='anno-overlay " + this.overlayClassName + "'></div>").click((function(_this) {
      return function(evt) {
        return _this.overlayClick.call(_this, _this, evt);
      };
    })(this));
  };

  Anno.prototype.overlayClassName = '';

  Anno.prototype.overlayClick = function(anno, evt) {
    return anno.hide();
  };

  Anno.prototype.hideOverlay = function() {
    $('.anno-overlay').addClass('anno-hidden');
    return setTimeout((function() {
      return $('.anno-overlay').remove();
    }), 300);
  };

  Anno.prototype.emphasiseTarget = function($target) {
    var placeholder, ppos, tpos;
    if ($target == null) {
      $target = this.targetFn();
    }
    $target.closest(':scrollable').on('mousewheel', function(evt) {
      evt.preventDefault();
      return evt.stopPropagation();
    });
    this._undoEmphasise.push(function($t) {
      return $t.closest(':scrollable').off('mousewheel');
    });
    if ($target.css('position') === 'static') {
      $target.after(placeholder = $target.clone().addClass('anno-placeholder'));
      ((function(_this) {
        return function(a) {
          return _this._undoEmphasise.push(function() {
            return a.remove();
          });
        };
      })(this))(placeholder);
      ((function(_this) {
        return function(a) {
          return _this._undoEmphasise.push(function($t) {
            return $t.css({
              position: a
            });
          });
        };
      })(this))($target.prop('style').position);
      $target.css({
        position: 'absolute'
      });
      if ($target.outerWidth() !== placeholder.outerWidth()) {
        ((function(_this) {
          return function(a) {
            return _this._undoEmphasise.push(function($t) {
              return $t.css({
                width: a
              });
            });
          };
        })(this))($target.prop('style').width);
        $target.css('width', placeholder.outerWidth());
      }
      if ($target.outerHeight() !== placeholder.outerHeight()) {
        ((function(_this) {
          return function(a) {
            return _this._undoEmphasise.push(function($t) {
              return $t.css({
                height: a
              });
            });
          };
        })(this))($target.prop('style').height);
        $target.css('height', placeholder.outerHeight());
      }
      ppos = placeholder.position();
      tpos = $target.position();
      if (tpos.top !== ppos.top) {
        ((function(_this) {
          return function(a) {
            return _this._undoEmphasise.push(function($t) {
              return $t.css({
                top: a
              });
            });
          };
        })(this))($target.prop('style').top);
        $target.css('top', ppos.top);
      }
      if (tpos.left !== ppos.left) {
        ((function(_this) {
          return function(a) {
            return _this._undoEmphasise.push(function($t) {
              return $t.css({
                left: a
              });
            });
          };
        })(this))($target.prop('style').left);
        $target.css('left', ppos.left);
      }
    }
    if ($target.css('background') === 'rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box') {
      ((function(_this) {
        return function(a) {
          return _this._undoEmphasise.push(function($t) {
            return $t.css({
              background: a
            });
          });
        };
      })(this))($target.prop('style').background);
      $target.css({
        background: 'white'
      });
    }
    ((function(_this) {
      return function(a) {
        return _this._undoEmphasise.push(function($t) {
          return $t.css({
            zIndex: a
          });
        });
      };
    })(this))($target.prop('style').zIndex);
    $target.css({
      zIndex: '1001'
    });
    return $target;
  };

  Anno.prototype._undoEmphasise = [];

  Anno.prototype.deemphasiseTarget = function() {
    var $target, fn, _i, _len, _ref;
    $target = this.targetFn();
    _ref = this._undoEmphasise;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      fn = _ref[_i];
      fn($target);
    }
    return $target;
  };

  Anno.prototype.position = null;

  Anno.prototype.positionAnnoElem = function(annoEl) {
    var $targetEl, offset, pos;
    if (annoEl == null) {
      annoEl = this._annoElem;
    }
    pos = this.positionFn();
    $targetEl = this.targetFn();
    offset = $targetEl.position();
    switch (pos) {
      case 'top':
      case 'bottom':
        annoEl.css({
          left: offset.left + 'px'
        });
        break;
      case 'center-top':
      case 'center-bottom':
        annoEl.css({
          left: offset.left + ($targetEl.outerWidth() / 2 - annoEl.outerWidth() / 2) + 'px'
        });
        break;
      case 'left':
      case 'right':
        annoEl.css({
          top: offset.top + 'px'
        });
        break;
      case 'center-left':
      case 'center-right':
        annoEl.css({
          top: offset.top + ($targetEl.outerHeight() / 2 - annoEl.outerHeight() / 2) + 'px'
        });
    }
    switch (pos) {
      case 'top':
      case 'center-top':
        annoEl.css({
          top: offset.top - annoEl.outerHeight() + 'px'
        });
        break;
      case 'bottom':
      case 'center-bottom':
        annoEl.css({
          top: offset.top + $targetEl.outerHeight() + 'px'
        });
        break;
      case 'left':
      case 'center-left':
        annoEl.css({
          left: offset.left - annoEl.outerWidth() + 'px'
        });
        break;
      case 'right':
      case 'center-right':
        annoEl.css({
          left: offset.left + $targetEl.outerWidth() + 'px'
        });
        break;
      default:
        if ((pos.left != null) || (pos.right != null) || (pos.top != null) || (pos.bottom != null)) {
          annoEl.css(pos);
        } else {
          console.error("Unrecognised position: '" + pos + "'");
        }
    }
    return annoEl;
  };

  Anno.prototype.positionFn = function() {
    var $container, $target, allowed, annoBounds, bad, containerOffset, targetBounds, targetOffset, viewBounds;
    if (this.position != null) {
      return this.position;
    } else if (this._annoElem != null) {
      $target = this.targetFn();
      $container = $target.closest(':scrollable');
      if ($container.length === 0) {
        $container = $('body');
      }
      targetOffset = $target.offset();
      containerOffset = $container.offset();
      targetBounds = {
        left: targetOffset.left - containerOffset.left,
        top: targetOffset.top - containerOffset.top
      };
      targetBounds.right = targetBounds.left + $target.outerWidth();
      targetBounds.bottom = targetBounds.top + $target.outerHeight();
      viewBounds = {
        w: $container.width() || $container.width(),
        h: $container.height() || $container.height()
      };
      annoBounds = {
        w: this._annoElem.outerWidth(),
        h: this._annoElem.outerHeight()
      };
      bad = [];
      if (annoBounds.w > targetBounds.left) {
        bad = bad.concat(['left', 'center-left']);
      }
      if (annoBounds.h > targetBounds.top) {
        bad = bad.concat(['top', 'center-top']);
      }
      if (annoBounds.w + targetBounds.right > viewBounds.w) {
        bad = bad.concat(['right', 'center-right']);
      }
      if (annoBounds.h + targetBounds.bottom > viewBounds.h) {
        bad = bad.concat(['bottom', 'center-bottom']);
      }
      allowed = Anno.preferredPositions.filter(function(p) {
        return __indexOf.call(bad, p) < 0;
      });
      if (allowed.length === 0) {
        console.error("Anno couldn't guess a position for '" + this.target + "'. Please supply one in the constructor.");
      } else {
        console.warn(("Anno: guessing position:'" + allowed[0] + "' for '" + this.target + "'. ") + ("Possible Anno.preferredPositions: [" + allowed + "]."));
      }
      return this.position = allowed[0];
    }
  };

  Anno.preferredPositions = ['bottom', 'right', 'left', 'top', 'center-bottom', 'center-right', 'center-left', 'center-top'];

  Anno.prototype.arrowPositionFn = function() {
    var pos, r;
    if (this.arrowPosition != null) {
      return this.arrowPosition;
    } else if (typeof this.positionFn() === 'string') {
      return {
        'top': 'bottom',
        'center-top': 'center-bottom',
        'left': 'right',
        'center-left': 'center-right',
        'right': 'left',
        'center-right': 'center-left',
        'bottom': 'top',
        'center-bottom': 'center-top'
      }[this.positionFn()];
    } else {
      pos = {
        l: parseInt(this.positionFn().left, 10),
        t: parseInt(this.positionFn().top, 10)
      };
      if (Math.abs(pos.l) > Math.abs(pos.t)) {
        r = pos.l < 0 ? 'center-right' : 'center-left';
      } else {
        r = pos.t < 0 ? 'center-bottom' : 'center-top';
      }
      console.warn("Guessing arrowPosition:'" + r + "' for " + this.target + ". Include this in your constructor for consistency.");
      return r;
    }
  };

  Anno.prototype.arrowPosition = null;

  Anno.prototype.buttons = [{}];

  Anno.prototype.buttonsFn = function() {
    if (this.buttons instanceof Array) {
      return this.buttons.map(function(b) {
        return new AnnoButton(b);
      });
    } else {
      return [new AnnoButton(this.buttons)];
    }
  };

  Anno.prototype.buttonsElem = function() {
    var b;
    return $("<div class='anno-btn-container'></div>").append((function() {
      var _i, _len, _ref, _results;
      _ref = this.buttonsFn();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        b = _ref[_i];
        _results.push(b.buttonElem(this));
      }
      return _results;
    }).call(this));
  };

  return Anno;

})();

AnnoButton = (function() {
  function AnnoButton(options) {
    var key, val;
    for (key in options) {
      val = options[key];
      this[key] = val;
    }
  }

  AnnoButton.prototype.buttonElem = function(anno) {
    return $("<button class='anno-btn'></button>").html(this.textFn(anno)).addClass(this.className).click((function(_this) {
      return function(evt) {
        return _this.click.call(anno, anno, evt);
      };
    })(this));
  };

  AnnoButton.prototype.textFn = function(anno) {
    if (this.text != null) {
      return this.text;
    } else if (anno._chainNext != null) {
      return 'Next';
    } else {
      return 'Done';
    }
  };

  AnnoButton.prototype.text = null;

  AnnoButton.prototype.className = '';

  AnnoButton.prototype.click = function(anno, evt) {
    if (anno._chainNext != null) {
      return anno.switchToChainNext();
    } else {
      return anno.hide();
    }
  };

  AnnoButton.NextButton = new AnnoButton({
    text: 'Next',
    click: function() {
      return this.switchToChainNext();
    }
  });

  AnnoButton.DoneButton = new AnnoButton({
    text: 'Done',
    click: function() {
      return this.hide();
    }
  });

  AnnoButton.BackButton = new AnnoButton({
    text: 'Back',
    className: 'anno-btn-low-importance',
    click: function() {
      return this.switchToChainPrev();
    }
  });

  return AnnoButton;

})();
