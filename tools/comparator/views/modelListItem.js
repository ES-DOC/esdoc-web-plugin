// --------------------------------------------------------
// tools/comparator/views/model.js -  comparator model view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // View over a model list item.
    var View = ESDOC.comparator.views.ModelListItemView = Backbone.View.extend({
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
            'click .view' : function () {
                this._openViewer();
            },
            'click .selection-target' : function () {
                if (this.options.container) {
                    this.options.container.selectItem(this.model);
                }
            },
            'mouseover .selection-target' : function () {
                // Update state.
                this.state.m.selectable = this.model;

                // Fire event(s).
                ESDOC.utils.fire(this, 'model:itemSelectable');
            },
            'mouseout .selection-target' : function () {
                // Update state.
                this.state.m.selectable = undefined;

                // Fire event(s).
                ESDOC.utils.fire(this, 'model:itemSelectableOff');
            }
        },

        // View renderer.
        render : function () {
            this.$el.attr('value', this.model.id);
            this.$el.addClass('model-' + this.model.id);
            this.$el.append(View.HTML(this.model));

            return this;
        },

        // Opens embedded viewer.
        _openViewer : function () {
            ESDOC.viewer.renderFromName({
                institute: this.model.institute,
                project: this.state.projectCode,
                name: this.model.name,
                type: "cim.1.software.ModelComponent"
            });
        }
    }, {
        // View template.
        HTML : _.template("\n\
            <span class='name selection-target'>\n\
                <span class='text' \n\
                      title='<%- value %>'><%- value %>\n\
                </span>\n\
            </span>\n\
            <span class='view'>\n\
                <span class='text' \n\
                      title='view information'>view\n\
                </span>\n\
            </span>\n\
            <span class='indicators'>\n\
                <span class='indicator' />\n\
            </span>")
    });

}(this.ESDOC, this._, this.Backbone));



