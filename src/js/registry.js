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
            }
      return commonRegistry;

});