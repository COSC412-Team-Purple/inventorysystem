let LOGGED_ON_MEMBER_ID = "";
let DEPARTMENTS = [];
let CATEGORIES = [];
let LOCATIONS = [];
let ROLES = [];
let LOGIN_URL = "http://localhost:8080/inventorysystem/";

$( document ).ready(function() {
  let sessionStoredMemberId = sessionStorage.getItem('memberId');
  if(sessionStoredMemberId !== null || sessionStoredMemberId !== undefined || sessionStoredMemberId !== ""){
    hideAllContainers();
    $("#dashboardContainer").show();


    LOGGED_ON_MEMBER_ID = sessionStoredMemberId;

    //interface with ActionValidation.js
    //setLoggedOnMemberPermissions(sessionStorage.getItem('memberPermissions'));
  }else{
    window.location.href = LOGIN_URL;
  }
});

function hideAllContainers(){
  $(".tabContainer").hide();
  $(".innerContainer").hide();
}



function showErrorMessage(message){
  let errorAlert = $("#errorAlert");
  errorAlert.html(message);
  errorAlert.show();
  setTimeout(function(){
    errorAlert.hide();
  }, 3000)
}

function showSuccessMessage(message){
  let successAlert = $("#successAlert");
  successAlert.html(message);
  successAlert.show();
  setTimeout(function(){
    errorAlert.hide();
  }, 3000)
}
