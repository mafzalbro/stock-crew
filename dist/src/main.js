"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const morgan = require("morgan");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(morgan('dev'));
    app.enableCors({ origin: '*' });
    await app.listen(3001, () => {
        console.log('Server is running on port http://localhost:3001');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map