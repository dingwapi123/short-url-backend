import validator from "validator"
import URLRecord from "../models/urlRecordModel.js"
import { generateShortUrl } from "../utils/urlHelper.js"

// 创建短链记录
export async function createUrlRecord(req, res) {
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

  const urlRecord = await URLRecord.findOne({
    where: {
      originalUrl,
    },
  })

  if (urlRecord) {
    return res.status(200).json({
      message: "originalUrl already exists",
      data: urlRecord,
    })
  }

  // 如果用户传入了自定义短码，则进行唯一性检查
  if (urlCode) {
    // 查询数据库中是否已存在该短码
    const urlRecord = await URLRecord.findOne({
      where: {
        urlCode,
      },
    })
    // 若已存在，返回冲突错误
    if (urlRecord) {
      return res.status(200).json({
        message: "urlCode already exists",
      })
    }

    // 生成对应的短链（此处变量 shortUrl 未使用，后续可补充逻辑）
    const shortUrl = await generateShortUrl(urlCode)
    const createdUrlRecord = await URLRecord.create({
      id: Date.now(),
      originalUrl,
      urlCode,
      shortUrl,
      title,
      description,
      category,
    })

    return res.status(201).json({
      message: "urlRecord created successfully",
      data: createdUrlRecord,
    })
  }

  // 若未传入自定义短码，生成随机短码
  const shortUrl = await generateShortUrl()
  const createdUrlRecord = await URLRecord.create({
    id: Date.now(),
    originalUrl,
    shortUrl,
    urlCode: shortUrl.split("/").pop(),
    title,
    description,
    category,
  })

  return res.status(201).json({
    message: "urlRecord created successfully",
    data: createdUrlRecord,
  })
}

export async function getAllUrlRecord(req, res) {
  const urlRecords = await URLRecord.findAll()

  return res.status(200).json({
    message: "urlRecords found",
    data: urlRecords,
    total: urlRecords.length,
  })
}

// 删除短链
export async function deleteUrlRecord(req, res) {
  const { id } = req.params

  const record = await URLRecord.findByPk(id)
  if (!record) {
    return res.status(404).json({ message: "Record not found" })
  }

  await record.destroy()
  return res.status(200).json({ message: "Record deleted successfully" })
}

// 更新短链信息
export async function updateUrlRecord(req, res) {
  const { id } = req.params
  const { title, description, category, isActive } = req.body

  const record = await URLRecord.findByPk(id)
  if (!record) {
    return res.status(404).json({ message: "Record not found" })
  }

  // Only update allowed fields
  if (title !== undefined) record.title = title
  if (description !== undefined) record.description = description
  if (category !== undefined) record.category = category

  await record.save()

  return res.status(200).json({
    message: "Record updated successfully",
    data: record,
  })
}
