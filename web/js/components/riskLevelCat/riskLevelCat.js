/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



define(['ojs/ojcore', 'knockout', 'ojs/ojinputtext', 'ojs/ojlabel', 'ojs/ojformlayout', 'ojs/ojknockout', 'ojs/ojbutton', 
    'ojs/ojlegend', 'ojs/ojchart', 'ojs/ojtoolbar', 'ojs/ojradioset'
], function (oj, ko)
{
    /**
     * The view model for the main content view template
     */
    function riskLevelCatModel(params)
    {
        var self = this;

        // Attribute Groups Handler for Consistent Coloring
        var attrGroups = new oj.ColorAttributeGroupHandler();

        // Categories
        var categories = [];
        var hiddenCategories = [];
        self.hiddenCategoriesValue = ko.observableArray(hiddenCategories);
        var highlightedCategories = [];
        self.highlightedCategoriesValue = ko.observableArray(highlightedCategories);
        self.threeDValue = ko.observable("on");
        self.categorizeByColumn = ko.observable("charlsonIndex");
        self.header = ko.observable("Charlson Index vs Risk Level");
        self.graphVal = ko.observable("pie");
        self.graphVal.subscribe(function(){
            if(self.graphVal() === "pie"){
                $("#pieChartDiv").show();
                $("#barChartDiv").hide();
                
//                document.getElementById('pieChartDiv').refresh();
            }
            else{
                $("#pieChartDiv").hide();
                $("#barChartDiv").show();
//                document.getElementById('barChartDiv').refresh();

            }
            refreshData(self.categorizeByColumn());
        });
        var charlsonApi = "/claims/getOnCharlsonPivot";
        var condGrpApi = "/claims/getOnConditionPivot";
        var stayLengthApi = "/claims/getOnStayPivot";
        /**
         * Formats the data for multi-pie
         * @param {List} data List of lists, each containing the data for one series/category.
         * @param {List} groups The group names to be used for tooltips.
         * @return {List} List containing the pie data
         */
        function refreshData(selectedCategory){
            
           if(selectedCategory === "primaryCondGroup"){
               self.header("Primary Condition Group vs Risk Level");
               self.initializeData(condGrpApi);
           }
           else if(selectedCategory === "lengthofStay"){
               self.header("Length of Stay vs Risk Level");
               self.initializeData(stayLengthApi);
           }
           else{
               //charlsonIndex
               self.header("Charlson Index vs Risk Level");
               self.initializeData(charlsonApi);
           }
        }
        self.categoryChangeHandler = function (event) {
           var selectedCategory = event['detail'].value;
           console.log("selectedCategory:"+selectedCategory);
           refreshData(selectedCategory);
};
        var createMultiPieData = function (data, groups) {
            var seriesLists = [];
            for (var j = 0; j < data[0].length; j++) {
                var seriesData = [];
                for (var i = 0; i < data.length; i++) {
                    seriesData.push({'name': categories[i], 'items': [data[i][j]]});
                }
                seriesLists.push(seriesData);
            }
            console.log(seriesLists);
            return seriesLists;
            
        };

        // Chart Data        
//        var seriesGroupData = [[74, 62, 70, 76, 66], [50, 38, 46, 54, 42], [34, 22, 30, 32, 26], [18, 6, 14, 22, 10], [3, 2, 3, 3, 2]];
//        var groups = ["Risk A", "Risk B", "Risk C", "Risk D", "Risk E"];
//        var lists = createMultiPieData(seriesGroupData, groups);

        self.pieSeries1Value = ko.observableArray();
        self.pieSeries2Value = ko.observableArray();
        self.pieSeries3Value = ko.observableArray();
        self.pieSeries4Value = ko.observableArray();

        self.pie1Title = ko.observable();
        self.pie2Title = ko.observable();
        self.pie3Title = ko.observable();
        self.pie4Title = ko.observable();

        // Legend Data
        var legendSections = [{items: []}];
        var legendItems = legendSections[0].items;
       

        self.legendSections = ko.observableArray(legendSections);
        
        //barchart related
         /* toggle button variables */
        self.stackValue = ko.observable('on');
        self.stackLabelValue = ko.observable('on');
        self.orientationValue = ko.observable('vertical');
        self.labelPosition = ko.observable('auto');

        /* chart data */
        var barSeries = [{name: "Risk A", items: [{y:42, label:"42"}, {y:34, label:"34"},
                          {y:42, label:"42"}, {y:34, label:"34"}]},
                         {name: "Risk B", items: [{y:55, label:"55"}, {y:30, label:"30"},
                         {y:55, label:"55"}, {y:30, label:"30"}]},
                         {name: "Risk C", items: [{y:36, label:"36"}, {y:50, label:"50"},
                         {y:36, label:"36"}, {y:50, label:"50"}]},
                         {name: "Risk D", items: [{y:22, label:"22"}, {y:22, label:"22"},
                         {y:22, label:"22"}, {y:22, label:"22"}]}];
    
        var barGroups = [];
   
        self.barSeriesValue = ko.observableArray(barSeries);
        self.barGroupsValue = ko.observableArray(barGroups);
        
        

        self.mapData = function (seriesGroupData, groups, categories) {
            var lists = createMultiPieData(seriesGroupData, groups);

            self.pieSeries1Value(lists[0]);
            self.pieSeries2Value(lists[1]);
            self.pieSeries3Value(lists[2]);
            self.pieSeries4Value(lists[3]);

            self.pie1Title(groups[0]);
            self.pie2Title(groups[1]);
            self.pie3Title(groups[2]);
            self.pie4Title(groups[3]);
            
            self.barGroupsValue(groups);
            barSeries = []
            for (var i=0;i<categories.length;i++){
                var cat = categories[i];
                var obj = {};
                obj.name = cat;
                obj.items = [];
                
                var allrisksInThisCat = seriesGroupData[i];
                for (var j=0;j<allrisksInThisCat.length;j++){
                    var value = allrisksInThisCat[j];
                    obj.items.push({y:value, label:value});
                }
                barSeries.push(obj);
            }
            self.barSeriesValue(barSeries);
        };
        var getLabel = function(key){
            var label = "";
            switch (key) {
  case "riskACnt":
    label = "Risk A";
    break;
  case "riskBCnt":
    label = "Risk B";
    break;
  case "riskCCnt":
    label = "Risk C";
    break;
  case "riskDCnt":
    label = "Risk D";
    break;
  
        }
        return label;
    };
    
    
        self.initializeData = function (api) {
            $.ajax({
                url: window.apiDomain + api,
                type: 'GET',
                success: function (data)
                {
                    if (data) {
                        var seriesGroupData = [];
                        var groups = [];
                        categories = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = data[i];
                            var allKeys = Object.keys(obj);
                            if (i === 0) {
                                for (var j=0;j<allKeys.length;j++) {
                                    var key = allKeys[j];
                                    if (key.startsWith("risk")) {
                                       
                                        groups.push(getLabel(key));
                                    }
                                }
                            }
                            var riskValuesArray = [];
                            for (var j=0;j<allKeys.length;j++) {
                                    var key = allKeys[j];
                                if (key.startsWith("risk")) {
                                    riskValuesArray.push(obj[key]);
                                } else {
                                    categories.push(obj[key]);
                                }
                            }
                            seriesGroupData.push(riskValuesArray);

                        }
                        self.mapData(seriesGroupData, groups, categories);
                        //legends
                         legendSections = [{items: []}];
         legendItems = legendSections[0].items;
                        for (var categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
                            var category = categories[categoryIndex];
                            legendItems.push({text: category, color: attrGroups.getValue(category)});
                            self.legendSections(legendSections);
                        }
                    }
                }
            });


        };
        self.initializeData(charlsonApi);
        
        
        
       

    }

    return riskLevelCatModel;
});