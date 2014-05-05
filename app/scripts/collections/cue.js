define(['underscore', 'backbone'], function (_, Backbone) {
    'use strict';

    var CueCollection = Backbone.Collection.extend({
        model: Backbone.Model,
        url: '/transcription/535acdc4895a5d07b0548b3a'
    });

    return CueCollection;

});
