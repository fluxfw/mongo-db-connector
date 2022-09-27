import mongodb from "mongodb";
import { MongoDbService } from "../../Service/MongoDb/Port/MongoDbService.mjs";
import { ShutdownHandler } from "../../../../flux-shutdown-handler-api/src/Adapter/ShutdownHandler/ShutdownHandler.mjs";

/** @typedef {import("../MongoDb/MongoDb.mjs").MongoDb} MongoDb */

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
        this.#mongo_db_service ??= this.#getMongoDbService();
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
     * @returns {MongoDbService}
     */
    #getMongoDbService() {
        return MongoDbService.new(
            this.#shutdown_handler
        );
    }
}
