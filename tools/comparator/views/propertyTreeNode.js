// --------------------------------------------------------
// tools/comparator/views/modelComponentProperty.js -  comparator model component property view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // View over a model component property tree node.
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
            'click' : function () {
                if (this.options.container) {
                    this.options.container.selectItem(this.model);
                }
            }
        },

        // View renderer.
        render : function () {
            this.$el.addClass('depth-' + this.model.depth);
            this.$el.addClass('property-' + this.model.id);
            if (this.model.isSelected) {
                this.$el.addClass('is-selected');
            }
            this.$el.attr('value', this.model.id);
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
            </span>")
    });

    // Expose views.
    _.extend(ESDOC.comparator.views, {
        PropertyTreeNodeView : View
    });

}(this.ESDOC, this._, this.Backbone));
