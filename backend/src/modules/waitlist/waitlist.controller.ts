import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { CreateWaitlistDto } from './dto/create-waitlist.dto'
import { WaitlistService } from './waitlist.service'

@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async join(@Body() dto: CreateWaitlistDto) {
    const entry = await this.waitlistService.create(dto)
    return { id: entry.id, email: entry.email }
  }
}
