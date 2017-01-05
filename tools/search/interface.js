// --------------------------------------------------------
// tools/search/interface.js -  search module public entry points.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Initialise.
    ESDOC.search = {
        // Event dispatcher.
        events : _.extend({ }, Backbone.Events),

        // Options altering module behaviour.
        options : {
            // User interface container.
            uiContainer : 'body'
        },

        // Set of supported search types.
        types : [
            'se1'
        ],

        // Set of associated views.
        views : {},

        // Cached data.
        cache : {}
    };

    // Sets module level options.
    // @opts        Options to be applied.
    ESDOC.search.setOptions = function (opts) {
        var error;

        // Error if options are not in correct format.
        if (_.isObject(opts) === false) {
            error = {
                type : 'Setup',
                errors : ["ESDOC search options must be an object"]
            };
            ESDOC.events.trigger("global:error", error);
            return;
        }

        // Option : uiContainer.
        if (_.has(opts, 'uiContainer')) {
            // Validation : string type check.
            if (_.isString(opts.uiContainer) === false) {
                error = {
                    type : 'Setup',
                    errors : ["ESDOC search uiContainer option must be a string"]
                };
                ESDOC.events.trigger("global:error", error);
                return;
            }

            // Validation passed therefore assign option.
            ESDOC.search.options.uiContainer = opts.uiContainer;
        }
    };

    // Opens a ESDOC search view.
    // @params   Comparator parameters.
    ESDOC.search.open = function(params) {
        alert(params);
        console.log(params);
        ESDOC.api.search.getSetupData(params);
    };

}(this.ESDOC, this._, this.Backbone));
