const express = require('express')
const cors = require('cors')
const { join } = require('path')
const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')

const app = express()
app.use(cors())
app.use(express.json())

const dataDir = process.env.DATA_DIR || join(__dirname, 'data')
const file = join(dataDir, 'db.json')
const adapter = new JSONFile(file)
const defaultData = {
  resources: [
    { id: 1, name: 'Python入门', type: '课件', teacher: '张老师', status: '已发布', downloads: 1250, health: 92, grade: '八年级', classes: 45 },
    { id: 2, name: 'Excel技巧', type: '视频', teacher: '李老师', status: '待审核', downloads: 980, health: 85, grade: '七年级', classes: 38 },
    { id: 3, name: '网络安全', type: '题库', teacher: '王老师', status: '已发布', downloads: 756, health: 78, grade: '九年级', classes: 32 }
  ],
  classifications: [
    { id: 1, label: '课件', parent_id: 0, children: [{ id: 11, label: 'PPT' }, { id: 12, label: 'Word' }] },
    { id: 2, label: '视频', parent_id: 0, children: [{ id: 21, label: 'MP4' }] },
    { id: 3, label: '题库', parent_id: 0 },
    { id: 4, label: '工具', parent_id: 0 }
  ],
  users: [{ id: 1, username: 'admin', password: 'admin123', role: 'admin' }],
  logs: [{ id: 1, user: 'admin', action: '登录', module: '系统', detail: '登录成功', time: new Date().toISOString() }]
}

let db
async function initDb() {
  const { mkdir } = require('fs/promises')
  await mkdir(dataDir, { recursive: true }).catch(() => {})
  db = new Low(adapter, defaultData)
  await db.read()
  db.data ||= defaultData
  await db.write()
}

app.get('/api/dashboard', (req, res) => {
  try {
    const resources = db.data.resources || []
    const total = resources.length
    const byType = {}
    resources.forEach(r => { byType[r.type] = (byType[r.type] || 0) + 1 })
    const formatData = Object.entries(byType).map(([name, count]) => ({ name, value: Math.round(count / total * 100) || 1 }))
    const pending = resources.filter(r => r.status === '待审核').length
    const totalDownloads = resources.reduce((s, r) => s + (r.downloads || 0), 0)
    const topResources = [...resources].sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 5)
    const gradeVisitData = [
      { grade: '六年级', count: 320 },
      { grade: '七年级', count: 450 },
      { grade: '八年级', count: 580 },
      { grade: '九年级', count: 420 }
    ]
    res.json({
      totalResources: total,
      formatData: formatData.length ? formatData : [{ name: '课件', value: 42 }, { name: '视频', value: 28 }, { name: '题库', value: 15 }, { name: '工具', value: 10 }],
      newThisMonth: 235,
      totalDownloads,
      pendingCount: pending,
      topResources: topResources.map(r => ({ name: r.name, teacher: r.teacher, downloads: r.downloads, grade: r.grade || '八年级' })),
      gradeVisitData,
      trendMonths: ['8月', '9月', '10月', '11月', '12月', '1月'],
      uploadTrend: [120, 145, 168, 192, 210, 235],
      downloadTrend: [850, 920, 1050, 1180, 1320, 1480],
      auditTimeData: [{ type: '待审核', time: 2.5 }, { type: '审核中', time: 1.8 }, { type: '已通过', time: 0.5 }, { type: '已驳回', time: 0.3 }],
      radarData: [
        { name: 'Python编程', value: [85, 72, 90, 68, 78] },
        { name: 'Excel操作', value: [72, 88, 75, 82, 70] },
        { name: '网络安全', value: [68, 65, 88, 75, 82] },
        { name: 'Scratch', value: [90, 78, 70, 85, 88] },
        { name: 'PPT设计', value: [75, 82, 78, 72, 85] }
      ]
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/resources', (req, res) => {
  try {
    res.json(db.data.resources || [])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/resources', (req, res) => {
  try {
    const { name, type, teacher, status, grade } = req.body
    const id = Math.max(0, ...(db.data.resources || []).map(r => r.id)) + 1
    const item = { id, name: name || '新资源', type: type || '课件', teacher: teacher || '未知', status: status || '待审核', grade: grade || '', downloads: 0, health: 80, classes: 0 }
    db.data.resources = db.data.resources || []
    db.data.resources.push(item)
    db.write()
    res.json({ id })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.put('/api/resources/:id', (req, res) => {
  try {
    const idx = (db.data.resources || []).findIndex(r => String(r.id) === String(req.params.id))
    if (idx >= 0) {
      const { name, type, teacher, status } = req.body
      Object.assign(db.data.resources[idx], { name, type, teacher, status })
      db.write()
    }
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.delete('/api/resources/:id', (req, res) => {
  try {
    db.data.resources = (db.data.resources || []).filter(r => String(r.id) !== String(req.params.id))
    db.write()
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/statistics', (req, res) => {
  try {
    const resources = db.data.resources || []
    const byType = {}
    resources.forEach(r => { byType[r.type] = (byType[r.type] || 0) + (r.downloads || 0) })
    const subjectDownloadTop = Object.entries(byType).map(([subject, count]) => ({ subject, count })).sort((a, b) => b.count - a.count).slice(0, 10)
    res.json({
      subjectDownloadTop: subjectDownloadTop.length ? subjectDownloadTop : [{ subject: '信息技术', count: 1250 }, { subject: '数学', count: 980 }],
      funnelData: [{ name: '曝光', value: 10000 }, { name: '点击', value: 6500 }, { name: '下载', value: 3200 }, { name: '使用', value: 2100 }],
      teacherRank: [{ name: '张老师', uploads: 45, passRate: 92, usageRate: 88 }, { name: '李老师', uploads: 38, passRate: 95, usageRate: 82 }],
      top50List: resources.slice(0, 50)
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/classifications', (req, res) => {
  try {
    const list = db.data.classifications || []
    res.json(list.length ? list : defaultData.classifications)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/users', (req, res) => {
  try {
    res.json((db.data.users || []).map(({ id, username, role }) => ({ id, username, role })))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body || {}
    const user = (db.data.users || []).find(u => u.username === username && u.password === password)
    if (user) {
      db.data.logs = db.data.logs || []
      db.data.logs.push({ id: Date.now(), user: username, action: '登录', module: '系统', detail: '登录成功', time: new Date().toISOString() })
      db.write()
      res.json({ success: true, user: { username: user.username, role: user.role } })
    } else {
      res.status(401).json({ success: false, message: '用户名或密码错误' })
    }
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/logs', (req, res) => {
  try {
    const list = (db.data.logs || []).slice(-100).reverse()
    res.json(list.map(r => ({ user: r.user, action: r.action, module: r.module, detail: r.detail, time: r.time })))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

const PORT = process.env.PORT || 3000
initDb().then(() => {
  app.listen(PORT, () => console.log('Server on port', PORT))
}).catch(err => {
  console.error('DB init failed', err)
  process.exit(1)
})
