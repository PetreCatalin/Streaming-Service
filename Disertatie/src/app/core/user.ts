import { UUID } from 'angular2-uuid';

export class User {
    id: string;
    name: string;
    socket: any;

    constructor(name: string, socket: any) {
			this.id = UUID.UUID();
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
