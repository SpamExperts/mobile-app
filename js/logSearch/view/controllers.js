SpamExpertsApp
    .controller('MessagesCtrl',
        function($scope, $state, $ionicPopup, $ionicActionSheet, Messages, SearchCriteriaService) {

            $scope.bulkSelect = false;

            $scope.info = '';
            $scope.selectedAll = false;

            $scope.noMoreItemsAvailable = false;

            var init = function (next) {
                Messages.setDirection(next);
                SearchCriteriaService.setDirection(next);

                $scope.messageEntries = Messages.getMessages();
            };

            init($state.current.group);

            //$scope.$on('$stateChangeSuccess', function (event,next, nextParams, fromState) {
            //    init(next.group);
            //});

            $scope.$on('entriesWipe', function (event,next, nextParams, fromState) {
                $scope.noMoreItemsAvailable = false;
                Messages.wipe();
                $scope.messageEntries = Messages.getMessages();
            });

            $scope.loadMoreData = function() {
                var criteria = SearchCriteriaService.getSearchCriteria();
                if (typeof criteria === 'undefined') return;

                criteria.refresh = false;
                criteria.offset = Messages.count();

                Messages.fetch(criteria)
                    .then(function () {
                        var count = Messages.count();
                        var lastCount = Messages.getLastCount();
                        $scope.messageEntries = Messages.getMessages();

                        $scope.info = count + ' / ' +lastCount;

                        if (count == lastCount) {
                            $scope.noMoreItemsAvailable = true;
                        }

                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
            };

            $scope.doRefresh = function() {
                var criteria = SearchCriteriaService.getSearchCriteria();

                if (typeof criteria === 'undefined') return;

                criteria.until = SearchCriteriaService.getDate();
                criteria.refresh = true;
                criteria.last_count = Messages.getLastCount();

                Messages.fetch(criteria)
                    .then(function () {
                        $scope.messageEntries = Messages.getMessages();

                        $scope.info = Messages.count() + ' / ' + Messages.getLastCount();

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
                        Messages.bulkAction(action, messages)
                            .then(function () {
                                $rootScope.$broadcast('entriesWipe');
                                $state.go($state.current, {}, {reload: true});
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
                Messages.toggleSelection(false);
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
                        angular.forEach($scope.messageEntries, function(value, key) {
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
                Messages.toggleSelection($scope.selectedAll);
            };

        })

    .controller('MessageDetailCtrl', function($scope, $rootScope, $state, $stateParams, $ionicPopup, Messages) {
        $scope.message = {};

        $scope.showRaw = false;
        $scope.toggleRaw = function() {
            $scope.showRaw = !$scope.showRaw;
        };

        Messages.getDirection($stateParams.direction);
        //Messages.setDirection($stateParams.direction);
        //
        //Messages.get($stateParams['messageId']).then(function() {
        //    $scope.message = Messages.message();
        //});


        //
        //var previousState = '';
        //
        //$rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
        //    //save the previous state in a rootScope variable so that it's accessible from everywhere
        //    previousState = from;
        //
        //    if (!Messages.count()) {
        //        $scope.go(previousState);
        //    }
        //
        //});

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
                            $rootScope.$broadcast('entriesWipe');
                            $scope.go(previousState);
                        });
                    console.log(action);
                } else {
                    console.log('canceled');
                }
            });
        };

    })
;