// --------------------------------------------------------
// utils.constants.js - constants used across application.
// --------------------------------------------------------
(function(ESDOC) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare defaults used within plugin.
    ESDOC.defaults = {
        project : ESDOC.utils.getURLParam('project', ESDOC.constants.projects[0]),
        rowsLimit : 200,
        pageLength : 20,
        document : {
            type : 'CIM.1.SOFTWARE.MODELCOMPONENT',
            experimentID : 0,
            instituteID : 0,
            version : 'latest',
            language : "en",
            languageID : 25,
            modelID : 0
        }
    };

    // Override unsupported defaults.
    if (_.indexOf(ESDOC.constants.projects, ESDOC.defaults.project) === -1) {
        ESDOC.defaults.project = ESDOC.constants.projects[0];
    }

}(this.ESDOC));