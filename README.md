# mongo-db-connector

## Set up

*You need to fill placeholders (Wrapped in `%`), create secret files and adjust to your needs (Applies everywhere)*

### Docker

#### Compose

```yaml
services:
    mongo-db:
        environment:
            - MONGO_INITDB_ROOT_PASSWORD_FILE=/run/secrets/mongo_db_root_password
            - MONGO_INITDB_ROOT_USERNAME=root
        image: mongo:%version%
        secrets:
            - mongo_db_root_password
        volumes:
            - ./data/mongo-db:/data/db
secrets:
    mongo_db_root_password:
        file: ./data/secrets/mongo_db_root_password
```

#### Connect to mongosh

```shell
docker compose exec mongo-db mongosh -u root
```

### Mongosh

#### Disable "Anti-features"

Optional, if you don't like

```mongosh
disableTelemetry()
db.disableFreeMonitoring()
```

#### Create user

```mongosh
use %mongo-db-database%
db.createUser({user: "%mongo-db-user%", pwd: passwordPrompt(), roles: [{role: "readWrite", db: "%mongo-db-database%"}]})
```
