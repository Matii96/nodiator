import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './mocks/app.module';
import { allCatsResult } from './mocks/cats/db';

describe('@nodiator/nest (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/cats (GET)', () => {
    request(app.getHttpServer()).get('/cats').expect(200).expect(allCatsResult);
  });
});
