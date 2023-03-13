import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { MpesaProxyService } from './mpesa-proxy/mpesa-proxy.service';
import { PaymentRequestDto, QueryTransactionDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guard/JwtAuthGuard.guard';
import { RolesGuard } from '../auth/guard/role.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private mpesaProxyService: MpesaProxyService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/requestPayment')
  async requestPayment(
    @Request() req: any,
    @Response() res: any,
    @Body() paymentRequestBody: PaymentRequestDto,
  ): Promise<any> {
    await this.mpesaProxyService.initiateSTK(
      paymentRequestBody,
      req.user._id,
      res,
    );
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/queryPayment')
  async queryMpesaTransaction(
    @Request() req: any,
    @Response() res: any,
    @Body() queryTransactionDto: QueryTransactionDto,
  ) {
    await this.mpesaProxyService.queryPayment(queryTransactionDto, res);
  }
}
