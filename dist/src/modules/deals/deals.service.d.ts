import { PrismaService } from '../../prisma/prisma.service';
import { CreateDealDto, UpdateDealDto, UpdateDealStatusDto, DealFiltersDto } from './dto/create-deal.dto';
import { DealResponseDto, DealListResponseDto } from './dto/deal-response.dto';
import { DealStatus } from '@prisma/client';
export declare class DealsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDealDto: CreateDealDto, userId?: string): Promise<DealResponseDto>;
    findAll(filters: DealFiltersDto): Promise<DealListResponseDto>;
    findOne(id: string): Promise<DealResponseDto>;
    findBySlug(slug: string): Promise<DealResponseDto>;
    findActive(page?: number, limit?: number): Promise<DealListResponseDto>;
    findByStatus(status: DealStatus, page?: number, limit?: number): Promise<DealListResponseDto>;
    findByMerchant(merchantId: string, page?: number, limit?: number): Promise<DealListResponseDto>;
    findByCategory(categoryId: string, page?: number, limit?: number): Promise<DealListResponseDto>;
    update(id: string, updateDealDto: UpdateDealDto, userId?: string): Promise<DealResponseDto>;
    updateStatus(id: string, updateStatusDto: UpdateDealStatusDto, userId?: string): Promise<DealResponseDto>;
    publish(id: string, userId?: string): Promise<DealResponseDto>;
    pause(id: string, userId?: string): Promise<DealResponseDto>;
    remove(id: string, userId?: string): Promise<void>;
    checkExpiredDeals(): Promise<{
        updated: number;
    }>;
    checkSoldOutDeals(): Promise<{
        updated: number;
    }>;
    getStats(): Promise<{
        total: number;
        active: number;
        draft: number;
        paused: number;
        expired: number;
        soldOut: number;
    }>;
    private validateStatusTransition;
    private mapDealToResponse;
    private generateSlug;
}
