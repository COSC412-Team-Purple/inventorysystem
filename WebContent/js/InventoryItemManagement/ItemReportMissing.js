// variables
let _reportMissingItemID = 0;
let _reportMissingItemName = '';
let _reportMissingItemCurrentQuantity = '';
let _reportMissingItemMissingQuantity = 0;
let _reportMissingItemCategory = '';
let _reportMissingItemComment = '';
let _reportMissingOnAdvancedView = false;

// form
const reportMissingForm = document.getElementById('reportMissingForm');

const clearReportMissingModalFields = () => {
	document.getElementById('commentsModal').value = '';
	document.getElementById('inputMissingModal').value = '';
}

// check if new quantity is valid
const validMissingQuanity = () => {
	
  let valid = true;
  if(_reportMissingItemMissingQuantity <= 0) {
  console.log('input equals a 0')
  	valid = false;
  	showErrorMessageOnReportMissingModal('Please Enter a Positive Number')
  }
  if(_reportMissingItemMissingQuantity > _reportMissingItemCurrentQuantity) {
  console.log('missing bigger than current')
  	valid = false;
  	showErrorMessageOnReportMissingModal('Missing Quantity is Larger than Current Quantity')
  }
      
  return valid;
  
};


// function to handle the response data
const handleReportMissingResponse = (response) => {
  if (response.deleted && !_reportMissingOnAdvancedView) {
	  showErrorMessageOnIncreaseModal('Item Deleted by Another Member')
	  deleteItem(_reportMissingItemID, _reportMissingItemName);
	  clearReportMissingModalFields()
	  setTimeout(() => {
	  	$('#reportMissingModal').modal('hide');
	  }, 3000)
  }
  
  if (response.deleted && _reportMissingOnAdvancedView) {
	  showErrorMessageOnIncreaseModal('Item Deleted by Another Member');
	  deleteItem(_reportMissingItemID, _reportMissingItemName);
	  deleteItemOnAdvancedView()
	  clearReportMissingModalFields()
	  setTimeout(() => {
	  	$('#reportMissingModal').modal('hide');
	  }, 3000)
  }
  
  if (response.modifiedByOtherMember && !_reportMissingOnAdvancedView){
  	showErrorMessageOnIncreaseModal('Item Updated by Another member');
  	document.getElementById('itemQuantityMissingModal').innerText = response.modifiedQuantity;
  	clearReportMissingModalFields()
  }
  
  if (response.modifiedByOtherMember && _reportMissingOnAdvancedView){
  	showErrorMessageOnIncreaseModal('Item Updated by Another member');
  	document.getElementById('advancedItemQuantityInput').value = response.modifiedQuantity;
  	clearReportMissingModalFields()
  }
  
  if(!response.modifiedByOtherMember && !response.deleted && !_reportMissingOnAdvancedView) {
	  updateItemQuantity(_reportMissingItemID, -1 * _reportMissingItemMissingQuantity);
	  showSuccessMessage('Item Successfully Reported Missing');
	  clearReportMissingModalFields()
	  $('#reportMissingModal').modal('hide');
  }
  
  if(!response.modifiedByOtherMember && !response.deleted && _reportMissingOnAdvancedView) {
	  updateItemQuantity(_reportMissingItemID, -1 * _reportMissingItemMissingQuantity);
	  document.getElementById('advancedItemQuantityInput').value = _increaseItemOldQuantity + _increaseItemNewQuantity;
	  showSuccessMessage('Item Successfully Reported Missing');
	  clearReportMissingModalFields()
	  $('#reportMissingModal').modal('hide');
  }
};

// handler for sending and receiving data from backend
const reportMissingItemInDB = () => {
  const servletParameters = {
    "item-id": _reportMissingItemID,
    "item-name": _reportMissingItemName,
    "item-current-quantity": _reportMissingItemCurrentQuantity,
    "item-missing-quantity": _reportMissingItemMissingQuantity,
    "member-id": LOGGED_ON_MEMBER_ID,
    "item-category": _reportMissingItemCategory,
    "update_type": "reportmissing",
    "comment": _reportMissingItemComment,
  };
  $.ajax({
    url: 'ReportItemMissing',
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

  _reportMissingItemMissingQuantity = +document.getElementById(
    'inputMissingModal'
  ).value;
  _reportMissingItemComment = document.getElementById('commentsModal').value
  _reportMissingItemMissingQuantity = _reportMissingItemCurrentQuantity - _reportMissingItemMissingQuantity
  
  if(validMissingQuanity()) {
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

  document.getElementById('itemIdMissingModal').innerText = _reportMissingItemID;
  document.getElementById('itemNameMissingModal').innerText = _reportMissingItemName;
  document.getElementById('itemModelMissingModal').innerText = itemModel;
  document.getElementById('itemQuantityMissingModal').innerText = _reportMissingItemCurrentQuantity;
});
