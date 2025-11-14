// =================================================================
// ⭐️ 照片数据列表 (保持不变)
// =================================================================
const photos = [
    /* 下面为照片文件添加 */
    { 
        src: 'assets/images/2025-02-28-001.jpg', 
        caption: '自己学会了穿鞋子，好棒！', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-002.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-003.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-004.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-005.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-006.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-007.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-008.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-009.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-010.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-011.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-012.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-013.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-014.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-015.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-016.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-017.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-018.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-019.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-020.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2025-02-28-021.jpg', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
];

// =================================================================
// 💻 渲染和交互逻辑
// =================================================================
const photoWall = document.getElementById('photoWall');
const lightbox = document.getElementById('lightbox');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxMediaContainer = document.getElementById('lightboxMediaContainer');

const filtersContainer = document.getElementById('filtersContainer');
const sortSelect = document.getElementById('sortOrder');

let currentFilter = 'all'; 
let currentSort = 'desc'; 

// --- 新增：用于导航和幻灯片的全局变量 ---
let currentPhotoIndex = 0;
let currentDisplayedPhotos = []; // 存储当前显示的照片列表（用于导航）
let slideshowInterval = null; // 幻灯片计时器
const SLIDESHOW_SPEED = 3000; // 幻灯片速度 (3秒)

// --- 辅助函数：获取照片的日期 ---
function getDateFromSrc(src) {
    const match = src.match(/(\d{4}-\d{2}-\d{2})/); 
    return match ? match[1] : '0000-00-00';
}

// --- 排序功能实现 (不变) ---
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

// --- 筛选功能实现 (不变) ---
function filterPhotos(data) {
    if (currentFilter === 'all') {
        return data;
    }
    return data.filter(photo => photo.tags && photo.tags.includes(currentFilter));
}

// --- 主渲染函数：(已修改) ---
function renderPhotoWall() {
    // 1. 更新全局的照片数组
    currentDisplayedPhotos = [...photos]; 
    currentDisplayedPhotos = filterPhotos(currentDisplayedPhotos);
    currentDisplayedPhotos = sortPhotos(currentDisplayedPhotos);

    photoWall.innerHTML = ''; 

    if (currentDisplayedPhotos.length === 0) {
        photoWall.innerHTML = '<p style="grid-column: 1 / -1; margin-top: 50px; font-size: 1.5em; color: #aaa;">没有找到匹配当前标签的照片。</p>';
        return;
    }

    // 2. 修改 forEach，传入 index
    currentDisplayedPhotos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = `photo-item ${photo.class || ''}`; 
        item.tabIndex = 0; 

        let mediaElement = document.createElement('img'); 
        mediaElement.src = photo.src;
        mediaElement.alt = photo.caption;
        mediaElement.loading = 'lazy'; 
        
        const captionDiv = document.createElement('div');
        captionDiv.classList.add('photo-caption');
        captionDiv.textContent = photo.caption;

        // 3. 修改点击处理，传入 index
        const openLightboxHandler = () => openLightbox(index); 
        item.onclick = openLightboxHandler;

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); 
                openLightboxHandler();
            }
        });

        item.appendChild(mediaElement);
        item.appendChild(captionDiv);
        photoWall.appendChild(item);
    });
}

// --- 控制栏初始化 (不变) ---
function setupControls() {
    const allTags = new Set();
    photos.forEach(photo => {
        if (photo.tags) {
            photo.tags.forEach(tag => allTags.add(tag));
        }
    });

    filtersContainer.querySelectorAll('.filter-btn:not([data-tag="all"])').forEach(btn => btn.remove());
    
    allTags.forEach(tag => {
        const button = document.createElement('button');
        button.classList.add('filter-btn');
        button.textContent = tag;
        button.dataset.tag = tag;
        filtersContainer.appendChild(button);
    });

    filtersContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('filter-btn')) {
            currentFilter = target.dataset.tag; 

            filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            target.classList.add('active');

            renderPhotoWall();
        }
    });

    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value; 
        renderPhotoWall();
    });
    
    filtersContainer.querySelector('.filter-btn[data-tag="all"]').classList.add('active');
}


// --- Lightbox 函数 (已重构) ---

// 新增：显示指定索引的照片
function showPhoto(index) {
    // 边界检查和循环
    if (index >= currentDisplayedPhotos.length) {
        index = 0; // 循环到第一张
    } else if (index < 0) {
        index = currentDisplayedPhotos.length - 1; // 循环到最后一张
    }
    
    currentPhotoIndex = index;
    const photo = currentDisplayedPhotos[currentPhotoIndex];

    if (!photo) return; // 安全检查

    lightboxMediaContainer.innerHTML = '';
    lightboxCaption.textContent = photo.caption;

    let mediaElement = document.createElement('img');
    mediaElement.src = photo.src;
    mediaElement.alt = photo.caption;

    // 添加淡入效果
    mediaElement.style.opacity = 0;
    mediaElement.onload = () => {
        mediaElement.style.transition = 'opacity 0.3s';
        mediaElement.style.opacity = 1;
    };
    
    lightboxMediaContainer.appendChild(mediaElement);
}

// 修改：openLightbox 现在只打开遮罩并调用 showPhoto
function openLightbox(index) {
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden'; 
    showPhoto(index); // 显示点击的照片
}

// 新增：上一张 / 下一张
window.showNext = function() {
    showPhoto(currentPhotoIndex + 1);
}

window.showPrevious = function() {
    showPhoto(currentPhotoIndex - 1);
}

// 新增：切换幻灯片
window.toggleSlideshow = function() {
    const toggleBtn = document.getElementById('slideshow-toggle');
    if (slideshowInterval) {
        // 正在播放 -> 停止
        clearInterval(slideshowInterval);
        slideshowInterval = null;
        toggleBtn.textContent = '▶️'; // 设为播放图标
    } else {
        // 已停止 -> 开始播放
        toggleBtn.textContent = '⏸️'; // 设为暂停图标
        
        // 立即播放下一张，然后设置定时器
        showNext(); 
        slideshowInterval = setInterval(() => {
            showNext();
        }, SLIDESHOW_SPEED);
    }
}

// 修改：关闭 Lightbox (必须停止幻灯片)
window.closeLightbox = function() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
        document.getElementById('slideshow-toggle').textContent = '▶️';
    }
    lightbox.classList.remove('show');
    document.body.style.overflow = 'auto'; 
};

// 修改：添加键盘导航
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('show')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNext();
        } else if (e.key === 'ArrowLeft') {
            showPrevious();
        } else if (e.key === ' ') { // 空格键
            e.preventDefault(); // 防止页面滚动
            toggleSlideshow();
        }
    }
});


// 初始加载：DOM 内容加载完毕后执行渲染和控件设置
document.addEventListener('DOMContentLoaded', () => {
    setupControls(); 
    renderPhotoWall(); 

    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
        bgMusic.play().catch(error => {
            console.warn('背景音乐自动播放被阻止。等待用户交互。', error);
            document.body.addEventListener('click', () => {
                if (bgMusic.paused) {
                    bgMusic.play();
                }
            }, { once: true });
        });
    }
});