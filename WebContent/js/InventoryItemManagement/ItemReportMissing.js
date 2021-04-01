// variables
let _itemID = 0;
let _itemName = '';
let _itemCurrentQuantity = 0;
let _itemMissingQuantity = 0;
let _memberId = 0;

// form
const form = document.getElementById('reportMissingForm');

// function to handle the response data
const handleReportMissingResponse = (response) => {
  console.log(response);
};

// handler for sending and receiving data from backend
const reportMissingItemInDB = () => {
  const servletParameters = {
    'item-id': _itemID,
    'item-name': _itemName,
    'item-current-quantity': _itemCurrentQuantity,
    'item-missing-quantity': _itemMissingQuantity,
    'member-id': _memberId,
  };
  $.ajax({
    url: 'ItemDispose',
    dataType: 'text',
    type: 'PUT',
    data: servletParameters,
    success: function (data) {
      let response = JSON.parse(data);
      console.log('Response');
      console.log(response);
      handleReportMissingResponse(response);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
    },
  });
};

// form submit event handler
form.addEventListener('submit', (e) => {
  e.preventDefault();

  _itemName = document.getElementById('itemNameModal').value;
  _itemID = document.getElementById('itemIdModal').value;
  _itemCurrentQuantity = document.getElementById('itemQuantityModal').value;
  _itemMissingQuantity = document.getElementById('inputMissingModal').value;
  _memberId = 0;

  reportMissingItemInDB();
});
