<template>
  <div class="home-container">
    <div class="home-item">
      <el-alert
        title="开发中敬请期待..."
        center
        :closable="false"
        effect="dark"
        type="warning"
      >
      </el-alert>
    </div>
    <el-card shadow="never" class="home-item">
      <div class="label-title">数据概览</div>
      <div class="statistic-wrap">
        <div
          v-for="index in 6"
          :key="index"
          class="statistic-item"
          :style="`max-width: ${100 / 6}%`"
        >
          <div class="after"></div>
        </div>
      </div>
    </el-card>
    <el-row>
      <el-col :span="16" :sm="24" :xs="24" :md="16" class="home-left-wrap">
        <el-card shadow="never" class="home-item">
          <div class="label-title">待办事项</div>
          <div class="pending-wrap">
            <div v-for="index in 8" :key="index" class="pending-item"></div>
          </div>
        </el-card>
        <el-card shadow="never" class="home-item">
          <div class="label-title">销售趋势</div>
          <div class="canvas-wrap mask"></div>
        </el-card>
        <el-card shadow="never" class="home-item">
          <div class="label-title">销售额趋势</div>
          <div class="canvas-wrap mask"></div>
        </el-card>
        <el-row>
          <el-col :span="12" :sm="24" :xs="24" :md="12">
            <el-card shadow="never" class="home-item">
              <div class="label-title">新增用户</div>
              <div class="canvas-wrap mask"></div>
            </el-card>
          </el-col>
          <el-col :span="12" :sm="24" :xs="24" :md="12">
            <el-card shadow="never" class="home-item">
              <div class="label-title">日活趋势</div>
              <div class="canvas-wrap mask"></div>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :sm="24" :xs="24" :md="12">
            <el-card shadow="never" class="home-item">
              <div class="label-title">商品销售额排行</div>
              <div class="canvas-wrap mask"></div>
            </el-card>
          </el-col>
          <el-col :span="12" :sm="24" :xs="24" :md="12">
            <el-card shadow="never" class="home-item">
              <div class="label-title">商品销量排行</div>
              <div class="canvas-wrap mask"></div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" :sm="24" :xs="24" :md="8">
        <el-card shadow="never" class="home-item">
          <div class="label-title">常用功能</div>
          <div class="app-wrap">
            <div v-for="index in 9" :key="index" class="app-item"></div>
          </div>
        </el-card>
        <el-card shadow="never" class="home-item">
          <div class="label-title">公告</div>
          <div class="canvas-wrap mask"></div>
        </el-card>
        <el-card shadow="never" class="home-item">
          <div class="label-title">本月销售情况</div>
          <div class="canvas-wrap mask"></div>
        </el-card>
        <el-card shadow="never" class="home-item">
          <div class="label-title">本月业绩完成度</div>
          <div class="canvas-wrap mask"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "wel",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {},
  methods: {
    handleChange(val) {
      console.log(val);
    },
  },
};
</script>

<style scoped lang="scss">
.home-container {
  padding: 24px;
  box-sizing: border-box;
  overflow: hidden;

  .home-left-wrap {
    padding-right: 24px;
    box-sizing: border-box;
  }

  @media only screen and (max-width: 992px) {
    .home-left-wrap {
      padding-right: 0;
    }
  }

  .home-item {
    max-width: 100%;
    margin-bottom: 20px;
  }
}

.center {
  text-align: center;
  color: #409eff;
}

.label-title {
  position: relative;
  font-size: 16px;
  padding: 4px 0 20px;
}

.statistic-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .statistic-item {
    flex: 1;
    border-radius: 4px;
    height: 100px;
    padding-right: 12px;
    margin-bottom: 12px;
    box-sizing: border-box;

    .after {
      display: block;
      height: 100%;
      background: #fafafa;
    }
  }

  @media only screen and (max-width: 992px) {
    .statistic-item {
      min-width: 33.33%;
    }
  }

  @media only screen and (max-width: 679px) {
    .statistic-item {
      min-width: 50%;
    }
  }
}

.pending-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  overflow-x: auto;

  &::-webkit-scrollbar {
    width: 0 !important;
  }

  .pending-item {
    display: flex;
    align-items: center;
    width: 240px;
    min-width: 240px;
    border-radius: 4px;
    height: 100px;
    margin: 0 12px 12px 0;

    &::before {
      content: "";
      display: block;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #fafafa;
      margin-right: 12px;
      flex-shrink: 0;
    }

    &::after {
      content: "";
      display: block;
      width: 120px;
      height: 60px;
      background: #fafafa;
      margin-right: 24px;
      border-radius: 8px;
    }
  }
}

.canvas-wrap {
  background: #fafafa;
  height: 300px;
}

.app-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .app-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 33.33%;
    max-width: 100px;
    padding: 12px;
    box-sizing: border-box;

    &::before {
      content: "";
      display: block;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #fafafa;
      margin: 0 auto 8px;
      flex-shrink: 0;
    }

    &::after {
      content: "";
      display: block;
      width: 60px;
      height: 20px;
      background: #fafafa;
    }
  }
}

.mask {
  position: relative;
  overflow: hidden;

  &::after {
    position: absolute;
    top: 0;
    left: -101%;
    content: "";
    width: 100%;
    height: 100%;
    display: block;
    background: linear-gradient(
      90deg,
      #fafafa,
      rgba(225, 225, 225, 0.5),
      #fafafa
    );
    animation: loading 3s infinite 0.1s;
  }
}

@keyframes loading {
  /* 骨架屏的动画 */
  100% {
    left: 0;
    transform: translate(100%);
  }
}
</style>

