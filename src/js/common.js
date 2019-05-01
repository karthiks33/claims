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
                        console.log("User logged in: " + rootViewModel.userLogin());
                         
                    } else {
                        //redirect to login module
                        self.router.go("login");
                        
                    }
                }
                function isAdmin() {
                    var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
                    if (rootViewModel.userLogin && rootViewModel.userLogin() === "admin") {
                        //do nothing
                        console.log("It is admin ");
                        return true;
                         
                    } 
                    console.log("It is not admin ");
                        return false;
                }
                
                return {redirectIfNotLoggedIn : redirectIfNotLoggedIn,
                isAdmin: isAdmin};
            }
            return new CommonModel();
        }
);