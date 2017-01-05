// --------------------------------------------------------
// tools/comparator.events.js -  comparator module event listener.
// --------------------------------------------------------
(function(ESDOC, $) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Event handler triggered whenever a comparator exception occurs.
    // @exception      An exception.
    ESDOC.comparator.events.on("exception", function (exception) {
        var error;

        // Set error.
        error = {
            type : 'Comparator',
            errors : [exception.message]
        };

        // Trigger event.
        ESDOC.events.trigger("global:error", error);
    });

    // Event handler triggered whenever a comparator error occurs.
    // @errors      Set of errors.
    ESDOC.comparator.events.on("error", function (errors) {
        var error;

        // Set error.
        error = {
            type : 'Comparator',
            errors : errors
        };

        // Trigger event.
        ESDOC.events.trigger("global:error", error);
    });

    // Event handler triggered whenever api loads comparator setup data.
    // @data            Comparator setup data.
    ESDOC.api.events.on("comparatorSetupDataLoaded", function (setupData) {
        var view, ViewType, openWithDialog, openInline;
        
        // Opens comparator dialog.
        openWithDialog = function () {
            var dialog;
            
            // Initialise dialog.
            dialog = new ESDOC.utils.views.Dialog({
                onClose : function () {
                    view.destroy();
                }
            });

            // Render dialog.
            dialog.render();
            dialog.setTitle(setupData.project + ' - ' + setupData.title);
            dialog.$el.append(view.render().$el);

            // Open dialog.
            dialog.open();
        };

        // Opens comparator inline.
        openInline = function () {
            var $target;

            // Append target div.
            $target = $(ESDOC.comparator.options.uiContainer);
            if (!$target.length) {
                $target = $('body');
            }
            $target.append(view.render().$el);
        };

        // N.B. Handle exceptions as this is a module boundary.
        try {
            // Signal background task event.
            ESDOC.events.trigger("feedback:backgroundTask", 'Rendering Comparator View');

            // Remove previous.
            $('.esdoc-comparator').remove();

            // Initialise comparator view.
            ViewType = ESDOC.comparator.views[setupData.comparator.toUpperCase() + 'View'];
            view = new ViewType({
                project : setupData.project,
                projectCode : setupData.projectCode,
                model : setupData.data
            });

            // Display in relevant ui container.
            if (ESDOC.comparator.options.uiContainer === 'dialog') {
                openWithDialog();
            } else {
                openInline();
            }

            // TEMP :: Ensure background.
            $('.esdoc-comparator .esdoc-content-block').addClass('esdoc-content-block-background');
        }
        catch (exception) {
            ESDOC.comparator.events.trigger("exception", exception);
        }
    });

}(this.ESDOC, this.$));
