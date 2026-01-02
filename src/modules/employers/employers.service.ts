import { Injectable, NotFoundException } from "@nestjs/common"

import { PrismaService } from "../../prisma/prisma.service"

import { CreateEmployerDto } from "./dto/create-employer.dto"
import { UpdateEmployerDto } from "./dto/update-employer.dto"

@Injectable()
export class EmployersService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateEmployerDto) {
		return this.prisma.employers.create({ data: dto })
	}

	async findAll() {
		return this.prisma.employers.findMany({
			orderBy: { createdAt: "desc" },
			include: { _count: { select: { jobs: true, workers: true } } }
		})
	}

	async findOne(id: string) {
		const employer = await this.prisma.employers.findUnique({
			where: { id },
			include: { jobs: true, workers: true }
		})
		if (!employer) throw new NotFoundException("Employer not found")
		return employer
	}

	async update(id: string, dto: UpdateEmployerDto) {
		await this.ensureExists(id)
		return this.prisma.employers.update({ where: { id }, data: dto })
	}

	async remove(id: string) {
		await this.ensureExists(id)
		return this.prisma.employers.delete({ where: { id } })
	}

	async workers(id: string) {
		await this.ensureExists(id)
		return this.prisma.workers.findMany({
			where: { employerId: id },
			orderBy: { createdAt: "desc" }
		})
	}

	private async ensureExists(id: string) {
		const exists = await this.prisma.employers.findUnique({
			where: { id },
			select: { id: true }
		})
		if (!exists) throw new NotFoundException("Employer not found")
	}
}
