let _registerItemName = '';
let _registerItemPrice = 0;
let _registerItemQuantity = 0;
let _registerItemSpec = '';
let _registerItemLocation = '';
let _registerItemDepartment = '';
let _registerItemCategory = '';
let _registerItemDate = '';
let _registerItemBrand = '';
let _registerItemDescription = '';
const registerItemform = document.getElementById('registerItemForm');


// function to check if all fields are filled out
const allFieldsFilledCheck = () => {
  let valid = true;

  if (
    !_registerItemName ||
    !_registerItemPrice ||
    !_registerItemQuantity ||
    !_registerItemSpec ||
    !_registerItemLocation ||
    !_registerItemDepartment ||
    !_registerItemCategory ||
    !_registerItemDate ||
    !_registerItemBrand ||
    !_registerItemDescription
  ) {
    valid = false;
    showErrorMessage('All Fields Must Be Filled');
    console.log('a field is not filled out');
  }
  return valid;
};

const checkRegisterPermission = () => {
	const permission = hasPermission('register_item');
	return permission
}


// function used to check to see if the new items location, category, and department already exists
const checkLocationCategoryDepartmentExist = () => {

	if(!DEPARTMENTS.includes(_registerItemDepartment)) {
		DEPARTMENTS.push(_registerItemDepartment)
	}
	
	if (!CATEGORIES.includes(_registerItemCategory)) {
		CATEGORIES.push(_registerItemCategory)
	}
	
	if (!LOCATIONS.includes(_registerItemLocation)) {
		LOCATIONS.push(_registerItemLocation)
	}
}

// function used to clear all the fields in the register item form
const clearFields = () => {
	document.getElementById('registerItemNameInput').value = '';
    document.getElementById('registerItemPriceInput').value = '';
    document.getElementById('registerItemQuantityInput').value = '';
  	document.getElementById('registerItemModelInput').value = '';
  	document.getElementById('registerItemLocationInput').value = '';
  	document.getElementById('registerItemDeptInput').value = '';
  	document.getElementById('registerItemCategoryInput').value = '';
  	document.getElementById('registerItemPurchaseDateInput').value = '';
  	document.getElementById('registerItemBrandInput').value = '';
  	document.getElementById('registerItemMemoInput').value = '';
}

// handler to handle the response from backend
const handleRegisterItemResponse = (response) => {
  console.log('new item registered');
  showSuccessMessage('New Item Successfully Registered')
  checkLocationCategoryDepartmentExist();
  clearFields();
};

// handler to send the registered items data back to the back end
const registerItemInDB = () => {
  const servletParameters = {
    'item_name': _registerItemName,
    'item_price': _registerItemPrice,
    'item_quant': _registerItemQuantity,
    'item_spec': _registerItemSpec,
    'item_loc': _registerItemLocation,
    'dept_name': _registerItemDepartment,
    'category': _registerItemCategory,
    'purchase_date': _registerItemDate,
    'item_brand': _registerItemBrand,
    'item_memo': _registerItemDescription,
  };
  console.log(servletParameters);
  $.ajax({
    url: 'ItemRegistrationServlet',
    dataType: 'text',
    type: 'POST',
    data: servletParameters,
    success: function (data) {
      let response = JSON.parse(data);
      console.log('Response');
      console.log(response);
      handleRegisterItemResponse(response);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
      showErrorMessage('Unsuccessful Item Registration');
    },
  });
};

// register item form submit listener
registerItemform.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if(!checkRegisterPermission()) {
  	showErrorMessage('You Do Not Have Permission!')
  	return
  }
  
  _registerItemName = document.getElementById('registerItemNameInput').value;
  _registerItemPrice = document.getElementById('registerItemPriceInput').value;
  _registerItemQuantity = document.getElementById('registerItemQuantityInput')
    .value;
  _registerItemSpec = document.getElementById('registerItemModelInput').value;
  _registerItemLocation = document.getElementById('registerItemLocationInput')
    .value;
  _registerItemDepartment = document.getElementById('registerItemDeptInput')
    .value;
  _registerItemCategory = document.getElementById('registerItemCategoryInput')
    .value;
  _registerItemDate = document.getElementById('registerItemPurchaseDateInput')
    .value;
  _registerItemBrand = document.getElementById('registerItemBrandInput').value;
  _registerItemDescription = document.getElementById('registerItemMemoInput')
    .value;

  if (allFieldsFilledCheck()) {
    registerItemInDB();
  }
});

