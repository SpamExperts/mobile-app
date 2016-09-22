angular.module('SpamExpertsApp')
    .config(['$stateProvider', '$urlRouterProvider', 'ROUTES', 'GROUPS', 'USER_ROLES',
        function ($stateProvider, $urlRouterProvider, ROUTES, GROUPS, USER_ROLES) {

            var Routes = ROUTES({GROUPS: GROUPS, USER_ROLES: USER_ROLES});
            var stateConfig;

            // generate our router based on the ROUTES constant (see common/constants.js)
            for (var i in Routes) {
                if (!isEmpty(Routes[i].items)) {
                    for (var j in Routes[i].items) {
                        stateConfig = Routes[i].items[j];
                        stateConfig.params = angular.merge({}, stateConfig.params, {keepMessageQueue: null});
                        $stateProvider.state(Routes[i].items[j].data.state, stateConfig);
                    }
                } else {
                    stateConfig = Routes[i];
                    stateConfig.params = angular.merge({}, stateConfig.params, {keepMessageQueue: null});
                    $stateProvider.state(Routes[i].data.state, Routes[i]);
                }
            }

            // we should always try to remain on dash
            // whenever you're not logged in you'll be forced to the login route see auth init.js
            $urlRouterProvider.otherwise('dash');
        }
    ]);