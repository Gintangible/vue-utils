// 本地获取所有数据并进行分页
import { logger, clone } from '@njzhyl/common-util';
import Page from '@/models/Page';

const PAGE_ALL_MIXIN = {
  data() {
    return {
      page: new Page(),
      showData: [],       // 显示的数据
      originalData: [],   // showData 对应的原始数据
    };
  },

  watch: {
    data() {
      logger.debug('pageAll.watch.data data = {0}', this.data);
      const PAGE_INDEX = this.pageIndexReset ? 1 : this.page.page_index;
      this.getShowList(PAGE_INDEX, this.page.page_size);
    },
  },

  created() {
    this.getShowList(1, this.page.page_size);
  },

  methods: {
    // 序号
    dataIndex(index) {
      return this.selectIndex(index) + 1;
    },

    // 获取当前选中的行的下标
    selectIndex(index) {
      return (this.page.page_index - 1) * this.page.page_size + index;
    },

    // page 重置
    resetPage() {
      this.page = this.page.clear();
    },

    // 获取展示的页
    getShowList(pageIndex, pageSize) {
      // 如果 data 从vuex取出来的，需要进行深copy，不然在页面中改变不会触发
      this.page.total_count = this.data.length;
      const sliceData = this.data.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
      logger.debug('pageAll.getShowList sliceData = {0}', sliceData);
      this.originalData = clone(sliceData);
      this.showData = clone(sliceData);
      logger.debug('pageAll.getShowList pageIndex = {0}, pageSize = {1}, showData = {2}', pageIndex, pageSize, this.showData);
      this.pageChangeCb && this.pageChangeCb();
    },
  },
};

export default PAGE_ALL_MIXIN;
