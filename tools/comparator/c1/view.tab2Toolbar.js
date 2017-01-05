// --------------------------------------------------------
// tools/comparator/c1/viewOfTab1Toolbar.js -  comparator c1 tab 1 toolbar view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Tab 2: toolbar view.
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

        // Intra-view event handlers.
        listeners : {
            'comparatorC1:displayReportInCSVFormat' : '_refresh',
            'comparatorC1:displayReportInHTMLFormat' : '_refresh'
        },

        // View events.
        events : {
            'click .button.csv.is-active' : function () {
                ESDOC.utils.fire(this, 'comparatorC1:displayReportInCSVFormat');
            },
            'click .button.html.is-active' : function () {
                ESDOC.utils.fire(this, 'comparatorC1:displayReportInHTMLFormat');
            },
            'click .button.back.is-active' : function () {
                ESDOC.utils.fire(this, 'comparatorC1:navigateToTab1');
            },
            'click .button.help.is-active' : function () {
                ESDOC.utils.openURL(ESDOC.comparator.constants.c1.TAB2_HELP_URL, true);
            }
        },

        // View renderer.
        render : function () {
            this.$el.append(View.HTML(this.model));
            this.$('.caption').attr('value', this.$('.caption').text().trim());
            this._refresh();

            return this;
        },

        // Refreshes view state.        
        _refresh : function () {
            switch (this.state.report.format) {
                case 'csv':
                    this.$('.button.csv').hide();
                    this.$('.button.html').show();
                    this.$('.caption').text('Step 2 : Copy CSV to clipboard and export to a spreadsheet');
                    break;
                case 'html':
                    this.$('.button.csv').show();
                    this.$('.button.html').hide();
                    this.$('.caption').text('Step 2 : View report table');
                    break;
            }
            this.$('.caption').attr('title', this.$('.caption').text());
        }
    }, {
        HTML : _.template("\n\
            <span class='caption' />\n\
            <span class='buttons'>\n\
                <span class='button back is-active' \n\
                      title='Return to model component property selection'>Back</span>\n\
                <span class='button csv is-active'\n\
                      title='View report in CSV format'>CSV</span>\n\
                <span class='button html is-active'\n\
                      title='View report in HTML format'>HTML</span>\n\
                <span class='button help is-active'\n\
                      title='View help information'>Help</span>\n\
            </span>")
    });

    // Expose views.
    _.extend(ESDOC.comparator.views, {
        C1Tab2ToolbarView : View
    });

}(this.ESDOC, this._, this.Backbone));