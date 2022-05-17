<template>
  <el-upload
    action="#"
    :file-list="fileList"
    list-type="picture-card"
    :limit="limit"
    :multiple="multiple"
    accept="image/*"
    :before-upload="beforeUpload"
    :on-remove="fileRemove"
    :on-exceed="fileExceed"
    :on-success="fileSuccess"
    :http-request="fileUpload"
    :disabled="disabled"
    class="image-upload"
  >
    <i class="el-icon-plus" />
    <div
      v-show="this.acceptTypes.length"
      slot="tip"
      class="upload-tips"
    >
      请上传 {{ this.acceptTypes.join('、') }} 格式的文件
    </div>
  </el-upload>
</template>

<script>
import config from '@/config';
import commonApi from '@/api/common';

export default {
  name: 'ImageUpload',

  model: {
    prop: 'serverFileList',
  },

  props: {
    // 文件列表
    serverFileList: {
      type: Array,
      default: () => [],
    },
    // 显示数
    limit: {
      type: Number,
      default:  1,
    },
    // 多选
    multiple: {
      type: Boolean,
    },
    // 接收的文件类型
    acceptTypes: {
      type: Array,
      default: () => ['png'],
    },
    disabled: {
      type: Boolean,
    },
  },

  data() {
    return {
      fileList: [],
      tempList: [],
    };
  },

  created() {
    this.getFileList();
  },

  methods: {
    // 获取显示的列表
    getFileList() {
      const result = [];
      this.serverFileList.forEach(item => {
        result.push(this.server2Local(item));
      })
      this.fileList = result;
      this.tempList = this.serverFileList;
    },

    // 将接口返回的图片信息转换
    server2Local(res) {
      return {
        name: res.fileName,
        path: res.path,
        url: config.file_url + res.fileName,
      }
    },

    // 上传前校验
    beforeUpload(file) {
      const type = file.type.split('/')[1];
      if (!this.acceptTypes.length) {
        return true;
      }
      return this.acceptTypes.includes(type);
    },

    // 上传图片
    fileUpload(file) {
      return commonApi.fileUpload(file.file);
    },

    // 上传成功
    fileSuccess(res, file, filelist) {
      this.fileList = filelist;
      this.tempList.push({...res.data});
      this.updateFileList();
    },

    // 删除图片
    fileRemove(file) {
      const index = this.fileList.findIndex(item => item.uid === file.uid);
      if ( index === -1) {
        this.$message.error('删除的文件未找到');
        return;
      }
      const fileName = this.tempList[index].fileName;
      this.tempList.splice(index, 1);
      this.updateFileList();
      commonApi.fileDelete({ fileName })
    },

    // 更新父组件上的fileList
    updateFileList() {
      this.$emit('input', this.tempList);
    },

    // 文件超出限制
    fileExceed() {
      this.$message.error(`文件上传请不要超过${this.limit}个`);
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-tips {
  color: #409eff;
}
</style>