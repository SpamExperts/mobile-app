angular.module('SpamExpertsApp')
    .controller('IncomingMessagesCtrl', ['$scope', '$controller', 'MessagesService', 'SearchCriteriaService', 'GROUPS',
        function($scope, $controller, MessagesService, SearchCriteriaService, GROUPS) {
            console.log('IncomingMessagesCtrl');

            $controller('CommonMessagesCtrl', {
                $scope: $scope,
                messagesService: new MessagesService({
                    direction: GROUPS.incoming,
                    last_count: 0,
                    messages: []
                }),
                criteriaService: new SearchCriteriaService({
                    direction: GROUPS.incoming,
                    searchCriteria: {}
                })
            });

        }
    ]);

angular.module('SpamExpertsApp')
    .controller('OutgoingMessagesCtrl', ['$scope', '$controller', 'MessagesService', 'SearchCriteriaService', 'GROUPS',
        function($scope, $controller, MessagesService, SearchCriteriaService, GROUPS) {
            console.log('OutgoingMessagesCtrl');

            $controller('CommonMessagesCtrl', {
                $scope: $scope,
                messagesService: new MessagesService({
                    direction: GROUPS.outgoing,
                    last_count: 0,
                    messages: []
                }),
                criteriaService: new SearchCriteriaService({
                    direction: GROUPS.outgoing,
                    searchCriteria: {}
                })
            });

        }
    ]);

angular.module('SpamExpertsApp')
    .controller('CommonMessagesCtrl', ['$scope', '$state', '$ionicPopup', '$ionicActionSheet', 'messagesService', 'criteriaService', 'BULK_ACTIONS',
        function($scope, $state, $ionicPopup, $ionicActionSheet, messagesService, criteriaService, BULK_ACTIONS) {

            $scope.info = {
                count: 0,
                lastCount: 0
            };

            $scope.noMoreItemsAvailable = false;

            $scope.loadingEntries = false;

            $scope.$on('refreshEntries', function () {
                messagesService.wipe();
                $scope.messageEntries = messagesService.getMessages();
                $scope.noMoreItemsAvailable = false;
            });

            $scope.doRefresh = function() {
                $scope.loadingEntries = true;

                var criteria = criteriaService.getSearchCriteria();

                criteria.until = criteriaService.getDate();
                criteria.refresh = true;
                criteria.last_count = messagesService.getLastCount();

                messagesService.fetch(criteria)
                    .then(function () {
                        $scope.messageEntries = messagesService.getMessages();

                        $scope.info.count = messagesService.count();
                        $scope.info.lastCount = messagesService.getLastCount();

                        $scope.loadingEntries = false;
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            };

            $scope.loadMoreData = function() {
                $scope.loadingEntries = true;

                var criteria = criteriaService.getSearchCriteria();

                criteria.refresh = false;
                criteria.offset = messagesService.count();

                messagesService.fetch(criteria)
                    .then(function () {
                        var count = messagesService.count();
                        var lastCount = messagesService.getLastCount();
                        $scope.messageEntries = messagesService.getMessages();

                        $scope.info.count = count;
                        $scope.info.lastCount = lastCount;

                        if (count == lastCount) {
                            $scope.noMoreItemsAvailable = true;
                        }

                        $scope.loadingEntries = false;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
            };

            $scope.openMessage = function(message) {
                $state.go('main.message-detail', {
                    message: message,
                    previousState: {
                        group: $state.current.group,
                        state: $state.current.name
                    }
                });
            };

            $scope.bulkMode = false;
            $scope.selectedAll = false;

            $scope.selectEntry = function(index) {
                messagesService.selectMessage(index);
                $scope.selectedAll = messagesService.allSelected();
                $scope.bulkMode = messagesService.isBulkMode();
            };
            $scope.selectAll = function (toggle) {
                $scope.selectedAll = toggle;
                messagesService.selectAll($scope.selectedAll);
                $scope.bulkMode = messagesService.isBulkMode();
            };

            $scope.showBulkActions = function () {
                var actionSheet = $ionicActionSheet.show({
                    buttons: BULK_ACTIONS.logSearch,
                    titleText: 'Select Actions',
                    cancelText: 'Cancel',
                    cancel: function() {
                        actionSheet();
                    },
                    buttonClicked: function(i, action) {
                        $ionicPopup
                            .confirm({
                                title: 'Confirm action',
                                template: action.confirmText
                            })
                            .then(function(res) {
                                if (res) {
                                    messagesService
                                        .bulkAction(action.name)
                                        .then(function () {
                                            $state.go($state.current, {}, {reload: true});
                                            $scope.$broadcast('refreshEntries');
                                            $scope.bulkMode = false;
                                        });
                                }
                            });
                        return true;
                    }
                })
            };

            $scope.purgeQuarantine = function () {
                $ionicPopup
                    .confirm({
                        title: 'Confirm action',
                        template: 'Are you sure you want to purge the entire %s quarantine?'.printf(messagesService.getDirection())
                    })
                    .then(function(res) {
                        if (res) {
                            messagesService
                                .bulkAction('purge')
                                .then(function () {
                                    $state.go($state.current, {}, {reload: true});
                                    $scope.$broadcast('refreshEntries');
                                    $scope.bulkMode = false;
                                });
                        }
                    });
            }

        }
    ])

    .controller('MessageDetailCtrl', ['$rootScope', '$scope', '$state', '$timeout', '$ionicActionSheet', '$ionicPopup', 'MessagesService', 'BULK_ACTIONS',
        function($rootScope, $scope, $state, $timeout, $ionicActionSheet, $ionicPopup, MessagesService, BULK_ACTIONS) {

            if (isEmpty($state.params.message)) {
                $state.go('main.dash', {}, {reload: true});
                return;
            }

            var messageService = new MessagesService({
                direction: $state.params.previousState.group,
                messageParts: {}
            });

            $scope.message = {};
            $scope.bulkActions = BULK_ACTIONS.logSearch;

            $scope.showRaw = false;

            $scope.toggleRaw = function() {
                $scope.showRaw = !$scope.showRaw;
            };

            messageService.viewMessage($state.params.message).then(function() {
                $scope.message = messageService.getMessageParts();
            });

            $scope.showBulkActions = function () {
                var actionSheet = $ionicActionSheet.show({
                    buttons: BULK_ACTIONS.logSearch,
                    titleText: 'Select Actions',
                    cancelText: 'Cancel',
                    cancel: function() {
                        actionSheet();
                    },
                    buttonClicked: function(i, action) {
                        $ionicPopup
                            .confirm({
                                title: 'Confirm action',
                                template: action.confirmText
                            })
                            .then(function(res) {
                                if (res) {
                                    messageService
                                        .bulkAction(action.name)
                                        .then(function () {
                                            $state.go($state.params.previousState.state, {}, {reload: true});
                                            $timeout(function() {
                                                $rootScope.$broadcast('refreshEntries');
                                            });
                                        });
                                }
                            });
                        return true;
                    }
                })
            };

        }
    ]);