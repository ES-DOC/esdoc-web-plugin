// --------------------------------------------------------
// tools/comparator/views/modelComponentProperty.js -  comparator model component property view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // View over a model component property tree.
    var View = Backbone.View.extend({
        // View css class.
        className : 'property-tree',

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
            'property:listChanged' : '_refresh'
        },

        // View renderer.
        render : function () {   
            var canRender,
                render,
                opts = this.options;

            canRender = function (p) {
                return opts.itemRenderPredicate ?
                    opts.itemRenderPredicate(p) : true;
            };

            render = function (p) {
                ESDOC.utils.render(ESDOC.comparator.views.PropertyTreeNodeView, _.defaults({
                    container : this,
                    model : p
                }, opts), this);
                ESDOC.utils.render(ESDOC.utils.views.Separator, {}, this);
            };

            _.each(_.filter(this.state.c.current.propertyList, canRender), render, this);

            return this;
        },

        // Marks node as selected.
        selectItem : function (p) {
            var updateModel, updateView;

            // Fire event(s).
            ESDOC.utils.fire(this, 'property:itemChanging');

            // Update model.
            updateModel = function (property, isSelected) {
                property.isSelected = isSelected;
                _.each(property.children, function (childProperty) {
                    updateModel(childProperty, isSelected);
                });
            };
            updateModel(p, !p.isSelected);

            // Update view.
            updateView = function (property) {
                var $p;

                $p = this.$('.property-' + property.id);
                if (property.isSelected) {
                    $p.addClass("is-selected");
                } else {
                    $p.removeClass("is-selected");
                }
                _.each(property.children, updateView, this);
            };
            updateView.call(this, p);

            // Update state.
            this.state.p.current = p;

            // Fire event(s).
            ESDOC.utils.fire(this, 'property:itemChange');
        },

        _refresh : function () {
            if (!this.state.p.subset.selected.length) {
                this.$('.item').removeClass('is-selected');
            } else {
                this.$('.item').addClass('is-selected');
            }
        }
    });

    // Expose views.
    _.extend(ESDOC.comparator.views, {
        PropertyTreeView : View
    });

}(this.ESDOC, this._, this.Backbone));
