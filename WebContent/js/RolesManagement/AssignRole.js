let _confirmAssignmentButton = $("#assignModalConfirmationButton");

//add a row to the roles table
function addRoleToRolesTable(role){
  //turn permission array into string and remove the front and back quotation marks
  let permsString = role.perms.toString();
  permsString = permsString.replaceAll('"', '');

  let rolesTableRow = '<tr>' +
                        '<th scope="row">' + role.roleId + '</th>' +
                        '<td>'+ role.roleName + '</td>' +
                        '<td>'+ permsString + '</td>' +
                      '</tr>';
  $("#rolesTable").append(rolesTableRow);
}

function getRolesInDB(){
    $.ajax({
        url: 'GetRoles',
        dataType: 'text',
        type: 'GET',
        data: "",
        success: function( data, textStatus, xhr ){
            let response = JSON.parse(data);
            console.log(response);
            handleGetRolesResponse(response);
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
}

//add an option to the role select dropdown
function addRoleOptionToRoleSelect(roleName){
  let optionHtml = '<option value="'+ roleName +'">'+ roleName + '</option>'
  $("#roleSelect").append(optionHtml);
}

// json array, each json object has a roleId, roleName, perms
function handleGetRolesResponse(response){
  ROLES = response;
  response.forEach((role) => {
    addRoleOptionToRoleSelect(role.roleName);
    addRoleToRolesTable(role);
  });

}

//when the member click the assign role button
$('#assignRoleButton').click(function (e) {
  //prevents it from reloading the page
  e.preventDefault();

  //member name from the display
  let memberName = $("#memberResultName").val().trim();

  //checks permission to assign roles and that a member was actually searched
  if(hasPermission("assign_role") && memberName !== ''){
    $("#assignModalName").html(memberName);
    $("#assignModalRole").html($("#roleSelect").val());
    $('#assignRoleModal').modal('toggle');
  }else if(memberName === ''){
    showErrorMessage("You must search a member first to assign a role");
  }else{
    showErrorMessage("You do not have permission to assign roles to members")
  }
});

//when the member clicks the confirm button in the modal
_confirmAssignmentButton.click(function(e){
  e.preventDefault();
  assignRoleToMemberInDB();
})

//function to send post to backend
function assignRoleToMemberInDB(){
  let assignedRole = $("#roleSelect").val().trim();
  let servletParameters = {"member_id" :  $("#memberResultId").val(), "role_id" : getRoleId(assignedRole)};
  console.log(servletParameters);
  $.ajax({
      url: 'AssignRole',
      dataType: 'text',
      type: 'POST',
      data: servletParameters,
      success: function( data ){
          let response = JSON.parse(data);
          console.log(response)
          handleAssignRoleToMemberResponse(response);
      },
      error: function( jqXhr, textStatus, errorThrown ){
          console.log( errorThrown );
      }
  });
}

function handleAssignRoleToMemberResponse(response){
  //close the modal
  $('#assignRoleModal').modal('toggle');

  //update the current role display part on the screen
  $("#memberResultCurrentRole").val(response.member_role);

  showSuccessMessage("Successfully assigned member to the "+ response.member_role + " role");
}

function getRoleId(roleName){
  //loop over roles in the global variable array and find the one that matches the dropdown
  //return that id if found, return 0 if not
  let id = 0;
  ROLES.forEach( (role) => {
    if(role.roleName == roleName){
      id = role.roleId;
    }
  })
  return id;
}
