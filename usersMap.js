export default class UsersMap {

  constructor() {
		this.usersMap = new Map(); //Map<userId,user>
	}

	add(user) {
		this.usersMap.set(user.id, user);
	}

	get(id) {
		return this.usersMap.get(id);
	}

	has(id) {
		return this.usersMap.has(id);
	}

	delete(id) {
		this.usersMap.delete(id);
	}

	size() {
		return this.usersMap.size;
	}

	toArray() {
		return [ ...this.usersMap.values() ];
	}

	toJSON() {
		const users = this.toArray();
		return users.map(user => user.toJSON());
	}

}
    

