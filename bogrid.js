/* ==========================================================
 * bogrid.js v0.9
 *
 * Simple grid overlay for Twitter Bootstrap (Just include it and hit Command+Enter or CTRL+Enter)
 *
 * https://github.com/ricardovf/bogrid
 * ==========================================================
 * Copyright 2012 Meritt (www.meritt.com.br)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!function ($) {

  "use strict"; // jshint ;_;

  // Feature detect + local reference to localStorage
  var storage = (function() {
    var uid = new Date,
      storage,
      result;
    try {
      (storage = window.localStorage).setItem(uid, uid);
      result = storage.getItem(uid) == uid;
      storage.removeItem(uid);
      return result && storage;
    } catch(e) {}
  }());

  var Bogrid = function ( options ) {
    var $this = this

    this.options = $.extend({}, $.fn.bogrid.defaults, options)

    this.$el = $('<div id="bogrid" style="position: fixed; z-index: 9999999; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; overflow: hidden; display: none"></div>')

    $(document.body).append(this.$el)

    this.render()

    if (this.options.store && storage && storage.getItem('Bogrid:visibility') === 'true') {
      this.show()
    } else {
      this.hide()
    }

    $(document.body).on('keydown.bogrid', function(event){
      if (event.which === 13 && event.metaKey) {
        $this.toggle()
      }

      // Do not prevent default
      return true
    })
  }

  Bogrid.prototype = {

    constructor: Bogrid

    , setOptions: function (options) {
      this.options = $.extend({}, $.fn.bogrid.defaults, options)

      return this.render()
    }

    , show: function () {
      this.$el.fadeIn(250)

      this.visible = true;

      // store
      this.options.store && storage && storage.setItem('Bogrid:visibility', 'true')

      return this
    }

    , hide: function () {
      this.$el.fadeOut(250)

      this.visible = false;

      // store
      this.options.store && storage && storage.setItem('Bogrid:visibility', 'false')

      return this
    }

    , toggle: function () {
      return this.visible ? this.hide() : this.show()
    }

    , configGrid: function () {
      this.columns = 12

      var $container  = $('<div class="container" style="position: absolute"><div class="row"><div class="span1"></div></div></div>').appendTo($('body'))
        , $span       = $container.find('.span1')
        , page_width  = parseInt($container.css('width'), 10)
        , width       = parseInt($span.css('width'), 10)
        , gutter      = parseInt($span.css('margin-left'), 10)

      this.columns = parseInt(page_width / (width + gutter), 10) + 1

      $container.remove()

      if ($('body').children('.container-fluid').length || ! $('body').children('.container').length && $('body').children().children('.container-fluid').length) {
        this.fluid = '-fluid'
      } else {
        this.fluid = ''
      }

      return this
    }

    , render: function () {
      this.configGrid()
      this.$el.empty().html('<div class="container'+this.fluid+'"><div class="row'+this.fluid+'"></div></div>');

      var $row = this.$el.find('> div > div');

      if (this.options.show_columns) {
        for (var i = 0; i < this.columns; i++) {
          $('<div class="span1" style="background: red; height: 2500px"></div>').css('opacity', 0.05).appendTo($row);
        }
      }

      if (this.options.show_rows) {
        var line_height = parseInt($row.css('line-height'), 10)
          , top = line_height

        for (var i = 0; i < 100; i++) {
          $('<div style="background: red; height: 1px; position: absolute; width: 100%; top: '+top+'px"></div>').css('opacity', 0.1).appendTo(this.$el);
          top += line_height
        }
      }
      
      return this
    }
  }

  var bogrid_static = null;

  /* bogrid PLUGIN DEFINITION
   * ===================== */

  $.fn.bogrid = function (options) {
    if (bogrid_static === null) {
      bogrid_static = new Bogrid(options)

      return bogrid_static
    } else {
      return bogrid_static.setOptions(options)
    }
  }

  // Bogrid default
  $.fn.bogrid.defaults = {
     show_rows         : true
    ,show_columns      : true
    ,store             : true     // store visibility in localStorage
  }

  $.fn.bogrid.Constructor = Bogrid
  
  $(function(){
    $(document.body).bogrid()
  })
}(window.jQuery);

