import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WaitlistEntry } from './entities/waitlist-entry.entity'
import { WaitlistController } from './waitlist.controller'
import { WaitlistService } from './waitlist.service'

@Module({
  imports: [TypeOrmModule.forFeature([WaitlistEntry])],
  controllers: [WaitlistController],
  providers: [WaitlistService],
})
export class WaitlistModule {}
