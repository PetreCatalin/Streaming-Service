export default class User {

	constructor(name, uuid, socket) {
		this.id = uuid;
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