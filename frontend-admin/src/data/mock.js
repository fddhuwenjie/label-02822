// 模拟数据 - 供各模块使用

export const resourceFormatData = [
  { name: '课件', value: 42 },
  { name: '视频', value: 28 },
  { name: '题库', value: 15 },
  { name: '工具', value: 10 },
  { name: '其他', value: 5 }
]

export const topResources = [
  { name: 'Python入门教程', teacher: '张老师', downloads: 1250, grade: '八年级' },
  { name: 'Excel操作技巧', teacher: '李老师', downloads: 980, grade: '七年级' },
  { name: '网络安全基础', teacher: '王老师', downloads: 756, grade: '九年级' },
  { name: 'Scratch编程', teacher: '赵老师', downloads: 632, grade: '六年级' },
  { name: 'PPT设计规范', teacher: '刘老师', downloads: 520, grade: '八年级' }
]

export const gradeVisitData = [
  { grade: '六年级', count: 320 },
  { grade: '七年级', count: 450 },
  { grade: '八年级', count: 580 },
  { grade: '九年级', count: 420 }
]

export const trendMonths = ['8月', '9月', '10月', '11月', '12月', '1月']
export const uploadTrend = [120, 145, 168, 192, 210, 235]
export const downloadTrend = [850, 920, 1050, 1180, 1320, 1480]

export const auditTimeData = [
  { type: '待审核', time: 2.5 },
  { type: '审核中', time: 1.8 },
  { type: '已通过', time: 0.5 },
  { type: '已驳回', time: 0.3 }
]

export const radarData = [
  { name: 'Python编程', value: [85, 72, 90, 68, 78] },
  { name: 'Excel操作', value: [72, 88, 75, 82, 70] },
  { name: '网络安全', value: [68, 65, 88, 75, 82] },
  { name: 'Scratch', value: [90, 78, 70, 85, 88] },
  { name: 'PPT设计', value: [75, 82, 78, 72, 85] }
]

export const subjectDownloadTop = [
  { subject: '信息技术', count: 1250 },
  { subject: '数学', count: 980 },
  { subject: '语文', count: 756 },
  { subject: '英语', count: 632 },
  { subject: '物理', count: 520 }
]

export const heatmapData = [
  [0, 0, 45], [0, 1, 32], [0, 2, 28], [0, 3, 55],
  [1, 0, 38], [1, 1, 42], [1, 2, 68], [1, 3, 72],
  [2, 0, 55], [2, 1, 62], [2, 2, 88], [2, 3, 95],
  [3, 0, 28], [3, 1, 35], [3, 2, 42], [3, 3, 58]
]

export const funnelData = [
  { name: '曝光', value: 10000 },
  { name: '点击', value: 6500 },
  { name: '下载', value: 3200 },
  { name: '使用', value: 2100 }
]

export const teacherRank = [
  { name: '张老师', uploads: 45, passRate: 92, usageRate: 88 },
  { name: '李老师', uploads: 38, passRate: 95, usageRate: 82 },
  { name: '王老师', uploads: 32, passRate: 88, usageRate: 75 }
]

export const resourceList = [
  { id: 1, name: 'Python入门', type: '课件', teacher: '张老师', status: '已发布', downloads: 1250, health: 92 },
  { id: 2, name: 'Excel技巧', type: '视频', teacher: '李老师', status: '待审核', downloads: 980, health: 85 },
  { id: 3, name: '网络安全', type: '题库', teacher: '王老师', status: '已发布', downloads: 756, health: 78 }
]

export const categoryTree = [
  { id: 1, label: '课件', children: [
    { id: 11, label: 'PPT' },
    { id: 12, label: 'Word' }
  ]},
  { id: 2, label: '视频', children: [
    { id: 21, label: 'MP4' },
    { id: 22, label: 'WebM' }
  ]},
  { id: 3, label: '题库' },
  { id: 4, label: '工具' }
]

export const roleList = [
  { id: 1, name: '超级管理员', permissions: ['全部'] },
  { id: 2, name: '资源管理员', permissions: ['上传', '审核', '编辑'] },
  { id: 3, name: '学科教师', permissions: ['上传', '编辑'] }
]
