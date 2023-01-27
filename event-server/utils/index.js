const { clients } = require("../cache");
const EventEmitterManagerService = require("./event-service");

/**
 * Removes client and event emitter from cache
 * @param {string} clientId UUID of client
 * @param {string} guid UUID of SSE emitter
 */
function removeClientAndEmitter(clientId, guid) {
	delete clients[clientId];
	EventEmitterManagerService.removeEmitter(guid);
}

module.exports = {
	removeClientAndEmitter,
};
