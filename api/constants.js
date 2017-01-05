// --------------------------------------------------------
// api.constants.js - constants used across api module.
// --------------------------------------------------------
(function(ESDOC) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare constants used within api.
    ESDOC.api.constants = {
        // Comparator urls.
        comparator : {
            GET_SETUP_DATA : '/data/compare.setup.{0}.{1}.jsonp'
        },

        // Publishing urls.
        publishing : {
            GET : '/2/publishing/{0}/{1}'
        },

        // Set of http constants.
        http : {
            // Jsonp callback function name.
            JSONP_CALLBACK_FN : 'onJSONPLoad',

            // Time in milliseconds before ajax callbacks are deemed to have timed out.
            JSONP_TIMEOUT : 10000
        }
    };

}(this.ESDOC));
