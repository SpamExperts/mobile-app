angular.module('SpamExpertsApp')
    .factory('MessagesService', ['Api',
        function(Api) {

            /** @var modelData = {direction: direction, last_count: last_count, messages: [], message: {}}; */
            function MessagesService(modelData) {
                this.messages = [];
                this.last_count = 0;
                this.direction = null;
                this.messageParts = {};
                this.selected = 0;

                if (!isEmpty(modelData)) {
                    this.construct(modelData);
                }
            }

            MessagesService.prototype = {
                construct: function(modelData) {
                    angular.merge(this, modelData);
                },
                getDirection: function () {
                    return this.direction;
                },
                getMessages: function () {
                    return this.messages;
                },
                getMessageParts: function () {
                    return this.messageParts;
                },
                isBulkMode: function () {
                    return 0 < this.selected;
                },
                selectMessage: function (index) {
                    var toggle = !this.messages[index].isChecked;
                    this.messages[index].isChecked = toggle;
                    if (toggle) {
                        this.selected++;
                    } else {
                        this.selected--;
                    }
                },
                allSelected: function () {
                    return this.selected == this.messages.length
                },
                selectAll: function (toggle) {
                    angular.forEach(this.messages, function(value, key) {
                        value.isChecked = toggle;
                    });
                    this.selected = (toggle ? this.count() : 0);
                },
                wipe: function() {
                    this.messages = [];
                    this.last_count = 0;
                },
                count: function() {
                    return this.messages.length;
                },
                getLastCount: function() {
                    return this.last_count;
                },
                fetch: function(searchCriteria) {
                    var that = this;

                    return Api.request({
                            direction: this.direction,
                            resource: 'logSearch',
                            action: 'get',
                            requestParams: searchCriteria
                        })
                        .success(function(resp) {
                            if (!isEmpty(resp['newest_entries'])) {
                                that.messages = resp['newest_entries'];
                            } else if (!isEmpty(resp['new_entries'])) {
                                that.messages = resp['new_entries'].concat(that.messages);
                            } else if (!isEmpty(resp['entries']))  {
                                that.messages = that.messages.concat(resp['entries']);
                            }
                            that.last_count = resp.last_count || 0;
                        });
                },
                viewMessage: function (message) {

                    if (message) {
                        this.messageParts = message;

                        var that = this;

                        return Api.request({
                                direction: this.direction,
                                resource: 'logSearch',
                                action: 'view',
                                requestParams: message
                            })
                            .success(function (response) {
                                that.messageParts.details = response['mail'];
                            });
                    }

                    return null;
                },
                bulkAction: function (action, entry) {
                    var entries = [];

                    if (!isEmpty(entry)) {
                        entries.push(entry);
                    } else {
                        angular.forEach(this.messages, function(message) {
                            if (message.isChecked) {
                                this.push(message);
                            }
                        }, entries);
                    }

                    return Api.request({
                            direction: this.direction,
                            resource: 'logSearch',
                            action: action,
                            requestParams: entries
                        });
                }
            };

            return MessagesService;
        }
    ])
    .factory('actionManager', ['$ionicActionSheet', '$ionicPopup', 'AuthService', 'USER_ROLES', 'BULK_ACTIONS',
        function ($ionicActionSheet, $ionicPopup, AuthService, USER_ROLES, BULK_ACTIONS) {

            function getActions(type) {
                var availableActions = [];
                var userRole = AuthService.getRole();

                angular.forEach(BULK_ACTIONS.logSearch[type], function (action) {
                    if (
                        typeof action.condition == 'function' &&
                        !action.condition({role: userRole}, {USER_ROLES: USER_ROLES})
                    ) {
                        return;
                    }
                    this.push(action);

                }, availableActions);
                return availableActions;
            }

            function confirm (action, callback) {
                $ionicPopup
                    .confirm({
                        title: 'Confirm action',
                        template: action.confirmText.replace(/\%s/g, '<br>')
                    })
                    .then(function(choice) {
                        if (choice &&  typeof callback == 'function') {
                            callback(action);
                        }
                    });
            }

            var actions = {
                actionSheet: getActions('actionSheet'),
                bar: getActions('bar')
            };

            return {
                getActions: function(type) {
                    return actions[type];
                },
                processAction: function (actions, callback) {
                    if (actions instanceof Array) {
                        var actionSheet = $ionicActionSheet.show({
                            buttons: actions,
                            titleText: 'Select Actions',
                            cancelText: 'Cancel',
                            cancel: function() {
                                actionSheet();
                            },
                            buttonClicked: function(i, action) {
                                confirm(action, callback);
                                return true;
                            }
                        });
                    } else {
                        confirm(actions, callback);
                    }
                }

            };
        }
    ]);