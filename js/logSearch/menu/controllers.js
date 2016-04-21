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
    .controller('CommonSearchCriteriaCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'criteriaService',
        function($rootScope, $scope, $state, $timeout, criteriaService) {

            $scope.searchCriteria = criteriaService.getSearchCriteria();

            $scope.doSearch = function() {
                criteriaService.setSearchCriteria($scope.searchCriteria);
                $timeout(function() {
                    $rootScope.$broadcast('refreshEntries');
                });
            };

            $scope.doReset = function() {
                var defaultCriteria = criteriaService.getDefaultCriteria();
                criteriaService.setSearchCriteria(defaultCriteria);
                $scope.searchCriteria = defaultCriteria;
                $timeout(function() {
                    $rootScope.$broadcast('refreshEntries');
                });
            };

        }
    ]);