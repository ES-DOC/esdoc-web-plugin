// --------------------------------------------------------
// esdoc.utils.jsExtensions - javascript extension functions.
// --------------------------------------------------------
(function() {

    // String extensions.
    if (typeof String.prototype.eq != 'function') {
        String.prototype.eq = function (str){
            return this.toLowerCase() === str.toLowerCase();
        };
    }

    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str){
            return this.slice(0, str.length) == str;
        };
    }

    if (typeof String.prototype.endsWith != 'function') {
        String.prototype.endsWith = function (suffix){
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }

    if (typeof String.prototype.trim != 'function') {
        String.prototype.trim = function (str){
            return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        };
    }

    if (typeof String.prototype.splitCamelCase != 'function') {
        String.prototype.splitCamelCase = function (str){
            return this.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){return str.toUpperCase();});
        };
    }

    if (typeof String.prototype.capitalize != 'function') {
        String.prototype.capitalize = function (){
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
    }

    if (typeof String.prototype.contains != 'function') {
        String.prototype.contains = function (it){
            return this.indexOf(it) != -1;
        };
    }

    if (typeof String.prototype.format != 'function') {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };
    }

})();
