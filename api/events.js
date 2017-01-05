// --------------------------------------------------------
// api.events.js -  api module event listener.
// --------------------------------------------------------
(function(ESDOC) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // General error event handler.
    // @err         Error message.
    ESDOC.api.events.on("error", function(err) {
        var error;

        // Set error.
        error = {
            type : 'API',
            errors : [err]
        };

        // Bubble event.
        ESDOC.events.trigger("global:error", error);
    });

    // Web service error event handler.
    // @service         Service raising in error.
    // @operation       Service operation in error.
    // @exception       Service exception.
    ESDOC.api.events.on("webServiceError", function(service, operation, exception) {
        var error, err;

        // Set error msg.
        err = "An error occurred when invoking ESDOC web service:\n";
        err += "\tService\t: "+ service + "\n";
        err += "\tOperation\t: "+ operation + "\n";
        err += "\tError\t\t: " + exception.message + "\n";

        // Set error.
        error = {
            type : 'API',
            errors : [err]
        };

        // Bubble event.
        ESDOC.events.trigger("global:error", error);
    });

}(this.ESDOC));
