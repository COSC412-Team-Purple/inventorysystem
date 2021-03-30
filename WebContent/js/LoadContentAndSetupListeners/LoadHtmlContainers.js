function loadAllContainers(){
  loadDashHtml();
  loadRolesHtml();
  loadRegisterHtml();
  loadAdvancedViewHtml();
  loadSearchViewHtml();
  loadModalsHtml();
  loadCreateRolesHtml();
}

function loadDashHtml () {
    let mainDiv = "#dashboardContainer"
    let loadDiv = "#loadingDashboard";
    let dummyDiv = "#dummydashboardContainer";
    let loadHtml = "html/Dashboard.html" + dummyDiv;


    $(loadDiv).load(loadHtml, function(responseTxt, statusTxt, jqXHR){
        jqXHR.done(function(){
          console.log("DONE");
          console.log(responseTxt);

          let loadedHtml = $(dummyDiv).html();
          console.log(loadedHtml);
          $(mainDiv).html(loadedHtml);
          $(loadDiv).remove();

          setupBarChart();
        })
    });
}

function loadRegisterHtml () {
    let mainDiv = "#registerItemContainer"
    let loadDiv = "#loadingRegisterItem";
    let dummyDiv = "#dummyregisterItemContainer";
    let loadHtml = "html/RegisterItem.html" + dummyDiv;


    $(loadDiv).load(loadHtml, function(responseTxt, statusTxt, jqXHR){
        jqXHR.done(function(){
          console.log("DONE");
          console.log(responseTxt);

          let loadedHtml = $(dummyDiv).html();
          console.log(loadedHtml);
          $(mainDiv).html(loadedHtml);
          $(loadDiv).remove();
        })
    });
}

function loadRolesHtml () {
    let mainDiv = "#RolesContainer"
    let loadDiv = "#loadingRoles";
    let dummyDiv = "#dummyRolesContainer";
    let loadHtml = "html/Roles.html" + dummyDiv;


    $(loadDiv).load(loadHtml, function(responseTxt, statusTxt, jqXHR){
        jqXHR.done(function(){
          console.log("DONE");
          console.log(responseTxt);

          let loadedHtml = $(dummyDiv).html();
          console.log(loadedHtml);
          $(mainDiv).html(loadedHtml);
          $(loadDiv).remove();

          setupRolesListeners();
        })
    });
}

function loadAdvancedViewHtml () {
    let mainDiv = "#advancedItemDetailContainer"
    let loadDiv = "#loadingAdvancedView";
    let dummyDiv = "#dummyadvancedItemDetailContainer";
    let loadHtml = "html/AdvancedView.html" + dummyDiv;


    $(loadDiv).load(loadHtml, function(responseTxt, statusTxt, jqXHR){
        jqXHR.done(function(){
          console.log("DONE");
          console.log(responseTxt);

          let loadedHtml = $(dummyDiv).html();
          console.log(loadedHtml);
          $(mainDiv).html(loadedHtml);
          $(loadDiv).remove();

          setupAdvancedViewListeners();
        })
    });
}

function loadSearchViewHtml () {
    let mainDiv = "#searchContainer"
    let loadDiv = "#loadingSearchView";
    let dummyDiv = "#dummysearchContainer";
    let loadHtml = "html/SearchView.html" + dummyDiv;


    $(loadDiv).load(loadHtml, function(responseTxt, statusTxt, jqXHR){
        jqXHR.done(function(){
          console.log("DONE");

          let loadedHtml = $(dummyDiv).html();
          console.log(loadedHtml);
          $(mainDiv).html(loadedHtml);
          $(loadDiv).remove();

          setupSearchViewListeners();
        })
    });
}

function loadModalsHtml () {
    let mainDivs = ["#increaseModal","#reduceModal", "#disposeModal", "#reportMissingModal", "#assignRoleModal"];
    let dummyDivs = ["#dummyincreaseModal","#dummyreduceModal", "#dummydisposeModal", "#dummyreportMissingModal", "#dummyassignRoleModal"];
    let loadDiv = "#loadingModals";
    let dummyDiv = "#modalsContainer";
    let loadHtml = "html/Modals.html" + dummyDiv;


    $(loadDiv).load(loadHtml, function(responseTxt, statusTxt, jqXHR){
        jqXHR.done(function(){
          console.log("DONE");
          console.log(responseTxt);

          for(i=0; i < mainDivs.length; i++){
            //console.log(dummyDivs[i]);
            let loadedHtml = $(dummyDivs[i]).html();
            console.log(loadedHtml);
            $(mainDivs[i]).html(loadedHtml);
          }

          $(loadDiv).remove();
        })
    });
}

function loadCreateRolesHtml () {
    let mainDiv = "#createRoleContainer"
    let loadDiv = "#loadingCreateRole";
    let dummyDiv = "#dummycreateRoleContainer";
    let loadHtml = "html/CreateRole.html" + dummyDiv;


    $(loadDiv).load(loadHtml, function(responseTxt, statusTxt, jqXHR){
        jqXHR.done(function(){
          console.log("DONE");

          let loadedHtml = $(dummyDiv).html();
          console.log(loadedHtml);
          $(mainDiv).html(loadedHtml);
          $(loadDiv).remove();

          setupCreateRolesListeners();
        })
    });
}
