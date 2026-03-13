import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Existing root endpoint
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // ✅ New health endpoint
  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date() };
  }
}