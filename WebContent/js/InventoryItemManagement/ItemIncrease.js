let _increaseItemName = '';
let _increaseItemID = 0;
let _increaseItemOldQuantity = 0;
let _increaseItemNewQuantity = 0;
let _increaseItemPrice = 0;
let _increaseReason = '';
let _increaseCategory = '';
let _increaseOnAdvancedView = false;

let _increaseRowId = 0;

// form
const increaseForm = document.getElementById('increaseForm');


// function to clear the inputs fields of the increase modal
const clearIncreaseModalFields = () => {
	document.getElementById('reasonIncreaseModal').value = '';
	document.getElementById('inputIncreaseModal').value = '';
}

// function to check if the input value is valid
const validIncreaseQuanity = (input) => {
  let valid = true;
  if (input <= 0) {
  	console.log('failed')
  	valid = false;
  	showErrorMessageOnIncreaseModal('Please Enter a Positive Number')
  }
  return valid;
};


// function to handle the servlet response
const handleIncreaseQuantityUpdateResponse = (response) => {

  // On Search Page and the item was deleted by another member
  if (response.deleted && !_increaseOnAdvancedView) {
	  showErrorMessageOnIncreaseModal('Item Deleted by Another Member')
	  deleteItem(_increaseRowId, _increaseItemName);
	  clearIncreaseModalFields()
	  setTimeout(() => {
	  	$('#increaseModal').modal('hide');
	  }, 3000)
	  return
  }
  
  // in advanced view and the item was deleted by another member
  if (response.deleted && _increaseOnAdvancedView) {
	  showErrorMessageOnIncreaseModal('Item Deleted by Another Member');
	  deleteItem(_increaseItemID, _increaseItemName);
	  deleteItemOnAdvancedView()
	  clearIncreaseModalFields()
	  setTimeout(() => {
	  	$('#increaseModal').modal('hide');
	  }, 3000)
	  return
  }

  // On Search Page and the item was updated by another member
  if (response.modifiedByOtherMember && !_increaseOnAdvancedView){
  	showErrorMessageOnIncreaseModal('Item Updated by Another member');
  	updateItemQuantity(_increaseRowId, response.modifiedQuantity);
  	document.getElementById('itemQuantityIncreaseModal').innerHTML = response.modifiedQuantity;
  	_increaseItemOldQuantity = response.modifiedQuantity;
  	clearIncreaseModalFields()
  	return
  }
  
  // in advanced view and the item was updated by another member
  if (response.modifiedByOtherMember && _increaseOnAdvancedView){
  	showErrorMessageOnIncreaseModal('Item Updated by Another member');
  	updateItemQuantity(_increaseItemID, response.modifiedQuantity);
  	document.getElementById('advancedItemQuantityInput').value = response.modifiedQuantity;
  	document.getElementById('itemQuantityIncreaseModal').innerHTML = response.modifiedQuantity;
	_increaseItemOldQuantity = response.modifiedQuantity;
  	buildAdvancedButtons(response.modifiedQuantity)
  	clearIncreaseModalFields()
  	return
  }
  
  // On Search Page and the item was successfully increased
  if(!response.modifiedByOtherMember && !response.deleted && !_increaseOnAdvancedView) {
	  updateItemQuantity(_increaseRowId, _increaseItemNewQuantity);
	  showSuccessMessage('Increased Item Quantity');
	  clearIncreaseModalFields()
	  $('#increaseModal').modal('hide');
	  return
  }

  // in advanced view and the item was successfully increased
  if(!response.modifiedByOtherMember && !response.deleted && _increaseOnAdvancedView) {
	  updateItemQuantity(_increaseItemID, _increaseItemNewQuantity);
	  buildAdvancedButtons(_increaseItemNewQuantity)
	  document.getElementById('advancedItemQuantityInput').value = _increaseItemNewQuantity;
	  showSuccessMessage('Successfully Increased Item Quantity');
	  clearIncreaseModalFields()
	  $('#increaseModal').modal('hide');
	  return
  }
};

// handler for sending the increase item data to the back end
const increaseItemInDB = () => {
  const servletParameters = {
    "item-id": _increaseItemID,
    "item-name": _increaseItemName,
    "member-id": LOGGED_ON_MEMBER_ID,
    "item-old-quantity": _increaseItemOldQuantity,
    "item-new-quantity": _increaseItemNewQuantity,
    "item-price": _increaseItemPrice,
    "comment": _increaseReason,
    "item-category": _increaseCategory,
    "update_type": "increase",
  };
	console.log(servletParameters);
  $.ajax({
    url: 'ItemQuantity',
    dataType: 'text',
    type: 'POST',
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

  _increaseItemNewQuantity = +document.getElementById('inputIncreaseModal').value;
  const input = _increaseItemNewQuantity
  console.log(input)
  _increaseReason = document.getElementById('reasonIncreaseModal').value;
  _increaseItemNewQuantity = _increaseItemNewQuantity + _increaseItemOldQuantity

  if (validIncreaseQuanity(input)) {
    increaseItemInDB();
  }
});

// function to get data from increase button
$('#increaseModal').on('show.bs.modal', function (e) {
  //get data-id attribute of the clicked element
  _increaseItemID = $(e.relatedTarget).data('id');
  _increaseItemName = $(e.relatedTarget).data('name');
  const itemModel = $(e.relatedTarget).data('model');
  _increaseItemOldQuantity = +$(e.relatedTarget).data('quantity');
  _increaseRowId = $(e.relatedTarget.parentElement.parentElement).data(
    'rowNumber'
  );
  _increaseItemPrice = $(e.relatedTarget).data('price');
  _increaseCategory = $(e.relatedTarget).data('category');
  _increaseOnAdvancedView = $(e.relatedTarget).data('advanced');

  document.getElementById('itemIdIncreaseModal').innerText = _increaseItemID;
  document.getElementById(
    'itemNameIncreaseModal'
  ).innerText = _increaseItemName;
  document.getElementById('itemModelIncreaseModal').innerText = itemModel;
  document.getElementById(
    'itemQuantityIncreaseModal'
  ).innerText = _increaseItemOldQuantity;
});
