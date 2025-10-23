"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMerchantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_merchant_dto_1 = require("./create-merchant.dto");
class UpdateMerchantDto extends (0, swagger_1.PartialType)(create_merchant_dto_1.CreateMerchantDto) {
}
exports.UpdateMerchantDto = UpdateMerchantDto;
//# sourceMappingURL=update-merchant.dto.js.map