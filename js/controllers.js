angular.module('starter.controllers', ['ionic.utils'])

    .controller('CommonCtrl', function($scope, $location, $http, $ionicSideMenuDelegate, Settings, Messages) {
        $scope.items = [
            {
                title: 'Incoming',
                icon: 'ion-log-in',
                route: '/incoming',
                view: 'messages'
            },
            {
                title: 'Outgoing',
                icon: 'ion-log-out',
                route: '/outgoing',
                view: 'outgoing'
            },
            {
                title: 'Settings',
                icon: 'ion-ios-gear-outline',
                route: '/settings',
                view: 'settings'
            }
        ];

        $ionicSideMenuDelegate.toggleLeft(false);
        $ionicSideMenuDelegate.toggleRight(false);

        //console.log('toggleRight');
        $scope.settings = Settings.getSettings() || {};
        if ($scope.settings.authdata) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $scope.settings.authdata;
        } else {
            $location.path('/settings');
        }

        $scope.$on('$locationChangeStart', function (event, next, current) {
            $ionicSideMenuDelegate.toggleLeft(false);
            $ionicSideMenuDelegate.toggleRight(false);
            //
            //console.log(next);
            //console.log(current);

            //if (( next.endsWith('/outgoing') && current.endsWith('/messages'))
            //    || ( next.endsWith('/messages') && current.endsWith('/outgoing') ) ) {
            //if ( next.endsWith('/outgoing') || next.endsWith('/messages') ) {
            //    console.log(next);
            //    Messages.wipe();
            //}

            if ($location.path() !== '/settings' && !$scope.settings.authdata) {
                $location.path('/settings');
            }
            //$ionicSideMenuDelegate.toggleLeft(true);
        });

        $scope.isActive = function(route) {
            return route === $location.path();
        };

        $scope.onRoute = function(route) {
            //console.log($location.path());
            return route === $location.path();
        };

        $scope.getRoute = function () {
            return $location.path();
        };

        //console.log('common');
        $scope.onDragLeft = function() {
            //console.log('drag left');
            //if($location.path() !== '/messages' && !$ionicSideMenuDelegate.isOpenLeft()) {
            //if($location.path() !== '/messages') {
            //    console.log('prevent drag');
                $ionicSideMenuDelegate.toggleLeft(false);
                $ionicSideMenuDelegate.canDragContent(false);
            //}
        };
        $scope.onDragRight = function() {
            $ionicSideMenuDelegate.canDragContent(true);
        };
    })

    .controller('DashboardCtrl', function($scope, $ionicSideMenuDelegate) {
        //console.log('dashboard');
        //$ionicSideMenuDelegate.$getByHandle('rightmenu-handler').canDragContent(false);
        //$ionicSideMenuDelegate.canDragContent(false);
    })

    .controller('MessagesCtrl', function($scope, $location, $window, $ionicPopup, $localstorage, $ionicSideMenuDelegate, $ionicScrollDelegate, $ionicActionSheet, Settings, Messages, SearchCriteria) {
        //$scope.lastCount = null;
        //$ionicSideMenuDelegate.$getByHandle('rightmenu-handler').canDragContent(true);
        //$ionicSideMenuDelegate.canDragContent(true);


        //console.log(Messages.messages());
        //console.log(Messages.moreDataCanBeLoaded());



        //$scope.$watch('Messages.messages', function(newValue, oldValue) {
        //    console.log('watch');
        //    if (newValue.length != oldValue.length) {
        //        console.log('force load');
        //        $scope.loadMoreData();
        //    }
        //});
        //
        //console.log($location.path());


        $scope.bulkSelect = false;

        $scope.info = '';
        $scope.selectedAll = false;

        $scope.Messages = Messages;
        $scope.Messages.setDirection($location.path());
        $scope.$on('$locationChangeSuccess', function () {
            $scope.Messages.setDirection($location.path());
        });

        $scope.searchCriteria = SearchCriteria.getSearchCriteria();
        if (angular.equals({}, $scope.searchCriteria)) {
            $scope.searchCriteria = SearchCriteria.getDefaultSearchCriteria();
            SearchCriteria.setSearchCriteria($scope.searchCriteria);
        }

        $scope.noMoreItemsAvailable = false;

        //console.log($scope.searchCriteria);
        //$scope.lastSearchCriteria = {};

        $scope.loadMoreData = function() {
            //console.log('loadMoreData');
            $scope.searchCriteria = SearchCriteria.getSearchCriteria();
            $scope.searchCriteria.refresh = false;
            SearchCriteria.setSearchCriteria($scope.searchCriteria);
            //console.log($scope.searchCriteria);
            $scope.Messages.fetch($scope.searchCriteria).then(function () {
                $scope.searchCriteria.offset = $scope.Messages.count();
                SearchCriteria.setSearchCriteria($scope.searchCriteria);
                $scope.info = $scope.Messages.count() + ' / ' + $scope.Messages.getLastCount();

                if ($scope.Messages.count() == $scope.Messages.getLastCount()) {
                    $scope.noMoreItemsAvailable = true;
                }

                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };

        $scope.doRefresh = function() {
            $scope.searchCriteria = SearchCriteria.getSearchCriteria();
            $scope.searchCriteria.until = SearchCriteria.getDate();
            $scope.searchCriteria.refresh = true;
            $scope.searchCriteria.last_count = $scope.Messages.getLastCount();
            SearchCriteria.setSearchCriteria($scope.searchCriteria);
            $scope.Messages.fetch($scope.searchCriteria).then(function () {
                $scope.searchCriteria.offset = $scope.Messages.count();
                SearchCriteria.setSearchCriteria($scope.searchCriteria);
                $scope.$broadcast('scroll.refreshComplete');
            });

        };

        //if ($scope.Messages.moreDataCanBeLoaded) {
        //    $scope.loadMoreData();
        //}


        $scope.bulkAction = function(action, messages) {

            var dialogText = '';
            switch (action) {
                case 'remove': dialogText = 'Are you sure you want to remove the selected messages?';break;
                case 'release': dialogText = 'Are you sure you want to release the selected messages?';break;
                case 'releaseandtrain': dialogText = 'Are you sure you want to release and train the selected messages?';break;
                default : dialogText =  'Are you sure you want to continue?';
            }
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm action',
                template: dialogText
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $scope.Messages.bulkAction(action, messages)
                        .then(function () {
                            $scope.searchCriteria = SearchCriteria.getSearchCriteria();
                            $scope.searchCriteria.offset = 0;
                            $scope.searchCriteria.refresh = false;
                            SearchCriteria.setSearchCriteria($scope.searchCriteria);
                            //console.log($scope.searchCriteria);
                            Messages.wipe();
                            //$location.path('/messages');
                            $window.location.reload();

                        });
                    console.log(action);
                } else {
                    console.log('canceled');
                }
            });
        };

        $scope.onHold = function(message) {
            message.isChecked = true;
            $scope.bulkSelect = true;
        };

        $scope.cancelSelection = function() {
            $scope.bulkSelect = false;
            $scope.Messages.toggleSelection(false);
        };

        $scope.showBulkActions = function () {
            var actions = ['release','releaseandtrain','remove'];

            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Release' },
                    { text: 'Release and train' },
                    { text: 'Remove' }
                ],
                titleText: 'Select Actions',
                cancelText: 'Cancel',
                cancel: function() {
                    hideSheet();
                },
                buttonClicked: function(index) {
                    var selectedMessages = [];
                    angular.forEach($scope.Messages.messages(), function(value, key) {
                        if (value.isChecked == true) {
                            this.push(value);
                        }
                    }, selectedMessages);
                    $scope.bulkAction(actions[index], selectedMessages);
                    return true;
                }
            })
        };

        $scope.toggleSelection = function () {
            $scope.selectedAll = !$scope.selectedAll;
            $scope.Messages.toggleSelection($scope.selectedAll);
        };

    })

    .controller('MessageDetailCtrl', function($scope, $stateParams, $ionicPopup, $window, $location, Settings, Messages, SearchCriteria) {
        $scope.message = null;

        var endpoint = Settings.getEndpoint();

        $scope.showRaw = false;
        $scope.toggleRaw = function() {
            $scope.showRaw = !$scope.showRaw;
        };

        Messages.setDirection('/' + $stateParams.direction);

        Messages.get(endpoint, $stateParams.messageId).then(function() {
            $scope.message = Messages.message();
        });

        $scope.bulkAction = function(action, messages) {

            var dialogText = '';
            switch (action) {
                case 'remove': dialogText = 'Are you sure you want to remove the selected messages?';break;
                case 'release': dialogText = 'Are you sure you want to release the selected messages?';break;
                case 'releaseandtrain': dialogText = 'Are you sure you want to release and train the selected messages?';break;
                default : dialogText =  'Are you sure you want to continue?';
            }
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm action',
                template: dialogText
            });
            confirmPopup.then(function(res) {
                if (res) {
                    Messages.bulkAction(action, messages)
                        .then(function () {
                            var searchCriteria = SearchCriteria.getSearchCriteria();
                            searchCriteria.offset = 0;
                            searchCriteria.refresh = false;
                            SearchCriteria.setSearchCriteria(searchCriteria);
                            //console.log($scope.searchCriteria);
                            Messages.wipe();
                            $location.path($stateParams.direction);
                            $window.location.reload();

                        });
                    console.log(action);
                } else {
                    console.log('canceled');
                }
            });
        };

    })
    .controller('SearchCriteriaCtrl', function($scope, $window, Messages, SearchCriteria) {

        $scope.searchCriteria = SearchCriteria.getSearchCriteria();
        $scope.Messages = Messages;

        if (angular.equals({}, $scope.searchCriteria)) {
            $scope.searchCriteria = SearchCriteria.getDefaultSearchCriteria();
            SearchCriteria.setSearchCriteria($scope.searchCriteria);
        }

        $scope.doSearch = function() {
            $scope.searchCriteria.offset = 0;
            $scope.searchCriteria.refresh = false;
            SearchCriteria.setSearchCriteria($scope.searchCriteria);
            //console.log($scope.searchCriteria);
            Messages.wipe();
            //$location.path('/messages');
            $window.location.reload();
        };

        $scope.doReset = function() {
            $scope.searchCriteria = SearchCriteria.getDefaultSearchCriteria();
            $scope.searchCriteria.offset = 0;
            $scope.searchCriteria.refresh = false;
            SearchCriteria.setSearchCriteria($scope.searchCriteria);
            //console.log($scope.searchCriteria);
            Messages.wipe();
            //$location.path('/messages');
            $window.location.reload();
        };

    })

    .controller('SettingsCtrl', function($scope, $location, Settings) {
        //console.log('settingsctrl');
        $scope.settings = Settings.getSettings() || {};

        var returnTo = '/incoming';

        $scope.saveSettings = function() {
            //$localstorage.setObject('settings', $scope.settings);
            Settings.saveSettings($scope.settings);
            $scope.settings = Settings.getSettings() || {};
            $location.path(returnTo);
        };
    });
