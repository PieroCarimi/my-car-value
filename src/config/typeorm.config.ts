import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  //   createTypeOrmOptions(): TypeOrmModuleOptions {
  //     return {
  //       type: 'sqlite',
  //       synchronize: false,
  //       database: this.configService.get<string>('DB_NAME'),
  //       autoLoadEntities: true,
  //     };
  //  }

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    ) {
      return {
        type: 'sqlite',
        synchronize: process.env.NODE_ENV === 'test' ? true : false,
        database: this.configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        migrationsRun: process.env.NODE_ENV === 'test' ? true : false,
        keepConnectionAlive: process.env.NODE_ENV === 'test' ? true : false,
      };
    } else if (process.env.NODE_ENV === 'production') {
      return {
        type: 'postgres',
        url: this.configService.get<string>('DATABASE_URL'),
        synchronize: false,
        migrationsRun: true,
        entities: ['dist/**/*.entity.js'], // Assicurati che questo percorso sia corretto per il tuo progetto
        migrations: ['dist/migrations/*.js'],
        ssl: {
          rejectUnauthorized: false,
        },
      };
    } else {
      throw new Error('unknown environment');
    }
  }
}
