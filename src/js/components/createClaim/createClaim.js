/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(['ojs/ojcore', 'knockout', 'ojs/ojinputtext', 'ojs/ojlabel', 'ojs/ojformlayout'
], function (oj, ko)
{
    /**
     * The view model for the main content view template
     */
    function createClaimModel(params)
    {
        var self = this;
        self.claimId = ko.observable();
        self.memberId = ko.observable(69237);
        self.providerId = ko.observable(126927354);
        self.vendorId = ko.observable(1675623);
        self.pcp = ko.observable(66823);
        self.year = ko.observable("Y1");
        self.speciality = ko.observable("Internal");
        self.placeSvc = ko.observable("Urgent Care");
        self.payDelay = ko.observable(0);
        self.lengthOfStay = ko.observable();
        self.dsfs = ko.observable("0-1");
        self.primaryConditionGroup = ko.observable("ROAMI");
        self.charlsonIndex = ko.observable("0");

        self.mode = ko.observable("create");
        self.actionBtnTxt = ko.observable("Create");

        self.selectedClaim = ko.observable();
        self.notificationMsg = ko.observable("Create/Update Api failed.");


        if (params) {
            if (params.selectedClaim) {
                self.selectedClaim = params.selectedClaim;

                self.selectedClaim.subscribe(function () {
                    if (self.selectedClaim && self.selectedClaim()) {

                        console.log("inside Passed claim obj=");
                        console.log(self.selectedClaim());
                        self.claimId(self.selectedClaim().id);
                        self.memberId(self.selectedClaim().memberId);
                        self.providerId(self.selectedClaim().providerId);
                        self.vendorId(self.selectedClaim().vendor);
                        self.pcp(self.selectedClaim().pcp);
                        self.year(self.selectedClaim().year);
                        self.speciality(self.selectedClaim().speciality);
                        self.placeSvc(self.selectedClaim().placeSvc);
                        self.payDelay(self.selectedClaim().payDelay);
                        self.lengthOfStay(self.selectedClaim().lengthOfStay);
                        self.dsfs(self.selectedClaim().dsfs);
                        self.primaryConditionGroup(self.selectedClaim().primaryConditionGroup);
                        self.charlsonIndex(self.selectedClaim().charlsonIndex);

                    }
                });
            }

            if (params.mode) {
                self.mode(params.mode);

            }
        }
        if (self.mode() === "create") {
            self.actionBtnTxt("Create");
        } else {
            self.actionBtnTxt("Update");
        }

        self.createClaim = function (event) {
            self.payload = {memberId: self.memberId(),
                providerId: self.providerId(),
                vendor: self.vendorId(),
                pcp: self.pcp(),
                year: self.year() + "",
                speciality: self.speciality(),
                placeSvc: self.placeSvc(),
                payDelay: self.payDelay(),
                lengthOfStay: self.lengthOfStay(),
                dsfs: self.dsfs() + " months",
                primaryConditionGroup: self.primaryConditionGroup(),
                charlsonIndex: self.charlsonIndex()};

            var urlPath = window.apiDomain + "/claims/save";

            if (self.mode() === "create") {
                console.log("UrlPath=" + urlPath);
                console.log("payload=" + JSON.stringify(self.payload));
                $.ajax({
                    url: urlPath,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(self.payload),
                    success: function (data)
                    {
                        console.log("Created claim...");
                        console.log(data.result);
                        self.notificationMsg(data.result);
                    },
                    failure: function () {
                        console.log("Create failed");
                    }
                });
            } else if (self.mode() === "update") {
                self.payload.id = self.claimId();
                urlPath = window.apiDomain + "/claims/update";
                console.log("Update UrlPath=" + urlPath);
                console.log("payload=" + JSON.stringify(self.payload));
                $.ajax({
                    url: urlPath,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(self.payload),
                    success: function (data)
                    {
                        console.log("Updated claim...");
                        console.log(data.result);
                        self.notificationMsg(data.result);
                    },
                    failure: function () {
                        console.log("Update failed");
                    }
                });
            }
            $("#notification").show();
             setTimeout( function(){$('#notification').hide();} , 5000);
            $("#notificationText").text(self.notificationMsg());
            document.getElementById(self.mode() + 'Dialog').close();
            // document.getElementById('modalDialog1').close();
        }

        self.close = function (event) {
            document.getElementById(self.mode() + 'Dialog').close();
        }


    }

    return createClaimModel;
});