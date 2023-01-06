import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Prisma } from '@prisma/client';
import { Socket } from 'socket.io';
import { SocketInputDto, SocketResponseDto } from 'src/common/dto';
import { UserInfoDto } from 'src/common/dto/user-info.dto';
import { homeScript, signScript } from 'src/common/script';
import { LoginRepository } from 'src/login/login.repository';

@Injectable()
export class SignService {
	constructor(
    private readonly loginRepo: LoginRepository,
  ) {}

	handler(client: Socket, payload: SocketInputDto) {
		const { line, userInfo, option } = payload;
		const [CMD1, CMD2] = line.trim().split(' ');

		const cmdRoute = {
				'10': 'signupPassword',
				'11': 'createUser',
				'12': 'createCharacter',
				'20': 'signinPassword',
				'21': 'signinVerify',
				'EMPTY': 'emptyCommend'
		}
		if (!Object.hasOwn(cmdRoute, option)) {
				// NO MATCHING COMMAND FOUND
				return;
		}
		
		return this[cmdRoute[option]](CMD1, userInfo).then((data: SocketResponseDto) => {
			client.emit('print', data);
		})
	}

	async signupPassword(
		CMD: string|undefined, 
		userInfo: UserInfoDto
	): Promise<Partial<SocketResponseDto>> {

		const username = CMD;
		if (!username || !username.match(/^[a-z]+[a-z0-9]{3,15}$/i)) {
			throw new WsException({
				field: 'front',
				script: signScript.invalidID + homeScript.reload
			});
		}

		const result = await this.loginRepo.findUser({ username });
		if (result) {
			throw new WsException({
				field: 'front',
				script: signScript.dupName + homeScript.reload
			});
		}

		return {
			field: 'sign:11',
			script: signScript.password,
			userInfo: {
				userId: -1,
				username,
				characterId: -1
			},
		}
	}
	async createUser(
    CMD: string|undefined, 
    userInfo: UserInfoDto
  ): Promise<Partial<SocketResponseDto>> {

		const password = CMD;
		if (!password || !password.match(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,12}$/)) {
			throw new WsException({
				field: 'front',
				script: signScript.invalidPW + homeScript.reload
			});
		}

		const data: Prisma.UserCreateInput = {
			username: userInfo.username,
			password
		}
		const user = await this.loginRepo.createUser(data);

		return {
			field: 'sign:12',
			script: signScript.character,
			userInfo: {
        ...userInfo,
				userId: user.userId,
			},
		}
	}
	async createCharacter(
		CMD: string|undefined, 
    userInfo: UserInfoDto
  ): Promise<Partial<SocketResponseDto>> {
		
		const name = CMD;
    const regExpEn = /^[a-z]{1}[a-z0-9]{3,15}$/i;
    const regExpKo = /^[가-힣]{1}[가-힣0-9]{1,8}$/;
		if (!name || !(name.match(regExpEn) || name.match(regExpKo))) {
      throw new WsException({
        field: 'front',
        script: signScript.invalidName + homeScript.reload
      });
    }

    const character = await this.loginRepo.createCharacter(userInfo.userId, name);
		
    return {
      field: 'front',
      script: signScript.upComplete,
      userInfo: {
        ...userInfo,
        characterId: character.characterId
      },
      userStatus: {
        ...character,
        username: userInfo.username
      }
    }
	}
	async signinPassword(
		CMD: string|undefined, 
		userInfo: UserInfoDto
	): Promise<Partial<SocketResponseDto>> {

		const username = CMD;
		if (!username) {
			throw new WsException({
				field: 'front',
				script: signScript.incorrect + homeScript.reload
			});
		}

		return {
			field: 'sign:21',
			script: signScript.password,
			userInfo: {
				userId: -1,
				username: username,
				characterId: -1
			},
		}
	}
	async signinVerify(
		CMD: string|undefined, 
		userInfo: UserInfoDto
	): Promise<Partial<SocketResponseDto>> {
		
		const password = CMD;
		if (!password) {
			throw new WsException({
				field: 'front',
				script: signScript.incorrect + homeScript.reload
			});
		}

		const data = {
			username: userInfo.username,
			password
		}
		const user = await this.loginRepo.verifyUser(data);
		if (!user) {
			throw new WsException({
				field: 'front',
				script: signScript.incorrect + homeScript.reload
			});
		}

		const character = await this.loginRepo.findCharacter(user.userId);
		if (!character) {
			throw new WsException({
				field: 'front',
				script: signScript.error + homeScript.reload
			})
		}
		
		return {
			field: 'front',
			script: signScript.inComplete,
			userInfo: {
				...userInfo,
				userId: user.userId,
				characterId: character.characterId
			},
			userStatus: {
				...character,
				username: user.username
			}
		}
	}
	emptyCommend(CMD: string|undefined, userInfo: UserInfoDto): Partial<SocketResponseDto> {
		return {
			field: 'sign:20',
			script: '',
			userInfo,
		}
	}
}
