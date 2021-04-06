let LOGGED_ON_MEMBER_ID = "";
let DEPARTMENTS = [];
let CATEGORIES = [];
let LOCATIONS = [];
let ROLES = [];
let LOGIN_URL = "http://localhost:8080/inventorysystem/";

$( document ).ready(function() {
  $(".alert").hide();
  let sessionStoredMemberId = sessionStorage.getItem('memberId');

  if(sessionStoredMemberId !== null){
    hideAllContainers();
    $("#dashboardContainer").show();

    LOGGED_ON_MEMBER_ID = sessionStoredMemberId;

    //interface with ActionValidation.js
    setPermissions(sessionStorage.getItem('memberPermissions'));

    //interface with Dashboard.js
    getDashboardDataFromDB();

    //interface with DepartmentsAndLocations.js
    getDepartmentsAndLocationsFromDB();

    //interface with AssignRole.js
    getRolesInDB();
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

function showErrorMessageOnIncreaseModal(message){
  let errorAlert = $("#errorAlertIncreaseModal");
  errorAlert.html(message);
  errorAlert.show();
  setTimeout(function(){
    errorAlert.hide();
  }, 3000)
}

function showErrorMessageOnReduceModal(message){
  let errorAlert = $("#errorAlertReduceModal");
  errorAlert.html(message);
  errorAlert.show();
  setTimeout(function(){
    errorAlert.hide();
  }, 3000)
}

function showErrorMessageOnDisposeModal(message){
  let errorAlert = $("#errorAlertDisposeModal");
  errorAlert.html(message);
  errorAlert.show();
  setTimeout(function(){
    errorAlert.hide();
  }, 3000)
}

function showErrorMessageOnReportMissingModal(message){
  let errorAlert = $("#errorAlertReportMissingModal");
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
    successAlert.hide();
  }, 3000)
}
