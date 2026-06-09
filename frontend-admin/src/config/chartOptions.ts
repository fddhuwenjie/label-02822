import type { EChartsCoreOption } from 'echarts'

export interface FormatItem {
  name: string
  value: number
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

/** 近30天各年级资源访问量（柱状图） */
export const buildGradeVisitOption = (data: GradeVisitItem[]): EChartsCoreOption => ({
  grid: { left: 50, right: 30, top: 20, bottom: 50 },
  xAxis: { type: 'category', data: data.map(d => d.grade) },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'bar',
      data: data.map(d => d.count),
      itemStyle: { color: '#409eff' }
    }
  ],
  tooltip: { trigger: 'axis' }
})

/** 近6个月资源上传量/下载量（折线图，双 Y 轴） */
export const buildTrendOption = (
  months: string[],
  uploadTrend: number[],
  downloadTrend: number[]
): EChartsCoreOption => ({
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
    {
      name: '下载量',
      type: 'line',
      yAxisIndex: 1,
      data: downloadTrend || [],
      smooth: true
    }
  ]
})

/** 资源类型占比（环形饼图） */
export const buildPieOption = (data: FormatItem[]): EChartsCoreOption => ({
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', right: 20, top: 'center', itemGap: 16 },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      data,
      label: { show: true, formatter: '{b}: {d}%' },
      avoidLabelOverlap: true
    }
  ]
})

/** 资源审核时效（柱状图） */
export const buildAuditOption = (data: AuditTimeItem[]): EChartsCoreOption => ({
  grid: { left: 60, right: 30, top: 30, bottom: 60 },
  xAxis: { type: 'category', data: data.map(d => d.type) },
  yAxis: { type: 'value', name: '平均时长(小时)' },
  series: [
    {
      type: 'bar',
      data: data.map(d => d.time),
      itemStyle: { color: '#67c23a' }
    }
  ],
  tooltip: { trigger: 'axis' }
})

/** 各年级知识点资源覆盖度（雷达图） */
export const buildRadarOption = (data: RadarSeriesItem[]): EChartsCoreOption => ({
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
