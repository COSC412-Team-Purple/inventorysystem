const _colorPallete = ['#00429d', '#2854a6', '#3e67ae', '#507bb7', '#618fbf', '#73a2c6', '#85b7ce', '#9acbd5', '#b1dfdb', '#cdf1e0', '#f8eb39', '#fcd741', '#fec247', '#ffae4b', '#ff994d', '#ff824d', '#fd6a4c', '#f95048', '#f42f40', '#e9002c']
let _inventoryTotal = 0.0;

function getDashboardDataFromDB(){
    $.ajax({
        url: 'Dashboard',
        dataType: 'text',
        type: 'GET',
        data: "",
        success: function( data ){
            let dashboardData = JSON.parse(data);
            console.log(dashboardData);
            handleDashboardDataFromDB(dashboardData)
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    });
}

function handleDashboardDataFromDB(dashboardData){
  //parallel arrays
  populateCategorySelectAndDatalists(dashboardData.categories);

  updateInventoryTotalValue(dashboardData.inventoryTotal);
  drawItemsByCategoryBarChart(dashboardData.categories, dashboardData.itemsByCategory);

}

function populateCategorySelectAndDatalists(categories){
  categories.forEach((category) =>{
    if(!CATEGORIES.includes(category)){
      CATEGORIES.push(category);
      let selectOptionHtml = '<option value="'+ category +'">'+ category +'</option>';
      let datalistOptionHtml = '<option value="'+ category +'" />';
      $("#itemCategory").append(selectOptionHtml);
      $("#registerItemCategoryOptions").append(datalistOptionHtml);
    }
  })
}

function updateInventoryTotalValue(value){
  _inventoryTotal = value;
  let inventoryTotalCommaFormatted = _inventoryTotal.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  $("#totalIventoryValueDisplay").html(inventoryTotalCommaFormatted);
}



function drawItemsByCategoryBarChart(categories, itemsByCategory){
  var canvas = document.getElementById('itemsByCategoryBarChart').getContext('2d');

  let colors = getBarColors();
  console.log(colors);
  console.log(CATEGORIES.length);
  console.log(colors.length);
  var myChart = new Chart(canvas, {
      type: 'bar',
      data: {
          labels: categories,
          datasets: [{
              label: '# of Items by Category',
              data: itemsByCategory,
              backgroundColor: colors,
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

  let returnedColors = [];

  let colorsNeededPerAvailableRatio = numOfAvailableColors / numOfColorsNeeded;

  let colorPalleteIndex=0;

  if(numOfColorsNeeded > numOfAvailableColors){
    //when there are more categories than available colors
    for(i=0; i < numOfColorsNeeded; i++){
      colorPalleteIndex = i % numOfAvailableColors;
      returnedColors.push(_colorPallete[colorPalleteIndex]);
    }
  }else if (numOfColorsNeeded === numOfAvailableColors) {
    //when the # of categories is equal to available colors
    return _colorPallete;
  }else if(numOfColorsNeeded < numOfAvailableColors){
    //when there are less categories than available colors
    for(let i=0; i < numOfColorsNeeded; i++){
      colorPalleteIndex = Math.floor(i * colorsNeededPerAvailableRatio);
      returnedColors.push(_colorPallete[colorPalleteIndex]);
    }
  }

  return returnedColors;
}
