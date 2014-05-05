define([
    'backbone',
    'marionette',
    'views/video'
], function (Backbone, Marionette, VideoView) {
    "use strict";

    var VideoCollection = Backbone.Collection.extend({
        url: 'transcription/'
    });

    return Marionette.CollectionView.extend({
        itemView: VideoView,
        collection: new VideoCollection(),
        initialize: function() {
            this.collection.fetch();
        }
    });
});
