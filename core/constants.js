// --------------------------------------------------------
// utils.constants.js - constants used across application.
// --------------------------------------------------------
(function(ESDOC) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Declare constants used within plugin.
    ESDOC.constants = {
        // Application constants.
        app : {
            // Returns title.
            getTitle : function () {
                return ESDOC.NAME;
            },

            // Returns version.
            getVersion : function () {
                var result;
                result = ' (v';
                result += ESDOC.VERSION;
                result += ')';
                return result;
            },

            // Returns caption.
            getCaption : function (includeVersion) {
                var caption;
                caption = ESDOC.NAME;
                caption += ' - ';
                caption += ESDOC.options.activePlugin;
                if (includeVersion) {
                    caption += ' (v';
                    caption += ESDOC.VERSION;
                    caption += ')';
                }
                return caption;
            }
        },

        // Set of email related constants.
        email : {
            // Contact email.
            contact : "support@es-doc.org",

            // Support email.
            support : "support@es-doc.org",

            // Default email subject.
            defaultSubject : 'ES-DOC :: subject goes here',

            // Default email message.
            defaultMessage : ""
        },

        // Set of supported projects.
        projects : [
            'CMIP5', 'DCMIP-2012', 'QED-2013'
        ]
    };

}(this.ESDOC));
