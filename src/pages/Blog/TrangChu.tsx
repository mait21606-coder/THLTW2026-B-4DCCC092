import React, { useState, useEffect } from 'react';
import { Card, Input, Typography, Tag, List, Space, Select, Row, Col, Avatar, Badge } from 'antd';
import { SearchOutlined, EyeOutlined, ClockCircleOutlined, BookOutlined, FireOutlined } from '@ant-design/icons';
import { history } from 'umi';
import moment from 'moment';
import { getArticles, getTags, Article, Tag as TagType } from './data';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const TrangChu: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string | 'all'>('all');

  useEffect(() => {
    // Chỉ lấy bài viết đã đăng
    setArticles(getArticles().filter(a => a.status === 'Published'));
    setTags(getTags());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const filteredArticles = articles.filter((article) => {
    const matchSearch = article.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                         article.summary.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchTag = selectedTagId === 'all' ? true : article.tags.includes(selectedTagId);
    return matchSearch && matchTag;
  });

  return (
    <div style={{ background: '#fcfcfd', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Hero Section - Banner Header */}
        <div style={{ 
          marginBottom: 48, 
          textAlign: 'center', 
          padding: '60px 24px', 
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
          border: '1px solid #f0f0f0'
        }}>
          <Badge text="v2.0 Beta" color="blue" style={{ marginBottom: 16 }} />
          <Title level={1} style={{ fontSize: '3rem', fontWeight: 900, marginBottom: 16 }}>
            <span style={{ color: '#1890ff' }}>Tech</span> Insight
          </Title>
          <Paragraph style={{ fontSize: '1.1rem', color: '#8c8c8c', maxWidth: 650, margin: '0 auto' }}>
            Khám phá thế giới lập trình thông qua những bài viết chuyên sâu về 
            React, TypeScript và các giải pháp bảo mật hệ thống.
          </Paragraph>
        </div>

        {/* Filter Bar */}
        <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
          <Col xs={24} lg={16}>
            <Input
              size="large"
              placeholder="Bạn muốn tìm hiểu về chủ đề gì hôm nay?"
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ borderRadius: 12, height: 54, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              allowClear
            />
          </Col>
          <Col xs={24} lg={8}>
            <Select 
              size="large"
              value={selectedTagId} 
              onChange={setSelectedTagId} 
              style={{ width: '100%' }}
              dropdownStyle={{ borderRadius: 12 }}
            >
              <Option value="all">🌐 Tất cả danh mục</Option>
              {tags.map(tag => (
                <Option key={tag.id} value={tag.id}># {tag.name}</Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* Article Grid */}
        <List
          grid={{ gutter: 32, xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
          dataSource={filteredArticles}
          pagination={{
            pageSize: 6,
            align: 'center',
            style: { marginTop: 40 }
          }}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                className="article-card"
                style={{ borderRadius: 16, overflow: 'hidden', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                cover={
                  <div style={{ overflow: 'hidden', height: 200 }}>
                    <img
                      alt={item.title}
                      src={item.coverImage || 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=2070'}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                }
                onClick={() => history.push(`/blog/article/${item.id}`)}
              >
                <div style={{ minHeight: 180, display: 'flex', flexDirection: 'column' }}>
                  <Space style={{ marginBottom: 12 }} size={[0, 8]} wrap>
                    {item.tags.map(tagId => {
                      const tag = tags.find(t => t.id === tagId);
                      return tag ? <Tag color="blue" key={tagId} style={{ borderRadius: 4, border: 'none', background: '#e6f7ff', color: '#1890ff' }}>{tag.name}</Tag> : null;
                    })}
                  </Space>

                  <Title level={4} style={{ marginBottom: 12, lineHeight: 1.4 }}>
                    {item.title}
                  </Title>

                  <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 'auto' }}>
                    {item.summary}
                  </Paragraph>

                  <div style={{