<script setup lang="ts">
import {
  DatePickerArrow,
  DatePickerCalendar,
  DatePickerCell,
  DatePickerCellTrigger,
  DatePickerContent,
  DatePickerField,
  DatePickerGrid,
  DatePickerGridBody,
  DatePickerGridHead,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerHeader,
  DatePickerHeading,
  DatePickerInput,
  DatePickerNext,
  DatePickerPrev,
  DatePickerRoot,
  DatePickerTrigger,
} from 'reka-ui'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { computed, watch } from 'vue'
import { parseDate, getLocalTimeZone, today, CalendarDate } from '@internationalized/date'

const props = defineProps<{
  modelValue?: Date | null | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
}>()

// Watch for modelValue changes from parent
watch(
  () => props.modelValue,
  (newValue) => {
    console.log('DatePicker received new modelValue:', newValue)
  },
  { immediate: true },
)

// Helper function to convert JS Date to CalendarDate
const jsDateToCalendarDate = (date: Date): CalendarDate => {
  // Ensure we use the local date components, not UTC
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // getMonth() returns 0-11
  const day = date.getDate()

  return parseDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
}

// Helper function to convert CalendarDate to JS Date
const calendarDateToJsDate = (calendarDate: CalendarDate): Date => {
  return calendarDate.toDate(getLocalTimeZone())
}

const dateValue = computed({
  get(): CalendarDate | undefined {
    if (props.modelValue && props.modelValue instanceof Date) {
      try {
        const calDate = jsDateToCalendarDate(props.modelValue)
        return calDate
      } catch (error) {
        console.error('Error converting date:', error)
        return undefined
      }
    }
    return undefined
  },
  set(val: CalendarDate | undefined) {
    if (val) {
      try {
        const jsDate = calendarDateToJsDate(val)
        emit('update:modelValue', jsDate)
      } catch (error) {
        console.error('Error converting calendar date:', error)
        emit('update:modelValue', null)
      }
    } else {
      emit('update:modelValue', null)
    }
  },
})
</script>

<template>
  <div class="flex flex-col gap-2 text-sm">
    <DatePickerRoot id="birthday" v-model="dateValue" :max-value="today(getLocalTimeZone())">
      <DatePickerField
        v-slot="{ segments }"
        class="w-full flex select-none bg-white dark:bg-gray-800 items-center rounded-lg shadow-sm text-center justify-between border border-input p-1.5 data-[invalid]:border-red-500 min-h-[40px]"
      >
        <div class="flex items-center flex-1">
          <template v-for="item in segments" :key="item.part">
            <DatePickerInput
              v-if="item.part === 'literal'"
              :part="item.part"
              class="text-foreground"
            >
              {{ item.value }}
            </DatePickerInput>
            <DatePickerInput
              v-else
              :part="item.part"
              class="rounded p-0.5 focus:outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-muted-foreground text-foreground min-w-[2ch] text-center"
            >
              {{ item.value }}
            </DatePickerInput>
          </template>
        </div>

        <DatePickerTrigger
          class="focus:shadow-[0_0_0_2px] rounded focus:shadow-black text-foreground p-1"
        >
          <CalendarIcon :size="16" />
        </DatePickerTrigger>
      </DatePickerField>

      <DatePickerContent
        :side-offset="4"
        class="rounded-xl bg-background border shadow-lg will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade z-50"
      >
        <DatePickerArrow class="fill-background stroke-border" />
        <DatePickerCalendar v-slot="{ weekDays, grid }" class="p-4">
          <DatePickerHeader class="flex items-center justify-between">
            <DatePickerPrev
              class="inline-flex items-center cursor-pointer text-foreground justify-center rounded-md bg-transparent w-7 h-7 hover:bg-muted active:scale-98 active:transition-all focus:shadow-[0_0_0_2px] focus:shadow-black"
            >
              <ChevronLeft class="w-4 h-4" />
            </DatePickerPrev>

            <DatePickerHeading class="text-foreground font-medium" />

            <DatePickerNext
              class="inline-flex items-center cursor-pointer text-foreground justify-center rounded-md bg-transparent w-7 h-7 hover:bg-muted active:scale-98 active:transition-all focus:shadow-[0_0_0_2px] focus:shadow-black"
            >
              <ChevronRight class="w-4 h-4" />
            </DatePickerNext>
          </DatePickerHeader>

          <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <DatePickerGrid
              v-for="month in grid"
              :key="month.value.toString()"
              class="w-full border-collapse select-none space-y-1"
            >
              <DatePickerGridHead>
                <DatePickerGridRow class="mb-1 flex w-full justify-between">
                  <DatePickerHeadCell
                    v-for="day in weekDays"
                    :key="day"
                    class="w-8 rounded-md text-xs text-muted-foreground font-medium"
                  >
                    {{ day }}
                  </DatePickerHeadCell>
                </DatePickerGridRow>
              </DatePickerGridHead>

              <DatePickerGridBody>
                <DatePickerGridRow
                  v-for="(weekDates, index) in month.rows"
                  :key="`weekDate-${index}`"
                  class="flex w-full"
                >
                  <DatePickerCell
                    v-for="weekDate in weekDates"
                    :key="weekDate.toString()"
                    :date="weekDate"
                  >
                    <DatePickerCellTrigger
                      :day="weekDate"
                      :month="month.value"
                      class="relative flex items-center justify-center whitespace-nowrap rounded-[9px] border border-transparent bg-transparent text-sm font-normal text-foreground w-8 h-8 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black hover:border-primary data-[selected]:bg-primary data-[selected]:font-medium data-[outside-view]:text-muted-foreground/50 data-[selected]:text-primary-foreground data-[unavailable]:pointer-events-none data-[unavailable]:text-muted-foreground/50 data-[unavailable]:line-through before:absolute before:top-[5px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-primary data-[selected]:before:bg-primary-foreground"
                    />
                  </DatePickerCell>
                </DatePickerGridRow>
              </DatePickerGridBody>
            </DatePickerGrid>
          </div>
        </DatePickerCalendar>
      </DatePickerContent>
    </DatePickerRoot>
  </div>
</template>
