import { ApiProperty } from '@nestjs/swagger';
export class HttpErrorRO {
  @ApiProperty()
  status: number;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  method: string;

  @ApiProperty()
  message: string;
}
