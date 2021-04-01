// variables
let _itemID = 0;
let _itemName = '';
let _itemQuantity = 0;
let _itemPrice = 0;
let _itemDepartment = '';
let _itemCategory = '';
let _itemModel = '';
let _itemLocation = '';
let _memberId = 0;

// form
const form = document.getElementById('disposeForm');

// function to handle the response data
const handleDisposeResponse = (response) => {
  console.log(response);
};

// handler for sending and recieving data from backend
const disposeItemInDB = () => {
  const servletParameters = {
    'item-id': _itemID,
    'item-name': _itemName,
    'item-quantity': _itemQuantity,
    'item-price': _itemPrice,
    'item-department': _itemDepartment,
    'item-category': _itemDepartment,
    'item-model': _itemDepartment,
    'item-location': _itemDepartment,
    'member-id': _memberId,
  };
  $.ajax({
    url: 'ItemDispose',
    dataType: 'text',
    type: 'DELETE',
    data: servletParameters,
    success: function (data) {
      let response = JSON.parse(data);
      console.log('Response');
      console.log(response);
      handleDisposeResponse(response);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
    },
  });
};

// form submit event handler
form.addEventListener('submit', (e) => {
  e.preventDefault();

  _itemName = document.getElementById('itemNameDisposeModal').value;
  _itemID = document.getElementById('itemIdDisposeModal').value;
  _itemQuantity = document.getElementById('itemQuantityDisposeModal').value;
  _itemPrice = document.getElementById('itemIdDisposeModal').value;
  _itemDepartment = document.getElementById('itemDepartmentDisposeModal').value;
  _itemCategory = document.getElementById('itemCategoryDisposeModal').value;
  _itemModel = document.getElementById('itemModelDisposeModal').value;
  _itemLocation = document.getElementById('itemLocationDisposeModal').value;
  _memberId = 0;

  disposeItemInDB();
});
