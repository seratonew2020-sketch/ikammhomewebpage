// Vercel Serverless Function: /api/drive-folder (ดึงรูปทั้งหมดจากโฟลเดอร์ Google Drive บน Vercel โดยเรียงรูปล่าสุดขึ้นก่อนเสมอ)
const DEFAULT_DRIVE_FOLDER_ID = '1L3gDZl97NrkXJ4Wl1tPgb35wf8LzM820'

function extractDriveFolderId(input) {
  if (!input) return DEFAULT_DRIVE_FOLDER_ID
  const str = String(input).trim()
  const match = str.match(/\/folders\/([a-zA-Z0-9_-]+)/)
  if (match && match[1]) return match[1]
  return str
}

function parseDriveLastModified(rawText) {
  if (!rawText) return 0
  const text = String(rawText).replace(/[\u202f\u00a0]/g, ' ').trim()
  const now = new Date()

  // กรณีเป็นเวลาของวันนี้ เช่น "7:48 pm", "19:48" ➔ ถือเป็นไฟล์ใหม่ล่าสุดของวันนี้
  const timeMatch = text.match(/^(\d{1,2}):(\d{2})(?:\s*(am|pm))?$/i)
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10)
    const minutes = parseInt(timeMatch[2], 10)
    const ampm = timeMatch[3]?.toLowerCase()
    if (ampm === 'pm' && hours < 12) hours += 12
    if (ampm === 'am' && hours === 12) hours = 0
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0).getTime()
  }

  // กรณีเป็นเดือนและวัน เช่น "Nov 13"
  const withYear = /\b\d{4}\b/.test(text) ? text : `${text}, ${now.getFullYear()}`
  const parsed = Date.parse(withYear)
  if (!Number.isNaN(parsed)) return parsed

  const direct = Date.parse(text)
  return Number.isNaN(direct) ? 0 : direct
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const folderId = extractDriveFolderId(req.query?.folder || DEFAULT_DRIVE_FOLDER_ID)
    const embedUrl = `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(folderId)}#list`
    const response = await fetch(embedUrl)
    if (!response.ok) {
      throw new Error(`Google Drive folder responded with HTTP ${response.status}`)
    }
    const html = await response.text()
    const re = /id="entry-([a-zA-Z0-9_-]+)"[\s\S]*?<div class="flip-entry-title">([^<]+)<\/div>(?:[\s\S]*?<div class="flip-entry-last-modified"><div>([^<]*)<\/div><\/div>)?/g
    const files = []
    let m
    while ((m = re.exec(html)) !== null) {
      const fileId = m[1]
      const fileName = m[2].trim()
      const lastModified = (m[3] || '').replace(/[\u202f\u00a0]/g, ' ').trim()
      const modifiedTime = parseDriveLastModified(lastModified)
      files.push({
        id: fileId,
        name: fileName,
        lastModified,
        modifiedTime,
        directUrl: `https://lh3.googleusercontent.com/d/${fileId}=w1200`,
        thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
        viewUrl: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
      })
    }

    // เรียงรูปล่าสุดขึ้นก่อนเสมอ (Newest first)
    files.sort((a, b) => (b.modifiedTime || 0) - (a.modifiedTime || 0))

    return res.status(200).json({
      success: true,
      folderId,
      folderUrl: `https://drive.google.com/drive/folders/${folderId}`,
      count: files.length,
      files,
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
