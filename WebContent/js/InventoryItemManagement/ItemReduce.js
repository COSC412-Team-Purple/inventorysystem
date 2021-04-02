// variables
let _reduceItemName = '';
let _reduceItemID = 0;
let _reduceItemModel = '';
let _reduceItemOldQuantity = '';
let _reduceItemNewQuantity = 0;
let _reduceItemPrice = 0;
let _reduceComment = '';

let _reduceRowId = 0;

// form
const reduceForm = document.getElementById('reduceForm');

// functions

// check if new quantity is valid
const validReduceQuanity = () => {
  let valid = true;
  valid =
    _reduceItemNewQuantity === '' ||
    _reduceItemNewQuantity <= 0 ||
    _reduceItemNewQuantity > _reduceItemOldQuantity
      ? false
      : true;
  return valid;
};

// error function
const showReduceError = () => {
  console.log('No new quanity was inserted');
};

// function to handle the response data
const handleReduceQuantityUpdateResponse = (response) => {
  console.log(response);
};

// handler for sending and recieving data from backend
const reduceItemInDB = () => {
  const servletParameters = {
    'item-id': _reduceItemID,
    'item-name': _reduceItemName,
    'member-id': LOGGED_ON_MEMBER_ID,
    'item-old-quanity': _reduceItemOldQuantity,
    'item-new-quanity': _reduceItemNewQuantity,
    'item-price': _reduceItemPrice,
    comment: _reduceComment,
  };
  $.ajax({
    url: 'ItemQuantity',
    dataType: 'text',
    type: 'PUT',
    data: servletParameters,
    success: function (data) {
      let response = JSON.parse(data);
      console.log('Response');
      console.log(response);
      handleReduceQuantityUpdateResponse(response);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
    },
  });
};

// form submit event handler
reduceForm.addEventListener('submit', (e) => {
  e.preventDefault();

  _reduceItemNewQuantity = document.getElementById('inputReduceModal').value;
  _reduceComment = document.getElementById('reasonReduceModal').value;
  if (validReduceQuanity()) {
    reduceItemInDB();

    updateItemQuantity(_reduceRowId, -1 * _reduceItemNewQuantity);
    $('#reduceModal').modal('hide');
  } else {
    showReduceError();
  }
});

// function used to get data from reduce button
$('#reduceModal').on('show.bs.modal', function (e) {
  //get data-id attribute of the clicked element
  _reduceItemID = $(e.relatedTarget).data('id');
  _reduceItemName = $(e.relatedTarget).data('name');
  _reduceItemModel = $(e.relatedTarget).data('model');
  _reduceItemOldQuantity = $(e.relatedTarget).data('quantity');
  _reduceRowId = $(e.relatedTarget.parentElement.parentElement).data(
    'rowNumber'
  );
  _reduceItemPrice = $(e.relatedTarget.parentElement.parentElement).data(
    'price'
  );

  document.getElementById('itemIdReduceModal').innerText = _reduceItemID;
  document.getElementById('itemNameReduceModal').innerText = _reduceItemName;
  document.getElementById('itemModelReduceModal').innerText = _reduceItemModel;
  document.getElementById(
    'itemQuantityReduceModal'
  ).innerText = _reduceItemOldQuantity;
});
