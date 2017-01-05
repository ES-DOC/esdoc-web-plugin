// --------------------------------------------------------
// tools/comparator/c1/viewOfTab1ComponentTree.js -  comparator c1 tab 1 component tree view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Tab 1: Component tree content view.
    var View = Backbone.View.extend({
        // View css class.
        className : 'content component-tree-content',

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
            'comparatorC1:selectionStateResetted' : '_reset'
        },

        // Resets view to original state.
        _reset : function () {
            this.$('.component-tree .item').removeClass('is-selected is-current');
        },

        // View renderer.
        render : function () {
            // Render inner view.
            ESDOC.utils.render(ESDOC.comparator.views.ComponentTreeView, _.defaults({
                itemRenderPredicate : function (c) {
                    return true;
                    return c.propertyTreeNodeCount > 0;
                }
            }, this.options), this);

            return this;
        }
    });

    // Expose views.
    _.extend(ESDOC.comparator.views, {
        C1Tab1ComponentTreeContentView : View
    });

}(this.ESDOC, this._, this.Backbone));