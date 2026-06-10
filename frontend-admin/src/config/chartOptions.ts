import type { EChartsOption } from 'echarts'

export interface GradeVisitItem {
  grade: string
  count: number
}

export interface TrendData {
  months: string[]
  uploadData: number[]
  downloadData: number[]
}

export interface PieDataItem {
  name: string
  value: number
}

export interface AuditTimeItem {
  type: string
  time: number
}

export interface RadarDataItem {
  name: string
  value: number[]
}

export const getGradeChartOption = (data: GradeVisitItem[]): EChartsOption => ({
  grid: { left: 50, right: 30, top: 20, bottom: 50 },
  xAxis: { type: 'category', data: data.map(d => d.grade) },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: data.map(d => d.count), itemStyle: { color: '#409eff' } }],
  tooltip: { trigger: 'axis' }
})

export const getTrendChartOption = (data: TrendData): EChartsOption => ({
  grid: { left: 60, right: 60, top: 40, bottom: 80 },
  legend: { data: ['上传量', '下载量'], bottom: 20 },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: data.months || [] },
  yAxis: [
    { type: 'value', name: '上传量' },
    { type: 'value', name: '下载量' }
  ],
  series: [
    { name: '上传量', type: 'line', data: data.uploadData || [], smooth: true },
    { name: '下载量', type: 'line', yAxisIndex: 1, data: data.downloadData || [], smooth: true }
  ]
})

export const getPieChartOption = (data: PieDataItem[]): EChartsOption => ({
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', right: 20, top: 'center', itemGap: 16 },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['40%', '50%'],
    data: data,
    label: { show: true, formatter: '{b}: {d}%' },
    avoidLabelOverlap: true
  }]
})

export const getAuditChartOption = (data: AuditTimeItem[]): EChartsOption => ({
  grid: { left: 60, right: 30, top: 30, bottom: 60 },
  xAxis: { type: 'category', data: data.map(d => d.type) },
  yAxis: { type: 'value', name: '平均时长(小时)' },
  series: [{ type: 'bar', data: data.map(d => d.time), itemStyle: { color: '#67c23a' } }],
  tooltip: { trigger: 'axis' }
})

export const getRadarChartOption = (data: RadarDataItem[]): EChartsOption => ({
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
  series: [{ type: 'radar', data: data }]
})
