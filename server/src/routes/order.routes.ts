import { Router } from "express";
import { adminOnly, AuthRequest, protect } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { sendOrderEmail } from "../lib/mailer.js";




const router = Router();

router.post("/", protect, async (req: AuthRequest, res) => {
  const { fullName, phone, email, location, items } = req.body;
  // items: [{ productId, quantity, price }]

  const totalPrice = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId: req.user!.id,
      fullName,
      phone,
      email,
      location,
      totalPrice,
      items: { create: items.map((i: any) => ({ productId: i.productId, quantity: i.quantity, price: i.price })) },
    },
    include: { items: { include: { product: true } } },
  });

  await sendOrderEmail(email, fullName, order.items[0]?.product.name ?? "your item", order.items[0]?.productId ?? "");
  res.status(201).json(order);
});

// router.get("/mine", protect, async (req: AuthRequest, res) => {
//   const orders = await prisma.order.findMany({
//     where: { userId: req.user!.id },
//     include: { items: { include: { product: true } } },
//     orderBy: { createdAt: "desc" },
//   });
//   res.json(orders);
// });

router.get("/mine", protect, async (req: AuthRequest, res) => {
  const { confirmed } = req.query;
  const orders = await prisma.order.findMany({
    where: {
      userId: req.user!.id,
      status: { not: "CANCELLED" },
      ...(confirmed !== undefined ? { isConfirmed: confirmed === "true" } : {}),
    },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
});

// router.delete("/:id", protect, async (req: AuthRequest, res) => {
//   const order = await prisma.order.findUnique({ where: { id: req.params.id as string } });
//   if (!order || order.userId !== req.user!.id) return res.status(403).json({ message: "Not allowed" });
//   await prisma.order.delete({ where: { id: req.params.id as string } });
//   res.json({ message: "Order cancelled" });
// });


router.delete("/:id", protect, async (req: AuthRequest, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id as string } });
  if (!order || order.userId !== req.user!.id) return res.status(403).json({ message: "Not allowed" });
  const updated = await prisma.order.update({ where: { id: req.params.id as string }, data: { status: "CANCELLED" } });
  res.json(updated);
});



// Admin
// router.get("/", protect, adminOnly, async (_req, res) => {
//   const orders = await prisma.order.findMany({
//     include: { items: { include: { product: true } }, user: true },
//     orderBy: { createdAt: "desc" },
//   });
//   res.json(orders);
// });


router.get("/", protect, adminOnly, async (req, res) => {
  const { search = "", sort } = req.query as any;

  const where: any = search
    ? {
        OR: [
          { id: { contains: search as string, mode: "insensitive" } },
          { phone: { contains: search as string, mode: "insensitive" } },
        ],
      }
    : {};

  let orderBy: any = { createdAt: "desc" };
  if (sort === "oldest") orderBy = { createdAt: "asc" };
  if (sort === "price_asc") orderBy = { totalPrice: "asc" };
  if (sort === "price_desc") orderBy = { totalPrice: "desc" };

  const orders = await prisma.order.findMany({
    where,
    include: { items: { include: { product: true } }, user: true },
    orderBy,
  });
  res.json(orders);
});



router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  const { status } = req.body; // PENDING | SHIPPED | DELIVERED
  const order = await prisma.order.update({ where: { id: req.params.id as string }, data: { status } });
  res.json(order);
});


// router.patch("/:id/confirm", protect, async (req: AuthRequest, res) => {
//   const order = await prisma.order.findUnique({ where: { id: req.params.id as string} });
//   if (!order || order.userId !== req.user!.id) return res.status(403).json({ message: "Not allowed" });
//   const updated = await prisma.order.update({ where: { id: req.params.id as string}, data: { isConfirmed: true } });
//   res.json(updated);
// });


router.patch("/:id/confirm", protect, async (req: AuthRequest, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id as string } });
  if (!order || order.userId !== req.user!.id) {
    return res.status(403).json({ message: "Not allowed" });
  }
  if (order.isConfirmed) {
    return res.status(400).json({ message: "Order already confirmed" });
  }

  const updated = await prisma.order.update({
    where: { id: req.params.id as string},
    data: { isConfirmed: true },
  });
  res.json(updated);
});


// router.get("/mine", protect, async (req: AuthRequest, res) => {
//   const { confirmed } = req.query;
//   const orders = await prisma.order.findMany({
//     where: {
//       userId: req.user!.id,
//       ...(confirmed !== undefined ? { isConfirmed: confirmed === "true" } : {}),
//     },
//     include: { items: { include: { product: true } } },
//     orderBy: { createdAt: "desc" },
//   });
//   res.json(orders);
// });




export default router;