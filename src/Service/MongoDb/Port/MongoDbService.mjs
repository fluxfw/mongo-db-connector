import { GetMongoDbCommand } from "../Command/GetMongoDbCommand.mjs";
import mongodb from "mongodb";
import { ShutdownHandler } from "../../../../../flux-shutdown-handler-api/src/Adapter/ShutdownHandler/ShutdownHandler.mjs";

/** @typedef {import("../../../Adapter/MongoDb/MongoDb.mjs").MongoDb} MongoDb */

export class MongoDbService {
    /**
     * @type {ShutdownHandler}
     */
    #shutdown_handler;

    /**
     * @param {ShutdownHandler} shutdown_handler
     * @returns {MongoDbService}
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
     * @param {MongoDb} mongo_db
     * @returns {Promise<mongodb.Db>}
     */
    async getMongoDb(mongo_db) {
        return GetMongoDbCommand.new(
            this.#shutdown_handler
        )
            .getMongoDb(
                mongo_db
            );
    }
}
