<template>
  <div class="_base-count-down">
    <div class="content">
      <slot
        v-bind="{
          d: days,
          h: hours,
          m: mins,
          s: seconds,
          hh: `00${hours}`.slice(-2),
          mm: `00${mins}`.slice(-2),
          ss: `00${seconds}`.slice(-2),
          curTime,
        }"
      ></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  props: {
    // 具体需要倒计时的毫秒数或者秒数
    // time: {
    //   type: [String, Number],
    //   default: 0,
    // },
    // 是否是毫秒
    isMilliSecond: {
      type: Boolean,
      default: false,
    },
    // 结束时刻转化的毫秒数或者秒数
    end: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {
      days: "0",
      hours: "00",
      mins: "00",
      seconds: "00",
      timer: null,
      curTime: 0,
    };
  },
  computed: {
    duration() {
      const end = String(this.end).length >= 13 ? +this.end : +this.end * 1000;
      return end;
      // return this.isMilliSecond ? Math.round(+this.time / 1000) : Math.round(+this.time);
    },
  },
  watch: {
    curTime(oldVal, newVal) {
      if (newVal <= 1100 && newVal > 0) {
        this.$emit("countDownEnd");
      }
    },
  },
  mounted() {
    this.countDown();
  },
  methods: {
    countDown() {
      this.curTime = this.duration - Date.now();
      this.getTime(this.curTime);
    },
    getTime(duration) {
      if (this.curTime < 0) {
        this.timer && clearTimeout(this.timer);
        return;
      }

      const { dd, hh, mm, ss } = this.durationFormatter(Math.floor(duration / 1000));
      this.days = dd || 0;
      this.hours = hh || 0;
      this.mins = mm || 0;
      this.seconds = ss || 0;
      this.timer = setTimeout(() => {
        const now = Date.now();
        this.curTime = Math.floor(this.duration - now);
        this.getTime(this.curTime);
      }, 1000);
    },
    durationFormatter(time) {
      if (!time) return { ss: 0 };
      let t = time;

      const ss = t % 60;
      t = (t - ss) / 60;
      if (t < 1) return { ss };

      const mm = t % 60;
      t = (t - mm) / 60;
      if (t < 1) return { mm, ss };

      const hh = t % 24;
      t = (t - hh) / 24;
      if (t < 1) return { hh, mm, ss };

      const dd = t;
      return { dd, hh, mm, ss };
    },
  },
};
</script>
