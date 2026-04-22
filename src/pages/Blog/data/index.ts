export interface Tag {
  id: string;
  name: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  tags: string[]; 
  status: 'Draft' | 'Published';
  viewCount: number;
  createdAt: string;
}

const STORAGE_KEYS = {
  TAGS: 'blog_tags',
  ARTICLES: 'blog_articles',
};

// Helper để tương tác với LocalStorage an toàn
const getStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from storage`, e);
    return defaultValue;
  }
};

const setStorage = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Khởi tạo dữ liệu mẫu
export const initData = () => {
  // 1. Khởi tạo Tags
  if (!localStorage.getItem(STORAGE_KEYS.TAGS)) {
    const defaultTags: Tag[] = [
      { id: '1', name: 'React' },
      { id: '2', name: 'Ant Design' },
      { id: '3', name: 'JavaScript' },
      { id: '4', name: 'Web Development' },
    ];
    setStorage(STORAGE_KEYS.TAGS, defaultTags);
  }

  // 2. Khởi tạo Articles
  if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
    const defaultArticles: Article[] = [
      {
        id: '1',
        title: 'Lập trình hiện đại với React & Ant Design',
        slug: 'lap-trinh-hien-dai-voi-react-ant-design',
        summary: 'Khám phá sức mạnh của việc kết hợp thư viện UI hàng đầu và framework CSS mạnh mẽ.',
        content: '# Chào mừng bạn đến với Blog\n\nĐây là bài viết đầu tiên sử dụng React và Ant Design.',
        coverImage: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=2070',
        tags: ['1', '2'],
        status: 'Published',
        viewCount: 120,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Mastering JavaScript trong năm 2026',
        slug: 'mastering-javascript-2026',
        summary: 'Những kiến thức cốt lõi về ESNext và cách áp dụng vào dự án thực tế.',
        content: '# JavaScript Evolution\n\nNgôn ngữ này chưa bao giờ ngừng hot.',
        coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2000',
        tags: ['3', '4'],
        status: 'Published',
        viewCount: 85,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    setStorage(STORAGE_KEYS.ARTICLES, defaultArticles);
  }
};

// Gọi khởi tạo ngay khi file được load
initData();

// --- EXPORTED FUNCTIONS ---

export const getTags = (): Tag[] => getStorage(STORAGE_KEYS.TAGS, []);

export const saveTags = (tags: Tag[]) => setStorage(STORAGE_KEYS.TAGS, tags);

export const getArticles = (): Article[] => getStorage(STORAGE_KEYS.ARTICLES, []);

export const saveArticles = (articles: Article[]) => setStorage(STORAGE_KEYS.ARTICLES, articles);

export const getArticleById = (id: string): Article | undefined => {
  return getArticles().find(a => a.id === id);
};

export const incrementViewCount = (id: string) => {
  const articles = getArticles();
  const index = articles.findIndex(a => a.id === id);
  if (index > -1) {
    articles[index].viewCount += 1;
    saveArticles(articles);
  }
};