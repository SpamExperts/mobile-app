angular.module('starter.services', [])

    .factory('Messages', function(Base64, Settings, $http) {
        var messages = [];
        var message = null;
        var last_count = null;
        var more = true;

        return {
            refresh: function () {
                return messages;
            },
            messages: function () {
                return messages;
            },
            //messages: messages,
            count: function() {
                return messages.length;
            },
            message: function () {
                return message;
            },
            getLastCount: function() {
                return last_count;
            },
            moreDataCanBeLoaded: function() {
                //return last_count === null || last_count > messages.length;
                return last_count === null || last_count > messages.length;
            },
            fetch: function(searchCriteria, isOutgoing) {
                var endpoint = Settings.getEndpoint();
                endpoint += '/api/log/search/action/get_rows_json/searchCriteria/' + JSON.stringify(searchCriteria);
                if (isOutgoing) endpoint += '/outgoing/1';

                return $http.get(endpoint).
                    success(function(resp){
                        //console.log('success');
                        //console.log(resp);
                        if (resp.new_entries) {
                            messages = resp.new_entries.concat(messages);
                        } else {
                            messages = messages.concat(resp.entries);
                        }
                        last_count = resp.last_count;
                    }).
                    error(function(err) {
                        console.log('ERR', err);
                    }).
                    finally(function() {

                    });
            },
            bulkAction: function (action, messages) {
                var endpoint = Settings.getEndpoint();

                //test@example.com|1YiJCV-0003iL-94|server1.test21.simplyspamfree.com|2015-04-15 10:01
                var params = [];

                angular.forEach(messages, function(value, key) {
                    this.push([value.recipient, value.message_id, value.host, value.datestamp].join('|'));
                }, params);

                endpoint += '/api/log/search/action/'+ action + '/spam_messages/' + JSON.stringify(params);
                if (isOutgoing) endpoint += '/outgoing/1';

                return $http.get(endpoint).
                    success(function(resp) {
                    }).
                    error(function(err) {
                        console.log('ERR', err);
                    }).
                    finally(function() {

                    });

            },
            get: function(endpoint, message_id) {
                for (var i = 0; i < messages.length; i++) {
                    if (messages[i].message_id === message_id) {
                        message = messages[i];
                    }
                }
                if (message) {
                    var spamMessages = [message.recipient, message.message_id, message.host, message.datestamp];
                    spamMessages = JSON.stringify([spamMessages.join('|')]);
                    //console.log(spamMessages);
                    endpoint += '/api/log/search/action/view/spam_messages/' + spamMessages;
                    //console.log(endpoint);

                    return $http.get(endpoint).
                        success(function(resp){
                            message.details = resp.mail;
                        }).
                        error(function(err) {
                            console.log('ERR', err);
                        });
                }

                return null;
            },
            wipe: function() {
                //console.log('wipe');
                messages = [];
                last_count = null;
            }
        };
    })

    .factory('SearchCriteria',
        ['$localstorage',
            function ($localstorage) {
                var searchCriteria = $localstorage.getObject('searchCriteria') || {};

                return {
                    setSearchCriteria: function(criteria) {
                        searchCriteria = criteria;
                        $localstorage.setObject('searchCriteria', criteria);
                    },

                    getDefaultSearchCriteria: function() {
                        return {
                            since: '2015-04-15 00:00',
                            until: this.getDate(),
                            searchdomain: '',
                            offset: 0,
                            length: 5
                        };
                    },

                    getSearchCriteria: function() {
                        return searchCriteria;
                    },

                    getDate : function() {
                        var now = new Date();
                        var year = now.getFullYear();
                        var month = now.getMonth() + 1;
                        var day = now.getDate();
                        var hour = now.getHours();
                        var min = now.getMinutes();
                        return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2) +
                            ' ' + ('0' + hour).slice(-2) + ':' + ('0' + min).slice(-2)
                    }
                }
            }
        ]
    )

    .factory('Settings',
        ['Base64', '$http', '$localstorage',
            function (Base64, $http, $localstorage) {
                var service = {};

                service.saveSettings = function (settings) {
                    //console.log('save settings');
                    if (settings.username && settings.password) {
                        settings.authdata = Base64.encode(settings.username + ':' + settings.password);
                        //console.log(settings.authdata);
                        delete settings.username;
                        delete settings.password;
                        $http.defaults.headers.common['Authorization'] = 'Basic ' + settings.authdata;
                        $localstorage.setObject('settings', settings);
                    }
                };

                service.getSettings = function () {
                    var settings = $localstorage.getObject('settings');
                    if (settings.authdata) {
                        $http.defaults.headers.common['Authorization'] = 'Basic ' + settings.authdata;
                        var authdata = Base64.decode(settings.authdata).split(':');
                        settings.username = authdata[0];
                        settings.password = authdata[1];
                    }
                    return settings;
                };

                service.clearAuth = function () {
                    $http.defaults.headers.common.Authorization = 'Basic ';
                };

                service.getEndpoint = function() {
                    var settings = $localstorage.getObject('settings');
                    var protocol = "http://";
                    var hostname = settings.hostname;
                    return protocol + hostname;
                };

                return service;
            }
        ]
    )

    .factory('Base64', function () {

        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        return {
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },

            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return output;
            }
        };

    })

;
