// --------------------------------------------------------
// tools/comparator/c1/viewOfTab1Toolbar.js -  comparator c1 tab 1 toolbar view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Tab 2: summary view.
    var View = Backbone.View.extend({
        // View css class.
        className : 'report summary',

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
            'comparatorC1:navigatedToTab2' : '_reset'
        },

        // Resets view according to current state.
        _reset : function () {
            var stats = 'Models = {0}, Components = {1}, Properties = {2}.';

            // Set selected stats.
            stats = stats.replace('{0}', this.state.m.selected.length);
            stats = stats.replace('{1}', this.state.c.selected.length);
            stats = stats.replace('{2}', this.state.p.selected.length);
            this.$('.stats').text(stats);
        },

        // View renderer.
        render : function () {
            this.$el.append(View.HTML(this.model));

            return this;
        }
    }, {
        HTML : _.template("\n\
            <span class='hint'>??? = Incomplete documentation.  N/A = Not applicable (model did not realize component).</span>\n\
            <span class='stats'/>")
    });

    // Expose views.
    _.extend(ESDOC.comparator.views, {
        C1Tab2SummaryView : View
    });

}(this.ESDOC, this._, this.Backbone));