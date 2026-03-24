/**
 * Controller integration test for WaitlistController.
 *
 * SETUP REQUIRED (one-time):
 *   cd backend
 *   npm install --save-dev supertest @types/supertest
 *
 * Uses @nestjs/testing + supertest (NestJS idiomatic pattern).
 * No real PostgreSQL is needed — WaitlistService is fully mocked.
 * ValidationPipe is wired manually to replicate the behaviour in main.ts
 * (whitelist: true, forbidNonWhitelisted: true, transform: true).
 *
 * Route under test: POST /waitlist
 *
 * Note: the test module does NOT call app.setGlobalPrefix('api').
 * That prefix is applied only in main.ts. The controller itself is mounted
 * at /waitlist, so that is what we test here.
 */

import { ConflictException, INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
// supertest must be installed: npm install --save-dev supertest @types/supertest
import * as request from 'supertest'
import { WaitlistController } from './waitlist.controller'
import { WaitlistService } from './waitlist.service'

// ---------------------------------------------------------------------------
// Service mock — isolates the controller from the database
// ---------------------------------------------------------------------------

const mockWaitlistService = {
  create: jest.fn(),
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('WaitlistController (integration — mocked service)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitlistController],
      providers: [
        {
          provide: WaitlistService,
          useValue: mockWaitlistService,
        },
      ],
    }).compile()

    app = module.createNestApplication()

    // Replicate the global ValidationPipe from main.ts so that DTO validation
    // (@IsEmail, @IsIn) fires correctly during tests.
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // -------------------------------------------------------------------------
  // Happy path — 201
  // -------------------------------------------------------------------------

  describe('POST /waitlist — 201 Created', () => {
    it('returns 201 and {id, email} when a valid email is submitted', async () => {
      mockWaitlistService.create.mockResolvedValue({
        id: 'uuid-happy',
        email: 'test@example.com',
      })

      const res = await request(app.getHttpServer())
        .post('/waitlist')
        .send({ email: 'test@example.com' })

      expect(res.status).toBe(201)
      expect(res.body).toEqual({ id: 'uuid-happy', email: 'test@example.com' })
      expect(mockWaitlistService.create).toHaveBeenCalledTimes(1)
      expect(mockWaitlistService.create).toHaveBeenCalledWith({ email: 'test@example.com' })
    })

    it('returns 201 and forwards locale to the service when locale: en is provided', async () => {
      mockWaitlistService.create.mockResolvedValue({
        id: 'uuid-locale',
        email: 'locale@example.com',
      })

      const res = await request(app.getHttpServer())
        .post('/waitlist')
        .send({ email: 'locale@example.com', locale: 'en' })

      expect(res.status).toBe(201)
      expect(mockWaitlistService.create).toHaveBeenCalledWith({
        email: 'locale@example.com',
        locale: 'en',
      })
    })

    it('returns 201 and forwards locale to the service when locale: ka is provided', async () => {
      mockWaitlistService.create.mockResolvedValue({
        id: 'uuid-locale-ka',
        email: 'geo@example.com',
      })

      const res = await request(app.getHttpServer())
        .post('/waitlist')
        .send({ email: 'geo@example.com', locale: 'ka' })

      expect(res.status).toBe(201)
      expect(mockWaitlistService.create).toHaveBeenCalledWith({
        email: 'geo@example.com',
        locale: 'ka',
      })
    })
  })

  // -------------------------------------------------------------------------
  // Validation errors — 400
  // -------------------------------------------------------------------------

  describe('POST /waitlist — 400 Bad Request', () => {
    it('returns 400 when email is a plain string that is not an email address', async () => {
      const res = await request(app.getHttpServer())
        .post('/waitlist')
        .send({ email: 'not-an-email' })

      expect(res.status).toBe(400)
      expect(mockWaitlistService.create).not.toHaveBeenCalled()
    })

    it('returns 400 when the body is an empty object (email missing)', async () => {
      const res = await request(app.getHttpServer())
        .post('/waitlist')
        .send({})

      expect(res.status).toBe(400)
      expect(mockWaitlistService.create).not.toHaveBeenCalled()
    })

    it('returns 400 when the body is absent (no Content-Type body sent)', async () => {
      const res = await request(app.getHttpServer())
        .post('/waitlist')
        .set('Content-Type', 'application/json')

      expect(res.status).toBe(400)
      expect(mockWaitlistService.create).not.toHaveBeenCalled()
    })

    it('returns 400 when an unknown field is present (forbidNonWhitelisted)', async () => {
      const res = await request(app.getHttpServer())
        .post('/waitlist')
        .send({ email: 'valid@example.com', injectedField: 'surprise' })

      expect(res.status).toBe(400)
      expect(mockWaitlistService.create).not.toHaveBeenCalled()
    })

    it('returns 400 when locale is an unsupported value (not ka or en)', async () => {
      const res = await request(app.getHttpServer())
        .post('/waitlist')
        .send({ email: 'valid@example.com', locale: 'fr' })

      expect(res.status).toBe(400)
      expect(mockWaitlistService.create).not.toHaveBeenCalled()
    })

    it('returns 400 when email is a number instead of a string', async () => {
      const res = await request(app.getHttpServer())
        .post('/waitlist')
        .send({ email: 12345 })

      expect(res.status).toBe(400)
      expect(mockWaitlistService.create).not.toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  // Duplicate email — 409 Conflict
  // -------------------------------------------------------------------------

  describe('POST /waitlist — 409 Conflict', () => {
    it('returns 409 when the service throws ConflictException', async () => {
      mockWaitlistService.create.mockRejectedValue(
        new ConflictException('Email already on the waitlist'),
      )

      const res = await request(app.getHttpServer())
        .post('/waitlist')
        .send({ email: 'dup@example.com' })

      expect(res.status).toBe(409)
      expect(mockWaitlistService.create).toHaveBeenCalledTimes(1)
    })

    it('returns a body with statusCode: 409 and a message field', async () => {
      mockWaitlistService.create.mockRejectedValue(
        new ConflictException('Email already on the waitlist'),
      )

      const res = await request(app.getHttpServer())
        .post('/waitlist')
        .send({ email: 'dup@example.com' })

      expect(res.body).toHaveProperty('statusCode', 409)
      expect(res.body).toHaveProperty('message')
    })

    it('does not call the service more than once on a 409 — no retry side-effects', async () => {
      mockWaitlistService.create.mockRejectedValue(
        new ConflictException('Email already on the waitlist'),
      )

      await request(app.getHttpServer())
        .post('/waitlist')
        .send({ email: 'dup@example.com' })

      expect(mockWaitlistService.create).toHaveBeenCalledTimes(1)
    })
  })

  // -------------------------------------------------------------------------
  // Privacy — email must not appear in console output
  // -------------------------------------------------------------------------

  describe('Privacy — no email address in logs', () => {
    it('does not write the submitted email to console.log on success', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined)

      mockWaitlistService.create.mockResolvedValue({
        id: 'uuid-privacy',
        email: 'private@example.com',
      })

      await request(app.getHttpServer())
        .post('/waitlist')
        .send({ email: 'private@example.com' })

      const allLogs = consoleSpy.mock.calls.flat().join(' ')
      expect(allLogs).not.toContain('private@example.com')

      consoleSpy.mockRestore()
    })

    it('does not write the submitted email to console.error on ConflictException', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)

      mockWaitlistService.create.mockRejectedValue(
        new ConflictException('Email already on the waitlist'),
      )

      await request(app.getHttpServer())
        .post('/waitlist')
        .send({ email: 'private-dup@example.com' })

      const allErrors = errorSpy.mock.calls.flat().join(' ')
      expect(allErrors).not.toContain('private-dup@example.com')

      errorSpy.mockRestore()
    })
  })
})
