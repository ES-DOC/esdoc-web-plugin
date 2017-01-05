
// --------------------------------------------------------
// utils.validation.js - validation helper functions used across application.
// --------------------------------------------------------
(function(ESDOC, $, _) {
    // ECMAScript 5 Strict Mode
    "use strict";

    var that, setError, are;

    // Module variables.
    that = {};
    
    // Either appends or throws an error.
    setError = function (errors, msg) {
        if (_.isUndefined(errors)) {
            errors = [];
        }
        if (_.isArray(errors)) {
            errors.push(msg);
        }        
        else {
            errors = [errors];
            errors.push(msg);
        }
    };
    
    // Validates that the set of fields are valid according to passed validator.
    are = function (fields, errors, validator) {
        if ( fields ) {
            _.each(fields, function(field) {
                validator(field[0], field[1], errors);
            });
        }
    };
    
    // Validates a required field.
    // @value		Value of field being validated.
    // @name		Name of field being validated.
    // @errors		Validation error collection.
    that.isRequired = function ( value, name, errors ) {
        var isValid, msg;

        isValid = !_.isUndefined(value);		
        if ( !isValid )  {
            msg = 'Parameter {{0}} is required';
            msg = msg.replace('{0}', name);
            setError(errors, msg);
        }        
        return isValid;
    };
    
    // Validates a set of required fields.
    // @obj		Object being validated.
    // @fields		Set of required fields.
    // @errors		Validation error collection.
    that.areRequired = function ( obj, fields, errors ) {
        var msg = 'Parameter {{0}} is required';
        _.each(fields, function(field) {
            if (_.has(obj, field) === false) {
                setError(errors, msg.replace('{0}', field));
            }
        });
    };
			    
    // Validates a string field.
    // @value		Value of field being validated.
    // @name		Name of field being validated.
    // @errors		Validation error collection.
    that.isString = function ( value, name, errors ) {
        var isValid, msg;

        isValid = _.isString(value) && $.trim(value).length > 0;
        if ( !isValid )  {
            msg = 'Parameter {{0}} must be a string';
            msg = msg.replace('{0}', name);
            setError(errors, msg);
        }        
        return isValid;
    };
    
    // Validates a set of string fields.
    // @obj		Object being validated.
    // @fields		Set of string fields.
    // @errors		Validation error collection.
    that.areStrings = function ( obj, fields, errors ) {
        var msg = 'Parameter {{0}} must be a string';
        _.each(fields, function(field) {
            if (_.has(obj, field) &&
                _.isString(obj[field]) === false) {
                setError(errors, msg.replace('{0}', field));
            }
        });
    };

//    // Validates a set of string fields.
//    // @fields		Set of fields being validated.
//    // @errors		Validation error collection.
//    that.areStrings = function ( fields, errors ) {
//        are(fields, errors, that.isString);
//    }
    
    // Validates a plain object field.
    // @value		Value of field being validated.
    // @name		Name of field being validated.
    // @errors		Validation error collection.
    that.isPlainObject = function ( value, name, errors ) {
        var isValid, msg;
		
        isValid = $.isPlainObject(value);
        if ( !isValid )  {
            msg = 'Parameter {{0}} must be a hash of key/value pairs';
            msg = msg.replace('{0}', name);
            setError(errors, msg);
        }
        return isValid;
    };
    
    // Validates a set of plain objects.
    // @fields		Set of fields being validated.
    // @errors		Validation error collection.
    that.arePlainObjects = function ( fields, errors ) {
        are(fields, errors, that.isPlainObject);
    };
    
    // Validates passed ESDOC type.
    // @o	Ontology name.
    // @p	Ontology version.
    // @t	Ontology type.
    // @errors	Validation error collection.
    that.isESDOCType = function ( o, v, t, errors ) {
        var isValid, 
            msg;

        isValid = ESDOC.utils.ontologies.isSupported(o, v, undefined, t);

        if (!isValid) {
            msg = 'Invalid document type :: {0} (ontology = {1}-v{2}).';
            msg = msg.replace('{0}', t);
            msg = msg.replace('{1}', o);
            msg = msg.replace('{2}', v);
            setError(errors, msg);
        }

        return isValid;
    };       

    // Register.
    ESDOC.utils.validation = that;
	
}(this.ESDOC, this.$, this._));
