
function addRoleToRolesTable(role){
  //turn permission array into string and remove the front and back quotation marks
  let permsString = role.perms.toString();
  permsString = permsString.replaceAll('"', '');

  let rolesTableRow = '<tr>' +
                        '<th scope="row">' + role.roleId + '</th>' +
                        '<td>'+ role.name_pos + '</td>' +
                        '<td>'+ permsString + '</td>'' +
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
            handleGetRolesResponse(response);
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
}

function addRoleOptionToRoleSelect(roleName){
  let optionHtml = '<option value="'+ roleName +'">'+ roleName + '</option>'
  $("#roleSelect").append(optionHtml);
}

// json array, each json object has a roleId, name_pos, perms
function handleGetRolesResponse(response){
  ROLES = response;
  response.forEach((role) => {
    addRoleOptionToRoleSelect(role.roleId);
    addRoleToRolesTable(role);
  });

}
