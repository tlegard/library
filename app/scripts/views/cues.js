define([
  'underscore', 
  'backbone', 
  'marionette', 
  'views/cue'
], function (_, Backbone, Marionette, CueView) {
    'use strict';

    /** CuesView is responsible for maintaing the Collection recieved from hitting
        transcription/:id

        It is also responsible for sorting the collection when a item in the drop down is pressed.
    */


    return Marionette.CompositeView.extend({
        itemView: CueView,
        itemViewContainer: '#cue-collection-container',
        template: '#cue-composite',
        events: {
            'change select': 'handleSort',
            'click .save': 'saveCollection'
        },
        initialize: function(options){
            if (options && options.videoId) {
                this.collection = new Backbone.Collection();
                this.collection.url = 'transcription/' + options.videoId;
                this.collection.fetch();
            }            
        },
        handleSort: function(event) {
            event.preventDefault();
            var type = this.$('select').val();
            if (type === 'confidence')
                this.sortConfidence();
            else if (type === 'time')
                this.sortTime();

        },
        sortConfidence: function() {
            this.collection.comparator = function(obj) {
                return parseInt(obj.get('confidence'), 10);
            }
            this.collection.sort();
            this.render();
        },
        sortTime: function() {
            console.log(this.collection);
            this.collection.comparator = function(obj) {
                return parseInt(obj.get('time'), 10);
            }
            this.collection.sort();
            console.log(this.collection);
            this.render();
        },
        saveCollection: function() {
            Backbone.sync("update", this.collection);
        }

    })
});

