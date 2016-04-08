SpamExpertsApp
    .factory('Messages', function($http, $localstorage, GROUPS) {

        var messages = {};
        var last_count = {};
        var direction = '';

        messages[GROUPS['incoming']] = [];
        messages[GROUPS['outgoing']] = [];

        last_count[GROUPS['incoming']] = 0;
        last_count[GROUPS['outgoing']] = 0;

        var message = null;

        var protocol = "http://";
        var settings = $localstorage.get('settings');
        var baseEndpoint = protocol + settings.hostname;

        return {
            getDirection: function (dir) {
                console.log(dir);
            },
            setDirection: function (dir) {
                console.log(arguments.callee.caller.toString());

                if (!dir) {
                    direction = '';
                    console.warn('Entries direction undefined');
                } else {
                    direction = dir;
                }
            },
            getMessages: function () {
                return messages[direction];
            },
            toggleSelection: function (toggle) {
                angular.forEach(messages[direction], function(value, key) {
                    if (1 || value.status=='quarantined' && value.classification=='Rejected') {
                        value.isChecked = toggle;
                    }
                });
            },
            wipe: function() {
                messages[direction] = [];
                last_count[direction] = 0;
            },
            //messages: messages,
            count: function() {
                return messages[direction].length;
            },
            message: function () {
                return message;
            },
            getLastCount: function() {
                return last_count[direction];
            },
            fetch: function(searchCriteria) {
                var endpoint = baseEndpoint;
                endpoint += '/api/log/search/action/get_rows_json/searchCriteria/' + JSON.stringify(searchCriteria);
                if (direction == GROUPS['outgoing']) endpoint += '/outgoing/1';

                return $http.get(endpoint)
                    .success(function(resp) {

                        if (resp['new_entries']) {
                            messages[direction] = resp['new_entries'].concat(messages[direction]);
                        } else {
                            messages[direction] = messages[direction].concat(resp['entries']);
                        }
                        last_count[direction] = resp.last_count;
                    })
                    . error(function(err) {
                        console.log('ERR', err);
                    })
                    .finally(function() {

                    });
            },
            bulkAction: function (action, selection) {
                var endpoint = baseEndpoint;

                //test@example.com|1YiJCV-0003iL-94|server1.test21.simplyspamfree.com|2015-04-15 10:01
                var params = [];

                angular.forEach(selection, function(value, key) {
                    this.push(
                        [
                            value['recipient'],
                            value['message_id'],
                            value['host'],
                            value['datestamp']
                        ].join('|')
                    );
                }, params);

                endpoint += '/api/log/search/action/'+ action + '/spam_messages/' + JSON.stringify(params);
                if (direction == GROUPS['outgoing']) endpoint += '/outgoing/1';

                return $http.get(endpoint)
                    .success(function(resp) {

                    })
                    .error(function(err) {
                        console.log('ERR', err);
                    })
                    .finally(function() {

                    });

            },
            get: function(message_id) {
                var protocol = "http://";
                var settings = $localstorage.get('settings');
                var baseEndpoint = protocol + settings.hostname;

                for (var i = 0; i < messages[direction].length; i++) {
                    if (messages[direction][i].message_id === message_id) {
                        message = messages[direction][i];
                    }
                }

                if (message) {

                    var spamMessages = [
                        (direction == GROUPS['outgoing']
                                ? message['user']
                                : message['recipient']
                        ),
                        message['message_id'],
                        message['host'],
                        message['datestamp']
                    ];

                    spamMessages = JSON.stringify([spamMessages.join('|')]);

                    var endpoint = baseEndpoint + '/api/log/search/action/view/spam_messages/' + spamMessages;
                    if (direction == GROUPS['outgoing']) endpoint += '/outgoing/1';

                    return $http.get(endpoint)
                        .success(function(resp){
                            message.details = resp.mail;
                        })
                        .error(function(err) {
                            console.log('ERR', err);
                        });
                }

                return null;
            }
        };
    })
;