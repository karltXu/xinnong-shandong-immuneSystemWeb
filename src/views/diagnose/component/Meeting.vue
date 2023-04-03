<template>
  <div>
    <div class="demo-app">
      <div class="demo-app-sidebar">
        <div class="demo-app-sidebar-section">
          <h2>说明：</h2>
          <ul>
            <li>请从右上角选择查看维度</li>
            <li>时间段支持拖拽选择</li>
            <li>绿色背景时间段已占用不可选择</li>
            <li>再次点击已经建好的日历可以删除</li>
          </ul>
        </div>

        <div class="demo-app-sidebar-section">
          <h2>请确认您选择的时间段：</h2>
          <ul>
            <li
              v-for="event in currentEvents"
              :key="event.id"
            >
              <template v-if="event.display != 'background'">
                <div>{{ event.startStr | dateFilter }} 至</div>
                <div>{{ event.endStr | dateFilter }}</div>
                <div v-if="event.title"><b>{{ event.title }}</b></div>
              </template>
            </li>
          </ul>
        </div>
        <div
          class="demo-app-sidebar-section"
          style="text-align: center;"
        >
          <a-button
            type="primary"
            @click="handleConfirm"
          >
            确认
          </a-button>
        </div>
      </div>
      <div class="demo-app-main">
        <FullCalendar
          ref="calendarRef"
          class="demo-app-calendar"
          :options="calendarOptions"
        >
          <template v-slot:eventContent="arg">
            <b>{{ arg.timeText }}</b>
            <i>{{ arg.event.title }}</i>
          </template>
        </FullCalendar>
      </div>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhCn from '@fullcalendar/core/locales/zh-cn'
import { createEventId } from './event-utils'
import { message } from 'ant-design-vue'
import { getMeetingDisable } from '@/api/diagnose'

export default {
    components: {
        FullCalendar
    },
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    data: function () {
        return {
            calendarOptions: {
                plugins: [
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin // needed for dateClick
                ],
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    // right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    right: 'timeGridWeek,timeGridDay'
                },
                validRange: {
                  start: '2022-06-01'
                },
                initialView: 'timeGridWeek',
                initialEvents: [], // alternatively, use the `events` setting to fetch from a feed
                editable: true,
                selectable: true,
                selectMirror: true,
                dayMaxEvents: true,
                weekends: true,
                select: this.handleDateSelect,
                eventClick: this.handleEventClick,
                eventsSet: this.handleEvents,
                // datesSet: this.handleDateSet,
                locale: zhCn,
                firstDay: 1,
                allDaySlot: false,
                nowIndicator: true
            },
            currentEvents: []
        }
    },
    filters: {
        dateFilter(val) {
            return val.substring(0, 10) + ' ' + val.substring(11, 16)
        }
    },
    mounted() {
        setTimeout(() => {
          this.$set(this.calendarOptions, 'datesSet', this.handleDateSet)
        }, 300)
    },
    methods: {
        handleDateSelect(selectInfo) {
            const _this = this
            // const title = prompt('请输入会诊名称：')
            const calendarApi = selectInfo.view.calendar
            calendarApi.unselect() // clear date selection

            calendarApi.addEvent({
                id: createEventId(),
                title: _this.title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay
            })
        },

        handleEventClick(clickInfo) {
            if (confirm(`确定要删除这条记录吗？ '${clickInfo.event.title}'`)) {
                clickInfo.event.remove()
            }
        },
        handleConfirm() {
            // const today = new Date().toISOString().substring(0, 10)
            const now = Math.floor(new Date().getTime() / 1000)
            const events = this.currentEvents.filter((item) => item.display !== 'background')
            // const selectedDate = events[0]?.startStr.substring(0, 10)
            let flag = false
            this.currentEvents.forEach((item) => {
                if (item.display === 'background') {
                    const c1 = events[0]?.startStr >= item.startStr && events[0].startStr < item.endStr
                    const c2 = events[0]?.endStr > item.startStr && events[0].endStr <= item.endStr
                    if (c1 || c2) {
                        flag = true
                    }
                }
            })
            const start = Math.floor(new Date(events[0]?.startStr).getTime() / 1000)
            const end = Math.floor(new Date(events[0]?.endStr).getTime() / 1000)

            if (events.length === 0) {
                message.error('添加时间段不能为空哟～')
            } else if (events.length > 1) {
                message.error('一次只能选择一个时间段哟～')
            } else if (start < now) {
                message.error('此时段已经过去了，无法接受预约～')
            } else if ((end - start) > this.meetingMaxDuration) {
                message.error(`选择时长不能大于${Math.floor(this.meetingMaxDuration / 3600)}小时哦～`)
            } else if (flag) {
                message.error('不可选择已占用时间段哟～')
            } else {
                const start = events[0].startStr.replace('T', ' ').replace('+08:00', '')
                const end = events[0].endStr.replace('T', ' ').replace('+08:00', '')
                this.$emit('close', start, end)
            }
        },
        handleEvents(events) {
            console.log(33, 'all event', events)
            this.currentEvents = events
        },
        handleApi(meetingStart, meetingEnd) {
            getMeetingDisable({
                meetingStart,
                meetingEnd
            }).then((res) => {
                this.meetingMaxDuration = res.data.meetingMaxDuration
                const calendarApi = this.$refs.calendarRef.getApi()
                const list = calendarApi.getEvents()
                list.forEach((item) => {
                    item.remove()
                })
                res.data.arranges.forEach((item) => {
                    calendarApi.addEvent(item)
                })
            })
        },
        handleDateSet(val) {
            const start = new Date(val.startStr).getTime() / 1000
            const end = new Date(val.endStr).getTime() / 1000
            this.handleApi(start, end)
        }
    }
}
</script>

<style lang='less' scoped>
/deep/h2 {
    margin: 0;
    font-size: 16px;
}

/deep/ul {
    margin: 0;
    padding: 0 0 0 1.5em;
}

/deep/li {
    margin: 1.5em 0;
    padding: 0;
}

/deep/b {
    /* used for event dates/times */
    margin-right: 3px;
}

/deep/.demo-app {
    display: flex;
    min-height: 100%;
    font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
    font-size: 14px;
}

/deep/.demo-app-sidebar {
    width: 200px;
    height: calc(100vh - 120px);
    overflow: auto;
    line-height: 1.5;
    background: #eaf9ff;
    border-right: 1px solid #d3e2e8;
}

/deep/.demo-app-sidebar-section {
    padding: 10px;
}

/deep/.demo-app-main {
    flex-grow: 1;
    padding: 3em;
}

/deep/.fc {
    /* the calendar root */
    max-width: 1100px;
    margin: 0 auto;
    max-height: calc(100vh - 205px);
}

/deep/.fc-col-header,
/deep/.fc-timegrid-body,
/deep/.fc-timegrid-body table {
  width: 100% !important;
}
</style>
