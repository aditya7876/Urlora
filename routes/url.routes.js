import express from "express";
import {shortenUrlPostRequestBodySchema} from "../validation/request.validation.js";
import {eq, and} from "drizzle-orm";
import {db} from "../db/index.js";
import {urlsTable} from "../models/index.js";

import {nanoid} from "nanoid";

import {ensureAuthenticated} from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post('/shorten',ensureAuthenticated, async function (req, res) {

   

    const validationResult = await shortenUrlPostRequestBodySchema.safeParseAsync(req.body);

    if (validationResult.error){
        return res.status(400).json({ error: validationResult.error });
    }

    const { url, code } = validationResult.data;

    const shortCode = code ?? nanoid(6);

    const [result] = await db.insert(urlsTable).values({
        shortCode,
        targetUrl: url,
        userId: req.user.id,
    }).returning({id: urlsTable.id, shortCode: urlsTable.shortCode, targetUrl: urlsTable.targetUrl});

    return res.status(201).json({id: result.id, shortCode: result.shortCode, targetUrl: result.targetUrl});
});

router.get('/codes', ensureAuthenticated, async function (req, res) {
    const codes = await db.select().from(urlsTable).where(eq(urlsTable.userId, req.user.id));
    return res.json({ codes });
});

router.delete('/:id', ensureAuthenticated, async function (req, res) {
    const id = req.params.id;
    await db.delete(urlsTable).where(and(eq(urlsTable.id, id), eq(urlsTable.userId, req.user.id)));
    return res.status(200).json({ message: 'URL deleted successfully.' });
});

router.get("/:shortCode", async function (req, res) {
  const code = req.params.shortCode;
  const [result] = await db
    .select({
      targetUrl: urlsTable.targetUrl,
    })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, code));

  if (!result) {
    return res
      .status(404)
      .json({
        error: "Invalid short code. No URL found for the provided code.",
      });
  }

  return res.redirect(result.targetUrl);
});
export default router;