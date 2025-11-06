import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create categories (with new schema fields)
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

  // Create a sample merchant
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

  // Create multiple sample deals
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
        dealPrice: new Prisma.Decimal(60000), // Customer pays this
        discountPrice: new Prisma.Decimal(75000), // Voucher face value (20% discount)
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'ACTIVE',
        maxQuantity: 100,
        soldQuantity: 5,
        images: [],
        terms: 'Valid for dine-in and takeaway only. Cannot be combined with other offers. Minimum order 1 pizza.',
        merchantId: merchant.id,
        categoryId: categories[0].id, // Food & Beverage
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
        dealPrice: new Prisma.Decimal(40000), // Customer pays this
        discountPrice: new Prisma.Decimal(50000), // Voucher face value (20% discount)
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
        status: 'ACTIVE',
        maxQuantity: 150,
        soldQuantity: 23,
        images: [],
        terms: 'Valid for dine-in, takeaway, and delivery. One voucher per transaction.',
        merchantId: merchant.id,
        categoryId: categories[0].id, // Food & Beverage
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
        dealPrice: new Prisma.Decimal(28000), // Customer pays this
        discountPrice: new Prisma.Decimal(35000), // Voucher face value (20% discount)
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        status: 'ACTIVE',
        maxQuantity: 200,
        soldQuantity: 87,
        images: [],
        terms: 'Valid for all outlets. Available from 7 AM to 9 PM daily.',
        merchantId: merchant.id,
        categoryId: categories[0].id, // Food & Beverage
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
        dealPrice: new Prisma.Decimal(80000), // Customer pays this
        discountPrice: new Prisma.Decimal(100000), // Voucher face value (20% discount)
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        status: 'ACTIVE',
        maxQuantity: 50,
        soldQuantity: 12,
        images: [],
        terms: 'Valid for all items. Cannot be combined with ongoing sales. Minimum purchase Rp 200.000.',
        merchantId: merchant.id,
        categoryId: categories[1].id, // Shopping
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
        dealPrice: new Prisma.Decimal(120000), // Customer pays this
        discountPrice: new Prisma.Decimal(150000), // Voucher face value (20% discount)
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        status: 'ACTIVE',
        maxQuantity: 30,
        soldQuantity: 8,
        images: [],
        terms: 'Appointment required. Valid Monday-Friday. Not valid on public holidays.',
        merchantId: merchant.id,
        categoryId: categories[3].id, // Health & Beauty
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
        dealPrice: new Prisma.Decimal(32000), // Customer pays this
        discountPrice: new Prisma.Decimal(40000), // Voucher face value (20% discount)
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: 'DRAFT',
        maxQuantity: 300,
        soldQuantity: 0,
        images: [],
        terms: 'Valid for 2D movies only. Exclude special screenings and events. One voucher per ticket.',
        merchantId: merchant.id,
        categoryId: categories[2].id, // Entertainment
      },
    }),
  ]);

  console.log('✅ Deals created:', deals.length);

  // Create base users with hashed passwords for NextAuth credentials
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

  // Link merchant ownership (fixed type casting)
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

  // Create or link a sample customer profile to user
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

  // Helper to generate order numbers
  const genOrderNo = (suffix: string) => `ORD-${new Date().getTime()}-${suffix}`;

  // Create sample orders
  const orderPaid = await prisma.order.create({
    data: {
      orderNumber: genOrderNo('PAID'),
      customerId: customer.id,
      dealId: deals[0].id,
      quantity: 2,
      totalAmount: new Prisma.Decimal(150000),
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
      totalAmount: new Prisma.Decimal(75000),
      status: 'PENDING',
    },
  });

  const orderCancelled = await prisma.order.create({
    data: {
      orderNumber: genOrderNo('CANCELLED'),
      customerId: customer.id,
      dealId: deals[0].id,
      quantity: 3,
      totalAmount: new Prisma.Decimal(225000),
      status: 'CANCELLED',
    },
  });
  console.log('✅ Orders created:', [orderPaid.orderNumber, orderPending.orderNumber, orderCancelled.orderNumber]);

  // Create coupons for orders
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

  // Create sample redemptions
  const redemption1 = await prisma.redemption.create({
    data: {
      couponId: couponActive.id,
      redeemedByUserId: merchantUser.id,
      notes: 'Redeemed at main branch',
      location: 'Jakarta Main Branch',
      status: 'COMPLETED',
      redeemedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
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
      redeemedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      metadata: {
        device: 'tablet',
        ip: '192.168.1.2',
      },
    },
  });

  console.log('✅ Redemptions created:', [redemption1.id, redemption2.id]);

  // Create sample staff members (as Users with MerchantMembership)
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

  // Create staff memberships
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
        hireDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months ago
        department: 'Management',
      },
    },
  });

  console.log('✅ Staff members created:', [staff1User.email, staff2User.email]);

  // Create sample media files
  const mediaFiles = await Promise.all([
    prisma.media.create({
      data: {
        filename: 'merchant-logo.png',
        originalName: 'merchant-logo.png',
        mimeType: 'image/png',
        size: 102400, // 100KB
        url: 'https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=Logo',
        uploadedBy: merchantUser.id,
      },
    }),
    prisma.media.create({
      data: {
        filename: 'deal-image-1.jpg',
        originalName: 'pizza-deal.jpg',
        mimeType: 'image/jpeg',
        size: 204800, // 200KB
        url: 'https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Pizza+Deal',
        uploadedBy: merchantUser.id,
      },
    }),
    prisma.media.create({
      data: {
        filename: 'deal-image-2.jpg',
        originalName: 'burger-deal.jpg',
        mimeType: 'image/jpeg',
        size: 153600, // 150KB
        url: 'https://via.placeholder.com/800x600/4ECDC4/FFFFFF?text=Burger+Deal',
        uploadedBy: merchantUser.id,
      },
    }),
  ]);

  console.log('✅ Media files created:', mediaFiles.length);

  // Create sample QR code activities
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

  // ===== Mock data for specific customer account =====
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
      } as any,
    },
  });
  console.log('✅ Target customer ensured:', richard.email);

  const existingRichardOrders = await prisma.order.count({ where: { customerId: richard.id } });

  if (existingRichardOrders === 0) {
    const ord = (label: string) => `ORD-${Date.now()}-${Math.floor(Math.random() * 1e6)}-${label}`;

    const rPaid = await prisma.order.create({
      data: {
        orderNumber: ord('R-PAID'),
        customerId: richard.id,
        dealId: deals[0].id,
        quantity: 1,
        totalAmount: new Prisma.Decimal(75000),
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
        totalAmount: new Prisma.Decimal(150000),
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

    // Create redemption for Richard's active coupon
    const rRedemption = await prisma.redemption.create({
      data: {
        couponId: rCouponActive.id,
        redeemedByUserId: merchantUser.id,
        notes: 'Redeemed for Richard',
        location: 'Jakarta Branch',
        status: 'COMPLETED',
        redeemedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    });

    console.log('✅ Richard orders:', [rPaid.orderNumber, rPending.orderNumber]);
    console.log('✅ Richard coupons:', [rCouponActive.qrCode, rCouponExpired.qrCode]);
    console.log('✅ Richard redemption:', rRedemption.id);
  } else {
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

