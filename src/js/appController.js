/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'knockout', 'common', 'ojs/ojmodule-element-utils', 'ojs/ojmodule-element', 'ojs/ojrouter', 'ojs/ojknockout', 'ojs/ojarraytabledatasource',
    'ojs/ojoffcanvas'],
        function (oj, ko, commonUtil, moduleUtils) {
            function ControllerViewModel() {
                var self = this;

                // Media queries for repsonsive layouts
                var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
                self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
                var mdQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
                self.mdScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

                // Router setup
                self.router = oj.Router.rootInstance;
                self.router.configure({
                    'login': {label: 'Login'},
                    'dashboard': {label: 'Dashboard', isDefault: true},
                    'analytics': {label: 'Analytics'},
                    'activities': {label: 'Activities'},
                    'chatbot': {label: 'Chatbot'},
                    'about': {label: 'About'}
                });
                oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

                self.moduleConfig = ko.observable({'view': [], 'viewModel': null});

                self.loadModule = function () {
                    ko.computed(function () {
                        var name = self.router.moduleConfig.name();
                        var viewPath = 'views/' + name + '.html';
                        var modelPath = 'viewModels/' + name;
                        var masterPromise = Promise.all([
                            moduleUtils.createView({'viewPath': viewPath}),
                            moduleUtils.createViewModel({'viewModelPath': modelPath})
                        ]);
                        masterPromise.then(
                                function (values) {
                                    self.moduleConfig({'view': values[0], 'viewModel': values[1]});
                                }
                        );
                    });
                };

                // Navigation setup
                var navData = [
                    {name: 'Dashboard', id: 'dashboard',
                        iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'},
                    {name: 'Analytics', id: 'analytics',
                        iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24'},
                    {name: 'Activities', id: 'activities',
                        iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-catalog-icon-24'},
                    {name: 'Chatbot', id: 'chatbot',
                        iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chat-icon-24'},
                    {name: 'About', id: 'about',
                        iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24'}
                ];
                self.navDataSource = ko.observable(new oj.ArrayTableDataSource(navData, {idAttribute: 'id'}));

                // Drawer
                // Close offcanvas on medium and larger screens
                self.mdScreen.subscribe(function () {
                    oj.OffcanvasUtils.close(self.drawerParams);
                });
                self.drawerParams = {
                    displayMode: 'push',
                    selector: '#navDrawer',
                    content: '#pageContent'
                };
                // Called by navigation drawer toggle button and after selection of nav drawer item
                self.toggleDrawer = function () {
                    return oj.OffcanvasUtils.toggle(self.drawerParams);
                }
                // Add a close listener so we can move focus back to the toggle button when the drawer closes
                $("#navDrawer").on("ojclose", function () {
                    $('#drawerToggleButton').focus();
                });

                // Header
                // Application Name used in Branding Area
                self.appName = ko.observable("Claims Analytics Information Management System");
                // User Info used in Global Navigation area
                //self.userLogin = ko.observable("sanjaye2@illinois.com");
                self.userLogin = ko.observable("Not yet logged in");
                self.userLoggedIn = ko.observable(false);
                self.userLoggedIn.subscribe(function (newValue) {
                    if (newValue) {
                        $("#navigation").show();
                    } else {
                        $("#navigation").hide();
                    }
                });
                // self.userLoggedIn(true);
                self.menuItemAction = function (event) {
                    var selectedMenuOption = event.path[0].id
                    console.log(selectedMenuOption);
                    if (selectedMenuOption === "sign") {
                        if (!self.userLoggedIn()) {
                            // navigate to the module that allows us to sign in
                            oj.Router.rootInstance.go('login');
                        } else {
                            // sign off
                            self.userLogin("Not yet logged in");
                            self.userLoggedIn(false);
                            oj.Router.rootInstance.go('login');
                        }
                    }
                };
                self.userLogin.subscribe(function () {
                    var navData2 = JSON.parse(JSON.stringify(navData));
                    if (!commonUtil.isAdmin()) {
                        navData2.splice(2, 1);
                    }
                    self.navDataSource(new oj.ArrayTableDataSource(navData2, {idAttribute: 'id'}));

                });


            }

            return new ControllerViewModel();
        }
);
