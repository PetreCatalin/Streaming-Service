export default class User {

	constructor(name, uuid, socketId) {
		this.id = uuid;
		this.name = name;
		this.socketId = socketId;
	}

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			socketId: this.socketId
		}
	}
}