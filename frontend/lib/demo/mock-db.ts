import type { Category, Product } from "@/lib/services/product.service";
import type {
  CreateSaleDto,
  Sale,
  SalesSummary,
} from "@/lib/services/sales.service";
import type { UserProfile } from "@/store/user.store";

const DEMO_DB_KEY = "demo.pos.db.v1";
export const DEMO_MODE_ENABLED = process.env.NEXT_PUBLIC_DEMO_AUTH !== "false";

interface DemoDb {
  categories: Category[];
  products: Product[];
  sales: Sale[];
  users: UserProfile[];
}

const nowIso = () => new Date().toISOString();
const makeId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const seedDb = (): DemoDb => {
  const categories: Category[] = [
    { id: "cat-drink", name: "เครื่องดื่ม" },
    { id: "cat-food", name: "อาหาร" },
    { id: "cat-snack", name: "ขนม" },
    { id: "cat-house", name: "ของใช้" },
  ];

  const products: Product[] = [
    {
      id: "p-espresso",
      name: "เอสเพรสโซ่เย็น",
      barcode: "885000000001",
      category_id: "cat-drink",
      category: categories[0],
      cost_price: 25,
      selling_price: 45,
      stock: 40,
      low_stock_alert: 10,
      image_url: null,
    },
    {
      id: "p-latte",
      name: "ลาเต้ร้อน",
      barcode: "885000000002",
      category_id: "cat-drink",
      category: categories[0],
      cost_price: 30,
      selling_price: 55,
      stock: 26,
      low_stock_alert: 8,
      image_url: null,
    },
    {
      id: "p-thai-tea",
      name: "ชาไทย",
      barcode: "885000000003",
      category_id: "cat-drink",
      category: categories[0],
      cost_price: 20,
      selling_price: 40,
      stock: 12,
      low_stock_alert: 8,
      image_url: null,
    },
    {
      id: "p-fried-rice",
      name: "ข้าวผัดกุ้ง",
      barcode: "885000000004",
      category_id: "cat-food",
      category: categories[1],
      cost_price: 45,
      selling_price: 79,
      stock: 18,
      low_stock_alert: 6,
      image_url: null,
    },
    {
      id: "p-pasta",
      name: "สปาเกตตีคาโบนารา",
      barcode: "885000000005",
      category_id: "cat-food",
      category: categories[1],
      cost_price: 60,
      selling_price: 119,
      stock: 14,
      low_stock_alert: 6,
      image_url: null,
    },
    {
      id: "p-water",
      name: "น้ำดื่ม 600ml",
      barcode: "885000000006",
      category_id: "cat-drink",
      category: categories[0],
      cost_price: 6,
      selling_price: 12,
      stock: 120,
      low_stock_alert: 24,
      image_url: null,
    },
    {
      id: "p-chip",
      name: "มันฝรั่งทอดกรอบ",
      barcode: "885000000007",
      category_id: "cat-snack",
      category: categories[2],
      cost_price: 12,
      selling_price: 25,
      stock: 30,
      low_stock_alert: 10,
      image_url: null,
    },
    {
      id: "p-tissue",
      name: "กระดาษทิชชู",
      barcode: "885000000008",
      category_id: "cat-house",
      category: categories[3],
      cost_price: 18,
      selling_price: 35,
      stock: 22,
      low_stock_alert: 7,
      image_url: null,
    },
  ];

  const users: UserProfile[] = [
    {
      id: "demo-admin",
      email: "admin@demo.local",
      full_name: "Demo Admin",
      role: "admin",
      created_at: nowIso(),
    },
    {
      id: "demo-cashier-1",
      email: "cashier@demo.local",
      full_name: "Demo Cashier 1",
      role: "cashier",
      created_at: nowIso(),
    },
    {
      id: "demo-cashier-2",
      email: "cashier2@demo.local",
      full_name: "Demo Cashier 2",
      role: "cashier",
      created_at: nowIso(),
    },
  ];

  const sales: Sale[] = [
    {
      id: "sale-seed-1",
      receipt_number: "RCP-DEMO-0001",
      cashier_id: "demo-cashier-1",
      cashier_name: "Demo Cashier 1",
      subtotal: 140,
      discount: 10,
      total: 130,
      payment_method: "cash",
      status: "completed",
      note: null,
      created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      items: [
        {
          id: "sale-seed-1-item-1",
          product_id: "p-espresso",
          product_name: "เอสเพรสโซ่เย็น",
          quantity: 2,
          unit_price: 45,
          total_price: 90,
        },
        {
          id: "sale-seed-1-item-2",
          product_id: "p-chip",
          product_name: "มันฝรั่งทอดกรอบ",
          quantity: 2,
          unit_price: 25,
          total_price: 50,
        },
      ],
    },
    {
      id: "sale-seed-2",
      receipt_number: "RCP-DEMO-0002",
      cashier_id: "demo-cashier-2",
      cashier_name: "Demo Cashier 2",
      subtotal: 154,
      discount: 0,
      total: 154,
      payment_method: "transfer",
      status: "completed",
      note: null,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      items: [
        {
          id: "sale-seed-2-item-1",
          product_id: "p-fried-rice",
          product_name: "ข้าวผัดกุ้ง",
          quantity: 1,
          unit_price: 79,
          total_price: 79,
        },
        {
          id: "sale-seed-2-item-2",
          product_id: "p-latte",
          product_name: "ลาเต้ร้อน",
          quantity: 1,
          unit_price: 55,
          total_price: 55,
        },
        {
          id: "sale-seed-2-item-3",
          product_id: "p-water",
          product_name: "น้ำดื่ม 600ml",
          quantity: 1,
          unit_price: 12,
          total_price: 12,
        },
      ],
    },
  ];

  return { categories, products, sales, users };
};

