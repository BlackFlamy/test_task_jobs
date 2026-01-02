import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"

import { DatePeriodQueryDto } from "../../common/dto/date-period.query.dto"

import { CreateJobDto } from "./dto/create-job.dto"
import { UpdateJobDto } from "./dto/update-job.dto"
import { JobsService } from "./jobs.service"

@ApiTags("Jobs")
@Controller("jobs")
export class JobsController {
	constructor(private readonly service: JobsService) {}

	@Post()
	create(@Body() dto: CreateJobDto) {
		return this.service.create(dto)
	}

	@Get()
	findAll() {
		return this.service.findAll()
	}

	@Get("date-period")
	findByDatePeriod(@Query() query: DatePeriodQueryDto) {
		return this.service.findByDatePeriod(query)
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.service.findOne(id)
	}

	@Put(":id")
	update(@Param("id") id: string, @Body() dto: UpdateJobDto) {
		return this.service.update(id, dto)
	}

	@Put(":id/archive")
	archive(@Param("id") id: string) {
		return this.service.archive(id)
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.service.remove(id)
	}
}
