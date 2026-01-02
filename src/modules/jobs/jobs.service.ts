import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { JobStatus } from "@prisma/client"

import { DatePeriodQueryDto } from "../../common/dto/date-period.query.dto"
import { PrismaService } from "../../prisma/prisma.service"

import { CreateJobDto } from "./dto/create-job.dto"
import { UpdateJobDto } from "./dto/update-job.dto"

@Injectable()
export class JobsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateJobDto) {
		await this.ensureEmployer(dto.employerId)
		return this.prisma.jobs.create({ data: dto })
	}

	async findAll() {
		return this.prisma.jobs.findMany({
			orderBy: { createdAt: "desc" },
			include: { owner: true, _count: { select: { workers: true } } }
		})
	}

	async findOne(id: string) {
		const job = await this.prisma.jobs.findUnique({
			where: { id },
			include: { owner: true, workers: true }
		})

		if (!job) throw new NotFoundException("Job not found")

		return job
	}

	async update(id: string, dto: UpdateJobDto) {
		await this.ensureExists(id)

		return this.prisma.jobs.update({ where: { id }, data: dto })
	}

	async remove(id: string) {
		await this.ensureExists(id)

		return this.prisma.jobs.delete({ where: { id } })
	}

	async archive(id: string) {
		await this.ensureExists(id)

		return this.prisma.jobs.update({
			where: { id },
			data: { status: JobStatus.ARCHIVE }
		})
	}

	async findByDatePeriod(query: DatePeriodQueryDto) {
		const from = query.from ? new Date(query.from) : undefined
		const to = query.to ? new Date(query.to) : undefined

		if (from && to && from > to)
			throw new BadRequestException("from must be <= to")

		return this.prisma.jobs.findMany({
			where: {
				createdAt: {
					...(from ? { gte: from } : {}),
					...(to ? { lte: to } : {})
				}
			},
			orderBy: { createdAt: "desc" },
			include: { owner: true }
		})
	}

	private async ensureExists(id: string) {
		const exists = await this.prisma.jobs.findUnique({
			where: { id },
			select: { id: true }
		})

		if (!exists) throw new NotFoundException("Job not found")
	}

	private async ensureEmployer(id: string) {
		const exists = await this.prisma.employers.findUnique({
			where: { id },
			select: { id: true }
		})

		if (!exists) throw new BadRequestException("Employer does not exist")
	}
}
