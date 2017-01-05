// --------------------------------------------------------
// utils.view.field.js - a utility view over a field, i.e. a name/path pair.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Helpers used across this module.
    var my = {
        // HTML template helpers.
        HTML : {
            // Item view HTML.
            item : {
                // Dynamically compiled item view template.
                template1 : "\n\
                    <div class='esdoc-field-caption' title='{caption}'>{caption}</div>\n\
                    <div class='esdoc-field-expression {css}'\n\
                         title='<%- {expression} %>'><%- {expression} %></div>\n\
                    <div class='esdoc-field-spacer'></div>",

                // Dynamically compiled item view template.
                template2 : "\n\
                    <div class='esdoc-field-caption' title='{caption}'>{caption}</div>\n\
                    <div class='esdoc-field-expression {css}'\n\
                         title='<%- {expression} %>'><a href='<%- {hyperlink} %>'><%- {expression} %></a></div>\n\
                    <div class='esdoc-field-spacer'></div>",
                
                // Factory function to render associated template.
                // @field           Field being processed.
                render : function (field) {
                    var html,
                        css;
                    

                    // Set css.
                    css = field.modelCSS.trim();
                    css += '-';
                    css += field.expression.trim().replace('.', '-');

                    // Set html.
                    if (field.hyperlink) {
                        html = my.HTML.item.template2;
                        html = html.replace(/{hyperlink}/g, field.hyperlink.trim());
                    } else {
                        html = my.HTML.item.template1;
                    }
                    html = html.replace(/{caption}/g, field.caption.trim());
                    html = html.replace(/{expression}/g, field.expression.trim());
                    html = html.replace(/{css}/g, css);

                    return _.template(html)(field.model);
                }
            }
        }
    };

    // View class - field set.
    ESDOC.utils.views.FieldSet = Backbone.View.extend({
        // Backbone :: css class name.
        className : 'esdoc-field-set esdoc-content-block',

        // Backbone :: render function.
        render : function () {
            // Defensive programming.
            if (!this._guard()) {
                return this;
            }

            // Render sub-views.
            _.each(this._getFieldSet(), function (field) {
                ESDOC.utils.render(ESDOC.utils.views.Field, _.defaults({
                    field : field
                }, this.options), this);
            }, this);

            return this;
        },

        // View debug name.
        _debugName : 'FieldSet',

        // Ensures that rendering only occurs when conditions are correct.
        _guard : function() {
            if (!_.isObject(this.options.model)) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'model');
            }
            if (!_.isString(this.options.modelCSS)) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'modelCSS');
            }
            if (!_.isFunction(this.options.fieldSetFactory)) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'fieldSetFactory');
            }
            return true;
        },

        // Returns the field set specified in view options.
        _getFieldSet : function () {
            return ESDOC.utils.toObjectArray(
                this.options.fieldSetFactory(this.options.model, this.options.documentSet),
                                             ['caption', 'expression', 'hyperlink']);
        }
    });

    // View class - field.
    ESDOC.utils.views.Field = Backbone.View.extend({
        // Backbone :: css class name.
        className : 'esdoc-field esdoc-content-item',

        // Backbone :: render function.
        render : function () {
            // Defensive programming.
            if (!this._guard()) {
                return this;
            }

            // Update css.
            if (this.options.viewCSS) {
                ESDOC.utils.setCSS(this, this.options.viewCSS);
            }
            
            // Render html.
            this.$el.append(my.HTML.item.render(_.defaults({
                model : this.options.model,
                modelCSS : this.options.modelCSS
            }, this.options.field)));

            return this;
        },

        // View debug name.
        _debugName : 'Field',

        // Ensures that rendering only occurs when conditions are correct.
        _guard : function() {
            if (!_.isObject(this.options.model)) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'model');
            }
            if (!_.isString(this.options.modelCSS)) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'modelCSS');
            }
            if (!_.isObject(this.options.field) ||
                !_.has(this.options.field, 'caption') ||
                !_.has(this.options.field, 'expression')) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'field');
            }
            return true;
        }
    });

}(this.ESDOC, this._, this.Backbone));
