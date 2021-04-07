

$("#rolesNav").click(function(e) {
  clearSearchTable()
  hideAllContainers();
  $("#RolesContainer").show();
  setActiveTab(this);
});

$("#dashboardNav").click(function() {
  clearSearchTable()
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
  clearSearchTable()
  hideAllContainers();
  $("#registerItemContainer").show();
  setActiveTab(this);
});

$("#logOutButton").click(function(){
    sessionStorage.clear();
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
  clearSearchTable()
  hideAllContainers();
  $("#createRoleContainer").show();
});

document.getElementById('tableBody').addEventListener('click', (e) => {
	if(!e.target.classList.contains('advanced')) {
		return
	}
	hideAllContainers();
	giveDataToAdvanceView(e.target);
  	$("#advancedItemDetailContainer").show();
  	setActiveTab(this)
})

function setActiveTab(tabElement){
  $(".active").removeClass("active")
  $(tabElement).parent().addClass("active");
}
