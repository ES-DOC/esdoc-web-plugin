(function(ESDOC) {
    // ECMAScript 5 Strict Mode
    'use strict';

    // Register set of cim v1 document types plus associated sysnonyms.
    ESDOC.utils.ontologies.register('cim.1', [
        'activity.Ensemble',
        ['activity.NumericalExperiment', 'Experiment'],
        ['activity.SimulationRun', 'Simulation'],
        ['data.DataObject', 'Data'],
        ['grids.GridSpec', 'Grid'],
        ['misc.DocumentSet', 'Document Set'],
        'shared.Platform',
        ['software.ModelComponent', 'Model'],
        ['software.StatisticalModelComponent', 'StatisticalModel'],
        'quality.Quality'
    ]);

}(this.ESDOC));
