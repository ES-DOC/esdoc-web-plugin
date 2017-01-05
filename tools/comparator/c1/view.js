// --------------------------------------------------------
// tools/comparator/c1/view.js -  comparator c1 view.
// --------------------------------------------------------
(function(ESDOC, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    var View = Backbone.View.extend({
        // View css class.
        className : 'esdoc-widget esdoc-comparator c1',

        // Ctor.
        initialize : function () {
            // Initialise event channel for intra-view communications.
            this.options.eventChannel = _.extend({}, Backbone.Events);

            // Initialise view state.
            this.state = this.options.state = {
                tab : 1,
                project : this.options.project,
                projectCode : this.options.projectCode,
                m : {
                    all : this.options.model.facetSet.modelList,
                    isEachSelected : false,
                    current : undefined,
                    selectable : undefined,
                    selected : []
                },
                c : {
                    all : this.options.model.facetSet.componentList,
                    current : undefined,
                    selectable : undefined,
                    selected : []
                },
                p : {
                    all : this.options.model.facetSet.propertyList,
                    current : undefined,
                    selected : [],
                    selectedWithValues : [],
                    subset : {
                        all : [],
                        isEachSelected : false,
                        selected : [],
                        tree : []
                    }
                },
                v : {
                    all : this.options.model.facetSet.valueList
                },
                report : {
                    axis : 0,
                    format : 'html',
                    requiresGeneration : false,
                    resetScolling : false
                }
            };

            // Perform standard initialisation.
            ESDOC.utils.initialize(this);
        },

        // Dtor.
        destroy : function () {
            ESDOC.utils.destroy(this);
        },

        // Intra-view event handlers.
        listeners : {
            'comparatorC1:navigateToTab1' : function () {
                // Update state.
                this.state.tab = 1;

                // Fire event(s).
                ESDOC.utils.fire(this, "comparatorC1:navigatedToTab1");
            },
            'comparatorC1:navigatingToTab2' : function () {
                // Continue navigation when report generation is unnecessary.
                if (!this.state.report.requiresGeneration) {
                    ESDOC.utils.fire(this, "comparatorC1:navigateToTab2");
                }
            },
            'comparatorC1:navigateToTab2' : function () {
                // Update state.
                this.state.tab = 2;

                // Fire event(s).
                ESDOC.utils.fire(this, "comparatorC1:navigatedToTab2");
            },
            'comparatorC1:displayReportInCSVFormat' : function () {
                // Update state.
                this.state.report.format = 'csv';
                this.state.report.requiresGeneration = true;

                // Fire event(s).
                ESDOC.utils.fire(this, "comparatorC1:reportCSVRendered");
            },
            'comparatorC1:displayReportInHTMLFormat' : function () {
                // Update state.
                this.state.report.format = 'html';
                this.state.report.requiresGeneration = true;

                // Fire event(s).
                ESDOC.utils.fire(this, "comparatorC1:reportHTMLRendered");
            },
            'comparatorC1:selectionStateReset' : function () {
                // Update state.
                ESDOC.utils.toggleSelection(this.state.m.all);
                ESDOC.utils.toggleSelection(this.state.c.all);
                ESDOC.utils.toggleSelection(this.state.p.all);
                this.state.m.isEachSelected = false;
                this.state.m.current = undefined;
                this.state.m.selectable = undefined;
                this.state.m.selected = [];
                this.state.c.current = undefined;
                this.state.c.selectable = undefined;
                this.state.c.selected = [];
                this.state.p.current = undefined;
                this.state.p.selected = [];
                this.state.p.subset.isEachSelected = false;
                this.state.p.subset.selected = [];
                this.state.report.requiresGeneration = false;

                // Fire event(s).
                ESDOC.utils.fire(this, "comparatorC1:selectionStateResetted");
            },
            'component:associatedModelsSelect' : function () {
                // Update state.
                ESDOC.utils.toggleSelection(this.state.m.selected, false);
                ESDOC.utils.toggleSelection(this.state.c.current.modelList, true);
                
                // Fire event(s).
                ESDOC.utils.fire(this, "model:listChange");
            },
            'component:itemChange' : function () {
                // Update state.
                this.state.c.selected = ESDOC.utils.getSelected(this.state.c.all);
                this.state.p.subset.all = this.state.c.current.propertyList;
                this.state.p.subset.isEachSelected = ESDOC.utils.isEachSelected(this.state.c.current.propertyList);
                this.state.p.subset.selected = ESDOC.utils.getSelected(this.state.c.current.propertyList);
                this.state.p.subset.tree = this.state.c.current.propertyTree;

                // Fire event(s).
                ESDOC.utils.fire(this, "component:itemChanged");
            },
            'model:itemChange' : function () {
                // Update state.
                this.state.m.selected = ESDOC.utils.getSelected(this.state.m.all);
                this.state.m.isEachSelected = ESDOC.utils.isEachSelected(this.state.m.all);
                this.state.report.requiresGeneration = true;
                
                // Fire event(s).
                ESDOC.utils.fire(this, "model:itemChanged");
            },
            'model:listChange' : function () {
                // Update state.
                this.state.m.selected = ESDOC.utils.getSelected(this.state.m.all);
                this.state.m.isEachSelected = ESDOC.utils.isEachSelected(this.state.m.all);
                this.state.report.requiresGeneration = true;

                // Fire event(s).
                ESDOC.utils.fire(this, "model:listChanged");
            },
            'property:itemChange' : function () {
                // Update state.
                this.state.p.selected = ESDOC.utils.getSelected(this.state.p.all);
                this.state.p.subset.selected = ESDOC.utils.getSelected(this.state.p.subset.all);
                this.state.p.subset.isEachSelected = ESDOC.utils.isEachSelected(this.state.p.subset.all);
                this.state.report.requiresGeneration = true;

                // Fire event(s).
                ESDOC.utils.fire(this, "property:itemChanged");
            },
            'property:listChange' : function () {
                // Update state.
                this.state.p.selected = ESDOC.utils.getSelected(this.state.p.all);
                this.state.p.subset.selected = ESDOC.utils.getSelected(this.state.p.subset.all);
                this.state.p.subset.isEachSelected = ESDOC.utils.isEachSelected(this.state.p.subset.all);
                this.state.report.requiresGeneration = true;

                // Fire event(s).
                ESDOC.utils.fire(this, "property:listChanged");
            }
        },

        render : function () {
            // Render inner-views.
            ESDOC.utils.renderAll(View.subViews, this.options, this);

            return this;
        },

        _generateReport : function () {
            
        }
    }, {
        subViews : [
            ESDOC.comparator.views.C1Tab1View,
            ESDOC.comparator.views.C1Tab2View
        ]
    });

    // Expose views.
    _.extend(ESDOC.comparator.views, {
        C1View : View
    });

}(this.ESDOC, this._, this.Backbone));
