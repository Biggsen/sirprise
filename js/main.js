Parse.initialize("zU7EqXKmDbXVqbeO0glxd9jrqd9FdC5SB5w4I8kP", "TLxXc9PojUVGsA4zWTtGaGK8sCreNxmCiNxqU1Rq");


var SequenceView = Parse.View.extend({

	tagName: 'td',

	initialize: function() {

		_.bindAll(this, 'render' );

		this.model.bind('change', this.render);
		this.render();
	},

	render: function() {
		var html = tpl.get('sequence');

		var render = {
			note: this.model.get("note")
		};

		this.$el.html(Mustache.to_html(html, render));
		return this;
	}

});

var SoundGeneratorView = Parse.View.extend({

	tagName: 'tr',
	
	events: {
		"click #generate": "generate", 
	},
	
	initialize: function() {
		_.bindAll(this, 'render', 'generate' );

		var self = this;
		if(this.model.sequences) {
			this.model.sequences.each(function ( sequence ){
				sequence.set("note", '');
			});
		}
	},

	render: function() {

		var render = {
			name: this.model.get("name"),
			percentage: this.model.get("percentage")
		};

		this.$el.attr('id', "sequences");
		this.$el.html(Mustache.to_html(tpl.get('generator-head'), render));

		var self = this;

		LoadSequences(this.model, function ( sequences ) 
		{
			self.model.sequences = sequences;
			self.model.sequences.each( function( sequence ) {
				var view = new SequenceView({ model: sequence });
				self.$el.append(view.render().el);
			});	

			self.$el.append(Mustache.to_html(tpl.get('generator-tail'), render));
		});
		return this;
	},

	generate: function() {
		this.model.sequences.each(function (sequence) {

			sequence.set("note", 
				Generate.randomValue(
					this.model.get("type"), 
					this.$el.find("#percentage").val()))
		}, this);
		return false;
	}
});

var PatternGenrateView = Parse.View.extend({

	el: "#content",

	events: {
		"click #generate_drums":  "generate_drums", 
		"click #generate_bass":  "generate_bass", 
		"click #generate_guitar":  "generate_guitar", 
		"click #save":  	"save", 
	},

	initialize: function() {

		_.bindAll(this, 'generate_drums', 'loadModel', 'save' );

		var html = tpl.get('pattern'); 
		this.$el.html(Mustache.to_html(html, this.model.toJSON()));

		if(!this.model.isNew())
			this.loadModel();
	},

	generate_drums: function(){
		this.model = new Pattern({
			type: 'Drum',
		});
		this.loadModel();
	},

	generate_bass: function(){
		this.model = new Pattern({
			type: 'Bass',
		});
		this.loadModel();
	},

	generate_guitar: function(){
		this.model = new Pattern({
			type: 'Guitar',
		});
		this.loadModel();
	},

	loadModel: function() {
		this.model.set("user", Parse.User.current());

		this.$el.find("#generators").empty();
		var self = this;

		LoadGenerators(this.model, function ( generators ) 
		{
			self.model.generators = generators;
			self.model.generators.each( function( pattern ) {
				var view = new SoundGeneratorView({model: pattern});
				self.$el.find("#generators").append(view.render().el);
			});	
			return false;
		});
		
		return false;
	},

	validate: function(elements) {
		var result = true;
		_.each(elements, function( element ){
			var el = this.$(element)
			if(el.val().length == 0) {
				el.addClass('error');
				result = false;
			} else {
				el.removeClass('error');
			}
		});
		return result;
	},

	validateName: function() {
		return this.validate(['#name' ]);
	},

	save: function() {
		
		if(!this.validateName()) {	
			displayError("please enter name");
			return false;
		}

		this.model.save({
			name: this.$el.find("#name").val()
		},{
			success: function( instance ) {
				displaySuccess("The pattern was saved");
			},
			error: function(object, error) {
				displayMessage(error.message);
			}
		});
		this.model.generators.each( function(drum) {
			drum.save();

			drum.sequences.each(function( seq ) {
				seq.save();
			});
		});
		return false;
	}
});


