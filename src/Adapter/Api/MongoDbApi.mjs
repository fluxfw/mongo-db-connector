/** @typedef {import("../MongoDb/MongoDb.mjs").MongoDb} MongoDb */
/** @typedef {import("mongodb")} mongodb */
/** @typedef {import("../../Service/MongoDb/Port/MongoDbService.mjs").MongoDbService} MongoDbService */
/** @typedef {import("../../../../flux-shutdown-handler-api/src/Adapter/ShutdownHandler/ShutdownHandler.mjs").ShutdownHandler} ShutdownHandler */

export class MongoDbApi {
    /**
     * @type {MongoDbService | null}
     */
    #mongo_db_service = null;
    /**
     * @type {ShutdownHandler}
     */
    #shutdown_handler;

    /**
     * @param {ShutdownHandler} shutdown_handler
     * @returns {MongoDbApi}
     */
    static new(shutdown_handler) {
        return new this(
            shutdown_handler
        );
    }

    /**
     * @param {ShutdownHandler} shutdown_handler
     * @private
     */
    constructor(shutdown_handler) {
        this.#shutdown_handler = shutdown_handler;
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        this.#mongo_db_service ??= await this.#getMongoDbService();
    }

    /**
     * @param {MongoDb} mongo_db
     * @returns {Promise<mongodb.Db>}
     */
    async getMongoDb(mongo_db) {
        return this.#mongo_db_service.getMongoDb(
            mongo_db
        );
    }

    /**
     * @returns {Promise<MongoDbService>}
     */
    async #getMongoDbService() {
        return (await import("../../Service/MongoDb/Port/MongoDbService.mjs")).MongoDbService.new(
            this.#shutdown_handler
        );
    }
}
