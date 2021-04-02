let _searchItemName = '';
let _searchItemCategory = '';
let _searchItemManagingDepartment = '';
let _searchItemPriceCheck = false;
let _searchItemMinPrice = 0;
let _searchItemMaxPrice = 0;

let _searchItems = [];

// fake data
// const data = [
//   {
//     id: 12,
//     name: 'camera',
//     model: 'Camera in 8k',
//     quantity: 1,
//     price: '1,340',
//   },
// ];

const paginationState = {
  itemsPerPage: 10,
  currentPage: 1,
  numberPageButtons: 5,
};

const pageButtons = (pages) => {
  const pageButtonWrap = document.getElementById('pageButtons');
  pageButtonWrap.innerHTML = '';

  let maxLeft =
    paginationState.currentPage -
    Math.floor(paginationState.numberPageButtons / 2);

  let maxRight =
    paginationState.currentPage +
    Math.floor(paginationState.numberPageButtons / 2);

  if (maxLeft < 1) {
    maxLeft = 1;
    maxRight = paginationState.numberPageButtons;
  }

  if (maxRight > pages) {
    maxLeft = pages - (paginationState.numberPageButtons - 1);

    if (maxLeft < 1) {
      maxLeft = 1;
    }
    maxRight = pages;
  }

  for (let page = maxLeft; page <= maxRight; page++) {
    pageButtonWrap.innerHTML += `<li class="page-item ${
      paginationState.currentPage === page ? 'active' : ''
    }"><button class="page-link page" value="${page}">${page}</button></li>`;
  }
  const table = document.getElementById('table');

  if (paginationState.currentPage != 1) {
    pageButtonWrap.innerHTML =
      `<li class="page-item"><button class="page-link page" value="1">&#171; First</button></li>` +
      pageButtonWrap.innerHTML;
  }

  if (paginationState.currentPage != pages) {
    pageButtonWrap.innerHTML += `<li class="page-item"><button class="page-link page" value="${pages}">&#187; Last</button></li>`;
  }

  $('.page').on('click', function () {
    table.innerHTML = '';
    paginationState.currentPage = Number($(this).val());
    console.log('add new event');
    buildTable();
  });
};

// Form
const _searchItemform = document.getElementById('searchItemForm');

// Functions
const updateItemQuantity = (id, quanity) => {};

// pagination function
const pagination = () => {
  const { itemsPerPage, currentPage } = paginationState;

  const trimStart = (currentPage - 1) * itemsPerPage;
  const trimend = trimStart + itemsPerPage;

  const trimmedData = _searchItems.slice(trimStart, trimend);

  const totalPages = Math.ceil((_searchItems.length + 1) / itemsPerPage);

  return {
    items: trimmedData,
    pages: totalPages,
  };
};

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

// function to build table with data
const buildTable = () => {
  const data = pagination();
  const table = document.getElementById('table');
  data.items.forEach((item, i) => {
    const html = `
      <tr data-row-number=${i}">
        <th scope="row">${item.id}</th>
        <td><a href="" class="itemLinkToAdvancedView">${item.name}</a></td>
        <td>${item.model}</td>
        <td id="itemQ">${item.quantity}</td>
        <td>${item.price}</td>
        <!-- for the id of the buttons it will be <id>-<btn name> -->
        <td>
          <button
            class="btn bg-success text-light"
            id="1-increaseBtn"
            data-toggle="modal"
            data-target="#increaseModal"
            data-id="${item.id}"
            data-name="${item.name}"
            data-model="${item.model}"
            data-quantity="${item.quantity}"
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
  if (_searchItems.length > paginationState.itemsPerPage) {
    pageButtons(data.pages);
  }
};

// handler to add the response data to screen
const handleSearchItemResponse = (response) => {
  response.forEach((item, i) => {
    _searchItems.push({ ...item, hasPermission: true });
  });

  const table = document.getElementById('table');
  if (_searchItems.length > 0) {
    buildTable();
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

  _searchItemName = document.getElementById('itemName').value.trim();
  _searchItemCategory = document.getElementById('itemCategory').value;
  _searchItemManagingDepartment = document.getElementById(
    'itemManagingDepartment'
  ).value;
  _searchItemPriceCheck = document.getElementById('searchByPriceRange').checked;

  priceBoxChecked();
  if (isValidSearch()) {
    getSearchItemInDB();
    // handleSearchItemResponse(data);
  } else {
    showSearchError();
  }
});
