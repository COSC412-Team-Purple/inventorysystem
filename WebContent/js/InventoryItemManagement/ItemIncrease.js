let _increaseItemName = '';
let _increaseItemID = 0;
let _increaseItemOldQuantity = '';
let _increaseItemNewQuantity = 0;
let _increaseItemPrice = 0;
let _increaseComment = '';

let _increaseRowId = 0;

// form
const increaseForm = document.getElementById('increaseForm');

// functions
const validIncreaseQuanity = () => {
  console.log(+_increaseItemNewQuantity)
  let valid = true;
  if(_increaseItemNewQuantity <= 0) {
  	valid = false;
  	showErrorMessageOnIncreaseModal('Please Enter a Positive Number')
  }
      
  return valid;
};

const showIncreaseError = () => {
  console.log('No new quanity was inserted');
};

const handleIncreaseQuantityUpdateResponse = (response) => {
  updateItemQuantity(_increaseRowId, _increaseItemNewQuantity);
  showSuccessMessage('Increased Item Quantity');
  $('#increaseModal').modal('hide');
  console.log(response);
};

// handler for search item
const increaseItemInDB = () => {
  const servletParameters = {
    'item-id': _increaseItemID,
    'item-name': _increaseItemName,
    'member-id': LOGGED_ON_MEMBER_ID,
    'item-old-quanity': _increaseItemOldQuantity,
    'item-new-quanity': _increaseItemNewQuantity,
    'item-price': _increaseItemPrice,
    comment: _increaseComment,
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
      handleIncreaseQuantityUpdateResponse(response);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
      showErrorMessageOnIncreaseModal('Unable to Increase Quantity')
    },
  });
};

// form submit event handler
increaseForm.addEventListener('submit', (e) => {
  e.preventDefault();

  _increaseItemNewQuantity = +document.getElementById('inputIncreaseModal')
    .value;
  _increaseComment = document.getElementById('reasonIncreaseModal').value;
  

  if (validIncreaseQuanity()) {
    increaseItemInDB();
    
    console.log('increased quantity');
    
  } else {
    showIncreaseError();
  }
});

// function to get data from increase button
$('#increaseModal').on('show.bs.modal', function (e) {
  //get data-id attribute of the clicked element
  _increaseItemID = $(e.relatedTarget).data('id');
  _increaseItemName = $(e.relatedTarget).data('name');
  const itemModel = $(e.relatedTarget).data('model');
  _increaseItemOldQuantity = $(e.relatedTarget).data('quantity');
  _increaseRowId = $(e.relatedTarget.parentElement.parentElement).data(
    'rowNumber'
  );
  _increaseItemPrice = $(e.relatedTarget.parentElement.parentElement).data(
    'price'
  );

  document.getElementById('itemIdIncreaseModal').innerText = _increaseItemID;
  document.getElementById(
    'itemNameIncreaseModal'
  ).innerText = _increaseItemName;
  document.getElementById('itemModelIncreaseModal').innerText = itemModel;
  document.getElementById(
    'itemQuantityIncreaseModal'
  ).innerText = _increaseItemOldQuantity;
});
