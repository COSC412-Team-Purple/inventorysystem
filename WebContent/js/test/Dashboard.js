const colorPallete = ['#00429d', '#2854a6', '#3e67ae', '#507bb7', '#618fbf', '#73a2c6', '#85b7ce', '#9acbd5', '#b1dfdb', '#cdf1e0', '#f8eb39', '#fcd741', '#fec247', '#ffae4b', '#ff994d', '#ff824d', '#fd6a4c', '#f95048', '#f42f40', '#e9002c']


function getItems(){
  let itemInfo = {}
  let items = []
  let data = [];
  for(i=0; i<20; i++){
    items.push("category" + i);
    data.push(Math.floor(Math.random() * Math.floor(100)));
  }
  itemInfo["items"] = items;
  itemInfo["data"] = data;
  return itemInfo;
}
function setupBarChart(){
  var ctx = document.getElementById('barChart').getContext('2d');

  let itemInfo = getItems();
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: itemInfo.items,
          datasets: [{
              label: '# of Items by Category',
              data: itemInfo.data,
              backgroundColor: colorPallete,
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
