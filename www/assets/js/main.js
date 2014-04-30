
var JM = (function(JM, $) {

	$(function(){

		JM.Scroll.init();

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
        },

        unbind: function() {
        	$(window).off({
				'DOMMouseScroll mousewheel': this.elementScroll
			});
        },

        elementScroll: function (e) {
 			
        	console.log(e);

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
		},
		 
		 
		showSlide: function() {
		 	
			// reset
			JM.Scroll.delta = 0;
			/*
		 	$('.visible').removeClass('visible');
			this.slides.eq(this.currentSlideIndex).addClass('visible');*/

			this.slides.each(function(i, slide) {
				$(slide).toggleClass('visible', (i >= JM.Scroll.currentSlideIndex));
			});

			console.log(this);
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
		}
	};


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
          	center: new google.maps.LatLng(40.202176, -77.192936),
          	zoom: 13,
          	mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'jm_style']
			},
			mapTypeControl: false,
			zoomControl: false,
			panControl: false,
			streetViewControl: false
        };

        var styleOptions = { name: 'JM Style' },
    	    mapType      = new google.maps.StyledMapType(styles, styleOptions);

        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        // set the map to our custom style
	    map.mapTypes.set('jm_style', mapType);
	    map.setMapTypeId('jm_style');
	}

	google.maps.event.addDomListener(window, 'load', JM.MAP);
	return JM;

})(JM || {}, jQuery);



