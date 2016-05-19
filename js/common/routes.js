angular.module('SpamExpertsApp')
    .config(['$stateProvider', '$urlRouterProvider', 'ROUTES', 'GROUPS', 'USER_ROLES',
        function ($stateProvider, $urlRouterProvider, ROUTES, GROUPS, USER_ROLES) {

            var Routes = ROUTES({GROUPS: GROUPS, USER_ROLES: USER_ROLES});

            for (var i in Routes) {
                if (!isEmpty(Routes[i].items)) {
                    for (var j in Routes[i].items) {
                        $stateProvider.state(Routes[i].items[j].data.state, Routes[i].items[j]);
                    }
                } else {
                    $stateProvider.state(Routes[i].data.state, Routes[i]);
                }
            }
            $urlRouterProvider.otherwise('dash');
        }
    ]);