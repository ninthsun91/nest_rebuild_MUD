import { Test, TestingModule } from '@nestjs/testing';
import { SocketResponseDto } from 'src/common/dto';
import { NoneService } from './none.service';

describe('LoginService', () => {
  let service: NoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoneService],
    }).compile();

    service = module.get<NoneService>(NoneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return none field if wrong line is given', () => {
    const payload = { line: 'something' };

    const response: SocketResponseDto = service.loadFront(payload);

    expect(response.field).toBe('none');
  });

  it('should return front field', () => {
    const payload = { line: 'load' };

    const response: SocketResponseDto = service.loadFront(payload);

    expect(response.field).toBe('front');
  })
});
