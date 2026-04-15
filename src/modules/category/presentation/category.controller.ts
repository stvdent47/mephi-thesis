import type { FastifyPluginAsync } from 'fastify';
import type { ICategoryService } from '../application/category-service.port.js';
import { UUIDParam } from '../../../shared/schemas.js';
import { CreateCategoryRequestDto, type CreateCategoryRequestDtoType } from './dto/create-category.dto.js';
import { UpdateCategoryRequestDto, type UpdateCategoryRequestDtoType } from './dto/update-category.dto.js';
import { CategoryResponseDto, CategoryListResponseDto } from './dto/category-response.dto.js';
import { CategoryTypeQueryDto, type CategoryTypeQueryDtoType } from './dto/category-query.dto.js';

export const categoryController = (categoryService: ICategoryService): FastifyPluginAsync =>
	async (app) => {
		app.post<{ Body: CreateCategoryRequestDtoType }>(
			'/',
			{
				preHandler: [app.authenticate],
				schema: {
					body: CreateCategoryRequestDto,
					response: { 201: CategoryResponseDto },
				},
			},
			async (request, reply) => {
				const category = await categoryService.create(request.user.id, request.body);

				return reply.status(201).send(category);
			},
		);

		app.get<{ Querystring: CategoryTypeQueryDtoType }>(
			'/',
			{
				preHandler: [app.authenticate],
				schema: {
					querystring: CategoryTypeQueryDto,
					response: { 200: CategoryListResponseDto },
				},
			},
			async (request) => {
				return categoryService.findAll(request.user.id, request.query.type);
			},
		);

		app.get<{ Params: UUIDParam }>(
			'/:id',
			{
				preHandler: [app.authenticate],
				schema: {
					params: UUIDParam,
					response: { 200: CategoryResponseDto },
				},
			},
			async (request) => {
				return categoryService.findById(request.user.id, request.params.id);
			},
		);

		app.put<{ Params: UUIDParam; Body: UpdateCategoryRequestDtoType }>(
			'/:id',
			{
				preHandler: [app.authenticate],
				schema: {
					params: UUIDParam,
					body: UpdateCategoryRequestDto,
					response: { 200: CategoryResponseDto },
				},
			},
			async (request) => {
				return categoryService.update(request.user.id, request.params.id, request.body);
			},
		);

		app.delete<{ Params: UUIDParam }>(
			'/:id',
			{
				preHandler: [app.authenticate],
				schema: {
					params: UUIDParam,
					response: { 200: CategoryResponseDto },
				},
			},
			async (request) => {
				return categoryService.delete(request.user.id, request.params.id);
			},
		);
	};
