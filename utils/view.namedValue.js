// --------------------------------------------------------
// utils.view.namedValue.js - a utility view over a named value pair.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Helpers used across this module.
    var my = {
        // HTML template helpers.
        HTML : {
            // Named value item.
            item : _.template("\n\
                <div class='esdoc-namedValue-name' title='<%= name %>'>\n\
                    <p><%= name %></p>\n\
                </div>\n\
                <div class='esdoc-namedValue-value' title='<%= value %>'>\n\
                    <p class='<%= modelCSS %>'><%= value %></p>\n\
                </div>\n\
                <div class='esdoc-namedValue-spacer'></div>")
        }
    };

    // View class - named value set.
    ESDOC.utils.views.NamedValueSet = Backbone.View.extend({
        className : 'esdoc-namedValue-set esdoc-content-block',

        // Backbone :: render function.
        render : function () {
            // Render sub-views.
            _.each(this.model, function (namedValue) {
                ESDOC.utils.render(ESDOC.utils.views.NamedValue, _.defaults({
                    model : namedValue
                }, this.options), this);
            }, this);

            return this;
        },

        // View debug name.
        _debugName : 'NamedValueSet',

        // Ensures that rendering only occurs when conditions are correct.
        _guard : function() {
            if (!_.isArray(this.model)) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'model');
            }
            if (!_.has(this.options, 'modelCSS')) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'modelCSS');
            }
            return true;
        }
    });

    // View class - named value.
    ESDOC.utils.views.NamedValue = Backbone.View.extend({
        className : 'esdoc-namedValue esdoc-content-item',

        // Backbone :: render function.
        render : function () {
            // Defensive programming.
            if (!this._guard()) {
                return this;
            }

            // Update html.
            this.$el.append(my.HTML.item(_.defaults({
                modelCSS : this.options.modelCSS
            }, this.options.model)));

            return this;
        },

        // View debug name.
        _debugName : 'NamedValue',

        // Ensures that rendering only occurs when conditions are correct.
        _guard : function() {
            if (!_.has(this.options, 'model')) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'model');
            }
            if (!_.has(this.options.model, 'name') ||
                !_.has(this.options.model, 'value')) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'model1');
            }
            if (!_.has(this.options, 'modelCSS')) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'modelCSS');
            }
            return true;
        }
    });

}(this.ESDOC, this._, this.Backbone));
