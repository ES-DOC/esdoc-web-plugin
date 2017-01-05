(function (root, ESDOC) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Initialise.
    ESDOC.viewer = {
        // View configuration.
        config : {},

        // View _options.
        options : {},
    };

    // Backwards compatibilty workarounds.
    root.cim.viewer = ESDOC.viewer;
    root.CIM.viewer = ESDOC.viewer;

}(
    this,
    this.ESDOC
));