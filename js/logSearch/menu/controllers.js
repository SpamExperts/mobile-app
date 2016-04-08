SpamExpertsApp
    .controller('IncomingSearchCriteriaCtrl', function($scope, $controller, SearchCriteriaService, GROUPS) {

        $controller('CommonSearchCriteriaCtrl', {
            $scope: $scope,
            criteriaService: new SearchCriteriaService({
                direction: GROUPS.incoming,
                searchCriteria: {}
            })
        });
    });

SpamExpertsApp
    .controller('OutgoingSearchCriteriaCtrl', function($scope, $controller, SearchCriteriaService, GROUPS) {

        $controller('CommonSearchCriteriaCtrl', {
            $scope: $scope,
            criteriaService: new SearchCriteriaService({
                direction: GROUPS.outgoing,
                searchCriteria: {}
            })
        });
    });

SpamExpertsApp
    .controller('CommonSearchCriteriaCtrl', function($rootScope, $scope, $state, criteriaService) {

        $scope.searchCriteria = criteriaService.getSearchCriteria();

        $scope.doSearch = function() {
            criteriaService.setSearchCriteria($scope.searchCriteria);
            $rootScope.$broadcast('refreshEntries');
        };

        $scope.doReset = function() {
            criteriaService.setSearchCriteria(criteriaService.getDefaultCriteria());
            $scope.searchCriteria = criteriaService.getDefaultCriteria();
            $rootScope.$broadcast('refreshEntries');
        };

    });