import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const daysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const randomMidtransRef = () => `MID-${Math.floor(Math.random() * 1_000_000)}`;
  const randomQrSuffix = () => Math.floor(Math.random() * 1_000_000).toString().padStart(6, '0');

  type DealStatusSeed = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'SOLD_OUT';
  type OrderStatusSeed = 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  type CouponStatusSeed = 'ACTIVE' | 'USED' | 'EXPIRED' | 'CANCELLED';

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

  const additionalMerchantsData = [
    {
      name: 'Sushi Master',
      description: 'Restoran sushi autentik dengan bahan segar setiap hari',
      email: 'sushi@merchant.com',
      phone: '+6281298765432',
      address: 'Jl. Sakura No. 45',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      postalCode: '12910',
      website: 'https://sushimaster.co.id',
      logo: 'https://via.placeholder.com/200x200?text=Sushi',
      isActive: true,
    },
    {
      name: 'Glow Beauty Spa',
      description: 'Perawatan spa dan kecantikan premium untuk wanita modern',
      email: 'glow@merchant.com',
      phone: '+6281133344455',
      address: 'Jl. Kemang Raya No. 88',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      postalCode: '12730',
      website: 'https://glowbeautyspa.co.id',
      logo: 'https://via.placeholder.com/200x200?text=Glow',
      isActive: true,
    },
    {
      name: 'Tech Haven',
      description: 'Toko gadget dan elektronik terpercaya dengan harga terbaik',
      email: 'tech@merchant.com',
      phone: '+6281122211122',
      address: 'Jl. Sudirman No. 123',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      postalCode: '10220',
      website: 'https://techhaven.co.id',
      logo: 'https://via.placeholder.com/200x200?text=Tech',
      isActive: true,
    },
  ];

  const additionalMerchants = await Promise.all(
    additionalMerchantsData.map((data) =>
      prisma.merchant.upsert({
        where: { email: data.email },
        update: {},
        create: data,
      })
    )
  );

  const merchants = [merchant, ...additionalMerchants];
  console.log('✅ Additional merchants ensured:', merchants.length);

  // Create multiple sample deals (expanded dataset)
  const dealSeedData: Array<{
    id: string;
    title: string;
    description: string;
    dealPrice: number;
    discountPrice: number;
    validFrom: Date;
    validUntil: Date;
    status: DealStatusSeed;
    maxQuantity: number;
    soldQuantity: number;
    terms: string;
    merchantIndex: number;
    categoryIndex: number;
    images?: string[];
  }> = [
    {
      id: 'demo-deal-1',
      title: 'Pizza Voucher Rp 75.000',
      description: 'Voucher senilai Rp 75.000 untuk semua menu pizza. Berlaku untuk makan di tempat dan dibawa pulang. Nikmati pizza favorit Anda dengan voucher hemat ini!',
      dealPrice: 60000,
      discountPrice: 75000,
      validFrom: daysFromNow(0),
      validUntil: daysFromNow(30),
      status: 'ACTIVE',
      maxQuantity: 100,
      soldQuantity: 5,
      terms: 'Valid untuk dine-in dan takeaway. Tidak bisa digabung dengan promo lain. Minimum order 1 pizza.',
      merchantIndex: 0,
      categoryIndex: 0,
    },
    {
      id: 'demo-deal-2',
      title: 'Burger Combo Voucher Rp 50.000',
      description: 'Voucher Rp 50.000 untuk paket burger combo. Termasuk burger, kentang goreng, dan minuman. Hemat dan mengenyangkan!',
      dealPrice: 40000,
      discountPrice: 50000,
      validFrom: daysFromNow(-2),
      validUntil: daysFromNow(45),
      status: 'ACTIVE',
      maxQuantity: 150,
      soldQuantity: 23,
      terms: 'Berlaku untuk dine-in, takeaway, dan delivery. Satu voucher per transaksi.',
      merchantIndex: 0,
      categoryIndex: 0,
    },
    {
      id: 'demo-deal-3',
      title: 'Voucher Kopi & Pastry Rp 35.000',
      description: 'Voucher Rp 35.000 untuk kopi dan pastry pilihan. Nikmati waktu santai Anda dengan kopi berkualitas dan pastry lezat.',
      dealPrice: 28000,
      discountPrice: 35000,
      validFrom: daysFromNow(-1),
      validUntil: daysFromNow(60),
      status: 'ACTIVE',
      maxQuantity: 200,
      soldQuantity: 87,
      terms: 'Berlaku di semua outlet. Tersedia setiap hari pukul 07.00-21.00.',
      merchantIndex: 0,
      categoryIndex: 0,
    },
    {
      id: 'demo-deal-4',
      title: 'Voucher Belanja Fashion Rp 100.000',
      description: 'Voucher belanja Rp 100.000 untuk semua koleksi fashion. Berlaku untuk baju, celana, aksesoris, dan sepatu. Update gaya Anda!',
      dealPrice: 80000,
      discountPrice: 100000,
      validFrom: daysFromNow(0),
      validUntil: daysFromNow(90),
      status: 'ACTIVE',
      maxQuantity: 50,
      soldQuantity: 12,
      terms: 'Berlaku untuk semua item tanpa minimum pembelian. Tidak berlaku saat sale spesial.',
      merchantIndex: 0,
      categoryIndex: 1,
    },
    {
      id: 'demo-deal-5',
      title: 'Voucher Spa & Massage Rp 150.000',
      description: 'Voucher Rp 150.000 untuk layanan spa dan massage. Manjakan diri Anda dengan treatment berkualitas dari terapis profesional.',
      dealPrice: 120000,
      discountPrice: 150000,
      validFrom: daysFromNow(-3),
      validUntil: daysFromNow(60),
      status: 'ACTIVE',
      maxQuantity: 30,
      soldQuantity: 8,
      terms: 'Reservasi diperlukan minimal 1 hari sebelumnya. Berlaku Senin-Jumat, tidak termasuk hari libur nasional.',
      merchantIndex: 2,
      categoryIndex: 3,
    },
    {
      id: 'demo-deal-6',
      title: 'Voucher Cinema Rp 40.000',
      description: 'Voucher nonton bioskop Rp 40.000. Berlaku untuk semua film dan semua jadwal. Nonton film favorit jadi lebih hemat!',
      dealPrice: 32000,
      discountPrice: 40000,
      validFrom: daysFromNow(0),
      validUntil: daysFromNow(30),
      status: 'DRAFT',
      maxQuantity: 300,
      soldQuantity: 0,
      terms: 'Berlaku untuk film 2D reguler. Tidak berlaku untuk premiere, IMAX, dan event khusus.',
      merchantIndex: 0,
      categoryIndex: 2,
    },
    {
      id: 'demo-deal-7',
      title: 'Sushi Platter Voucher Rp 120.000',
      description: 'Nikmati platter sushi spesial dengan harga hemat. Tersedia pilihan nigiri, sashimi, dan maki.',
      dealPrice: 95000,
      discountPrice: 120000,
      validFrom: daysFromNow(-5),
      validUntil: daysFromNow(40),
      status: 'ACTIVE',
      maxQuantity: 120,
      soldQuantity: 64,
      terms: 'Reservasi dianjurkan. Berlaku untuk dine-in dan takeaway.',
      merchantIndex: 1,
      categoryIndex: 0,
    },
    {
      id: 'demo-deal-8',
      title: 'Paket Bubble Tea Rp 40.000',
      description: 'Dapatkan dua gelas bubble tea ukuran large dengan berbagai topping pilihan.',
      dealPrice: 32000,
      discountPrice: 40000,
      validFrom: daysFromNow(-1),
      validUntil: daysFromNow(25),
      status: 'ACTIVE',
      maxQuantity: 300,
      soldQuantity: 210,
      terms: 'Berlaku untuk semua rasa. Tidak dapat digabung dengan promo happy hour.',
      merchantIndex: 1,
      categoryIndex: 0,
    },
    {
      id: 'demo-deal-9',
      title: 'Voucher Elektronik Rp 500.000',
      description: 'Voucher potongan harga Rp 500.000 untuk pembelian gadget dan aksesoris di Tech Haven.',
      dealPrice: 450000,
      discountPrice: 500000,
      validFrom: daysFromNow(0),
      validUntil: daysFromNow(15),
      status: 'PAUSED',
      maxQuantity: 200,
      soldQuantity: 150,
      terms: 'Minimum transaksi Rp 2.500.000. Berlaku untuk produk gadget tertentu.',
      merchantIndex: 3,
      categoryIndex: 1,
    },
    {
      id: 'demo-deal-10',
      title: 'Paket Bioskop VIP Rp 70.000',
      description: 'Nikmati pengalaman nonton VIP lengkap dengan kursi nyaman dan snack gratis.',
      dealPrice: 56000,
      discountPrice: 70000,
      validFrom: daysFromNow(-7),
      validUntil: daysFromNow(35),
      status: 'ACTIVE',
      maxQuantity: 180,
      soldQuantity: 92,
      terms: 'Berlaku untuk jadwal setelah pukul 16.00. Tidak berlaku saat premier film.',
      merchantIndex: 0,
      categoryIndex: 2,
    },
    {
      id: 'demo-deal-11',
      title: 'Perawatan Spa Premium Rp 200.000',
      description: 'Paket spa lengkap termasuk body scrub dan aromatherapy massage.',
      dealPrice: 170000,
      discountPrice: 200000,
      validFrom: daysFromNow(-10),
      validUntil: daysFromNow(55),
      status: 'ACTIVE',
      maxQuantity: 80,
      soldQuantity: 28,
      terms: 'Reservasi wajib. Berlaku untuk wanita dan pria.',
      merchantIndex: 2,
      categoryIndex: 3,
    },
    {
      id: 'demo-deal-12',
      title: 'Voucher Membership Gym Rp 250.000',
      description: 'Akses gym premium selama 30 hari dengan fasilitas lengkap dan kelas kebugaran.',
      dealPrice: 210000,
      discountPrice: 250000,
      validFrom: daysFromNow(-2),
      validUntil: daysFromNow(60),
      status: 'PAUSED',
      maxQuantity: 80,
      soldQuantity: 34,
      terms: 'Harus digunakan dalam 30 hari setelah aktivasi. Berlaku di semua cabang.',
      merchantIndex: 2,
      categoryIndex: 3,
    },
    {
      id: 'demo-deal-13',
      title: 'Paket Make Up Class Rp 180.000',
      description: 'Belajar teknik make up natural dan glam bersama MUA profesional.',
      dealPrice: 150000,
      discountPrice: 180000,
      validFrom: daysFromNow(0),
      validUntil: daysFromNow(20),
      status: 'ACTIVE',
      maxQuantity: 60,
      soldQuantity: 31,
      terms: 'Termasuk goodie bag dan sertifikat. Kelas berlangsung selama 3 jam.',
      merchantIndex: 2,
      categoryIndex: 3,
    },
    {
      id: 'demo-deal-14',
      title: 'Voucher Playground Anak Rp 90.000',
      description: 'Akses bermain 3 jam di playground indoor dengan berbagai wahana edukatif.',
      dealPrice: 75000,
      discountPrice: 90000,
      validFrom: daysFromNow(-4),
      validUntil: daysFromNow(45),
      status: 'ACTIVE',
      maxQuantity: 150,
      soldQuantity: 65,
      terms: 'Berlaku untuk anak usia 2-10 tahun. Pakaian kaos kaki wajib.',
      merchantIndex: 1,
      categoryIndex: 2,
    },
    {
      id: 'demo-deal-15',
      title: 'Tiket Theme Park Rp 150.000',
      description: 'Masuk seharian ke theme park favorit dengan semua wahana tanpa batas.',
      dealPrice: 130000,
      discountPrice: 150000,
      validFrom: daysFromNow(-14),
      validUntil: daysFromNow(20),
      status: 'SOLD_OUT',
      maxQuantity: 500,
      soldQuantity: 500,
      terms: 'Tidak termasuk biaya parkir dan makanan. Promo khusus akhir pekan.',
      merchantIndex: 1,
      categoryIndex: 2,
    },
    {
      id: 'demo-deal-16',
      title: 'Paket Bakery Box Rp 55.000',
      description: 'Paket roti dan kue pilihan setiap pagi. Cocok untuk bekal keluarga.',
      dealPrice: 45000,
      discountPrice: 55000,
      validFrom: daysFromNow(-3),
      validUntil: daysFromNow(25),
      status: 'ACTIVE',
      maxQuantity: 180,
      soldQuantity: 110,
      terms: 'Pengambilan pukul 06.00-10.00 setiap hari. Tidak dapat diganti menu.',
      merchantIndex: 0,
      categoryIndex: 0,
    },
    {
      id: 'demo-deal-17',
      title: 'Voucher Steakhouse Rp 180.000',
      description: 'Diskon spesial untuk menu steak premium lengkap dengan side dish.',
      dealPrice: 150000,
      discountPrice: 180000,
      validFrom: daysFromNow(-6),
      validUntil: daysFromNow(50),
      status: 'ACTIVE',
      maxQuantity: 90,
      soldQuantity: 40,
      terms: 'Berlaku untuk makan malam. Servis charge tidak termasuk.',
      merchantIndex: 0,
      categoryIndex: 0,
    },
    {
      id: 'demo-deal-18',
      title: 'Kelas Kursus Online Rp 300.000',
      description: 'Akses kelas online selama 3 bulan untuk pengembangan karier digital Anda.',
      dealPrice: 240000,
      discountPrice: 300000,
      validFrom: daysFromNow(5),
      validUntil: daysFromNow(90),
      status: 'DRAFT',
      maxQuantity: 400,
      soldQuantity: 0,
      terms: 'Materi dapat diakses kapan saja. Termasuk sesi live bulanan.',
      merchantIndex: 3,
      categoryIndex: 1,
    },
    {
      id: 'demo-deal-19',
      title: 'Workshop Fotografi Rp 220.000',
      description: 'Pelatihan fotografi sehari penuh bersama fotografer profesional.',
      dealPrice: 180000,
      discountPrice: 220000,
      validFrom: daysFromNow(-40),
      validUntil: daysFromNow(-2),
      status: 'EXPIRED',
      maxQuantity: 100,
      soldQuantity: 82,
      terms: 'Termasuk e-book materi dan sertifikat digital.',
      merchantIndex: 3,
      categoryIndex: 2,
    },
  ];

  const deals = await Promise.all(
    dealSeedData.map((deal) =>
      prisma.deal.upsert({
        where: { id: deal.id },
        update: {
          title: deal.title,
          description: deal.description,
          dealPrice: new Prisma.Decimal(deal.dealPrice),
          discountPrice: new Prisma.Decimal(deal.discountPrice),
          validFrom: deal.validFrom,
          validUntil: deal.validUntil,
          status: deal.status,
          maxQuantity: deal.maxQuantity,
          soldQuantity: deal.soldQuantity,
          images: deal.images ?? [],
          terms: deal.terms,
          merchantId: merchants[deal.merchantIndex]?.id ?? merchant.id,
          categoryId: categories[deal.categoryIndex]?.id,
        },
        create: {
          id: deal.id,
          title: deal.title,
          description: deal.description,
          dealPrice: new Prisma.Decimal(deal.dealPrice),
          discountPrice: new Prisma.Decimal(deal.discountPrice),
          validFrom: deal.validFrom,
          validUntil: deal.validUntil,
          status: deal.status,
          maxQuantity: deal.maxQuantity,
          soldQuantity: deal.soldQuantity,
          images: deal.images ?? [],
          terms: deal.terms,
          merchantId: merchants[deal.merchantIndex]?.id ?? merchant.id,
          categoryId: categories[deal.categoryIndex]?.id,
        },
      })
    )
  );

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

  const additionalOrdersData: Array<{
    dealIndex: number;
    quantity: number;
    status: OrderStatusSeed;
    includePayment?: boolean;
  }> = [
    { dealIndex: 1, quantity: 1, status: 'PAID', includePayment: true },
    { dealIndex: 2, quantity: 2, status: 'PAID', includePayment: true },
    { dealIndex: 3, quantity: 1, status: 'PENDING' },
    { dealIndex: 4, quantity: 1, status: 'CANCELLED' },
    { dealIndex: 5, quantity: 1, status: 'REFUNDED', includePayment: true },
    { dealIndex: 6, quantity: 2, status: 'PAID', includePayment: true },
    { dealIndex: 7, quantity: 1, status: 'PAID', includePayment: true },
    { dealIndex: 8, quantity: 3, status: 'PAID', includePayment: true },
    { dealIndex: 10, quantity: 1, status: 'PAID', includePayment: true },
    { dealIndex: 12, quantity: 1, status: 'PENDING' },
    { dealIndex: 13, quantity: 2, status: 'PAID', includePayment: true },
    { dealIndex: 14, quantity: 1, status: 'PAID', includePayment: true },
  ];

  const additionalOrders: Awaited<ReturnType<typeof prisma.order.create>>[] = [];
  for (const [index, orderTemplate] of additionalOrdersData.entries()) {
    const dealRef = deals[orderTemplate.dealIndex] ?? deals[0];
    const amountNumber = parseFloat(dealRef.dealPrice.toString()) * orderTemplate.quantity;
    const orderData: Prisma.OrderUncheckedCreateInput = {
      orderNumber: genOrderNo(`EXTRA-${index}`),
      customerId: customer.id,
      dealId: dealRef.id,
      quantity: orderTemplate.quantity,
      totalAmount: new Prisma.Decimal(amountNumber),
      status: orderTemplate.status,
    };

    if (orderTemplate.includePayment) {
      orderData.paymentMethod = 'midtrans';
      orderData.paymentReference = randomMidtransRef();
    }

    const createdOrder = await prisma.order.create({ data: orderData });
    additionalOrders.push(createdOrder);
  }
  console.log('✅ Additional sample orders created:', additionalOrders.map((o) => o.orderNumber));

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

  const additionalCoupons: Awaited<ReturnType<typeof prisma.coupon.create>>[] = [];
  const couponStatusCycle: CouponStatusSeed[] = [
    'ACTIVE',
    'USED',
    'EXPIRED',
    'ACTIVE',
    'CANCELLED',
  ];

  let couponCycleIndex = 0;
  for (const order of additionalOrders) {
    if (order.status === 'PAID' || order.status === 'REFUNDED') {
      const cycleStatus = couponStatusCycle[couponCycleIndex % couponStatusCycle.length];
      couponCycleIndex += 1;
      const statusValue: CouponStatusSeed =
        order.status === 'REFUNDED' && cycleStatus === 'ACTIVE' ? 'CANCELLED' : cycleStatus;

      const expiresAt =
        statusValue === 'EXPIRED'
          ? daysFromNow(-(couponCycleIndex + 1))
          : daysFromNow(15 + couponCycleIndex);

      const couponData: Prisma.CouponUncheckedCreateInput = {
        orderId: order.id,
        dealId: order.dealId,
        qrCode: `QR-${order.orderNumber}-${statusValue}-${randomQrSuffix()}`,
        status: statusValue,
        expiresAt,
      };

      if (statusValue === 'USED') {
        couponData.usedAt = daysFromNow(-couponCycleIndex);
      }

      const createdCoupon = await prisma.coupon.create({ data: couponData });
      additionalCoupons.push(createdCoupon);
    }
  }

  if (additionalCoupons.length) {
    console.log('✅ Additional coupons created:', additionalCoupons.map((c) => c.qrCode));
  }

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

  const additionalRedemptions = await Promise.all(
    additionalCoupons
      .filter((coupon) => coupon.status === 'USED')
      .slice(0, 3)
      .map((coupon, idx) =>
        prisma.redemption.create({
          data: {
            couponId: coupon.id,
            redeemedByUserId: merchantUser.id,
            notes: `Redeemed automatically ${idx + 1}`,
            location: 'Jakarta Main Branch',
            status: 'COMPLETED',
            redeemedAt: daysFromNow(-(idx + 3)),
          },
        })
      )
  );

  if (additionalRedemptions.length) {
    console.log('✅ Additional redemptions created:', additionalRedemptions.map((r) => r.id));
  }

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
  const qrActivityPromises = [
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
  ];

  const extraQrActivitiesPromises = additionalCoupons.slice(0, 6).map((coupon, idx) =>
    prisma.qRCodeActivity.create({
      data: {
        action: idx % 3 === 0 ? 'GENERATED' : idx % 3 === 1 ? 'VALIDATED' : 'REDEEMED',
        couponId: coupon.id,
        metadata: {
          reference: coupon.qrCode,
          generatedBy: idx % 3 === 0 ? 'system-seed' : merchantUser.id,
          note: `seed-auto-${idx}`,
        },
      },
    })
  );

  const qrActivities = await Promise.all([...qrActivityPromises, ...extraQrActivitiesPromises]);

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

    const richardExtraOrdersData: Array<{
      dealIndex: number;
      quantity: number;
      status: OrderStatusSeed;
    }> = [
      { dealIndex: 2, quantity: 1, status: 'PAID' },
      { dealIndex: 4, quantity: 2, status: 'PAID' },
      { dealIndex: 6, quantity: 1, status: 'PAID' },
      { dealIndex: 8, quantity: 1, status: 'PENDING' },
      { dealIndex: 10, quantity: 1, status: 'PAID' },
    ];

    const richardExtraOrders: Awaited<ReturnType<typeof prisma.order.create>>[] = [];
    for (const [idx, orderTemplate] of richardExtraOrdersData.entries()) {
      const dealRef = deals[orderTemplate.dealIndex] ?? deals[0];
      const totalAmountNumber = parseFloat(dealRef.dealPrice.toString()) * orderTemplate.quantity;
      const richardOrder = await prisma.order.create({
        data: {
          orderNumber: ord(`R-EXTRA-${idx}`),
          customerId: richard.id,
          dealId: dealRef.id,
          quantity: orderTemplate.quantity,
          totalAmount: new Prisma.Decimal(totalAmountNumber),
          status: orderTemplate.status,
          paymentMethod: orderTemplate.status === 'PAID' ? 'midtrans' : undefined,
          paymentReference: orderTemplate.status === 'PAID' ? randomMidtransRef() : undefined,
        },
      });
      richardExtraOrders.push(richardOrder);
    }

    const richardExtraCoupons: Awaited<ReturnType<typeof prisma.coupon.create>>[] = [];
    for (const [idx, order] of richardExtraOrders.entries()) {
      if (order.status === 'PAID') {
        const statusCycle: CouponStatusSeed =
          idx % 3 === 0 ? 'ACTIVE' : idx % 3 === 1 ? 'USED' : 'EXPIRED';
        const coupon = await prisma.coupon.create({
          data: {
            orderId: order.id,
            dealId: order.dealId,
            qrCode: `QR-${order.orderNumber}-${statusCycle}-${randomQrSuffix()}`,
            status: statusCycle,
            expiresAt: statusCycle === 'EXPIRED' ? daysFromNow(-5) : daysFromNow(20 + idx),
            usedAt: statusCycle === 'USED' ? daysFromNow(-(idx + 1)) : undefined,
          },
        });
        richardExtraCoupons.push(coupon);
      }
    }

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

    console.log('✅ Richard orders:', [
      rPaid.orderNumber,
      rPending.orderNumber,
      ...richardExtraOrders.map((order) => order.orderNumber),
    ]);
    console.log('✅ Richard coupons:', [
      rCouponActive.qrCode,
      rCouponExpired.qrCode,
      ...richardExtraCoupons.map((coupon) => coupon.qrCode),
    ]);
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

