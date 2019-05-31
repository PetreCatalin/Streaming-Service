import { UUID } from 'angular2-uuid';

export class User {
    id: string;
    name: string;
    socketId: any;

    constructor(name: string, socketId: any) {
			this.id = UUID.UUID();
			this.name = name;
			this.socketId = socketId;
		}

	toJSON() {
		return {
			id: this.id,
			name: this.name
		}
	}

}
