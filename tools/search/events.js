// --------------------------------------------------------
// tools/search.events.js -  search module event listener.
// --------------------------------------------------------
(function(ESDOC, $) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Event handler triggered whenever a search exception occurs.
    // @exception      An exception.
    ESDOC.search.events.on("exception", function (exception) {
        var error;

        // Set error.
        error = {
            type : 'Comparator',
            errors : [exception.message]
        };

        // Trigger event.
        ESDOC.events.trigger("global:error", error);
    });

    // Event handler triggered whenever a search error occurs.
    // @errors      Set of errors.
    ESDOC.search.events.on("error", function (errors) {
        var error;

        // Set error.
        error = {
            type : 'Comparator',
            errors : errors
        };

        // Trigger event.
        ESDOC.events.trigger("global:error", error);
    });

    // Event handler triggered whenever api loads search engine setup data.
    // @data            Search engine setup data.
    ESDOC.api.events.on("searchEngineSetupDataLoaded", function (setupData) {
        var view, ViewType, openWithDialog, openInline;

        // Opens search engine dialog.
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

        // Opens search engine inline.
        openInline = function () {
            var $target;

            // Append target div.
            $target = $(ESDOC.search.options.uiContainer);
            if (!$target.length) {
                $target = $('body');
            }
            $target.append(view.render().$el);
        };

        // N.B. Handle exceptions as this is a module boundary.
        try {
            // Signal background task event.
            ESDOC.events.trigger("feedback:backgroundTask", 'Rendering Search View');

            // Remove previous.
            $('.esdoc-search').remove();

            // Initialise view.
            ViewType = setupData.engine.toUpperCase() + 'View';
            ViewType = ESDOC.search.views[ViewType];
            view = new ViewType({
                project : setupData.project,
                model : setupData.data
            });

            // Display in relevant ui container.
            if (ESDOC.search.options.uiContainer === 'dialog') {
                openWithDialog();
            } else {
                openInline();
            }

            // Fire search event.
            ESDOC.utils.fire(view, 'search:' + setupData.engine + ':execute');

            // TEMP :: Ensure background.
            $('.esdoc-search .esdoc-content-block').addClass('esdoc-content-block-background');
        }
        catch (exception) {
            ESDOC.search.events.trigger("exception", exception);
        }
    });

}(this.ESDOC, this.$));
