String.prototype.printf = function (obj) {
    var useArguments = false;
    var _arguments = arguments;
    var i = -1;
    if (typeof _arguments[0] == "string") {
        useArguments = true;
    }
    if (obj instanceof Array || useArguments) {
        return this.replace(/\%s/g,
            function (a, b) {
                i++;
                if (useArguments) {
                    if (typeof _arguments[i] == 'string') {
                        return _arguments[i];
                    }
                    else {
                        throw new Error("Arguments element is an invalid type");
                    }
                }
                return obj[i];
            });
    } else {
        return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = obj[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            });
    }
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0) return false;
    if (obj.length === 0)  return true;

    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

function unique(array) {
    var arr = [];
    for (var i = 0; i < array.length; i++) {
        if (-1 == arr.indexOf(array[i])) {
            arr.push(array[i]);
        }
    }
    return arr;
}

function isObject(variable) {
    return Object.prototype.toString.call(variable) === "[object Object]";
}

function adminOrIncoming(params, constant) {
    return -1 < [
            constant['USER_ROLES'].admin
        ].indexOf(params['role']) ||
        constant['GROUPS'].incoming ==  params['direction'];
}

function domainAndIncoming(params, constant) {
    return -1 < [
            constant['USER_ROLES'].domain
        ].indexOf(params['role']) &&
        constant['GROUPS'].incoming == params['direction'];
}

function domainAndEmailAndIncoming(params, constant) {
    return -1 < [
            constant['USER_ROLES'].domain,
            constant['USER_ROLES'].email
        ].indexOf(params['role']) &&
        constant['GROUPS'].incoming == params['direction'];
}