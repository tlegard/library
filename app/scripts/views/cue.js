define([
    'backbone',
    'marionette',
], function (Backbone, Marionette) {
    "use strict";

    /** 
        A CueView is where the heart of the magic happens. We bind specific events based 
        on actions that can be performed.
    */
    return Marionette.ItemView.extend({
    	template: "#cue",
    	el: "<li>",
    	model: Backbone.Model,
    	events: {
    		'dblclick' : 'edit',
            'keypress' : 'saveCue',
    		'click .listen': 'seek',
    		'click .remove': 'removeCue',
    		'click .ok': 'addCue',
    	},
    	edit: function() {
            // Switch templates to edit mode and rerender. 
    		this.template = '#cue-edit'
    		this.render();
    		this.$('input').focus();
    	},
        saveCue: function(event) {
            // On enter update the model 
            if (event.keyCode != 13) return;
            this.model.set('name', this.$('input').val());
            this.model.set('confidence', 100);
            this.static();
        },
    	static: function() {
            // Swithc template to static mode and rerender.
    		this.template = '#cue'
    		this.render();
    	},
    	removeCue: function() {
            this.model.destroy();
    		this.close();
    	},
    	addCue: function() {
            this.model.set('confidence', 100);
            Backbone.pubSub.trigger('addCue', this.model);
    		this.close();
    	},
    	seek: function() {
            // Find the video and navigate to around it's given time. 
            // Play for slightly longer than it's duration. 
    		var video = document.getElementById("video1")
    		var start = video.currentTime = this.model.get('time')/1000 - .1;
    		video.play();
    		var pause = parseInt(this.model.get('duration'), 10) + 100;
    		var interval = window.setInterval(function() {
    			if (video.currentTime > start + pause/1000) {
    				video.pause();
    				window.clearInterval(interval);
    			}

    		}, 200);
    	}
    });
});
