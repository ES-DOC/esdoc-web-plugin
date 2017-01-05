// -------------------------------------------------------- // tools/comparator/c1/viewOfTab1.js -  comparator c1 tab 1 view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Tab 1 toolbar view.
    var ToolbarView = Backbone.View.extend({
        // View css class.
        className : 'tab-1-toolbar',

        // View renderer.
        render : function () {
            // Render inner-views.
            ESDOC.utils.renderAll(ToolbarView.subViews, this.options, this);

            return this;
        }
    }, {
        // Set of sub-views.
        subViews : [
            ESDOC.comparator.views.C1Tab1ToolbarView
        ]
    });

    // Tab 1 header view.
    var HeaderView = Backbone.View.extend({
        // View css class.
        className : 'tab-1-header',

        // View renderer.
        render : function () {
            // Render inner-views.
            ESDOC.utils.renderAll(HeaderView.subViews, this.options, this);

            return this;
        }
    }, {
        // Set of sub-views.
        subViews : [            
            ESDOC.comparator.views.C1Tab1ModelListHeaderView,
            ESDOC.comparator.views.C1Tab1ComponentTreeHeaderView,
            ESDOC.comparator.views.C1Tab1PropertyTreeHeaderView
        ]
    });

    // Tab 1 content view.
    var ContentView = Backbone.View.extend({
        // View css class.
        className : 'tab-1-content',

        // View renderer.
        render : function () {
            // Render inner-views.
            ESDOC.utils.renderAll(ContentView.subViews, this.options, this);

            return this;
        }
    }, {
        // Set of sub-views.
        subViews : [
            ESDOC.comparator.views.C1Tab1ModelListContentView,
            ESDOC.comparator.views.C1Tab1ComponentTreeContentView,
            ESDOC.comparator.views.C1Tab1PropertyTreeContentView
        ]
    });

    // Tab 1 view.
    var View = Backbone.View.extend({
        // View dom id.
        id : 'tab1View',

        // View css class.
        className : 'tab-1',

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
            'comparatorC1:navigatedToTab1' : '_refresh',
            'comparatorC1:navigatedToTab2' : '_refresh'
        },

        // Refreshes view state.
        _refresh : function () {
            if (this.state.tab === 1) {
                this.$el.show();
            } else {
                this.$el.hide();
            }
        },

        // View renderer.
        render : function () {
            // Render inner views.
            ESDOC.utils.renderAll(View.subViews, this.options, this);

            return this;
        }
    }, {
        // Set of sub-views.
        subViews : [
            ToolbarView,
            HeaderView,
            ContentView
        ]        
    });

    // Expose views.
    _.extend(ESDOC.comparator.views, {
        C1Tab1View : View
    });

}(this.ESDOC, this._, this.Backbone));
