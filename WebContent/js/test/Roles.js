let toCreateRoleButton;
let searchMemberButton;
let assignRoleSelect;
let assignRoleButton;


function setupRolesListeners(){
  searchMemberButton = $("#searchMemberButton");
  assignRoleSelect = $("#roleSelect");
  assignRoleButton = $("#assignRoleButton");

  toCreateRoleButton = $("#toCreateRoleButton");
  toCreateRoleButton.click(function() {
    hideAllContainers();
    $("#createRoleContainer").show();
  });
}
