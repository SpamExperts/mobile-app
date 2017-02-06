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
    .controller('CommonSearchCriteriaCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'criteriaService', 'CriteriaManager',
        function($rootScope, $scope, $state, $timeout, criteriaService, CriteriaManager) {

            var criteriaManager = new CriteriaManager();

            $scope.criteriaFields  = criteriaManager.criteriaForm('fields');
            $scope.criteriaActions = criteriaManager.criteriaForm('actions');

            $scope.searchCriteria = criteriaService.getSearchCriteria();
            $scope.dateFormat = criteriaService.getDateFormat();

            $scope.$on('updateToNow', function () {
                var criteria = criteriaService.getSearchCriteria();
                criteria.until = criteriaService.getCurrentDate();
                criteriaService.setSearchCriteria(criteria);

                $scope.searchCriteria = criteria;
            });

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


            $scope.past24Hours = function () {
                $scope.searchCriteria.since = criteriaService.getXDaysBackDate(1);
                $scope.searchCriteria.until = criteriaService.getCurrentDate();
            };

            $scope.pastWeek = function () {
                $scope.searchCriteria.since = criteriaService.getXDaysBackDate(7);
                $scope.searchCriteria.until = criteriaService.getCurrentDate();
            };

            $scope.pastMonth = function () {
                $scope.searchCriteria.since = criteriaService.getXMonthsBackDate(1);
                $scope.searchCriteria.until = criteriaService.getCurrentDate();
            };

        }
    ]);