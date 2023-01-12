import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { PaymentsService } from '../payments.service';
import { STKPayload } from './interface/index.interface';

@Injectable()
export class MpesaProxyService {
  securedStr: string;
  mpesaURL: string | any;
  passKey: string;
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private paymentService: PaymentsService,
  ) {
    this.securedStr = `${this.configService.get(
      'MPESA_CONSUMER_KEY',
    )}:${this.configService.get('MPESA_CONSUMER_SECRET')}`;
    this.mpesaURL = this.configService.get('MPESA_URL');
    this.passKey = `${this.configService.get('PASS_KEY')}`;
  }

  getMpesaAccessToken(): Observable<any> {
    const basicAuthorization = Buffer.from(this.securedStr).toString('base64');
    return this.httpService.get(
      `${this.mpesaURL}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${basicAuthorization}` } },
    );
  }

  generateTimeStamp(): string {
    return new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[^0-9]/g, '');
  }

  generatePassword(businessShortCode: number): string {
    return Buffer.from(
      businessShortCode + this.passKey + this.generateTimeStamp(),
    ).toString('base64');
  }

  stkPayload(metadata: any): any {
    return {
      BusinessShortCode: metadata.businessShortCode,
      Password: this.generatePassword(metadata.businessShortCode),
      Timestamp: this.generateTimeStamp(),
      TransactionType: 'CustomerPayBillOnline',
      Amount: 1,
      PartyA: metadata.phoneNumber,
      PartyB: metadata.businessShortCode,
      PhoneNumber: metadata.phoneNumber,
      CallBackURL: 'https://mydomain.com/path',
      AccountReference: metadata.accountReference,
      TransactionDesc: metadata.accountReference,
    };
  }

  queryPayload(BusinessShortCode: number, CheckoutRequestID: string): any {
    return {
      BusinessShortCode: BusinessShortCode,
      Password: this.generatePassword(BusinessShortCode),
      Timestamp: this.generateTimeStamp(),
      CheckoutRequestID,
    };
  }

  subscribePaymentResponse(
    paymentResponse$: Observable<any>,
    userId: string,
    tripId: string,
    res: any,
  ): any {
    paymentResponse$.subscribe(
      async (resp: any) => {
        const { CustomerMessage, ResponseDescription, ...result } = resp.data;
        await this.paymentService.createPayment(
          resp.data.CheckoutRequestID,
          userId,
          tripId,
        );
        return res.send({
          success: true,
          statusCode: HttpStatus.OK,
          message: resp.data.CustomerMessage,
          response: result,
        });
      },
      (error) =>
        res.send({
          success: false,
          statusCode: 400,
          message: 'Something went wrong!',
        }),
    );
  }

  async initiateSTK(
    metadata: STKPayload,
    userId: string,
    res: any,
  ): Promise<any> {
    const { tripId, ...result } = metadata;
    const response = this.getMpesaAccessToken();
    return response.subscribe((resp: any) => {
      const authToken = `Bearer ${resp?.data.access_token}`;
      const paymentResponse$ = this.httpService.post<Observable<any>>(
        `${this.mpesaURL}/mpesa/stkpush/v1/processrequest`,
        this.stkPayload(result),
        {
          headers: {
            Authorization: authToken,
          },
        },
      );
      this.subscribePaymentResponse(paymentResponse$, userId, tripId, res);
    });
  }

  async queryPayment(
    {
      businessShortCode,
      checkoutRequestID,
    }: {
      businessShortCode: number;
      checkoutRequestID: string;
    },
    res: any,
  ): Promise<any> {
    const response = this.getMpesaAccessToken();
    response.subscribe((resp: any) => {
      const authToken = `Bearer ${resp?.data.access_token}`;
      const mpesaTransactionQuery = this.httpService.post<Observable<any>>(
        `${this.mpesaURL}/mpesa/stkpushquery/v1/query`,
        this.queryPayload(businessShortCode, checkoutRequestID),
        {
          headers: {
            Authorization: authToken,
          },
        },
      );
      mpesaTransactionQuery.subscribe(async (resp: any) => {
        const {
          data: { MerchantRequestID: merchantRequestID, ResultCode },
        } = resp;
        if (ResultCode === '0') {
          await this.paymentService.updatePayment(checkoutRequestID, {
            merchantRequestID,
          });
          res.send({
            success: true,
            statusCode: HttpStatus.OK,
            message: 'Payment is successful',
          });
        } else {
          await this.paymentService.deletePayment(checkoutRequestID);
          res.send({
            success: false,
            statusCode: HttpStatus.OK,
            message: 'Payment was not successful',
          });
        }
      });
    });
  }
}
