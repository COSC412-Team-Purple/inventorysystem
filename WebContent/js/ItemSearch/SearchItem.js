let _searchItemName = '';
let _searchItemCategory = '';
let _searchItemManagingDepartment = '';
let _searchItemPriceCheck = false;
let _searchItemMinPrice = 0;
let _searchItemMaxPrice = 0;

// fake data
// const data = [
//   {
//     id: 321,
//     name: 'camera',
//     model: 'Camera in 4k',
//     quantity: 2,
//     price: '2,000',
//   },
// ];

// Form
const _searchItemform = document.getElementById('searchItemForm');

// Functions

// Function to get the min and max prices if the price checkbox is checked
const priceBoxChecked = () => {
  if (_searchItemPriceCheck) {
    _searchItemMinPrice = document.getElementById('priceMin').value;
    _searchItemMaxPrice = document.getElementById('priceMax').value;
    return;
  }
};

// validate the search
const isValidSearch = () => {
  let valid = true;
  if (_searchItemName === '') {
    valid = false;
  }
  return valid;
};

// function to show error of no item name entered
const showSearchError = () => {
  console.log('no search term entered');
};

// handler to add the response data to screen
const handleSearchItemResponse = (response) => {
  const table = document.getElementById('table');
  if (response.length > 0) {
    response.forEach((item) => {
      const html = `
        <tr>
          <th scope="row">${item.id}</th>
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

// handler for sending and receiving search item data to back end
const getSearchItemInDB = () => {
  const servletParameters = {
    'search-item': _searchItemName,
    'item-category': _searchItemCategory,
    'managing-department': _searchItemManagingDepartment,
    'price-checkbox': _searchItemPriceCheck,
    'min-price': _searchItemMinPrice,
    'max-price': _searchItemMaxPrice,
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
_searchItemform.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('this is a submit');

  _searchItemName = document.getElementById('itemName').value.trim();
  _searchItemCategory = document.getElementById('itemCategory').value;
  _searchItemManagingDepartment = document.getElementById(
    'itemManagingDepartment'
  ).value;
  _searchItemPriceCheck = document.getElementById('searchByPriceRange').checked;

  priceBoxChecked();
  if (isValidSearch()) {
    // getSearchItemInDB();
    handleSearchItemResponse(data);
  } else {
    showSearchError();
  }
});
