// --------------------------------------------------------
// tools/comparator/views/model.js -  comparator model view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // View over a model list.
    var View = ESDOC.comparator.views.ModelListView = Backbone.View.extend({
        // View css class.
        className : 'model-list',

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
                this.$('.item').removeClass('is-selected');
            },
            'component:itemSelectable' : function () {
                this._refreshIndicator("selectable-component", 
                                       this._getModelsBySelectableComponent);
            },
            'component:itemSelectableOff' : function () {
                this._refreshIndicator("selectable-component");
            },
            'model:itemChanged' : function () {
                this._refreshItem(this.state.m.current);
            },
            'model:listChanged' : function () {
                _.each(this.state.m.all, this._refreshItem, this);
            }
        },

        // View renderer.
        render : function () {
            var canRender,
                render;

            canRender = function (m) {
                return this.options.itemRenderPredicate ?
                    this.options.itemRenderPredicate(m) : true;
            };

            render = function (m) {
                var options = _.defaults({
                    container : this,
                    model : m
                }, this.options);
                ESDOC.utils.render(ESDOC.comparator.views.ModelListItemView, options, this);
                ESDOC.utils.render(ESDOC.utils.views.Separator, {}, this);
            };

            _.each(_.filter(this.state.m.all, canRender, this), render, this);

            return this;
        },

        // Marks item as selected.
        // @m   Model being either selected or deselected.
        selectItem : function (m) {
            // Fire event(s).
            ESDOC.utils.fire(this, 'model:itemChanging');

            // Update state.
            m.isSelected = !m.isSelected;
            if (this.state.m.current !== m) {
                this.state.m.current = m;
            }

            // Fire event(s).
            ESDOC.utils.fire(this, 'model:itemChange');
        },

        // Refreshes item view state.
        // @m   Item for which view state is to be refreshed.
        _refreshItem : function (m) {
            var $m;

            $m = this.$('.model-' + m.id);
            if (m.isSelected) {
                $m.addClass("is-selected");
            } else {
                $m.removeClass("is-selected");
            }
        },

        // Refreshes set of indicators.
        _refreshIndicator : function (state, mListFactory) {
            this.$('.item').removeClass(state);
            if (mListFactory) {
                _.each(mListFactory.call(this), function (m) {
                    this.$('.item[value="{0}"]'.replace('{0}', m.id)).addClass(state);
                }, this);
            }
        },

        // Returns components for currently selectable component.
        _getModelsBySelectableComponent: function () {
            return this.state.c.selectable.modelList;
        }
    });

}(this.ESDOC, this._, this.Backbone));
