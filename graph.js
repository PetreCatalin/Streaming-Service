export default class Graph {
    
    constructor() {
		this.outgoing = new Map(); // outgoing edges --those will emit streams to other users (Map<socket, socket[]>)
		this.incoming = new Map(); // incoming edges --those will get streams from other users
    }

    areLinked(src, dst) {
        if (this.outgoing.has(src)) {
            return this.outgoing.get(src).has(dst);
        }
        return false;
    }

    link(src, dst) { //link 2 sockets
        if (!this.outgoing.has(src)) { //if this entry does not exist, create a set for it
            this.outgoing.set(src, new Set);
        }
        if (!this.incoming.has(dst)) { //if this entry does not exist, create a set for it
            this.incoming.set(dst, new Set);
        }

        this.outgoing.get(src).add(dst);
        this.incoming.get(dst).add(src);
        return this;
    }

    unlink(src, dst) { //unlink 2 sockets both in outgoing and incoming
        if (this.outgoing.has(src)) {
            this.outgoing.get(src).delete(dst);
        }
        if (this.incoming.has(dst)) {
            this.incoming.get(dst).delete(src);
        }
        return this;
    }

    outgoingTo(node) { //set of sockets node emits to
        if (this.outgoing.has(node)) {
            return [ ...this.outgoing.get(node) ];
        }
        return [ ];
    }

    incomingTo(node) { //set of sockets that are emmiting to node
        if (this.incoming.has(node)) {
            return [ ...this.incoming.get(node) ];
        }
        return [ ];
    }

    delete(node) { //delete a socket (remove all its links (legaturi))
        const outgoing = this.outgoingTo(node);
        const incoming = this.incomingTo(node);
        outgoing.forEach(out => this.unlink(node, out));
        incoming.forEach(inc => this.unlink(inc, node));
        return this;
    }

    unlinkOutgoing(node) { //unlink all the nodes that node emits to
        const nodes = this.outgoingTo(node);
        nodes.forEach(out => this.unlink(node, out));
        return this;
    }

    unlinkIncoming(node) { //unlink all the nodes from which node receive data
        const nodes = this.incomingTo(node);
        nodes.forEach(inc => this.unlink(inc, node));
        return this;
    }
    
}