const ensureDb = (): DemoDb => {
  if (typeof window === "undefined") {
    return seedDb();
  }
  const raw = localStorage.getItem(DEMO_DB_KEY);
  if (!raw) {
    const seeded = seedDb();
    localStorage.setItem(DEMO_DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as DemoDb;
  } catch {
    const seeded = seedDb();
    localStorage.setItem(DEMO_DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
};

const saveDb = (db: DemoDb) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(DEMO_DB_KEY, JSON.stringify(db));
  }
};

const withCategory = (db: DemoDb, product: Product): Product => ({
  ...product,
  category: db.categories.find((c) => c.id === product.category_id) || null,
});

const nextReceiptNo = (sales: Sale[]) => {
  const n = sales.length + 1;
  return `RCP-DEMO-${String(n).padStart(4, "0")}`;
};

export const demoDb = {
  // Products / Categories
  getProducts(): Product[] {
    const db = ensureDb();
    return db.products.map((p) => withCategory(db, p));
  },
  getCategories(): Category[] {
    return ensureDb().categories;
  },
  createProduct(data: Omit<Product, "id" | "category">): Product {
    const db = ensureDb();
    const created: Product = withCategory(db, {
      ...data,
      id: makeId("p") as string,
      category: null,
    });
    db.products.unshift(created);
    saveDb(db);
    return created;
  },
  updateProduct(id: string, data: Partial<Omit<Product, "category">>): Product {
    const db = ensureDb();
    const idx = db.products.findIndex((p) => p.id === id);
    if (idx < 0) throw new Error("ไม่พบสินค้า");
    db.products[idx] = { ...db.products[idx], ...data };
    const updated = withCategory(db, db.products[idx]);
    db.products[idx] = updated;
    saveDb(db);
    return updated;
  },
  deleteProduct(id: string): void {
    const db = ensureDb();
    db.products = db.products.filter((p) => p.id !== id);
    saveDb(db);
  },
  createCategory(data: { name: string }): Category {
    const db = ensureDb();
    const created: Category = { id: makeId("cat"), name: data.name.trim() };
    db.categories.push(created);
    saveDb(db);
    return created;
  },
  updateCategory(id: string, data: { name: string }): Category {
    const db = ensureDb();
    const idx = db.categories.findIndex((c) => c.id === id);
    if (idx < 0) throw new Error("ไม่พบหมวดหมู่");
    db.categories[idx] = { ...db.categories[idx], name: data.name.trim() };
    saveDb(db);
    return db.categories[idx];
  },
  deleteCategory(id: string): void {
    const db = ensureDb();
    const usedByProducts = db.products.some((p) => p.category_id === id);
    if (usedByProducts) {
      throw new Error("หมวดหมู่นี้ถูกใช้งานในสินค้าอยู่");
    }
    db.categories = db.categories.filter((c) => c.id !== id);
    saveDb(db);
  },

  // Sales
  getSales(params?: { from?: string; to?: string; status?: string }): Sale[] {
    const db = ensureDb();
    let list = [...db.sales];
    if (params?.status && params.status !== "all") {
      list = list.filter((s) => s.status === params.status);
    }
    if (params?.from) {
      list = list.filter(
        (s) => new Date(s.created_at) >= new Date(params.from!),
      );
    }
    if (params?.to) {
      list = list.filter((s) => new Date(s.created_at) <= new Date(params.to!));
    }
    return list.sort(
      (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
    );
  },
  getSaleById(id: string): Sale {
    const sale = ensureDb().sales.find((s) => s.id === id);
    if (!sale) throw new Error("ไม่พบรายการขาย");
    return sale;
  },
  getSalesSummary(): SalesSummary {
    const completed = ensureDb().sales.filter((s) => s.status === "completed");
    const today = new Date().toDateString();
    const todaySales = completed.filter(
      (s) => new Date(s.created_at).toDateString() === today,
    );
    return {
      todayRevenue: todaySales.reduce((sum, s) => sum + Number(s.total), 0),
      todayCount: todaySales.length,
      totalRevenue: completed.reduce((sum, s) => sum + Number(s.total), 0),
      totalCount: completed.length,
    };
  },
  createSale(data: CreateSaleDto): Sale {
    const db = ensureDb();

    for (const item of data.items) {
      const p = db.products.find((x) => x.id === item.product_id);
      if (!p) throw new Error(`ไม่พบสินค้า: ${item.product_name}`);
      if (p.stock < item.quantity)
        throw new Error(`สินค้า ${item.product_name} คงเหลือไม่พอ`);
    }

    db.products = db.products.map((p) => {
      const picked = data.items.find((i) => i.product_id === p.id);
      if (!picked) return p;
      return { ...p, stock: Math.max(0, p.stock - picked.quantity) };
    });

    const created: Sale = {
      id: makeId("sale"),
      receipt_number: nextReceiptNo(db.sales),
      cashier_id: data.cashier_id || null,
      cashier_name: data.cashier_name || "Demo Cashier",
      subtotal: data.subtotal,
      discount: data.discount,
      total: data.total,
      payment_method: data.payment_method,
      status: "completed",
      note: data.note || null,
      created_at: nowIso(),
      items: data.items.map((item) => ({ ...item, id: makeId("item") })),
    };
    db.sales.unshift(created);
    saveDb(db);
    return created;
  },
  cancelSale(id: string): Sale {
    const db = ensureDb();
    const idx = db.sales.findIndex((s) => s.id === id);
    if (idx < 0) throw new Error("ไม่พบบิลที่ต้องการยกเลิก");
    const sale = db.sales[idx];
    if (sale.status === "cancelled") return sale;

    db.products = db.products.map((p) => {
      const matched = sale.items.find((item) => item.product_id === p.id);
      if (!matched) return p;
      return { ...p, stock: p.stock + matched.quantity };
    });
    db.sales[idx] = { ...sale, status: "cancelled" };
    saveDb(db);
    return db.sales[idx];
  },

  // Users
  getUsers(): UserProfile[] {
    return ensureDb().users;
  },
  updateUserRole(id: string, role: "admin" | "cashier"): UserProfile {
    const db = ensureDb();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx < 0) throw new Error("ไม่พบผู้ใช้");
    db.users[idx] = { ...db.users[idx], role };
    saveDb(db);
    return db.users[idx];
  },
  updateUser(id: string, data: Partial<UserProfile>): UserProfile {
    const db = ensureDb();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx < 0) throw new Error("ไม่พบผู้ใช้");
    db.users[idx] = { ...db.users[idx], ...data };
    saveDb(db);
    return db.users[idx];
  },
  deleteUser(id: string): void {
    const db = ensureDb();
    db.users = db.users.filter((u) => u.id !== id);
    saveDb(db);
  },
  reset(): void {
    saveDb(seedDb());
  },
};
