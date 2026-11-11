import { StandardSchemaValidationPipe } from "@nestjs/common";
import { NestFastifyApplication } from "@nestjs/platform-fastify";

export function validationSetup(app: NestFastifyApplication): void { 

    app.useGlobalPipes( new StandardSchemaValidationPipe())
}