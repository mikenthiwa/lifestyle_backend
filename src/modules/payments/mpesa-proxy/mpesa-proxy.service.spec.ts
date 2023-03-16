import { Test, TestingModule } from '@nestjs/testing';
import { MpesaProxyService } from './mpesa-proxy.service';

describe('MpesaProxyService', () => {
  let service: MpesaProxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MpesaProxyService],
    }).compile();

    service = module.get<MpesaProxyService>(MpesaProxyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
