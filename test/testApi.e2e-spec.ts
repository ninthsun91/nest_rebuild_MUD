import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaClient } from '@prisma/client';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    await app.init();
  });

  /** SAMPLE
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  */

  describe('/user', () => {
    it('POST - fail: validation error(missing field)', () => {
      const userData = {
        username: 'test'
      }
      return request(app.getHttpServer())
        .post('/user')
        .send(userData)
        .expect(400);
    });
    it('POST - fail: validation error(unnecessary field)', () => {
      const userData = {
        username: 'test',
        password: 'qwe123',
        confirm: 'qwe123'
      }
      return request(app.getHttpServer())
        .post('/user')
        .send(userData)
        .expect(400);
    });
    it('POST - fail: validation error(wrong format)', () => {
      const userData = {
        username: 'test',
        password: '1234'
      }
      return request(app.getHttpServer())
        .post('/user')
        .send(userData)
        .expect(400);
    });
    it('POST - success', () => {
      const userData = {
        username: 'test',
        password: 'qwe123'
      }
      return request(app.getHttpServer())
        .post('/user')
        .send(userData)
        .expect(201);
      });
      it('POST - fail: username duplication', () => {
      const userData = {
        username: 'test',
        password: 'qwe123'
      }
      return request(app.getHttpServer())
        .post('/user')
        .send(userData)
        .expect(400);
    });
    it('GET - success', () => {
      return request(app.getHttpServer())
        .get('/user')
        .expect(200)
        .expect(Array);
    });
  });

  describe('/user/:id', () => {
    it('GET - fail: user not found', () => {
      return request(app.getHttpServer())
        .get('/user/0')
        .expect(400);
    });
    it('GET - success', () => {
      return request(app.getHttpServer())
        .get('/user/1')
        .expect(200)
        .expect((res) => {
          if (res.body?.username === 'root') return true
        });
    });
    it('PATCH - fail: validation error(unnecessary field', () => {
      return request(app.getHttpServer())
        .patch('/user/1')
        .send({ username: 'qwe123', id: 100 })
        .expect(400);
    });
    it('PATCH - fail: validation error(wrong format)', () => {
      return request(app.getHttpServer())
        .patch('/user/1')
        .send({ username: 'qqq' })
        .expect(400);
    });
    it('PATCH - fail: user not found', () => {
      return request(app.getHttpServer())
        .patch('/user/0')
        .send({ username: 'qwe123' })
        .expect(400);
    });
    it('PATCH - success', () => {
      return request(app.getHttpServer())
        .patch('/user/1')
        .send({ password: 'qwe123' })
        .expect(200);
    });
  });

  describe('delete user', () =>{
    it('DELETE - fail: user not found', () => {
      return request(app.getHttpServer())
        .delete('/user')
        .send({ username: 'test99' })
        .expect(400);
    });
    it('DELETE - success', () => {
      return request(app.getHttpServer())
        .delete('/user')
        .send({ username: 'test' })
        .expect(200);
    });
  });
});
