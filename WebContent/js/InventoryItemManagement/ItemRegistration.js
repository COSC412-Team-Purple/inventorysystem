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

const form = document.getElementById('registerItemForm');

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
    console.log('field is not filled out');
  }
  return valid;
};

// handler to handle the response from backend
const handleRegisterItemResponse = (response) => {
  console.log('new item registered');
  console.log(response);
};

// handler for search item
const registerItemInDB = () => {
  const servletParameters = {
    'item_name': _registerItemName,
    'item_price': _registerItemPrice,
    'item_quantity': _registerItemQuantity,
    'item_spec': _registerItemSpec,
    'item_location': _registerItemLocation,
    'item_department': _registerItemDepartment,
    'item_category': _registerItemCategory,
    'item_date': _registerItemDate,
    'item_brand': _registerItemBrand,
    'item_description': _registerItemDescription,
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
    },
  });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
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
    //handleRegisterItemResponse();
    showSuccessMessage('successful item registration');

  } else {
    showErrorMessage('Unsuccessful Item Registration');
  }
});
