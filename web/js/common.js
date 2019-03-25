/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(['ojs/ojcore', 'knockout', 'jquery'],
        function (oj, ko, $) {

            function CommonModel() {
                var self = this;
                self.router = oj.Router.rootInstance;
                 function redirectIfNotLoggedIn() {
                    var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
                    if (rootViewModel.userLoggedIn()) {
                        //do nothing
                        console.log("User logged in: " + rootViewModel.userLogin);
                         
                    } else {
                        //redirect to login module
                        self.router.go("login");
                        
                    }
                }
                return {redirectIfNotLoggedIn : redirectIfNotLoggedIn};
            }
            return new CommonModel();
        }
);