import type { FastifyPluginAsync } from 'fastify';
import type { ITransactionService } from '../application/transaction-service.port.js';
import { UUIDParam } from '../../../shared/schemas.js';
import { CreateTransactionRequestDto, type CreateTransactionRequestDtoType } from './dto/create-transaction.dto.js';
import { UpdateTransactionRequestDto, type UpdateTransactionRequestDtoType } from './dto/update-transaction.dto.js';
import { TransactionResponseDto, TransactionListResponseDto } from './dto/transaction-response.dto.js';
import { TransactionFilterQueryDto, type TransactionFilterQueryDtoType } from './dto/transaction-filter-query.dto.js';

export const transactionController = (transactionService: ITransactionService): FastifyPluginAsync =>
	async (app) => {
		app.post<{ Body: CreateTransactionRequestDtoType }>(
			'/',
			{
				preHandler: [app.authenticate],
				schema: {
					body: CreateTransactionRequestDto,
					response: { 201: TransactionResponseDto },
				},
			},
			async (request, reply) => {
				const transaction = await transactionService.create(request.user.id, request.body);

				return reply.status(201).send(transaction);
			},
		);

		// TODO: maybe change into post with body like { filters, page, limit }, etc.
		app.get<{ Querystring: TransactionFilterQueryDtoType }>(
			'/',
			// '/search',
			{
				preHandler: [app.authenticate],
				schema: {
					querystring: TransactionFilterQueryDto,
					response: { 200: TransactionListResponseDto },
				},
			},
			async (request) => {
				return transactionService.findAll(
					request.user.id,
					{
						...request.query,
						page: request.query.page ?? 1,
						limit: request.query.limit ?? 20,
					},
				);
			},
		);

		app.get<{ Params: UUIDParam }>(
			'/:id',
			{
				preHandler: [app.authenticate],
				schema: {
					params: UUIDParam,
					response: { 200: TransactionResponseDto },
				},
			},
			async (request) => {
				return transactionService.findById(request.user.id, request.params.id);
			},
		);

		app.put<{ Params: UUIDParam; Body: UpdateTransactionRequestDtoType }>(
			'/:id',
			{
				preHandler: [app.authenticate],
				schema: {
					params: UUIDParam,
					body: UpdateTransactionRequestDto,
					response: { 200: TransactionResponseDto },
				},
			},
			async (request) => {
				return transactionService.update(request.user.id, request.params.id, request.body);
			},
		);

		app.delete<{ Params: UUIDParam }>(
			'/:id',
			{
				preHandler: [app.authenticate],
				schema: {
					params: UUIDParam,
					response: { 200: TransactionResponseDto },
				},
			},
			async (request) => {
				return transactionService.delete(request.user.id, request.params.id);
			},
		);
	};
