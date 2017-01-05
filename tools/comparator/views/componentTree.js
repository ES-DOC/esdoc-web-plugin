// --------------------------------------------------------
// tools/comparator/views/modelComponent.js -  comparator model component view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // View over a model component tree.
    var View = Backbone.View.extend({
        // View css class.
        className : 'component-tree',

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
            'comparatorC1:selectionStateResetted' : function () {
                this._refreshIndicator("selected-models-union", this._getUnion);
                this._refreshIndicator("selected-models-intersection", this._getIntersection);
            },
            'component:itemChanged' : function () {
                this._refreshItem();
            },
            'component:itemChanging' : function () {
                if (!ESDOC.utils.getSelectedCount(this.state.c.current.propertyList)) {
                    this.state.c.current.isSelected = false;
                }
                this.state.c.current.isCurrent = false;
                this._refreshItem();
            },
            'model:itemChanged' : function () {
                this._refreshIndicator("selected-models-union", this._getUnion);
                this._refreshIndicator("selected-models-intersection", this._getIntersection);
            },
            'model:itemSelectable' : function () {
                this._refreshIndicator("selectable-model", this._getSelectable);
            },
            'model:itemSelectableOff' : function () {
                this._refreshIndicator("selectable-model");
            },
            'model:listChanged' : function () {
                this._refreshIndicator("selected-models-union", this._getUnion);
                this._refreshIndicator("selected-models-intersection", this._getIntersection);
            }
        },

        // View renderer.
        render : function () {
            var opts = this.options,
                canRender,
                render;

            canRender = function (c) {
                return opts.itemRenderPredicate ?
                    opts.itemRenderPredicate(c) : true;
            };

            render = function (c) {
                ESDOC.utils.render(ESDOC.comparator.views.ComponentTreeNodeView, _.defaults({
                    container : this,
                    model : c
                }, opts), this);
                ESDOC.utils.render(ESDOC.utils.views.Separator, {}, this);
            };

            _.each(_.filter(this.state.c.all, canRender), render, this);

            return this;
        },

        // Marks item as selected.
        selectItem : function (c) {
            // Escape if reselecting current item.
            if (this.state.c.current === c) {
                return;
            }

            // Fire event(s).
            if (this.state.c.current) {
                ESDOC.utils.fire(this, 'component:itemChanging');
            }

            // Update state.
            c.isCurrent = true;
            c.isSelected = true;
            this.state.c.current = c;

            // Fire event(s).
            ESDOC.utils.fire(this, 'component:itemChange');
        },

        // Refreshes rendering of current item.
        _refreshItem : function () {
            var $c = this.$('.component-' + this.state.c.current.id);

            if (this.state.c.current.isSelected) {
                $c.addClass("is-selected");
            } else {
                $c.removeClass("is-selected");
            }
            if (this.state.c.current.isCurrent) {
                $c.addClass("is-current");
            } else {
                $c.removeClass("is-current");
            }
        },

        // Refreshes set of indicators.
        _refreshIndicator : function (state, cListFactory) {
            this.$('.item').removeClass(state);
            if (cListFactory) {
                _.each(cListFactory.call(this), function (c) {
                    this.$('.item[value="{0}"]'.replace('{0}', c.id)).addClass(state);
                }, this);
            }
        },

        // Returns intersection of components across all selected models.
        _getIntersection : function () {
            return _.reduce(this.state.m.selected, function (memo, m) {
                return memo.length ? _.intersection(memo, m.componentList) : m.componentList;
            }, []);
        },

        // Returns components for currently selectable model.
        _getSelectable: function () {
            return this.state.m.selectable.componentList;
        },

        // Returns union of components across all selected models.
        _getUnion: function () {
            return _.reduce(this.state.m.selected, function (memo, m) {
                return _.union(memo, m.componentList);
            }, []);
        }
    });

    // Expose views.
    _.extend(ESDOC.comparator.views, {
        ComponentTreeView : View
    });

}(this.ESDOC, this._, this.Backbone));
