// --------------------------------------------------------
// options.js :: Main cim options.
// --------------------------------------------------------
(function(ESDOC, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Set default options.
    _.extend(ESDOC, {
        options : {
            // Default document language.
            language : 'en',

            // Default ontology.
            ontology : 'cim.1',

            // Base URL of api.
            apiBaseURL : undefined,

            // Base URL of static file server.
            staticBaseURL : undefined,

            // Plugin type being used.
            activePlugin : 'Unknown',

            // Flag indicating whether errors will be shielded from host application.
            shieldErrors : true,

            // Flag indicating whether feedback will be displayed when background processing is occurring.
            displayProcessingFeedback : true
        }
    });

    // Initialise base API URL.
    if (window.location.host) {
        if (window.location.host.indexOf('test') >= 0 &&
            window.location.host.indexOf('es-doc.org') >= 0) {
            ESDOC.options.apiBaseURL = 'http://test.api.es-doc.org';
        } else {
            ESDOC.options.apiBaseURL = 'http://api.es-doc.org';
        }
    } else {
        ESDOC.options.apiBaseURL = 'http://localhost:5000';
    }

    // Initialise base static URL.
    if (window.location.host) {
        if (window.location.host.indexOf('test') >= 0 &&
            window.location.host.indexOf('es-doc.org') >= 0) {
            ESDOC.options.staticBaseURL = 'http://test.static.es-doc.org';
        } else {
            ESDOC.options.staticBaseURL = 'http://static.es-doc.org';
        }
    } else {
        ESDOC.options.staticBaseURL = '../esdoc-web-static';
    }

    // Set custom options.
    _.extend(ESDOC, {
        // Sets a single option.
        setOption : function (name, value) {
            var opts;

            opts = {};
            opts[name] = value;
            ESDOC.setOptions(opts);
        },

        // Sets a collection of options.
        setOptions : function (opts) {
            // Error if options are not in correct format.
            if (_.isObject(opts) === false) {
                ESDOC.events.trigger("global:error", {
                    type : 'Setup',
                    errors : ["Plugin options must be an object"]
                });
                return;
            }

            // Option : displayProcessingFeedback.
            if (_.has(opts, 'displayProcessingFeedback')) {
                // Validation : boolean type check.
                if (_.isBoolean(opts.displayProcessingFeedback) === false) {
                    ESDOC.events.trigger("global:error", {
                        type : 'Setup',
                        errors : ["Plugin displayProcessingFeedback option must be a boolean"]
                    });
                    return;
                } else {
                    this.options.displayProcessingFeedback = opts.displayProcessingFeedback;
                }
            }

            // Option : language.
            if (_.has(opts, 'language')) {
                this.options.language = opts.language;
            }

            // Option : ontology.
            if (_.has(opts, 'ontology')) {
                this.options.ontology = opts.ontology;
            }

            // Option : activePlugin.
            if (_.has(opts, 'activePlugin')) {
                // Validation : string type check.
                if (_.isString(opts.activePlugin) === false) {
                    ESDOC.events.trigger("global:error", {
                        type : 'Setup',
                        errors : ["ESDOC viewer activePlugin option must be a string"]
                    });
                    return;
                } else {
                    this.options.activePlugin = opts.activePlugin;
                }
            }

            // Option : shieldErrors.
            if (_.has(opts, 'shieldErrors')) {
                // Validation : boolean type check.
                if (_.isBoolean(opts.shieldErrors) === false) {
                    ESDOC.events.trigger("global:error", {
                        type : 'Setup',
                        errors : ["Plugin shieldErrors option must be a boolean"]
                    });
                    return;
                } else {
                    this.options.shieldErrors = opts.shieldErrors;
                }
            }
        }
    });

    // Set options related helper functions.
    _.extend(ESDOC, {
        // Raises a view options error.
        // @viewName    Name of view with invalid options.
        // @msg         Exception message.
        raiseViewOptionsError : function (viewName, msg) {
            var error;

            error = 'Invalid view options ({0}) : {1}.';
            error = error.replace('{0}', viewName);
            error = error.replace('{1}', msg);
            ESDOC.events.triggerError("View Options", error);
        },

        // Raises a required view options error.
        // @viewName    Name of view with invalid options.
        // @optionName  name of required option.
        raiseRequiredViewOptionError : function (viewName, optionName) {
            var error;

            error = '{0} is required.'.replace('{0}', optionName);
            ESDOC.raiseViewOptionsError(viewName, error);
        }
    });

}(this.ESDOC, this._));
