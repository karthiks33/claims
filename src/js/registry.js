/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define([
    'knockout'
],
function (ko) {
     var commonRegistry = {};
     commonRegistry.initialize = function ()
            {
                //if (!ko.components.isRegistered('dbms-widget'))
                console.log("Registering common components ");
                if (!ko.components.isRegistered('createClaim'))
                {
                    console.log("Registering createClaim");
                    ko.components.register("createClaim", {
                        viewModel: {require: 'components/createClaim/createClaim'},
                        template: {require: 'text!components/createClaim/createClaim.html'},
                        synchronous: true
                    });
                    console.log("Done: Registering createClaim ");
                }
                if (!ko.components.isRegistered('riskLevelCat'))
                {
                    console.log("Registering riskLevelCat");
                    ko.components.register("riskLevelCat", {
                        viewModel: {require: 'components/riskLevelCat/riskLevelCat'},
                        template: {require: 'text!components/riskLevelCat/riskLevelCat.html'},
                        synchronous: true
                    });
                    console.log("Done: Registering riskLevelCat ");
                }
                if (!ko.components.isRegistered('ageToRisk'))
                {
                    console.log("Registering ageToRisk");
                    ko.components.register("ageToRisk", {
                        viewModel: {require: 'components/ageToRisk/ageToRisk'},
                        template: {require: 'text!components/ageToRisk/ageToRisk.html'},
                        synchronous: true
                    });
                    console.log("Done: Registering ageToRisk ");
                }
            }
      return commonRegistry;

});