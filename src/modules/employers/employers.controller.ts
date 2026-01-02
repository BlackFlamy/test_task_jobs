import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"

import { CreateEmployerDto } from "./dto/create-employer.dto"
import { UpdateEmployerDto } from "./dto/update-employer.dto"
import { EmployersService } from "./employers.service"

@ApiTags("Employers")
@Controller("employers")
export class EmployersController {
	constructor(private readonly service: EmployersService) {}

	@Post()
	create(@Body() dto: CreateEmployerDto) {
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
	update(@Param("id") id: string, @Body() dto: UpdateEmployerDto) {
		return this.service.update(id, dto)
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.service.remove(id)
	}

	@Get(":id/workers")
	workers(@Param("id") id: string) {
		return this.service.workers(id)
	}
}
