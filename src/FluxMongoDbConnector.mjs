import mongodb from "mongodb";
import { FLUX_MONGO_DB_CONNECTOR_DEFAULT_HOST, FLUX_MONGO_DB_CONNECTOR_DEFAULT_PORT } from "./FLUX_MONGO_DB_CONNECTOR.mjs";

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
     * @param {string | null} user
     * @param {string | null} password
     * @param {string | null} host
     * @param {number | null} port
     * @returns {Promise<mongodb.Db>}
     */
    async getMongoDb(database, user = null, password = null, host = null, port = null) {
        const _port = port ?? FLUX_MONGO_DB_CONNECTOR_DEFAULT_PORT;

        const client = await new mongodb.MongoClient(`mongodb://${user !== null ? `${user}${password !== null ? `:${password}` : ""}@` : ""}${host ?? FLUX_MONGO_DB_CONNECTOR_DEFAULT_HOST}${_port !== FLUX_MONGO_DB_CONNECTOR_DEFAULT_PORT ? `:${_port}` : ""}/${database}`).connect();

        await this.#flux_shutdown_handler.addTask(async () => {
            await client.close();
        });

        return client.db(database);
    }
}