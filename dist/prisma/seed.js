"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { name: 'Food & Beverage' },
            update: {},
            create: {
                name: 'Food & Beverage',
                description: 'Restaurants, cafes, and food delivery',
                icon: '🍽️',
                color: '#FF6B6B',
                level: 0,
                sortOrder: 1,
                tags: ['food', 'restaurant', 'cafe', 'beverage', 'dining'],
                isActive: true,
            },
        }),
        prisma.category.upsert({
            where: { name: 'Shopping' },
            update: {},
            create: {
                name: 'Shopping',
                description: 'Retail stores and online shopping',
                icon: '🛍️',
                color: '#4ECDC4',
                level: 0,
                sortOrder: 2,
                tags: ['shopping', 'retail', 'fashion', 'electronics'],
                isActive: true,
            },
        }),
        prisma.category.upsert({
            where: { name: 'Entertainment' },
            update: {},
            create: {
                name: 'Entertainment',
                description: 'Movies, games, and leisure activities',
                icon: '🎬',
                color: '#95E1D3',
                level: 0,
                sortOrder: 3,
                tags: ['entertainment', 'movies', 'games', 'leisure'],
                isActive: true,
            },
        }),
        prisma.category.upsert({
            where: { name: 'Health & Beauty' },
            update: {},
            create: {
                name: 'Health & Beauty',
                description: 'Fitness, beauty, and wellness services',
                icon: '💄',
                color: '#F38181',
                level: 0,
                sortOrder: 4,
                tags: ['health', 'beauty', 'fitness', 'wellness', 'spa'],
                isActive: true,
            },
        }),
    ]);
    console.log('✅ Categories created:', categories.length);
    const merchant = await prisma.merchant.upsert({
        where: { email: 'demo@merchant.com' },
        update: {},
        create: {
            name: 'Demo Restaurant',
            description: 'A sample restaurant for testing',
            email: 'demo@merchant.com',
            phone: '+6281234567890',
            address: 'Jl. Demo No. 123',
            city: 'Jakarta',
            province: 'DKI Jakarta',
            postalCode: '12345',
            website: 'https://demo-restaurant.com',
            logo: 'https://via.placeholder.com/200x200',
            isActive: true,
        },
    });
    console.log('✅ Merchant created:', merchant.name);
    const deals = await Promise.all([
        prisma.deal.upsert({
            where: { id: 'demo-deal-1' },
            update: {
                images: [],
            },
            create: {
                id: 'demo-deal-1',
                title: 'Pizza Voucher Rp 75.000',
                description: 'Voucher senilai Rp 75.000 untuk semua menu pizza. Berlaku untuk makan di tempat dan dibawa pulang. Nikmati pizza favorit Anda dengan voucher hemat ini!',
                dealPrice: new client_1.Prisma.Decimal(60000),
                discountPrice: new client_1.Prisma.Decimal(75000),
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                status: 'ACTIVE',
                maxQuantity: 100,
                soldQuantity: 5,
                images: [],
                terms: 'Valid for dine-in and takeaway only. Cannot be combined with other offers. Minimum order 1 pizza.',
                merchantId: merchant.id,
                categoryId: categories[0].id,
            },
        }),
        prisma.deal.upsert({
            where: { id: 'demo-deal-2' },
            update: {
                images: [],
            },
            create: {
                id: 'demo-deal-2',
                title: 'Burger Combo Voucher Rp 50.000',
                description: 'Voucher Rp 50.000 untuk paket burger combo. Termasuk burger, kentang goreng, dan minuman. Hemat dan mengenyangkan!',
                dealPrice: new client_1.Prisma.Decimal(40000),
                discountPrice: new client_1.Prisma.Decimal(50000),
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                status: 'ACTIVE',
                maxQuantity: 150,
                soldQuantity: 23,
                images: [],
                terms: 'Valid for dine-in, takeaway, and delivery. One voucher per transaction.',
                merchantId: merchant.id,
                categoryId: categories[0].id,
            },
        }),
        prisma.deal.upsert({
            where: { id: 'demo-deal-3' },
            update: {
                images: [],
            },
            create: {
                id: 'demo-deal-3',
                title: 'Voucher Kopi & Pastry Rp 35.000',
                description: 'Voucher Rp 35.000 untuk kopi dan pastry pilihan. Nikmati waktu santai Anda dengan kopi berkualitas dan pastry lezat.',
                dealPrice: new client_1.Prisma.Decimal(28000),
                discountPrice: new client_1.Prisma.Decimal(35000),
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                status: 'ACTIVE',
                maxQuantity: 200,
                soldQuantity: 87,
                images: [],
                terms: 'Valid for all outlets. Available from 7 AM to 9 PM daily.',
                merchantId: merchant.id,
                categoryId: categories[0].id,
            },
        }),
        prisma.deal.upsert({
            where: { id: 'demo-deal-4' },
            update: {
                images: [],
            },
            create: {
                id: 'demo-deal-4',
                title: 'Voucher Belanja Fashion Rp 100.000',
                description: 'Voucher belanja Rp 100.000 untuk semua koleksi fashion. Berlaku untuk baju, celana, aksesoris, dan sepatu. Update gaya Anda!',
                dealPrice: new client_1.Prisma.Decimal(80000),
                discountPrice: new client_1.Prisma.Decimal(100000),
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                status: 'ACTIVE',
                maxQuantity: 50,
                soldQuantity: 12,
                images: [],
                terms: 'Valid for all items. Cannot be combined with ongoing sales. Minimum purchase Rp 200.000.',
                merchantId: merchant.id,
                categoryId: categories[1].id,
            },
        }),
        prisma.deal.upsert({
            where: { id: 'demo-deal-5' },
            update: {
                images: [],
            },
            create: {
                id: 'demo-deal-5',
                title: 'Voucher Spa & Massage Rp 150.000',
                description: 'Voucher Rp 150.000 untuk layanan spa dan massage. Manjakan diri Anda dengan treatment berkualitas dari terapis profesional.',
                dealPrice: new client_1.Prisma.Decimal(120000),
                discountPrice: new client_1.Prisma.Decimal(150000),
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                status: 'ACTIVE',
                maxQuantity: 30,
                soldQuantity: 8,
                images: [],
                terms: 'Appointment required. Valid Monday-Friday. Not valid on public holidays.',
                merchantId: merchant.id,
                categoryId: categories[3].id,
            },
        }),
        prisma.deal.upsert({
            where: { id: 'demo-deal-6' },
            update: {
                images: [],
            },
            create: {
                id: 'demo-deal-6',
                title: 'Voucher Cinema Rp 40.000',
                description: 'Voucher nonton bioskop Rp 40.000. Berlaku untuk semua film dan semua jadwal. Nonton film favorit jadi lebih hemat!',
                dealPrice: new client_1.Prisma.Decimal(32000),
                discountPrice: new client_1.Prisma.Decimal(40000),
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                status: 'DRAFT',
                maxQuantity: 300,
                soldQuantity: 0,
                images: [],
                terms: 'Valid for 2D movies only. Exclude special screenings and events. One voucher per ticket.',
                merchantId: merchant.id,
                categoryId: categories[2].id,
            },
        }),
    ]);
    console.log('✅ Deals created:', deals.length);
    const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
    const merchantPasswordHash = await bcrypt.hash('Merchant@123456', 10);
    const customerPasswordHash = await bcrypt.hash('Customer@123456', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@lejel.local' },
        update: {
            hashedPassword: adminPasswordHash,
            role: 'SUPER_ADMIN',
            isActive: true,
        },
        create: {
            email: 'admin@lejel.local',
            hashedPassword: adminPasswordHash,
            role: 'SUPER_ADMIN',
            isActive: true,
        },
    });
    console.log('✅ Admin user created:', adminUser.email);
    const merchantUser = await prisma.user.upsert({
        where: { email: 'owner@merchant.com' },
        update: {
            hashedPassword: merchantPasswordHash,
            role: 'MERCHANT',
            isActive: true,
        },
        create: {
            email: 'owner@merchant.com',
            hashedPassword: merchantPasswordHash,
            role: 'MERCHANT',
            isActive: true,
        },
    });
    console.log('✅ Merchant user created:', merchantUser.email);
    const customerUser = await prisma.user.upsert({
        where: { email: 'demo@customer.com' },
        update: {
            hashedPassword: customerPasswordHash,
            role: 'CUSTOMER',
            isActive: true,
        },
        create: {
            email: 'demo@customer.com',
            hashedPassword: customerPasswordHash,
            role: 'CUSTOMER',
            isActive: true,
        },
    });
    console.log('✅ Customer user created:', customerUser.email);
    await prisma.merchantMembership.upsert({
        where: {
            userId_merchantId: {
                userId: merchantUser.id,
                merchantId: merchant.id
            }
        },
        update: {
            merchantRole: 'OWNER',
            isOwner: true
        },
        create: {
            userId: merchantUser.id,
            merchantId: merchant.id,
            merchantRole: 'OWNER',
            isOwner: true,
        },
    });
    console.log('✅ Merchant membership linked');
    const customer = await prisma.customer.upsert({
        where: { email: 'demo@customer.com' },
        update: {
            userId: customerUser.id,
            phone: '+628111111111',
            firstName: 'Budi',
            lastName: 'Demo',
        },
        create: {
            email: 'demo@customer.com',
            userId: customerUser.id,
            firstName: 'Budi',
            lastName: 'Demo',
            phone: '+628111111111',
        },
    });
    console.log('✅ Customer profile ensured and linked:', customer.email);
    const genOrderNo = (suffix) => `ORD-${new Date().getTime()}-${suffix}`;
    const orderPaid = await prisma.order.create({
        data: {
            orderNumber: genOrderNo('PAID'),
            customerId: customer.id,
            dealId: deals[0].id,
            quantity: 2,
            totalAmount: new client_1.Prisma.Decimal(150000),
            status: 'PAID',
            paymentMethod: 'midtrans',
            paymentReference: `MID-${Math.floor(Math.random() * 1_000_000)}`,
        },
    });
    const orderPending = await prisma.order.create({
        data: {
            orderNumber: genOrderNo('PENDING'),
            customerId: customer.id,
            dealId: deals[0].id,
            quantity: 1,
            totalAmount: new client_1.Prisma.Decimal(75000),
            status: 'PENDING',
        },
    });
    const orderCancelled = await prisma.order.create({
        data: {
            orderNumber: genOrderNo('CANCELLED'),
            customerId: customer.id,
            dealId: deals[0].id,
            quantity: 3,
            totalAmount: new client_1.Prisma.Decimal(225000),
            status: 'CANCELLED',
        },
    });
    console.log('✅ Orders created:', [orderPaid.orderNumber, orderPending.orderNumber, orderCancelled.orderNumber]);
    const now = new Date();
    const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const couponActive = await prisma.coupon.create({
        data: {
            orderId: orderPaid.id,
            dealId: deals[0].id,
            qrCode: `QR-${orderPaid.orderNumber}`,
            status: 'ACTIVE',
            expiresAt: in30Days,
        },
    });
    const couponUsed = await prisma.coupon.create({
        data: {
            orderId: orderPaid.id,
            dealId: deals[0].id,
            qrCode: `QR-${orderPaid.orderNumber}-USED`,
            status: 'USED',
            usedAt: now,
            expiresAt: in30Days,
        },
    });
    const couponExpired = await prisma.coupon.create({
        data: {
            orderId: orderCancelled.id,
            dealId: deals[0].id,
            qrCode: `QR-${orderCancelled.orderNumber}-EXP`,
            status: 'EXPIRED',
            expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
    });
    console.log('✅ Coupons created:', [couponActive.qrCode, couponUsed.qrCode, couponExpired.qrCode]);
    const redemption1 = await prisma.redemption.create({
        data: {
            couponId: couponActive.id,
            redeemedByUserId: merchantUser.id,
            notes: 'Redeemed at main branch',
            location: 'Jakarta Main Branch',
            status: 'COMPLETED',
            redeemedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            metadata: {
                device: 'mobile',
                ip: '192.168.1.1',
            },
        },
    });
    const redemption2 = await prisma.redemption.create({
        data: {
            couponId: couponUsed.id,
            redeemedByUserId: merchantUser.id,
            notes: 'Redeemed via QR scanner',
            location: 'Jakarta Main Branch',
            status: 'COMPLETED',
            redeemedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            metadata: {
                device: 'tablet',
                ip: '192.168.1.2',
            },
        },
    });
    console.log('✅ Redemptions created:', [redemption1.id, redemption2.id]);
    const staff1PasswordHash = await bcrypt.hash('Staff1234', 10);
    const staff2PasswordHash = await bcrypt.hash('Manager1234', 10);
    const staff1User = await prisma.user.upsert({
        where: { email: 'cashier@merchant.com' },
        update: {
            hashedPassword: staff1PasswordHash,
            role: 'MERCHANT',
            isActive: true,
        },
        create: {
            email: 'cashier@merchant.com',
            hashedPassword: staff1PasswordHash,
            role: 'MERCHANT',
            isActive: true,
        },
    });
    const staff2User = await prisma.user.upsert({
        where: { email: 'manager@merchant.com' },
        update: {
            hashedPassword: staff2PasswordHash,
            role: 'MERCHANT',
            isActive: true,
        },
        create: {
            email: 'manager@merchant.com',
            hashedPassword: staff2PasswordHash,
            role: 'MERCHANT',
            isActive: true,
        },
    });
    await prisma.merchantMembership.upsert({
        where: {
            userId_merchantId: {
                userId: staff1User.id,
                merchantId: merchant.id,
            },
        },
        update: {
            merchantRole: 'CASHIER',
            isOwner: false,
            permissions: {
                canScanQR: true,
                canViewRedemptions: true,
                canViewOrders: false,
            },
        },
        create: {
            userId: staff1User.id,
            merchantId: merchant.id,
            merchantRole: 'CASHIER',
            isOwner: false,
            permissions: {
                canScanQR: true,
                canViewRedemptions: true,
                canViewOrders: false,
            },
            metadata: {
                hireDate: new Date().toISOString(),
                department: 'Operations',
            },
        },
    });
    await prisma.merchantMembership.upsert({
        where: {
            userId_merchantId: {
                userId: staff2User.id,
                merchantId: merchant.id,
            },
        },
        update: {
            merchantRole: 'MANAGER',
            isOwner: false,
            permissions: {
                canScanQR: true,
                canViewRedemptions: true,
                canViewOrders: true,
                canManageDeals: true,
                canViewReports: true,
            },
        },
        create: {
            userId: staff2User.id,
            merchantId: merchant.id,
            merchantRole: 'MANAGER',
            isOwner: false,
            permissions: {
                canScanQR: true,
                canViewRedemptions: true,
                canViewOrders: true,
                canManageDeals: true,
                canViewReports: true,
            },
            metadata: {
                hireDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
                department: 'Management',
            },
        },
    });
    console.log('✅ Staff members created:', [staff1User.email, staff2User.email]);
    const mediaFiles = await Promise.all([
        prisma.media.create({
            data: {
                filename: 'merchant-logo.png',
                originalName: 'merchant-logo.png',
                mimeType: 'image/png',
                size: 102400,
                url: 'https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=Logo',
                uploadedBy: merchantUser.id,
            },
        }),
        prisma.media.create({
            data: {
                filename: 'deal-image-1.jpg',
                originalName: 'pizza-deal.jpg',
                mimeType: 'image/jpeg',
                size: 204800,
                url: 'https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Pizza+Deal',
                uploadedBy: merchantUser.id,
            },
        }),
        prisma.media.create({
            data: {
                filename: 'deal-image-2.jpg',
                originalName: 'burger-deal.jpg',
                mimeType: 'image/jpeg',
                size: 153600,
                url: 'https://via.placeholder.com/800x600/4ECDC4/FFFFFF?text=Burger+Deal',
                uploadedBy: merchantUser.id,
            },
        }),
    ]);
    console.log('✅ Media files created:', mediaFiles.length);
    const qrActivities = await Promise.all([
        prisma.qRCodeActivity.create({
            data: {
                action: 'GENERATED',
                couponId: couponActive.id,
                metadata: {
                    generatedBy: 'system',
                    orderNumber: orderPaid.orderNumber,
                },
            },
        }),
        prisma.qRCodeActivity.create({
            data: {
                action: 'VALIDATED',
                couponId: couponActive.id,
                metadata: {
                    validatedBy: merchantUser.id,
                    timestamp: new Date().toISOString(),
                },
            },
        }),
        prisma.qRCodeActivity.create({
            data: {
                action: 'REDEEMED',
                couponId: couponUsed.id,
                metadata: {
                    redeemedBy: merchantUser.id,
                    redemptionId: redemption2.id,
                },
            },
        }),
    ]);
    console.log('✅ QR code activities created:', qrActivities.length);
    const targetEmail = 'Richard244Tandean@gmail.com';
    const richard = await prisma.customer.upsert({
        where: { email: targetEmail },
        update: {},
        create: {
            email: targetEmail,
            firstName: 'Richard',
            lastName: 'Tandean',
            phone: '+6281212345678',
            preferences: {
                email: true,
                sms: false,
                push: true,
                whatsapp: true,
                deals: true,
                orders: true,
                marketing: false,
            },
        },
    });
    console.log('✅ Target customer ensured:', richard.email);
    const existingRichardOrders = await prisma.order.count({ where: { customerId: richard.id } });
    if (existingRichardOrders === 0) {
        const ord = (label) => `ORD-${Date.now()}-${Math.floor(Math.random() * 1e6)}-${label}`;
        const rPaid = await prisma.order.create({
            data: {
                orderNumber: ord('R-PAID'),
                customerId: richard.id,
                dealId: deals[0].id,
                quantity: 1,
                totalAmount: new client_1.Prisma.Decimal(75000),
                status: 'PAID',
                paymentMethod: 'midtrans',
                paymentReference: `MID-${Math.floor(Math.random() * 1_000_000)}`,
            },
        });
        const rPending = await prisma.order.create({
            data: {
                orderNumber: ord('R-PENDING'),
                customerId: richard.id,
                dealId: deals[0].id,
                quantity: 2,
                totalAmount: new client_1.Prisma.Decimal(150000),
                status: 'PENDING',
            },
        });
        const rCouponActive = await prisma.coupon.create({
            data: {
                orderId: rPaid.id,
                dealId: deals[0].id,
                qrCode: `QR-${rPaid.orderNumber}`,
                status: 'ACTIVE',
                expiresAt: in30Days,
            },
        });
        const rCouponExpired = await prisma.coupon.create({
            data: {
                orderId: rPending.id,
                dealId: deals[0].id,
                qrCode: `QR-${rPending.orderNumber}-EXP`,
                status: 'EXPIRED',
                expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
        });
        const rRedemption = await prisma.redemption.create({
            data: {
                couponId: rCouponActive.id,
                redeemedByUserId: merchantUser.id,
                notes: 'Redeemed for Richard',
                location: 'Jakarta Branch',
                status: 'COMPLETED',
                redeemedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
        });
        console.log('✅ Richard orders:', [rPaid.orderNumber, rPending.orderNumber]);
        console.log('✅ Richard coupons:', [rCouponActive.qrCode, rCouponExpired.qrCode]);
        console.log('✅ Richard redemption:', rRedemption.id);
    }
    else {
        console.log(`ℹ️ Richard already has ${existingRichardOrders} orders; skipping creation.`);
    }
    console.log('🎉 Database seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map