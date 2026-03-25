import React, { useState, useMemo } from 'react';
import { Tabs, Table, Button, Form, Input, InputNumber, DatePicker, Select, Modal, Space, Popconfirm, message, Card, Descriptions, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import useQuanLyVanBangModel from '../../models/quanLyVanBang';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

export default function QuanLyVanBang() {
  const { 
    diplomaBooks, decisions, formConfigs, diplomas, searchStats,
    addDiplomaBook, updateDiplomaBook, deleteDiplomaBook,
    addDecision, updateDecision, deleteDecision,
    addFormConfig, updateFormConfig, deleteFormConfig,
    addDiploma, updateDiploma, deleteDiploma, incrementSearchStat 
  } = useQuanLyVanBangModel();

  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  
  const [state, setState] = useState({
    tab: '1',
    modal: { open: false, type: '', data: null as any },
    search: { results: [] as any[], active: false },
    detail: { open: false, item: null as any }
  });

  const mapper = {
    toForm: (type: string, record: any) => {
      const values = { ...record };
      if (record.date) values.date = dayjs(record.date);
      if (record.dateOfBirth) values.dateOfBirth = dayjs(record.dateOfBirth);
      if (record.customFields) {
        Object.entries(record.customFields).forEach(([id, val]) => {
          const cfg = formConfigs.find(c => c.id === id);
          values[`custom_${id}`] = cfg?.dataType === 'Date' ? dayjs(val as string) : val;
        });
      }
      return values;
    },
    toModel: (values: any) => {
      const data = { ...values, customFields: {} as any };
      if (values.date) data.date = values.date.toISOString();
      if (values.dateOfBirth) data.dateOfBirth = values.dateOfBirth.toISOString();
      
      Object.keys(values).forEach(key => {
        if (key.startsWith('custom_')) {
          const id = key.replace('custom_', '');
          const cfg = formConfigs.find(c => c.id === id);
          data.customFields[id] = cfg?.dataType === 'Date' ? values[key]?.toISOString() : values[key];
          delete data[key];
        }
      });
      return data;
    }
  };

  const onSave = (values: any) => {
    const data = mapper.toModel(values);
    const { type, data: editing } = state.modal;
    
    const actions: any = {
      book: () => editing ? updateDiplomaBook(editing.id, data) : addDiplomaBook(data),
      decision: () => editing ? updateDecision(editing.id, data) : addDecision(data),
      config: () => editing ? updateFormConfig(editing.id, data) : addFormConfig(data),
      diploma: () => editing ? updateDiploma(editing.id, data) : addDiploma(data)
    };

    try {
      actions[type]();
      message.success('Thành công');
      setState(s => ({ ...s, modal: { ...s.modal, open: false } }));
    } catch (e: any) {
      message.error(e.message);
    }
  };

  const columns = {
    actions: (type: string, del: Function) => ({
      title: 'Thao tác',
      width: 100,
      render: (_: any, r: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => {
            setState(s => ({ ...s, modal: { open: true, type, data: r } }));
            form.setFieldsValue(mapper.toForm(type, r));
          }} />
          <Popconfirm title="Xóa?" onConfirm={() => del(r.id)}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
        </Space>
      )
    })
  };

  return (
    <div style={{ padding: 24 }}>
      <Tabs activeKey={state.tab} onChange={t => setState(s => ({ ...s, tab: t }))} type="card">
        <TabPane tab="Sổ & Quyết định" key="1">
          <Row gutter={24}>
            <Col span={8}>
              <Card title="Sổ văn bằng" extra={<Button type="link" onClick={() => { setState(s => ({ ...s, modal: { open: true, type: 'book', data: null } })); form.resetFields(); }} icon={<PlusOutlined />} />}>
                <Table rowKey="id" size="small" dataSource={diplomaBooks} pagination={{ pageSize: 5 }} columns={[{ title: 'Năm', dataIndex: 'year' }, { title: 'STT', dataIndex: 'currentNumber' }, columns.actions('book', deleteDiplomaBook)]} />
              </Card>
            </Col>
            <Col span={16}>
              <Card title="Quyết định" extra={<Button type="link" onClick={() => { setState(s => ({ ...s, modal: { open: true, type: 'decision', data: null } })); form.resetFields(); }} icon={<PlusOutlined />} />}>
                <Table rowKey="id" size="small" dataSource={dec