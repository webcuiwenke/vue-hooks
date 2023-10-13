import { Modal, message } from "ant-design-vue";
/**
 *
 * @param {*} listRequestFn 列表接口
 * @param {*} deltRequestFn 删除接口
 * @param {*} isRequest 是否需要入参
 * @returns
 */
export default function (
  listRequestFn,
  deltRequestFn,
  queryRequestFn,
  isRequest = true
) {
  // 加载态
  const loading = ref(false);
  // 数据
  let tableData = ref([]);
  let pagination = ref({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  let query = ref({});
  async function getTable() {
    if (!listRequestFn) return console.log('请传入接口');;
    loading.value = true;
    const params = {
      page: pagination.value.current,
      limit: pagination.value.pageSize,
      ...query.value,
    };
    const [err, data] = await listRequestFn({
      data: isRequest ? params : null,
    });
    loading.value = false;
    if (!err) {
      tableData.value = data?.data?.map((e) => {
        e.key = e.id;
        return e;
      });
      pagination.value.total = data.count;
    }
  }
  function handleDelete(id, query = {}) {
    Modal.confirm({
      title: "确认删除?",
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (!id) return console.log("id错误", id);
        delApi(id);
      },
      onCancel() {
        message.warning("取消删除");
      },
    });
    const delApi = async (id) => {
      const [err, data] = await deltRequestFn({
        data: {
          id: id,
          ...query,
        },
      });
      if (err) {
        message.error(err.msg);
      } else {
        message.success(data.msg);
        getTable();
      }
    };
  }
  function tableChange(pag) {
    pagination.value = pag;
    getTable();
  }
  // 页面初始化
  onMounted(() => {
    query.value = queryRequestFn;
    getTable();
  });
  const unwatch = watch(
    () => queryRequestFn,
    (val) => {
      query.value = val;
    },
    {
      deep: true,
    }
  );
  onUnmounted(() => {
    unwatch();
  });
  return {
    loading,
    tableData,
    pagination,
    tableChange,
    getTable,
    handleDelete,
  };
}
