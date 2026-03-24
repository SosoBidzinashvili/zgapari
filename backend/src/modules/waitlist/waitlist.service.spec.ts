import { ConflictException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { WaitlistEntry } from './entities/waitlist-entry.entity'
import { WaitlistService } from './waitlist.service'

type MockRepo = Partial<Record<keyof Repository<WaitlistEntry>, jest.Mock>>

const mockRepo = (): MockRepo => ({
  create: jest.fn(),
  save: jest.fn(),
})

describe('WaitlistService', () => {
  let service: WaitlistService
  let repo: MockRepo

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WaitlistService,
        {
          provide: getRepositoryToken(WaitlistEntry),
          useFactory: mockRepo,
        },
      ],
    }).compile()

    service = module.get<WaitlistService>(WaitlistService)
    repo = module.get<MockRepo>(getRepositoryToken(WaitlistEntry))
  })

  describe('create', () => {
    it('saves a new entry and returns it', async () => {
      repo.create!.mockReturnValue({ email: 'test@example.com', locale: 'ka' })
      repo.save!.mockResolvedValue({
        id: 'uuid-1',
        email: 'test@example.com',
        locale: 'ka',
      })

      const result = await service.create({ email: 'test@example.com' })

      expect(result.email).toBe('test@example.com')
      expect(repo.save).toHaveBeenCalledTimes(1)
    })

    it('lowercases the email before saving', async () => {
      repo.create!.mockReturnValue({ email: 'upper@example.com', locale: 'ka' })
      repo.save!.mockResolvedValue({ id: 'uuid-2', email: 'upper@example.com', locale: 'ka' })

      await service.create({ email: 'UPPER@EXAMPLE.COM' })

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'upper@example.com' }),
      )
    })

    it('uses the provided locale when given', async () => {
      repo.create!.mockReturnValue({ email: 'en@example.com', locale: 'en' })
      repo.save!.mockResolvedValue({ id: 'uuid-3', email: 'en@example.com', locale: 'en' })

      await service.create({ email: 'en@example.com', locale: 'en' })

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ locale: 'en' }),
      )
    })

    it('defaults locale to ka when not provided', async () => {
      repo.create!.mockReturnValue({ email: 'geo@example.com', locale: 'ka' })
      repo.save!.mockResolvedValue({ id: 'uuid-4', email: 'geo@example.com', locale: 'ka' })

      await service.create({ email: 'geo@example.com' })

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ locale: 'ka' }),
      )
    })

    it('throws ConflictException when the database returns a unique violation (23505)', async () => {
      repo.create!.mockReturnValue({ email: 'dup@example.com', locale: 'ka' })
      repo.save!.mockRejectedValue({ code: '23505' })

      await expect(service.create({ email: 'dup@example.com' })).rejects.toThrow(
        ConflictException,
      )
      expect(repo.save).toHaveBeenCalled()
    })

    it('re-throws unexpected database errors as-is', async () => {
      repo.create!.mockReturnValue({ email: 'err@example.com', locale: 'ka' })
      repo.save!.mockRejectedValue(new Error('unexpected db error'))

      await expect(service.create({ email: 'err@example.com' })).rejects.toThrow(
        'unexpected db error',
      )
    })
  })
})
