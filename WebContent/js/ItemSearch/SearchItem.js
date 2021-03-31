let _itemName = '';
let _itemCategory = '';
let _itemManagingDepartment = '';
let _itemPriceCheck = false;
let _itemMinPrice = 0;
let _itemMaxPrice = 0;

// const data = [
//   { name: 'camera', model: 'Camera in 4k', quantity: 2, price: '2,000' },
// ];

// Form
const form = document.getElementById('form');

// Functions
const priceBoxChecked = () => {
  if (_itemPriceCheck) {
    _itemMinPrice = document.getElementById('priceMin').value;
    _itemMaxPrice = document.getElementById('priceMax').value;
    return;
  }
};

const isValidSearch = () => {
  let valid = true;
  if (_itemName === '') {
    valid = false;
  }
  return valid;
};

const showSearchError = () => {
  console.log('no search term entered');
};

const handleSearchItemResponse = (response) => {
  const table = document.getElementById('table');
  if (response.items.length > 0) {
    response.items.forEach((item, i) => {
      const html = `
        <tr>
          <th scope="row">${i + 1}</th>
          <td><a href="" class="itemLinkToAdvancedView">${item.name}</a></td>
          <td>${item.model}</td>
          <td>${item.quantity}</td>
          <td>${item.price}</td>
          <!-- for the id of the buttons it will be <id>-<btn name> -->
          <td>
            <button
              class="btn bg-success text-light"
              id="1-increaseBtn"
              data-toggle="modal"
              data-target="#increaseModal"
            >
              Increase
            </button>
            <button
              class="btn btn-secondary"
              id="1-reduceBtn"
              data-toggle="modal"
              data-target="#reduceModal"
            >
              Reduce
            </button>
            <button
              class="btn bg-warning"
              id="1-disposeBtn"
              data-toggle="modal"
              data-target="#disposeModal"
            >
              Dispose
            </button>
            <button
              class="btn bg-danger text-light"
              id="1-reportMissingBtn"
              data-toggle="modal"
              data-target="#reportMissingModal"
            >
              Report Missing
            </button>
          </td>
        </tr>
      `;
      table.insertAdjacentHTML('beforeend', html);
    });
  } else {
    const html = `
    <tr>
      <td>No Items were found</td>
    </tr>
    `;
    table.innerHTML = html;
  }
};

// handler for search item
const getSearchItemInDB = () => {
  const servletParameters = {
    'search-item': _itemName,
    'item-category': _itemCategory,
    'managing-department': _itemManagingDepartment,
    'price-checkbox': _itemPriceCheck,
    'min-price': _itemMinPrice,
    'max-price': _itemMaxPrice,
  };
  $.ajax({
    url: 'ItemSearch',
    dataType: 'text',
    type: 'GET',
    data: servletParameters,
    success: function (data) {
      let response = JSON.parse(data);
      console.log('Response');
      console.log(response);
      handleSearchItemResponse(response);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
    },
  });
};

// Form submit event
form.addEventListener('submit', (e) => {
  e.preventDefault();

  _itemName = document.getElementById('itemName').value.trim();
  _itemCategory = document.getElementById('itemCategory').value;
  _itemManagingDepartment = document.getElementById('itemManagingDepartment')
    .value;
  _itemPriceCheck = document.getElementById('searchByPriceRange').checked;

  priceBoxChecked();
  if (isValidSearch()) {
    getSearchItemInDB();
  } else {
    showSearchError();
  }
});
