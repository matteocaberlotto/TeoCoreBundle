(function($) {

  /*
  * jquery <plugin_name>
  * author: <your_name>
  * all the code below is executed at end of DOM ready event
  */
  $.fn.ganalytics = function() {

    // cache the current node(s) for performance
    var currentNode = $(this);

    return {

      trackEvent: function (options) {

        var binding = 'click';
        if (options !== undefined && options.hasOwnProperty('bind')) {
          binding = options.bind;
        }

        var getAnInterestingInfoAbout = function (elem) {
          if (elem.attr('title')) {
            return elem.attr('title');
          }
          if (elem.attr('alt')) {
            return elem.attr('alt');
          }
          return elem.text().substring(0, 16);
        };

        currentNode.bind(binding, function (event) {

          // default values
          var defaults = {
            category : $(this).getPathToElement(),
            action : event.type,
            label: getAnInterestingInfoAbout($(this)),
            value: 0
          };

          var opts = $.extend(defaults, options);

          ga('send', 'event', opts.category, opts.action, opts.label, opts.value);
        });

        return 
      }
    };
  };

})(jQuery);