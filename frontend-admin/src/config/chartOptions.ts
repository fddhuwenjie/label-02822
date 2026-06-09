import type { EChartsOption } from 'echarts'

interface GradeVisitItem {
  grade: string
  count: number
}

export const createGradeVisitOption = (data: GradeVisitItem[]): EChartsOption => ({
  grid: { left: 50, right: 30, top: 20, bottom: 50 },
  xAxis: { type: 'category', data: data.map(d => d.grade) },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: data.map(d => d.count), itemStyle: { color: '#409eff' } }],
  tooltip: { trigger: 'axis' }
})

interface TrendData {
  trendMonths: string[]
  uploadTrend: number[]
  downloadTrend: number[]
}

export const createTrendOption = ({ trendMonths, uploadTrend, downloadTrend }: TrendData): EChartsOption => ({
  grid: { left: 60, right: 60, top: 40, bottom: 80 },
  legend: { data: ['上传量', '下载量'], bottom: 20 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: trendMonths || [] },
  yAxis: [
    { type: 'value', name: '上传量' },
    { type: 'value', name: '下载量' }
  ],
  series: [
    { name: '上传量', type: 'line', data: uploadTrend || [], smooth: true },
    { name: '下载量', type: 'line', yAxisIndex: 1, data: downloadTrend || [], smooth: true }
  ]
})

interface FormatItem {
  name: string
  value: number
}

export const createPieOption = (data: FormatItem[]): EChartsOption => ({
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', right: 20, top: 'center', itemGap: 16 },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['40%', '50%'],
    data,
    label: { show: true, formatter: '{b}: {d}%' },
    avoidLabelOverlap: true
  }]
})

interface AuditTimeItem {
  type: string
  time: number
}

export const createAuditOption = (data: AuditTimeItem[]): EChartsOption => ({
  grid: { left: 60, right: 30, top: 30, bottom: 60 },
  xAxis: { type: 'category', data: data.map(d => d.type) },
  yAxis: { type: 'value', name: '平均时长(小时)' },
  series: [{ type: 'bar', data: data.map(d => d.time), itemStyle: { color: '#67c23a' } }],
  tooltip: { trigger: 'axis' }
})

interface RadarItem {
  name: string
  value: number[]
}

export const createRadarOption = (data: RadarItem[]): EChartsOption => ({
  grid: { left: 80, right: 80, top: 40, bottom: 80 },
  legend: { data: data.map(d => d.name), bottom: 20 },
  radar: {
    indicator: [
      { name: '六年级', max: 100 },
      { name: '七年级', max: 100 },
      { name: '八年级', max: 100 },
      { name: '九年级', max: 100 },
      { name: '高一', max: 100 }
    ]
  },
  series: [{ type: 'radar', data }]
})
