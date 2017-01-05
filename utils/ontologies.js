(function(ESDOC, _) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // Supported type information.
    var _types = [];

    // Set of supported ontologies.
    ESDOC.utils.ontologies = {
        // Registers a set of types.
        // @types       Set of types for registration.
        register : function (ontology, types) {
            _types = _types.concat(_.reduce(types, function (memo, type) {
                var ti, 
                    parent;

                // Set type declaration.
                if (!_.isArray(type)) {
                    type = [type];
                }
                ti = type[0].split('.');
                parent = {
                    o : ontology,
                    p : ti[0],
                    t : ti[1],
                    key : ontology + '.' + type[0]
                };                
                memo.push(parent);
                
                // Set synonym declarations.
                _.each(type.splice(1, Number.MAX_VALUE), function (synonym) {
                    memo.push({
                        o : ontology,
                        p : ti[0],
                        t : synonym,
                        parent : parent
                    });
                });
                
                return memo;
            }, []));
        },

        // Determines whether ontology entity is supported or not.
        // @o	Ontology name.
        // @p   Ontology package name.
        // @t	Ontology type name.
        isSupported : function ( o, p, t ) {
            return !_.isUndefined(_.find(_types, function (ti) {
                if (ti.o.eq(o)) {
                    if (p && t) {
                        return ti.p.eq(p) && ti.t.eq(t);
                    } else if (p) {
                        return ti.p.eq(p);
                    } else if (t) {
                        return ti.t.eq(t);
                    } else {
                        return true;
                    }
                }
                return false;
            }));
        },

        // Returns type key.
        // @type	Ontology type name.
        getTypeKey : function ( type ) {
            var o, p, t, ti = type.split('.');

            switch (ti.length) {
                case 4:
                    o = ti[0] + '.' + ti[1];
                    p = ti[2];
                    t = ti[3];
                    break;
                case 3:
                    o = ti[0] + '.' + ti[1];
                    t = ti[2];
                    break;
                case 2:
                    o = ESDOC.options.ontology;
                    p = ti[0];
                    t = ti[1];
                    break;
                case 1:
                    o = ESDOC.options.ontology;
                    t = ti[0];
                    break;
                default:
                    window.alert("TODO raise error");
                    break;
            }

            type = _.find(_types, function (ti) {
                return ti.o.eq(o) && 
                       (p ? ti.p.eq(p) : true) &&
                       ti.t.eq(t);
            });
            if (type.parent) {
                type = type.parent;
            }
            
            return type ? type.key : undefined;
        }
    };
	
}(this.ESDOC, this._));
