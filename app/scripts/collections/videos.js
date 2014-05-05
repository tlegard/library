define([
    'backbone',
    'marionette',
], function (Backbone, Marionette) {
    "use strict";

    /**
        Simply wraps the collection gotten from the /transcription/ endpoint
    */

    return Backbone.Collection.extend({
        url: 'transcription/'
    });
});
