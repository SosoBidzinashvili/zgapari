import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateWaitlistDto } from './dto/create-waitlist.dto'
import { WaitlistEntry } from './entities/waitlist-entry.entity'

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === '23505'
  )
}

@Injectable()
export class WaitlistService {
  constructor(
    @InjectRepository(WaitlistEntry)
    private readonly repo: Repository<WaitlistEntry>,
  ) {}

  async create(dto: CreateWaitlistDto): Promise<WaitlistEntry> {
    const entry = this.repo.create({
      email: dto.email.toLowerCase().trim(),
      locale: dto.locale ?? 'ka',
    })

    try {
      return await this.repo.save(entry)
    } catch (err: unknown) {
      if (isUniqueViolation(err)) {
        throw new ConflictException('Email already on the waitlist')
      }
      throw err
    }
  }
}
