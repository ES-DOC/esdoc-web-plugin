// --------------------------------------------------------
// utils.view.buttonGroup.js - button group utility view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // View class - button group.
    ESDOC.utils.views.ButtonGroup = Backbone.View.extend({
        // Backbone :: css class name.
        className : 'esdoc-widget-button-group',

        // Backbone : constructor.
        initialize : function () {
            this._state = {};
        },

        // Backbone : destructor.
        destroy : function () {
            _.invoke(this._state.subViews, 'destroy');
            delete this._state;
        },

        // Backbone :: render function.
        render : function () {
            var myState = this._state;
            
            this._state.subViews = _.map(this.model, function (opts) {
                return ESDOC.utils.render(ESDOC.utils.views.Button, _.defaults({
                    onClickCallback : function (button) {
                        if (myState.selected) {
                            myState.selected.$el.removeClass('active');
                        }
                        myState.selected = button;
                        myState.selected.$el.addClass('active');
                        opts.onClickCallback(button);
                    }
                }, opts));
            }, this);
            
            _.each(this._state.subViews, function (subView) {
                this.$el.append(subView.$el);
            }, this);

            return this;
        }
    });

}(this.ESDOC, this._, this.Backbone));
