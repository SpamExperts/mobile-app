SpamExpertsApp
    .controller('IncomingMessagesCtrl', function($scope, $controller, MessagesService, SearchCriteriaService, GROUPS) {
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

    });

SpamExpertsApp
    .controller('OutgoingMessagesCtrl', function($scope, $controller, MessagesService, SearchCriteriaService, GROUPS) {
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

    });

SpamExpertsApp
    .controller('CommonMessagesCtrl',
        function($rootScope, $scope, $state, messagesService, criteriaService, BULK_ACTIONS) {

            $rootScope.bulkManager = {
                service: messagesService,
                actions: BULK_ACTIONS.logSearch
            };

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

        })

    .controller('MessageDetailCtrl', function($rootScope, $scope, $state, $timeout, $ionicPopup, MessagesService, BULK_ACTIONS) {

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

        $scope.confirmAction = function (action) {
            $ionicPopup
                .confirm({
                    title: 'Confirm action',
                    template: action.confirmText
                })
                .then(function(res) {
                    if (res) {
                        $scope.bulkManager.service
                            .bulkAction(action.name, $scope.message)
                            .then(function () {
                                $state.go($state.params.previousState.state, {}, {reload: true});
                                $timeout(function() {
                                    $rootScope.$broadcast('refreshEntries');
                                });
                            });
                    }
                });
        };

    });