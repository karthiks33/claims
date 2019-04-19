/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your customer ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', '../common', 'ojs/ojinputtext', 'ojs/ojbutton'],
        function (oj, ko, $, commonUtil) {

            function ChatbotViewModel() {
                var self = this;
                // Below are a set of the ViewModel methods invoked by the oj-module component.
                // Please reference the oj-module jsDoc for additional information.

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
                    commonUtil.redirectIfNotLoggedIn();
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
                self.info = ko.observable("Show patients data here");
                self.userText = ko.observable("");
                self.botresp = ko.observable("This is the bot response");
                self.processText = function (event) {
                    //document.getElementById(self.mode() + 'Dialog').close();
                    console.log("User entered text:" + self.userText());
                    var newdiv = '<div class="container darker"> <div class="right"><i class="fas fa-user fa-3x"  ></i></div>  <p>' + self.userText() + '</p> <span class="time-left">' + new Date().toLocaleTimeString() + '</span></div>';
                    $("#ansArea").append(newdiv);

                    $.ajax({
                        url: window.apiDomain + "/claims/chat/" + self.userText(),
                        type: 'GET',
                        success: function (data)
                        {
                            if(data.result){
                            self.botresp(data.result);
                        }
                        else{
                            self.botresp("Try asking something different.");
                        }
                            var newresp = '<div class="container"> <div ><i class="fab fa-android fa-3x"  ></i></div>  <p>' + self.botresp() + '</p> <span class="time-right">' + new Date().toLocaleTimeString() + '</span></div>';
                            $("#ansArea").append(newresp);
                            $('#ansArea').scrollTop($('#ansArea')[0].scrollHeight);
                        }
                    });
                    self.userText("");
                    $('#ansArea').scrollTop($('#ansArea')[0].scrollHeight);

                };




            }

            /*
             * Returns a constructor for the ViewModel so that the ViewModel is constructed
             * each time the view is displayed.  Return an instance of the ViewModel if
             * only one instance of the ViewModel is needed.
             */
            return new ChatbotViewModel();
        }
);
