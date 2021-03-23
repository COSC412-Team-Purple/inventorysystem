$( document ).ready(function() {
    $("#RolesContainer").hide();
	$("#searchContainer").hide();

	$("#searchNav").click(function(e) {
      $("#dashboardContainer").hide();
	  $("#RolesContainer").hide();
      $("#searchContainer").show();
      setActiveTab(this);
    });

    $("#rolesNav").click(function(e) {
      $("#dashboardContainer").hide();
	  $("#searchContainer").hide();
      $("#RolesContainer").show();
      setActiveTab(this);
    });

    $("#dashboardNav").click(function() {
      $("#RolesContainer").hide();
	  $("#searchContainer").hide();
      $("#dashboardContainer").show();

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
