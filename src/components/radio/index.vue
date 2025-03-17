<template>
  <div class="radio-wrap" :style="customStyle" @click="handleToggleSelect">
    <div :class="`radio-select ${noStyle ? 'mr0' : ''}`" :style="radioStyle">
      <!-- <img v-if="disabled" src="@/assets/icon/icon-cart-radio-gray.png" alt="" />
      <img v-else-if="radio" src="@/assets/icon/icon-cart-radio.png" alt="" />
      <img v-else-if="active" src="@/assets/icon/checkbox_quxiao@2x.png" alt="" /> -->
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: null,
    },
    value: {
      type: Boolean,
      default: null,
    },
    active: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    noStyle: {
      type: Boolean,
      default: false,
    },
    customStyle: {
      type: String,
      default: "",
    },
    radioStyle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      radio: "",
    };
  },
  watch: {
    value(oldVal, newVal) {
      radio.value = newVal;
    },
  },
  computed: {
    key() {
      return this.getActiveKey();
    },
  },
  methods: {
    getActiveKey() {
      if (typeof this.value === "boolean") return "value";
      return "modelValue";
    },
    handleToggleSelect() {
      if (props.disabled) return;
      if (key === "value") {
        emits("change");
        return;
      }
      this.radio = !this.radio;
      // emits('update:modelValue', radio.value);
      // emits('change');
    },
  },
  created() {
    this.radio = this[this.key];
  },
};
</script>

<style scoped lang="scss">
.radio-wrap {
  display: inline-flex;
  align-items: center;
  width: max-content;
  height: max-content;
}

.radio-select {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  position: relative;
  margin-right: 24px;

  &.mr0 {
    margin-right: 0;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
  }

  &::after {
    content: "";
    width: 100%;
    height: 100%;
    display: block;
    border: thin solid #ccc;
    border-radius: 50%;
    box-sizing: border-box;
  }
}
</style>
