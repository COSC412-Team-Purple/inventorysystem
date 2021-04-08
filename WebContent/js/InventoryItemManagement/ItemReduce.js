// variables
let _reduceItemName = '';
let _reduceItemID = 0;
let _reduceItemModel = '';
let _reduceItemOldQuantity = 0;
let _reduceItemNewQuantity = 0;
let _reduceItemPrice = 0;
let _reduceComment = '';
let _reduceCategory = '';
let _reduceOnAdvancedView = false;

let _reduceRowId = 0;

// form
const reduceForm = document.getElementById('reduceForm');

// functions

const clearReduceModalFields = () => {
	document.getElementById('reasonReduceModal').value = '';
	document.getElementById('inputReduceModal').value = '';
}

// check if new quantity is valid
const validReduceQuanity = () => {
  let valid = true;
  if(_reduceItemNewQuantity <= 0) {
  	valid = false; 
  	showErrorMessageOnReduceModal('Please Enter a Positive Number')
  }
  if(_reduceItemNewQuantity > _reduceItemOldQuantity) {
  	valid = false;
  	showErrorMessageOnReduceModal('Reduce Quantity larger than Current Quantity')
  }
  return valid;
};


// function to handle the response data
const handleReduceQuantityUpdateResponse = (response) => {
  if (response.deleted && !_reduceOnAdvancedView) {
	  showErrorMessageOnIncreaseModal('Item Deleted by Another Member')
	  deleteItem(_reduceRowId, _reduceItemName);
	  clearReduceModalFields()
	  setTimeout(() => {
	  	$('#reduceModal').modal('hide');
	  }, 3000)
  }
  
  if (response.deleted && _reduceOnAdvancedView) {
	  showErrorMessageOnIncreaseModal('Item Deleted by Another Member');
	  deleteItem(_reduceItemID, _reduceItemName);
	  deleteItemOnAdvancedView()
	  clearReduceModalFields()
	  setTimeout(() => {
	  	$('#reduceModal').modal('hide');
	  }, 3000)
  }
  
  if (response.modifiedByOtherMember && !_reduceOnAdvancedView){
  	showErrorMessageOnIncreaseModal('Item Updated by Another member');
  	document.getElementById('itemQuantityIncreaseModal').innerText = response.modifiedQuantity;
  	clearReduceModalFields()
  }
  
  if (response.modifiedByOtherMember && _reduceOnAdvancedView){
  	showErrorMessageOnIncreaseModal('Item Updated by Another member');
  	document.getElementById('advancedItemQuantityInput').value = response.modifiedQuantity;
  	rebuildAdvancedViewButtons(response.modifiedQuantity)
  	clearReduceModalFields()
  }
  
  if(!response.modifiedByOtherMember && !response.deleted && !_reduceOnAdvancedView) {
	  updateItemQuantity(_reduceRowId, _reduceItemNewQuantity);
	  showSuccessMessage('Reduced Item Quantity');
	  clearReduceModalFields()
	  $('#reduceModal').modal('hide');
  }
  
  if(!response.modifiedByOtherMember && !response.deleted && _reduceOnAdvancedView) {
	  updateItemQuantity(_reduceItemID, _reduceItemNewQuantity);
	  document.getElementById('advancedItemQuantityInput').value = _reduceItemNewQuantity;
	  rebuildAdvancedViewButtons(_reduceItemNewQuantity)
	  showSuccessMessage('Successfully Reduced Item Quantity');
	  clearReduceModalFields()
	  $('#reduceModal').modal('hide');
  }
};

// handler for sending and recieving data from backend
const reduceItemInDB = () => {
  const servletParameters = {
    "item-id": _reduceItemID,
    "item-name": _reduceItemName,
    "member-id": LOGGED_ON_MEMBER_ID,
    "item-old-quantity": _reduceItemOldQuantity,
    "item-new-quantity": _reduceItemNewQuantity,
    "item-price": _reduceItemPrice,
    "item-category": _reduceCategory,
    "comment": _reduceComment,
    "update_type": "reduce"
  };
  console.log(servletParameters)
  $.ajax({
    url: 'ItemQuantity',
    dataType: 'text',
    type: 'POST',
    data: servletParameters,
    success: function (data) {
      let response = JSON.parse(data);
      console.log('Response');
      console.log(response);
      handleReduceQuantityUpdateResponse(response);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
      showErrorMessageOnReduceModal('Unable to Reduce Quantity')
    },
  });
};

// form submit event handler
reduceForm.addEventListener('submit', (e) => {
  e.preventDefault();

  _reduceItemNewQuantity = +document.getElementById('inputReduceModal').value;
  _reduceComment = document.getElementById('reasonReduceModal').value;
  
  _reduceItemNewQuantity = _reduceItemOldQuantity - _reduceItemNewQuantity
  console.log(_reduceItemNewQuantity)
  
  if (validReduceQuanity()) {
    reduceItemInDB();
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
  _reduceCategory = $(e.relatedTarget).data('category');
  _reduceItemPrice = $(e.relatedTarget).data(
    'price'
  );
  _reduceOnAdvancedView = $(e.relatedTarget).data('advanced');

  document.getElementById('itemIdReduceModal').innerText = _reduceItemID;
  document.getElementById('itemNameReduceModal').innerText = _reduceItemName;
  document.getElementById('itemModelReduceModal').innerText = _reduceItemModel;
  console.log(document.getElementById('itemQuantityReduceModal'));
  document.getElementById('itemQuantityReduceModal').innerText = _reduceItemOldQuantity;
});
