// --------------------------------------------------------
// api.parsers.js -  api module data parsers.
// --------------------------------------------------------
(function(ESDOC, _) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Initialise.
    var parsers = ESDOC.api.parsers = {
        forDocumentSet : [],
        forDocumentGroupSet : [],
        forDocument : {},
        forSearchEngine : {},
        forSearchEngineSetup : {},
        forComparator : {},
        forVisualizer : {}
    };

    // Document set :: JSON convertor.
    parsers.forDocumentSet.push(function (ds) {
        return _.map(ESDOC.utils.toArray(ds), function(d) {
            return _.isObject(d) ? d : JSON.parse(d);
        });
    });

    // Document set :: Exclude non-identifiable documents.
    parsers.forDocumentSet.push(function (ds) {
        return _.filter(ds, function(d) {
            return (_.has(d, 'ontologyTypeKey') &&
                    _.has(d, 'meta'));
        });
    });

    // Document set :: Format ontology type key so that it is CSS friendly.
    parsers.forDocumentSet.push(function (ds) {
        _.each(ds, function(d) {
            d._ontologyTypeKey = d.ontologyTypeKey.split('.').join('-');
            d.ontologyTypeKey = d.ontologyTypeKey.split('.').join('-');
        });
    });

    // Document set :: Set unique document key.
    parsers.forDocumentSet.push(function (ds) {
        _.each(ds, function (d) {
            d.meta.key = d.meta.project;
            d.meta.key += '_';
            d.meta.key += d.meta.id;
            d.meta.key += '_';
            d.meta.key += d.meta.version;
        });
    });

    // Document set :: Perform document type specific parses.
    parsers.forDocumentSet.push(function (ds) {
        return _.map(ds, function (d) {
            if (_.has(parsers.forDocument, d.ontologyTypeKey)) {
                _.each(parsers.forDocument[d.ontologyTypeKey], function (parser) {
                    d = parser(d, ds) || d;
                });
            }
            return d;
        });
    });

    // Document set :: Exclude dead documents (i.e. that may have failed parsing.
    parsers.forDocumentSet.push(function (ds) {
        return _.filter(ds, function(d) {
            return !_.isUndefined(d);
        });
    });

    // Document set :: denull and trim all data.
    parsers.forDocumentSet.push(function (ds) {
        ESDOC.utils.denullAndTrim(ds, ESDOC.viewer.NULL_FIELD);
    });

    // Document group set :: Initialise.
    parsers.forDocumentGroupSet.push(function (gs, ds) {
        gs = _.groupBy(ds, function (d) {
            return d.ontologyTypeKey;
        });
        return gs;
    });

    // Document group set :: Transform.
    parsers.forDocumentGroupSet.push(function (gs, ds) {
        gs = _.map(gs, function (documents) {
            return {
                ontologyTypeKey : documents[0].ontologyTypeKey,
                project : documents[0].meta.project,
                institute : documents[0].meta.institute,
                documentSet : documents
            };
        });
        return gs;
    });
    
}(this.ESDOC, this._));
