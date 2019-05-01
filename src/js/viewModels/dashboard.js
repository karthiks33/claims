/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojarraydataprovider', '../common', 'ojs/ojknockout', 'ojs/ojtable',
    'ojs/ojinputtext', 'ojs/ojselectcombobox', 'ojs/ojbutton', 'ojs/ojdialog'],
        function (oj, ko, $, ArrayDataProvider, commonUtil) {

            function DashboardViewModel() {
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
                    self.isAdmin(commonUtil.isAdmin());


                    if (self.isAdmin()) {
                        $("#adminOp").show();
                        self.info("Search, Create, Update, Delete claims data. Search the data based on the available filters, by member, claim, provider or vendor ids.");
                
                    } else {
                        $("#adminOp").hide();
                       self.info("Search the data based on the available filters, by member, claim, provider or vendor ids.");

                    }
                    self.initializeData();


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
                self.info = ko.observable("Search, Create, Update, Delete claims data. Search the data based on the available filters, by member, claim, provider or vendor ids.");
                self.claimsArray = ko.observableArray();
                self.dataprovider = ko.observable(new ArrayDataProvider(self.claimsArray(), {keyAttributes: 'id'}));
                self.searchByColumn = ko.observable("claimId");
                self.searchByValue = ko.observable();
                self.selectedItems = ko.observable([]);
                self.selectedClaimId = ko.observable();
                self.selectedClaim = ko.observable();
                self.updateHeader = ko.observable();
                self.deleteHeader = ko.observable();
                self.deleteConfirmMsg = ko.observable();
                self.disableUpdate = ko.observable(true);
                self.notificationMsg = ko.observable("Deletion api failed");
                self.isAdmin = ko.observable(true);
                self.isAdmin(commonUtil.isAdmin());

                self.selectedClaimId.subscribe(function () {
                    if (self.selectedClaimId()) {
                        self.disableUpdate(false);
                        self.updateHeader("Update Claim ( ID: " + self.selectedClaimId() + " )");
                        self.deleteHeader("Confirmation: Delete Claim ( ID: " + self.selectedClaimId() + " )");
                        self.deleteConfirmMsg("Are you sure you want to delete claim with id: " + self.selectedClaimId() + " ?");

                    }
                });
                //new ArrayDataProvider(self.claimsArray(), {keyAttributes: 'id'});
                self.initializeData = function () {
                    $.ajax({
                        url: window.apiDomain + "/claims/listClaims",
                        type: 'GET',
                        success: function (data)
                        {
                            // console.log(data);
                            // self.info(data.length);
                            self.claimsArray(data);
                            console.log(self.claimsArray());
                            self.dataprovider(new ArrayDataProvider(self.claimsArray(), {keyAttributes: 'id'}));
                        }
                    });
                }
                self.initializeData();

                self.searchAction = function (event) {
                    if (!self.searchByValue()) {
                        self.initializeData();
                        return;
                    }
                    var urlPath = "/claims/getClaim";
                    if (self.searchByColumn() === "claimId") {
                        urlPath += "/claimsId";
                    } else if (self.searchByColumn() === "memberId") {
                        urlPath += "/memberId";
                    } else if (self.searchByColumn() === "providerId") {
                        urlPath += "/providerId";
                    } else if (self.searchByColumn() === "vendorId") {
                        urlPath += "/vendorId";
                    }
                    urlPath = window.apiDomain + urlPath + "/" + self.searchByValue();
                    console.log("UrlPath=" + urlPath);
                    $.ajax({
                        url: urlPath,
                        type: 'GET',
                        success: function (data)
                        {
                            self.claimsArray(data);
                            console.log(self.claimsArray());
                            self.dataprovider(new ArrayDataProvider(self.claimsArray(), {keyAttributes: 'id'}));
                        }
                    });
                };

                self.createClaim = function (event) {
                    document.getElementById('createDialog').open();
                };
                self.updateClaim = function (event) {
                    document.getElementById('updateDialog').open();
                };
                self.deleteClaim = function (event) {
                    document.getElementById('deleteDialog').open();
                };

                self.selectionListener = function (event)
                {
                    var data = event.detail;
                    if (event.type === 'selectionChanged' && data['value'] !== null)
                    {
                        var rowIndex = data['value'][0]['startIndex'].row;
                        var claim = self.claimsArray()[rowIndex];
                        console.log("Selected claim=");
                        console.log(claim);
                        self.selectedClaim(claim);
                        self.selectedClaimId(claim.id);
                        self.selectedClaim.valueHasMutated();
                    }
                };

                self.closeDeletePopup = function (event) {
                    document.getElementById('deleteDialog').close();
                }
                self.showNotification = function () {
                    $("#notificationText").text(self.notificationMsg());
                    $("#notification").show();
                    setTimeout(function () {
                        $('#notification').hide();
                    }, 20000);
                };

                self.deleteClaimConfirmed = function (event) {
                    console.log("deleting claim with id " + self.selectedClaimId());
                    var urlPath = window.apiDomain + "/claims/delete/" + self.selectedClaimId();
                    $.ajax({
                        url: urlPath,
                        type: 'DELETE',
                        success: function (data)
                        {
                            console.log("Deleted claim...");
                            console.log(data.result);
                            self.notificationMsg(data.result);
                            self.showNotification();

                            self.initializeData();
                        },
                        error: function (data) {
                            console.log("Delete failed");
                            console.log(data.responseJSON.result);
                            self.notificationMsg(data.responseJSON.result);
                            self.showNotification();
                        }
                    });
                    document.getElementById('deleteDialog').close();


                };
            }

            /*
             * Returns a constructor for the ViewModel so that the ViewModel is constructed
             * each time the view is displayed.  Return an instance of the ViewModel if
             * only one instance of the ViewModel is needed.
             */
            return new DashboardViewModel();
        }
);
