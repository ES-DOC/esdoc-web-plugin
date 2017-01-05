// --------------------------------------------------------
// tools/comparator/c1/viewOfTab1ModelListHeader.js -  comparator c1 tab 1 model list header view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Model list header.
    var View = ESDOC.comparator.views.C1Tab1ModelListHeaderView = Backbone.View.extend({
        // View css class.
        className : 'header model-list-header ui-corner-all ',

        // Ctor.
        initialize : function () {
            ESDOC.utils.initialize(this);
        },

        // Dtor.
        destroy : function () {
            ESDOC.utils.destroy(this);
        },

        // View events.
        events : {
            'click #mAllSelectedModelsCheckBox' : function () {
                // Fire event(s).
                ESDOC.utils.fire(this, 'model:listChanging');

                // Update state.
                this.state.m.isEachSelected = !this.state.m.isEachSelected;
                ESDOC.utils.toggleSelection(this.state.m.all, this.state.m.isEachSelected);

                // Fire event(s).
                ESDOC.utils.fire(this, 'model:listChange');
            }
        },

        // Intra-view event handlers.
        listeners : {
            'comparatorC1:selectionStateResetted' : '_refresh',
            'model:itemChanged' : '_refresh'
        },

        // View renderer.
        render : function () {
            this.$el.append(View.HTML());

            return this;
        },

        // Refreshes view according to current state.
        _refresh : function () {
            var $checkBox;

            $checkBox = this.$('#mAllSelectedModelsCheckBox');
            if (this.state.m.isEachSelected ) {
                $checkBox.prop('checked', 'true');
            } else {
                $checkBox.removeAttr('checked');
            }
        }
    }, {
        // View template.
        HTML : _.template("\n\
            <span class='caption'>1. Select Models</span>\n\
            <span style='float:right'>\n\
                <label for='mAllSelectedModelsCheckBox' title='All'>All</label>\n\
                <input id='mAllSelectedModelsCheckBox' type='checkbox'/>\n\
            </span>")
    });

}(this.ESDOC, this._, this.Backbone));