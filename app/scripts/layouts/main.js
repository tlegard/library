define(['underscore', 'backbone', 'marionette', 'views/videos', 'layouts/transcribing'], function (_, Backbone, Marionette, VideosView, TranscribingLayout) {
    'use strict';

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
            this.videoModel = new Backbone.Model();
            this.videoModel.url = 'video/' + videoId;
            this.videoModel.fetch().complete( function() {
                this.showVideo();
            }.bind(this));
        } 
    });

    return MainLayout;

});
