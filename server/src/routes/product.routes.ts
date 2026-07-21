import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { adminOnly, protect } from "../middleware/auth.js";
import { upload } from "../lib/cloudinary.js";


const router = Router();

// Public: list with search/sort/filter/pagination
router.get("/", async (req, res) => {
  const { search = "", sort, filter, page = "1", limit = "12" } = req.query as any;

  const where: any = { name: { contains: search, mode: "insensitive" } };
  if (filter === "new") {
    // handled via orderBy createdAt desc below
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip, take: Number(limit) }),
    prisma.product.count({ where }),
  ]);

  if (products.length === 0) {
    return res.json({ products: [], message: "Sorry, product not available", total });
  }

  res.json({ products, total, pages: Math.ceil(total / Number(limit)) });
});

router.get("/:id", async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

router.post("/", protect, adminOnly, upload.array("images", 4), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const { name, brand, description, price, quantity, benefits } = req.body;

  const product = await prisma.product.create({
    data: {
      name,
      brand,
      description,
      price: Number(price),
      quantity: Number(quantity),
      images: files.map((f) => f.path),
      benefits: Array.isArray(benefits) ? benefits : [benefits],
      inStock: Number(quantity) > 0,
    },
  });
  res.status(201).json(product);
});

router.put("/:id", protect, adminOnly, upload.array("images", 4), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const { name, brand, description, price, quantity, benefits } = req.body;

  const data: any = { name, brand, description, price: Number(price), quantity: Number(quantity) };
  data.inStock = Number(quantity) > 0;
  if (benefits) data.benefits = Array.isArray(benefits) ? benefits : [benefits];
  if (files?.length) data.images = files.map((f) => f.path);

  const product = await prisma.product.update({ where: { id: req.params.id as string }, data });
  res.json(product);
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id as string} });
  res.json({ message: "Deleted" });
});

export default router;