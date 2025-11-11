// =================================================================
// ⭐️ 默认设置：通用视频封面图 (路径已修正) ⭐️
// =================================================================
const DEFAULT_VIDEO_POSTER = 'assets/images/default-video-poster.jpg'; 

// =================================================================
// ⭐️ 照片数据列表 (所有 src 路径已修正)
// caption为照片描述性文字，cllass照片样式，tags自定义分组，type:image/video
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
    
    
    /* 下面为视频文件添加 */
    { 
        src: 'assets/videos/2025-02-28-001.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-002.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-003.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-004.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-005.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-006.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-007.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-008.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-009.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-010.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-011.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-012.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-013.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-014.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-015.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-016.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-017.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-018.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-019.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-020.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-021.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-022.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-023.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-024.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-025.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-026.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-027.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-028.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-029.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-030.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-031.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-032.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-033.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-034.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-035.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-036.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-037.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-038.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-039.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-040.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-041.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-042.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-043.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-044.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-045.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-046.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-047.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-048.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-049.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-050.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-051.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-052.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
    { 
        src: 'assets/videos/2025-02-28-053.mp4', 
        caption: '', 
        class: '',
        tags: ['日常'],
        type: 'video', 
    },
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