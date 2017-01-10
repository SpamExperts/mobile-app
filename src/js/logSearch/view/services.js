angular.module('SpamExpertsApp')
    .factory('MessagesService', ['Api', 'OTHERS',
        function(Api, OTHERS) {

            /** @var modelData = {direction: direction, last_count: last_count, messages: [], message: {}}; */
            function MessagesService(modelData) {
                this.messages = [];
                this.last_count = 0;
                this.direction = null;
                this.messageParts = {};
                this.selected = 0;
                this.currentPage = 0;
                this.firstPage = 0;

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
                clearMessageParts: function () {
                    this.messageParts = {};
                },
                isBulkMode: function () {
                    return 0 < this.selected;
                },
                selectMessage: function (index, directToggle) {

                    if (!directToggle) {
                        this.messages[index].isChecked = !this.messages[index].isChecked;
                    }

                    if (this.messages[index].isChecked) {
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
                    this.selected = 0;
                    this.last_count = 0;
                    this.firstPage = 0;
                    this.currentPage = 0;
                },
                count: function() {
                    return this.messages.length;
                },
                getLastCount: function() {
                    return this.last_count;
                },
                getCurrentPage: function () {
                    return this.currentPage;
                },
                fetch: function(searchCriteria) {
                    var self = this;

                    return Api.request({
                            direction: this.direction,
                            resource: 'logSearch',
                            action: 'get',
                            requestParams: searchCriteria
                        })
                        .success(function(response) {

                            // Maybe messages were wiped
                            if (response['last_count'] == 0) {
                                self.wipe();

                                // If we have new entries and what to refresh
                            } else if (
                                !isEmpty(response['new_entries']) &&
                                self.last_count != response['last_count']
                            ) {

                                // if the new returned page is higher than next,
                                // replace the list and let infinite scroll fill next entries
                                if (response['currentPage'] > self.firstPage + 1) {
                                    self.messages = response['new_entries'];

                                    // if the new returned page it's exactly next
                                } else if (response['currentPage'] == self.firstPage + 1) {

                                    // if we loaded full pages (no gap) we can add them to the top
                                    if (self.messages.length % OTHERS.sliceLength == 0) {
                                        self.messages = response['new_entries'].concat(self.messages);
                                        self.firstPage = response['currentPage'];
                                    } else {
                                        // there is a gap so replace the list and let infinite scroll fill next entries
                                        self.messages = response['new_entries'];
                                    }
                                    // if the returned is the same page
                                } else if (response['currentPage'] == self.firstPage) {

                                    // calculate the first page length
                                    var firstPageLength = self.messages.length % OTHERS.sliceLength;

                                    // if we actually don't have a full slice we remove the broken slice
                                    // and add the returned full slice
                                    if (0 < firstPageLength) {
                                        self.messages.splice(0, firstPageLength);
                                        self.messages = response['new_entries'].concat(self.messages);
                                        self.firstPage = response['currentPage'];
                                    }
                                }

                                // infinite scroll
                            } else if (!isEmpty(response['entries']))  {
                                self.messages = self.messages.concat(response['entries']);
                            }

                            self.currentPage = response['currentPage'] || 0;
                            self.last_count = response['last_count'] || 0;

                            // remember the returned first page number
                            if (self.firstPage == 0) {
                                self.firstPage = response['currentPage'];
                            }
                        });
                },
                viewMessage: function (message) {

                    if (message) {
                        this.messageParts = message;

                        var self = this;

                        return Api.request({
                                direction: this.direction,
                                resource: 'logSearch',
                                action: 'view',
                                requestParams: message,
                                filterParams: true
                            })
                            .success(function (response) {
                                self.messageParts.details = response['mail'];
                            });
                    }

                    return null;
                },
                bulkAction: function (action, entry) {

                    return Api.request({
                            direction: this.direction,
                            resource: 'logSearch',
                            action: action,
                            requestParams: !isEmpty(entry) ? [entry] : this.messages,
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