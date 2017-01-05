(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Initialise.
    ESDOC.comparator = {
        // Event dispatcher.
        events : _.extend({ }, Backbone.Events),

        // Configuration sub-namespace.
        config : {},

        // Constants sub-namespace.
        constants : {},

        // Options altering module behaviour.
        options : {
            // User interface container.
            uiContainer : 'body'
        },

        // Set of comparator types.
        types : [
            'c1'
        ],

        // Set of comparator data parsers.
        parsers : {},

        // Set of comparator views.
        views : {}
    };

}(this.ESDOC, this._, this.Backbone));
