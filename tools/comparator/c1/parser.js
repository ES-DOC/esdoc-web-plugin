// --------------------------------------------------------
// tools/comparator/c1/parser.js -  comparator c1 data parsers.
// --------------------------------------------------------
(function (ESDOC, _) {

    // ECMAScript 5 Strict Mode
    "use strict";

    // Overrides model value.
    var setModelValue = function (node, fieldset) {
        node.institute = fieldset[node.fieldset[0].toString()];
        node.name = fieldset[node.fieldset[1].toString()];

        if (node.institute === "INPE") {
            node.value = node.name + "-" + node.institute;
        } else {
            node.value = node.name;
        }
    };

    // Overrides component value.
    var setComponentValue = function (node, fieldset) {
        node.value = node.keyForSort = node.longValue = fieldset[_.last(node.fieldset).toString()];
        node.value = node.value.split(" > ").pop();
    };

    // Overrides property value.
    var setPropertyValue = function (node, fieldset) {
        node.value = node.keyForSort = fieldset[_.last(node.fieldset).toString()];
        node.value = node.longValue = node.value.split(" >> ").pop();
        node.value = node.value.split(" > ").pop();
    };

    ESDOC.api.parsers.forComparator.c1 = [
        // Extend data.
        function (data) {
            _.extend(data, {
                fieldset: {},
                nodeset: {},
                facetSet: {
                    instituteList: [],
                    projectList: [],
                    experimentList: [],
                    modelList: [],
                    componentList: [],
                    propertyList: [],
                    valueList: []
                }
            });
        },

        // Unpack setup data - unpack facet text fields.
        function (data) {
            var i, j;

            for (i = 0; i < data.fields.length / 2; i++) {
                // Set offset.
                j = i * 2;

                // Set field.
                data.fieldset[data.fields[j].toString()] = data.fields[j + 1];
            }
        },

        // Unpack setup data - unpack facet nodes.
        function (data) {
            var i, j, node;

            for (i = 0; i < data.nodes.length / 3; i++) {
                // Set offset.
                j = i * 3;

                // Create node.
                node = {
                    id: data.nodes[j],
                    isCurrent: false,
                    isSelected: false,
                    fieldset: data.nodes[j + 2].split(','),
                    keyForSort: undefined
                };

                // Set node type.
                node.type = _.keys(data.facetSet)[data.nodes[j + 1]];
                node.type = node.type.slice(0, node.type.length - 4);

                // Set node value.
                if (node.type === "model") {
                    setModelValue(node, data.fieldset);
                } else if (node.type === "component") {
                    setComponentValue(node, data.fieldset);
                } else if (node.type === "property") {
                    setPropertyValue(node, data.fieldset);
                } else {
                    node.value = data.fieldset[_.last(node.fieldset).toString()];
                }

                // Append to collections.
                if (_.has(data.nodeset, node.id.toString())) {
                    console.log("duplicate node :: " + node.type);
                } else {
                    data.nodeset[node.id.toString()] = node;
                    data.facetSet[node.type + "List"].push(node);
                }
            }
        },

        // Log node type stats.
        function (data) {
            _.each(_.keys(data.facetSet), function (nodeType) {
                console.log(nodeType + " :: " + data.facetSet[nodeType].length);
            });
        },

        // Set intra-node relations 1 - component/property hierarchies.
        function (data) {
            var setHierarchy;

            // Sets up intra-collection hierarchy.
            setHierarchy = function (collection) {
                // Set parent.
                _.each(collection, function (node) {
                    node.parent = node.fieldset.length === 1 ? undefined :
                                  data.nodeset[node.fieldset[0].substring(1)];
                });

                // Set children.
                _.each(collection, function (node) {
                    node.children = _.filter(collection, function (subnode) {
                        return subnode.parent && subnode.parent === node;
                    });
                });

                // Set ancestors.
                _.each(collection, function (node) {
                    var parent;
                    node.ancestors = [];
                    parent = node.parent;
                    while (parent) {
                        node.ancestors.unshift(parent);
                        parent = parent.parent;
                    }
                });

                // Set depth.
                _.each(collection, function (node) {
                    node.depth = node.ancestors.length;
                });
            };

            // Set intra-component relations.
            setHierarchy(data.facetSet.componentList);

            // Set intra-property relations.
            setHierarchy(data.facetSet.propertyList);
        },

        // Set intra-node relations 2 - intra-node relations.
        function (data) {
            var addToCollection;

            addToCollection = function (item, target, collection) {
                target[collection] = target[collection] || [];
                if (_.indexOf(target[collection], item) === -1) {
                    target[collection].push(item);
                }
                if (item.ancestors) {
                    _.each(item.ancestors, function (ancestor) {
                        if (_.indexOf(target[collection], ancestor) === -1) {
                            target[collection].push(ancestor);
                        }
                    });
                }
            };

            _.each(data.facetSet.valueList, function (node) {
                // Assign value relations.
                node.model = data.nodeset[node.fieldset[0].substring(1)];
                node.component = data.nodeset[node.fieldset[1].substring(1)];
                node.property = data.nodeset[node.fieldset[2].substring(1)];

                // Set model component list.
                addToCollection(node.component, node.model, 'componentList');

                // Set model property list.
                addToCollection(node.property, node.model, 'propertyList');

                // Set component model list.
                addToCollection(node.model, node.component, 'modelList');

                // Set component property list.
                addToCollection(node.property, node.component, 'propertyList');

                // Set property value list.
                addToCollection(node.property, node.model, 'modelList');

                // Set property component.
                node.property.component = node.property.component || node.component;

                // Set property value list.
                addToCollection(node, node.property, 'valueList');
            });
        },

        // Sort node type collections.
        function (data) {
            _.each(_.keys(data.facetSet), function (nodeType) {
                data.facetSet[nodeType] = _.sortBy(data.facetSet[nodeType], function (node) {
                    return node.keyForSort || node.value;
                });
            });
            _.each(data.facetSet.componentList, function (node) {
                node.propertyList = _.sortBy(node.propertyList, function (node) {
                    return node.keyForSort || node.value;
                });
            });
        },

        // Delete obsolete information.
        function (data) {
            delete data.nodes;
            delete data.nodeset;
            _.each(data.nodeset, function (node) {
                delete node.fieldset;
            });
            delete data.fields;
            delete data.fieldset;
        },
    ];

}(this.ESDOC, this._));
