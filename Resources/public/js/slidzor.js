/**
 * anonymous scoped functions to have
 * the proper reference to jQuery object as '$'
 */
(function($) {

	/**
	* jquery slidzor
	* author: matteo caberlotto
	* all the code below is executed at end of DOM ready event
	*/
	$.fn.slidzor = function(options) {

		var scope = this;

		var currentIndex = 0;
		var autoslideTimeout = null;

		// default values
		var defaults = {
			animation: 'h-rot',
			wrapperClassname: 'slidzorContainer',
			elementSelector: '.slide',
			sliderNavClass: false,
			menuItemSelector: 'a',
			angle: '10',
			xDelta: '50',
			yDelta: '50',
			zDelta: '100',
			randomAngle: false,
			randomAnimation: false,
			firstSlide: 0,
			sliderNavArrows: false,
			autoslide: false,
			isMobile: false
		};

		var getWrapper = function () {
			return scope.find('.' + opts.wrapperClassname);
		};

		/*
		 * Returns randomly 1 or -1
		 */
		var randomSignalFunction = function () {
			return Math.pow(-1, Math.round(Math.random() * 100));
		};

		/**
		 * Returns angle correction value
		 */
		var getAngle = function (index, i) {
			if (opts.randomAngle) {
				return randomSignalFunction();
			} else {
				return (i - index);
			}
		};


		var Animation = {

			combinedRotation: function (index, i, opts) {
				return {
					v1: 1,
					v2: 1,
					angle: opts.angle * (index - i) + 'deg',
					dz: - opts.xDelta * (index - i)
				}
			},

			simpleFade: function (index, i, opts) {
				return {

				}
			},

			hTranslation: function (index, i, opts) {
				return {
					dx: - opts.xDelta * (index - i)
				}
			},

			vTranslation: function (index, i, opts) {
				return {
					dy: - opts.xDelta * (index - i)
				}
			},

			hRotation: function (index, i, opts) {
				return {
					dx: - opts.xDelta * (index - i),
					dz: - opts.zDelta * (i - index),
					v2: 1,
					angle: opts.angle + 'deg'
				}
			},

			ihRotation: function (index, i, opts) {
				return {
					dx: - opts.sliderWidth * (index - i),
					dz: - 500 * (i - index),
					v2: 1,
					angle: '-' + opts.angle + 'deg'
				}
			},

			vRotation: function (index, i, opts) {
				return {
					dz: - opts.zDelta * (i - index),
					v1: 1,
					angle: '-' + opts.angle + 'deg'
				}
			},

			ivRotation: function (index, i, opts) {
				return {
					dz: - opts.zDelta * (i - index),
					v1: 1,
					angle: opts.angle + 'deg'
				}
			},

			hFlipper: function (index, i, opts) {
				return {
					v2: 1,
					angle: getAngle(index, i) * 90 + 'deg'
				}
			},

			vFlipper: function (index, i, opts) {
				return {
					v1: 1,
					angle: getAngle(index, i) * 90 + 'deg'
				}
			},

			navigateZ: function (index, i, opts) {
				return {
					dz: 2 * opts.xDelta * (index - i)	
				}
			}
		};

		// actual options override default ones
		var opts = $.extend(defaults, options);

		/*
		 * Turns the config string from the options
		 * to the transformation configuration object.
		 */
		var mapTransformation = function () {
			
			var map = {
				'combi': 'combinedRotation',
				'h-rot': 'hRotation',
				'ih-rot': 'ihRotation',
				'v-rot': 'vRotation',
				'iv-rot': 'ivRotation',
				'h-flip': 'hFlipper',
				'v-flip': 'vFlipper',
				'z-nav': 'navigateZ',
				'h-trans': 'hTranslation',
				'v-trans': 'vTranslation',
				'fade': 'simpleFade'
			};

			if (opts.randomAnimation) {
				var i;
				var anims = [];
				for (i in map) {
					anims.push(i);
				}
				opts.animation = anims[Math.round((anims.length - 1) * Math.random())];
			}

			if (map.hasOwnProperty(opts.animation)) {
				opts.animation = Animation[map[opts.animation]];
			} else {
				opts.animation = Animation.hRotation;
			}
		};

		// map transformation string to js object
		mapTransformation();

		var applyAnimation = function (animation, index) {
			getWrapper().find('.slide').each(function (i) {
				var elemIndex = $(this).data('index');

				if (elemIndex !== index) {
					$(this)
						.css({
							'z-index': i
						})
						.transform(animation(index, elemIndex, opts))
					;

					if (!opts.isMobile) {
						$(this)
							.css({
								opacity: 0
							});
					}
				} else {
					$(this)
						.css({
							'z-index': 100
						})
						.transform()
					;

					if (!opts.isMobile) {
						$(this)
							.css({
								opacity: 1
							});
					}
				}
			});
		};

		// attach some public methods to the object
		this.slideTo = function (target) {
			var index = $(target).parent().children().index($(target));
			this.slideToIndex(index);
			return false;
		};

		this.slideToIndex = function (index) {

			applyAnimation(opts.animation, index);

			if (opts.sliderNavClass) {
				$(opts.sliderNavClass)
					.removeClass('active')
					.eq(index)
					.addClass('active')
				;
			}

			currentIndex = index;

			return false;
		};

		this.nextIndex = function () {
			var length = $(this).find(opts.elementSelector).length;
			if (currentIndex < length - 1) {
				return currentIndex + 1;
			} else {
				return 0;
			}
		};

		this.prevIndex = function () {
			if (currentIndex > 0) {
				return currentIndex - 1;
			} else {
				return $(this).find(opts.elementSelector).length - 1;
			}
		};

		this.slideToNext = function () {
			this.slideToIndex(this.nextIndex());
		};

		this.slideToPrev = function () {
			this.slideToIndex(this.prevIndex());
		};
		
		this.each(function () {

			// cache the current node for performance
			var currentNode = $(this);

			if (!currentNode.find('.' + opts.wrapperClassname).length) {
				currentNode.append($('<div/>', {
					"class": opts.wrapperClassname
				}));

				currentNode
					.find('.slide')
					.appendTo(getWrapper());
			}

			var slideHeight = currentNode.find('.slide').eq(0).height();

			getWrapper()
				.css({
				    "width": currentNode.width(),
				    "height": slideHeight,
				    "background-image:": "-moz-linear-gradient(top, #F4F4F4 0%, #C41234 100%)",
				    "overflow": "hidden",
				    "position": "relative",
				                 "perspective": "1100px",
				         "-webkit-perspective": "1100px",
				            "-moz-perspective": "1100px",
				             "-ms-perspective": "1100px",
				              "-o-perspective": "1100px",
				             "transform-style": "preserve-3d",
				     "-webkit-transform-style": "preserve-3d",
				        "-moz-transform-style": "preserve-3d",
				         "-ms-transform-style": "preserve-3d",
				          "-o-transform-style": "preserve-3d"
				});

			var localWrapper = getWrapper();

			$(window).resize(function () {
				localWrapper
					.css({
					    "width": currentNode.width(),
					    "height": currentNode.find('.slide').height()
					});
			});

			currentNode
				.find('.slide')
				.each(function (i) {
					$(this).data('index', i);
				});

			if (opts.sliderNavClass) {
				$(opts.sliderNavClass)
					.click(function () {
						scope.slideTo($(this));
						return false;
					});
			}

			if (opts.autoslide) {
				autoslideInterval = setInterval(function () {
					scope.slideToIndex(scope.nextIndex());
				}, opts.autoslide);
			}

			if (opts.sliderNavArrows) {

				// append 'NEXT' arrow
				if (!currentNode.find('.slidzor-arrow-next-container').length) {
					getWrapper()
						.append($('<div/>', {
							"class": "slidzor-arrow-next-container"
						}));

					getWrapper()
						.find('.slidzor-arrow-next-container')
						.append($('<a/>', {
							"class": "slidzor-arrow-next",
							"html": "&gt;",
							"href": "javascript:;"
						}));

					getWrapper()
						.find('.slidzor-arrow-next-container')
						.mouseenter(function () {
							$(this).find('a').show();
						})
						.mouseleave(function () {
							$(this).find('a').hide();
						})
						;
				}

				getWrapper().find('.slidzor-arrow-next-container')
					.css({
						top: 0,
						right: 0,
						width: getWrapper().width() / 8,
						height: getWrapper().height(),
						position: 'absolute',
						zIndex: 200
					})
					.click(function () {
						scope.slideToIndex(scope.nextIndex());
					});

				getWrapper().find('.slidzor-arrow-next')
					.css({
						position: 'absolute',
						right: '20px',
						top: getWrapper().height() / 2 - 10,
						fontSize: '44px',
						fontWeight: 'lighter',
						textTransform: 'uppercase',
						color: '#fff',
						display: 'none',
						fontFamily: 'Courier',
						fontWeight: 'normal',
						transform: 'scale(1,1.8)'
					});

				// append 'PREV' arrow
				if (!currentNode.find('.slidzor-arrow-prev-container').length) {
					getWrapper()
						.append($('<div/>', {
							"class": "slidzor-arrow-prev-container"
						}));

					getWrapper()
						.find('.slidzor-arrow-prev-container')
						.append($('<a/>', {
							"html": "&lt;",
							"href": "javascript:;",
							"class": "slidzor-arrow-prev"
						}));

					getWrapper()
						.find('.slidzor-arrow-prev-container')
						.mouseenter(function () {
							$(this).find('a').show();
						})
						.mouseleave(function () {
							$(this).find('a').hide();
						})
						;
				}

				getWrapper().find('.slidzor-arrow-prev-container')
					.css({
						top: 0,
						left: 0,
						width: $(window).width() / 8,
						height: getWrapper().height(),
						position: 'absolute',
						zIndex: 200
					})
					.click(function () {
						scope.slideToIndex(scope.prevIndex());
					});

				getWrapper().find('.slidzor-arrow-prev')
					.css({
						position: 'absolute',
						left: '20px',
						top: getWrapper().height() / 2 - 10,
						fontSize: '44px',
						fontWeight: 'lighter',
						textTransform: 'uppercase',
						color: '#fff',
						display: 'none',
						fontFamily: 'Courier',
						fontWeight: 'normal',
						transform: 'scale(1,1.8)'
					});
			}
		});

		// cache couple of values after rendering for future use
		opts.sliderWidth = getWrapper().width();
		opts.sliderHeight = getWrapper().height();

		// first slide
		scope.slideToIndex(opts.firstSlide);

		// allow jquery chaining
		return this;
	};

})(jQuery);
