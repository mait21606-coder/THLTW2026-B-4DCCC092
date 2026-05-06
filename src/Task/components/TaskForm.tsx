import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select } from 'antd';
import moment from 'moment';

interface TaskFormProps {
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  initialValues?: any;
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, onCancel, onFinish, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          deadline: initialValues.deadline ? moment(initialValues.deadline) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : null,
      };
      onFinish(formattedValues);
    });
  };

  return (
    <Modal
      title={initialValues ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
      visible={visible} 
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      destroyOnClose
      maskClosable={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tên công việc"
          rules={[{ required: true, message: 'Vui lòng nhập tên công việc' }, { max: 100 }]}
        >
          <Input placeholder="Ví dụ: Thiết kế giao diện Dashboard" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Mô tả chi tiết các bước cần làm..." />
        </Form.Item>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="deadline"
            label="Deadline"
            rules={[{ required: true, message: 'Chọn ngày hạn' }]}
            style={{ flex: 1 }}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Mức độ"
            rules={[{ required: true, message: 'Chọn độ ưu tiên' }]}
            style={{ flex: 1 }}
          >
            <Select>
              <Select.Option value="High">Cao</Select.Option>
              <Select.Option value="Medium">Trung bình</Select.Option>
              <Select.Option value="Low">Thấp</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="tags" label="Tags (Nhãn)">
          <Select mode="tags" placeholder="Gõ và nhấn Enter để thêm nhãn">
            <Select.Option value="Frontend">Frontend</Select.Option>
            <Select.Option value="Backend">Backend</Select.Option>
            <Select.Option value="Design">Design</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;