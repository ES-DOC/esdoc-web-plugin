// --------------------------------------------------------
// core.utils.js - misceallaneous helper functions used across applications.
// --------------------------------------------------------
(function(ESDOC, $, _, console) {
    // ECMAScript 5 Strict Mode
    "use strict";
    
    // Denulls an object by trimmng and replacing the null keyword with passed value.
    // @param   target - object being denulled.
    // @param   newval - replacement null value.
    ESDOC.utils.denullAndTrim = function( target, newval ) {
        var denullAndTrim;

        denullAndTrim = function (obj) {
            if (_.isArray(obj)) {
                _(obj).each(function (item) {
                    denullAndTrim(item);
                });
            }
            else if ($.isPlainObject(obj)) {
                _.each(_.keys(obj), function(key) {
                    if (_.isNull(obj[key])) {
                        obj[key] = newval;
                    }
                    else if (_.isString(obj[key])) {
                        obj[key] = obj[key].trim();
                        if (obj[key].length === 0) {
                            obj[key] = newval;
                        }
                    }
                    else if ($.isArray(obj[key])) {
                        _.each(obj[key], function (item) {
                            denullAndTrim(item);
                        });
                    }
                });
            }
        };
        
        denullAndTrim(target);
    };

    // Transforms a data array into an object array.
    ESDOC.utils.toObjectArray = function (data, keys) {
        var i, instance;

        // Null if not passed arrays.
        if (!_.isArray(data) ||
            !_.isArray(keys)) {
            return null;
        }

        // Return reduced array of objects.
        return _.reduce(data, function (collection, item) {
            instance = {};
            for (i = 0; i < keys.length; i++) {
                if (i + 1 > item.length) {
                    break;
                }
                instance[keys[i]] = item[i];
            }
            collection.push(instance);
            return collection;
        }, []);
    };

    // Converts passed value to boolean type.
    // @value       A value to be converted to boolean.
    ESDOC.utils.toArray = function (value) {
        if (_.isArray(value)) {
            return value;
        } else if (_.isUndefined(value) ||
                   _.isNull(value)) {
            return [];
        } else {
            return [value];
        }
    };

    // Converts passed value to boolean type.
    // @value       A value to be converted to boolean.
    ESDOC.utils.toBoolean = function (value) {
        if (_.isBoolean(value)) {
            return value;
        }
        else if (_.isString(value)) {
            switch ( value.toLowerCase() ) {
                case "true":
                case "yes":
                case "t":
                case "y":
                case "1":
                    return true;
                case "false":
                case "no":
                case "f":
                case "n":
                case "0":
                case null:
                    return false;
                default:
                    return Boolean(value);
            }
        }
        else {
            return value;
        }
    };

    // Returns view options.
    // @options       Sub-view options.
    // @model         Sub-view model.
    ESDOC.utils.getViewOptions = function (options, model) {
        var result = {};
        if (_.isObject(options)) {
            result = _.extend({}, options);
        }
        result = _.defaults(result, {model : model});
        return result;
    };

    // Opens the target url.
    ESDOC.utils.openURL = function(url, inTab) {
        if (inTab === true) {
            window.open(url);
        } else {
            window.location = url;
        }
    };

    // Assigns set of contacts.
    ESDOC.utils.setContacts = function (meta, contacts) {
        var set = function (attribute, role) {
            var rp;
            if (_.isUndefined(meta[attribute])) {
                rp = _.find(contacts, function (rp) {
                    return rp.role.toUpperCase() === role.toUpperCase();
                });
                if (!_.isUndefined(rp)) {
                    meta[attribute] = rp.organisationName || rp.individualName;
                } else {                    
                    meta[attribute] = ESDOC.viewer.NULL_FIELD;
                }
            }
        };
        set('institute', 'centre');
        set('funder', 'funder');
        set('principalInvestigator', 'pi');
    };
	
    // Replaces null values.
    ESDOC.utils.replaceNulls = function (view, selector, replacement) {
        replacement = replacement || ESDOC.viewer.NULL_FIELD;

        view.$(selector).filter(function () {
            if ($(this).text() === '') {
                return true;
            }
            return false;
        }).text(replacement);

        view.$(selector + ':contains(null)').text(replacement);
        view.$(selector + ':contains(undefined)').text(replacement);
    };

    // Removes items from collection based on simple key value match.
    // @collection      Collection being filtered.
    // @key             Object key acting as predicate target.
    // @values          Array of values that will result in item being removed from collelction.
    ESDOC.utils.remove = function (collection, key, values) {
        return _.filter(collection, function ( instance ) {
            if (_.has(instance, key)) {
                return _.indexOf(values, instance[key]) === -1;                
            }
            else if (_.has(instance, key.toUpperCase())) {
                return _.indexOf(values, instance[key.toUpperCase()]) === -1;
            }
            else {
                return false;
            }
        });
    };

    // Applies css classes to target view.
    // @view        View whose css is being updated.
    // @targets     Target CSS selector/classes to apply.
    ESDOC.utils.applyCSS = function (view, targets) {
        _.each(targets, function (target) {
            _.each(target[1], function (selector) {
                view.$(selector).addClass(this[0]);
            }, target);
        });
    };

    // Performs event wiring against all listeners declared by the view.
    // @view        A view.
    // @action      Wiring action to take.
    var wireEvents = function (view, action) {
        if (view.listeners) {
            _.each(_.keys(view.listeners), function (key) {
                action(key, view);
            });
        }        
    };

    // Initializes a view.
    // @view        A view.
    ESDOC.utils.initialize = function (view) {
        if (view.options.state && !view.state) {
            view.state = view.options.state;
        }
        wireEvents(view, ESDOC.utils.bind);
    };

    // Destroys a view.
    // @view        A view.
    ESDOC.utils.destroy = function (view) {
        if (view.state) {
            delete view.state;
        }
        wireEvents(view, ESDOC.utils.unbind);
    };
    
    // Triggers a view event.
    // @event       Event being triggered.
    // @args        Event argruments.
    // @view        Event source.
    // @channel     Default event channel.
    ESDOC.utils.trigger = function (event, args, view, channel) {
        if (!event.contains('Selectable')) {
            console.log(event);
        }
        args.cancel = false;
        channel = view.options.eventChannel || channel;
        channel.trigger(event, args);
        return !args.cancel;
    };

    // Fires a view event.
    // @event       Event being triggered.
    // @args        Event argruments.
    // @view        Event source.
    // @channel     Default event channel.
    ESDOC.utils.fire = function (view, event, args) {
        var eventArgs = {
            cancel : false,
            eventSource : view,
            eventName : event
        };

        if (!event.contains('Selectable')) {
            console.log("ES-DOC event::" + event);
        }        
        if (!_.isUndefined(args)) {
            _.defaults(eventArgs, args);
        } else if (!_.isUndefined(view._state)) {
            _.defaults(eventArgs, view._state);
        } else if (!_.isUndefined(view.viewState)) {
            _.defaults(eventArgs, view.viewState);
        }
        view.options.eventChannel.trigger(event, eventArgs);
        
        return !eventArgs.cancel;
    };

    // Returns a view event handler.
    // @event       Event being listened to.
    // @view        Event listener.
    var getViewEventHandler = function (event, view) {
        return _.isFunction(view.listeners[event]) ? view.listeners[event] :
                                                     view[view.listeners[event]];        
    };

    // Binds a callbck to a view event.
    // @event       Event being listened to.
    // @view        Event listener.
    ESDOC.utils.bind = function (event, view) {
        if (_.has(view.listeners, event)) {
            view.options.eventChannel.on(event, getViewEventHandler(event, view), view);
        }
    };

    // Unbinds a callbck from a view event.
    // @event       Event being listened to.
    // @view        Event listener.
    ESDOC.utils.unbind = function (event, view) {
        if (_.has(view.listeners, event)) {
            view.options.eventChannel.off(event, getViewEventHandler(event, view), view);
        }
    };

    // Binds a callbck to a view event.
    // @event       Event being listened to.
    // @callback    Event callback.
    // @view        Event listener.
    // @channel     Default event channel.
    ESDOC.utils.on = function (event, callback, view, channel) {
        channel = view.options.eventChannel || channel;
        channel.on(event, callback, view);
    };  

    // Unbinds a callbck from a view event.
    // @event       Event being listened to.
    // @callback    Event callback.
    // @view        Event listener.
    // @channel     Default event channel.
    ESDOC.utils.off = function (event, callback, view, channel) {
        channel = view.options.eventChannel || channel;
        channel.off(event, callback, view);
    };

    // Opens the target email.
    // @address         Target email address.
    // @subject         Target email subject.
    ESDOC.utils.openEmail = function(address, subject, message) {
        var email = "mailto:{0}?subject={1}&body={2}";

        subject = subject || ESDOC.constants.email.defaultSubject;
        message = message || ESDOC.constants.email.defaultMessage;

        email = email.replace('{0}', address);
        email = email.replace('{1}', subject);
        email = email.replace('{2}', message);
        
        window.location.href = email;
    };

    // Opens module support email.
    // @module         Module for which a support email is being sent.
    ESDOC.utils.openSupportEmail = function (module) {
        var subject;

        subject = "ES-DOC :: SUPPORT :: {0} (v{1}) :: support question";
        subject = subject.replace("{0}", module);
        subject = subject.replace("{1}", ESDOC.VERSION);

        ESDOC.utils.openEmail(ESDOC.constants.email.support, subject);
    };

    // Sets CSS class for a view field.
    // @view        View with fields to process.
    // @selectors   Set of css selectors that identify potential fields.
    // @css         CSS class to apply.
    var setFieldCSS = function (view, selectors, css) {
        // Exclude null fields.
        selectors = _.map(selectors, function (selector) {
            return selector + ':not(:contains(' + ESDOC.viewer.NULL_FIELD + '))';
        });

        // Add class.
        _.each(selectors, function (selector) {
            view.$(selector).addClass(css);
        }, this);     
    };

    // Event handler fired whenever user clicks upon a hyperlink.
    var onHyperlinkClick = function () {
        ESDOC.utils.openURL($(this).attr('href'), true);
        return false;        
    };

    // Sets hyperlinks embedded in the target view.
    // @view        View with links to process.
    // @selectors   Set of css selectors that identify potential links.
    ESDOC.utils.setHyperLinks = function(view, selectors) {
        // Add css class.
        setFieldCSS(view, selectors, 'esdoc-standard-hyperlink');

        // Wire click event.
        view.$('.esdoc-standard-hyperlink a').click(onHyperlinkClick);
    };

    // Event handler fired whenever user clicks upon a hyperlink.
    var onEmailLinkClick = function () {
        ESDOC.utils.openEmail($(this).text());
        return false;
    };

    // Sets email links embedded in the target view.
    // @view        View with email links to process.
    // @selectors   Set of css selectors that identify potential email links.
    ESDOC.utils.setEmailLinks = function(view, selectors) {
        // Add css class.
        setFieldCSS(view, selectors, 'esdoc-standard-email');

        // Wire click event.
        view.$('.esdoc-standard-email').click(onEmailLinkClick);
    };

    // Sets links embedded in the target view.
    // @view             View with links to process.
    // @selectors        Set of css selectors that identify short date fields.
    ESDOC.utils.formatShortDateFields = function(view, selectors) {
        // Add css class.
        setFieldCSS(view, selectors, 'esdoc-standard-shortdate');

        // Format accordingly.
        _.each(view.$('.esdoc-standard-shortdate'), function (dateElement) {
            $(dateElement).text($(dateElement).text().replace(' 00:00:00', ''));
        });
    };

    // Makes and returns a dom element.
    // @tagName     Name of DOM tag being created.
    // @attributes  Set of attributes to apply.
    // @content     Content to inject.
    ESDOC.utils.make =  function (tagName, attributes, content) {
        var el = document.createElement(tagName);
        if (attributes) {
            $(el).attr(attributes);
        }
        if (content) {
            $(el).html(content);
        }
        return el;
    };

    // Makes and returns a jquery wrapped dom element.
    // @tagName     Name of DOM tag being created.
    // @attributes  Set of attributes to apply.
    // @content     Content to inject.
    ESDOC.utils.$make =  function (tagName, attributes, content) {
        return $(ESDOC.utils.make(tagName, attributes, content));
    };

    // Returns set of list items marked as selected.
    // @list    Collection of items.
    ESDOC.utils.getSelected = function (list) {
        return _.filter(list, function (item) {
            return item.isSelected;
        });
    };

    // Returns set of tree items marked as selected.
    // @tree    Tree of items.
    ESDOC.utils.getSelectedTree = function (tree) {
        return _.reduce(tree, function (memo, item) {
            if (item.isSelected) {
                memo.push(item);
            }
            if (item.children) {
                memo = memo.concat(ESDOC.utils.getSelectedTree(item.children));
            }
            return memo;
        }, []);
    };

    // Returns set of list items marked as selected.
    // @list    Collection of items.
    ESDOC.utils.getSelectedCount = function (list) {
        return ESDOC.utils.getSelected(list).length;
    };

    // Toggles is selected state of list items.
    // @list    Collection of items.
    ESDOC.utils.toggleSelection = function (list, state) {
        _.each(list, function (item) {
            item.isSelected = state;
        });
    };

    // Toggles is selected state of list items.
    // @collection  Collection of items.
    // @subset      Subset of items.
    ESDOC.utils.isEachSelected = function (collection, subset) {
        if (!subset) {
            return ESDOC.utils.getSelectedCount(collection) === collection.length;
        } else {
            return ESDOC.utils.getSelectedCount(subset) === subset.length;
        }
    };

    // Renders a view.
    // @Type          View type.
    // @options       View options.
    // @container     View container.
    ESDOC.utils.render = function (Typeof, options, container) {
        var view;

        view = new Typeof(options);
        view = view.render();
        if (!_.isUndefined(container)) {
            if (_.has(container, '$el')) {
                container.$el.append(view.$el);
            } else {
                container.append(view.$el);
            }
            return container;
        } else {
            return view;
        }
    };

    // Renders a set of views.
    // @types       Set of view types.
    // @options     Set of view options.
    // @container   Container view.
    ESDOC.utils.renderAll = function (types, options, container) {
        _.each(types, function (ViewType) {
            var view = new ViewType(options).render();
            if (_.has(container, '$el')) {
                container.$el.append(view.$el);
            } else {
                container.append(view.$el);
            }
        });
        return container;
    };

    // Assign css classes to a view.
    // @view        A view.
    // @cssSuffix   CSS suffix to apply.
    ESDOC.utils.setCSS = function (view, cssSuffix) {
        view.$el.addClass('cim-' + cssSuffix);
    };

    // Returns URL query param value.
    // @name                URL query param name.
    // @defaultValue        URL query param default value.
    ESDOC.utils.getURLParam = function(name, defaultValue) {
        var
            results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (!results) {
            return defaultValue;
        }
        return (results[1] || defaultValue).toUpperCase();
    };

    // Filters a document set by document type.
    // @ds                   Document set ot be filtered.
    // @ontologyTypeKey      Ontology type key to filter by.
    ESDOC.utils.filterDocumentSet = function (ds, ontologyTypeKey) {
        return _.filter(ds, function (d) {
            return d.ontologyTypeKey == ontologyTypeKey;
        });
    };

}(this.ESDOC, this.$, this._, this.console));
