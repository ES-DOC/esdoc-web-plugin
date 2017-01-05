// --------------------------------------------------------
// tools/comparator/c1/viewOfTab1ComponentTree.js -  comparator c1 tab 1 component tree view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Tab 1: Component tree header view.
    var View = Backbone.View.extend({
        // View css class.
        className : 'header component-tree-header',

        // View renderer.
        render : function () {
            this.$el.append(View.HTML());

            return this;
        }
    }, {
        // View template.
        HTML : _.template("\n\
            <span class='caption'>2. Select Components</span>\n\
            <span class='indicator-headers'>\n\
                <span class='indicator-header'\n\
                      title='Intersect of components across selected models.'>&#8746;</span>\n\
                <span class='indicator-header'\n\
                      title='Union of components across selected models.'>&#8745;</span>\n\
            </span>")
    });

    // Expose views.
    _.extend(ESDOC.comparator.views, {
        C1Tab1ComponentTreeHeaderView : View
    });

}(this.ESDOC, this._, this.Backbone));