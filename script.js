let posts = JSON.parse(localStorage.getItem('posts')) || [];
let isAdmin = localStorage.getItem('isAdmin') === 'true';

// تسجيل الدخول
function login() {
    const password = prompt('أدخل كلمة المرور للوصول إلى أدوات الإدارة:');
    if (password === "1234") { // كلمة المرور الافتراضية
        isAdmin = true;
        localStorage.setItem('isAdmin', 'true');
        alert('تم تسجيل الدخول بنجاح!');
        updateUI();
        displayPosts();
    } else {
        alert('كلمة المرور غير صحيحة!');
    }
}

// تسجيل الخروج
function logout() {
    isAdmin = false;
    localStorage.setItem('isAdmin', 'false');
    alert('تم تسجيل الخروج بنجاح!');
    updateUI();
    displayPosts();
}

// تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
function updateUI() {
    const addPostLink = document.getElementById('addPostLink');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (isAdmin) {
        addPostLink.style.display = 'block';
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        addPostLink.style.display = 'none';
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
}

// عرض المقالات
function displayPosts() {
    const postsSection = document.getElementById('posts');
    postsSection.innerHTML = '';
    posts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <img src="${post.imageUrl}" alt="${post.title}">
            <div class="post-content">
                <h2>${post.title}</h2>
                <p>${post.content.substring(0, 100)}...</p>
            </div>
            ${isAdmin ? `
                <div class="post-actions">
                    <button class="edit" onclick="editPost(${index})">تعديل</button>
                    <button onclick="deletePost(${index})">حذف</button>
                </div>
            ` : ''}
        `;
        postElement.addEventListener('click', () => viewPost(index));
        postsSection.appendChild(postElement);
    });
}

// إضافة مقال جديد
document.getElementById('addPostForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const imageFile = document.getElementById('postImage').files[0];

    if (title && content && imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageUrl = e.target.result;
            const newPost = { title, content, imageUrl };
            posts.push(newPost);
            localStorage.setItem('posts', JSON.stringify(posts));
            alert('تمت إضافة المقال بنجاح');
            window.location.href = 'index.html';
        };
        reader.readAsDataURL(imageFile);
    } else {
        alert('يرجى ملء جميع الحقول');
    }
});

// حذف مقال
function deletePost(index) {
    if (isAdmin) {
        posts.splice(index, 1);
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();
    } else {
        alert('غير مسموح لك بحذف المقالات!');
    }
}

// عرض مقال بشكل كامل
function viewPost(index) {
    localStorage.setItem('currentPost', JSON.stringify(posts[index]));
    window.location.href = 'post_detail.html';
}

// عرض تفاصيل المقال
function displayPostDetail() {
    const post = JSON.parse(localStorage.getItem('currentPost'));
    const postDetailSection = document.getElementById('postDetail');
    if (post && postDetailSection) {
        postDetailSection.innerHTML = `
            <h2>${post.title}</h2>
            <img src="${post.imageUrl}" alt="${post.title}">
            <p>${post.content}</p>
        `;
    }
}

// عرض المقالات عند تحميل الصفحة
if (window.location.pathname.endsWith('index.html')) {
    updateUI();
    displayPosts();
}

// عرض تفاصيل المقال عند تحميل الصفحة
if (window.location.pathname.endsWith('post_detail.html')) {
    displayPostDetail();
}