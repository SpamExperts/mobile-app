angular.module('SpamExpertsApp')
    .factory('SearchCriteriaService', ['$localstorage', 'GROUPS', 'OTHERS',
        function ($localstorage, GROUPS, OTHERS) {

            /** @var modelData = {direction: direction} */

            function SearchCriteriaService(modelData) {

                this.direction = null;

                if (!isEmpty(modelData)) {
                    this.construct(modelData);
                }

            }

            SearchCriteriaService.prototype = {
                construct: function(modelData) {
                    angular.merge(this, modelData);
                },
                getDirection: function () {
                    return this.direction;
                },
                getDefaultCriteria: function() {
                    return {
                        since: this.getDate({days: '-1'}),
                        until: this.getDate(),
                        offset: 0,
                        length: OTHERS.sliceLength,
                        refresh: false,
                        sender: '',
                        recipient: '',
                        domain: ''
                    };
                },
                getSearchCriteria: function() {
                    return $localstorage.get('searchCriteria.' + this.direction, this.getDefaultCriteria(), true);
                },
                setSearchCriteria: function(criteria) {
                    $localstorage.set('searchCriteria.' + this.direction, criteria, true);
                },
                getDate: function(extra) {

                    function getDate(date) {
                        return {
                            hours : date.getHours(),
                            min   : date.getMinutes(),
                            days  : date.getDate(),
                            month : date.getMonth(),
                            year  : date.getFullYear()
                        };
                    }

                    var currentDate = getDate(new Date());

                    if (angular.isDefined(extra)) {
                        currentDate = getDate(
                            new Date(
                                currentDate.year  + (!isEmpty(extra['years'])  ? parseInt(extra['years'])  : 0),
                                currentDate.month + (!isEmpty(extra['month'])  ? parseInt(extra['month'])  : 0),
                                currentDate.days  + (!isEmpty(extra['days'])   ? parseInt(extra['days'])   : 0),
                                currentDate.hours + (!isEmpty(extra['hours'])  ? parseInt(extra['hours'])  : 0),
                                currentDate.min   + (!isEmpty(extra['minutes'])? parseInt(extra['minutes']): 0)
                            )
                        );
                    }

                    return '%s-%s-%s %s:%s'.printf([
                        currentDate.year,
                        ('0' + (currentDate.month + 1)).slice(-2),
                        ('0' + currentDate.days).slice(-2),
                        ('0' + currentDate.hours).slice(-2),
                        ('0' + currentDate.min).slice(-2)
                    ]);
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