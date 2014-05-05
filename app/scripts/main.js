require([
    'app',
    'backbone',
    'marionette',
    'routers/index',
    'controllers/index',
    'layouts/main',
    'views/videos'
], function (
    App,
    Backbone,
    Marionette,
    IndexRouter,
    IndexController,
    MainLayout,
    VideosView
) {
    "use strict";

    /** Our application wraps around the #app div and displays content accordingly **/
    
    // Intialize pubSub
    Backbone.pubSub = _.extend({}, Backbone.Events);
    
    var app = new App();
    var layout = new MainLayout();

    app.addRegions({
        main: '#app', 
    });

    app.addInitializer(function () {
        // Show main layout on intialization
        app.main.show(layout);
    });

    app.start();

    new IndexRouter({
        controller: new IndexController()
    });

    Backbone.history.start();
});
