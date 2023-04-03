
import { getMeetingDisable } from '@/api/diagnose'
let eventGuid = 0
// const todayStr = new Date().toISOString().replace(/T.*$/, '')

function init() {
  const meetingStart = new Date('2022-6-13').getTime() / 1000
  const meetingEnd = new Date('2022-6-19').getTime() / 1000
  getMeetingDisable({
    meetingStart,
    meetingEnd
  }).then(res => {
    return res.data.arranges
  })
}

export const INITIAL_EVENTS = init()

// export const INITIAL_EVENTS = [
//   {
//     id: createEventId(),
//     title: '不可选',
//     start: todayStr + ' 12:00:00',
//     end: todayStr + ' 14:00:00',
//     display: 'background'
//   }
// ]

export function createEventId() {
  return String(eventGuid++)
}
