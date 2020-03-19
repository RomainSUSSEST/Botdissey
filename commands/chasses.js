const fs = require('fs');
const json = JSON.parse(fs.readFileSync('sublimations.json', 'utf8'));
const sublimations = json["SUBLIMATIONS"];
const { prefix } = require('../config.json');

module.exports = {
	name: 'chasses',
	description: 'Trouver une sublimation correspondante aux chasses données.',
	async execute(message) {
		// Variables & Constants
		let chasses = message.content.substr(`${prefix}chasses `.length).toUpperCase();
		let response = '';

		// If length is enough
		if (chasses.length < 3 || chasses.length > 4) {
			response += "Veuillez rentrer, au moins, 3 chasses sous la forme RBV (**R**ouge**B**leue**V**erte), utilisez **X** (Blanche)";
			message.reply(response);
			return;
		}

		// If values are ok
		let regex = /[RVBX]+/g;
		let count = 0;

		for (i = 0; i < chasses.length; i++) {
			if (chasses[i].match(regex) == null) {
				response += "Veuillez rentrer des chasses valides **R** (**R**ouge) ou **B** (**B**leue) ou **V** (**V**erte) ou **X** (Blanche)";
				message.reply(response);
				return;
			}

			if (chasses[i] == "X") {
				count++;
			}
		}

		// Replace existing X
		let whiteChasse1 = [];
		let whiteChasse2 = [];
		let whiteChasse3 = [];

		function replaceAllX() {
			whiteChasse1.push(chasses.replace("X", "R"));
			whiteChasse1.push(chasses.replace("X", "V"));
			whiteChasse1.push(chasses.replace("X", "B"));

			if (count > 1) {
				for (i = 0; i < whiteChasse1.length; i++) {
					whiteChasse2.push(whiteChasse1[i].replace("X", "R"));
					whiteChasse2.push(whiteChasse1[i].replace("X", "V"));
					whiteChasse2.push(whiteChasse1[i].replace("X", "B"));
				}
			}

			if (count > 2) {
				for (i = 0; i < whiteChasse2.length; i++) {
					whiteChasse3.push(whiteChasse2[i].replace("X", "R"));
					whiteChasse3.push(whiteChasse2[i].replace("X", "V"));
					whiteChasse3.push(whiteChasse2[i].replace("X", "B"));
				}
				console.log(whiteChasse3);
			}
		}

		// If number of X doesn't match length
		if (count == chasses.length) {
			sendAll();
			return;
		}

		// If X exits
		if (count > 0) {
			replaceAllX();
		}

		// How many X
		let array = [];
		switch (count) {
			case 0:
				array = [chasses];
				break;
			case 1:
				array = whiteChasse1;
				break;
			case 2:
				array = whiteChasse2;
				break;
			case 3:
				array = whiteChasse3;
				break;
			case 4:
				sendAll();
				break;
			default:
				break;
		}

		// How many values
		switch (chasses.length) {
			case 3:
				troisChasses();
				break;
			case 4:
				quatreChasses();
				break;
			default:
				break;
		}

		// Search with 3 values
		function troisChasses() {
			for (i = 0; i < sublimations.length; i++) {
				for (i2 = 0; i2 < array.length; i2++) {
					if (array[i2] == sublimations[i]["CHASSES"]) {
						response += "**" + sublimations[i]["NOM"] + "** : " + sublimations[i]["EFFETS"] + " // Cumul max : " + sublimations[i]["CUMUL"] + '\n';
					}
				}
			}
		}

		// Search with 4 values
		function quatreChasses() {
			let sublis = [];

			for (i = 0; i < sublimations.length; i++) {
				for (i2 = 0; i2 < array.length; i2++) {
					let firstPart = array[i2].substr(1);
					let secondPart = array[i2].substring(0, array[i2].length - 1);
					if (firstPart == sublimations[i]["CHASSES"] || secondPart == sublimations[i]["CHASSES"]) {
						// Deny duplicata
						let newSubli = "**" + sublimations[i]["NOM"] + "** : " + sublimations[i]["EFFETS"] + " // Cumul max : " + sublimations[i]["CUMUL"]+ '\n';
						if(sublis.indexOf(newSubli) === -1) sublis.push(newSubli)
					}
				}
			}

			// Display all found sublimations
			for (i = 0; i < sublis.length; i++) {
				response += sublis[i];
			}
		}

		// Send all data
		function sendAll() {
			message.reply("pour voir la liste complète de toutes les sublimations : https://methodwakfu.com/articles/lenchantement/");
		}

		// Send response
		message.channel.send(response, {'split': true });
	},
};