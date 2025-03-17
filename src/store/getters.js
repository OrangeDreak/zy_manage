const getters = {
  tag: (state) => state.tags.tag,
  language: (state) => state.common.language,
  website: (state) => state.common.website,
  colorName: (state) => state.common.colorName,
  themeName: (state) => state.common.themeName,
  isShade: (state) => state.common.isShade,
  isCollapse: (state) => state.common.isCollapse,
  keyCollapse: (state, getters) => (getters.screen > 1 ? getters.isCollapse : false),
  screen: (state) => state.common.screen,
  isLock: (state) => state.common.isLock,
  isFullScren: (state) => state.common.isFullScren,
  isMenu: (state) => state.common.isMenu,
  lockPasswd: (state) => state.common.lockPasswd,
  tagList: (state) => state.tags.tagList,
  tagWel: (state) => state.tags.tagWel,
  platformList: (state) => state.order.platformList,
};
export default getters;
