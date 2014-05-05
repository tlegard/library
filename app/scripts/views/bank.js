define([
    'backbone',
    'marionette',
    'views/cue',
], function (Backbone, Marionette, CueView) {
    "use strict";

    /**
        The BankView contains all the words you which to be contained in a 
        wordcloud related to this video.

        Listens to the Backbone.pubSub to listen to the addCue event, once
        recieved it will add the cue the collection */

    return Marionette.CompositeView.extend({
        itemView: CueView,
        itemViewContainer: '#bank',
        template: '#bank-composite',
        collection: new Backbone.Collection(),
        initialize: function(){
            this.listenTo(Backbone.pubSub, 'addCue', this.addCue);
        },
        events: {
            'click .export': 'export',
            'click .revert': 'revert'
        },
        addCue: function(model) {
            this.collection.add(model);
            this.render();
        },
        export: function() {
            /** Reduce to the collection down to just a string.  */
            this.model = new Backbone.Model();
            var exportedString = _.reduce(this.collection.models, function(memo, model) {
                return (model) ? memo + model.get('name') + " " : memo;
            }, "");
            this.model.set('text', exportedString);
            this.template = '#text-dump';
            this.render();
        },
        revert: function() {
            this.template = '#bank-composite';
            this.render();
        },
        onBeforeRender: function(collection) {
            // Allow only unique words to be shown in the bank view. 
            var uniqueCollection = new Backbone.Collection();

            _.each(this.collection.models, function(cue) {
                if (!_.some(uniqueCollection.models, function(_cue) {
                    return uniqueCollection.length != 0 && cue.get('name').trim() === _cue.get('name').trim();
                })) {
                    uniqueCollection.add(cue);
                } else {
                    this.collection.remove(cue);
                }
            }.bind(this));

            this.collection = uniqueCollection;
        }
    });
});
