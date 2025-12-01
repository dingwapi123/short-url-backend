import { Request, Response } from "express"
import validator from "validator"
import { db } from "../db/index.js"
import { urlRecords } from "../db/schema.js"
import { eq, desc, count } from "drizzle-orm"
import { generateShortUrl } from "../utils/urlHelper.js"

// 创建短链记录
export async function createUrlRecord(req: Request, res: Response) {
  // 从请求体中解构出原始 URL 和自定义短码
  const { originalUrl, urlCode, title, description, category } = req.body

  // 校验原始 URL 是否为空
  if (!originalUrl) {
    return res.status(400).json({
      message: "originalUrl is required",
    })
  }

  // 校验原始 URL 格式是否合法
  if (!validator.isURL(originalUrl)) {
    return res.status(400).json({
      message: "originalUrl is not a valid url",
    })
  }

  const existingUrlRecord = await db.query.urlRecords.findFirst({
    where: eq(urlRecords.originalUrl, originalUrl),
  })

  if (existingUrlRecord) {
    return res.status(200).json({
      message: "originalUrl already exists",
      data: existingUrlRecord,
    })
  }

  // 如果用户传入了自定义短码，则进行唯一性检查
  if (urlCode) {
    // 查询数据库中是否已存在该短码
    const existingCodeRecord = await db.query.urlRecords.findFirst({
      where: eq(urlRecords.urlCode, urlCode),
    })
    // 若已存在，返回冲突错误
    if (existingCodeRecord) {
      return res.status(200).json({
        message: "urlCode already exists",
      })
    }

    // 生成对应的短链（此处变量 shortUrl 未使用，后续可补充逻辑）
    const shortUrl = await generateShortUrl(urlCode)

    const [createdUrlRecord] = await db
      .insert(urlRecords)
      .values({
        id: Date.now(), // Using Date.now() as ID to match original logic
        originalUrl,
        urlCode,
        shortUrl,
        title,
        description,
        category,
      })
      .returning()

    return res.status(201).json({
      message: "urlRecord created successfully",
      data: createdUrlRecord,
    })
  }

  // 若未传入自定义短码，生成随机短码
  const shortUrl = await generateShortUrl()
  const generatedUrlCode = shortUrl.split("/").pop()!

  const [createdUrlRecord] = await db
    .insert(urlRecords)
    .values({
      id: Date.now(),
      originalUrl,
      shortUrl,
      urlCode: generatedUrlCode,
      title,
      description,
      category,
    })
    .returning()

  return res.status(201).json({
    message: "urlRecord created successfully",
    data: createdUrlRecord,
  })
}

export async function getAllUrlRecord(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.pageSize as string) || 10
  const offset = (page - 1) * limit

  const [totalResult] = await db.select({ count: count() }).from(urlRecords)
  const totalCount = totalResult ? totalResult.count : 0

  const rows = await db.query.urlRecords.findMany({
    limit,
    offset,
    orderBy: [desc(urlRecords.createdAt)], // Show newest first by default
  })

  return res.status(200).json({
    message: "urlRecords found",
    data: rows,
    total: totalCount,
    page,
    pageSize: limit,
    totalPages: Math.ceil(totalCount / limit),
  })
}

// 删除短链
export async function deleteUrlRecord(req: Request, res: Response) {
  const { id } = req.params

  // Check if record exists
  const record = await db.query.urlRecords.findFirst({
    where: eq(urlRecords.id, Number(id)),
  })

  if (!record) {
    return res.status(404).json({ message: "Record not found" })
  }

  await db.delete(urlRecords).where(eq(urlRecords.id, Number(id)))
  return res.status(200).json({ message: "Record deleted successfully" })
}

// 更新短链信息
export async function updateUrlRecord(req: Request, res: Response) {
  const { id } = req.params
  const { title, description, category, urlCode } = req.body

  const record = await db.query.urlRecords.findFirst({
    where: eq(urlRecords.id, Number(id)),
  })

  if (!record) {
    return res.status(404).json({ message: "Record not found" })
  }

  const updateData: Partial<typeof urlRecords.$inferInsert> = {
    updatedAt: new Date(),
  }

  // Only update allowed fields
  if (title !== undefined) updateData.title = title
  if (description !== undefined) updateData.description = description
  if (category !== undefined) updateData.category = category

  // Update urlCode if provided and different
  if (urlCode !== undefined && urlCode !== record.urlCode) {
    if (!urlCode || !urlCode.trim()) {
      return res.status(400).json({ message: "urlCode cannot be empty" })
    }

    // Check if urlCode already exists
    const existingRecord = await db.query.urlRecords.findFirst({
      where: eq(urlRecords.urlCode, urlCode),
    })

    if (existingRecord) {
      return res.status(400).json({
        message: "urlCode already exists",
      })
    }

    updateData.urlCode = urlCode
    // Regenerate shortUrl
    updateData.shortUrl = await generateShortUrl(urlCode)
  }

  const [updatedRecord] = await db
    .update(urlRecords)
    .set(updateData)
    .where(eq(urlRecords.id, Number(id)))
    .returning()

  return res.status(200).json({
    message: "Record updated successfully",
    data: updatedRecord,
  })
}
