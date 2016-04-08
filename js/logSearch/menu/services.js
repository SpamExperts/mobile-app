SpamExpertsApp.factory('SearchCriteriaService', ['$localstorage', 'GROUPS', function ($localstorage, GROUPS) {

    var getDate = function(extra) {
        if (!extra) extra = {};
        var now   = new Date();

        var hour  = now.getHours()       + (angular.isDefined(extra['hours'])  ? parseInt(extra['hours'])  : 0);
        var min   = now.getMinutes()     + (angular.isDefined(extra['minutes'])? parseInt(extra['minutes']): 0);
        var day   = now.getDate()        + (angular.isDefined(extra['days'])   ? parseInt(extra['days'])   : 0);
        var month = now.getMonth() + 1   + (angular.isDefined(extra['months']) ? parseInt(extra['months']) : 0);
        var year  = now.getFullYear()    + (angular.isDefined(extra['years'])  ? parseInt(extra['years'])  : 0);

        return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2) +
            ' ' + ('0' + hour).slice(-2) + ':' + ('0' + min).slice(-2)
    };

    var direction = GROUPS['incoming'];

    var defaultCriteria = {};
    defaultCriteria[GROUPS['incoming']] = {
        since: getDate({days: '-1'}),
        until: getDate(),
        searchdomain: '',
        offset: 0,
        length: 5
    };

    defaultCriteria[GROUPS['outgoing']] = {
        since: getDate({days: '-1'}),
        until: getDate(),
        searchdomain: '',
        offset: 0,
        length: 5
    };

    var searchCriteria = $localstorage.get('searchCriteria', defaultCriteria);

    return {
        defaultCriteria: angular.copy(defaultCriteria),
        setDirection: function (dir) {
            if (!dir) {
                direction = '';
                console.warn('Search criteria directon undefined');
            } else {
                direction = dir;
            }
        },
        getSearchCriteria: function() {
            return searchCriteria[direction];
        },
        setSearchCriteria: function(criteria) {
            searchCriteria[direction] = criteria;
            $localstorage.set('searchCriteria', searchCriteria, true);
        },
        getDate: getDate
    }
}
]);