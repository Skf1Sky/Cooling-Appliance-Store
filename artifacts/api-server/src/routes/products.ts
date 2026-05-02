import { Router } from "express";
import { db, productsTable, categoriesTable } from "@workspace/db";
import { eq, ilike, gte, lte, and, type SQL } from "drizzle-orm";
import { ListProductsQueryParams, GetProductParams } from "@workspace/api-zod";

const router = Router();

router.get("/products", async (req, res) => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query parameters" });
  }
  const { categoryId, search, minPrice, maxPrice, brand } = parsed.data;

  const conditions: SQL[] = [];
  if (categoryId) conditions.push(eq(productsTable.categoryId, categoryId));
  if (brand) conditions.push(ilike(productsTable.brand, `%${brand}%`));
  if (search) conditions.push(ilike(productsTable.name, `%${search}%`));
  if (minPrice !== undefined) conditions.push(gte(productsTable.price, String(minPrice)));
  if (maxPrice !== undefined) conditions.push(lte(productsTable.price, String(maxPrice)));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const products = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      brand: productsTable.brand,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      price: productsTable.price,
      originalPrice: productsTable.originalPrice,
      discountPercent: productsTable.discountPercent,
      imageUrl: productsTable.imageUrl,
      images: productsTable.images,
      description: productsTable.description,
      specs: productsTable.specs,
      isFeatured: productsTable.isFeatured,
      inStock: productsTable.inStock,
      rating: productsTable.rating,
      reviewCount: productsTable.reviewCount,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(where);

  res.json(products.map(p => ({
    ...p,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    rating: p.rating ? Number(p.rating) : undefined,
  })));
});

router.get("/products/featured", async (_req, res) => {
  const products = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      brand: productsTable.brand,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      price: productsTable.price,
      originalPrice: productsTable.originalPrice,
      discountPercent: productsTable.discountPercent,
      imageUrl: productsTable.imageUrl,
      images: productsTable.images,
      description: productsTable.description,
      specs: productsTable.specs,
      isFeatured: productsTable.isFeatured,
      inStock: productsTable.inStock,
      rating: productsTable.rating,
      reviewCount: productsTable.reviewCount,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.isFeatured, true))
    .limit(8);

  res.json(products.map(p => ({
    ...p,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    rating: p.rating ? Number(p.rating) : undefined,
  })));
});

router.get("/products/:id", async (req, res) => {
  const parsed = GetProductParams.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  const [product] = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      brand: productsTable.brand,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      price: productsTable.price,
      originalPrice: productsTable.originalPrice,
      discountPercent: productsTable.discountPercent,
      imageUrl: productsTable.imageUrl,
      images: productsTable.images,
      description: productsTable.description,
      specs: productsTable.specs,
      isFeatured: productsTable.isFeatured,
      inStock: productsTable.inStock,
      rating: productsTable.rating,
      reviewCount: productsTable.reviewCount,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, parsed.data.id));

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json({
    ...product,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    rating: product.rating ? Number(product.rating) : undefined,
  });
});

export default router;
