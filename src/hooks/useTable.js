/**
 * @description: 表单校验
 * @param {Object} formObj 表单对象
 * @param {Function} resFn 校验成功回调
 * @param {Function} errFn 校验失败回调
 */
export default (formObj, resFn, errFn) => {
  const formRef = ref(null);
  const submitForm = async () => {
    if (!formRef.value) return;
    await formRef.value.validate((valid, fields) => {
      if (valid) {
        console.log("submit!");
        if (!resFn) return;
        resFn();
      } else {
        console.log("error submit!", fields);
        if (!errFn) return;
        errFn();
      }
    });
  };
  const resetForm = () => {
    if (!formRef.value) return;
    formRef.value.resetFields();
  };
  onUnmounted(() => {
    formRef.value = null;
  });
  return {
    formRef,
    submitForm,
    resetForm,
  };
};
