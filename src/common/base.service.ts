import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class BaseService {
  formatError(status: number, code: string, message: string) {
    throw new HttpException({ message: { code, message } }, status);
  }

  formatData<T>(status: number, body: T) {
    return { status, body };
  }
}
