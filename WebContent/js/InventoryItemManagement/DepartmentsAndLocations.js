function getDepartmentsAndLocationsFromDB(){
    $.ajax({
        url: 'DepartmentsAndLocations',
        dataType: 'text',
        type: 'GET',
        data: "",
        success: function( data ){
            data = JSON.parse(data);
            handleDepartmentsAndLocationsResponse(data);
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
}

function handleDepartmentsAndLocationsResponse(data){
  DEPARTMENTS = data.departments;
  LOCATIONS = data.locations;

  DEPARTMENTS.forEach((dept) =>{
    let selectOptionHtml = '<option value="'+ dept +'">'+ dept +'</option>';
    let datalistOptionHtml = '<option value="'+ dept +'" />';
    $("#itemManagingDepartment").append(selectOptionHtml);
    $("#registerItemDeptOptions").append(datalistOptionHtml);
  })

  LOCATIONS.forEach((loc) =>{
    let datalistOptionHtml = '<option value="'+ loc +'" />';
    $("#registerItemLocationOptions").append(datalistOptionHtml);
  })
}
