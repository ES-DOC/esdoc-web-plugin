// --------------------------------------------------------
// utils.view.group.js - a utility view over a grouped model.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // View class - group header.
    var GroupHeaderView = Backbone.View.extend({
        className : 'esdoc-group-header',
        
        // Backbone :: render function.
        render : function () {
            this.$el.text(this.options.group.caption);

            return this;
        }
    });

    // View class - group content.
    var GroupContentView = Backbone.View.extend({
        className : 'esdoc-group-content',

        // Backbone :: render function.
        render : function () {
            // Render content.
            ESDOC.utils.render(ESDOC.utils.views.List, _.defaults({
                viewCSS : 'esdoc-group-content',
                subViewType : ESDOC.utils.views.FieldSet,
                subViewCSS : 'esdoc-group-content-item'
            }, this.options), this);

            return this;
        }
    });

    // View class - group set.
    ESDOC.utils.views.GroupSet = Backbone.View.extend({
        className : 'esdoc-group-set',

        // Backbone :: render function.
        render : function () {
            // Defensive programming.
            if (!this._guard()) {
                return this;
            }

            // Render groups.
            _.each(this._getGroupSet(), function (group) {
                ESDOC.utils.render(ESDOC.utils.views.Group, _.defaults({
                    group : group,
                    model : group.model
                }, this.options), this);
            }, this);

            return this;
        },

        // View debug name.
        _debugName : 'GroupSet',

        // Ensures that rendering only occurs when conditions are correct.
        _guard : function () {
            if (!_.isArray(this.options.model)) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'model');
            }
            if (!_.isString(this.options.modelCSS)) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'modelCSS');
            }
            if (!_.isObject(this.options.groupSet) ||
                !_.isFunction(this.options.groupSet.factory) || 
                !_.isString(this.options.groupSet.groupingField)) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'groupSet');
            }
            return true;
        },

        // Returns the group set specified in view options.
        _getGroupSet : function () {
            var gs, opts = this.options.groupSet;

            // Get sorted group set.
            gs = opts.factory(this.options.model, this.options.documentSet);
            if (_.isString(opts, 'sortField')) {
                gs = _.sortBy(gs, opts.sortField);
            }

            // Assign group model.
            _.each(gs, function (g) {
                g.model = _.filter(this.model, function (model) {
                    return model[opts.groupingField] === g.key;
                }, this);
            }, this);

            // Exclude groups without data.
            gs = _.filter(gs, function (g) {
                return g.model.length;
            });
            
            return gs;
        }
    });
    
    // View class - group.
    ESDOC.utils.views.Group = Backbone.View.extend({
        // Backbone :: render function.
        render : function () {
            // Defensive programming.
            if (!this._guard()) {
                return this;
            }

            // Update css.
            ESDOC.utils.setCSS(this, 'group');

            // Render header.
            ESDOC.utils.render(GroupHeaderView, this.options, this);

            // Render content.
            ESDOC.utils.render(GroupContentView, this.options, this);

            return this;
        },

        // View debug name.
        _debugName : 'Group',

        // Ensures that rendering only occurs when conditions are correct.
        _guard : function () {
            if (!_.isArray(this.options.model)) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'model');
            }
            if (!_.isString(this.options.modelCSS)) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'modelCSS');
            }
            if (!_.isObject(this.options.group) ||
                !_.has(this.options.group, 'caption')) {
                return ESDOC.raiseRequiredViewOptionError(this._debugName, 'group');
            }
            return true;
        }
    });

}(this.ESDOC, this._, this.Backbone));
