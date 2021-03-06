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


// function to clear the fields of the reduce modal
const clearReduceModalFields = () => {
	document.getElementById('reasonReduceModal').value = '';
	document.getElementById('inputReduceModal').value = '';
}

// check if new quantity is valid
const validReduceQuanity = (input) => {
  let valid = true;
  if(input <= 0) {
    console.log('input equals 0')
  	valid = false; 
  	showErrorMessageOnReduceModal('Please Enter a Positive Number')
  }
  if(_reduceItemNewQuantity < 0) {
  console.log('reduce larger than current')
  	valid = false;
  	showErrorMessageOnReduceModal('Reduce Quantity larger than Current Quantity')
  }
  return valid;
};


// function to handle the response data
const handleReduceQuantityUpdateResponse = (response) => {

  // On Search Page and item is deleted by another member
  if (response.deleted && !_reduceOnAdvancedView) {
	  showErrorMessageOnReduceModal('Item Deleted by Another Member')
	  deleteItem(_reduceRowId, _reduceItemName);
	  clearReduceModalFields()
	  setTimeout(() => {
	  	$('#reduceModal').modal('hide');
	  }, 3000)
	  return
  }
  
  // On advanced view and item is deleted by another member
  if (response.deleted && _reduceOnAdvancedView) {
	  showErrorMessageOnReduceModal('Item Deleted by Another Member');
	  deleteItem(_reduceItemID, _reduceItemName);
	  deleteItemOnAdvancedView()
	  clearReduceModalFields()
	  setTimeout(() => {
	  	$('#reduceModal').modal('hide');
	  }, 3000)
	  return
  }
  
  // On Search Page and the item was updated by another member
  if (response.modifiedByOtherMember && !_reduceOnAdvancedView){
  	showErrorMessageOnReduceModal('Item Updated by Another member');
  	updateItemQuantity(_reduceRowId, response.modifiedQuantity);
  	document.getElementById('itemQuantityReduceModal').innerHTML = response.modifiedQuantity;
  	_reduceItemOldQuantity = response.modifiedQuantity;
  	clearReduceModalFields()
  	return
  }
   
  // in advanced view and the item was updated by another member
  if (response.modifiedByOtherMember && _reduceOnAdvancedView){
  	showErrorMessageOnReduceModal('Item Updated by Another member');
  	updateItemQuantity(_reduceItemID, response.modifiedQuantity);
  	advancedUpdateQuantity(response.modifiedQuantity)
  	//document.getElementById('advancedItemQuantityInput').value = response.modifiedQuantity;
  	document.getElementById('itemQuantityReduceModal').innerHTML = response.modifiedQuantity;
  	_reduceItemOldQuantity = response.modifiedQuantity;
  	buildAdvancedButtons(response.modifiedQuantity)
  	clearReduceModalFields()
  	return
  }
  
  // On Search Page and the item was successfully reduced
  if(!response.modifiedByOtherMember && !response.deleted && !_reduceOnAdvancedView) {
	  updateItemQuantity(_reduceRowId, _reduceItemNewQuantity);
	  showSuccessMessage('Reduced Item Quantity');
	  clearReduceModalFields()
	  $('#reduceModal').modal('hide');
	  return
  }
  
  // in advanced view and the item was successfully reduced
  if(!response.modifiedByOtherMember && !response.deleted && _reduceOnAdvancedView) {
	  updateItemQuantity(_reduceItemID, _reduceItemNewQuantity);
	  advancedUpdateQuantity(_reduceItemNewQuantity)
	  //document.getElementById('advancedItemQuantityInput').value = _reduceItemNewQuantity;
	  buildAdvancedButtons(_reduceItemNewQuantity)
	  showSuccessMessage('Successfully Reduced Item Quantity');
	  clearReduceModalFields()
	  $('#reduceModal').modal('hide');
	  return
  }
};

// function that sends the items data to the backend
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
  const input = _reduceItemNewQuantity;
  
  _reduceComment = document.getElementById('reasonReduceModal').value;
  _reduceItemNewQuantity = _reduceItemOldQuantity - _reduceItemNewQuantity
  console.log(input)
  
  if (validReduceQuanity(input)) {
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
