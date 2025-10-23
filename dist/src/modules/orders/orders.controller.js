"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const auth_decorators_1 = require("../auth/decorators/auth.decorators");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async create(createOrderDto) {
        return this.ordersService.create(createOrderDto);
    }
    async findAll(page, limit, status, customerId, dealId, merchantId) {
        return this.ordersService.findAll(page, limit, status, customerId, dealId, merchantId);
    }
    async getStats() {
        return this.ordersService.getStats();
    }
    async getAnalytics(period) {
        return this.ordersService.getAnalytics(period);
    }
    async findByCustomer(customerId, page, limit) {
        return this.ordersService.findByCustomer(customerId, page, limit);
    }
    async findMine(user, page, limit) {
        return this.ordersService.findMine(user.id, page, limit);
    }
    async findByMerchant(merchantId, page, limit) {
        return this.ordersService.findByMerchant(merchantId, page, limit);
    }
    async findByOrderNumber(orderNumber) {
        return this.ordersService.findByOrderNumber(orderNumber);
    }
    async findOne(id) {
        return this.ordersService.findOne(id);
    }
    async update(id, updateOrderDto) {
        return this.ordersService.update(id, updateOrderDto);
    }
    async updateStatus(id, updateStatusDto) {
        return this.ordersService.updateStatus(id, updateStatusDto);
    }
    async cancel(id, reason) {
        return this.ordersService.cancel(id, reason);
    }
    async refund(id, reason) {
        return this.ordersService.refund(id, reason);
    }
    async remove(id) {
        await this.ordersService.remove(id);
        return { message: 'Order deleted successfully' };
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorators_1.Roles)(client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid order data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Customer or deal not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders with pagination and filtering' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.OrderStatus, description: 'Filter by order status' }),
    (0, swagger_1.ApiQuery)({ name: 'customerId', required: false, type: String, description: 'Filter by customer ID' }),
    (0, swagger_1.ApiQuery)({ name: 'dealId', required: false, type: String, description: 'Filter by deal ID' }),
    (0, swagger_1.ApiQuery)({ name: 'merchantId', required: false, type: String, description: 'Filter by merchant ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders retrieved successfully' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('customerId')),
    __param(4, (0, common_1.Query)('dealId')),
    __param(5, (0, common_1.Query)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get order statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order statistics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get order analytics' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, type: String, description: 'Analytics period (week, month, year)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order analytics retrieved successfully' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('customer/:customerId'),
    (0, auth_decorators_1.Roles)(client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get orders for a specific customer' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer orders retrieved successfully' }),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findByCustomer", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, auth_decorators_1.Roles)(client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get orders for current authenticated customer' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current customer orders retrieved successfully' }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)('merchant/:merchantId'),
    (0, auth_decorators_1.Roles)(client_1.UserRole.MERCHANT, client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get orders for a specific merchant' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Merchant orders retrieved successfully' }),
    __param(0, (0, common_1.Param)('merchantId')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findByMerchant", null);
__decorate([
    (0, common_1.Get)('number/:orderNumber'),
    (0, auth_decorators_1.Roles)(client_1.UserRole.CUSTOMER, client_1.UserRole.MERCHANT, client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get order by order number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Param)('orderNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findByOrderNumber", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_decorators_1.Roles)(client_1.UserRole.CUSTOMER, client_1.UserRole.MERCHANT, client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Get order by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Update order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid update data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_order_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Update order status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order status updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid status transition' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_order_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, auth_decorators_1.Roles)(client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Order cannot be cancelled' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/refund'),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.STAFF),
    (0, swagger_1.ApiOperation)({ summary: 'Refund order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order refunded successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Order cannot be refunded' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "refund", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorators_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Order cannot be deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "remove", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map