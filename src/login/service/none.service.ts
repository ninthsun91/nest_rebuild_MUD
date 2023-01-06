import { Injectable } from '@nestjs/common';
import { SocketInputDto, SocketResponseDto } from 'src/common/dto';
import { homeScript } from 'src/common/script';

@Injectable()
export class NoneService {
    loadFront(payload: Pick<SocketInputDto, 'line'>): Pick<SocketResponseDto, 'field'|'script'> {
        const { line } = payload;

        if (line !== 'load') {
            return {
                field: 'none',
                script: 'THIS IS UNEXPECTED ERROR'
            }
        }

        return {
            field: 'front',
            script: homeScript.loadHome,
        }
    }
}
