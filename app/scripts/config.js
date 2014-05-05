require.config({

    deps: [
        // Global Plugins & Patches
        "string",
        // Bootloader
        "main"
    ],

    paths: {
        // Core
        'jquery': 'lib/jquery',
        'underscore': 'lib/underscore',
        'json2': 'lib/json2',
        'backbone': 'lib/backbone',
        'backbone.babysitter': 'lib/backbone.babysitter',
        'backbone.wreqr': 'lib/backbone.wreqr',
        'marionette': 'lib/backbone.marionette',
        'handlebars': 'lib/handlebars.runtime',
        // Plugins & Patches
        'string': 'lib/objects/string',
        'squire': '../../test/lib/squire'
    },

    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['jquery', 'underscore', 'json2'],
            exports: 'Backbone'
        }
    }
});
