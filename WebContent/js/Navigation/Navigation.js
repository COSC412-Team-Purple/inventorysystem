

$("#rolesNav").click(function(e) {
  hideAllContainers();
  $("#RolesContainer").show();
  setActiveTab(this);
});

$("#dashboardNav").click(function() {
  //interface with Dashboard.js
  getDashboardDataFromDB();
  
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

$("#logOutButton").click(function(){
    window.location.href = LOGIN_URL;
});

$("#backToSearchScreenButton").click(function() {
  hideAllContainers();
  $("#searchContainer").show();
});

$("#backToRolesScreenButton").click(function() {
  hideAllContainers();
  $("#searchContainer").show();
});

$("#toCreateRoleButton").click(function() {
  hideAllContainers();
  $("#createRoleContainer").show();
});

document.getElementById('tableBody').addEventListener('click', (e) => {
	console.log(e.target)
	if(!e.target.classList.contains('advanced')) {
		return
	}
	console.log('advanced view')
	hideAllContainers();
  	$("#advancedItemDetailContainer").show();
  	setActiveTab(this)
})

function setActiveTab(tabElement){
  $(".active").removeClass("active")
  $(tabElement).parent().addClass("active");
}
