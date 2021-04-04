let _searchMemberButton = $("#searchMemberButton");
let _searchMemberIdInput = $("#searchMemberIdInput");
let _searchMemberFnameInput = $("#searchMemberFnameInput");
let _searchMemberLnameInput = $("#searchMemberLnameInput");


_searchMemberButton.click(function(){
  if(hasPermission("search_member") && validMemberSearch()){
    searchMemberInDB()
  }
});

function validMemberSearch(){
  let valid = false;
  let id = Number(_searchMemberIdInput.val());
  console.log(Math.floor(id));
  console.log(id);
  if(Math.floor(id) === id){
    valid = true;
  }else if(id === ""){
    valid = false;
  }else{
    showErrorMessage("Id has to be an integer value");
    return false;
  }

  let fname = _searchMemberFnameInput.val().trim();
  let lname = _searchMemberLnameInput.val().trim();
  if(lname !== "" && fname !== ""){
    valid = true;
  }
  if(!valid){
    showErrorMessage("Error. Either member id needs a value or both first name and last name needs a value.");
  }
  return valid;
}

function searchMemberInDB(){
    let memberId = _searchMemberIdInput.val();
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
  if(response.member_id > 0){
    $("#memberResultName").val(response.member_fname + " " + response.member_lname);
    $("#memberResultId").val(response.member_id);
    $("#memberResultStartDate").val(response.member_start_date);
    if(response.member_end_date !== null){
      $("#memberResultEndDate").val(response.member_end_date);
    }else{
      $("#memberResultEndDate").val("Present");
    }

    $("#memberResultDepartment").val(response.member_dept);
    $("#memberResultCurrentRole").val(response.member_role);
  }
}
