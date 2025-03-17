import { getAreaLibrary, getProductTypeLabel, getRegion } from "@/api/logistics/logistics";
import { getWarehouseList } from "@/api/logistics/warehouse";

const logistics = {
  state: {
    areaList: [], // 国家区域
    regionList: [], // 查询行政区地址
    warehouseList: [], // 仓库
    productTypeList: [], // 商品类型
  },
  mutations: {
    setAreaList(state, param) {
      state.areaList = param || [];
    },
    setRegionList(state, param) {
      state.regionList = param || [];
    },
    setWarehouseList(state, param) {
      state.warehouseList = param || [];
    },
    setProductTypeList(state, param) {
      state.productTypeList = param || [];
    },
  },
  actions: {
    // 查询【国家区域】
    async getAreaList({ commit }) {
      try {
        const { data = {} } = await getAreaLibrary();
        if (!data.success) return;
        if (data.data) {
          let _entry = data.data;
          _entry.forEach((item) => {
            if (!(item.children && item.children.length)) {
              delete item.children;
            } else {
              item.children.forEach((children) => {
                if (!(children.children && children.children.length)) {
                  delete children.children;
                }
              })
            }
          })
          commit('setAreaList', _entry);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 查询【查询行政区地址】
    async getRegionList({ commit }) {
      try {
        const { data = {} } = await getRegion();
        if (!data.success) return;
        if (data.data) {
          let _entry = data.data;
          _entry.forEach((item) => {
            if (!(item.children && item.children.length)) {
              delete item.children;
            } else {
              item.children.forEach((children) => {
                if (!(children.children && children.children.length)) {
                  delete children.children;
                } else {
                  children.children.forEach((grandchildren) => {
                    if (!(grandchildren.children && grandchildren.children.length)) {
                      delete grandchildren.children;
                    }
                  })
                }
              })
            }
          })
          commit('setRegionList', _entry);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 查询【归属仓库】
    async getWarehouseList({ commit }) {
      try {
        const { data = {} } =await getWarehouseList({size:200,current:1});
        if (!data.success) return;
        if (data.data && data.data.records) {
          let _entry = data.data.records;
          commit('setWarehouseList', _entry.map(({ id: value, name: label }) => ({
            label,
            value,
          })));
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 查询【商品类型】
    async getProductTypeList({ commit }) {
      try {
        const { data = {} } = await getProductTypeLabel();
        if (!data.success) return;
        if (data.data) {
          let _entry = data.data;
          _entry.forEach((item) => {
            if (!(item.children && item.children.length)) {
              delete item.children;
            } else {
              item.children.forEach((children) => {
                if (!(children.children && children.children.length)) {
                  delete children.children;
                }
              })
            }
          })
          commit('setProductTypeList', _entry);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};

export default logistics;
