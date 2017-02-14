angular.module('SpamExpertsApp')

    // IncomingMessagesCtrl controller extends CommonMessagesCtrl
    .controller('IncomingMessagesCtrl', ['$scope', '$controller', 'MessagesService', 'SearchCriteriaService', 'GROUPS',
        function($scope, $controller, MessagesService, SearchCriteriaService, GROUPS) {
            $controller('CommonMessagesCtrl', {
                $scope: $scope,
                messagesService: new MessagesService({
                    direction: GROUPS.incoming,
                    firstPage: 0,
                    currentPage: 0,
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

    // OutgoingMessagesCtrl controller extends CommonMessagesCtrl
    .controller('OutgoingMessagesCtrl', ['$scope', '$controller', 'MessagesService', 'SearchCriteriaService', 'GROUPS',
        function($scope, $controller, MessagesService, SearchCriteriaService, GROUPS) {
            $controller('CommonMessagesCtrl', {
                $scope: $scope,
                messagesService: new MessagesService({
                    direction: GROUPS.outgoing,
                    firstPage: 0,
                    currentPage: 0,
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
    .controller('CommonMessagesCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'uiService', 'MessageQueue', 'messagesService', 'criteriaService', 'ActionManager', 'USER_ROLES',
        function($rootScope, $scope, $state, $timeout, uiService, MessageQueue, messagesService, criteriaService, ActionManager, USER_ROLES) {

            $scope.info = {
                count: 0,
                direction: messagesService.getDirection().capitalize()
            };

            // we should try load results with a small delay to prevent freezing the dashboard
            $scope.noMoreItemsAvailable = true;
            $timeout(function () {
                $scope.noMoreItemsAvailable = false;
                $rootScope.forceScrollUpdate(0);
            }, 10);

            $scope.loadingEntries = false;

            function setTopBar() {
                var criteria = criteriaService.getSearchCriteria(true);
                $scope.fromDate = criteria.since;
                $scope.toDate = criteria.until;

                $scope.searchDomain = $rootScope.role == USER_ROLES.admin
                    ? criteria.domain
                    : $rootScope.username;
            }

            setTopBar();

            // getting the list of messages again after performing a BULK_ACTION
            $scope.$on('refreshEntries', function () {
                messagesService.wipe();

                $scope.noMoreItemsAvailable = false;
                $scope.loadingEntries = false;
                $rootScope.bulkMode = false;

                $scope.messageEntries = messagesService.getMessages();

                var count = messagesService.count();
                $scope.info.count = uiService.kConvert(count);

                $timeout(function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $rootScope.forceScrollUpdate(0);
                });
                setTopBar();
            });

            // common function for handling infinite-scroll and pull-to-refresh
            function handleScroll(criteria, type) {
                messagesService.fetch(criteria)
                    .then(function () {
                        var count = messagesService.count();
                        var lastCount = messagesService.getLastCount();

                        // get the messages
                        $scope.messageEntries = messagesService.getMessages();

                        // update count and last count
                        $scope.info.count = uiService.kConvert(count);

                        // we shouldn't load more than the maximum count
                        // count >= lasCount as an extra protection but it should never be the case
                        // messagesService.getCurrentPage() ==1 means we are on the last page of infinite scrolling
                        if (
                            count >= lastCount ||
                            messagesService.getCurrentPage() == 1
                        ) {
                            $scope.noMoreItemsAvailable = true;
                        }

                        $scope.loadingEntries = false;

                        // broadcast the proper event
                        if (type == 'infinite') {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        } else {
                            $scope.$broadcast('scroll.refreshComplete');
                        }
                    })
                    .catch(function (request) {
                        if (type == 'infinite') {

                            // we should allow loading if the request was actually canceled
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

            $scope.pullToRefresh = function() {

                if ($scope.loadingEntries === true) {
                    $rootScope.forceScrollUpdate(0);
                    return;
                }

                $scope.loadingEntries = true;

                // get the criteria and set up parameters required for pull-to-refresh
                var criteria = criteriaService.getSearchCriteria(true);
                criteria.until = criteriaService.getCurrentDate(true);

                criteria.refresh = true;

                $scope.noMoreItemsAvailable = false;

                // we should update the date in the right-side-menu
                $rootScope.$broadcast('updateToNow');

                setTopBar();
                handleScroll(criteria, 'refresh');
            };

            $scope.infiniteScroll = function() {
                $scope.loadingEntries = true;

                // get the criteria and set up parameters for infinite-scroll
                var criteria = criteriaService.getSearchCriteria(true);

                criteria.refresh = false;
                criteria.current_page = messagesService.getCurrentPage();

                handleScroll(criteria, 'infinite');
            };

            // process BULK_ACTIONS
            var actionManager = new ActionManager();

            var barActions = actionManager.getActions('bar');
            var availableActions = actionManager.getActions('actionSheet');
            var tapAction = actionManager.getActions('tapAction');

            // bulk mode descriptor
            $rootScope.bulkMode = false;

            $scope.selectedCount = messagesService.countSelected();
            $scope.barActions = barActions;

            // handle message preview
            $scope.openMessage = function(message) {
                if (!isEmpty(tapAction)) {
                    $state.go('main.message-detail', {
                        message: message,
                        previousState: {
                            group: $state.current.data.group,
                            state: $state.current.data.state,
                            searchDomain: $scope.searchDomain
                        }
                    }, {reload: true});
                } else {
                    actionManager.noViewAction();
                    $rootScope.scrollTop();
                }
            };

            // handle selection on message entries
            $scope.selectEntry = function(index, directToggle) {
                if (!isEmpty(barActions) || !isEmpty(availableActions)) {
                    messagesService.selectMessage(index, directToggle);
                    $scope.selectedCount = uiService.kConvert(messagesService.countSelected());
                    $rootScope.bulkMode = messagesService.isBulkMode();
                    $rootScope.forceScrollUpdate(150);
                } else {
                    $scope.messageEntries[index].isChecked = false;
                    actionManager.noAvailableAction();
                    $rootScope.scrollTop();
                }
            };

            // handle the selection of all messages
            $scope.toggleBulkSelect = function (force) {
                var toogle = angular.isUndefined(force)
                    ? $scope.info.count != $scope.selectedCount
                    : force;

                messagesService.selectAll(toogle);
                $scope.selectedCount =  uiService.kConvert(messagesService.countSelected());
                $rootScope.bulkMode = messagesService.isBulkMode();
                $rootScope.forceScrollUpdate(150);
            };

            // handle clicking on BULK_ACTIONS
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

    .controller('MessageDetailCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'MessageQueue', 'MessagesService', 'ActionManager', 'uiService',
        function($rootScope, $scope, $state, $timeout, MessageQueue, MessagesService, ActionManager, uiService) {

            var message = angular.copy($state.params.message);

            // We can not stay on a message preview if no messages have been
            // previously loaded since we can't know what to request
            if (isEmpty(message)) {
                $state.go('main.dash', {}, {reload: true});
                return;
            }

            var messageService = new MessagesService({
                direction: $state.params.previousState.group,
                messageParts: {}
            });

            $scope.searchDomain = $state.params.previousState.searchDomain;
            $scope.message = message;

            $scope.isCurrentViewAvailable = function() {
                return $scope.isLoading === false &&
                    $scope.message.details &&
                    $scope.message.details[$scope.selectedTab];
            };

            $scope.isActiveTab = function (tab) {
                return !$scope.isLoading && !$scope.errorDisplay && $scope.selectedTab == tab;
            };

            $scope.showTab = function (tab) {
                if ($scope.selectedTab == tab) return;

                $scope.selectedTab = tab;
                $scope.errorDisplay = false;

                if (!$scope.message.details ||
                    ($scope.message.details && !$scope.message.details.hasOwnProperty(tab))
                ) {
                    $scope.isLoading = true;

                    // retrieve the entire mail parts
                    messageService.viewMessage(message, tab)
                        .then(function() {
                            $scope.message = messageService.getMessageParts();
                            $scope.isLoading = false;
                        })
                        .catch(function (request) {
                            if (request.config.wasCanceled !== true) {
                                $scope.errorDisplay = true;
                            }
                            $scope.isLoading = false;
                        });
                }
            };

            $scope.showTab('viewPlain');

            // handle back button, see message-detail.html
            $scope.back = function ($event) {
                if ($event) $event.stopPropagation();
                messageService.clearMessageParts();
                $state.go($state.params.previousState.state);
            };

            $scope.showRecipientsPopup = function ($event) {
                uiService.tooltip().show(
                    $scope.message.details['meta_data']['to'],
                    $event
                );
            };

            $scope.showAttachmentsPopup = function ($event) {
                uiService.tooltip()
                    .click(function () {
                        MessageQueue.set({
                            info: ['The message has these potentially unsafe attachments.<br> For your safety, you can not download them']
                        });
                    })
                    .onHide(function () {
                        MessageQueue.clearInfo();
                    })
                    .show(
                        $scope.message.details['attachments'],
                        $event
                    );
            };

            // process the actions available for the message
            var actionManager = new ActionManager($state.params.previousState.group);
            $scope.barActions = actionManager.getActions('bar');

            var availableActions = actionManager.getActions('actionSheet');
            availableActions.pop(); // bad fix don't display purge quarantine

            $scope.hasActions = !isEmpty(availableActions);

            // handle clicking on BULK_ACTIONS
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