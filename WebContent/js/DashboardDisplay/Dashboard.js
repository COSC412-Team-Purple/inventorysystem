const _colorPallete = ['#00429d', '#2854a6', '#3e67ae', '#507bb7', '#618fbf', '#73a2c6', '#85b7ce', '#9acbd5', '#b1dfdb', '#cdf1e0', '#f8eb39', '#fcd741', '#fec247', '#ffae4b', '#ff994d', '#ff824d', '#fd6a4c', '#f95048', '#f42f40', '#e9002c']
let _inventoryTotal = 0.0;
let _itemsCorrespondingToCategory = [];

function getDashboardDataFromDB(){
    $.ajax({
        url: 'Dashboard',
        dataType: 'text',
        type: 'GET',
        data: servletParameters,
        success: function( data ){
            let dashboardData = JSON.parse(data);
            handleDashboardDataFromDB(dashboardData)
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
}

function handleDashboardDataFromDB(dashboardData){
  DEPARTMENTS = dashboardData.departments;
  LOCATIONS = dashboardData.locations;

  //parallel arrays
  CATEGORIES = dashboardData.categories;
  _itemsCorrespondingToCategory = dashboardData.itemNumberCorrespondingToCategory;

  updateInventoryTotalValue(dashboardData.inventoryTotal);
  drawItemsByCategoryBarChart();
}

function updateInventoryTotalValue(value){
  _inventoryTotal = value;
  let inventoryTotalCommaFormatted = _inventoryTotal.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  $("#totalIventoryValueDisplay").html(inventoryTotalCommaFormatted);
}

function updateItemsByCategory(category, itemNum){

  //when there are more categories than corresponding items -> an item was registered to a new category
  if(CATEGORIES.length !== _itemsCorrespondingToCategory.length){
    _itemsCorrespondingToCategory.push(itemNum)
  }else{
    //when the category already exists
    let index = CATEGORIES.indexOf(category);
    _itemsCorrespondingToCategory[index] = itemNum;
  }

  drawItemsByCategoryBarChart()
}

function drawItemsByCategoryBarChart(){
  var canvas = document.getElementById('itemsByCategoryBarChart').getContext('2d');

  var myChart = new Chart(canvas, {
      type: 'bar',
      data: {
          labels: CATEGORIES,
          datasets: [{
              label: '# of Items by Category',
              data: _itemsCorrespondingToCategory,
              backgroundColor: getBarColors(),
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });
}

function getBarColors(){
  let numOfColorsNeeded = CATEGORIES.length;
  let numOfAvailableColors = _colorPallete.length;

  let returnedColors = []

  let colorsNeededPerAvailableRatio = numOfAvailableColors / numOfColorsNeeded;

  let colorPalleteIndex=0;

  if(colorsNeededPerAvailableRatio < 1){
    //when there are more categories than available colors
    for(i=0; i < numOfColorsNeeded.length; i++){
      colorPalleteIndex = i % numOfAvailableColors;
      returnedColors.push(_colorPallete[colorPalleteIndex]);
    }
  }else if (colorsNeededPerAvailableRatio === 1) {
    //when the # of categories is equal to available colors
    return _colorPallete;
  }else{
    //when there are less categories than available colors
    for(i=0; i < numOfColorsNeeded.length; i++){
      colorPalleteIndex = Math.floor(i * colorsNeededPerAvailableRatio);
      returnedColors.push(_colorPallete[colorPalleteIndex]);
    }
  }

  return returnedColors;
}
