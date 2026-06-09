import type { EChartsOption } from 'echarts'

export interface FormatDataItem {
  name: string
  value: number
}

export interface TopResource {
  name: string
  teacher: string
  downloads: number
  grade: string
}

export interface GradeVisitItem {
  grade: string
  count: number
}

export interface AuditTimeItem {
  type: string
  time: number
}

export interface RadarSeriesItem {
  name: string
  value: number[]
}

export interface DashboardData {
  totalResources?: number
  newThisMonth?: number
  totalDownloads?: number
  pendingCount?: number
  formatData?: FormatDataItem[]
  topResources?: TopResource[]
  gradeVisitData?: GradeVisitItem[]
  trendMonths?: string[]
  uploadTrend?: number[]
  downloadTrend?: number[]
  auditTimeData?: AuditTimeItem[]
  radarData?: RadarSeriesItem[]
}

export function createGradeVisitOption(data: GradeVisitItem[]): EChartsOption {
  return {
    grid: { left: 50, right: 30, top: 20, bottom: 50 },
    xAxis: { type: 'category', data: data.map(d => d.grade) },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: data.map(d => d.count), itemStyle: { color: '#409eff' } }],
    tooltip: { trigger: 'axis' }
  }
}

export function createTrendOption(months: string[], uploadTrend: number[], downloadTrend: number[]): EChartsOption {
  return {
    grid: { left: 60, right: 60, top: 40, bottom: 80 },
    legend: { data: ['上传量', '下载量'], bottom: 20 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: months || [] },
    yAxis: [
      { type: 'value', name: '上传量' },
      { type: 'value', name: '下载量' }
    ],
    series: [
      { name: '上传量', type: 'line', data: uploadTrend || [], smooth: true },
      { name: '下载量', type: 'line', yAxisIndex: 1, data: downloadTrend || [], smooth: true }
    ]
  }
}

export function createPieOption(data: FormatDataItem[]): EChartsOption {
  return {
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
  }
}

export function createAuditOption(data: AuditTimeItem[]): EChartsOption {
  return {
    grid: { left: 60, right: 30, top: 30, bottom: 60 },
    xAxis: { type: 'category', data: data.map(d => d.type) },
    yAxis: { type: 'value', name: '平均时长(小时)' },
    series: [{ type: 'bar', data: data.map(d => d.time), itemStyle: { color: '#67c23a' } }],
    tooltip: { trigger: 'axis' }
  }
}

export function createRadarOption(data: RadarSeriesItem[]): EChartsOption {
  return {
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
  }
}
