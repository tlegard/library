define([
  'underscore', 
  'backbone', 
  'marionette', 
  'views/cue',
  'collections/uniquecues'
], function (_, Backbone, Marionette, CueView, UniqueCuesCollection) {
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
                this.cueCollection = new Backbone.Collection();
                this.cueCollection.url = 'transcription/' + options.videoId;
                this.cueCollection.fetch();
                this.uniqueCollection = new UniqueCuesCollection();
                this.uniqueCollection.url = 'transcription/' + options.videoId;
                this.uniqueCollection.fetch();
                this.collection = this.cueCollection;
            }            
        },
        handleSort: function(event) {
            event.preventDefault();
            var type = this.$('select').val();
            if (type === 'confidence')
                this.sortConfidence();
            else if (type === 'time')
                this.sortTime();
            else if (type === 'frequency')
                this.sortFrequency();

        },
        sortConfidence: function() {
            this.collection = this.cueCollection;

            this.collection.comparator = function(obj) {
                return parseInt(obj.get('confidence'), 10);
            }
            this.collection.sort();
            this.render();
        },
        sortTime: function() {
            this.collection = this.cueCollection;

            this.collection.comparator = function(obj) {
                return parseInt(obj.get('time'), 10);
            }
            this.collection.sort();
            console.log(this.collection);
            this.render();
        },
        sortFrequency: function() {
            var freqTable = _.countBy(this.collection.models, function(cue) {
                return cue.get('name');
            });

            _.forEach(this.uniqueCollection.models, function(cue) {
                cue.set('freq', freqTable[cue.get('name')]);
            });

            this.uniqueCollection.comparator = function(cue) {
                return 100 - cue.get('freq');
            };

            this.uniqueCollection.sort();

            this.collection = this.uniqueCollection;
            this.render();
        },
        saveCollection: function() {
            Backbone.sync("update", this.collection);
        }

    })
});

