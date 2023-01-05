import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma';


@Injectable()
export class LoginRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findUser(
		userUniqueInput: Prisma.UserWhereUniqueInput
	) {
		return this.prismaService.user.findUnique({
			where: userUniqueInput
		})
	}

	async verifyUser(
		userInput: Prisma.UserWhereInput
	) {
		return this.prismaService.user.findFirst({
			where: userInput
		})
	}

	async createUser(
		data: Prisma.UserCreateInput
	) {
		return this.prismaService.user.create({ data });
	}

	async createCharacter(
		userId: number,
		name: string
	) {
		return this.prismaService.character.create({ 
			data: {
				userId,
				name
			}
		});
	}

	async findCharacter(
		userId: number,
	) {
		return this.prismaService.character.findUnique({
			where: { userId }
		})
	}
}