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
                countSelected: function () {
                    return this.selected;
                },
                selectAll: function (toggle) {
                    angular.forEach(this.messages, function(value) {
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
                        .success(function(response) {
                            if (!isEmpty(response['newest_entries'])) {
                                that.messages = response['newest_entries'];
                            } else if (!isEmpty(response['new_entries'])) {
                                that.messages = response['new_entries'].concat(that.messages);
                            } else if (!isEmpty(response['entries']))  {
                                that.messages = that.messages.concat(response['entries']);
                            }
                            that.last_count = response.last_count || 0;
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

                    if (!isEmpty(entry)) {
                        entry.isChecked = true;
                    }

                    return Api.request({
                            direction: this.direction,
                            resource: 'logSearch',
                            action: action,
                            requestParams: !isEmpty(entry) ? [entry] : this.messages,
                            filterChecked: true,
                            filterParams: true
                        });
                }
            };

            return MessagesService;
        }
    ])
    .factory('ActionManager', ['uiService', 'MessageQueue', 'filterPermissions', 'BULK_ACTIONS',
        function (uiService, MessageQueue, filterPermissions, BULK_ACTIONS) {

            function confirm (action, callback) {
                uiService.confirm({
                        title: 'Confirm action',
                        template: action.confirmText.replace(/\%s/g, '<br>')
                    }, function () {
                        if (typeof callback == 'function') {
                            callback(action);
                        }
                    })
            }

            return function (direction) {
                var actions = {
                    actionSheet: filterPermissions(BULK_ACTIONS.logSearch['actionSheet'], {direction: direction}),
                    bar: filterPermissions(BULK_ACTIONS.logSearch['bar'], {direction: direction}),
                    tapAction: filterPermissions(BULK_ACTIONS.logSearch['tapAction'], {direction: direction})
                };

                this.getActions = function(type) {
                    return actions[type];
                };

                this.processAction = function (action, callback) {
                    if (!isEmpty(action.actions)) {
                        uiService.dropdown().show(action);
                    } else {
                        uiService.dropdown().hide();
                        confirm(action, callback);
                    }
                };

                this.noAvailableAction = function () {
                    MessageQueue.set({info: ['No bulk actions are available']});
                };

                this.noViewAction = function () {
                    MessageQueue.set({info: ['You are not allowed to view this message']});
                };
            };

        }
    ]);