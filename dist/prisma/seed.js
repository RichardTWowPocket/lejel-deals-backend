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
            },
        }),
        prisma.category.upsert({
            where: { name: 'Shopping' },
            update: {},
            create: {
                name: 'Shopping',
                description: 'Retail stores and online shopping',
                icon: '🛍️',
            },
        }),
        prisma.category.upsert({
            where: { name: 'Entertainment' },
            update: {},
            create: {
                name: 'Entertainment',
                description: 'Movies, games, and leisure activities',
                icon: '🎬',
            },
        }),
        prisma.category.upsert({
            where: { name: 'Health & Beauty' },
            update: {},
            create: {
                name: 'Health & Beauty',
                description: 'Fitness, beauty, and wellness services',
                icon: '💄',
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
                dealPrice: 60000,
                discountPrice: 75000,
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
                dealPrice: 40000,
                discountPrice: 50000,
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
                dealPrice: 28000,
                discountPrice: 35000,
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
                dealPrice: 80000,
                discountPrice: 100000,
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
                dealPrice: 120000,
                discountPrice: 150000,
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
                dealPrice: 32000,
                discountPrice: 40000,
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
        update: {},
        create: {
            email: 'admin@lejel.local',
            hashedPassword: adminPasswordHash,
            role: 'ADMIN',
            isActive: true,
        },
    });
    console.log('✅ Admin user created:', adminUser.email);
    const merchantUser = await prisma.user.upsert({
        where: { email: 'owner@merchant.com' },
        update: {},
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
        update: {},
        create: {
            email: 'demo@customer.com',
            hashedPassword: customerPasswordHash,
            role: 'CUSTOMER',
            isActive: true,
        },
    });
    console.log('✅ Customer user created:', customerUser.email);
    await prisma.merchantUser.upsert({
        where: { userId_merchantId: { userId: merchantUser.id, merchantId: merchant.id } },
        update: {},
        create: {
            userId: merchantUser.id,
            merchantId: merchant.id,
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
            totalAmount: 150000,
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
            totalAmount: 75000,
            status: 'PENDING',
        },
    });
    const orderCancelled = await prisma.order.create({
        data: {
            orderNumber: genOrderNo('CANCELLED'),
            customerId: customer.id,
            dealId: deals[0].id,
            quantity: 3,
            totalAmount: 225000,
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
    const targetEmail = 'Richard244Tandean@gmail.com';
    const targetSupabaseId = 'cmh0bor8b0000q4zimm24awx1';
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
                totalAmount: 75000,
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
                totalAmount: 150000,
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
        console.log('✅ Richard orders:', [rPaid.orderNumber, rPending.orderNumber]);
        console.log('✅ Richard coupons:', [rCouponActive.qrCode, rCouponExpired.qrCode]);
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