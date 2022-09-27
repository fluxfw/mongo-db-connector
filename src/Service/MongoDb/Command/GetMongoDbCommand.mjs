import { MONGO_DB_DEFAULT_PORT } from "../../../Adapter/MongoDb/MONGO_DB.mjs";
import mongodb from "mongodb";
import { ShutdownHandler } from "../../../../../flux-shutdown-handler-api/src/Adapter/ShutdownHandler/ShutdownHandler.mjs";

/** @typedef {import("../../../Adapter/MongoDb/MongoDb.mjs").MongoDb} MongoDb */

export class GetMongoDbCommand {
    /**
     * @type {ShutdownHandler}
     */
    #shutdown_handler;

    /**
     * @param {ShutdownHandler} shutdown_handler
     * @returns {GetMongoDbCommand}
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
        const port = mongo_db.port ?? MONGO_DB_DEFAULT_PORT;

        const client = await new mongodb.MongoClient(`mongodb://${mongo_db.user !== null ? `${mongo_db.user}${mongo_db.password !== null ? `:${mongo_db.password}` : ""}@` : ""}${mongo_db.host}${port !== MONGO_DB_DEFAULT_PORT ? `:${port}` : ""}/${mongo_db.database}`).connect();

        this.#shutdown_handler.addShutdownTask(async () => {
            await client.close();
        });

        return client.db(mongo_db.database);
    }
}
