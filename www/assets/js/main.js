
var JM = (function(JM, $) {

	$(function(){

		JM.Scroll.init();
		JM.RSVP.init();
	});


	JM.Scroll = {
		slides:'',
		numSlides:'',
		delta: 0,
        currentSlideIndex: 0,
        scrollThreshold: 10,


        init: function() {
        	this.slides = $('.section');
        	this.numSlides = this.slides.length;
        	this.bind();
        },

        bind: function() {
        	$(window).on({
				'DOMMouseScroll mousewheel': this.elementScroll
			});

			$('#status').on('click', 'span', this.updateIndex)
        },

        unbind: function() {
        	$(window).off({
				'DOMMouseScroll mousewheel': this.elementScroll
			});
        },

        elementScroll: function (e) {
 			
			var scroll = true;
			
			if(JM.Scroll.currentSlideIndex == 1)
			{
				scroll = false;

				var elem = $('.info-location').find('.left');
				
				console.log(elem.prop("scrollHeight") - elem.scrollTop()+' : '+elem.outerHeight())
			    if (elem.prop("scrollHeight") - elem.scrollTop() == elem.outerHeight()) 
			    {
			        scroll = true;
			    }
			}

			if(scroll)
			{
				// --- Scrolling up ---
				if (e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0) {	
			 
					JM.Scroll.delta--;
			 
					if ( Math.abs(JM.Scroll.delta) >= JM.Scroll.scrollThreshold) {
						JM.Scroll.prevSlide();
					}
				}
			 
				// --- Scrolling down ---
				else {
			 
					JM.Scroll.delta++;
			 
					if (JM.Scroll.delta >= JM.Scroll.scrollThreshold) {
						JM.Scroll.nextSlide();
					}
				}

				// Prevent page from scrolling
				return false;
			}
		},
		 
		 
		showSlide: function() {
		 	
			// reset
			JM.Scroll.delta = 0;

			this.slides.each(function(i, slide) {
				$(slide).toggleClass('visible', (i >= JM.Scroll.currentSlideIndex));
			});

			$('.status').children('.visible').removeClass('visible');
			$('.status').children('span').eq(this.currentSlideIndex).addClass('visible');

			//console.log(this);
			setTimeout(function(){
				JM.Scroll.bind();
			}, 900);			
		},
		 
		 
		prevSlide: function() {
		 	this.unbind();
			this.currentSlideIndex--;
		 
			if (this.currentSlideIndex < 0) {
				this.currentSlideIndex = 0;
			}
		 
			this.showSlide();
		},
		 
		nextSlide: function() {
		 	this.unbind();
			this.currentSlideIndex++;
		 
			if (this.currentSlideIndex == this.numSlides) { 
				this.currentSlideIndex = this.numSlides-1;
			}
		 
			this.showSlide();
		},

		updateIndex: function(event)
		{
			event.preventDefault();

			JM.Scroll.currentSlideIndex = $(this).index();
			console.log(JM.Scroll.currentSlideIndex );
			JM.Scroll.showSlide();
		}
	};


	JM.Touch = {
		delta: false,
    	dragThreshold: 0.15,  // "percentage" to drag before engaging
    	dragStart: null,	  // used to determine touch / drag distance
    	percentage: 0,
    	target: false,
    	previousTarget: false,

    	init: function() {
        	this.slides = $('.section');
        	this.numSlides = this.slides.length;
        	this.bind();
        },

        bind: function() {
        	$('.site__wrapper').on({
				'touchstart': this.touchStart,
				'touchmove': this.touchMove,
				'touchend': this.touchEnd
			});
        },

		touchStart: function (event) {

			if (JM.TouchdragStart !== null) { return; }
			if (event.originalEvent.touches) { 
				event = event.originalEvent.touches[0];
			}

			// where in the viewport was touched
			JM.Touch.dragStart = event.clientY;

			// make sure we're dealing with a slide
			JM.Touch.target = JM.Touch.slides.eq(currentSlideIndex)[0];	

			// disable transitions while dragging
			JM.Touch.target.classList.add('no-animation');

			JM.Touch.previousTarget = slides.eq(currentSlideIndex-1)[0];
			JM.Touch.previousTarget.classList.add('no-animation');
		},

		touchMove: function (event) {

			if (JM.Touch.dragStart === null) { return; }
			if (event.originalEvent.touches) { 
				event = event.originalEvent.touches[0];
			}

			JM.Touch.delta = JM.Touch.dragStart - event.clientY;
			JM.Touch.percentage = JM.Touch.delta / $(window).height();

			// Going down/next. Animate the height of the target element.
			if (JM.Touch.percentage > 0) {
				target.style.height = (100-(JM.Touch.percentage*100))+'%';
				if (JM.Touch.previousTarget) { 
					JM.Touch.previousTarget.style.height = ''; 	// reset
				}
			}

			// Going up/prev. Animate the height of the _previous_ element.
			else if (JM.Touch.previousTarget) {
				previousTarget.style.height = (-percentage*100)+'%';
				JM.Touch.target.style.height = '';	// reset
			}

			// Don't drag element. This is important.
			return false;
		},

		touchEnd: function() {

			JM.Touch.dragStart = null;
			JM.Touch.target.classList.remove('no-animation');
			if (JM.Touch.previousTarget) { 
				JM.Touch.previousTarget.classList.remove('no-animation'); 
			}

			if (JM.Touch.percentage >= JM.Touch.dragThreshold) {
				JM.Touch.nextSlide();
			}
			else if ( Math.abs(JM.Touch.percentage) >= JM.Touch.dragThreshold ) {
				JM.Touch.prevSlide();
			} else {
				// show current slide i.e. snap back
				JM.Touch.showSlide();
			}

			JM.Touch.percentage = 0;

		}
	};


	JM.RSVP = {
		searchSubmited: false,
		registerSubmited: false,

		init: function() {
			this.bind();
		},

		bind: function() {
			$('.rsvp').on('submit', '.search', this.searchSubmit);
		},

		searchSubmit: function(event) {
			event.preventDefault();

			var $form = $(this);
			if(! JM.RSVP.searchSubmited)
			{
				$.ajax({
					url: '/guests.php',
					type: 'POST',
					dataType: 'html',
					data: $form.serialize(),
				})
				.done(JM.RSVP.listLoaded)
				.fail(function() {
					console.log("error");
				})
				.always(function() {
					console.log("complete");
				});

				JM.RSVP.searchSubmited = true;
			}
		},

		listLoaded: function($result) {

			$rsvp = $('.rsvp');

			$rsvp.find('form').hide();
			$('.rsvp').append($result);
			$('#invited').on('submit', JM.RSVP.registerSubmit);

		},

		registerSubmit: function(event) {
			event.preventDefault();

			var $form = $(this);
			if(! JM.RSVP.registerSubmited)
			{
				$.ajax({
					url: '/guests.php',
					type: 'POST',
					dataType: 'html',
					data: $form.serialize(),
				})
				.done(JM.RSVP.registerCompleted)
				.fail(function() {
					console.log("error");
				})
				.always(function() {
					console.log("complete");
				});

				JM.RSVP.registerSubmited = true;
			}
		},

		registerCompleted: function($result) {
			$('#invited').remove();
			$('.rsvp').append($result);

			JM.RSVP.searchSubmited = false;

			setTimeout(function(){

				$('.thanks').remove();
				$('#last_name').val("");
				$('.search').show();

			}, 4000);
		}

	}


	JM.MAP = function() {
		var styles = [
			{
				"featureType": "administrative",
				"elementType": "labels.icon",
				"stylers": [
					{ "visibility": "off" }
				]
			},{
				"elementType": "labels.text.stroke",
				"stylers": [
					{ "visibility": "off" }
				]
			},{
				"elementType": "labels.text.fill",
				"stylers": [
					{ "visibility": "off" }
				]
			},{
				"featureType": "landscape.natural.landcover",
				"stylers": [
					{ "color": "#C1D8C8" }
				]
			},{
				"featureType": "landscape.natural.terrain",
				"stylers": [
					{ "color": "#C1D8C8" }
				]
			},{
				"featureType": "landscape.man_made",
				"stylers": [
					{ "color": "#82b191" }
				]
			},{
				"featureType": "landscape.natural.terrain",
				"stylers": [
					{ "color": "#c1d8c8" }
				]
			},{
				"featureType": "landscape",
				"elementType": "geometry.fill",
				"stylers": [
					{ "color": "#82b191" }
				]
			},{
				"featureType": "road.local",
				"elementType": "geometry",
				"stylers": [
					{ "color": "#82b191" },
					{ "lightness": -14 }
				]
			},{
				"featureType": "road.arterial",
				"elementType": "geometry",
				"stylers": [
					{ "visibility": "on" },
					{ "color": "#82b191" },
					{ "lightness": 30 },
					{ "saturation": 6 }
				]
			},{
				"featureType": "road.highway",
				"elementType": "geometry",
				"stylers": [
					{ "visibility": "on" },
					{ "saturation": 1 },
					{ "color": "#82b191" },
					{ "lightness": 55 }
				]
			},{
				"featureType": "poi",
				"elementType": "labels",
				"stylers": [
					{ "visibility": "off" }
				]
			},{
				"featureType": "road",
				"elementType": "labels.text.stroke",
				"stylers": [
					{ "visibility": "off" }
				]
			},{
				"featureType": "transit",
				"stylers": [
					{ "visibility": "off" }
				]
			},{
				"featureType": "poi",
				"elementType": "labels.text",
				"stylers": [
					{ "visibility": "on" }
				]
			},{
				"featureType": "poi",
				"elementType": "geometry.fill",
				"stylers": [
					{ "color": "#82b191" },
					{ "lightness": 17 }
				]
			},{
				"featureType": "poi"  }
		];

		var mapOptions = {
          	center: new google.maps.LatLng(40.227529, -77.215669),
          	zoom: 13,
          	mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'jm_style']
			},
			mapTypeControl: false,
			zoomControl: true,
		    zoomControlOptions: {
		    	style: google.maps.ZoomControlStyle.SMALL
		    },
			panControl: false,
			streetViewControl: false,
			scrollwheel: false
        };

        var styleOptions = { name: 'JM Style' },
    	    mapType      = new google.maps.StyledMapType(styles, styleOptions);

        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        // set the map to our custom style
	    map.mapTypes.set('jm_style', mapType);
	    map.setMapTypeId('jm_style');

	    var infowindow = new google.maps.InfoWindow({
			content: 'Salem Stone Church'
		});

		var marker = new google.maps.Marker({
		      position: new google.maps.LatLng(40.248593, -77.276714),
		      map: map,
		      title: 'Salem Stone Church'
		});

		google.maps.event.addListener(marker, 'click', function() {
		    infowindow.open(map,marker);
		});

		var infowindow2 = new google.maps.InfoWindow({
			content: 'Carlisle Ribbon Mill'
		});

		var marker2 = new google.maps.Marker({
		      position: new google.maps.LatLng(40.202394, -77.181739),
		      map: map,
		      title: 'Carlisle Ribbon Mill'
		});
		
		google.maps.event.addListener(marker2, 'click', function() {
		    infowindow2.open(map, marker2);
		});

	}

	google.maps.event.addDomListener(window, 'load', JM.MAP);
	return JM;

})(JM || {}, jQuery);



