import { DataSource } from "typeorm";
import * as path from "path";

export default new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "123456",
  database: "miniu_db",
  entities: [path.join(__dirname, "src", "**", "*.entity.{ts,js}")],
  migrations: [path.join(__dirname, "src", "migrations", "**", "*.{ts,js}")],
  synchronize: false,
  migrationsRun: false,
  logging: true,
  migrationsTableName: "migrations",
});
