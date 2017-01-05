// --------------------------------------------------------
// tools/comparator.interface.js -  comparator module public entry points.
// --------------------------------------------------------
(function(ESDOC, _) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Sets module level options.
    // @opts        Options to be applied.
    ESDOC.comparator.setOptions = function (opts) {
        var error;

        // Error if options are not in correct format.
        if (_.isObject(opts) === false) {
            error = {
                type : 'Setup',
                errors : ["ESDOC comparator options must be an object"]
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
                    errors : ["ESDOC comparator uiContainer option must be a string"]
                };
                ESDOC.events.trigger("global:error", error);
                return;
            }

            // Validation passed therefore assign option.
            ESDOC.comparator.options.uiContainer = opts.uiContainer;
        }
    };

    // Opens a ESDOC comparator view.
    // @params   Comparator parameters.
    ESDOC.comparator.open = function(params) {
        var validateParams;

        // Validate params.
        validateParams = function() {
            var errors = [],
                fields = ['type', 'project'];

            // Validate.
            if (ESDOC.utils.validation.isPlainObject(params, 'params', errors)) {
                ESDOC.utils.validation.areRequired(params, fields, errors);
                ESDOC.utils.validation.areStrings(params, fields, errors);
                if (!errors.length &&
                    _.indexOf(ESDOC.comparator.types, params.type) === -1) {
                    errors.push('Comparator type unsupported.');
                }
            }

            // Comparator errors.
            if (errors.length > 0) {
                ESDOC.comparator.events.trigger("error", errors);
            }

            return errors.length === 0;
        };

        // If params are valid call API.
        if ( validateParams() ) {
            ESDOC.setOptions({
                activePlugin : 'Comparator'
            });
            ESDOC.api.comparator.getSetupData(params);
        }
    };

    // Parses comparator setup data.
    // @data   Comparator setup data.
    var parseSetupData = function (data) {
        if (!_.isObject(data)) {
            console.log("converting setup data to json");
            data = JSON.parse(data);
        }
        if (_.has(ESDOC.api.parsers.forComparator, data.comparator)) {
            _.each(ESDOC.api.parsers.forComparator[data.comparator], function (parser) {
                parser(data.data);
            });
        }

        // Trigger event.
        ESDOC.api.events.trigger("comparatorSetupDataLoaded", data);

        // Signal background task end event.
        ESDOC.events.trigger("feedback:backgroundTaskEnd");
    };

    // Opens a ESDOC comparator view from pre-loaded setup data.
    // @data   Comparator setup data.
    ESDOC.comparator.openDirect = function(data) {
        // Signal background task event.
        ESDOC.events.trigger("feedback:backgroundTask", 'Parsing Setup Data');

        setTimeout(parseSetupData, 250, data);
    };

}(this.ESDOC, this._));
