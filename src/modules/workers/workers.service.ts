import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { JobStatus } from "@prisma/client"
import { WorkerHistoryDoc } from "src/modules/workers/types/worker-history.type"
import { appendEvent } from "src/modules/workers/utils/history.util"

import { PrismaService } from "../../prisma/prisma.service"

import { ChangeEmployerDto } from "./dto/change-employer.dto"
import { CreateWorkerDto } from "./dto/create-worker.dto"
import { UpdateWorkerDto } from "./dto/update-worker.dto"

@Injectable()
export class WorkersService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateWorkerDto) {
		if (dto.employerId || dto.jobId) {
			if (!dto.employerId || !dto.jobId) {
				throw new BadRequestException(
					"Both employerId and jobId are required to hire worker"
				)
			}
			await this.ensureActiveJobBelongsToEmployer(dto.jobId, dto.employerId)
		}

		return this.prisma.$transaction(async tx => {
			const now = new Date().toISOString()

			const history: WorkerHistoryDoc =
				dto.employerId && dto.jobId
					? {
							events: [
								{
									type: "HIRED",
									at: now,
									employerId: dto.employerId,
									jobId: dto.jobId
								}
							]
						}
					: { events: [] }

			return tx.workers.create({
				data: {
					name: dto.name,
					salary: dto.salary,
					employerId: dto.employerId ?? null,
					jobId: dto.jobId ?? null,
					history: history
				}
			})
		})
	}

	async findAll() {
		return this.prisma.workers.findMany({
			orderBy: { createdAt: "desc" },
			include: { owner: true, job: true }
		})
	}

	async findOne(id: string) {
		const worker = await this.prisma.workers.findUnique({
			where: { id },
			include: { owner: true, job: true }
		})
		if (!worker) throw new NotFoundException("Worker not found")
		return worker
	}

	async update(id: string, dto: UpdateWorkerDto) {
		await this.ensureExists(id)

		if ((dto.employerId && !dto.jobId) || (!dto.employerId && dto.jobId)) {
			throw new BadRequestException(
				"Update must provide both employerId and jobId or neither"
			)
		}

		if (dto.employerId && dto.jobId) {
			await this.ensureActiveJobBelongsToEmployer(dto.jobId, dto.employerId)
		}

		return this.prisma.workers.update({
			where: { id },
			data: {
				name: dto.name,
				salary: dto.salary,
				employerId: dto.employerId ?? undefined,
				jobId: dto.jobId ?? undefined
			},
			include: { owner: true, job: true }
		})
	}

	async remove(id: string) {
		await this.ensureExists(id)
		return this.prisma.workers.delete({ where: { id } })
	}

	async matchedJobs(workerId: string) {
		const worker = await this.prisma.workers.findUnique({
			where: { id: workerId },
			select: { id: true, salary: true }
		})
		if (!worker) throw new NotFoundException("Worker not found")

		return this.prisma.jobs.findMany({
			where: { status: JobStatus.ACTIVE, salary: { gte: worker.salary } },
			orderBy: [{ salary: "desc" }, { createdAt: "desc" }],
			include: { owner: true }
		})
	}

	async changeEmployer(workerId: string, dto: ChangeEmployerDto) {
		const worker = await this.prisma.workers.findUnique({
			where: { id: workerId },
			select: { id: true, employerId: true, jobId: true }
		})
		if (!worker) throw new NotFoundException("Worker not found")

		if (dto.jobId && worker.jobId === dto.jobId) {
			return this.prisma.$transaction(async tx => {
				const fresh = await tx.workers.findUnique({
					where: { id: workerId },
					select: { history: true, employerId: true, jobId: true }
				})
				if (!fresh) throw new NotFoundException("Worker not found")

				const now = new Date().toISOString()
				const nextHistory = appendEvent(fresh.history, {
					type: "FIRED",
					at: now,
					employerId: fresh.employerId ?? null,
					jobId: fresh.jobId ?? null
				})

				await tx.workers.update({
					where: { id: workerId },
					data: { employerId: null, jobId: null, history: nextHistory }
				})

				return { ok: true, mode: "FIRED" as const }
			})
		}

		const job = await this.prisma.jobs.findUnique({
			where: { id: dto.jobId },
			select: { id: true, employerId: true, status: true }
		})
		if (!job) throw new NotFoundException("Job not found")

		await this.ensureActiveJobBelongsToEmployer(job.id, job.employerId)

		return this.prisma.$transaction(async tx => {
			const fresh = await tx.workers.findUnique({
				where: { id: workerId },
				select: { history: true, employerId: true, jobId: true }
			})
			if (!fresh) throw new NotFoundException("Worker not found")

			const now = new Date().toISOString()
			let nextHistory = fresh.history

			if (fresh.employerId || fresh.jobId) {
				nextHistory = appendEvent(nextHistory, {
					type: "FIRED",
					at: now,
					employerId: fresh.employerId ?? null,
					jobId: fresh.jobId ?? null
				})
			}

			nextHistory = appendEvent(nextHistory, {
				type: "HIRED",
				at: now,
				employerId: job.employerId,
				jobId: job.id
			})

			await tx.workers.update({
				where: { id: workerId },
				data: {
					employerId: job.employerId,
					jobId: job.id,
					history: nextHistory
				}
			})

			return { ok: true, mode: "HIRED" as const }
		})
	}

	private async ensureExists(id: string) {
		const exists = await this.prisma.workers.findUnique({
			where: { id },
			select: { id: true }
		})
		if (!exists) throw new NotFoundException("Worker not found")
	}

	private async ensureActiveJobBelongsToEmployer(
		jobId: string,
		employerId: string
	) {
		const job = await this.prisma.jobs.findUnique({
			where: { id: jobId },
			select: { id: true, employerId: true, status: true }
		})
		if (!job) throw new BadRequestException("Job does not exist")
		if (job.employerId !== employerId)
			throw new BadRequestException("Job does not belong to employer")
		if (job.status !== JobStatus.ACTIVE)
			throw new BadRequestException("Job must be ACTIVE")
	}
}
