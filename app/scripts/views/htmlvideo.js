define([
    'backbone',
    'marionette',
], function (Backbone, Marionette) {
    "use strict";


    return Marionette.ItemView.extend({
    	template: '#video-template',
        events: {
            'click .ok': 'saveSrc',
            'click .edit': 'showEdit'
        },
    	initialize: function(options) {
    		if (options && options.videoModel) {
    			this.model = options.videoModel
    		}
    	},
    	onBeforeRender: function() {
    		if (!this.model.get('videoSrc')) {
                this.template = '#video-edit';
            }
    	},
        saveSrc: function() {
            this.model.set('videoSrc', this.$('input').val());
            this.model.save();
            this.template = '#video-template';
            this.render();
        },
        showEdit: function() {
            this.template = '#video-edit';
            this.render();
        }
    	
    });
});
