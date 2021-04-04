let _roleCheckboxes = $(".roleCheckbox");
let _createRoleButton = $("#createRoleButton");
let _createRoleNameInput = $("#roleNameInput");


_createRoleButton.click(function(event){
  //add a check for if the member has permission, interface with ActionValidation.js hasPermission(permission)

  if(hasPermission("create_role")){
    if(isRoleNameFilledIn()){
      createRoleInDB();
    }
  }else{
    showErrorMessage("no permission")
  }
})


function isRoleNameFilledIn(){
  if(_createRoleNameInput.val().trim() === ""){
    //if the role name is empty
    showErrorMessage("Error. Role name must not be empty to create a role.");
    return false;
  }else{
    //if the role name is not empty
    return true;
  }
}

function getCheckedOnPermissions(){
  let permissions = "";

  //loop over all checkboxes
  _roleCheckboxes.each(function(){
    //if checkbox is checked then add the permission to the permissions array
    if($(this).is(':checked')){
      permissions += $(this).val() + ",";
    }
  });
  //remove the last comma on the build permissions string
  permissions = permissions.slice(0, -1);
  return permissions;
}

function handleCreateRoleResponse(response){
  //add role to gloabal array
  ROLES.push(response);

  //interface with AssignRole.js to add role to dropdown and table
  addRoleToRolesTable(response);
  addRoleOptionToRoleSelect(response.roleName);

  showSuccessMessage("The role <strong>" + response.roleName + "</strong> was successfully created!");
}



function createRoleInDB(){
    servletParameters = {"roleName": _createRoleNameInput.val().trim(), "perms": getCheckedOnPermissions()};
    console.log(servletParameters);
    $.ajax({
        url: 'CreateRole',
        dataType: 'text',
        type: 'POST',
        data: servletParameters,
        success: function( data ){
            let response = JSON.parse(data);
            console.log(response)
            handleCreateRoleResponse(response);
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
}
