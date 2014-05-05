define([
    'backbone',
    'marionette',
], function (Backbone, Marionette) {
    "use strict";

    /**
        VideoView is a single video in the VideosList in the MainLayout. 

        When clicked it will mark its self as active and switch to the transcribing 
        layout for editing.
      */ 

    return Marionette.ItemView.extend({
    	template: "#video-short",
    	el: "<li>",
    	model: Backbone.Model,
        events: {
            'click': 'setVideo'
        },
        setVideo: function() {
            Backbone.pubSub.trigger('setActive', this.model.get('_id'));
        }
    });
});
