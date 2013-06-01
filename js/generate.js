
var Generate = {

	randomValue: function(type, odds) {

		//random value from 1-100
		var perc = Math.floor((Math.random()*100)+1);

		if(type == 'Bass' || type == 'Guitar') {
			return (perc <= odds) ?  Generate.minorscale() : '';
		} else {
			return (perc <= odds) ? 'x' : '';
		}
	},


	bass_sequence: function(scale) {
		//return ['F1', 'G1', 'G#1', 'A#1', 'C1', 'C#1', 'D#1', 'F2', 'G2', 'G#2']
		return Generate.minorscale_note(10, 1);
	},

	majorscale: function() {
		var seq = [1,3,5,6,8,10,12];
	},

	minorscale_note: function(length, offset) {
		var result = [];
		var seq = [1,3,4,6,8,9,11];
		var seq_counter = 0;
		var padding = 0;
		var ocatave = 1;
		for(var i = 0; i < length; i++) {

			if(seq_counter >= seq.length) {
				seq_counter = 0;
				padding = padding + 12;
				ocatave++;
			}
			var pos = seq[seq_counter++]+offset;
			if(pos > 12)
				pos = pos - 12;
			result[i] = Generate.note(pos) + ocatave.toString();
		}
		return result;
	},

	minorscale_pos: function(length) {
		var result = [];
		var seq = [1,3,4,6,8,9,11];
		var seq_counter = 0;
		var padding = 0;
		for(var i = 0; i < length; i++) {

			if(seq_counter >= seq.length) {
				seq_counter = 0;
				padding = padding + 12;
			}
			result[i] = padding + seq[seq_counter++];
		}
		return result;
	},

	minorscale: function() {
		var pos = Math.floor((Math.random()*7));
		var seq = [1,3,4,6,8,9,11];
		var ocatave = Math.floor((Math.random()*2+1));
		console.log(seq[pos]);
		return this.note(seq[pos]) + ocatave.toString();
	},

	note: function(pos) {
		switch(pos) {
			case 1:
				return 'E' 
			case 2:
				return 'F';
			case 3:
				return 'F#';
			case 4:
				return 'G';
			case 5:
				return 'G#';
			case 6:
				return 'A';
			case 7:
				return 'A#';
			case 8:
				return 'B';
			case 9:
				return 'C';
			case 10:
				return 'C#';
			case 11:
				return 'D';
			case 12:
				return 'D#';
			default:
				return 'n/a'
		}
	},
} 