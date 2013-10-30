/**
 * jQuery transform
 * Applies css3 transformation using all browser properties for cross-compatibility.
 * author: Matteo Caberlotto
 */
(function ($) {

	/**
	* jquery transform
	* author: Matteo Caberlotto
	*/
	$.fn.transform = function (options) {

		// actual options override default ones
		var opts = $.extend({
			dx: 0,
			dy: 0,
			dz: 0,
			v1: 0,
			v2: 0,
			v3: 0,
			angle: 0,
			scaleX: 1,
			scaleY: 1,
			scaleZ: 1
		}, options);

		var getTransformValue = function (conf) {
			var transform_value = 'translate3d( ' + conf['dx'] + 'px, ' + conf['dy'] + 'px, ' + conf['dz'] + 'px )' +
				' rotate3d( ' + conf['v1'] + ', ' + conf['v2'] + ', ' + conf['v3'] + ', ' + conf['angle'] + ' )' +
				' scale3d( '+ conf['scaleX'] +', '+ conf['scaleY'] +', '+ conf['scaleZ'] +')';
			return transform_value;
		};

		var assignTransformation = function (_jqueryObject, transform_value) {
			_jqueryObject.css({
				'-webkit-transform': transform_value,
				   '-moz-transform': transform_value,
					'-ms-transform': transform_value,
					 '-o-transform': transform_value,
						'transform': transform_value
			});
		}

		// allow jquery chaining
		return this.each(function () {
			assignTransformation($(this), getTransformValue(opts));
		});

	};

})(jQuery);