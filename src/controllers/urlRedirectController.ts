import { Request, Response } from "express";
import { db } from "../db/index.js";
import { urlRecords } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";

export async function getOriginURL(req: Request, res: Response) {
  const { urlCode } = req.params;

  if (!urlCode) {
    return res.status(400).json({
      message: "urlCode is required",
    });
  }
  
  const urlRecord = await db.query.urlRecords.findFirst({
    where: eq(urlRecords.urlCode, urlCode),
  });

  if (!urlRecord) {
    return res.status(404).json({
      message: "urlCode not found",
    });
  }

  // Increment visit count
  await db.update(urlRecords)
    .set({ 
        visitCount: sql`${urlRecords.visitCount} + 1`,
        updatedAt: new Date()
    })
    .where(eq(urlRecords.id, urlRecord.id));

  return res.status(200).json({
    message: "success",
    data: urlRecord.originalUrl,
  });
}
