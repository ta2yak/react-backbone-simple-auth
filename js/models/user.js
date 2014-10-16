define(['backbone'],function(Backbone){

    var User = Backbone.Model.extend({
        initialize: function(){
            //_.bindAll(this);
        
        },

        defaults: {
            id: 0,
            username: '',
            name: '',
            email: ''
        },

        url: function(){
            return '/user';
        }
    });

    return User;
});


