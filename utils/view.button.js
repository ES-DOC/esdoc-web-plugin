// --------------------------------------------------------
// utils.view.button.js - button utility view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // View class - button.
    ESDOC.utils.views.Button = Backbone.View.extend({
        // Backbone :: html tag name.
        tagName : 'a',

        // Backbone :: css class name.
        className : 'esdoc-widget-button',

        // Backbone : events.
        events: {
            "click" : function () {
                if (_.isFunction(this.options.onClickCallback)) {
                    this.options.onClickCallback(this);
                }
            }
        },

        // Backbone :: render function.
        render : function () {
            if (this.options.id) {
                this.$el.attr('id', this.options.id);
            }
            this.$el.text(this.options.caption);

            return this;
        }
    });

}(this.ESDOC, this._, this.Backbone));
