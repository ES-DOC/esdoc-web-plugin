(function(ESDOC, _) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Helper vars.
    var _options = ESDOC.viewer.options,
        raiseError,
        setOption;

    // Raise an options error.
    raiseError = function (err) {
        ESDOC.events.trigger("global:error", {
            type : 'Setup',
            errors : [err]
        });
    };

    // Verfies an option value.
    setOption = function (opts, name, typeTest) {
        if (_.has(opts, name)) {
            if (typeTest(opts[name]) === false) {
                raiseError("ES-DOC viewer {0} option is of invalid type".replace("{0}", name));
            } else {
                _options[name] = opts[name];
            }
        }
    };

    // Set default options.
    _.defaults(_options, {
        // Flag indicating whether footer will be displayed.
        showFooter : true,

        // Flag indicating whether document meta-info will be displayed.
        showMetaInfo : false,

        // Flag indicating whether null fields will be displayed.
        showNullFields : true
    });

    // Set custom options.
    _.extend(ESDOC.viewer, {
        // Sets a single option.
        setOption : function (name, value) {
            var opts;

            opts = {};
            opts[name] = value;
            ESDOC.viewer.setOptions(opts);
        },

        // Sets a collection of options.
        setOptions : function (opts) {
            if (_.isObject(opts) === false) {
                raiseError("ES-DOC viewer options must be an object");
                return;
            }
            setOption(opts, 'showFooter', _.isBoolean);
            setOption(opts, 'showMetaInfo', _.isBoolean);
            setOption(opts, 'showNullFields', _.isBoolean);
        }
    });

}(
    this.ESDOC,
    this._
));
