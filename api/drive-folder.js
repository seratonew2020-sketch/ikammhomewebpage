// Vercel Serverless Function: /api/drive-folder (ดึงรูปทั้งหมดจากโฟลเดอร์ Google Drive บน Vercel)
const DEFAULT_DRIVE_FOLDER_ID = '1L3gDZl97NrkXJ4Wl1tPgb35wf8LzM820'

function extractDriveFolderId(input) {
  if (!input) return DEFAULT_DRIVE_FOLDER_ID
  const str = String(input).trim()
  const match = str.match(/\/folders\/([a-zA-Z0-9_-]+)/)
  if (match && match[1]) return match[1]
  return str
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
    const re = /id="entry-([a-zA-Z0-9_-]+)"[\s\S]*?<div class="flip-entry-title">([^<]+)<\/div>/g
    const files = []
    let m
    while ((m = re.exec(html)) !== null) {
      const fileId = m[1]
      const fileName = m[2].trim()
      files.push({
        id: fileId,
        name: fileName,
        directUrl: `https://lh3.googleusercontent.com/d/${fileId}=w1200`,
        thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
        viewUrl: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
      })
    }

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
