let _increaseItemName = '';
let _increaseItemID = 0;
let _increaseItemOldQuantity = '';
let _increaseItemNewQuantity = 0;
let _increaseItemPrice = 0;
let _increaseComment = '';
let _increaseCategory = '';
let _increaseOnAdvancedView = false;

let _increaseRowId = 0;

const clearIncreaseModalFields = () => {
	document.getElementById('reasonIncreaseModal').value = '';
	document.getElementById('inputIncreaseModal').value = '';
}

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



const handleIncreaseQuantityUpdateResponse = (response) => {
  if (response.deleted && !_increaseOnAdvancedView) {
	  showErrorMessageOnIncreaseModal('Item Deleted by Another Member')
	  deleteItem(_increaseRowId, _increaseItemName);
	  clearIncreaseModalFields()
	  setTimeout(() => {
	  	$('#increaseModal').modal('hide');
	  }, 3000)
  }

  if (response.deleted && _increaseOnAdvancedView) {
	  showErrorMessageOnIncreaseModal('Item Deleted by Another Member');
	  deleteItem(_increaseItemID, _increaseItemName);
	  deleteItemOnAdvancedView()
	  clearIncreaseModalFields()
	  setTimeout(() => {
	  	$('#increaseModal').modal('hide');
	  }, 3000)
  }

  if (response.modifiedByOtherMember && !_increaseOnAdvancedView){
  	showErrorMessageOnIncreaseModal('Item Updated by Another member');
  	document.getElementById('itemQuantityIncreaseModal').innerText = response.modifiedQuantity;
  	clearIncreaseModalFields()
  }

  if (response.modifiedByOtherMember && _increaseOnAdvancedView){
  	showErrorMessageOnIncreaseModal('Item Updated by Another member');
  	document.getElementById('advancedItemQuantityInput').value = response.modifiedQuantity;
  	clearIncreaseModalFields()
  }

  if(!response.modifiedByOtherMember && !response.deleted && !_increaseOnAdvancedView) {
	  updateItemQuantity(_increaseRowId, _increaseItemNewQuantity);
	  showSuccessMessage('Increased Item Quantity');
	  clearIncreaseModalFields()
	  $('#increaseModal').modal('hide');

  }

  if(!response.modifiedByOtherMember && !response.deleted && _increaseOnAdvancedView) {
	  updateItemQuantity(_increaseItemID, _increaseItemNewQuantity);
	  document.getElementById('advancedItemQuantityInput').value = _increaseItemOldQuantity + _increaseItemNewQuantity;
	  showSuccessMessage('Successfully Increased Item Quantity');
	  clearIncreaseModalFields()
	  $('#increaseModal').modal('hide');
  }
};

// handler for search item
const increaseItemInDB = () => {
  const servletParameters = {
    "item-id": _increaseItemID,
    "item-name": _increaseItemName,
    "member-id": LOGGED_ON_MEMBER_ID,
    "item-old-quantity": _increaseItemOldQuantity,
    "item-new-quantity": _increaseItemNewQuantity,
    "item-price": _increaseItemPrice,
    "comment": _increaseComment,
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

  _increaseItemNewQuantity = +document.getElementById('inputIncreaseModal')
    .value;
  _increaseComment = document.getElementById('reasonIncreaseModal').value;


  if (validIncreaseQuanity()) {
    increaseItemInDB();
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
  _increaseItemPrice = $(e.relatedTarget).data('price');
  _increaseCategory = $(e.relatedTarget).data('category');
  _increaseOnAdvancedView = $(e.relatedTarget).data('advanced');
  console.log(_increaseOnAdvancedView)

  document.getElementById('itemIdIncreaseModal').innerText = _increaseItemID;
  document.getElementById(
    'itemNameIncreaseModal'
  ).innerText = _increaseItemName;
  document.getElementById('itemModelIncreaseModal').innerText = itemModel;
  document.getElementById(
    'itemQuantityIncreaseModal'
  ).innerText = _increaseItemOldQuantity;
});
