$("document").ready(function() { 

    $("#categories").change(function() {
		var categorie = $(this).val();
		if ( categorie != 0 ) {
			$.ajax({
			type: 'POST',
			url: path,
			data: {categorie: categorie},
			dataType : 'json',
				beforeSend: function() {
					console.log('On charge');
					$("#sscategories option").remove();
					$("#sscategories").append($('<option>',{ value:0, text: "Aucune sous-catégorie"}));
					$("#sscategories").attr('disabled', 'disabled');
				},
				success: function(data) {
					console.log('Requete ok',data);
					$("#sscategories option").remove();
					$("#sscategories").append($('<option>',{ value:0, text: "Toutes les sous-catégories" }));
					$.each(data.ssCategorieTab, function(index,value) {
						$("#sscategories").append($('<option>',{ value : value.id , text: value.name }));
						$("#sscategories").removeAttr('disabled');
					});
				},
			});
		}
		else {
			$("#sscategories option").remove();
			$("#sscategories").append($('<option>',{ value:0, text: "Toutes les sous-catégories" }));
			$("#sscategories").attr('disabled', 'disabled');
		}
    });
	$('.fav').click(function() {
		var fav = $(this).attr('value');
		
		if ( $(this).hasClass('glyphicon-star-empty')){
			$.ajax({
			type: 'POST',
			url: bookmark,
			data: {fav: fav},
			dataType : 'json',
			});
			$(this).removeClass('glyphicon-star-empty').addClass('glyphicon-star');
		}
		else{
			$.ajax({
			type: 'POST',
			url: bookmark,
			data: {fav: fav},
			dataType : 'json',
			});
			$(this).removeClass('glyphicon-star');
			$(this).addClass('glyphicon-star-empty');
		}
	});
	$("#search").keyup(function() {
		var search = $(this).val();
		
		if((search.length)>=3){
			var count = 0;
			$.ajax({
				type: 'POST',
				url: autocompletion,
				data: {recherche: search},
				dataType : 'json',

				beforeSend: function() {
					console.log('Requete en cours');
					$("#auto p").remove();
					$("#auto h5").remove();
					$("#auto").css("display", "none");
				},

				success: function(data) {					
					console.log('Requete ok',data);
					$("#auto").css("display", "block");
					if (data.nameTab.length!=0){
						count = 0;			
						$("#auto").append($('<h5>',{ text: 'Mes Fichiers' }).addClass('bold'));
						$.each(data.nameTab, function(index,value) {
							if (count<3){
								$("#auto").append($('<p>',{ text: value.name }));
								count ++;
							}
						});
					}
					if (data.tagTab.length!=0){
						count = 0;
						$("#auto").append($('<h5>',{ text: 'Mes Tags' }).addClass('bold'));
						$.each(data.tagTab, function(index,value) {
							if (count<3){
								$("#auto").append($('<p>',{ text: value.name }));
								count ++;
							}
						});
					}
					if (data.grpNameTab.length!=0){
						count = 0;
						$("#auto").append($('<h5>',{ text: 'Fichier de mes groupes' }).addClass('bold'));
						$.each(data.grpNameTab, function(index,value) {
							if (count<3){
								$("#auto").append($('<p>',{ text: value.name }));
								count ++;
							}
						});
					}
					if (data.grpTagTab.length!=0){
						count = 0;
						$("#auto").append($('<h5>',{ text: 'Tags de mes groupes' }).addClass('bold'));
						$.each(data.grpTagTab, function(index,value) {
							if (count<3){
								$("#auto").append($('<p>',{ text: value.name }));
								count ++;
							}
						});
					}
					$("#auto p").click(function(){
						var remplace = $(this).text();
						$("#search").val(remplace);
					});
					if(data.nameTab.length==0 && data.tagTab.length==0 && data.grpNameTab.length==0 && data.grpTagTab.length==0){
						$("#auto h5").remove();
						$("#auto").append($('<h5>',{ text: 'Aucun résultat' }));
					}
				},

				error: function() {
					console.log('Requete fail');
				},
			});
		}
		else{
			$("#auto p").remove();
			$("#auto h5").remove();
			$("#auto").css("display", "none");
		}
	});
	
	//fondu au clique en dehors du cadre.
	var auto = $('#auto');
	var search = $('#search');

	$(document.body).click(function(e) {
		// Si ce n'est pas #ma_div ni un de ses enfants
		if ( $(e.target).is(search) ){
			auto.fadeIn();
		}
		else if( !$(e.target).is(auto)&& !$.contains(auto[0],e.target) ) {
			// masque #ma_div en fondu
			auto.fadeOut();
		
		}
	});	
});