var PatternView = Parse.View.extend({

	tagName: "li",

	events: {
		"click #show"   	: "show",
	},

	initialize: function() {
		_.bindAll(this, 'render' );
		this.model.bind('change', this.render);
	},

	render: function() {
		var html = tpl.get('pattern-item'); 	
		this.$el.html(Mustache.to_html(html, this.model.toJSON()));
		return this;
	},

	show: function() {
		window.location.hash = "#pattern/" + this.model.id;
		return false;
	},
});

var PatternListView = Parse.View.extend({

	el: "#content",
	
	events: {
		"click #logout": 		"logout",
		"click #pattern":   	"pattern"	
	},

	initialize: function() {
		clearNotification();

		_.bindAll(this, 'render', 'addOne', 'addAll' );

		this.patterns = new Patterns();
		this.patterns.query = new Parse.Query(Pattern);
		this.patterns.query.equalTo("user", Parse.User.current());
		this.patterns.query.ascending("name"); 

		this.patterns.bind('add',     this.addOne);
     	this.patterns.bind('reset',   this.addAll);
		this.patterns.bind('all',     this.render);
		this.patterns.fetch();

		var html = tpl.get('list');
		this.$el.html(html);
	},

	render: function(){
		return this;
	},

	// Add a single song item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(pattern) {
  		var view = new PatternView({model: pattern});
  		this.$("#patterns").append(view.render().el);
    },

    // Add all items in the Book collection at once.
    addAll: function(collection, filter) {
      this.$el.find("#patterns").html("");
      this.patterns.each(this.addOne);
    },

    pattern: function() {
		window.location.hash = "#newpattern";
		return false;
    },

	logout: function() {
		Parse.User.logOut();
		window.location.hash = "#login";
		return false;
	}
});



var NotificationView = Parse.View.extend({

	el: "#notifications",

	initialize: function() {
		var html = tpl.get('notification');
		this.$el.html(Mustache.to_html(html, this.options));
	}

});

var EmptyView = Parse.View.extend({

	el: "#notifications",

	initialize: function() {
		this.$el.html('');
	}

});

var LoginView = Parse.View.extend({

	el: "#content",

	events: {
		"click #login_button": 				"login",
		"click #signup_button": 			"signup",
		"change input#username":			"validateLogin",
		"change input#password":			"validateLogin",
		"change input#su_username":			"validateSignUp",
		"change input#su_email":			"validateSignUp",
		"change input#su_password":			"validateSignUp",
		"change input#su_confirmpassword":	"validateSignUp",
	},

	initialize: function() {
		window.location.hash = "#login";
		_.bindAll(this, 'validate' );
		this.render();
	},

	render: function() {
		clearNotification();

		var html = tpl.get('login');//  $('#loginTemplate').html();
		this.$el.empty();
		this.$el.append(html);

		$.getScript("js/kickstart.js");
			/*.done(function(script, textStatus) {
			  console.log( textStatus );
			})
			.fail(function(jqxhr, settings, exception) {
			  console.log( exception );
			});*/
	},

	user: function() {
		return {
			name : this.$el.find("#username").val(),
			password: this.$el.find("#password").val(),  
		}
	},

	validate: function(elements) {
		var result = true;
		_.each(elements, function( element ){
			var el = this.$(element)
			if(el.val().length == 0) {
				el.addClass('error');
				result = false;
			} else {
				el.removeClass('error');
			}
		});
		return result;
	},

	validateLogin: function() {
		return this.validate(['#username', '#password']);
	},

	validateSignUp: function() {
		return this.validate(['#su_username', '#su_password', '#su_confirmpassword', '#su_email']);
	},

	login: function() {
		clearNotification();

		var user = this.user();

		if(!this.validateLogin()) {	
			displayError("No empty boxes allowed");
			return;
		}
		
		Parse.User.logIn(user.name, user.password, {
			success: function(user) {
				window.location.hash = "#list";
				displaySuccess("Login successfull");
			},	
			error: function(user, error) {
				displayError(error.message);
			}
		});
		return false;
	},

	signup: function() {
		var username = this.$el.find("#su_username").val();
		var password = this.$el.find("#su_password").val();
		var email = this.$el.find("#su_email").val();

		var user = new Parse.User();
		user.set("username", username);
		user.set("password", password);
		user.set("email", email);
		
		user.signUp(null, {
			success: function(user) {
				new NotificationView({
					type: 'success',
					icon: 'ok ',
					text: "You have been signed up for the gester"
				});
			},
			error: function(user, error) {
				new NotificationView({
					type: 'error',
					icon: 'remove',
					text: error.message
				});
			}
		});
		return false
	}
});


