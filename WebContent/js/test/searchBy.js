//let searchByNameCheckbox = $('#searchByName');
//let searchByCategoryCheckbox = $('#searchByCategory');
//let searchByMngDeptCheckbox = document.getElementById(
  //'searchByManagingDepartment'
//);
let searchByPriceRangeCheckbox;

let searchByNameInput;
let searchByCategoryInput;
let searchByMngDeptInput;
let searchByPriceRangeMinInput;
let searchByPriceRangeMaxInput;

let backToSearchScreenButton;


function setupAdvancedViewListeners(){
  backToSearchScreenButton = $("#backToSearchScreenButton");
  backToSearchScreenButton.click(function() {
    hideAllContainers();
    $("#searchContainer").show();
  });
}


function setupSearchViewListeners(){
  searchByPriceRangeCheckbox = $('#searchByPriceRange');

  searchByNameInput = $('#itemName');
  searchByCategoryInput = $('#itemCategory');
  searchByMngDeptInput = $('#itemManagingDepartment');
  searchByPriceRangeMinInput = $('#priceMin');
  searchByPriceRangeMaxInput = $('#priceMax');

  let itemLinkToAdvancedViewComponents = $(".itemLinkToAdvancedView");
  itemLinkToAdvancedViewComponents.click(function(e){
    e.preventDefault();
    hideAllContainers();
    $("#advancedItemDetailContainer").show();
  })

  searchByPriceRangeCheckbox.change(function(e) {
    if (e.target.checked) {
      searchByPriceRangeMinInput.disabled = false;
      searchByPriceRangeMaxInput.disabled = false;
      return;
    }
    searchByPriceRangeMinInput.disabled = true;
    searchByPriceRangeMaxInput.disabled = true;
  });
}


/*searchByNameCheckbox.addEventListener('change', (e) => {
  if (e.target.checked) {
    searchByNameInput.disabled = false;
    return;
  }
  searchByNameInput.disabled = true;
});

searchByCategoryCheckbox.addEventListener('change', (e) => {
  if (e.target.checked) {
    searchByCategoryInput.disabled = false;
    return;
  }
  searchByCategoryInput.disabled = true;
});

searchByMngDeptCheckbox.addEventListener('change', (e) => {
  if (e.target.checked) {
    searchByMngDeptInput.disabled = false;
    return;
  }
  searchByMngDeptInput.disabled = true;
});
*/
