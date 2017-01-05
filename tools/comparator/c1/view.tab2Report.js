// --------------------------------------------------------
// tools/comparator/c1/viewOfTab2CSVReport.js -  comparator c1 tab 2 CSV report view.
// --------------------------------------------------------
(function(ESDOC, $, _, Backbone) {
    // ECMAScript 5 Strict Mode
    "use strict";

    // i18n.
    var i18n = {
        generatingReport : 'Generating Report'
    };

    // HTML table view of selected model component properties.
    var View = Backbone.View.extend({
        // View css class.
        className : 'report',

        // Ctor.
        initialize : function () {
            ESDOC.utils.initialize(this);
        },

        // Dtor.
        destroy : function () {
            ESDOC.utils.destroy(this);
        },

        // Intra-view event handlers.
        listeners : {
            'comparatorC1:displayReportInCSVFormat' : '_refreshVisibility',
            'comparatorC1:displayReportInHTMLFormat' : '_refreshVisibility',
            'comparatorC1:navigatingToTab2' : '_refresh',
            'comparatorC1:navigatedToTab2' : '_refreshVisibility'
        },

        // View renderer.
        render : function () {
            this.$el.append(View.HTML());

            return this;
        },

        // Gets report data by filtering user selections.
        _getReportData : function () {
            return _.filter(this.state.v.all, function (v) {
                return _.indexOf(this.m.selected, v.model) > -1 &&
                       _.indexOf(this.c.selected, v.component) > -1 &&
                       _.indexOf(this.p.selected, v.property) > -1;
            }, this.state);
        },

        // Refreshes view according to current state.
        _refreshVisibility : function () {
            switch (this.state.report.format) {
                case 'csv':
                    this._setVisibility('csv', 'html');
                    this.$('.csv textarea').select();
                    break;
                case 'html':
                    this._setVisibility('html', 'csv');
                    if (this.state.report.resetScolling) {
                        this.$('.html').scrollTop(0);
                        this.$('.html').scrollLeft(0);
                        this.state.report.resetScolling = false;
                    }
                    break;
            }
        },

        // Refreshes view according to current state.
        _refresh : function () {
            var self;

            // Escape if report does not require generation.
            if (!this.state.report.requiresGeneration) {
                return;
            }

            // Signal background task event.
            ESDOC.events.trigger("feedback:backgroundTask", i18n.generatingReport);

            // Invoke via a timeout.
            self = this;
            setTimeout(function () {
                self._generate.call(self);
            }, 250);
        },

        // Generates report in supported formats.
        _generate : function () {
            var data, generators;

            // Get data.
            data = this._getReportData();

            // Filter out placeholder properties.
            this.state.p.selectedWithValues =
                _.filter(this.state.p.selected, function (p) {
                    return p.valueList;
                });

            // Invoke generators.
            generators = [
                this._generateInCSVFormat,
                this._generateInHTMLFormat
            ];
            _.each(generators, function (generator) {
                generator.call(this, data);
            }, this);

            // Ensure report is not re-generated unuecessarily.
            this.state.report.requiresGeneration = false;

            // Signal tab navigation event.
            ESDOC.utils.fire(this, 'comparatorC1:navigateToTab2');

            // Signal background task end event.
            ESDOC.events.trigger("feedback:backgroundTaskEnd");
        },

        // Generates report in CSV format.
        // @data        Report data.
        _generateInCSVFormat : function (data) {
            var csv;

            // Initialise.
            csv = _.reduce(this.state.m.selected, function (memo, m) {
                memo.push([m.value]);
                return memo;
            }, [["Component"], ["Property"]]);

            // Add values.
            _.each(this.state.p.selectedWithValues, function (p) {
                csv[0].push(p.component.longValue);
                csv[1].push(p.longValue);
                _.each(this.state.m.selected, function (m, index) {
                    csv[index + 2].push(this._getReportCell(data, m, p));
                }, this);
            }, this);

            // Format.
            csv = _.reduce(csv, function (memo, row) {
                return memo + _.map(row, function (cell) {
                    return '"' + cell + '"';
                }).toString() + '\n';
            }, "", this);

            // Update view.
            this.$('.csv textarea').text(csv);
        },

        // Generates report in HTML format.
        // @data        Report data.
        _generateInHTMLFormat : function (data) {
            var $html, appendCell, appendRow;

            // Appends a report cell.
            appendCell = function (value, index) {
                var $td = $('<td />');
                $td.text(value);
                $html[index].append($td);
            };

            // Appends a report row.
            appendRow = function (model) {
                var $tr = $('<tr />');
                $tr.append($('<td />').text(model.value));
                $html.push($tr);
            };

            // Reset DOM.
            this.$('.html table tr').remove();
            $html = [
                $('<tr><td>Component</td></tr>'),
                $('<tr><td>Property</td></tr>')
            ];
            this.state.report.resetScolling = true;

            // Iterate properties in scope and emit report.
            _.each(this.state.p.selectedWithValues, function (p) {
                appendCell(p.component.longValue, 0);
                appendCell(p.longValue, 1);
                _.each(this.state.m.selected, function (m, index) {
                    if (index + 3 > $html.length) {
                        appendRow(m);
                    }
                    appendCell(this._getReportCell(data, m, p), index + 2);
                }, this);
            }, this);

            // Update view.
            this.$('.html table thead').append($html.slice(0, 2));
            this.$('.html table tbody').append($html.slice(2));
        },

        // Returns value of a report cell.
        // @data        Report data.
        // @m           Model being processed.
        // @p           Property being processed.
        _getReportCell: function (data, m, p) {
            var vList;

            // Get values:
            vList = _.filter(data, function (v) {
                return v.model === m &&
                       v.component === p.component &&
                       v.property === p;
            });
            vList = _.pluck(vList, "value");

            // Reject sterile values.
            vList = _.reject(vList, function (v) {
                return !v ||
                       v.toUpperCase() === 'OTHER' ||
                       v.toUpperCase() === 'NONE' ||
                       v.toUpperCase() === 'N/A';
            });

            // Format.
            if (!vList.length) {
                if (_.indexOf(m.componentList, p.component) == -1) {
                    return "N/A";
                }
                return "???";
            } else {
                return vList.join(' | ');
            }
        },

        // Set visiiblity of report panels.
        // @toShow      Panel to display.
        // @toHide      Panel to hide.
        _setVisibility : function (toShow, toHide) {
            this.$('.' + toHide).hide();
            this.$('.' + toShow).show();
        }
    }, {
        // View template.
        HTML : _.template("\n\
            <div class='csv'>\n\
                <textarea />\n\
            </div>\n\
            <div class='html'>\n\
                <table>\n\
                    <thead>\n\
                        <tr><td>HTML</td></tr>\n\
                    </thead>\n\
                    <tbody>\n\
                    </tbody>\n\
                </table>\n\
            </div>")
    });

    // Expose views.
    _.extend(ESDOC.comparator.views, {
        C1Tab2ReportView : View
    });

}(this.ESDOC, this.$, this._, this.Backbone));
