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

    $("#registerNav").click(function(e) {
      hideAllContainers();
      $("#registerItemContainer").show();
      setActiveTab(this);
    });

    setupBarChart();

    $("#dbTest").click(function(){
    	ajaxTest();
    });

    $("#logOutButton").click(function(){
        window.location.href = "http://localhost:8080/inventorysystem";
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

/*
function loadLogonHtml () {
    $("#mainLogonContainter").load("LoginPage.html #logonBigContainter", function(responseTxt, statusTxt, jqXHR){
        jqXHR.done(function(){
          console.log("DONE");
          console.log(responseTxt);

          let loginhtml = $("#logonBigContainter").html();
          console.log(loginhtml);
          $("#mainLogonContainter").html(loginhtml);
          //$("#mainLogonContainter").append($("#logonContainter").html());

        })
    });
}
*/
