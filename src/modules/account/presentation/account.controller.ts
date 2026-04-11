import type { FastifyPluginAsync } from 'fastify';
import type { IAccountService } from '../application/account-service.port.js';
import { UUIDParam, PaginationQuery, type PaginationQueryType } from '../../../shared/schemas.js';
import { CreateAccountRequestDto, type CreateAccountRequestDtoType } from './dto/create-account.dto.js';
import { UpdateAccountRequestDto, type UpdateAccountRequestDtoType } from './dto/update-account.dto.js';
import { AccountListResponseDto, AccountResponseDto } from './dto/account-response.dto.js';

export const accountController = (accountService: IAccountService): FastifyPluginAsync =>
	async (app) => {
		app.post<{ Body: CreateAccountRequestDtoType }>(
			'/',
			{
				preHandler: [app.authenticate],
				schema: {
					body: CreateAccountRequestDto,
					response: { 201: AccountResponseDto },
				},
			},
			async (request, reply) => {
				const account = await accountService.create(request.user.id, request.body);

				return reply.status(201).send(account);
			},
		);

		app.get<{ Querystring: PaginationQueryType }>(
			'/',
			{
				preHandler: [app.authenticate],
				schema: {
					querystring: PaginationQuery,
					response: { 200: AccountListResponseDto },
				},
			},
			async (request) => {
				return accountService.findAll(request.user.id, request.query.page ?? 1, request.query.limit ?? 20);
			},
		);

		app.get<{ Params: UUIDParam }>(
			'/:id',
			{
				preHandler: [app.authenticate],
				schema: {
					params: UUIDParam,
					response: { 200: AccountResponseDto },
				},
			},
			async (request) => {
				return accountService.findById(request.user.id, request.params.id);
			},
		);

		app.put<{ Params: UUIDParam; Body: UpdateAccountRequestDtoType }>(
			'/:id',
			{
				preHandler: [app.authenticate],
				schema: {
					params: UUIDParam,
					body: UpdateAccountRequestDto,
					response: { 200: AccountResponseDto },
				},
			},
			async (request) => {
				return accountService.update(request.user.id, request.params.id, request.body);
			},
		);

		app.delete<{ Params: UUIDParam }>(
			'/:id',
			{
				preHandler: [app.authenticate],
				schema: {
					params: UUIDParam,
					response: { 200: AccountResponseDto },
				},
			},
			async (request) => {
				return accountService.delete(request.user.id, request.params.id);
			},
		);
	};
