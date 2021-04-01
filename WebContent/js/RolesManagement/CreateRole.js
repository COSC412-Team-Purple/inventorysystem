let _roleCheckboxes = $(".roleCheckbox");
let _createRoleButton = $("#createRoleButton");
let _backToRolesScreenButton = $("#backToRolesScreenButton");
let _createRoleNameInput = $("#roleNameInput");



_backToRolesScreenButton.click(function() {
  hideAllContainers();
  $("#RolesContainer").show();
});

_createRoleButton.click(function(){
  //add a check for if the member has permission, interface with ActionValidation.js hasPermission(permission)
  //if(hasPermission("create_role")){
    if(isRoleNameFilledIn()){
      createRoleInDB();
    }
  //}
});


function isRoleNameFilledIn(){
  if(_createRoleNameInput.val().trim() === ""){
    //if the role name is empty
    showCreateRoleError("Error. Role name must not be empty to create a role.");
    return false;
  }else{
    //if the role name is not empty
    return true;
  }
}

function getCheckedOnPermissions(){
  let permissions = [];

  //loop over all checkboxes
  _roleCheckboxes.each(function(){
    //if checkbox is checked then add the permission to the permissions array
    if($(this).checked){
      permissions.push($(this).val());
    }
  });

  return permissions
}

function handleCreateRoleResponse(response, statusCode){
  if(statusCode === 200){
    ROLES.push(response);
    //interface with AssignRole.js
    addRoleToRolesTable(response);
    addRoleOptionToRoleSelect(response.name_pos);

    showRoleCreationSuccess("The role " + response.name_pos + "was successfully created!");
  }else{
    showCreateRoleError("Error occured while creating role in the database");
  }
}



function createRoleInDB(){
    servletParameters = {"name_pos": _createRoleNameInput.val().trim(), "perms": getCheckedOnPermissions()};
    $.ajax({
        url: 'CreateRole',
        dataType: 'text',
        type: 'POST',
        data: servletParameters,
        success: function( data, textStatus, xhr ){
            let response = JSON.parse(data);
            response["name_pos"] = servletParameters.name_pos;
            response["perms"] = servletParameters.perms;
            handleCreateRoleResponse(response, xhr.status);
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
}

//interface with global function from Home.js
function showCreateRoleError(message){
  showErrorMessage(message);
}

//interface with global function from Home.js
function showRoleCreationSuccess(message){
  showSuccessMessage(message);
}
