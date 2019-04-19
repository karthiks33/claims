/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojchart', 'ojs/ojtoolbar', 'ojs/ojselectcombobox',
         'ojs/ojlabel'
     ], function (oj, ko)
{
    /**
     * The view model for the main content view template
     */
   function AgeToRiskChartModel() {
        var self = this;
        
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
    
        var barGroups = ["Below 25", "26-50","51-75", "76 & Above"];
   
        self.barSeriesValue = ko.observableArray(barSeries);
        self.barGroupsValue = ko.observableArray(barGroups);
        
       
       
    }

    return AgeToRiskChartModel;
});