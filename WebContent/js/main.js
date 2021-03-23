$( document ).ready(function() {
    $("#RolesContainer").hide();
    $("#searchContainer").hide();

    $("#rolesNav").click(function(e) {
      $(".tabContainer").hide();
      $("#RolesContainer").show();
      setActiveTab(this);
    });

    $("#dashboardNav").click(function() {
      $(".tabContainer").hide();
      $("#dashboardContainer").show();

      setActiveTab(this)
    });

    $("#searchNav").click(function() {
      $(".tabContainer").hide();
      $("#searchContainer").show();

      setActiveTab(this)
    });

    $("#dbTest").click(function(){
    	ajaxTest();
    });
});


function setActiveTab(tabElement){
  $(".active").removeClass("active")
  $(tabElement).parent().addClass("active");
}

function ajaxTest(){
	console.log("TEST")

    $.ajax({
        url: 'ItemServlet',
        dataType: 'text',
        type: 'POST',
        data: "hello",
        success: function( data ){
            console.log(data);
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
}
