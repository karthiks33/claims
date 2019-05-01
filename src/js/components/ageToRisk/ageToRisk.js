/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojknockout', 'ojs/ojchart','ojs/ojlegend'
     ], function (oj, ko)
{
    /**
     * The view model for the main content view template
     */
   function AgeToRiskChartModel() {
        var self = this;
        
        /* chart data */
        var colorHandler = new oj.ColorAttributeGroupHandler();
    var shapeHandler = new oj.ShapeAttributeGroupHandler();
    shapeHandler.getValue();
 
        

        self.seriesItems = ko.observableArray([]);
        self.bubbleGroups = ko.observableArray(["male", "female"]);
 
        var legendSections = {sections: [
            {title: "Gender", items: [
                {markerShape:shapeHandler.getValue("male"), text: "male", id: "male"},
                {markerShape:shapeHandler.getValue("female"), text: "female", id: "female"}
            ]}
        ]};
        self.legendSections = ko.observable(legendSections);
       initializeData();
       
       function initializeData(){
           
           $.ajax({
                        url: window.apiDomain + "/claims/getClusterGroups",
                        type: 'GET',
                        success: function (data)
                        {
                             
                            for (var i = 0; i < data.length; i++) {
                                var groupdata = data[i];
                                
                                if (groupdata.groupName && groupdata.memberDetails) {
                                    
                                    var items = [];
                                    
                                    for (var j = 0; j < groupdata.memberDetails.length; j++) {
                                        var memberdata = groupdata.memberDetails[j];
                                       
                                        items.push({
                x: memberdata.age * 10 - Math.floor(Math.random() * 11), y: memberdata.riskLevel - (Math.random()),
                color: colorHandler.getValue(groupdata.groupName),
                markerShape: shapeHandler.getValue(memberdata.gender),
                categories: [ groupdata.groupName, memberdata.gender],
                shortDesc: groupdata.groupName + " " + memberdata.gender + "&lt;br/&gt;Age: " +
                    memberdata.age + "&lt;br/&gt;riskLevel: " + memberdata.riskLevel
            });
                                    }
                                    
                                     self.seriesItems().push({name: groupdata.groupName, displayInLegend: 'off', items: items});
                                }
                            }
                            self.seriesItems.valueHasMutated();
                            var groupsLegend = {title: "Groups", items: []};
                            for (var i = 0; i < self.seriesItems().length; i++) {
                                
                                var groupName = self.seriesItems()[i].name;
                                groupsLegend.items.push({color: colorHandler.getValue(groupName), text: groupName, id: groupName});
                            }
                            legendSections.sections.push(groupsLegend);
                            
                             self.legendSections(legendSections);
                             console.log(self.legendSections());
                            
                        }
                    });
                    
       }
    }

    return AgeToRiskChartModel;
});