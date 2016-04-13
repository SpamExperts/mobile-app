angular.module('SpamExpertsApp')
    .controller('IncomingSearchCriteriaCtrl', ['$scope', '$controller', 'SearchCriteriaService', 'GROUPS',
        function($scope, $controller, SearchCriteriaService, GROUPS) {

            $controller('CommonSearchCriteriaCtrl', {
                $scope: $scope,
                criteriaService: new SearchCriteriaService({
                    direction: GROUPS.incoming,
                    searchCriteria: {}
                })
            });
        }
    ]);

angular.module('SpamExpertsApp')
    .controller('OutgoingSearchCriteriaCtrl', ['$scope', '$controller', 'SearchCriteriaService', 'GROUPS',
        function($scope, $controller, SearchCriteriaService, GROUPS) {

            $controller('CommonSearchCriteriaCtrl', {
                $scope: $scope,
                criteriaService: new SearchCriteriaService({
                    direction: GROUPS.outgoing,
                    searchCriteria: {}
                })
            });
        }
    ]);

angular.module('SpamExpertsApp')
    .controller('CommonSearchCriteriaCtrl', ['$rootScope', '$scope', '$state', 'criteriaService',
        function($rootScope, $scope, $state, criteriaService) {

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

        }
    ]);