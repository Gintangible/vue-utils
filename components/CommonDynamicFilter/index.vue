<template>
  <el-form
    ref="filterForm"
    :inline="inline"
    :model="query"
    :label-width="labelWidth"
    :rules="rules"
    class="filter-form"
  >
    <el-row
      v-for="(area, i) in queryArea"
      :key="i"
    >
      <template v-for="(formItem, index) in area">
        <el-form-item
          :key="index"
          :label="formItem.label"
          :prop="formItem.prop"
          :rules="formItem.rule || []"
        >
          <el-input
            v-if="!formItem.type || formItem.type === 'input'"
            v-model="query[formItem.prop]"
            :placeholder="formItem.placeholder"
            clearable
          />
          <el-select
            v-if="formItem.type === 'select'"
            v-model="query[formItem.prop]"
            clearable
            :placeholder="formItem.placeholder"
          >
            <el-option
              v-for="item in formItem.options"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
          <el-date-picker
            v-if="formItem.type === 'datePicker'"
            v-model="query[formItem.prop]"
            :type="formItem.dateType"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <slot
            v-if="formItem.slot"
            :name="formItem.slot"
            :form="form"
          />
        </el-form-item>
      </template>
      <el-form-item v-if="i === len">
        <el-button
          size="medium"
          type="primary"
          @click="handleSearch('filterForm')"
        >
          查询
        </el-button>
        <el-button
          size="medium"
          @click="handeleReset('filterForm')"
        >
          重置
        </el-button>
      </el-form-item>
    </el-row>
  </el-form>
</template>

<script>
import { logger, clone } from '@njzhyl/common-util';

export default {
  props: {
    // eslint-disable-next-line
    filter: Object,

    form: {
      type: Array,
      required: true,
      default: () => [],
    },

    inline: {
      type: Boolean,
      default: true,
    },

    splitNum: {
      type: Number,
      default: 4,
    },

    labelWidth: {
      type: String,
      default: '120px',
    },

    rules: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      query: {},
      queryArea: [],
      len: 0,
    };
  },

  watch: {
    filter: {
      deep: true,
      handler(val) {
        this.query = clone(val);
      },
    },
    form: {
      deep: true,
      handler() {
        this.getRowFormItem();
      },
    },
  },

  created() {
    this.getRowFormItem();
    this.query = clone(this.filter);
  },

  methods: {
    getRowFormItem() {
      const queryArea = [];
      this.len = Math.floor(this.form.length / this.splitNum)
      for (let i = 0; i <= this.len; i++) {
        const j = this.splitNum * i;
        queryArea.push(this.form.slice(j, j + this.splitNum));
      }
      this.queryArea = queryArea;
    },
    // 查询
    handleSearch(formName) {
      logger.debug('CommonDynamicFilter handleSearch query = {0}', this.query);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('query', this.query);
        } else {
          return false;
        }
      });
    },
    handeleReset(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
