<script id="gallery-template" type="text/x-handlebars-template">
				var galleryHTML = "<div id='gallery'>";
				<img id='backArrow' class='tap' alt='Back' src='images/backArrow.png' />";
				<div id='modelsGrid' class='galleryGrid'>";
				<div id='page1' class='page galleryPage current'>";

				var page = 2,
					itemCount = 1;

				for (var i = 0; i < models.rows.length; ++i) {

					var model = models.rows.item(i);
					var price = "$" + parseInt(model.price, 0).formatMoney(0, '.', ',');

					if (itemCount == 8) { // time to make a new page
						</div>";
						<div id='page" + page + "' class='page galleryPage'>";
						page++;
						itemCount = 1;
					}

					// $price = "$" . number_format($row -> price);
					<div id='" + model.id + "' class='model item" + itemCount + "' data-id='" + model.id + "' data-make='" + model.make + "'>";
					<img src='images/thumbs/" + model.thumb + "' alt='" + model.make_name + " " + model.model + "' />";
					<span class='name'>" + model.model + "</span>";
					<span class='price'>" + price + "</span>";
					</div>";

					itemCount++;
				}

				</div></div>";
				<img id='forwardArrow' class='tap' alt='Forward' src='images/forwardArrow.png' />";
				</div>";

</script>