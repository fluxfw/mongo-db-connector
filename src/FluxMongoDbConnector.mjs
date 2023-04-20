import mongodb from "mongodb";
import { FLUX_MONGO_DB_CONNECTOR_DEFAULT_HOST, FLUX_MONGO_DB_CONNECTOR_DEFAULT_PORT } from "./FLUX_MONGO_DB_CONNECTOR.mjs";

/** @typedef {import("mongodb").Db} Db */
/** @typedef {import("../../flux-shutdown-handler/src/FluxShutdownHandler.mjs").FluxShutdownHandler} FluxShutdownHandler */

export class FluxMongoDbConnector {
    /**
     * @type {FluxShutdownHandler}
     */
    #flux_shutdown_handler;

    /**
     * @param {FluxShutdownHandler} flux_shutdown_handler
     * @returns {FluxMongoDbConnector}
     */
    static new(flux_shutdown_handler) {
        return new this(
            flux_shutdown_handler
        );
    }

    /**
     * @param {FluxShutdownHandler} flux_shutdown_handler
     * @private
     */
    constructor(flux_shutdown_handler) {
        this.#flux_shutdown_handler = flux_shutdown_handler;
    }

    /**
     * @param {string} database
     * @param {string} user
     * @param {string} password
     * @param {string | null} host
     * @param {number | null} port
     * @returns {Promise<Db>}
     */
    async getMongoDb(database, user, password, host = null, port = null) {
        const _port = port !== FLUX_MONGO_DB_CONNECTOR_DEFAULT_PORT ? port : null;

        const client = await new mongodb.MongoClient(`mongodb://${host ?? FLUX_MONGO_DB_CONNECTOR_DEFAULT_HOST}${_port !== null ? `:${_port}` : ""}/${database}`, {
            auth: {
                username: user,
                password
            }
        }).connect();

        await this.#flux_shutdown_handler.addTask(async () => {
            await client.close();
        });

        return client.db(database);
    }
}
