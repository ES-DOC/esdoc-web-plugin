// --------------------------------------------------------
// tools/comparator/c1/viewOfTab1PropertyTreeContent.js -  comparator c1 tab 1 property tree content view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Tab 1: Property tree content view.
    var View = Backbone.View.extend({
        // View css class.
        className : 'content property-tree-content',

        // Ctor.
        initialize : function () {
            ESDOC.utils.initialize(this);
        },

        // Dtor.
        destroy : function () {
            ESDOC.utils.destroy(this);
        },

        // Intra-view event handlers.
        listeners : {
            'comparatorC1:selectionStateResetted' : '_reset',
            'component:itemChanged' : '_refresh'
        },

        // Resets view to original state.
        _reset : function () {
            this.$('.property-tree').remove();
        },

        // Refreshes view according to current state.
        _refresh : function () {
            // Remove inner view.
            this.$('.property-tree').remove();
            
            // Escape if state is invalid.
            if (!this.state.c.current) {
                return;
            }

            // Render inner view.
            ESDOC.utils.render(
                ESDOC.comparator.views.PropertyTreeView,
                _.defaults({
                    model : this.state.p.subset.tree
                }, this.options),
                this
            );
        }
    });

    // Expose views.
    _.extend(ESDOC.comparator.views, {
        C1Tab1PropertyTreeContentView : View
    });

}(this.ESDOC, this._, this.Backbone));