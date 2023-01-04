import {
  ForbiddenException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

export const ThrowException = (response: any) => {
  switch (response?.statusCode) {
    case 403:
      throw new ForbiddenException({
        success: false,
        statusCode: HttpStatus.FORBIDDEN,
        message: response.message,
      });
    case 500:
      throw new InternalServerErrorException({
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    default:
      throw new InternalServerErrorException({
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
  }
};
