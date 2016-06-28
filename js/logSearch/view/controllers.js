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
    .controller('CommonMessagesCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'uiService', 'MessageQueue', 'messagesService', 'criteriaService', 'ActionManager',
        function($rootScope, $scope, $state, $timeout, uiService, MessageQueue, messagesService, criteriaService, ActionManager) {

            $scope.info = {
                count: 0,
                lastCount: 0
            };

            $scope.noMoreItemsAvailable = false;

            $scope.loadingEntries = false;

            $scope.$on('refreshEntries', function () {
                messagesService.wipe();

                $scope.noMoreItemsAvailable = false;
                $scope.loadingEntries = false;
                $rootScope.bulkMode = false;

                $scope.messageEntries = messagesService.getMessages();

                var count = messagesService.count();
                var lastCount = messagesService.getLastCount();

                $scope.info.count = uiService.kConvert(count);
                $scope.info.lastCount = uiService.kConvert(lastCount);

                $timeout(function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    uiService.scrollDelegate.resize();
                });

            });

            function handleScroll(criteria, type) {
                messagesService.fetch(criteria)
                    .then(function () {
                        var count = messagesService.count();
                        var lastCount = messagesService.getLastCount();
                        $scope.messageEntries = messagesService.getMessages();

                        $scope.info.count = uiService.kConvert(count);
                        $scope.info.lastCount = uiService.kConvert(lastCount);

                        if (count == lastCount) {
                            $scope.noMoreItemsAvailable = true;
                        }

                        $scope.loadingEntries = false;

                        if (type == 'infinite') {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        } else {
                            $scope.$broadcast('scroll.refreshComplete');
                        }
                    })
                    .catch(function (request) {
                        if (type == 'infinite') {
                            if (request.config.wasCanceled !== true) {
                                $scope.noMoreItemsAvailable = true;
                                $scope.loadingEntries = false;
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            }

                        } else {
                            $scope.noMoreItemsAvailable = true;
                            $scope.loadingEntries = false;

                            $scope.$broadcast('scroll.refreshComplete');
                        }
                    });
            }

            $scope.refreshList = function () {
                $scope.$broadcast('refreshEntries');
            };

            $scope.pullToRefresh = function() {

                if ($scope.loadingEntries === true) {
                    uiService.scrollDelegate.resize();
                    return;
                }

                $scope.loadingEntries = true;

                var criteria = criteriaService.getSearchCriteria(true);
                criteria.until = criteriaService.getCurrentDate(true);

                criteria.refresh = true;
                criteria.last_count = messagesService.getLastCount();

                $scope.noMoreItemsAvailable = false;

                $rootScope.$broadcast('updateToNow');

                handleScroll(criteria, 'refresh');
            };

            $scope.infiniteScroll = function() {
                $scope.loadingEntries = true;

                var criteria = criteriaService.getSearchCriteria(true);

                criteria.refresh = false;
                criteria.offset = messagesService.count();

                handleScroll(criteria, 'infinite');
            };


            var actionManager = new ActionManager();

            var barActions = actionManager.getActions('bar');
            var availableActions = actionManager.getActions('actionSheet');
            var tapAction = actionManager.getActions('tapAction');

            $rootScope.bulkMode = false;
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
                    $rootScope.bulkMode = messagesService.isBulkMode();
                } else {
                    actionManager.noAvailableAction();
                }
            };

            $scope.selectAll = function (toggle) {
                messagesService.selectAll(toggle);
                $scope.selectedCount = messagesService.countSelected();
                $rootScope.bulkMode = messagesService.isBulkMode();
            };

            $scope.processAction = function (action, $event) {
                actionManager.processAction(

                    isEmpty(action)
                        ? {actions: availableActions, scope: $scope, event: $event}
                        : action
                    ,
                    function (action) {
                        messagesService
                            .bulkAction(action.name)
                            .then(function () {
                                $timeout(function() {
                                    $scope.$broadcast('refreshEntries');
                                });
                                $rootScope.bulkMode = false;
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
                messageService.clearMessageParts();
                $state.go($state.params.previousState.state);
            };

            messageService.viewMessage(message).then(function() {
                $scope.message = messageService.getMessageParts();
            });

            var actionManager = new ActionManager($state.params.previousState.group);
            $scope.barActions = actionManager.getActions('bar');

            var availableActions = actionManager.getActions('actionSheet');

            $scope.hasActions = !isEmpty(availableActions);

            $scope.processAction = function (action, $event) {
                actionManager.processAction(

                    isEmpty(action)
                        ? {actions: availableActions, scope: $scope, event: $event}
                        : action,

                    function (action) {
                        messageService
                            .bulkAction(action.name, message)
                            .then(function () {
                                $state.go($state.params.previousState.state, {keepMessageQueue: true}, {reload: true});
                                $timeout(function() {
                                    $rootScope.$broadcast('refreshEntries');
                                });
                                $rootScope.bulkMode = false;
                            });
                    }
                );
            };

        }
    ]);