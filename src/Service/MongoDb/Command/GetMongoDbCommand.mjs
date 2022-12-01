import { MONGO_DB_DEFAULT_PORT } from "../../../Adapter/MongoDb/MONGO_DB.mjs";
import mongodb from "mongodb";

/** @typedef {import("../../../Adapter/MongoDb/MongoDb.mjs").MongoDb} MongoDb */
/** @typedef {import("../../../../../flux-shutdown-handler-api/src/Adapter/ShutdownHandler/ShutdownHandler.mjs").ShutdownHandler} ShutdownHandler */

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
        const password = mongo_db.password ?? null;
        const port = mongo_db.port ?? MONGO_DB_DEFAULT_PORT;
        const user = mongo_db.user ?? null;

        const client = await new mongodb.MongoClient(`mongodb://${user !== null ? `${user}${password !== null ? `:${password}` : ""}@` : ""}${mongo_db.host}${port !== MONGO_DB_DEFAULT_PORT ? `:${port}` : ""}/${mongo_db.database}`).connect();

        this.#shutdown_handler.addShutdownTask(async () => {
            await client.close();
        });

        return client.db(mongo_db.database);
    }
}
