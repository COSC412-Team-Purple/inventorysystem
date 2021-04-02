

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

function setActiveTab(tabElement){
  $(".active").removeClass("active")
  $(tabElement).parent().addClass("active");
}
