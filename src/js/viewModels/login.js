/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojlabel',
    'ojs/ojinputtext', 'ojs/ojformlayout'],
        function (oj, ko, $) {

            function LoginViewModel() {
                var self = this;
                // Below are a set of the ViewModel methods invoked by the oj-module component.
                // Please reference the oj-module jsDoc for additional information.

                self.username = ko.observable();
                self.password = ko.observable();
                self.failedMessage = ko.observable("");
                self.router = oj.Router.rootInstance;
                var validate = true;
                self.loginButtonClick = function (event) {
                    self.failedMessage("");
                    console.log("username=" + self.username());
                    urlPath = window.apiDomain + "/claims/login";
                    var payload = {uname: self.username(), pwd: self.password()};
                    if(validate){
                    $.ajax({
                        url: urlPath,
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(payload),
                        success: function (data)
                        {
                            console.log("Login succeeded");
                            console.log(data);
                            if (data.result === "Success") {
                                redirectToDashboard();
                            } else {
                                showFailedMsg();
                            }

                        },
                        fail: function () {
                            showFailedMsg();
                        }
                    });
                }
                else{
                    redirectToDashboard();
                }

                    return true;

                };
                function showFailedMsg() {
                    console.log("Invalid username/password provided.");
                    self.failedMessage("Invalid username/password provided.");
                }
                ;

                function redirectToDashboard() {
                    self.failedMessage("");
                    var rootViewModel = ko.dataFor(document.getElementById('globalBody'));
                    rootViewModel.userLogin(self.username());
                    rootViewModel.userLoggedIn(true);
                    self.router.go("dashboard");
                }



                /**
                 * Optional ViewModel method invoked after the View is inserted into the
                 * document DOM.  The application can put logic that requires the DOM being
                 * attached here. 
                 * This method might be called multiple times - after the View is created 
                 * and inserted into the DOM and after the View is reconnected 
                 * after being disconnected.
                 */
                self.connected = function () {
                    // Implement if needed
                };

                /**
                 * Optional ViewModel method invoked after the View is disconnected from the DOM.
                 */
                self.disconnected = function () {
                    // Implement if needed
                };

                /**
                 * Optional ViewModel method invoked after transition to the new View is complete.
                 * That includes any possible animation between the old and the new View.
                 */
                self.transitionCompleted = function () {
                    // Implement if needed
                };

            }

            /*
             * Returns a constructor for the ViewModel so that the ViewModel is constructed
             * each time the view is displayed.  Return an instance of the ViewModel if
             * only one instance of the ViewModel is needed.
             */
            return new LoginViewModel();
        }
);
