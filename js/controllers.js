angular.module('starter')

    .controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
        $scope.username = AuthService.username();

        $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
            var alertPopup = $ionicPopup.alert({
                title: 'Unauthorized!',
                template: 'You are not allowed to access this resource.'
            });
        });

        $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
            AuthService.logout();
            $state.go('login');
            var alertPopup = $ionicPopup.alert({
                title: 'Session Lost!',
                template: 'Sorry, You have to login again.'
            });
        });

        $scope.setCurrentUsername = function(name) {
            $scope.username = name;
        };
    })

    .controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService) {
        $scope.data = {
            hostname: window.location.hostname,
            username: 'nicolae',
            password: 'qwe123'
        };

        $scope.login = function(data) {
            AuthService.login(data.hostname, data.username, data.password)
                .then(function(response) {
                    if (!response.data.token) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login failed!',
                            template: 'Please check your credentials!'
                        });
                    } else {
                        $state.go('main.dash', {}, {reload: true});
                        $scope.setCurrentUsername(data.username);
                    }

            }, function(err) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please check your credentials!'
                });
            });
        };
    })

    .controller('DashCtrl', function($scope, $state, $http, $ionicPopup, $localstorage, AuthService) {
        $scope.logout = function() {
            AuthService.logout();
            $state.go('login');
        };

        var settings = $localstorage.getObject('settings');
        var url = 'http://' + settings.hostname + '/api/log/search/action/test';

        console.log(settings);
        $scope.performValidRequest = function() {
            $http.get(url).then(
                function(result) {
                    $scope.response = result;
                });
        };

        $scope.performUnauthorizedRequest = function() {
            $http.get('http://localhost:8100/notauthorized').then(
                function(result) {
                    // No result here..
                }, function(err) {
                    $scope.response = err;
                });
        };

        $scope.performInvalidRequest = function() {
            $http.get('http://localhost:8100/notauthenticated').then(
                function(result) {
                    // No result here..
                }, function(err) {
                    $scope.response = err;
                });
        };
    })
    .controller('CommonCtrl', function($scope, $location, $http, $ionicSideMenuDelegate) {
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

        $scope.$on('$locationChangeStart', function (event, next, current) {
            $ionicSideMenuDelegate.toggleLeft(false);
            $ionicSideMenuDelegate.toggleRight(false);
            //
            //if ($location.path() !== '/settings' && !$scope.settings.authdata) {
            //    $location.path('/settings');
            //}
        });

        $scope.isActive = function(route) {
            return route === $location.path();
        };

        $scope.onRoute = function(route) {
            return route === $location.path();
        };

        $scope.getRoute = function () {
            return $location.path();
        };

        $scope.onDragLeft = function() {
            $ionicSideMenuDelegate.toggleLeft(false);
            $ionicSideMenuDelegate.canDragContent(false);
        };
        $scope.onDragRight = function() {
            $ionicSideMenuDelegate.canDragContent(true);
        };
    })

    .controller('MessagesCtrl',
        function($scope,
                 $location,
                 $window,
                 $ionicPopup,
                 $localstorage,
                 $ionicSideMenuDelegate,
                 $ionicScrollDelegate,
                 $ionicActionSheet,
                 Messages,
                 SearchCriteria
        ) {

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
                $scope.info = $scope.Messages.count() + ' / ' + $scope.Messages.getLastCount();

                $scope.$broadcast('scroll.refreshComplete');
            });

        };


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

    .controller('MessageDetailCtrl', function($scope, $stateParams, $ionicPopup, $window, $location, Messages, SearchCriteria) {
        $scope.message = null;

        $scope.showRaw = false;
        $scope.toggleRaw = function() {
            $scope.showRaw = !$scope.showRaw;
        };

        Messages.setDirection('/' + $stateParams.direction);

        Messages.get($stateParams.messageId).then(function() {
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

;
