// variables
let _reportMissingItemID = 0;
let _reportMissingItemName = '';
let _reportMissingItemCurrentQuantity = '';
let _reportMissingItemMissingQuantity = 0;

// form
const reportMissingForm = document.getElementById('reportMissingForm');

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
  console.log(response);
  showSuccessMessage('Item Successfully Reported Missing')
   $('#reportMissingModal').modal('hide');
};

// handler for sending and receiving data from backend
const reportMissingItemInDB = () => {
  const servletParameters = {
    'item-id': _reportMissingItemID,
    'item-name': _reportMissingItemName,
    'item-current-quantity': _reportMissingItemCurrentQuantity,
    'item-missing-quantity': _reportMissingItemMissingQuantity,
    'member-id': LOGGED_ON_MEMBER_ID,
  };
  $.ajax({
    url: 'ReportItemMissing',
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

  document.getElementById('itemIdMissingModal').innerText = _reportMissingItemID;
  document.getElementById('itemNameMissingModal').innerText = _reportMissingItemName;
  document.getElementById('itemModelMissingModal').innerText = itemModel;
  document.getElementById('itemQuantityMissingModal').innerText = _reportMissingItemCurrentQuantity;
});
