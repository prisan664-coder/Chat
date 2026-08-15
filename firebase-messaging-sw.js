importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// ตั้งค่า Firebase เดียวกันกับหน้าหลัก
firebase.initializeApp({
    apiKey: "AIzaSyBriOzZumxBXSpwL6Kavvyd089UiPzTQfw",
    authDomain: "hukhujai-app.firebaseapp.com",
    databaseURL: "https://hukhujai-app-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hukhujai-app",
    storageBucket: "hukhujai-app.firebasestorage.app",
    messagingSenderId: "536937955261",
    appId: "1:536937955261:web:4a35c99a854a1e58c89cd4"
});

const messaging = firebase.messaging();

// รับการแจ้งเตือนขณะแอปปิดอยู่ (Background Notification)
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);

    const notificationTitle = payload.notification.title || 'มีสายโทรเข้า!';
    const notificationOptions = {
        body: payload.notification.body || 'มีเพื่อนกำลังโทรหาคุณ...',
        icon: '/icon.png', // สามารถใส่ URL รูปไอคอนแอปตรงนี้ได้
        badge: '/icon.png',
        vibrate: [500, 200, 500, 200, 500], // สั่งให้เครื่องสั่นเป็นจังหวะสายเรียกเข้า
        tag: 'incoming-call',
        renotify: true,
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// เมื่อผู้ใช้กดที่การแจ้งเตือนบนหน้าจอล็อก ให้เปิดแอปขึ้นมาทันที
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i];
                    }
                }
                return client.focus();
            }
            return clients.openWindow('/');
        })
    );
});