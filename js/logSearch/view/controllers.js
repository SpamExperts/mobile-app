angular.module('SpamExpertsApp')
    .controller('IncomingMessagesCtrl', ['$scope', '$controller', 'MessagesService', 'SearchCriteriaService', 'GROUPS',
        function($scope, $controller, MessagesService, SearchCriteriaService, GROUPS) {
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
    .controller('CommonMessagesCtrl', ['$scope', '$state', '$timeout', '$ionicScrollDelegate', 'MessageQueue', 'messagesService', 'criteriaService', 'ActionManager',
        function($scope, $state, $timeout, $ionicScrollDelegate, MessageQueue, messagesService, criteriaService, ActionManager) {

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
                $scope.bulkMode = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $ionicScrollDelegate.resize();
            });

            $scope.doRefresh = function() {

                if ($scope.loadingEntries === true) {
                    $ionicScrollDelegate.resize();
                    return;
                }

                $scope.loadingEntries = true;

                var criteria = criteriaService.getSearchCriteria(true);

                criteria.until = criteriaService.getCurrentDate(true);
                criteria.refresh = true;
                criteria.last_count = messagesService.getLastCount();

                messagesService.fetch(criteria)
                    .then(function () {
                        $scope.messageEntries = messagesService.getMessages();

                        $scope.info.count = messagesService.count();
                        $scope.info.lastCount = messagesService.getLastCount();

                        $scope.loadingEntries = false;
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                    .catch(function () {
                        $scope.noMoreItemsAvailable = true;
                        $scope.loadingEntries = false;
                        $scope.$broadcast('scroll.refreshComplete');
                    });

            };

            $scope.loadMoreData = function() {
                $scope.loadingEntries = true;

                var criteria = criteriaService.getSearchCriteria(true);

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
                    })
                    .catch(function () {
                        $scope.noMoreItemsAvailable = true;
                        $scope.loadingEntries = false;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
            };

            var actionManager = new ActionManager();

            var barActions = actionManager.getActions('bar');
            var availableActions = actionManager.getActions('actionSheet');
            var tapAction = actionManager.getActions('tapAction');

            $scope.bulkMode = false;
            $scope.selectedCount = messagesService.countSelected();
            $scope.barActions = barActions;

            $scope.openMessage = function(message) {
                if (!isEmpty(tapAction)) {
                    $state.go('main.message-detail', {
                        message: message,
                        previousState: {
                            group: $state.current.data.group,
                            state: $state.current.data.state
                        }
                    }, {reload: true});
                } else {
                    actionManager.noViewAction();
                }
            };

            $scope.selectEntry = function(index) {
                if (!isEmpty(barActions) || !isEmpty(availableActions)) {
                    messagesService.selectMessage(index);
                    $scope.selectedCount = messagesService.countSelected();
                    $scope.bulkMode = messagesService.isBulkMode();
                } else {
                    actionManager.noAvailableAction();
                }
            };

            $scope.selectAll = function (toggle) {
                messagesService.selectAll(toggle);
                $scope.selectedCount = messagesService.countSelected();
                $scope.bulkMode = messagesService.isBulkMode();
            };

            $scope.processAction = function (action) {
                actionManager.processAction(
                    (isEmpty(action) ? availableActions : action),
                    function (action) {
                        messagesService
                            .bulkAction(action.name)
                            .then(function () {
                                $timeout(function() {
                                    $scope.$broadcast('refreshEntries');
                                });
                                $scope.bulkMode = false;
                            });
                    }
                );
            };

        }
    ])

    .controller('MessageDetailCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'MessageQueue', 'MessagesService', 'ActionManager',
        function($rootScope, $scope, $state, $timeout, MessageQueue, MessagesService, ActionManager) {

            var message = angular.copy($state.params.message);
            if (isEmpty(message)) {
                $state.go('main.dash', {}, {reload: true});
                return;
            }

            var messageService = new MessagesService({
                direction: $state.params.previousState.group,
                messageParts: {}
            });

            $scope.message = message;

            $scope.showRaw = false;

            $scope.toggleRaw = function() {
                $scope.showRaw = !$scope.showRaw;
            };

            $scope.back = function () {
                $state.go($state.params.previousState.state);
            };

            messageService.viewMessage(message).then(function() {
                $scope.message = messageService.getMessageParts();
            });

            var actionManager = new ActionManager($state.params.previousState.group);
            var availableActions = actionManager.getActions('actionSheet');

            $scope.hasActions = !isEmpty(availableActions);

            $scope.processAction = function () {
                actionManager.processAction(
                    availableActions,
                    function (action) {
                        messageService
                            .bulkAction(action.name, message)
                            .then(function () {
                                $state.go($state.params.previousState.state, {keepMessageQueue: true}, {reload: true});
                                $timeout(function() {
                                    $rootScope.$broadcast('refreshEntries');
                                });
                            });
                    }
                );
            };

        }
    ]);