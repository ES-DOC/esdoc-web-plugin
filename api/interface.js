(function(ESDOC, $, _) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Helper vars.
    var _validation = ESDOC.utils.validation,
        _utils = ESDOC.api.utils;

    // Factory method to instantiate a query info instance.
    var createQuery = function (params,
                                name,
                                eventName,
                                url,
                                msg,
                                dataFilter,
                                dataFilterMsg,
                                urlParamFactory,
                                paramValidator) {
        return {
            // Message displayed whilst query is being executed.
            backgroundProcessingMessage : msg || 'Searching Document Repository',

            // Query data filter.
            dataFilter : function (data) {
                // Signal background task event.
                ESDOC.events.trigger("feedback:backgroundTask", dataFilterMsg || 'Parsing Data');

                // Convert to json object.
                if (!_.isObject(data)) {
                    data = JSON.parse(data);
                }

                // Apply custom data filter.
                if (_.isFunction(dataFilter)) {
                    data = dataFilter(data) || data;
                }

                return data;
            },

            // Event to be fired upon query execution.
            eventName : eventName,

            // Factory methd to create query default URL parameters.
            getDefaultURLParams : function () {
                return _.isFunction(urlParamFactory) ? urlParamFactory() : params;
            },

            // Name associated with query operation.
            name : name,

            // URL associated with query operation.
            URL : _utils.getURL(url),

            // Query parameter validation.
            validateParams : function () {
                return _.isFunction(paramValidator) ? paramValidator() : true;
            }
        };
    };

    // Factory method to create document query information.
    // @name                Name associated with query operation.
    // @params              List of parameters passed into query operation.
    // @mandatory           List of mandatory field names.
    // @optional            List of optional field names.
    var createDocumentQuery = function (name,
                                        params,
                                        mandatory,
                                        optional) {
        var getURLParams, validateParams;

        // Query URL parameter factory method.
        getURLParams = function () {
            var urlParams;

            // Set mandatory parameters.
            urlParams = {
                searchType : name,
                encoding : 'json',
                language : params.language,
                ontology : params.ontology,
                project : params.project
            };

            // Institute is optional.
            if (_.isString(params.institute) &&
                params.institute.length > 0) {
                _.extend(urlParams, {
                    institute : params.institute
                });
            }

            return urlParams;
        };

        // Query parameter validation.
        validateParams = function () {
            var errors = [];

            // Set default mandatory fields.
            mandatory = mandatory || [];
            mandatory = mandatory.concat(['ontology',
                                          'language',
                                          'project']);

            // Validate.
            if (_validation.isPlainObject(params, 'params', errors) === true) {
                _validation.areRequired(params, mandatory, errors);
                _validation.areStrings(params, mandatory, errors);
                if (_.isArray(optional)) {
                    // TODO validate optionals.
                }
            }

            // Report errors.
            if (errors.length > 0) {
                ESDOC.api.events.trigger("error", errors);
            }

            return errors.length === 0;
        };

        return createQuery(params,
                           name,
                           'documentSetLoaded',
                           ESDOC.api.constants.search.DO,
                           "Searching Document Repository",
                           _utils.parseDocumentSet,
                           "Parsing Document(s)",
                           getURLParams,
                           validateParams);
    };

    // Gets search engine setup data.
    // @params      Query parameters.
    ESDOC.api.search.getSetupData = function(params) {
        var query, dataFilter, getURL, getURLParams;

        // Query data filter.
        dataFilter = function (data) {
            var parsers;

            // Escape if there are no parsers.
            if (!_.has(ESDOC.api.parsers.forSearchEngineSetup, params.type)) return;

            // Execute parsers.
            parsers = ESDOC.api.parsers.forSearchEngineSetup[params.type];
            _.each(parsers, function (parser) {
                var parsed;

                // Parse.
                parsed = parser(data.data);

                // Update data if parser returns a result.
                if (parsed) {
                    data.data = parsed;
                }
            });
        };

        // Returns query URL.
        getURL = function () {
            var url;

            url = ESDOC.api.constants.search.SETUP;
            url = url.replace("{0}", params.type);

            return url;
        };

        // Initialise query info.
        query = createQuery({},
                            'setup',
                            'searchEngineSetupDataLoaded',
                            getURL(),
                            undefined,
                            dataFilter,
                            "Parsing Search Setup Data",
                            undefined,
                            undefined);

        // Invoke query.
        _utils.doQuery(params, query);
    };

    // Gets search engine results data.
    // @params      Query parameters.
    ESDOC.api.search.getResultsData = function(params) {
        var query, dataFilter;

        // Query data filter.
        dataFilter = function (data) {
            var parsers;

            // Escape if there are no parsers.
            if (!_.has(ESDOC.api.parsers.forSearchEngine, data.engine)) return;

            // Execute parsers.
            parsers = ESDOC.api.parsers.forSearchEngine[data.engine];
            _.each(parsers, function (parser) {
                var parsed;

                // Parse.
                parsed = parser(data.results);

                // Update data if parser returns a result.
                if (parsed) {
                    data.results = parsed;
                }
            });
        };

        // Initialise query info.
        query = createQuery(params,
                            'results',
                            'search:{0}:resultsLoaded'.replace('{0}', params.searchType),
                            ESDOC.api.constants.search.RESULTS,
                            undefined,
                            dataFilter,
                            "Parsing Setup Data",
                            undefined,
                            undefined);

        // Invoke query.
        _utils.doQuery(params, query);
    };

    // Gets a document set by external ID.
    // @params    Query parameters.
    ESDOC.api.search.getDocumentByExternalID = function(params) {
        var query;

        // Initialise query info.
        query = createDocumentQuery("documentByExternalID", params, ['externalID', 'externalType']);

        // Custom query url parameter factory.
        query.getCustomURLParams = function () {
            return {
                externalID : params.externalID,
                externalType : params.externalType
            };
        };

        // Invoke query.
        _utils.doQuery(params, query);
    };

    // Gets a document set by drs terms.
    // @params      Query parameters.
    ESDOC.api.search.getDocumentByDRS = function(params) {
        var query;

        // Initialise query info.
        query = createDocumentQuery("documentByDRS", params, ['drsPath']);

        // Custom query url parameter factory.
        query.getCustomURLParams = function () {
            return {
                drsPath : params.drsPath
            };
        };

        // Query parameter parsing.
        query.parseParams = function () {
            if (_.has(params, 'drsKeys') === false) {
                params.drsKeys = _.without(params.drsPath.split('/'), "");
            }
            params.drsPath = _.reduce(params.drsKeys, function (path, key) {
                return path + '/' + $.trim(key).toUpperCase();
            }, '');
        };

        // Invoke query.
        _utils.doQuery(params, query);
    };

    // Gets a document set by type name.
    // @params   Query parameters.
    ESDOC.api.search.getDocumentByName = function(params) {
        var query;

        // Initialise query info.
        query = createDocumentQuery("documentByName",
                                    params,
                                    ['type', 'name'],
                                    ['institute']);

        // Custom query url parameter factory.
        query.getCustomURLParams = function () {
            return {
                type : params.type,
                name : params.name
            };
        };

        // Query parameter parsing.
        query.parseParams = function () {
            params.type = params.type.toUpperCase();
            params.name = $.trim(params.name);
            params.name = params.name.toUpperCase();
        };

        // Invoke query.
        _utils.doQuery(params, query);
    };

    // Gets a document set by id.
    // @params   Query parameters.
    ESDOC.api.search.getDocumentByID = function(params) {
        var query;

        // Initialise query info.
        query = createDocumentQuery("documentByID", params, ['id'], ['version']);

        // Custom query url parameter factory.
        query.getCustomURLParams = function () {
            return {
                id : params.id,
                version : params.version
            };
        };

        // Invoke query.
        _utils.doQuery(params, query);
    };

    // Gets comparator setup data.
    // @params   Query parameters.
    ESDOC.api.comparator.getSetupData = function(params) {
        var query;

        // Initialise query info.
        query = {
            backgroundProcessingMessage : 'Downloading Setup Data',
            eventName : 'comparatorSetupDataLoaded',
            name : 'comparator.getSetupData'
        };

        // Query data filter.
        query.dataFilter = function (data) {
            // Signal background task event.
            ESDOC.events.trigger("feedback:backgroundTask", 'Parsing Setup Data');

            if (!_.isObject(data)) {
                data = JSON.parse(data);
            }
            if (_.has(ESDOC.api.parsers.forComparator, params.type)) {
                _.each(ESDOC.api.parsers.forComparator[params.type], function (parser) {
                    parser(data.data);
                });
            }
            return data;
        };

        // Query parameter validation.
        query.validateParams = function () {
            var errors = [],
                fields = ['type', 'project'];

            // Validate params.
            if (_validation.isPlainObject(params, 'params', errors) === true) {
                _validation.areRequired(params, fields, errors);
                _validation.areStrings(params, fields, errors);
                if (!errors.length &&
                    _.indexOf(ESDOC.comparator.types, params.type) === -1) {
                    errors.push('Comparator type unsupported.');
                }
            }

            // Report errors.
            if (errors.length > 0) {
                ESDOC.api.events.trigger("error", errors);
            }

            return errors.length === 0;
        };

        // Query url factory.
        query.getURL = function () {
            var url;

            url = ESDOC.api.constants.comparator.GET_SETUP_DATA;
            url = url.replace("{0}", params.project.toLowerCase());
            url = url.replace("{1}", params.type);

            return _utils.getStaticURL(url);
        };

        // Invoke query.
        _utils.downloadJSON(params, query);
    };

    // Gets visualizer setup data.
    // @params   Query parameters.
    ESDOC.api.visualizer.getSetupData = function(params) {
        var query;

        // Initialise query info.
        query = {
            backgroundProcessingMessage : 'Downloading Setup Data',
            eventName : 'visualizerSetupDataLoaded',
            name : 'visualizer.getSetupData'
        };

        // Query data filter.
        query.dataFilter = function (data) {
            // Signal background task event.
            ESDOC.events.trigger("feedback:backgroundTask", 'Parsing Setup Data');

            // Decode from json.
            if (!_.isObject(data)) {
                data = JSON.parse(data);
            }

            // Run parsers.
            if (_.has(ESDOC.api.parsers.forVisualizer, params.type)) {
                _.each(ESDOC.api.parsers.forVisualizer[params.type], function (parser) {
                    parser(data.data);
                });
            }

            return data;
        };

        // Query parameter validation.
        query.validateParams = function () {
            var errors = [],
                fields = ['type', 'project'];

            // Validate params.
            if (_validation.isPlainObject(params, 'params', errors) === true) {
                _validation.areRequired(params, fields, errors);
                _validation.areStrings(params, fields, errors);
                if (!errors.length &&
                    _.indexOf(ESDOC.visualizer.types, params.type) === -1) {
                    errors.push('Visualizer type unsupported.');
                }
            }

            // Report errors.
            if (errors.length > 0) {
                ESDOC.api.events.trigger("error", errors);
            }

            return errors.length === 0;
        };

        // Query url factory.
        query.getURL = function () {
            var url;

            url = _utils.getURL(ESDOC.api.constants.visualizer.GET_SETUP_DATA);
            url = _utils.appendURLPart(url, params.type);
            url = _utils.appendURLPart(url, params.project);

            return url;
        };

        // Query url params.
        query.urlParams = {
            encoding : 'json'
        };

        // Invoke query.
        _utils.doQuery(params, query);
    };

}(this.ESDOC, this.$, this._));
