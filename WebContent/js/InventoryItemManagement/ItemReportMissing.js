// variables
let _reportMissingItemID = 0;
let _reportMissingItemName = '';
let _reportMissingItemCurrentQuantity = 0;
let _reportMissingItemMissingQuantity = 0;

// form
const reportMissingForm = document.getElementById('reportMissingForm');

// function to handle the response data
const handleReportMissingResponse = (response) => {
  console.log(response);
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
    },
  });
};

// form submit event handler
reportMissingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  _reportMissingItemName = document.getElementById('itemNameMissingModal')
    .value;
  _reportMissingItemID = document.getElementById('itemIdMissingModal').value;
  _reportMissingItemCurrentQuantity = document.getElementById(
    'itemQuantityMissingModal'
  ).value;
  _reportMissingItemMissingQuantity = document.getElementById(
    'inputMissingModal'
  ).value;

  reportMissingItemInDB();
  $('#reportMissingModal').modal('hide');
});

// function to get data from report missing button
$('#reportMissingModal').on('show.bs.modal', function (e) {
  //get data-id attribute of the clicked element
  const itemId = $(e.relatedTarget).data('id');
  const itemName = $(e.relatedTarget).data('name');
  const itemModel = $(e.relatedTarget).data('model');
  const itemQuantity = $(e.relatedTarget).data('quantity');

  document.getElementById('itemIdMissingModal').innerText = itemId;
  document.getElementById('itemNameMissingModal').innerText = itemName;
  document.getElementById('itemModelMissingModal').innerText = itemModel;
  document.getElementById('itemQuantityMissingModal').innerText = itemQuantity;
});
