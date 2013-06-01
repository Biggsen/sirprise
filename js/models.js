/* Models */

var Song = Parse.Object.extend("Song", {
	defaults: {
		name: 'default',
		user: null,
		tempo: 120,
	},
});

var Songs = Parse.Collection.extend({
	model: Song
});

/* Drum, Bass, Guitar or Vocal */
var Pattern = Parse.Object.extend("Pattern", {
	defaults: {
		name: '',
		type: '',
	},
});

var Patterns = Parse.Collection.extend({
	model: Pattern
});

/* Factory method for new kits */

/*var CreateDefaultDrumKit = function( ) {

	var drumkit = new Drums();
	
	// create 3 default generators 
	drumkit.generators = new SoundGenerators();
	drumkit.generators.add([{
			name: 'Bassdrum',
			percentage: 60,
			type: 'Drum',
			parent: drumkit
		},{
			name: 'Snare',
			percentage: 40,
			type: 'Drum',
			parent: drumkit
		},{
			name: 'Hihat',
			percentage: 80,
			type: 'Drum',
			parent: drumkit
		},{
			name: 'Bass',
			percentage: 70,
			type: 'Bass',
			parent: drumkit
		}]
	);

	// add 8 sequences for the generators 
	drumkit.generators.each(function ( generator ) {
		generator.sequences = new Sequences();
		for(var i = 0; i < 8; i++) {
			generator.sequences.add([{
					position: 0,
					parent: generator
				}]);
		}
	});

	return drumkit;
};
*/
/* Factory method to load kits */
var LoadDrumKit = function( id, options ) {

	if(!id) {
		options(new Pattern());
		return;
	}

	var query = new Parse.Query(Pattern);
	query.get(id, {
	 	success: function(pattern) {
	 		options(pattern);
		}
	});
};

var LoadGenerators = function( pattern, options ) {

	if(pattern.isNew()) {
		var generators = new SoundGenerators();
		generators.add([{
			name: 'Bassdrum',
			percentage: 60,
			type: 'Drum',
			parent: pattern
		},{
			name: 'Snare',
			percentage: 40,
			type: 'Drum',
			parent: pattern
		},{
			name: 'Hihat',
			percentage: 80,
			type: 'Drum',
			parent: pattern
		},{
			name: 'Bass',
			percentage: 70,
			type: 'Bass',
			parent: pattern
		}]);
		options(generators);
		return;
	}

	pattern.generators = new SoundGenerators();	 		
	pattern.generators.query = new Parse.Query(SoundGenerator);
	pattern.generators.query.equalTo("parent", pattern);
	pattern.generators.fetch({
		success: function( generators ) {
			options(generators);
		}
	});
}

var LoadSequences = function( generator, options ) {


	if(generator.isNew()){
		sequences = new Sequences();
		for(var i = 0; i < 8; i++) {
			sequences.add([{
					position: 0,
					note: '',
					parent: generator
				}]);
		}
		options(sequences);
		return;
	}

	generator.sequences = new Sequences();
	generator.sequences.query = new Parse.Query(Sequence);
	generator.sequences.query.equalTo("parent", generator);
	generator.sequences.fetch({
		success: function ( sequences ) {
			options(sequences);
		}
	} ); // fetch
}



var Drums = Pattern.extend({
	defaults: {
		name: '',
		type: 'DrumKit',
	},
});

/* String or specific drum*/
var SoundGenerator = Parse.Object.extend("SoundGenerator", {
	defaults: {
		name: '',
		type: '',
		percentage: 50,
		parent: null,
	},
});

var SoundGenerators = Parse.Collection.extend({
	model: SoundGenerator,
});

var Sequence = Parse.Object.extend("Sequence", {
	defaults: {
		parent: null,
		position: 1,
		note: 'x'
	},
})

var Sequences = Parse.Collection.extend({
	model: Sequence,
});