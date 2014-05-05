define([
    'backbone',
    'marionette',
    'views/video',
    'collections/videos'
], function (Backbone, Marionette, VideoView, VideoCollection) {
    "use strict";

    /** Composite view showing a list of videos from the database, it's the only thing 
        of the MainLayout */
    return Marionette.CompositeView.extend({
        itemView: VideoView,
        itemViewContainer: '#videos',
        template: '#videos-composite',
        collection: new VideoCollection(),
        initialize: function() {
            this.collection.fetch();
        },
        onRender: function() {
        }
    });
});
