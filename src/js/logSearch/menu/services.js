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
                newCriteria.since = $filter('date')(newCriteria.since, OTHERS.dateFormat);
                newCriteria.until = $filter('date')(newCriteria.until, OTHERS.dateFormat);
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
                    var today = new Date();
                    today.setHours(0);
                    today.setMinutes(0);

                    var currentDate = this.getCurrentDate();

                    return {
                        since: today,
                        until: currentDate,
                        current_page: 0,
                        length: OTHERS.sliceLength,
                        refresh: false,
                        sender: '',
                        recipient: '',
                        domain: ''
                    };
                },
                getCurrentDate: function (apiDate) {
                    var now = new Date();
                    now.setSeconds(0);

                    if (apiDate) {
                        now = $filter('date')(now, OTHERS.dateFormat);
                    }
                    return now;
                },
                getXDaysBackDate: function (days) {
                    var now = new Date();
                    now.setSeconds(0);
                    now.setDate(now.getDate() - days);
                    return now;
                },
                getXMonthsBackDate: function (months) {
                    var now = new Date();
                    now.setSeconds(0);
                    now.setMonth(now.getMonth() - months);
                    return now;
                },
                getSearchCriteria: function(apiDates) {
                    var criteria = this.getDefaultCriteria();
                    var currentCriteria = $localstorage.get('searchCriteria.' + this.direction, filterDates(criteria), true);
                    if (!apiDates) {
                        // .replace(/-/g, '/') as iOS safari doesn't support date formats with -
                        currentCriteria.since = new Date(currentCriteria.since.replace(/-/g, '/'));
                        currentCriteria.until = new Date(currentCriteria.until.replace(/-/g, '/'));
                    }
                    return currentCriteria;
                },
                getDateFormat: function () {
                    return OTHERS.dateFormat;
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

            return function () {
                var criteriaForm = {
                    fields: filterPermissions(SEARCH_CRITERIA.logSearch['fields']),
                    actions: filterPermissions(SEARCH_CRITERIA.logSearch['actions'])
                };

                this.criteriaForm = function (type) {
                    return criteriaForm[type];
                }
            };
        }
    ]);