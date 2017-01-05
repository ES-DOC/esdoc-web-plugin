// --------------------------------------------------------
// utils.view.dialog.js - dialog utility view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // View class.
    ESDOC.utils.views.Dialog = Backbone.View.extend({
        render : function () {
            var me = this;

            // Instantiate dialog.
            this.$el.dialog({
                bgiframe: false,
                autoOpen: false,
                height : me.options.height || 'auto',
                width: me.options.width || '1000',
                position: ['center', 100],
                modal: true,
                resizable: false,
                dialogClass: 'esdoc-widget esdoc-dialog',
                close : function () {
                    if (_.isUndefined(me.options.onClose) === false &&
                        _.isFunction(me.options.onClose)) {
                        me.options.onClose();
                    }
                    me.$el.dialog('destroy');
                    me.remove();
                }
            });

            return this;
        },

        // Append content to dialog.
        // @el   Dom element to be appended.
        append : function ( el ) {
            this.$el.append(el);
        },

        // Opens dialog for display.
        open : function () {
            this.$el.dialog('open');
        },

        // Set dialog title.
        // @caption       Title to be assigned.
        setTitle : function ( caption ) {
            var title = "";

            title = ESDOC.constants.app.getCaption();
            if (_.isUndefined(caption) === false) {
                title += " | ";
                title += caption;
            }
            this.$el.dialog('option', 'title', title);
        }
    });

}(this.ESDOC, this._, this.Backbone));
