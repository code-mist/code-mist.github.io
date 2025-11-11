// =================================================================
// ⭐️ 默认设置：通用视频封面图 (路径已修正) ⭐️
// =================================================================
const DEFAULT_VIDEO_POSTER = 'assets/images/default-video-poster.jpg'; 

// =================================================================
// ⭐️ 照片数据列表 (所有 src 路径已修正)
// =================================================================
const photos = [
    { 
        src: 'assets/images/2024-06-01-birthday-party.jpg', 
        caption: '2024生日派对上的小寿星！', 
        class: 'wide',
        tags: ['生日'],
        type: 'image'
    },
    { 
        src: 'assets/videos/2024-05-15-first-steps.mp4', 
        caption: '学走路的珍贵瞬间，迈出了第一步！', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/images/2023-10-20-cat-friend.jpg', 
        caption: '2023年春天，第一次看到小花猫。', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    { 
        src: 'assets/images/2024-07-10-beach-day.jpg', 
        caption: '在海边玩沙子，笑得可甜了。', 
        class: '',
        tags: ['旅行', '户外'],
        type: 'image'
    },
    { 
        src: 'assets/videos/2024-07-20-swing.mp4', 
        caption: '公园里荡秋千，开心地咯咯笑。', 
        class: 'tall',
        tags: ['户外'],
        type: 'video', 
    },
    { 
        src: 'assets/images/2024-01-05-shoes.jpg', 
        caption: '自己学会了穿鞋子，好棒！', 
        class: '',
        tags: ['日常'],
        type: 'image'
    },
    // 请在这里继续添加您的照片或视频数据，确保路径以 assets/images/ 或 assets/videos/ 开头
];

// 优化：为没有指定 type 的项添加默认值 'image'
photos.forEach(p => {
    if (!p.type) {
        p.type = 'image';
    }
});


// =================================================================
// 💻 渲染和交互逻辑 (内部逻辑不变，路径已通过常量和 photos 数组修正)
// =================================================================
const photoWall = document.getElementById('photoWall');
const lightbox = document.getElementById('lightbox');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxMediaContainer = document.getElementById('lightboxMediaContainer');

const filtersContainer = document.getElementById('filtersContainer');
const sortSelect = document.getElementById('sortOrder');

let currentFilter = 'all'; 
let currentSort = 'desc'; 

// --- 辅助函数：获取照片的日期 ---
function getDateFromSrc(src) {
    // 适配新的路径格式，只匹配日期部分
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

// --- 主渲染函数：应用筛选和排序 (不变) ---
function renderPhotoWall() {
    let displayPhotos = [...photos]; 
    
    displayPhotos = filterPhotos(displayPhotos);
    displayPhotos = sortPhotos(displayPhotos);

    photoWall.innerHTML = ''; 

    if (displayPhotos.length === 0) {
        photoWall.innerHTML = '<p style="grid-column: 1 / -1; margin-top: 50px; font-size: 1.5em; color: #aaa;">没有找到匹配当前标签的照片。</p>';
        return;
    }

    displayPhotos.forEach(photo => {
        const item = document.createElement('div');
        item.className = `photo-item ${photo.class || ''} ${photo.type === 'video' ? 'is-video' : ''}`; 
        item.tabIndex = 0; 

        let mediaElement = document.createElement('img'); 
        
        if (photo.type === 'video') {
            mediaElement.src = DEFAULT_VIDEO_POSTER; 
        } else {
            mediaElement.src = photo.src;
        }

        mediaElement.alt = photo.caption;
        mediaElement.loading = 'lazy'; 
        
        const captionDiv = document.createElement('div');
        captionDiv.classList.add('photo-caption');
        captionDiv.textContent = photo.caption;

        const openLightboxHandler = () => openLightbox(photo); 
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


// --- Lightbox 函数 (支持视频播放) ---
function openLightbox(photo) {
    lightboxMediaContainer.innerHTML = '';
    lightboxCaption.textContent = photo.caption;

    let mediaElement;
    
    if (photo.type === 'video') {
        // Lightbox 中创建 <video> 元素
        mediaElement = document.createElement('video');
        mediaElement.src = photo.src;
        mediaElement.poster = DEFAULT_VIDEO_POSTER; 
        mediaElement.controls = true; 
        mediaElement.autoplay = true; 
        mediaElement.loop = true; 
        
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden'; 
        
    } else {
        // Lightbox 中创建 <img> 元素
        mediaElement = document.createElement('img');
        mediaElement.src = photo.src;
        mediaElement.alt = photo.caption;
        
        mediaElement.onload = () => {
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden'; 
        };

        if (mediaElement.complete) {
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    
    lightboxMediaContainer.appendChild(mediaElement);
}

window.closeLightbox = function() {
    // 关闭 Lightbox 时停止所有视频播放
    lightboxMediaContainer.querySelectorAll('video').forEach(video => {
        video.pause();
        video.currentTime = 0; 
    });
    
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
    setupControls(); 
    renderPhotoWall(); 
});