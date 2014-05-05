define(['underscore', 'backbone', 'marionette', 'views/videos', 'layouts/transcribing'], function (_, Backbone, Marionette, VideosView, TranscribingLayout) {
    'use strict';

    /**
        The MainLayout is the first you see when loading up the page. 
        It is responsible for setting the specific video in the transcription layout when it
        recieves an setActive event. 
    */
    var MainLayout = Backbone.Marionette.Layout.extend({
        template: '#main-template',
        regions: {
            content: '.content'
        },
        initialize: function() {
            this.listenTo(Backbone.pubSub, 'setActive', this.fetchVideo);
        },
        onShow: function() {
            this.content.show(new VideosView());
        },
        showVideo: function() {
            this.content.show(new TranscribingLayout({
                'videoModel': this.videoModel
            }));
        },
        fetchVideo: function(videoId) {
            // fetch the video and show it
            this.videoModel = new Backbone.Model();
            this.videoModel.url = 'video/' + videoId;
            this.videoModel.fetch().complete( function() {
                this.showVideo();
            }.bind(this));
        } 
    });

    return MainLayout;

});
