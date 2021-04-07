// variables
let _disposeItemID = 0;
let _disposeItemName = '';
let _disposeItemQuantity = 0;
let _disposeItemPrice = 0;
let _disposeItemDepartment = '';
let _disposeItemCategory = '';
let _disposeItemModel = '';
let _disposeItemLocation = '';
let _disposeOnAdvancedView = false;

let _disposeRowId = 0;

// form
const disposeForm = document.getElementById('disposeForm');

// function to handle the response data
const handleDisposeResponse = (response) => {
  if (response.deleted && !_disposeOnAdvancedView) {
	  showErrorMessageOnIncreaseModal('Item Deleted by Another Member')
	  deleteItem(_disposeRowId, _disposeItemName);
	  setTimeout(() => {
	  	$('#disposeModal').modal('hide');
	  }, 3000)
  }
  
  if (response.deleted && _disposeOnAdvancedView) {
	  showErrorMessageOnIncreaseModal('Item Deleted by Another Member');
	  deleteItem(_disposeItemID, _disposeItemName);
	  deleteItemOnAdvancedView()
	  setTimeout(() => {
	  	$('#disposeModal').modal('hide');
	  }, 3000)
  }
  
  if(!response.modifiedByOtherMember && !response.deleted && !_disposeOnAdvancedView) {
	  deleteItem(_disposeRowId, _disposeItemName);
	  showSuccessMessage('Successfully Disposed Item');
	  $('#disposeModal').modal('hide');
  }
  
  if(!response.modifiedByOtherMember && !response.deleted && _disposeOnAdvancedView) {
	  deleteItem(_disposeRowId, _disposeItemName);
	  deleteItemOnAdvancedView()
	  showSuccessMessage('Successfully Disposed Item');
	  $('#disposeModal').modal('hide');
  }
	
};

// handler for sending and recieving data from backend
const disposeItemInDB = () => {
  const servletParameters = {
    "item-id": _disposeItemID,
    "item-name": _disposeItemName,
    "item-quantity": _disposeItemQuantity,
    "item-price": _disposeItemPrice,
    "item-department": _disposeItemDepartment,
    "item-category": _disposeItemCategory,
    "item-model": _disposeItemModel,
    "item-location": _disposeItemLocation,
    "member-id": LOGGED_ON_MEMBER_ID,
    "update_type": "dispose"
  };
  $.ajax({
    url: 'ItemDispose',
    dataType: 'text',
    type: 'POST',
    data: servletParameters,
    success: function (data) {
      let response = JSON.parse(data);
      console.log('Response');
      console.log(response);
      handleDisposeResponse(response);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
      showErrorMessageOnDisposeModal('Unable to Dispose Item')
    },
  });
};

// form submit event handler
disposeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  disposeItemInDB();
});

// function to get data from dispose button
$('#disposeModal').on('show.bs.modal', function (e) {
  //get data-id attribute of the clicked element
  _disposeItemID = $(e.relatedTarget).data('id');
  _disposeItemName = $(e.relatedTarget).data('name');
  _disposeItemPrice = $(e.relatedTarget).data('price');
  _disposeItemDepartment = $(e.relatedTarget).data('department');
  _disposeItemCategory = $(e.relatedTarget).data('category');
  _disposeItemModel = $(e.relatedTarget).data('model');
  _disposeItemLocation = $(e.relatedTarget).data('location');
  _disposeItemQuantity = $(e.relatedTarget).data('quantity');
  _disposeRowId = $(e.relatedTarget.parentElement.parentElement).data(
    'rowNumber'
  );
  _disposeOnAdvancedView = $(e.relatedTarget).data('advanced');

  document.getElementById('itemIdDisposeModal').innerText = _disposeItemID;
  document.getElementById('itemNameDisposeModal').innerText = _disposeItemName;
  document.getElementById(
    'itemPriceDisposeModal'
  ).innerText = _disposeItemPrice.toFixed(2);
  document.getElementById(
    'itemDepartmentDisposeModal'
  ).innerText = _disposeItemDepartment;
  document.getElementById(
    'itemCategoryDisposeModal'
  ).innerText = _disposeItemCategory;
  document.getElementById(
    'itemModelIncreaseModal'
  ).innerText = _disposeItemModel;
  document.getElementById(
    'itemLocationDisposeModal'
  ).innerText = _disposeItemLocation;
});
