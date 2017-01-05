// --------------------------------------------------------
// tools/comparator/views/modelComponent.js -  comparator model component view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // View over a model component tree node.    
    var View = Backbone.View.extend({
        // View css class.
        className : 'item selectable',

        // Ctor.
        initialize : function () {
            ESDOC.utils.initialize(this);
        },

        // Dtor.
        destroy : function () {
            ESDOC.utils.destroy(this);
        },  
        
        // View events.
        events : {
            'click .name' : function () {
                if (this.options.container) {
                    this.options.container.selectItem(this.model);
                }
            },
            'dblclick .name' : function () {
                // Fire event(s).
                ESDOC.utils.fire(this, 'component:associatedModelsSelect');
            },
            'mouseover' : function () {
                // Update state.
                this.state.c.selectable = this.model;

                // Fire event(s).
                ESDOC.utils.fire(this, 'component:itemSelectable');
            },
            'mouseout' : function () {
                // Update state.
                this.state.c.selectable = undefined;

                // Fire event(s).
                ESDOC.utils.fire(this, 'component:itemSelectableOff');
            }
        },          

        // View renderer.
        render : function () {
            this.$el.addClass('depth-' + this.model.depth);
            if (this.model.isSelected) {
                this.$el.addClass('is-selected');
            }
            this.$el.attr('value', this.model.id);
            this.$el.addClass('component-' + this.model.id);
            this.$el.append(View.HTML(this.model));

            return this;
        }
    }, {
        // View template.
        HTML : _.template("\n\
            <span class='name selection-target'>\n\
                <span class='text' \n\
                      title='<%- value %>'><%- value %>\n\
                </span>\n\
            </span>\n\
            <span class='indicators'>\n\
                <span class='indicator selectable-model' />\n\
                <span class='indicator selected-models-intersection' />\n\
                <span class='indicator selected-models-union' />\n\
            </span>")
    });

    // Expose views.
    _.extend(ESDOC.comparator.views, {
        ComponentTreeNodeView : View
    });

}(this.ESDOC, this._, this.Backbone));
