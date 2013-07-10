(function() {
	window.ui = {

		init: function() {

			// var ui = this;

			// cache jquery selectors
			ui.$logoBar = $("#logoBar");
//			ui.$content = $("#content");
			ui.$main = $("#main");

			var logoHTML = "";
			for (var key in data.makes) {
				logoHTML += "<img id='logo_" + key + "' class='make tap' style='display:none;' src='images/" + data.makes[key].logo + "' alt='$row->name' />";
			}
			ui.$logoBar.append(logoHTML);

			// more caching
			ui.$logoBarImg = ui.$logoBar.find("img");

			// bind the navigation events to the logobar
			ui.$logoBarImg.click(function() {
				var make = this.id;
				make = make.replace("logo_", "");
				hasher.setHash(make);

				/* Make the visible stuff */
			//	$("#content").html('<img src="images/ajax-loader.gif?rnd=' + Math.random() + '" alt="_0020_CHOOSE-MAKE" wmaketh="32" height="32" style="margin-top:230px;" />');

				ui.updateNav(make);

//				ui.makeMenu(make);
			});

			ui.$logoBarImg.show("fade", {}, 1500);


			ui.route();
			
			//update URL fragment generating new history record
			if (window.location.hash === "")
				hasher.setHash('home');

		},

		route: function () {

			// var ui = this;

			//setup crossroads
			crossroads.addRoute('home', ui.home);
			crossroads.addRoute('contact/:page:/:make:/:model:', ui.loadContact);
			crossroads.addRoute('{make}', function(make) {
				ui.makeMenu(make);
			});
			crossroads.addRoute('{make}/models', function(make) {
				ui.loadModelsGallery(make);
			});
			crossroads.addRoute('{make}/models/{model}/{id}', function(make, model, id) {
				ui.loadModel(id, make, model);
				_gaq.push(['_trackPageview', make + "/models/" + model + "/" + id]);

			});
			crossroads.addRoute('{make}/specials', function(make) {
				ui.loadSpecialsGallery(make);
			});
			crossroads.routed.add(console.log, console); //log all routes

			//setup hasher
			function parseHash(newHash, oldHash){
				crossroads.parse(newHash);
				$("#footer #back").css("visibility", "visible");
			}
			hasher.initialized.add(parseHash); //parse initial hash
			hasher.changed.add(parseHash); //parse hash changes
			hasher.init(); //start listening for history change

		},

		goBack: function() {
			history.go(-1);
		},

		goForward: function() {
			history.go(+1);
		},

		home: function() {

			ui.newPage();
			$("#content").append('<img id="chooseMake" class="tap" src="images/_0020_CHOOSE-MAKE.png" alt="_0020_CHOOSE-MAKE" width="814" height="76" style="margin-top:230px;" />');
			$(document).on('click', '#chooseMake', function() {
				ui.$logoBarImg.effect("pulsate", {
					times: 2
				}, 500);
			});

			setTimeout(function() {$("#footer #back").css("visibility", "hidden");}, 10);
		},

		makeMenu: function(make) {

			// var ui = this;
/*
			var makeMenu = "<div id='nav_" + make + "' class='nav_main nav'>";
			makeMenu += "<img data-nav='models' data-make='" + make + "' data-make-name='" + data.makes[make].name + "' src='images/_0012_MODELS.png' alt='" + data.makes[make].name + " Models' class='makeMenuLink tap' />";
			makeMenu += "<img data-nav='specials' data-make='" + make + "' data-url='" + data.makes[make].specials_url + "' src='images/_0010_VIEW-SPECIALS.png' alt='" + data.makes[make].name + " Specials' class='makeMenuLink tap'  />";
			makeMenu += "<img data-nav='test' data-make='" + make + "' data-make-name='" + data.makes[make].name + "' src='images/_0011_TEST-DRIVE.png' alt='Test Drive " + data.makes[make].name + "' class='makeMenuLink tap'  />";
			makeMenu += "</div>";
*/
			ui.newPage();
		
			$("#content").append("<img data-nav='models' data-make='" + make + "' data-make-name='" + data.makes[make].name + "' src='images/_0012_MODELS.png' alt='" + data.makes[make].name + " Models'  class='tap makeMenu' />");
			$("#content").append("<img data-nav='specials' data-make='" + make + "' data-url='" + data.makes[make].specials_url + "' src='images/_0010_VIEW-SPECIALS.png' alt='" + data.makes[make].name + " Specials' class='tap makeMenu' />");
			$("#content").append("<img data-nav='test' data-make='" + make + "' data-make-name='" + data.makes[make].name + "' src='images/_0011_TEST-DRIVE.png' alt='Test Drive " + data.makes[make].name + "'src='images/_0011_TEST-DRIVE.png' class='tap makeMenu' />");


			$("#content").on('click', '.makeMenu', function(event) {

				var make = $(this).data('make');
				var makeName = $(this).data('make-name');
				var model = $(this).data('model');
				var nav = $(this).data('nav');

				setTimeout(function() {

						// abstract a function for transitioning the content
						ui.updateNav(make, 230);

						if (typeof (ui.$gallery) !== "undefined" && ui.$gallery) {
							console.log("removed gallery");
							ui.$gallery.remove();
							ui.$gallery = null;
						}

						ui.newPage();

						switch (nav) {

							case 'models':
								hasher.setHash(make + "/models");
								_gaq.push(['_trackPageview', make + "/models"]);
								break;

							case 'specials':
								hasher.setHash(make + "/specials");
								_gaq.push(['_trackPageview', make + "/specials"]);
								break;

							case 'test':
								var make_url = "", model_url = "";
								if (typeof make !== "undefined")
									make_url = "/" + make;
								if (typeof model !== "undefined")
									model_url = "/" + model;
								hasher.setHash("contact/test" + make_url + model_url);
								_gaq.push(['_trackPageview', "contact/test" + make_url + model_url]);
								break;
						}

				}, 200);

				});

		},

		loadModelsGallery: function() {

			var make = arguments[0];
			
			ui.newPage();

			var galleryHTML = "<div id='gallery'>";
			galleryHTML += "<img id='backArrow' class='tap' alt='Back' src='images/backArrow.png' />";
			galleryHTML += "<div id='modelsGrid' class='galleryGrid'>";
			// =========== Model HTML Data will be injected here! ===========
			galleryHTML +=	"</div>";
			galleryHTML += "<img id='forwardArrow' class='tap' alt='Forward' src='images/forwardArrow.png' />";
			galleryHTML += "</div>";

			$("#content").append(galleryHTML);

			data.modelsForMake(make, function(tx, results) {

				var itemCount = 0;
				var model_pages = [];
				
				for (var i = 0; i < results.rows.length; i++) {

					// Setup Pagination at 8 Model boxes
					var page_num = Math.ceil(i / 7);
					if (page_num === 0) {
						page_num = 1;
					}

					var model = results.rows.item(i);
					var price = "$" + parseInt(model.price, 0).formatMoney(0, '.', ',');

					// Setup Model Container and child elements
					var model_box   = document.createElement('div');
					var model_img   = document.createElement('img');
					var model_image_path = 'images/thumbs/';
					var model_name  = document.createElement('span');
					var model_price = document.createElement('span');
					// Populate Model details
					$(model_box).attr({
						'id': "model_" + model.id,
						'class': 'tap model item' + (i+1),
						'data-id': model.id,
						'data-make': model.make
					});

					$(model_img).attr({
						'src': model_image_path + model.thumb,
						'alt' : model.make_name + " " + model.model
					});

					$(model_name).attr({'class': 'name'});
					$(model_name).html(model.model);

					$(model_price).attr({'class': 'price'});
					$(model_price).html(price);
					
					// Finalize model container
					$(model_box).append(model_img, model_name, model_price);

					// Setup Model Pages Container, store 8 Models per page
					var page_stack_id = (page_num - 1);
					if(!model_pages[page_stack_id]){
						model_pages[page_stack_id] = [];
					}
					model_pages[page_stack_id][i] = model_box;

				}

				// Rebuild models and group by page
				for(var models = 0; models < model_pages.length; models++) {
					// Build Page
					var model_sheet = document.createElement('div');
					$(model_sheet).attr({'id': 'page' + (models + 1), 'class' : 'page galleryPage '});

					// Append Models
					for(var m2 = 0; m2 < model_pages[models].length;m2++){
					$(model_sheet).append(model_pages[models][m2]);
					}

					$("#backArrow").css("visibility", "hidden");

					if (model_pages.length <= 1)
						$("#forwardArrow").css("visibility", "hidden");

					// Finalize Gallery Pages
					$('#modelsGrid').append(model_sheet);
				}

				ui.$gallery = $("#gallery");
				ui.bindGalleryEvents("model", model_pages);
			});

		},

		bindGalleryEvents: function() {

			var type = arguments[0];
			var model_pages = arguments[1];

			// var ui = this;
			var allPages = $('.galleryPage');
			var firstPage = $('#page1');
			var numberOfPages = allPages.size();
			var lastPage = $('#page' + numberOfPages);

			allPages.hide();
			firstPage.show().addClass('current');

			// Bind click to a specific model
			ui.$gallery.on("click", '.galleryGrid .model', function(event) {

				var id = $(this).data('id');
				var make = $(this).data('make');
				var model = $(this).find(".name").text();

				ui.newPage();

				if (type == "model") {
					hasher.setHash( make + "/models/" + model + "/" + id);
				}

			});

			// bind swipes on the gallery
			
			ui.$gallery.touchwipe({
				wipeLeft: function() {
					var currentPage = $('.page.current');
					var currentPageNum = currentPage.attr('id');
					currentPageNum = parseInt(currentPageNum.replace("page", ""), 0);

					if (currentPageNum == model_pages.length) {
						return;
					}
					goForward();
				},
				wipeRight: function() {

					var currentPage = $('.page.current');
					var currentPageNum = currentPage.attr('id');
					currentPageNum = parseInt(currentPageNum.replace("page", ""), 0);

					if (currentPageNum == 1) {
						return;
					}

					goBack();
				},
				min_move_x: 10,
				min_move_y: 10,
				preventDefaultEvents: true
			});

		

			// bind clicks on the arrows
			ui.$gallery.on("click", '#backArrow', function(event) {
				$("#footer #back").css("visibility", "visible");
				goBack();
			});

			ui.$gallery.on("click", '#forwardArrow', function(event) {
				$("#footer #back").css("visibility", "visible");
				goForward();
			});

			function goBack() {
				// get the visible page number
				// hide the visible page
				// show the number after
				var currentPage = $('.page.current');
				var currentPageNum = currentPage.attr('id');
				currentPageNum = currentPageNum.replace("page", "");
				currentPageNum--;

				if (currentPageNum == 1) {
					$("#backArrow").css("visibility", "hidden");
				}

				if (model_pages.length > 1)
					$("#forwardArrow").css("visibility", "visible");

				$('.page.current').removeClass('current');
				currentPage.hide('drop', {
					direction: 'left'
				}, 500, function() {
					currentPageID = "#page" + currentPageNum;
					var nextPage = $(currentPageID);

					if (nextPage.length) {
						nextPage.addClass('current');
						nextPage.show('drop', {
							direction: 'right'
						}, 500);
					} else {
						lastPage.show('drop', {
							direction: 'right'
						}, 500);
						lastPage.addClass('current');
					}
				});
			}

			function goForward() {
				// get the visible page number
				// hide the visible page
				// show the number after
				var currentPage = $('.page.current');
				var currentPageNum = currentPage.attr('id');
				currentPageNum = currentPageNum.replace("page", "");
				currentPageNum++;

				if (currentPageNum >= 1)
					$("#backArrow").css("visibility", "visible");

				if (currentPageNum == model_pages.length)
					$("#forwardArrow").css("visibility", "hidden");

				$('.page.current').removeClass('current');
				currentPage.hide('drop', {
					direction: 'right'
				}, 500, function() {
					currentPageID = "#page" + currentPageNum;
					var nextPage = $(currentPageID);

					if (nextPage.length) {
						nextPage.addClass('current');
						nextPage.show('drop', {
							direction: 'left'
						}, 500);
					} else {
						firstPage.show('drop', {
							direction: 'left'
						}, 500);
						firstPage.addClass('current');
					}
				});
			}

		},

		loadModel: function() {

			var id = arguments[0];
			var make = arguments[1];
			var model_name = arguments[2];

			console.log(id);
			console.log(make);
			console.log(model_name);
			
			data.model(id, function(tx, results) {

				var model = results.rows.item(0);
				var price = "$" + parseInt(model.price, 0).formatMoney(0, '.', ',');

				var modelHTML = "<div id='modelPage' class='detailPage page'>";
				modelHTML += "<a href='javascript:ui.goBack();'><img id='close' class='tap' src='images/close-button.png' /></a>";
				modelHTML += "<img id='car' src='images/models/" + model.image + "' alt='" + model.make_name + " " + model.model + "' />";
				modelHTML += "<div id='details'>";
				modelHTML += "<h2 class='name'> " + model.make_name + " " + model.model + " </h2>";
				modelHTML += "<h3 class='price'> Starting at: " + price + " </h3>";
				modelHTML += "<div id='mpg'>";
				modelHTML += "<span class='info'> City MPG: <br /><span class='int'>" + model.mpg_city + "</span> </span>";
				modelHTML += "<img id='gas' src='images/gas.png' />";
				modelHTML += "<span class='info'> Hwy MPG: <br /><span class='int'>" + model.mpg_hwy + "</span> </span>";
				modelHTML += "</div>";
				modelHTML += "<span class='features'> Features:<br />";
				modelHTML += model.features;
				modelHTML += "</span>";
				modelHTML += "</div>";
				modelHTML += "</div>";

				ui.newPage();
				$("#content").append(modelHTML);
				
				ui.bindModelEvents();

			});

		},

		bindModelEvents: function() {

			

			// ADD A WAY TO SWIPE BACK AND FORTH BETWEEN MODELS

			/*

				ui.$gallery.touchwipe({
				wipeLeft: function() {
					goBack();
				},
				wipeRight: function() {
					goForward();
				},
				min_move_x: 10,
				min_move_y: 10,
				preventDefaultEvents: true
			});

			*/

		},

		loadSpecialsGallery: function() {

			var make = arguments[0];

			ui.newPage();

			var galleryHTML = "<div id='specials'>";

			data.specials(make, function(tx, specials) {

				var len = specials.rows.length;

				for (var i = 0; i < len; ++i) {

					var special = specials.rows.item(i);

					galleryHTML += "<div id='item" + i + "' class='special item' data-id='" + special.id + "' data-make='" + special.make + "'>";
					galleryHTML += "<img src='images/thumbs/" + special.thumb + "' />";
					galleryHTML += "<span class='headline'>" + special.headline + "</span>";
					galleryHTML += "<span class='description'>" + special.description + "</span>";
					galleryHTML += "</div>";

				}

				if (len === 0) {
					galleryHTML += "<h2>Sorry, there are no " + data.makes[make].name + " specials</h2>";
				}

				galleryHTML += "</div>";

				$("#content").append(galleryHTML);
				ui.$gallery = $("#gallery");

				ui.bindGalleryEvents("special");


			});

		},

		loadContact: function() {

			var page = arguments[0] || "";
			var make = arguments[1] || "";
			var model = arguments[2] || "";

			ui.newPage();
			
			console.log(make);
			console.log(model);
			console.log(page);

			var contactHTML = "<span id='contact' class='contact'> " +
			"<a href='javascript:ui.goBack();'><img id='close' class='tap' src='images/close-button.png' /></a>" +
			"<h2>Please enter your contact information:</h2>" +
			"<span style='font-weight:normal;'>* required</span>" +
			"<br />" +
			"<div id='contactForm'>" +
			"	<label for='first'>First Name *</label>" +
			"	<input type='text' id='first' name='first' title='First Name' size='20'>" +
			"	<label for='last'>Last Name *</label>" +
			"	<input type='text' id='last' name='last' title='Last Name' size='33'>" +
			"	<label for='email'>Email *</label>" +
			"	<input type='text' id='email' name='email' title='Email' size='33'>" +
			"	<label for='phone'>Phone Number</label>" +
			"	<input type='text' id='phone' name='phone' title='Phone Number' size='20'>" +
			"	<label for='make'>Car Make*</label>" +
			"	<select id='make' name='make'>" +
			"		<option value='audi'>Audi</option>" +
			"		<option value='vw'> Volkswagen</option>" +
			"		<option value='subaru'>Subaru</option>" +
			"		<option value='porsche'>Porsche</option>" +
			"		<option value='maserati'>Maserati</option>" +
			"		<option value='landrover'>Land Rover</option>" +
			"		<option value='bmw'>BMW</option>" +
			"	</select>						" +
			"	<label for='model'>Model</label>" +
			"	<input type='hidden' name='page' value='contact'>	" +
			"	<input type='text' id='model' name='model' title='Model' size='15' value='" + model  + "'>" +
			"	<input type='submit' id='submit' value='SUBMIT' src='images/_0000_Reeves-logo.png'>" +
			"</div> </span>";


			$("#content").append(contactHTML);

			ui.bindContactEvents(page);

			$("#make").val(make);
		},

		bindContactEvents : function() {

			var page = arguments[0];
			// var ui = this;
			


			$('#contactForm').isHappy({
				fields : {
					// reference the field you're talking about, probably by `id`
					// but you could certainly do $('[name=name]') as well.
					'#first' : {
						required : true,
						message : 'Please enter your first name correctly.'
					},
					'#last' : {
						required : true,
						message : 'Please enter your last name correctly.'
					},
					'#email' : {
						required : true,
						message : 'Please enter your email correctly.',
						test : happy.email
					},
					'#phone' : {
						required : false,
						message : 'Please enter your phone number correctly.',
						test : happy.USPhone
					},
					'#make' : {
						required : true,
						message : 'Please enter the car make correctly.'
					},
					'#model' : {
						required : false,
						message : 'Please enter the car model correctly.'
					}
				}
			});

			ui.$contactForm = $("#contactForm");


			function val(id) {
				return ui.$contactForm.find("#" + id).val();
			}

			$("#reevesLogo").on("click", function() {

				console.log(val("first"));

				if (val("first") === "reset") {
					alert(val("first"));
					data.emptyDB(function() {
						window.alert("Reset Database");
					});
				}
				else if (val("first") === "update") {
					data.updateTables("alert");
				}

			});

			$("#submit").on("click", function() {

				
				data.saveContact({
					first : val("first"),
					last : val("last"),
					email : val("email"),
					phone : val("phone"),
					make : val("make"),
					model : val("model"),
					page : page,
					submit : val("submit")
				});
				

				ui.newPage();

				$("#content").append("<h2>Thank you!</h2>");

			});

		},

		updateNav: function() {

			var make = arguments[0];
			var leftMargin = arguments[1];

			$('.currentLogoMarker').hide("fade", {}, 300);

			/* Move the current logo marker to the beneath the center of the current logo
			* Note: At the extreme widths, the current pointer wont center unless we counterbalance it by adding/subtracting 33/35px
			*/

			leftMargin = $('#logo_' + make).width();
			if(leftMargin < 80) {
				leftMargin = leftMargin + 33;
			}
			if(leftMargin > 170) {
				leftMargin = leftMargin - 35;
			}
			$('img.currentLogoMarker').detach();
			$('#logo_' + make).after('<img src="images/current_logo.png" class="currentLogoMarker" style="margin-left:-' + leftMargin + 'px;" />');

		},

		newPage : function() {

			$("#content").off();
			$("#content").removefromdom();
			$("#content").remove();
			$("#main").append('<div id="content"></div>');

		}


	};
})();
