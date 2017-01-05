// --------------------------------------------------------
// tools/comparator/c1/viewOfTab2.js -  comparator c1 tab 2 view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Tab 2 toolbar view.
    var ToolbarView = Backbone.View.extend({
        // View css class.
        className : 'tab-2-toolbar',

        // View renderer.
        render : function () {
            // Render inner-views.
            ESDOC.utils.renderAll(ToolbarView.subViews, this.options, this);

            return this;
        }
    }, {
        // Set of sub-views.
        subViews : [
            ESDOC.comparator.views.C1Tab2ToolbarView
        ]
    });

    // Tab 2 summary view.
    var SummaryView = Backbone.View.extend({
        // View css class.
        className : 'tab-2-summary',

        // View renderer.
        render : function () {
            // Render inner-views.
            ESDOC.utils.renderAll(SummaryView.subViews, this.options, this);

            return this;
        }
    }, {
        // Set of sub-views.
        subViews : [
            ESDOC.comparator.views.C1Tab2SummaryView
        ]
    });

    // Tab 2 report view.
    var ReportView = Backbone.View.extend({
        // View css class.
        className : 'tab-2-report',

        // View renderer.
        render : function () {
            // Render inner-views.
            ESDOC.utils.renderAll(ReportView.subViews, this.options, this);

            return this;
        }
    }, {
        // Set of sub-views.
        subViews : [
            ESDOC.comparator.views.C1Tab2ReportView
        ]
    });

    // Tab 1 view.
    var View = Backbone.View.extend({
        // View dom id.
        id : 'tab2View',

        // View css class.
        className : 'tab-2',

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
            if (this.state.tab === 2) {
                this.$el.show();
            } else {
                this.$el.hide();
            }
        },

        // View renderer.
        render : function () {
            // Render inner views.
            ESDOC.utils.renderAll(View.subViews, this.options, this);

            // Initially hide.
            this.$el.hide();
            
            return this;
        }
    }, {
        // Set of sub-views.
        subViews : [
            ToolbarView,
            SummaryView,
            ReportView
        ]
    });

    // Expose views.
    _.extend(ESDOC.comparator.views, {
        C1Tab2View : View
    });


}(this.ESDOC, this._, this.Backbone));
