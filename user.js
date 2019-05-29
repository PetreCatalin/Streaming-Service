import uuidV4 from 'uuid/v4';

export default class User {

	constructor(name, socket) {
		this.id = uuidV4();
		this.name = name;
		this.socket = socket;
	}

	toJSON() {
		return {
			id: this.id,
			name: this.name
		}
	}
}