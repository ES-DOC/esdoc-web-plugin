// --------------------------------------------------------
// tools/comparator/c1/viewOfTab1Toolbar.js -  comparator c1 tab 1 toolbar view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Tab 1: toolbar view.
    var View = Backbone.View.extend({
        // View css class.
        className : 'toolbar',

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
            'click .button.help.is-active' : function () {
                ESDOC.utils.openURL(ESDOC.comparator.constants.c1.TAB1_HELP_URL, true);
            },
            'click .button.next.is-active' : function () {
                ESDOC.utils.fire(this, 'comparatorC1:navigatingToTab2');
            },
            'click .button.reset.is-active' : function () {
                ESDOC.utils.fire(this, 'comparatorC1:selectionStateResetting');
                ESDOC.utils.fire(this, 'comparatorC1:selectionStateReset');
            }
        },

        // Intra-view event handlers.
        listeners : {
            'comparatorC1:selectionStateResetted' : '_refresh',
            'model:itemChanged' : '_refresh',
            'model:listChanged' : '_refresh',
            'property:itemChange' : '_refresh',
            'property:listChanged' : '_refresh'
        },

        // View renderer.
        render : function () {
            this.$el.append(View.HTML(this.model));
            this.$('.caption').attr('value', this.$('.caption').text().trim());

            return this;
        },

        // Refreshes view according to current state.
        _refresh : function () {
            var $next, $reset;

            $next = this.$('.button.next');
            if (this.state.m.selected.length && this.state.p.selected.length) {
                $next.addClass('is-active');
            } else {
                $next.removeClass('is-active');
            }

            $reset = this.$('.button.reset');
            if (this.state.m.selected.length || this.state.p.selected.length) {
                $reset.addClass('is-active');
            } else {
                $reset.removeClass('is-active');
            }
        }
    }, {
        HTML : _.template("\n\
            <span class='caption'>\n\
                Step 1 : Select Model Component Properties\n\
            </span>\n\
            <span class='buttons'>\n\
                <span class='button next' \n\
                      title='Navigate to report viewer screen'>Next</span>\n\
                <span class='button reset'\n\
                      title='Reset selections'>Reset</span>\n\
                <span class='button help is-active'\n\
                      title='View help information'>Help</span>\n\
            </span>")
    });

    // Expose views.
    _.extend(ESDOC.comparator.views, {
        C1Tab1ToolbarView : View
    });

}(this.ESDOC, this._, this.Backbone));