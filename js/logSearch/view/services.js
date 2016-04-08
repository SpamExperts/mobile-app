SpamExpertsApp
    .factory('MessagesService', function(Api, GROUPS) {

        /**
         var modelData = {
            direction: direction,
            last_count: last_count,
            messages: [],
            message: {}
        };
         */
        function MessagesService(modelData) {
            this.messages = [];
            this.last_count = 0;
            this.direction = null;
            this.messageParts = {};
            this.selected = 0;

            if (modelData) {
                this.construct(modelData);
            }
        }

        MessagesService.prototype = {
            construct: function(modelData) {
                angular.merge(this, modelData);
            },
            getMessages: function () {
                return this.messages;
            },
            getMessageParts: function () {
                return this.messageParts;
            },
            isBulkMode: function () {
                return this.selected > 0;
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
                        if (resp['new_entries']) {
                            that.messages = resp['new_entries'].concat(that.messages);
                        } else {
                            that.messages = that.messages.concat(resp['entries']);
                        }
                        that.last_count = resp.last_count;
                    })
                    . error(function(err) {
                        console.log('ERR', err);
                    })
                    .finally(function() {

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
                        .success(function (resp) {
                            that.messageParts.details = resp.mail;
                        })
                        .error(function (err) {

                        });
                }

                return null;
            },
            bulkAction: function (action, entry) {

                //test@example.com|1YiJCV-0003iL-94|server1.test21.simplyspamfree.com|2015-04-15 10:01
                var entries = [];

                if (entry) {
                    entries.push(entry);
                } else {
                    angular.forEach(this.messages, function(value, key) {
                        if (value.isChecked) {
                            this.push(value);
                        }
                    }, entries);
                }

                return Api.request({
                        direction: this.direction,
                        resource: 'logSearch',
                        action: action,
                        requestParams: [action, entries]
                    })
                    .success(function(resp) {

                    })
                    .error(function(err) {
                        console.log('ERR', err);
                    })
                    .finally(function() {

                    });

            }
        };

        return MessagesService;
    });
