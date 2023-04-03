<template>
  <div>
    <a-alert
      message="请在右上角选择以‘日’查看维度，即可清楚查看某天的会议室预定详情"
      banner
    />
    <div class="demo-app">
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
import zhCn from '@fullcalendar/core/locales/zh-cn'
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
                plugins: [dayGridPlugin, timeGridPlugin],
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridWeek,timeGridDay'
                },
                validRange: {
                    start: '2022-06-01'
                },
                initialView: 'timeGridWeek',
                initialEvents: [],
                editable: true,
                selectable: true,
                selectMirror: true,
                dayMaxEvents: true,
                weekends: true,
                locale: zhCn,
                firstDay: 1,
                allDaySlot: false,
                datesSet: this.handleDateSet,
                eventClick: this.handleEventClick
            }
        }
    },
    methods: {
        handleEventClick(clickInfo) {
            console.log(11, clickInfo.event.id)
            this.$router.push(`/diagnose/consultation-detail/${clickInfo.event.id}`)
        },
        handleApi(meetingStart, meetingEnd) {
            getMeetingDisable({
                meetingStart,
                meetingEnd
            }).then((res) => {
                const calendarApi = this.$refs.calendarRef.getApi()
                const list = calendarApi.getEvents()
                list.forEach((item) => {
                    item.remove()
                })
                res.data.overview.forEach((item) => {
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
    max-width: 1500px;
    margin: 0 auto;
    max-height: 600px;
}
</style>
