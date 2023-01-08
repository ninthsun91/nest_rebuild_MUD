import { Injectable, NotFoundException } from '@nestjs/common';
import { SocketInputDto, SocketResponseDto } from 'src/common/dto';
import { homeScript } from 'src/common/script';

@Injectable()
export class NoneService {
    loadFront(payload: Pick<SocketInputDto, 'line'>): Pick<SocketResponseDto, 'field'|'script'> {
        const { line } = payload;

        if (line !== 'load') {
            throw new NotFoundException()
        }

        return {
            field: 'front',
            script: homeScript.loadHome,
        }
    }
}
