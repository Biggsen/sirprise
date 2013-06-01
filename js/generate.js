
var Generate = {

	randomValue: function(type, odds, rootnote, scale ) {

		//random value from 1-100
		var perc = Math.floor((Math.random()*100)+1);

		if(type == 'Bass' || type == 'Guitar') {
			var pos = Math.floor((Math.random()*10));
			var notes = Generate.bass_sequence(rootnote, scale)

			return (perc <= odds) ?  notes[pos] : '';
		} else {
			return (perc <= odds) ? 'x' : '';
		}
	},


	bass_sequence: function(root, scale) {
		//return ['F1', 'G1', 'G#1', 'A#1', 'C1', 'C#1', 'D#1', 'F2', 'G2', 'G#2']
		if(scale == 'major')
			return Generate.majorscale_note(10, Generate.note_pos(root)-1);
		else
			return Generate.minorscale_note(10, Generate.note_pos(root)-1);
	},

	majorscale: function() {
		var seq = [1,3,5,6,8,10,12];
	},

	minorscale_note: function(length, offset) {
		var result = [];
		var seq = Generate.minorscale_pos(length);
		for(var i = 0; i < length; i++) {

			var pos = seq[i];

			ocatave = Math.floor((pos+(offset-1)+12) / 12);

			result[i] = Generate.note(pos, offset) + ocatave.toString();
		}
		return result;
	},

	majorscale_note: function(length, offset) {
		var result = [];
		var seq = Generate.majorscale_pos(length);
		for(var i = 0; i < length; i++) {

			var pos = seq[i];

			ocatave = Math.floor( ( (pos + ( offset-1 ))+12 ) / 12);

			result[i] = Generate.note(pos, offset) + ocatave.toString();
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

	majorscale_pos: function(length) {
		var result = [];
		var seq = [1,3,5,6,8,10,12];
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

	note: function(pos, offset) {
		
//		if(offset) {
			pos = pos + offset;
			while(pos > 12)
				pos = (pos > 12) ? pos - 12 : pos;
//		}

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
				console.log(pos);
				return "not a note";
				
		}
	},

	note_pos: function(pos) {
		
		switch(pos) {
			case 'E':
				return 1; 
			case 'F':
				return 2;
			case 'F#':
				return 3;
			case 'G':
				return 4;
			case 'G#':
				return 5;
			case 'A':
				return 6;
			case 'A#':
				return 7;
			case 'B':
				return 8;
			case 'C':
				return 9;
			case 'C#':
				return 10;
			case 'D':
				return 11;
			case 'D#':
				return 12;
			default:
				return 0
		}
	}
} 