SpamExpertsApp
    .controller('SearchCriteriaCtrl', function($rootScope, $scope, $state, Messages, SearchCriteriaService) {

            var init = function (next) {
                SearchCriteriaService.setDirection(next);
                $scope.searchCriteria = SearchCriteriaService.getSearchCriteria();
            };

            init($state.current.group);

            $scope.$on('$stateChangeSuccess', function (event,next, nextParams, fromState) {
                init(next.group);
            });

            $scope.doSearch = function() {
                SearchCriteriaService.setSearchCriteria($scope.searchCriteria);
                $rootScope.$broadcast('entriesWipe');
            };

            $scope.doReset = function() {
                SearchCriteriaService.setSearchCriteria(SearchCriteriaService.defaultCriteria);
                $rootScope.$broadcast('entriesWipe');
            };

        }
    )
;