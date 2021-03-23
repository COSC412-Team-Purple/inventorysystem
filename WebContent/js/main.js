$( document ).ready(function() {
    hideAllContainers();
    $("#dashboardContainer").show();

    $("#rolesNav").click(function(e) {
      hideAllContainers();
      $("#RolesContainer").show();
      setActiveTab(this);
    });

    $("#dashboardNav").click(function() {
      hideAllContainers();
      $("#dashboardContainer").show();

      setActiveTab(this)
    });

    $("#searchNav").click(function() {
      hideAllContainers();
      $("#searchContainer").show();

      setActiveTab(this)
    });

    setupBarChart();

    $("#dbTest").click(function(){
    	ajaxTest();
    });
});

function hideAllContainers(){
  $(".tabContainer").hide();
  $(".innerContainer").hide();
}

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
