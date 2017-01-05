// --------------------------------------------------------
// tools/comparator/c1/viewOfTab1ModelListContent.js -  comparator c1 tab 1 model list content view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Tab 1: Model list content.
    ESDOC.comparator.views.C1Tab1ModelListContentView = Backbone.View.extend({
        // View css class.
        className : 'content model-list-content',

        // View renderer.
        render : function () {
            // Render inner view.
            ESDOC.utils.render(ESDOC.comparator.views.ModelListView, this.options, this);

            return this;
        }
    });

}(this.ESDOC, this._, this.Backbone));