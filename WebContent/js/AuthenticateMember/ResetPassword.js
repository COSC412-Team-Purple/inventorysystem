let _newPasswordInput = $("#newPasswordInput");
let _confirmPasswordInput = $("#confirmPasswordInput");
let _resetPasswordAndLoginButton = $("#resetPasswordAndLoginButton");


_resetPasswordAndLoginButton.click(function(){
  let newPass = _newPasswordInput.val().trim();
  let confirmPass = _confirmPasswordInput.val().trim();

  if(validPasswordInputs(newPass, confirmPass)){
    resetPasswordInDB(newPass);
  }
});

function handleResetPasswordResponse(response){
  if(response.success){
    //switch to main application, interface with Logon.js
    setWindowToMainApplication();
  }else{
    showResetPasswordError("Error occurred while resetting your password.");
  }
}

function resetPasswordInDB(newPass){
    servletParameters = {"id": getMemberId(), "newPassword" : newPass};
    $.ajax({
        url: 'AuthenticateMember',
        dataType: 'text',
        type: 'POST',
        data: servletParameters,
        success: function( data, textStatus, xhr ){
          handleResetPasswordResponse(xhr.status)
        },
        error: function( jqXhr, textStatus, errorThrown ){
            showResetPasswordError(errorThrown);
        }
    });
}

function validPasswordInputs(newPass, confirmPass){
  let isValid = true;

  if(newPass.length < 8){
    //length isnt at least 8 characters
    isValid = false;

    //adding danger class makes the text turn red
    $("#passCharLengthReminder").addClass("danger");
  }else{
    $("#passCharLengthReminder").removeClass("danger");
  }

  if(newPass.toUpperCase() === newPass){
    //no lowercase
    isValid = false;
    $("#passLowerReminder").addClass("danger");
  }else{
    $("#passLowerReminder").removeClass("danger");
  }

  if(newPass.toLowerCase() === newPass){
    //no uppercase
    isValid = false;
    $("#passUpperReminder").addClass("danger");
  }else{
    $("#passUpperReminder").removeClass("danger");
  }

//does the password have a number
  let hasNum = false;
  for(i= 0; i < 10 && !hasNum; i++){
    if(newPass.includes(i)){
      hasNum = true;
    }
  }

  if(!hasNum){
    //no number
    isValid = false;
    $("#passNumberReminder").addClass("danger");
  }else{
    $("#passNumberReminder").removeClass("danger");
  }

  if(!newPass.includes("!") && !newPass.includes("@") && !newPass.includes("#") && !newPass.includes("$") && !newPass.includes("%")){
    //no special char
    isValid = false;
    $("#passSpecialCharReminder").addClass("danger");
  }else{
    $("#passSpecialCharReminder").removeClass("danger");
  }

  if(newPass !== confirmPass){
    showResetPasswordError("The new password and confirm password do not match. Try again.")
    isValid = false;
  }

  return isValid;
}

//shows the new password input, confirm password input, and reset password and log in button
function showPasswordReset(){
  $(".reset").show();
}

function showResetPasswordError(message){
  let errorAlert = $("#logOnErrorAlert");
  errorAlert.html(message);
  errorAlert.show();
  setTimeout(function(){
    errorAlert.hide();
  }, 3000);
}
