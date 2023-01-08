import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { LoginModule } from '../src/login/login.module';
import * as Client from 'socket.io-client'
import { Server as HttpServer } from 'http';
import { PrismaModule } from 'src/prisma';
import { SocketResponseDto } from 'src/common/dto';
import { signScript } from 'src/common/script';


describe('Login Module (e2e)', () => {
  let app: INestApplication;
  let clientSocket: ReturnType<typeof Client.io>;

  beforeAll((done) => {
    Test.createTestingModule({
      imports: [LoginModule, PrismaModule],
    }).compile().then(async(moduleFixture: TestingModule) => {
      app = moduleFixture.createNestApplication();
      await app.init();
     
      const httpServer: HttpServer = app.getHttpServer();
      httpServer.listen(() => {
        const httpAddress = httpServer.address();
        if (typeof httpAddress === 'string' || !httpAddress) process.exit(0);

        clientSocket = Client.io(`http://localhost:${httpAddress.port}/login`);
        // clientSocket = Client.io(`http://localhost:3000/login`);
  
        clientSocket.on('connect', done);
      });
    });
  });

  afterAll(() => {
    clientSocket.close();
    app.close();
  });


  describe('field: none (client initialization)', () => {
    it('[FAIL] event "none": wrong commend => WsException(NotFound)', (done) => {
      const input = { line: 'someWrongCommend' };

      clientSocket.once('exception', (response: SocketResponseDto) => {
        expect(response.field).toBeUndefined();
        done();
      });

      clientSocket.emit('none', input);
    });
    it('[SUCCESS] loadFront() => field: "front"', (done) => {
      const input = { line: 'load' };

      clientSocket.emit('none', input, (response: SocketResponseDto) => {
        expect(response.field).toBe('front');
        done();
      });
    });
  });

  describe('field: front', () => {
    it('[FAIL] event "front": wrong commend => WsException(BadRequest)', (done) => {
      const input = { line: 'someWrongCommend' };

      clientSocket.once('exception', (response: SocketResponseDto) => {
        expect(response.field).toBeUndefined();
        done();
      });

      clientSocket.emit('front', input);
    });
    it('[SUCCESS] signin() => field: "sign:20"', (done) => {
      const input = { line: 'in' };

      clientSocket.once('print', (response: SocketResponseDto) => {
        expect(response.field).toBe('sign:20');
        done();
      });

      clientSocket.emit('front', input);
    });
    it('[SUCCESS] signup() => field: "sign:10"', (done) => {
      const input = { line: 'up' };

      clientSocket.once('print', (response: SocketResponseDto) => {
        expect(response.field).toBe('sign:10');
        done();
      });

      clientSocket.emit('front', input);
    });
    it('[SUCCESS] signout() => field: "none"', (done) => {
      const input = { line: 'out' };

      clientSocket.once('print', (response: SocketResponseDto) => {
        expect(response.field).toBe('none');
        done();
      });

      clientSocket.emit('front', input);
    });
    it('[SUCCESS] toDungeon() => field: "dungeon"', (done) => {
      const input = { line: 'dungeon' };

      clientSocket.once('print', (response: SocketResponseDto) => {
        expect(response.field).toBe('dungeon');
        done();
      });

      clientSocket.emit('front', input);
    });
    it('[SUCCESS] toVillage() => field: "village"', (done) => {
      const input = { line: 'village' };

      clientSocket.once('print', (response: SocketResponseDto) => {
        expect(response.field).toBe('village');
        done();
      });

      clientSocket.emit('front', input);
    });
    it('[SUCCESS] deleteAccount() => field: "none"', (done) => {
      const input = { line: 'delete' };

      clientSocket.once('print', (response: SocketResponseDto) => {
        expect(response.field).toBe('none');
        done();
      });

      clientSocket.emit('front', input);
    });
  });

  describe('field: sign', () => {
    const userInfo = {
      userId: -1,
      username: `test${Date.now().toString().slice(-10)}`,
      characterId: -1
    }

    it('[FAIL] event "sign": wrong commend => WsException(BadRequest)', (done) => {
      const input = { line: 'sign', userInfo: {}, option: 'someWrongOption' };

      clientSocket.once('exception', (response: SocketResponseDto) => {
        expect(response.field).toBeUndefined();
        done();
      });

      clientSocket.emit('sign', input);
    });

    it('[FAIL] signupPassword(): invalid username format => WsException', (done) => {
      const input = { 
        line: 'me',
        option: '10'
      };

      clientSocket.once('exception', (response: SocketResponseDto) => {
        expect(response.field).toBe('front');
        expect(response.script).toMatch(signScript.invalidID);
        done();
      });

      clientSocket.emit('sign', input);
    });
    it('[FAIL] signupPassword(): username duplication => WsException', (done) => {
      const input = { 
        line: 'root',
        option: '10'
      };

      clientSocket.once('exception', (response: SocketResponseDto) => {
        expect(response.field).toBe('front');
        expect(response.script).toMatch(signScript.dupName);
        done();
      });

      clientSocket.emit('sign', input);
    });
    it('[SUCCESS] signupPassword() => field: "sign:11", userInfo defined', (done) => {
      const input = { 
        line: userInfo.username,
        option: '10'
      };

      clientSocket.once('print', (response: SocketResponseDto) => {
        expect(response.field).toBe('sign:11');
        expect(response.userInfo?.username).toBe(input.line);
        expect(response.script).toMatch(signScript.password);
        done();
      });

      clientSocket.emit('sign', input);
    });

    it('[FAIL] createUser(): invalid password format => WsException', (done) => {
      const input = { 
        line: '1234',
        option: '11',
        userInfo
      };

      clientSocket.once('exception', (response: SocketResponseDto) => {
        expect(response.field).toBe('front');
        expect(response.script).toMatch(signScript.invalidPW);
        done();
      });

      clientSocket.emit('sign', input);
    });
    it('[SUCCESS] createUser() => field: "sign:12", userId>0', (done) => {
      const input = { 
        line: `qwe123`,
        option: '11',
        userInfo
      };

      clientSocket.once('print', (response: SocketResponseDto) => {
        expect(response.field).toBe('sign:12');
        expect(response.userInfo?.userId).toBeGreaterThan(0);
        expect(response.script).toMatch(signScript.character);

        Object.assign(userInfo, response.userInfo);
        done();
      });

      clientSocket.emit('sign', input);
    });

    it('[FAIL] createCharacter(): invalid charactername format => WsException', (done) => {
      const input = { 
        line: '1234',
        option: '12',
        userInfo
      };

      clientSocket.once('exception', (response: SocketResponseDto) => {
        expect(response.field).toBe('front');
        expect(response.script).toMatch(signScript.invalidName);
        done();
      });

      clientSocket.emit('sign', input);
    });
    it('[SUCCESS] createCharacter() => field: "front", userStatus defined', (done) => {
      const input = { 
        line: userInfo.username,
        option: '12',
        userInfo
      };

      clientSocket.once('print', (response: SocketResponseDto) => {
        expect(response.field).toBe('front');
        expect(response.userInfo?.characterId).toBeGreaterThan(0);
        expect(response.userStatus?.name).toBe(input.line);
        expect(response.script).toMatch(signScript.upComplete);

        userInfo.characterId = response.userInfo!.characterId;
        done();
      });

      clientSocket.emit('sign', input);
    });

    it('[FAIL] signinPassword(): empty username => WsException', (done) => {
      const input = { 
        line: '',
        option: '20',
      };

      clientSocket.once('exception', (response: SocketResponseDto) => {
        expect(response.field).toBe('front');
        expect(response.script).toMatch(signScript.incorrect);
        done();
      });

      clientSocket.emit('sign', input);
    });
    it('[SUCCESS] signinPassword() => field: "sign:21", userInfo defined', (done) => {
      const input = { 
        line: userInfo.username,
        option: '20'
      };

      clientSocket.once('print', (response: SocketResponseDto) => {
        expect(response.field).toBe('sign:21');
        expect(response.userInfo?.username).toBe(input.line);
        expect(response.script).toMatch(signScript.password);

        Object.assign(userInfo, response.userInfo);
        done();
      });

      clientSocket.emit('sign', input);
    });

    it('[FAIL] signinVerify(): empty password => WsException', (done) => {
      const input = { 
        line: '',
        option: '21',
        userInfo
      };

      clientSocket.once('exception', (response: SocketResponseDto) => {
        expect(response.field).toBe('front');
        expect(response.script).toMatch(signScript.incorrect);
        done();
      });

      clientSocket.emit('sign', input);
    });
    it('[FAIL] signinVerify(): user not found => WsException', (done) => {
      const input = { 
        line: 'qwe124',
        option: '21',
        userInfo
      };

      clientSocket.once('exception', (response: SocketResponseDto) => {
        expect(response.field).toBe('front');
        expect(response.script).toMatch(signScript.incorrect);
        done();
      });

      clientSocket.emit('sign', input);
    });
    it('[FAIL] signinVerify(): character not found => WsException', (done) => {
      const fakeUser = {...userInfo, username: 'root' };
      const input = { 
        line: 'qwe123',
        option: '21',
        userInfo: fakeUser
      };

      clientSocket.once('exception', (response: SocketResponseDto) => {
        expect(response.field).toBe('front');
        expect(response.script).toMatch(signScript.error);
        done();
      });

      clientSocket.emit('sign', input);
    });
    it('[SUCCESS] signinVerify() => field: "front"', (done) => {
      const input = { 
        line: 'qwe123',
        option: '21',
        userInfo
      };

      clientSocket.once('print', (response: SocketResponseDto) => {
        expect(response.field).toBe('front');
        expect(response.userInfo?.userId).toBeGreaterThan(0);
        expect(response.userStatus?.username).toBe(input.userInfo.username);
        expect(response.script).toMatch(signScript.inComplete);

        Object.assign(userInfo, response.userInfo);
        done();
      });

      clientSocket.emit('sign', input);
    });
  });
});