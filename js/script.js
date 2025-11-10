// =================================================================
// ⭐️ 唯一需要修改的地方：照片数据列表
// ⭐️ 优化：增加了 tags 字段，照片名称必须包含 YYYY-MM-DD
// =================================================================
const photos = [
    // 💡 记住使用 YYYY-MM-DD-xxx.jpg 的命名格式
    // 💡 tags 数组可以包含多个标签
    { 
        src: 'images/2024-06-01-birthday-party.jpg', 
        caption: '2024生日派对上的小寿星！', 
        class: 'wide',
        tags: ['生日'] 
    },
    { 
        src: 'images/2024-05-15-hiking.jpg', 
        caption: '和爸爸妈妈一起去爬山，很勇敢哦！', 
        class: 'tall',
        tags: ['旅行', '户外']
    },
    { 
        src: 'images/2023-10-20-cat-friend.jpg', 
        caption: '2023年春天，第一次看到小花猫。', 
        class: '',
        tags: ['日常']
    },
    { 
        src: 'images/2024-07-10-beach-day.jpg', 
        caption: '在海边玩沙子，笑得可甜了。', 
        class: '',
        tags: ['旅行', '户外']
    },
    { 
        src: 'images/2024-01-05-shoes.jpg', 
        caption: '自己学会了穿鞋子，好棒！', 
        class: '',
        tags: ['日常']
    },
    // 请在这里继续添加您的照片数据...
];

// =================================================================
// 💻 以下是渲染和交互逻辑，无需改动
// =================================================================
const photoWall = document.getElementById('photoWall');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');

const filtersContainer = document.getElementById('filtersContainer');
const sortSelect = document.getElementById('sortOrder');

let currentFilter = 'all'; // 当前筛选标签
let currentSort = 'desc'; // 当前排序方式

// --- 辅助函数：获取照片的日期 ---
function getDateFromSrc(src) {
    // 提取 YYYY-MM-DD 部分
    const match = src.match(/(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : '0000-00-00'; // 如果不符合命名规范，给一个默认值
}

// --- 排序功能实现 ---
function sortPhotos(data) {
    data.sort((a, b) => {
        const dateA = getDateFromSrc(a.src);
        const dateB = getDateFromSrc(b.src);

        if (dateA < dateB) return currentSort === 'asc' ? -1 : 1;
        if (dateA > dateB) return currentSort === 'asc' ? 1 : -1;
        return 0;
    });
    return data;
}

// --- 筛选功能实现 ---
function filterPhotos(data) {
    if (currentFilter === 'all') {
        return data;
    }
    return data.filter(photo => photo.tags && photo.tags.includes(currentFilter));
}

// --- 主渲染函数：应用筛选和排序 ---
function renderPhotoWall() {
    // 1. 克隆原始数据，避免修改全局 photos 数组
    let displayPhotos = [...photos]; 
    
    // 2. 应用筛选
    displayPhotos = filterPhotos(displayPhotos);

    // 3. 应用排序
    displayPhotos = sortPhotos(displayPhotos);

    // 4. 🚀 UX优化：清除骨架屏和旧内容
    photoWall.innerHTML = ''; 

    // 如果筛选后没有照片
    if (displayPhotos.length === 0) {
        photoWall.innerHTML = '<p style="grid-column: 1 / -1; margin-top: 50px; font-size: 1.5em; color: #aaa;">没有找到匹配当前标签的照片。</p>';
        return;
    }

    // 5. 渲染过滤排序后的照片
    displayPhotos.forEach(photo => {
        const item = document.createElement('div');
        item.className = `photo-item ${photo.class || ''}`; 
        item.tabIndex = 0; 

        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.caption;
        img.loading = 'lazy'; 
        
        const captionDiv = document.createElement('div');
        captionDiv.classList.add('photo-caption');
        captionDiv.textContent = photo.caption;

        const openLightboxHandler = () => openLightbox(photo.src, photo.caption);
        item.onclick = openLightboxHandler;

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); 
                openLightboxHandler();
            }
        });

        item.appendChild(img);
        item.appendChild(captionDiv);
        photoWall.appendChild(item);
    });
}

// --- 控制栏初始化 ---
function setupControls() {
    // 1. 动态生成筛选按钮
    const allTags = new Set();
    photos.forEach(photo => {
        if (photo.tags) {
            photo.tags.forEach(tag => allTags.add(tag));
        }
    });

    // 移除默认的 '全部' 按钮之外的所有动态按钮
    filtersContainer.querySelectorAll('.filter-btn:not([data-tag="all"])').forEach(btn => btn.remove());
    
    allTags.forEach(tag => {
        const button = document.createElement('button');
        button.classList.add('filter-btn');
        button.textContent = tag;
        button.dataset.tag = tag;
        filtersContainer.appendChild(button);
    });

    // 2. 绑定事件监听器
    filtersContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('filter-btn')) {
            // 更新 currentFilter
            currentFilter = target.dataset.tag; 

            // 更新按钮的 active 状态
            filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            target.classList.add('active');

            // 重新渲染照片墙
            renderPhotoWall();
        }
    });

    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value; // 更新 currentSort
        renderPhotoWall(); // 重新渲染照片墙
    });
    
    // 确保 '全部' 按钮默认处于 active 状态
    filtersContainer.querySelector('.filter-btn[data-tag="all"]').classList.add('active');
}


// --- Lightbox 函数 (保持不变) ---
function openLightbox(src, caption) {
    lightboxImage.src = src;
    lightboxCaption.textContent = caption;
    
    lightboxImage.onload = () => {
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden'; 
    };

    if (lightboxImage.complete) {
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

window.closeLightbox = function() {
    lightbox.classList.remove('show');
    document.body.style.overflow = 'auto'; 
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('show')) {
        closeLightbox();
    }
});


// 初始加载：DOM 内容加载完毕后执行渲染和控件设置
document.addEventListener('DOMContentLoaded', () => {
    setupControls(); // 设置筛选和排序控件
    renderPhotoWall(); // 首次渲染照片墙
});