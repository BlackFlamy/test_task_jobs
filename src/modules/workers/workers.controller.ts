import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"

import { ChangeEmployerDto } from "./dto/change-employer.dto"
import { CreateWorkerDto } from "./dto/create-worker.dto"
import { UpdateWorkerDto } from "./dto/update-worker.dto"
import { WorkersService } from "./workers.service"

@ApiTags("Workers")
@Controller("workers")
export class WorkersController {
	constructor(private readonly service: WorkersService) {}

	@Post()
	create(@Body() dto: CreateWorkerDto) {
		return this.service.create(dto)
	}

	@Get()
	findAll() {
		return this.service.findAll()
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.service.findOne(id)
	}

	@Put(":id")
	update(@Param("id") id: string, @Body() dto: UpdateWorkerDto) {
		return this.service.update(id, dto)
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.service.remove(id)
	}

	@Get(":id/matched-jobs")
	matchedJobs(@Param("id") id: string) {
		return this.service.matchedJobs(id)
	}

	@Put(":id/new-employer")
	changeEmployer(@Param("id") id: string, @Body() dto: ChangeEmployerDto) {
		return this.service.changeEmployer(id, dto)
	}
}
