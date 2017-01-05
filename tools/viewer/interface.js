// --------------------------------------------------------
// tools/viewer/interface.js - viewer public entry point.
// --------------------------------------------------------
(function(ESDOC, _) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Helper vars.
    var viewer = ESDOC.viewer,
        viewerBaseURL,
        validateParams,
        renderFromExternalID;

    // Set viewer base url.
    if (window.location.host) {
        if (window.location.host.indexOf('test') >= 0 &&
            window.location.host.indexOf('es-doc.org') >= 0) {
            viewerBaseURL = 'http://test.view.es-doc.org';
        } else {
            viewerBaseURL = 'http://view.es-doc.org';
        }
    } else {
        viewerBaseURL = '../../esdoc-web/viewer/index.html';
    }

    // Performs standard parameter validation.
    // @params   Rendering parameters.
    // @fields   Expected fields.
    // @optional Optional fields.
    validateParams = function (params, fields, optional) {
        var errors = [],
            validator = ESDOC.utils.validation;

        // Validate.
        if (validator.isPlainObject(params, 'params', errors)) {
            validator.areRequired(params, fields, errors);
            if (_.has(params, 'version')) {
                fields.push('version');
            }
            if (optional) {
                _.each(optional, function (f) {
                    if (_.has(params, f)) {
                        fields.push(f);
                    }
                });
            }
            validator.areStrings(params, fields, errors);
        }

        // Report errors.
        if (errors.length) {
            ESDOC.events.trigger("error", errors);
        }

        return errors.length === 0;
    };

    // Renders view derived from results of a document external id query.
    // @params   Rendering parameters.
    // @type     External ID type.
    renderFromExternalID = function (params, type) {
        if (validateParams(params, [
                'id',
                'project'
            ]
        )) {
            ESDOC.viewer.render(type + "id", params);
        }
    };

    // Renders view derived from results of a document DRS query.
    // @params   Rendering parameters.
    ESDOC.viewer.renderFromDRS = function (params) {
        var keys, parseDRSPath;

        parseDRSPath = function () {
            keys = params.drsPath.split("/");
            if (!_.has(params, 'project')) {
                params.project = keys[0];
            }
            keys = _.filter(keys, function (key) {
                return key.toLowerCase() !== params.project.toLowerCase();
            });
            _.each(keys, function (key, index) {
                params["key0" + index] = key;
            });
            delete params.drsPath;
        };

        if (validateParams(params, [
                'project',
            ], [
                'drsPath',
                'key01',
                'key02',
                'key03',
                'key04',
                'key05',
                'key06',
                'key07',
                'key08',
            ]
        )) {
            if (_.has(params, "drsPath")) {
                parseDRSPath(params);
            }
            ESDOC.viewer.render("drspath", params);
        }
    };

    // Renders view derived from an external ID of some type or another.
    // @params   Rendering parameters.
    ESDOC.viewer.renderFromExternalID = function (params) {
        renderFromExternalID({
            'project': params.project,
            'id': params.externalID
        }, params.externalType);
    };

    // Renders view derived from results of a document dataset id query.
    // @params   Rendering parameters.
    ESDOC.viewer.renderFromDatasetID = function (params) {
        renderFromExternalID(params, 'dataset');
    };

    // Renders view derived from results of a document file id query.
    // @params   Rendering parameters.
    ESDOC.viewer.renderFromFileID = function (params) {
        renderFromExternalID(params, 'file');
    };

    // Renders view derived from results of a document simulation id query.
    // @params      Rendering parameters.
    ESDOC.viewer.renderFromSimulationID = function (params) {
        renderFromExternalID(params, 'simulation');
    };

    // Renders view derived from results of a document name query.
    // @params   Rendering parameters.
    ESDOC.viewer.renderFromName = function (params) {
        if (params.type) {
            params.type = ESDOC.utils.ontologies.getTypeKey(params.type);
        }
        if (validateParams(params, [
                'name',
                'type',
                'project'
            ], [
                'institute'
            ]
        )) {
            ESDOC.viewer.render("name", params);
        }
    };

    // Renders view derived from results of a document id query.
    // @params   Rendering parameters.
    ESDOC.viewer.renderFromID = ESDOC.viewer.renderFromUID = function (params) {
        if (validateParams(params, [
                'id',
                'project'
            ], [
                'version'
            ]
        )) {
            ESDOC.viewer.render("id", params);
        }
    };

    // Renders viewer.
    ESDOC.viewer.render = function (renderMethod, urlParams) {
        var url;

        // TODO input params.

        // Initialise url.
        url = "{0}?renderMethod={1}"
        url = url.replace("{0}", viewerBaseURL);
        url = url.replace("{1}", renderMethod);

        // Append url params.
        _.each(_.keys(urlParams), function (urlParam) {
            var urlParamValue = urlParams[urlParam];
            if (!_.isUndefined(urlParamValue) &&
                urlParamValue.length) {
                url += "&";
                url += urlParam;
                url += "=";
                url += urlParamValue;
            }
        });

        // Open url in new tab.
        window.open(url);
    };

}(
    this.ESDOC,
    this._
));