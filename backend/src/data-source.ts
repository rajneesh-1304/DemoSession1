import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './users/user.entity';
const rawDataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'demo',
  synchronize: false,
  entities: [
    User,
  ],
  seeds: ['dist/seeds/**/*.js'],
  migrations: ['dist/migrations/*.js'],
  logging: true
};

export const dataSourceOptions = rawDataSourceOptions as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;