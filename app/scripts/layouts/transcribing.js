define([
  'underscore', 
  'backbone', 
  'marionette', 
  'views/cues', 
  'views/htmlvideo', 
  'views/bank'
], function (_, Backbone, Marionette, CuesView, HTMLVideoView, BankView) {
    'use strict';

    /** 
        The Transcribing Layout is a complex view that consists of three main regions.
        The CuePane showing the list of a cues in the video.
        The BankPane showing the list in the bank for export
        The Video view, which will show the HTML Video
    */

    return Marionette.Layout.extend({
        template: '#transcribing-template',
        regions: {
            cuepane: '#cuepane',
            video: '#video',
            bank: '#bank'
        },
        initialize: function(options) {
            if (options && options.videoModel) {
                this.videoModel = options.videoModel;
            }
        },
        onShow: function() {
            this.cuepane.show(new CuesView({videoId: this.videoModel.get('_id')}));
            this.video.show(new HTMLVideoView({videoModel: this.videoModel}));
            this.bank.show(new BankView());
        },
    })
});
