// --------------------------------------------------------
// utils.view.feedback.js - user feedback utility view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";
    
    // Module variables.
    var MESSAGE_TYPE_INFORMATION = 1,
        MESSAGE_TYPE_CONFIRMATION = 2,
        MESSAGE_TYPE_PROGRESS = 3,
        MESSAGE_TYPE_HELP = 4,
        MESSAGE_TYPE_WARNING = 90,
        MESSAGE_TYPE_ERROR = 99,
        STANDARD_MESSAGE_UNKNOWN = "Unknown message",
        STANDARD_MESSAGE_ERROR = 'A processing error has occurred ... please contact the system administrator.';

    // Returns name of type.
    // @type        Message type.
    var getTypeName = function ( type ) {
        switch (type) {
            case MESSAGE_TYPE_INFORMATION:
                return 'information';
            case MESSAGE_TYPE_CONFIRMATION:
                return 'confirmation';
            case MESSAGE_TYPE_PROGRESS:
                return 'progress';
            case MESSAGE_TYPE_HELP:
                return 'help';
            case MESSAGE_TYPE_WARNING:
                return 'warning';
            case MESSAGE_TYPE_ERROR:
                return 'error';
            default:
                return 'information';
        }
    };

    // Returns name of top level css class.
    // @type        Message type.
    var getClassName = function( type ) {
        var typeName = getTypeName(type);
        return "esdoc-message esdoc-message-" + typeName;
    };

    // Returns name of icon related css class.
    // @type        Message type.
    var getIconClassName = function( type ) {
        var typeName = getTypeName(type);
        return "esdoc-message-icon esdoc-message-icon-" + typeName;
    };

    // Returns name of text related css class.
    // @type        Message type.
    var getTextClassName = function( type ) {
        var typeName = getTypeName(type);
        return "esdoc-message-text esdoc-message-text-" + typeName;
    };

    // View class.
    var FeedbackView = Backbone.View.extend({
        // Helper factory function.
        $make : function (tag, atts, text) {            
            return ESDOC.utils.$make(tag, atts, text);
        },

        // Event handler for on dialog closed event.
        destroy : function () {
            this.$el.dialog('close');
            this.$el.dialog('destroy');
            this.$el.remove();
        },

        // Renders view.
        // @type            Message type.
        // @text            Message text.
        // @caption         Message caption.
        // @continuation    Message continuation function.
        render : function (type, text, caption, continuation) {
            // Set ui.
            this._setup(type);
            this._setText(type, text);
            this._setTitle(type, caption);

            // Open.
            this.$el.dialog(this._createConfig(type, continuation));



            return this;
        },

        // Sets up ui in readiness for message to be displayed.
        // @type        Message type.
        _setup : function (type) {
            // Set root element css.
            this.className = getClassName(type);

            // Inject message icon.
            if (type !== MESSAGE_TYPE_PROGRESS) {
                this.$el.append(this.$make("div", { "class" : getIconClassName(type)}));
            }

            // Inject message text.
            this.$el.append(this.$make( "div", { "class" : getTextClassName(type)}));
        },

        // Sets message text.
        // @type        Message type.
        // @text        Message text.
        _setText : function (type, text) {
            if (_.isUndefined(text)) {
                if (type === MESSAGE_TYPE_ERROR) {
                    text = STANDARD_MESSAGE_ERROR;
                } else {
                    text = STANDARD_MESSAGE_UNKNOWN;
                }
            }
            this.$(".esdoc-message-text").html(text);
        },

        // Sets message title.
        // @type        Message type.
        // @caption     Message caption.
        _setTitle : function (type, caption) {
            var title = "";
            if (_.isString(caption)) {
                if (caption.startsWith(ESDOC.constants.app.getCaption())) {
                    title = caption;
                } else {
                    title = ESDOC.constants.app.getCaption();
                    title += " - ";
                    title += caption;
                }
            } else {
                title = ESDOC.constants.app.getCaption();
            }
            this.$el.attr('title', title);
        },

        // Returns message box configuration based on passed message type.
        // @type            Message type.
        // @continuation    Continuation function to be invoked if user responds in affirmative.
        _createConfig : function (type, continuation) {
            var view = this, config;
            
            // Default.
            config = {
                width : 380,
                position: ['center', 150],
                dialogClass: 'esdoc-widget esdoc-dialog esdoc-dialog-feedback',
                modal: true,
                resizable : false
            };

            // Minium height.
            if (type !== MESSAGE_TYPE_PROGRESS) {
                _.extend(config, {
                    minHeight: 120
                });
            } else {
                _.extend(config, {
                    height: 90
                });
            }

            // Single button message.
            if (type === MESSAGE_TYPE_INFORMATION ||
                type === MESSAGE_TYPE_HELP ||
                type === MESSAGE_TYPE_WARNING ||
                type === MESSAGE_TYPE_ERROR) {
                _.extend(config, {
                    buttons : {
                        'OK': function () {
                            view.destroy();
                            if (_.isFunction(continuation)) {
                                continuation();
                            }
                        }
                    }
                });
            }

            // Two button message.
            if (type === MESSAGE_TYPE_CONFIRMATION) {
                _.extend(config, {
                    'Yes': function () {
                        view.destroy();
                        if (_.isFunction(continuation)) {
                            continuation();
                        }
                    },
                    'No': function () {
                        view.destroy();
                    }
                });
            }
            
            return config;
        }
    });

    // Singleton progress feedback view.
    var progressFeedbackView;

    // Handler for confirmation message event.
    // @text      Message text.
    ESDOC.events.on("feedback:confirmation", function (text, caption, continuation) {
        new FeedbackView().render(MESSAGE_TYPE_CONFIRMATION, text, caption, continuation);
    });

    // Handler for background task event.
    // @text      Message text.
    // @caption   Message caption.
    ESDOC.events.on("feedback:backgroundTask", function (text, caption) {
        if (ESDOC.options.displayProcessingFeedback) {
            if (!progressFeedbackView) {
                progressFeedbackView = new FeedbackView().render(MESSAGE_TYPE_PROGRESS, text, caption);
            } else {
                progressFeedbackView.$(".esdoc-message-text").html(text);
                progressFeedbackView.$el.dialog('open');
            }
        }
    });

    // Handler for background task end event.
    ESDOC.events.on("feedback:backgroundTaskEnd", function () {
        if (progressFeedbackView) {
            progressFeedbackView.$el.dialog('close');
        }
    });

    // Handler for error message event.
    // @text      Message text.
    ESDOC.events.on("feedback:error", function (text, caption, continuation) {
        new FeedbackView().render(MESSAGE_TYPE_ERROR, text, caption, continuation);
    });

    // Handler for help message event.
    // @text      Message text.
    ESDOC.events.on("feedback:help", function (text, caption, continuation) {
        new FeedbackView().render(MESSAGE_TYPE_HELP, text, caption, continuation);
    });

    // Handler for information message event.
    // @text      Message text.
    ESDOC.events.on("feedback:information", function (text, caption, continuation) {
        new FeedbackView().render(MESSAGE_TYPE_INFORMATION, text, caption, continuation);
    });

    // Handler for warning message event.
    // @text      Message text.
    ESDOC.events.on("feedback:warning", function (text, caption, continuation) {
        new FeedbackView().render(MESSAGE_TYPE_WARNING, text, caption, continuation);
    });

}(this.ESDOC, this._, this.Backbone));
