import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';


@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExcpetionFilter extends BaseExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        switch (exception.code) {
            // P2002: unique constraint fail
            case 'P2002':
                const status = HttpStatus.CONFLICT;
                const message = exception.message.replace(/\n/g, '');

                response.status(status).json({
                    statusCode: status,
                    message: message,
                });
                break;
            default:
                // pass to default Nest error 500
                super.catch(exception, host);
                break;
        }
    }
}