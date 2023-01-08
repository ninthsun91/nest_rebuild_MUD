import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import * as Client from 'socket.io-client';
import { BattleModule } from 'src/battle/battle.module';
import { PrismaModule } from 'src/prisma';


describe('Battle Module(e2e test)', () => {
  let app: INestApplication;
  let clientSocket: ReturnType<typeof Client.io>;

  beforeAll((done) => {
    Test.createTestingModule({
      imports: [BattleModule, PrismaModule],
    }).compile().then(async(moduleFixture: TestingModule) => {

      app = moduleFixture.createNestApplication();
      await app.init();

      const httpServer: Server = app.getHttpServer();
      httpServer.listen(() => {
        const address = httpServer.address();
        if (typeof address === 'string' || !address) process.exit(0);

        clientSocket = Client.io(`http://localhost:${address.port}/battle`);
        clientSocket.on('connect', done);
      });
    });
  });

  afterAll(() => {
    clientSocket.close();
    app.close();
  });

  describe('field: dungeon', () => {
    it.todo('[FAIL] event "dungeon": wrong commend => WsException(NotFound)');

    it.todo('[SUCCESS] dungeonHelp() => script: dungeonHelp');
    it.todo('[SUCCESS] dungeonList() => script: dungeonList');

    it.todo('[FAIL] dungeonInfo(): invalid dungeon level => WsException(BadRequest)');
    it.todo('[SUCCESS] dungeonInfo() => script: dungeonInfo');

    it.todo('[FAIL] startAutoBattle(): invalid userStatus => field: "front"');
    it.todo('[SUCCESS] startAutoBattle(): hp below 30% => script: warning');
    it.todo('[SUCCESS] startAutoBattle() => field: "auto"');
  });

  describe('field: auto', () => {
    it.todo('[FAIL] event "auto": wrong commend => WsException(NotFound)');

    it.todo('[SUCCESS] should receive battle combat log');
    it.todo('[SUCCESS] should receive death log (high level dungeon)');

    it.todo('[SUCCESS] battleHelp() => script: battleHelp');
    it.todo('[SUCCESS] quiteAutoBattle() => field: "dungeon"');
  });
});