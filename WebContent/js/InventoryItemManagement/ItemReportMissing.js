// variables
let _reportMissingItemID = 0;
let _reportMissingItemName = '';
let _reportMissingItemCurrentQuantity = '';
let _reportMissingItemMissingQuantity = 0;
let _reportMissingItemCategory = '';
let _reportMissingItemReason = '';
let _reportMissingItemPrice =  '';
let _reportMissingOnAdvancedView = false;

// form
const reportMissingForm = document.getElementById('reportMissingForm');

// Clear Input fields in Report Missing Modal
const clearReportMissingModalFields = () => {
	document.getElementById('commentsModal').value = '';
	document.getElementById('inputMissingModal').value = '';
}

// check if new quantity is valid
const validMissingQuanity = (input) => {

  let valid = true;
  if (input <= 0) {
  	valid = false;
  	showErrorMessageOnReportMissingModal('Please Enter a Positive Number')
  }
  if(_reportMissingItemMissingQuantity < 0) {
    console.log('missing bigger than current')
  	valid = false;
  	showErrorMessageOnReportMissingModal('Missing Quantity is Larger than Current Quantity')
  }
  return valid;
};


// function to handle the response data
const handleReportMissingResponse = (response) => {

  // On Search Page and item is deleted by another member
  if (response.deleted && !_reportMissingOnAdvancedView) {
	  showErrorMessageOnReportMissingModal('Item Deleted by Another Member')
	  deleteItem(_reportMissingItemID, _reportMissingItemName);
	  clearReportMissingModalFields()
	  setTimeout(() => {
	  	$('#reportMissingModal').modal('hide');
	  }, 3000)
	  return
  }
  
  // in advanced view and item is deleted by another member
  if (response.deleted && _reportMissingOnAdvancedView) {
	  showErrorMessageOnReportMissingModal('Item Deleted by Another Member');
	  deleteItem(_reportMissingItemID, _reportMissingItemName);
	  deleteItemOnAdvancedView()
	  clearReportMissingModalFields()
	  setTimeout(() => {
	  	$('#reportMissingModal').modal('hide');
	  }, 3000)
	  return
  }
  // On Search Page and the item was updated by another member
  if (response.modifiedByOtherMember && !_reportMissingOnAdvancedView){
  	showErrorMessageOnReportMissingModal('Item Updated by Another member');
  	updateItemQuantity(_reportMissingItemID, response.modifiedQuantity);
  	document.getElementById('itemQuantityMissingModal').innerHTML = response.modifiedQuantity;
  	_reportMissingItemCurrentQuantity = response.modifiedQuantity;
  	clearReportMissingModalFields()
  	return
  }
	
  // in advanced view and the item was updated by another member
  if (response.modifiedByOtherMember && _reportMissingOnAdvancedView){
  	showErrorMessageOnReportMissingModal('Item Updated by Another member');
  	updateItemQuantity(_reportMissingItemID, response.modifiedQuantity);
  	document.getElementById('advancedItemQuantityInput').value = response.modifiedQuantity;
  	document.getElementById('itemQuantityMissingModal').innerHTML = response.modifiedQuantity;
  	_reportMissingItemCurrentQuantity = response.modifiedQuantity;
  	buildAdvancedButtons(response.modifiedQuantity)
  	clearReportMissingModalFields()
  	return
  }

  // On Search Page and the item was successfully reported missing
  if(!response.modifiedByOtherMember && !response.deleted && !_reportMissingOnAdvancedView) {
	  updateItemQuantity(_reportMissingItemID, _reportMissingItemMissingQuantity);
	  showSuccessMessage('Item Successfully Reported Missing');
	  clearReportMissingModalFields()
	  $('#reportMissingModal').modal('hide');
	  return
  }

	// in advanced view and the item was successfully reported missing
  if(!response.modifiedByOtherMember && !response.deleted && _reportMissingOnAdvancedView) {
	  updateItemQuantity(_reportMissingItemID, _reportMissingItemMissingQuantity);
	  console.log(_reportMissingItemMissingQuantity)
	  document.getElementById('advancedItemQuantityInput').value = _reportMissingItemMissingQuantity
	  buildAdvancedButtons(_reportMissingItemMissingQuantity)
	  showSuccessMessage('Item Successfully Reported Missing');
	  clearReportMissingModalFields()
	  $('#reportMissingModal').modal('hide');
	  return
  }
};

// handler for sending and receiving data from backend
const reportMissingItemInDB = () => {
  const servletParameters = {
    "item-id": _reportMissingItemID,
    "item-name": _reportMissingItemName,
    "item-old-quantity": _reportMissingItemCurrentQuantity,
    "item-new-quantity": _reportMissingItemMissingQuantity,
    "item-price": _reportMissingItemPrice, 
    "item-category": _reportMissingItemCategory,
    "comment": _reportMissingItemReason,
    "update_type": "reportmissing",
    "member-id": LOGGED_ON_MEMBER_ID,
  };
  $.ajax({
    url: 'ItemQuantity',
    dataType: 'text',
    type: 'POST',
    data: servletParameters,
    success: function (data) {
      let response = JSON.parse(data);
      console.log('Response');
      console.log(response);
      handleReportMissingResponse(response);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
      showErrorMessageOnReportMissingModal('Unable to Report Item Missing')
    },
  });
};

// form submit event handler
reportMissingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  _reportMissingItemMissingQuantity = +document.getElementById('inputMissingModal').value;
  const input = _reportMissingItemMissingQuantity;
  
  _reportMissingItemReason = document.getElementById('commentsModal').value
  _reportMissingItemMissingQuantity = _reportMissingItemCurrentQuantity - _reportMissingItemMissingQuantity

  if(validMissingQuanity(input)) {
  	reportMissingItemInDB();
  }
});

// function to get data from report missing button
$('#reportMissingModal').on('show.bs.modal', function (e) {
  //get data-id attribute of the clicked element
  _reportMissingItemID = $(e.relatedTarget).data('id');
  _reportMissingItemName = $(e.relatedTarget).data('name');
  const itemModel = $(e.relatedTarget).data('model');
  _reportMissingItemCurrentQuantity = $(e.relatedTarget).data('quantity');
  _reportMissingItemCategory = $(e.relatedTarget).data('category');
  _reportMissingItemPrice = $(e.relatedTarget).data('price');
  _reportMissingOnAdvancedView = $(e.relatedTarget).data('advanced');

  document.getElementById('itemIdMissingModal').innerText = _reportMissingItemID;
  document.getElementById('itemNameMissingModal').innerText = _reportMissingItemName;
  document.getElementById('itemModelMissingModal').innerText = itemModel;
  document.getElementById('itemQuantityMissingModal').innerText = _reportMissingItemCurrentQuantity;
});
