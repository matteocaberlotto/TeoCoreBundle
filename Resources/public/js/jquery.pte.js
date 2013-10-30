
 /*
  * jQuery getPathToElement plugin calculates one of the
  * jquery unique path to reach an element of the DOM.
  * It will use id, classname or tagname to identify
  * the element itself and all the parents up to the body or
  * the first element with an unique ID.
  * For human readability it is prefered a tagname + id or
  * tagname + class for the element. and id or class or tagname
  * for parents.
  * It simply returns the array of element selectors, up to you
  * to join or do whatever you want.
  *
  * Usage examples:
  *
  * Get path with (default)
  *
  * $(myElement).getPathToElement();
  *
  * Will return a string like this "#path > .to:eq(1) > a.element"
  *
  * $(myElement).getPathToElement(true);
  *
  * Will return a string like this "#path .to:eq(1) a.element:eq(3)"
  *
  * You can get raw selectors array by passing 'true' as second parameter:
  * 
  * $(myElement).getPathToElement(false, true);
  * 
  * Will return an array like this ["#path", ".to:eq(1)", "a.element"]
  * 
  * Test... :)

console.group('Running single tests...');

var total = 0;
var failed = 0;

$("div, input, a, p, h1, h2, h3, h4, small, span").each(function () {
    
    paths = [$(this).getPathToElement(), $(this).getPathToElement(true)];
    var i;
    for (i in paths) {
        if (paths.hasOwnProperty(i)) {
            if ($(paths[i]).get(0) !== $(this).get(0)) {
                failed++;
                console.error("Error with path '", paths[i], "' and element ", $(this).get(0));
            } else {
                console.info('ok');
            }
            total++;
        }
    }
});

console.groupEnd();

if (failed) {
    console.error(total, ' tests completed and ', failed, ' failed');
} else {
    console.info(total, ' tests completed and ', failed, ' failed');
}

 */

(function($) {

    $.fn.getPathToElement = function (dontUseDirectDescendants, raw) {
        var current = $(this);
        var element = current;
        var isIdentified = false;
        var first = true;
        var path = [];

        // Returns the index of an element within its siblings (filtered by 'selector').
        var getIndexString = function (elem, selector) {

            if (!dontUseDirectDescendants) {
                selector = '> ' + selector;
            }

            if (elem.parent().find(selector).length > 1) {
                return ':eq(' + elem.parent().find(selector).index(elem) + ')';
            } else {
                return '';
            }

        };

        // Element is identified when we reach an element with ID or the document.body element.
        while (!isIdentified) {

            // ID
            if (element.attr('id')) {

                // If it is the first element, identify it with tagname + id.
                if (first) {
                    path.push(element.get(0).nodeName.toLowerCase() + '#' + element.attr('id'));
                } else {
                    path.push('#' + element.attr('id'));
                }

                // Found a valid path.
                isIdentified = true;

            // CLASSNAME
            } else if (element.attr('class')) {

                // handle multiple classnames
                var className = element.attr('class');
                if (className.indexOf(" ") !== -1) {
                    className = className.split(" ").join(".");
                }

                var classSelector = '.' + className;

                // If it is the first element, identify it with tagname + class.
                if (first) {
                    path.push(element.get(0).nodeName.toLowerCase() + classSelector + getIndexString(element, classSelector));
                } else {
                    path.push(classSelector + getIndexString(element, classSelector));
                }

            // TAGNAME
            } else {

                // Simply use tagname + index if nothing else is available
                path.push(element.get(0).nodeName.toLowerCase() + getIndexString(element, element.get(0).nodeName.toLowerCase()));

            }

            first = false;

            // climb the DOM tree
            element = element.parent();

            // stops when required :)
            if (element.get(0) === document.body) {
                isIdentified = true;
            }
        }

        if (raw) {
            return path.reverse();
        }

        if (dontUseDirectDescendants) {
            return path.reverse().join(" ");
        }

        return path.reverse().join(" > ");
    };

})(jQuery);