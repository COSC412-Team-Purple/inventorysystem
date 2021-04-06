let _searchItemName = '';
let _searchItemCategory = '';
let _searchItemManagingDepartment = '';
let _searchItemPriceCheck = false;
let _searchItemMinPrice = 0;
let _searchItemMaxPrice = 0;

let _searchItems = [];

// Form
const _searchItemform = document.getElementById('searchItemForm');

// fake data
const data = [
  {
    id: 12,
    name: 'camera',
    model: 'Camera in 8k',
    quantity: 1,
    price: '1,340',
    managingDepartment: 'media',
    location: 'media room',
    category: 'Video',
  },
];



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
  const tableBody = document.getElementById('tableBody');

  if (paginationState.currentPage != 1) {
    pageButtonWrap.innerHTML =
      `<li class="page-item"><button class="page-link page" value="1">&#171; First</button></li>` +
      pageButtonWrap.innerHTML;
  }

  if (paginationState.currentPage != pages) {
    pageButtonWrap.innerHTML += `<li class="page-item"><button class="page-link page" value="${pages}">&#187; Last</button></li>`;
  }

  $('.page').on('click', function () {
    tableBody.innerHTML = '';
    paginationState.currentPage = Number($(this).val());
    console.log('add new event');
    buildTable();
  });
};



// Functions

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
  const tableBody = document.getElementById('tableBody');
  data.items.forEach((item, i) => {
    const html = `
      <tr class="itemRow" data-row-number="${item.id}">
        <th scope="row">${item.id}</th>
        <td id="name">${
          !item.deleted
            ? `<a href="" class="itemLinkToAdvancedView">${item.name}</a>`
            : `${item.name}`
        }</td>
        <td>${item.model}</td>
        <td id="itemQ">${item.quantity}</td>
        <td>${item.price}</td>
        <!-- for the id of the buttons it will be <id>-<btn name> -->
        <td>
          <button
            class="btn bg-success text-light"
            id="increaseBtn1"
            data-toggle="modal"
            data-target="#increaseModal"
            data-id="${item.id}"
            data-name="${item.name}"
            data-model="${item.model}"
            data-quantity="${item.quantity}"
            data-price="${item.price}"
            data-department="${item.managingDepartment}"
            data-location="${item.location}"
            data-category="${item.category}"
            ${item.deleted && 'disabled'}
          >
            Increase
          </button>
          <button
            class="btn btn-secondary"
            id="reduceBtn1"
            data-toggle="modal"
            data-target="#reduceModal"
            data-id="${item.id}"
            data-name="${item.name}"
            data-model="${item.model}"
            data-quantity="${item.quantity}"
            data-price="${item.price}"
            data-department="${item.managingDepartment}"
            data-location="${item.location}"
            data-category="${item.category}"
            ${item.deleted && 'disabled'}
          >
            Reduce
          </button>
          <button
            class="btn bg-warning"
            id="disposeBtn1"
            data-toggle="modal"
            data-target="#disposeModal"
            data-id="${item.id}"
            data-name="${item.name}"
            data-model="${item.model}"
            data-quantity="${item.quantity}"
            data-price="${item.price}"
            data-department="${item.managingDepartment}"
            data-location="${item.location}"
            data-category="${item.category}"
            ${item.deleted && 'disabled'}
          >
            Dispose
          </button>
          <button
            class="btn bg-danger text-light"
            id="reportMissingBtn1"
            data-toggle="modal"
            data-target="#reportMissingModal"
            data-id="${item.id}"
            data-name="${item.name}"
            data-model="${item.model}"
            data-quantity="${item.quantity}"
            data-price="${item.price}"
            data-department="${item.managingDepartment}"
            data-location="${item.location}"
            data-category="${item.category}"
            ${item.deleted && 'disabled'}
          >
            Report Missing
          </button>
        </td>
      </tr>
    `;
    tableBody.insertAdjacentHTML('beforeend', html);
  });
  if (_searchItems.length > paginationState.itemsPerPage) {
    pageButtons(data.pages);
  }
};

// handler to add the response data to screen
const handleSearchItemResponse = (response) => {
  _searchItems = [];
  response.forEach((item) => {
    _searchItems.push({ ...item, hasPermission: true });
  });

  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';
  if (_searchItems.length > 0) {
    buildTable();
  } else {
    const html = `
    <tr>
      <td>No Items were found</td>
    </tr>
    `;
    tableBody.innerHTML = html;
  }
};

// handler for sending and receiving search item data to back end
const getSearchItemInDB = () => {
  const servletParameters = {
    'item_name': _searchItemName,
    'item_category': _searchItemCategory,
    'item_dept': _searchItemManagingDepartment,
    'item_price_min': _searchItemMinPrice,
    'item_price_max': _searchItemMaxPrice,
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
      console.log(data)
      handleSearchItemResponse(response);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
      showErrorMessage('Unable to Find Item')
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
  getSearchItemInDB();
  //handleSearchItemResponse(data);
});

// Function to increase or decrease the quantity
const updateItemQuantity = (id, quantity) => {
  const items = Array.from(document.querySelectorAll('.itemRow'));
  const item = items.find((i) => +i.attributes[1].value === id);
  const newQ = +item.querySelector('#itemQ').innerHTML + +quantity;
  item.querySelector('#itemQ').innerHTML = newQ;
  const itemFromSearch = _searchItems.find((i) => i.id === id);
  itemFromSearch.quantity = newQ;
};

// Function for deleting an item
const deleteItem = (id, name) => {
  const items = Array.from(document.querySelectorAll('.itemRow'));
  const item = items.find((i) => +i.attributes[1].value === id);
  item.querySelector('#name').innerHTML = name;
  item.querySelector('#increaseBtn1').disabled = true;
  item.querySelector('#reduceBtn1').disabled = true;
  item.querySelector('#disposeBtn1').disabled = true;
  item.querySelector('#reportMissingBtn1').disabled = true;

  const itemFromSearch = _searchItems.find((i) => i.id === id);
  itemFromSearch.deleted = true;
};
