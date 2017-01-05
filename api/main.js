(function(ESDOC, $, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Intiialise api hooks.
    ESDOC.api = {
        // Event dispatcher.
        events : _.extend({ }, Backbone.Events),

        // Search endpoints.
        search : {},

        // Comparator endpoints.
        comparator : {},

        // Visualizer endpoints.
        visualizer : {},

        // Utilty functions hooks.
        utils : {}
    };
	
}(this.ESDOC, this.$, this._, this.Backbone));
