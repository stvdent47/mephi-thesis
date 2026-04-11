import type { FastifyInstance, FastifyPluginAsync, FastifyRequest } from "fastify";
import type { IAuthService } from "../application/auth-service.port.js";
import { RegisterRequestDto, RegisterResponseDto, type RegisterRequestDtoType } from "./dto/register.dto.js";
import { LoginRequestDto, LoginResponseDto, type LoginRequestDtoType } from "./dto/login.dto.js";
import { GetUserInfoResponseDto } from "./dto/get-user-info.dto.js";
import { handleAuthError } from "./auth-error-handler.js";

export const authController = (authService: IAuthService): FastifyPluginAsync =>
	async (app: FastifyInstance) => {
		app.post<{ Body: RegisterRequestDtoType }>(
			'/register',
			{
				schema: {
					body: RegisterRequestDto,
					response: { 201: RegisterResponseDto },
				},
			},
			async (request, reply) => {
				try {
					const { id, email, name } = await authService.register(request.body);

					return reply.status(201).send({ id, email, name });
				} catch (error) {
					handleAuthError(error);
				}
			},
		);

		app.post<{ Body: LoginRequestDtoType }>(
			'/login',
			{
				schema: {
					body: LoginRequestDto,
					response: { 200: LoginResponseDto },
				},
			},
			async (request, reply) => {
				try {
					const { token, user: { id, email, name } } = await authService.login(request.body);

					return reply.status(200).send({
						token,
						user: { id, email, name },
					});
				} catch (error) {
					handleAuthError(error);
				}
			},
		);

		app.get(
			'/me',
			{
				preHandler: [app.authenticate],
				schema: {
					response: { 200: GetUserInfoResponseDto },
				},
			},
			async (request: FastifyRequest, reply) => {
				try {
					const { id, email, name } = await authService.getUserInfo(request.user.id);

					return reply.status(200).send({
						id,
						email,
						name,
					});
				} catch (error) {
					handleAuthError(error);
				}
			},
		);
	};
