let _permissions = [];

function hasPermission(perm){
  if(_permissions.includes(perm)){
    return true;
  }else{
    showErrorMessage("You do not have permission to " + perm);
    return false;
  }
}

function setPermissions(perms){
  _permissions = perms;
}
