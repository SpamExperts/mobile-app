angular.module('SpamExpertsApp')
    .factory('SearchCriteriaService', ['$filter', '$localstorage', 'GROUPS', 'OTHERS',
        function ($filter, $localstorage, GROUPS, OTHERS) {

            /** @var modelData = {direction: direction} */

            function SearchCriteriaService(modelData) {

                this.direction = null;

                if (!isEmpty(modelData)) {
                    this.construct(modelData);
                }

            }

            function filterDates(criteria) {
                var newCriteria = angular.merge({}, criteria);
                newCriteria.since = $filter('date')(newCriteria.since, 'yyyy-MM-dd HH:mm');
                newCriteria.until = $filter('date')(newCriteria.until, 'yyyy-MM-dd HH:mm');
                return newCriteria;
            }

            SearchCriteriaService.prototype = {
                construct: function(modelData) {
                    angular.merge(this, modelData);
                },
                getDirection: function () {
                    return this.direction;
                },
                getDefaultCriteria: function() {
                    var yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);

                    return {
                        since: yesterday,
                        until: new Date(),
                        offset: 0,
                        length: OTHERS.sliceLength,
                        refresh: false,
                        sender: '',
                        recipient: '',
                        domain: ''
                    };
                },
                getCurrentDate: function (apiDate) {
                    var now = new Date();
                    if (apiDate) {
                        now = $filter('date')(now, 'yyyy-MM-dd HH:mm');
                    }
                    return now;
                },
                getSearchCriteria: function(apiDates) {
                    var criteria = this.getDefaultCriteria();
                    var currentCriteria = $localstorage.get('searchCriteria.' + this.direction, filterDates(criteria), true);
                    if (!apiDates) {
                        currentCriteria.since = new Date(currentCriteria.since);
                        currentCriteria.until = new Date(currentCriteria.until);
                    }
                    return currentCriteria;
                },
                setSearchCriteria: function(criteria) {
                    $localstorage.set('searchCriteria.' + this.direction, filterDates(criteria), true);
                }
            };

            return SearchCriteriaService;

        }
    ])
    .factory('CriteriaManager', ['filterPermissions', 'SEARCH_CRITERIA',
        function (filterPermissions, SEARCH_CRITERIA) {


            function CriteriaManager(modelData) {
                this.direction = null;

                if (!isEmpty(modelData)) {
                    this.construct(modelData);
                }
            }

            var actions = {};

            CriteriaManager.prototype = {
                construct: function (modelData) {
                    angular.merge(this, modelData);
                    actions = {
                        fields:  filterPermissions(SEARCH_CRITERIA.logSearch['fields'], {direction: this.direction}, {}),
                        actions: filterPermissions(SEARCH_CRITERIA.logSearch['actions'], {direction: this.direction}, {})
                    };
                },
                getFields: function () {
                    return actions['fields'];
                },
                getActions: function () {
                    return actions['actions'];
                }
            };

            return CriteriaManager;
        }
    ]);