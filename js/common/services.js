SpamExpertsApp
    .factory('$localstorage', ['$window', function($window) {

        if (typeof window.localStorage['persistent'] === 'undefined') {
            $window.localStorage['persistent'] = '{}';
        }
        //$window.localStorage['persistent'] = '{}';// to be removed for prod

        $window.localStorage['volatile'] = '{}';

        return {
            get: function(key, defaultValue, isVolatile) {

                if (!defaultValue) defaultValue = {};

                var persistent = JSON.parse(window.localStorage['persistent']);
                var volatile   = JSON.parse(window.localStorage['volatile']);

                if (typeof persistent[key] === 'undefined') {
                    if (typeof volatile[key] === 'undefined') {
                        this.set(key, defaultValue, isVolatile);
                        return defaultValue;
                    } else {
                        return volatile[key];
                    }
                } else {
                    return persistent[key];
                }
            },
            set: function(key, value, isVolatile) {

                var persistent = JSON.parse(window.localStorage['persistent']);
                var volatile   = JSON.parse(window.localStorage['volatile']);

                if (isVolatile) {
                    volatile[key]   = value;
                    //persistent[key] = {};
                    delete persistent[key];
                } else {
                    persistent[key] = value;
                    delete volatile[key];
                }
                $window.localStorage['persistent'] = JSON.stringify(persistent);
                $window.localStorage['volatile']   = JSON.stringify(volatile);
            },
            cleanup: function () {
                $window.localStorage['volatile'] = '{}';
            }
        }
    }]);
