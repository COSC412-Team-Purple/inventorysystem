let _searchMemberButton = $("#searchMemberButton");
let _searchMemberIdInput = $("#searchMemberIdInput");
let _searchMemberFnameInput = $("#searchMemberFnameInput");
let _searchMemberLnameInput = $("#searchMemberLnameInput");


_searchMemberButton.click(function(){
  //if the member has permission to search members and they entered a valid search
  if(hasPermission("search_member") && validMemberSearch()){
    searchMemberInDB()
  }
});

function validMemberSearch(){
  let valid = false;
  let id = Number(_searchMemberIdInput.val());

//ceck to see if the entered number is a integer
  if(Math.floor(id) === id && id > 0){
    valid = true;

  //check to see if a value was even entered into the id
  }else if(id <= 0){
    valid = false;
  }else{
    showErrorMessage("Id has to be an integer value");
    return false;
  }

  let fname = _searchMemberFnameInput.val().trim();
  let lname = _searchMemberLnameInput.val().trim();
  //check to see if inputs are empty
  if(lname !== "" && fname !== ""){
    valid = true;
  }

  //if invalid search, show error
  if(!valid){
    showErrorMessage("Error. Either member id needs a value greater than 0 or both first name and last name needs a value.");
  }
  return valid;
}

function searchMemberInDB(){
    let memberId = _searchMemberIdInput.val();
    //if the id is empty, set to 0 so there is no type error on the java side
    if(memberId === ""){
      memberId = 0;
    }
    let servletParameters = {"member_id" :  memberId, "member_fname" : _searchMemberFnameInput.val().trim(), "member_lname": _searchMemberLnameInput.val().trim()};
    console.log(servletParameters);
    $.ajax({
        url: 'SearchMember',
        dataType: 'text',
        type: 'POST',
        data: servletParameters,
        success: function( data ){
            let response = JSON.parse(data);
            console.log(response)
            handleSearchMemberResponse(response);
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
}

function handleSearchMemberResponse(response){
  //if the member_id > 0, then the member was found
  if(response.member_id > 0){
    //populate the results on the page
    $("#memberResultName").val(response.member_fname + " " + response.member_lname);
    $("#memberResultId").val(response.member_id);
    $("#memberResultStartDate").val(response.member_start_date);

    //if the member does not have an end date, set it as present
    if(response.member_end_date !== null){
      $("#memberResultEndDate").val(response.member_end_date);
    }else{
      $("#memberResultEndDate").val("Present");
    }

    $("#memberResultDepartment").val(response.member_dept);
    $("#memberResultCurrentRole").val(response.member_role);
  }else{
    showErrorMessage("Error. Member not found");
  }
}
