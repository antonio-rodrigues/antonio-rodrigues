import { toPng } from 'html-to-image'

/**
 * iCalendar (.ics) Export
 */
export function exportToICS(markedDays: string[], year: number, t: (key: string) => string) {
  if (markedDays.length === 0) return

  const sortedDays = [...markedDays].sort()
  const events: { start: string; end: string }[] = []

  let currentStart = sortedDays[0]
  let prevDate = new Date(currentStart)

  for (let i = 1; i <= sortedDays.length; i++) {
    const currentDateStr = sortedDays[i]
    const currentDate = currentDateStr ? new Date(currentDateStr) : null
    
    const nextDay = new Date(prevDate)
    nextDay.setDate(nextDay.getDate() + 1)

    if (!currentDate || currentDate.getTime() !== nextDay.getTime()) {
      // Gap found or end of list, close current event
      // DTEND in iCal is exclusive, so we add one day to the last date of the block
      const endDate = new Date(prevDate)
      endDate.setDate(endDate.getDate() + 1)
      
      events.push({
        start: currentStart.replace(/-/g, ''),
        end: endDate.toISOString().split('T')[0].replace(/-/g, '')
      })
      
      if (currentDateStr) {
        currentStart = currentDateStr
      }
    }
    
    if (currentDate) {
      prevDate = currentDate
    }
  }

  const calendarRows = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Portugal Holiday Planner//EN',
    ...events.flatMap(event => [
      'BEGIN:VEVENT',
      `UID:${event.start}-${event.end}@holidayplanner.pt`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${event.start}`,
      `DTEND;VALUE=DATE:${event.end}`,
      `SUMMARY:${t('app.title')} - Vacation`,
      'END:VEVENT'
    ]),
    'END:VCALENDAR'
  ]

  downloadFile(calendarRows.join('\r\n'), `vacations_${year}.ics`, 'text/calendar')
}

/**
 * Visual Export (PNG)
 */
export async function exportToImage(elementId: string, filename: string) {
  const element = document.getElementById(elementId)
  if (!element) return

  try {
    const dataUrl = await toPng(element, {
      backgroundColor: '#f8fafc', // match slate-50
      style: {
        padding: '20px'
      }
    })
    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Error exporting image:', error)
  }
}

/**
 * JSON Export/Import
 */
export function exportToJSON(data: any, filename: string) {
  const json = JSON.stringify(data, null, 2)
  downloadFile(json, filename, 'application/json')
}

export function importFromJSON(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        resolve(data)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

/**
 * Helper to download content as file
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
