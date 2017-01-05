// --------------------------------------------------------
// api.parsers.js -  api module utility functions.
// --------------------------------------------------------
(function(ESDOC, $, _) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Appends a part to a url.
    // @url         URL being constructed.
    // @value       Part value.
    ESDOC.api.utils.appendURLPart = function (url, value) {
        if (!_.isUndefined(value)) {
            value = value.trim();
            if (value.length > 0) {
                url += '/' + value;
            }
        }
        return url;
    };

    // Returns an api url with the base address prepended.
    // @url         URL being constructed.
    ESDOC.api.utils.getURL = function ( url ) {
        return ESDOC.options.apiBaseURL + url;
    };

    // Returns a static url with the base address prepended.
    // @url         URL being constructed.
    ESDOC.api.utils.getStaticURL = function ( url ) {
        return ESDOC.options.staticBaseURL + url;
    };

    // Executes the query against backend api.
    // @params      Query parameters.
    // @query       Query handler.
    ESDOC.api.utils.doQuery = function( params, query ) {
        var parseParams,
            validateParams,
            invokeAPI,
            onAPISuccess,
            onAPIError;

        // Parse parameters.
        parseParams = function () {
            params.project = $.trim(params.project).toUpperCase();
        };

        // Default parameters validator.
        validateParams = function () {
            return true;
        };

        // Callback invoked when api invocation succeeds.
        onAPISuccess = function (data) {
            // Update timestamp.
            if (data.timestamp) {
                data.timestamp = new Date().getTime() - data.timestamp;
            }

            // Trigger event.
            ESDOC.api.events.trigger(query.eventName, data);

            // Signal background task end event.
            ESDOC.events.trigger("feedback:backgroundTaskEnd");
        };

        // Callback invoked when api invocation fails.
        onAPIError = function (xOptions, textStatus) {
            var error;

            // Signal background task end event.
            ESDOC.events.trigger("feedback:backgroundTaskEnd");

            // Set error.
            if (textStatus === 'timeout') {
                error = "The ES-DOC API has timed out - please try again.";
            } else {
                error = "An ES-DOC API error has occurred - please notify your system administrator.";
            }

            // Fire error event.
            ESDOC.events.trigger("global:error", {
                type : 'API',
                errors : [error]
            });
        };

        // Invoke api.
        invokeAPI = function () {
            var urlParams;

            // Signal background task event.
            if (query.backgroundProcessingMessage) {
                ESDOC.events.trigger("feedback:backgroundTask", query.backgroundProcessingMessage);
            }

            try {
                // Set query params.
                urlParams = query.getDefaultURLParams();
                if (_.isFunction(query.getCustomURLParams)) {
                    _.extend(urlParams, query.getCustomURLParams());
                }
                urlParams.timestamp = new Date().getTime();

                // Invoke jsonp endpoint.
                $.jsonp({
                    url: query.URL ? query.URL : query.getURL(),
                    data: urlParams,
                    dataFilter: query.dataFilter,
                    callbackParameter: ESDOC.api.constants.http.JSONP_CALLBACK_FN,
                    pageCache: true,
                    success: onAPISuccess,
                    timeout : ESDOC.api.constants.http.JSONP_TIMEOUT,
                    error : onAPIError
                });
            }
            catch (exception) {
                ESDOC.events.trigger("feedback:backgroundTaskEnd");
                ESDOC.api.events.trigger("webServiceError", 'query', query.name, exception);
                return;
            }
        };

        // Main line.
        try {
            if ( validateParams() === true &&
                 query.validateParams() === true ) {
                parseParams();
                if (_.isFunction(query.parseParams)) {
                    query.parseParams();
                }
                invokeAPI();
            }
        }
        catch (exception) {
            ESDOC.api.events.trigger("error", 'query', query.name, exception);
        }
    };

    // Downloads json from backend api.
    // @params      Query parameters.
    // @query       Query handler.
    ESDOC.api.utils.downloadJSON = function( params, query ) {
        var invokeAPI,
            onAPISuccess;

        // Callback invoked when api invocation succeeds.
        onAPISuccess = function (data) {
            // Apply data filter.
            data = query.dataFilter(data);

            // Trigger event.
            ESDOC.api.events.trigger(query.eventName, data);

            // Signal background task end event.
            ESDOC.events.trigger("feedback:backgroundTaskEnd");

            window.onESDOC_JSONPLoad = undefined;
        };

        // Invoke api.
        invokeAPI = function () {
            // Signal background task event.
            if (query.backgroundProcessingMessage) {
                ESDOC.events.trigger("feedback:backgroundTask", query.backgroundProcessingMessage);
            }

            // Expose callback.
            window.onESDOC_JSONPLoad = onAPISuccess;

            // Invoke API.
            try {
                $.ajax({
                    url : query.getURL(),
                    cache : false,
                    dataType : "jsonp",
                    jsonp : false,
                });
            }
            catch (exception) {
                ESDOC.events.trigger("feedback:backgroundTaskEnd");
                ESDOC.api.events.trigger("webServiceError", 'query', query.name, exception);
                return;
            }
        };

        // Main line.
        try {
            if ( query.validateParams() ) {
                invokeAPI();
            }
        }
        catch (exception) {
            ESDOC.api.events.trigger("error", 'query', query.name, exception);
        }
    };

    // Performs a parse over a set of documents returned from web service.
    // @documentSet       Set of documents to be parsed.
    ESDOC.api.utils.parseDocumentSet = function ( documentSet ) {
        var documentGroupSet;

        // Apply document set parsers.
        _.each(ESDOC.api.parsers.forDocumentSet, function(parser) {
            documentSet = parser(documentSet) || documentSet;
        });

        // Apply document group parsers.
        _.each(ESDOC.api.parsers.forDocumentGroupSet, function(parser) {
            documentGroupSet = parser(documentGroupSet, documentSet);
        });

        // Return all & grouped document sets.
        return {
            all : documentSet,
            groups : {
                all : documentGroupSet
            }
        };
    };

}(this.ESDOC, this.$, this._));

