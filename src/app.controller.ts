import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  index() {
    return 'Welcome to the NPM Download Count API!';
  }
}
