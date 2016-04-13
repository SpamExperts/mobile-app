angular.module('SpamExpertsApp')
    .factory('SearchCriteriaService', ['$localstorage', 'GROUPS', 'OTHERS',
        function ($localstorage, GROUPS, OTHERS) {

            /**
             var modelData = {
        direction: direction,
    }
             */
            function SearchCriteriaService(modelData) {

                this.direction = null;

                this.defaultCriteria = {};
                this.defaultCriteria[GROUPS['incoming']] = {
                    since: this.getDate({days: '-1'}),
                    until: this.getDate(),
                    offset: 0,
                    length: OTHERS.sliceLength
                };

                this.defaultCriteria[GROUPS['outgoing']] = {
                    since: this.getDate({days: '-1'}),
                    until: this.getDate(),
                    offset: 0,
                    length: OTHERS.sliceLength
                };
                this.searchCriteria =  $localstorage.get('searchCriteria', this.defaultCriteria, true);

                if (modelData) {
                    this.construct(modelData);
                }

            }

            SearchCriteriaService.prototype = {
                construct: function(modelData) {
                    angular.merge(this, modelData);
                },
                getSearchCriteria: function() {
                    var criteria = $localstorage.get('searchCriteria');
                    return criteria[this.direction];
                },
                getDefaultCriteria: function() {
                    return this.defaultCriteria[this.direction];
                },
                setSearchCriteria: function(criteria) {
                    this.searchCriteria[this.direction] = criteria;
                    $localstorage.set('searchCriteria', this.searchCriteria, true);
                },
                getDate: function(extra) {

                    function getDate(date) {
                        return {
                            hours : date.getHours(),
                            min   : date.getMinutes(),
                            days   : date.getDate(),
                            month : date.getMonth(),
                            year  : date.getFullYear()
                        };
                    }

                    var currentDate = getDate(new Date());

                    if (angular.isDefined(extra)) {
                        currentDate = getDate(
                            new Date(
                                currentDate.year  + (angular.isDefined(extra['years'])  ? parseInt(extra['years'])  : 0),
                                currentDate.month + (angular.isDefined(extra['month'])  ? parseInt(extra['month'])  : 0),
                                currentDate.days  + (angular.isDefined(extra['days'])   ? parseInt(extra['days'])   : 0),
                                currentDate.hours + (angular.isDefined(extra['hours'])  ? parseInt(extra['hours'])  : 0),
                                currentDate.min   + (angular.isDefined(extra['minutes'])? parseInt(extra['minutes']): 0)
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
    ]);