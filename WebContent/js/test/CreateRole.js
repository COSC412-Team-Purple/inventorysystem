let backToRolesScreenButton;

function setupCreateRolesListeners() {
  backToRolesScreenButton = $("#backToRolesScreenButton");
  
  backToRolesScreenButton.click(function() {
    hideAllContainers();
    $("#RolesContainer").show();
  });
}
