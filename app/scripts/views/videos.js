define([
    'backbone',
    'marionette',
    'views/video'
], function (Backbone, Marionette, VideoView) {
    "use strict";

    var VideoCollection = Backbone.Collection.extend({
        url: 'transcription/'
    });

    return Marionette.CompositeView.extend({
        itemView: VideoView,
        itemViewContainer: '#videos',
        template: '#videos-composite',
        collection: new VideoCollection(),
        initialize: function() {
            console.log("fetching");
            this.collection.fetch();
        },
        onRender: function() {
            console.log("rendering");
        }
    });
});
