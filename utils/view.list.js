// --------------------------------------------------------
// utils.view.list.js - a utility view over a collection model.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // View class.
    ESDOC.utils.views.List = Backbone.View.extend({
        className : 'esdoc-list',
        
        // Backbone :: render function.
        render : function () {
            // Defensive programming.
            if (!this._guard()) {
                return this;
            }

            // Update css.
            ESDOC.utils.setCSS(this, 'list');

            // Render item views.
            _.each(this.model, function (item) {
                ESDOC.utils.render(this.options.subViewType, _.defaults({
                    model : item,
                    viewCSS : this.options.subViewCSS ? this.options.subViewCSS + 'esdoc-list-item' : 'esdoc-list-item'
                }, this.options), this);
                ESDOC.utils.render(ESDOC.utils.views.Separator, {}, this);
            }, this);

            return this;
        },

        // View debug name.
        _debugName : 'list',

        // Ensures that rendering only occurs when conditions are correct.
        _guard : function() {
            if (!_.isArray(this.options.model)) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'model');
            }
            if (!_.isString(this.options.modelCSS)) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'modelCSS');
            }
            if (!_.isObject(this.options, 'subViewType')) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'subViewType');
            }
            return true;
        }
    });

}(this.ESDOC, this._, this.Backbone));
