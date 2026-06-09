import type { EChartsOption } from 'echarts'

export interface GradeVisitDataItem {
  grade: string
  count: number
}

export interface TrendChartData {
  trendMonths: string[]
  uploadTrend: number[]
  downloadTrend: number[]
}

export interface PieChartDataItem {
  name: string
  value: number
}

export interface AuditTimeDataItem {
  type: string
  time: number
}

export interface RadarDataItem {
  name: string
  value: number[]
}

export function getGradeChartOption(gradeVisitData: GradeVisitDataItem[] = []): EChartsOption {
  return {
    grid: { left: 50, right: 30, top: 20, bottom: 50 },
    xAxis: { type: 'category', data: gradeVisitData.map(d => d.grade) },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: gradeVisitData.map(d => d.count), itemStyle: { color: '#409eff' } }],
    tooltip: { trigger: 'axis' }
  }
}

export function getTrendChartOption(
  trendMonths: string[] = [],
  uploadTrend: number[] = [],
  downloadTrend: number[] = []
): EChartsOption {
  return {
    grid: { left: 60, right: 60, top: 40, bottom: 80 },
    legend: { data: ['上传量', '下载量'], bottom: 20 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: trendMonths },
    yAxis: [
      { type: 'value', name: '上传量' },
      { type: 'value', name: '下载量' }
    ],
    series: [
      { name: '上传量', type: 'line', data: uploadTrend, smooth: true },
      { name: '下载量', type: 'line', yAxisIndex: 1, data: downloadTrend, smooth: true }
    ]
  }
}

export function getPieChartOption(resourceFormatData: PieChartDataItem[] = []): EChartsOption {
  return {
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', right: 20, top: 'center', itemGap: 16 },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      data: resourceFormatData,
      label: { show: true, formatter: '{b}: {d}%' },
      avoidLabelOverlap: true
    }]
  }
}

export function getAuditChartOption(auditTimeData: AuditTimeDataItem[] = []): EChartsOption {
  return {
    grid: { left: 60, right: 30, top: 30, bottom: 60 },
    xAxis: { type: 'category', data: auditTimeData.map(d => d.type) },
    yAxis: { type: 'value', name: '平均时长(小时)' },
    series: [{ type: 'bar', data: auditTimeData.map(d => d.time), itemStyle: { color: '#67c23a' } }],
    tooltip: { trigger: 'axis' }
  }
}

export function getRadarChartOption(radarData: RadarDataItem[] = []): EChartsOption {
  return {
    grid: { left: 80, right: 80, top: 40, bottom: 80 },
    legend: { data: radarData.map(d => d.name), bottom: 20 },
    radar: {
      indicator: [
        { name: '六年级', max: 100 },
        { name: '七年级', max: 100 },
        { name: '八年级', max: 100 },
        { name: '九年级', max: 100 },
        { name: '高一', max: 100 }
      ]
    },
    series: [{ type: 'radar', data: radarData }]
  }
}
