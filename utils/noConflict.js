// --------------------------------------------------------
// utils.noConflict.js - resets external dependencies used across application.
// --------------------------------------------------------
(function($, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    $.noConflict(true);
    _.noConflict();
    Backbone.noConflict();

}(this.$, this._, this.Backbone));
