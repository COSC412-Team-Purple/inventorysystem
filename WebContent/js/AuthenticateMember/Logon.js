let _emailInput = $("#emailInput");
let _passwordInput = $("#passwordInput");
let _logInButton = $("#logInButton")
let _memberId = null;
let _memberPermissions = null;


_logInButton.click(function(){
  let user = _emailInput.val().trim();
  let pass = _passwordInput.val().trim();

  if(isValidLoginInputs(user, pass)){
    authenticateMemberInDB(user, pass);
  }else{
    showLoginError("Username or Password input was left empty. Try again.");
  }
});

function isValidLoginInputs(user, pass){
  let isValid = true;

  if(user.length === 0 || pass.length === 0){
    return false;
  }

  return isValid;
}

function authenticateMemberInDB(user, pass){
    let servletParameters = {"username": user, "password": pass};
    $.ajax({
        url: 'AuthenticateMember',
        dataType: 'text',
        type: 'POST',
        data: servletParameters,
        success: function( data ){
            let response = JSON.parse(data);
            console.log("Response")
            console.log(response)
            handleAuthenticateResponse(response);
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
            showLoginError("No member in our database matched these credentials");
        }
    });
}

function handleAuthenticateResponse(response){
  _memberId = response.memberId;
  _permissions = response.permissions;

  if(_memberId !== null || _memberId !== ""){
    putMemberIdAndPermissionsInSessionStorage(response.memberId, response.permissions);
    if(response.needsPasswordReset){
      hideMainLogin()
      //interface with ResetPassword.js
      showPasswordReset();
    }else{
      setWindowToMainApplication();
    }
  }else{
    showLoginError("Memeber could not be found. Try again.");
  }
}

function setWindowToMainApplication(){
  console.log("in set window");
  window.location.href = window.location.href + "Home.html";
}


function putMemberIdAndPermissionsInSessionStorage(memberId, permissions){
  sessionStorage.setItem('memberId', memberId);
  sessionStorage.setItem('memberPermissions', permissions);
}


function hideMainLogin(){
  $(".mainLogin").hide();
}

function showLoginError(message){
  let errorAlert = $("#logOnErrorAlert");
  errorAlert.html(message);
  errorAlert.show();
  setTimeout(function(){
    errorAlert.hide();
  }, 3000)
}

function getMemberId(){
  return _memberId;
}
