// --------------------------------------------------------
// events.js :: Main cim events.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Set global event dispatcher.
    _.extend(ESDOC, {
        events : _.extend({
            triggerError : function (type, error) {
                ESDOC.events.trigger("global:error", {
                    type : type,
                    errors : [error]
                });
            }
        }, Backbone.Events)
    });

    // Event handler for global errors.
    // @error       Error being reported.
    ESDOC.events.on("global:error", function (error) {
        var ex, lr = '\n';

        // Format errors collection.
        if ( _.isUndefined(error.errors) ) {
            error.errors = "An unknown error has occurred.  If this persists please contact support @ es-doc.org";
        }
        if ( _.isArray(error.errors) === false ) {
            error.errors = [error.errors];
        }

        // Initialize exception.
        ex = new Error();
        ex.name = ESDOC.constants.app.getCaption();
        ex.name += " - {0} Error";
        ex.name = ex.name.replace('{0}', error.type);
        if (ESDOC.options.shieldErrors === true) {
            lr = '<br />';
        }
        ex.message = _.reduce(error.errors, function (memo, msg) {
            return memo + msg + lr;
        }, '');

        // Bubble up exception accordingly.
        if (ESDOC.options.shieldErrors === true) {
            ESDOC.events.trigger("feedback:error", ex.message, ex.name);
        } else {
            ESDOC.events.trigger("esdoc:error", ex);
        }
    });
    
}(this.ESDOC, this._, this.Backbone));
