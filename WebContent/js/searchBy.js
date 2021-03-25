//const searchByNameCheckbox = document.getElementById('searchByName');
//const searchByCategoryCheckbox = document.getElementById('searchByCategory');
//const searchByMngDeptCheckbox = document.getElementById(
  //'searchByManagingDepartment'
//);
const searchByPriceRangeCheckbox = document.getElementById(
  'searchByPriceRange'
);

const searchByNameInput = document.getElementById('itemName');
const searchByCategoryInput = document.getElementById('itemCategory');
const searchByMngDeptInput = document.getElementById('itemManagingDepartment');
const searchByPriceRangeMinInput = document.getElementById('priceMin');
const searchByPriceRangeMaxInput = document.getElementById('priceMax');

const backToSearchScreenButton = $("#backToSearchScreenButton");

backToSearchScreenButton.click(function() {
  hideAllContainers();
  $("#searchContainer").show();
});

let itemLinkToAdvancedViewComponents = $(".itemLinkToAdvancedView");
itemLinkToAdvancedViewComponents.click(function(e){
  e.preventDefault();
  hideAllContainers();
  $("#advancedItemDetailContainer").show();
})
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
searchByPriceRangeCheckbox.addEventListener('change', (e) => {
  if (e.target.checked) {
    searchByPriceRangeMinInput.disabled = false;
    searchByPriceRangeMaxInput.disabled = false;
    return;
  }
  searchByPriceRangeMinInput.disabled = true;
  searchByPriceRangeMaxInput.disabled = true;
});
