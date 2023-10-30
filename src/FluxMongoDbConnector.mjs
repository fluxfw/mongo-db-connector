import mongodb from "mongodb";
import { FLUX_MONGO_DB_CONNECTOR_DEFAULT_HOST, FLUX_MONGO_DB_CONNECTOR_DEFAULT_PORT } from "./FLUX_MONGO_DB_CONNECTOR.mjs";

/** @typedef {import("mongodb").Db} Db */
/** @typedef {import("./ShutdownHandler/ShutdownHandler.mjs").ShutdownHandler} ShutdownHandler */

export class FluxMongoDbConnector {
    /**
     * @type {ShutdownHandler | null}
     */
    #shutdown_handler;

    /**
     * @param {ShutdownHandler | null} shutdown_handler
     * @returns {FluxMongoDbConnector}
     */
    static new(shutdown_handler = null) {
        return new this(
            shutdown_handler
        );
    }

    /**
     * @param {ShutdownHandler | null} shutdown_handler
     * @private
     */
    constructor(shutdown_handler) {
        this.#shutdown_handler = shutdown_handler;
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

        /**
         * @returns {Promise<void>}
         */
        const close_client = async () => {
            await client.close();
        };

        if (this.#shutdown_handler !== null) {
            await this.#shutdown_handler.addTask(
                async () => {
                    await close_client();
                }
            );
        } else {
            for (const name of [
                "SIGINT",
                "SIGTERM"
            ]) {
                process.on(name, async () => {
                    await close_client();
                });
            }
        }

        return client.db(database);
    }
}
