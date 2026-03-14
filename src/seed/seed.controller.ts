import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({
    summary: 'Crea el usuario que va a poder crear JWT para las aplicaciones',
    description:
      'Crea el usuario que va a poder crear JWT para las aplicaciones.',
  })
  @ApiResponse({ status: 200, description: 'Seed ejecutado con éxito' })
  executeSeed() {
    return this.seedService.runSeed();
  }
}
