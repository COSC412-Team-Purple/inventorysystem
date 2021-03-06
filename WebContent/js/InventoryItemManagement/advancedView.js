// variables
let _advancedViewItemId = 0
let _advancedViewItemName = ''
let _advancedViewItemModel = ''
let _advancedViewItemBrand = ''
let _advancedViewItemDepartment = ''
let _advancedViewItemCategory = ''
let _advancedViewItemLocation = ''
let _advancedViewItemQuantity = 0
let _advancedViewItemPrice = 0
let _advancedViewItemPurchaseDate = ''
let _advancedViewItemMemo = ''
let _advancedViewItemDeleted = false;
let _advancedPermissions = false;

// function to tell the that the item was deleted
const deleteItemOnAdvancedView = () => {
	_advancedViewItemDeleted = true;
	buildAdvancedButtons();
}

// function to update the quantity
const advancedUpdateQuantity = (quantity) => {
	document.getElementById('advancedItemQuantityInput').value = quantity;
}


// function to build the buttons
const buildAdvancedButtons = (input = 0) => {

	_advancedViewItemQuantity = input === 0 ? _advancedViewItemQuantity : input;
	const advancedButtonsContainer = document.getElementById('advancedButtonsContainer');
	advancedButtonsContainer.innerHTML = '';
	const html = `
		<button
			class="btn bg-success text-light" 
			id="advancedIncreaseBtn" 
			data-toggle="modal" 
			data-target="#increaseModal"
			data-id="${_advancedViewItemId}"
            data-name="${_advancedViewItemName}"
            data-model="${_advancedViewItemModel}"
            data-quantity="${_advancedViewItemQuantity}"
            data-price="${_advancedViewItemPrice}"
            data-department="${_advancedViewItemDepartment}"
            data-location="${_advancedViewItemLocation}"
            data-category="${_advancedViewItemCategory}"
            data-purchasedate="${_advancedViewItemPurchaseDate}"
            data-brand="${_advancedViewItemBrand}"
            data-comment="${_advancedViewItemMemo}"
            data-advanced="${true}"
            ${(!_advancedPermissions || _advancedViewItemDeleted) && 'disabled'}
			>Increase</button>
        <button 
        	class="btn btn-secondary" 
        	id="advancedReduceBtn" 
        	data-toggle="modal" 
        	data-target="#reduceModal"
        	data-id="${_advancedViewItemId}"
            data-name="${_advancedViewItemName}"
            data-model="${_advancedViewItemModel}"
            data-quantity="${_advancedViewItemQuantity}"
            data-price="${_advancedViewItemPrice}"
            data-department="${_advancedViewItemDepartment}"
            data-location="${_advancedViewItemLocation}"
            data-category="${_advancedViewItemCategory}"
            data-purchasedate="${_advancedViewItemPurchaseDate}"
            data-brand="${_advancedViewItemBrand}"
            data-comment="${_advancedViewItemMemo}"
            data-advanced="${true}"
            ${(!_advancedPermissions || _advancedViewItemDeleted) && 'disabled'}
        	>Reduce</button>
        <button 
        	class="btn bg-warning" 
        	id="advancedDisposeBtn" 
        	data-toggle="modal" 
        	data-target="#disposeModal"
        	data-id="${_advancedViewItemId}"
            data-name="${_advancedViewItemName}"
            data-model="${_advancedViewItemModel}"
            data-quantity="${_advancedViewItemQuantity}"
            data-price="${_advancedViewItemPrice}"
            data-department="${_advancedViewItemDepartment}"
            data-location="${_advancedViewItemLocation}"
            data-category="${_advancedViewItemCategory}"
            data-purchasedate="${_advancedViewItemPurchaseDate}"
            data-brand="${_advancedViewItemBrand}"
            data-comment="${_advancedViewItemMemo}"
            data-advanced="${true}"
            ${(!_advancedPermissions || _advancedViewItemDeleted) && 'disabled'}
        	>Dispose</button>
        <button 
        	class="btn bg-danger text-light" 
        	id="advancedReportMissingBtn" 
        	data-toggle="modal" 
        	data-target="#reportMissingModal"
        	data-id="${_advancedViewItemId}"
            data-name="${_advancedViewItemName}"
            data-model="${_advancedViewItemModel}"
            data-quantity="${_advancedViewItemQuantity}"
            data-price="${_advancedViewItemPrice}"
            data-department="${_advancedViewItemDepartment}"
            data-location="${_advancedViewItemLocation}"
            data-category="${_advancedViewItemCategory}"
            data-purchasedate="${_advancedViewItemPurchaseDate}"
            data-brand="${_advancedViewItemBrand}"
            data-comment="${_advancedViewItemMemo}"
            data-advanced="${true}"
            ${(!_advancedPermissions || _advancedViewItemDeleted) && 'disabled'}
        	>Report Missing</button>
	`;
	advancedButtonsContainer.insertAdjacentHTML('beforeend', html);
}


// function to populate the page with data
const populateAdvancedViewPage = () => {
	buildAdvancedButtons()

	document.getElementById('advancedItemName').innerText = _advancedViewItemName
	document.getElementById('advancedItemModelInput').value = _advancedViewItemModel
	document.getElementById('advancedItemBrandInput').value = _advancedViewItemBrand
	document.getElementById('advancedItemDeptInput').value = _advancedViewItemDepartment
	document.getElementById('advancedItemCategoryInput').value = _advancedViewItemCategory
	document.getElementById('advancedItemLocatonInput').value = _advancedViewItemLocation
	document.getElementById('advancedItemQuantityInput').value = _advancedViewItemQuantity
	document.getElementById('advancedItemPriceInput').value = _advancedViewItemPrice
	document.getElementById('advancedItemPurchaseDateInput').value = _advancedViewItemPurchaseDate
	document.getElementById('advancedItemMemoInput').value = _advancedViewItemMemo
}

// function to retrieve the data from the search item page
const giveDataToAdvanceView = (link) => {
	_advancedViewItemId = link.dataset.id
	_advancedViewItemName = link.dataset.name
	_advancedViewItemModel = link.dataset.model
	_advancedViewItemBrand = link.dataset.brand
	_advancedViewItemDepartment = link.dataset.department
	_advancedViewItemCategory = link.dataset.category
	_advancedViewItemLocation = link.dataset.location
	_advancedViewItemQuantity = link.dataset.quantity
	_advancedViewItemPrice = link.dataset.price
	_advancedViewItemPurchaseDate = link.dataset.purchasedate
	_advancedViewItemMemo = link.dataset.comment === 'null' || 'link.dataset.comment' === undefined ? 'No Comment' : link.dataset.comment
	_advancedPermissions = link.dataset.permissions === "true" ? true : false

	populateAdvancedViewPage()
};