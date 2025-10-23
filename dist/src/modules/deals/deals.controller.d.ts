import { DealsService } from './deals.service';
import { CreateDealDto, UpdateDealDto, UpdateDealStatusDto } from './dto/create-deal.dto';
import { DealResponseDto, DealListResponseDto } from './dto/deal-response.dto';
import { DealStatus } from '@prisma/client';
export declare class DealsController {
    private readonly dealsService;
    constructor(dealsService: DealsService);
    findAll(page: number, limit: number, status?: DealStatus, merchantId?: string, categoryId?: string, search?: string, featured?: boolean, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<DealListResponseDto>;
    findActive(page: number, limit: number): Promise<DealListResponseDto>;
    findByStatus(status: DealStatus, page: number, limit: number): Promise<DealListResponseDto>;
    findByMerchant(merchantId: string, page: number, limit: number): Promise<DealListResponseDto>;
    findByCategory(categoryId: string, page: number, limit: number): Promise<DealListResponseDto>;
    getStats(): Promise<{
        total: number;
        active: number;
        draft: number;
        paused: number;
        expired: number;
        soldOut: number;
    }>;
    findOne(id: string): Promise<DealResponseDto>;
    create(createDealDto: CreateDealDto, user: any): Promise<DealResponseDto>;
    update(id: string, updateDealDto: UpdateDealDto, user: any): Promise<DealResponseDto>;
    updateStatus(id: string, updateStatusDto: UpdateDealStatusDto, user: any): Promise<DealResponseDto>;
    publish(id: string, user: any): Promise<DealResponseDto>;
    pause(id: string, user: any): Promise<DealResponseDto>;
    checkExpiredDeals(): Promise<{
        updated: number;
    }>;
    checkSoldOutDeals(): Promise<{
        updated: number;
    }>;
    remove(id: string, user: any): Promise<void>;
}
