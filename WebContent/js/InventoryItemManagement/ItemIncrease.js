let _itemName = '';
let _itemID = 0;
let _memberId = 0;
let _itemOldQuantity = '';
let _itemNewQuantity = 0;
let _itemPrice = 0;
let _comment = '';

// form
const form = document.getElementById('increaseForm');

// functions
const validQuanity = () => {
  let valid = true;
  valid = _itemNewQuantity === '' ? false : true;
  return valid;
};

const showIncreaseError = () => {
  console.log('No new quanity was inserted');
};

const handleQuantityUpdateResponse = (response) => {
  console.log(response);
};

// handler for search item
const increaseItemInDB = () => {
  const servletParameters = {
    'item-id': _itemID,
    'item-name': _itemName,
    'member-id': _memberId,
    'item-old-quanity': _itemOldQuantity,
    'item-new-quanity': _itemNewQuantity,
    'item-price': _itemPrice,
    'comment': _comment,
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
      handleQuantityUpdateResponse(response);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
    },
  });
};

// form submit event handler
form.addEventListener('submit', (e) => {
  e.preventDefault();

  _itemName = document.getElementById('itemNameIncreaseModal').value;
  _itemID = document.getElementById('itemIdIncreaseModal').value;
  _memberId = '';
  _itemOldQuantity = document.getElementById('itemQuantityIncreaseModal').value;
  _itemNewQuantity = document.getElementById('increase-number').value;
  _itemPrice = 0;
  _comment = document.getElementById('reason').value;
  if (validQuanity()) {
    increaseItemInDB();
  } else {
    showIncreaseError();
  }
});