tpl = {
 
    // Hash of preloaded templates for the app
    templates:{},
 
    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment. All the template files should be
    // concatenated in a single file.
    loadTemplates:function (names, callback) {
 
        var that = this;
 
        var loadTemplate = function (index) {
            var name = names[index];
            console.log('Loading template: ' + name);

            $.get('templates/' + name + '.html', function (data) {
                that.templates[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            });
        }
 
        loadTemplate(0);
    },
 
    // Get template by name from hash of preloaded templates
    get:function (name) {
        return this.templates[name];
    }
 
};


Parse.View.prototype.close = function () {
    console.log('Closing view ' + this);
    if (this.beforeClose) {
        this.beforeClose();
    }
    //this.remove();
    this.undelegateEvents();
    this.unbind();
    delete this;
};

//TODO: more generic handling of error messages
function clearMessage() {
	$("#message").empty();
}

function displayMessage(message) {
	clearNotification();
	clearMessage();
	$("#message").append(message);
}

var notice;

function clearNotification() {

	new EmptyView();

}

/*<!-- Error -->
<div class="notice error"><i class="icon-remove-sign icon-large"></i> This is an Error Notice 
<a href="#close" class="icon-remove"></a></div>

<!-- Warning -->
<div class="notice warning"><i class="icon-warning-sign icon-large"></i> This is a Warning Notice 
<a href="#close" class="icon-remove"></a></div>

<!-- Success -->
<div class="notice success"><i class="icon-ok icon-large"></i> This is a Success Notice 
<a href="#close" class="icon-remove"></a></div>*/
function displaySuccess(message) {
	
	new NotificationView({
					type: 'success',
					icon: 'ok',
					text: message
				});
}

function displayError(message) {
	
	new NotificationView({
					type: 'error',
					icon: 'remove',
					text: message
				});
}


var AppRouter = Parse.Router.extend({
	routes: {
		"": 			"index",
		"login": 		"login", 
		"signup": 		"login",
		"newpassword":	"password",
		"list":  		"list", 
		"newpattern": 	"newpattern", 
		"pattern/:id": 	"pattern", 
		/*"edit/:id": 	"edit", 
		"details/:id": 	"details",
		"genre":  		"genre",  
		"genre/:id": 	"genre", 
		"book": 		"book",
		"suggest": 		"suggest",*/
	},

	index: function() {
		
		if(Parse.User.current()) {
			if(this.currentView) this.currentView.close();

	    	this.currentView = new PatternListView({
	    		el: "#content",
			});
		}
		else {
			this.login();
		}
	},

	login: function() {
		if(this.currentView) this.currentView.close();

    	this.currentView = new LoginView({
    		el: "#content",
		});
	},

	list: function() {
		if(Parse.User.current()) {
			if(this.currentView) this.currentView.close();

	    	this.currentView = new PatternListView({
	    		el: "#content",
			});
		}
		else {
			this.login();
		}
	},

	newpattern: function() {
		this.pattern(null);
	},

	pattern: function(id) {
		if(Parse.User.current()) {
			if(this.currentView) this.currentView.close();

			var self = this;
			LoadPattern(id, function( pattern ) {
				self.currentView = new PatternGenrateView(	{
	    			el: "#content",
	    			model: pattern
				});
			});
		} else {	
			this.login();
		}
		return false;
	},
});

$(document).ready(function() {

	tpl.loadTemplates([
			'login', 
			'notification', 
			'list', 
			'pattern-item',
			'pattern',
			'generator-head',
			'generator-tail',
			'sequence'
			], 
		function () {
		    new AppRouter();
			Parse.history.start();
		});
});

