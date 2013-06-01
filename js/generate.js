
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

	majorscale: function() {
		var seq = [1,3,5,6,8,10,12];
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
				return 'Bb';
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