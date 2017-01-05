// --------------------------------------------------------
// tools/comparator/c1/viewOfTab1PropertyTreeHeader.js -  comparator c1 tab 1 property tree header view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Tab 1: Property tree header view.
    var View = Backbone.View.extend({
        // View css class.
        className : 'header property-tree-header',

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
            'click #pAllSelectedPropertiesCheckBox' : function () {
                // Fire event(s).
                ESDOC.utils.fire(this, 'property:listChanging');

                // Update state.
                this.state.p.subset.isEachSelected = !this.state.p.subset.isEachSelected;
                ESDOC.utils.toggleSelection(this.state.p.subset.all,
                                          this.state.p.subset.isEachSelected);

                // Fire event(s).
                ESDOC.utils.fire(this, 'property:listChange');
            }
        },

        // Intra-view event handlers.
        listeners : {
            'comparatorC1:selectionStateResetted' : '_refresh',
            'component:itemChanged' : '_refresh',
            'property:itemChange' : '_refresh'
        },

        // View renderer.
        render : function () {
            this.$el.append(View.HTML());

            return this;
        },

        // Refreshes view according to current state.
        _refresh : function () {
            var $checkBox = this.$('#pAllSelectedPropertiesCheckBox');

            if (this.state.c.current &&
                this.state.p.subset.all.length) {
                if (this.state.p.subset.isEachSelected) {
                    $checkBox.prop('checked', 'true');
                } else {
                    $checkBox.removeAttr('checked');
                }
                $checkBox.removeAttr('disabled');
            } else {
                $checkBox.removeAttr('checked');
                $checkBox.attr('disabled', 'true');
            }
        }               
    }, {
        // View template.
        HTML : _.template("\n\
            <span class='caption'>3. Select Properties</span>\n\
            <span style='float:right'>\n\
                <label for='pAllSelectedPropertiesCheckBox' title='All'>All</label>\n\
                <input id='pAllSelectedPropertiesCheckBox' type='checkbox' disabled='true'/>\n\
            </span>")
    });

    // Expose views.
    _.extend(ESDOC.comparator.views, {
        C1Tab1PropertyTreeHeaderView : View
    });

}(this.ESDOC, this._, this.Backbone));