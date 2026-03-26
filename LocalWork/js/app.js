// Comprehensive Firebase Configuration for LocalWork
const firebaseConfig = {
  apiKey: "AIzaSyBCE-wEx0HO1Bp5dcK8ENYR4SzVAm1c6u4",
  authDomain: "kam-karo-969f2.firebaseapp.com",
  projectId: "kam-karo-969f2",
  storageBucket: "kam-karo-969f2.firebasestorage.app",
  messagingSenderId: "332174894628",
  appId: "1:332174894628:web:a77fb41a09dd21ed745ab1",
  measurementId: "G-GZQ8FFQDCK"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// UI Elements
const sections = ['home', 'post', 'chat', 'payments', 'account'];
const sectionTitle = document.getElementById('section-title');
const jobsContainer = document.getElementById('jobs-container');

let currentHomeTab = 0; // 0: Workers, 1: Jobs
let currentPostType = 1;
let currentChatRoomId = null;
let currentPartnerId = null;
let messageUnsubscribe = null;

// Helper to show errors on screen
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="p-6 text-center">
                <i class="fas fa-exclamation-circle text-red-500 text-3xl mb-2"></i>
                <p class="text-red-500 font-bold text-sm">${message}</p>
                <p class="text-[10px] text-gray-400 mt-2">Check browser console for more details.</p>
            </div>`;
    }
}

// --- Navigation Logic ---
function showSection(sectionId) {
    console.log("Navigating to:", sectionId);
    if (sectionId !== 'home' && !auth.currentUser) {
        showLoginModal();
        return;
    }

    sections.forEach(s => {
        const sec = document.getElementById(`${s}-section`);
        if(sec) sec.classList.add('hidden');
        const navMob = document.getElementById(`nav-${s}-mobile`);
        const navDesk = document.getElementById(`nav-${s}-desktop`);
        if(navMob) navMob.classList.remove('active-link');
        if(navDesk) navDesk.classList.remove('active-link');
    });

    const targetSec = document.getElementById(`${sectionId}-section`);
    if(targetSec) targetSec.classList.remove('hidden');

    const targetMob = document.getElementById(`nav-${sectionId}-mobile`);
    const targetDesk = document.getElementById(`nav-${sectionId}-desktop`);
    if(targetMob) targetMob.classList.add('active-link');
    if(targetDesk) targetDesk.classList.add('active-link');
    
    if (sectionTitle) sectionTitle.innerText = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

    if (sectionId === 'home') fetchHomeData();
    if (sectionId === 'account') { fetchMyJobs(); }
    if (sectionId === 'chat') fetchConversations();
    if (sectionId === 'payments') fetchPayments();
}

// --- Auth Section ---
function showLoginModal() { 
    const modal = document.getElementById('login-modal');
    if (modal) modal.classList.remove('hidden'); 
}
function closeLoginModal() { 
    const modal = document.getElementById('login-modal');
    if (modal) modal.classList.add('hidden'); 
}

async function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
        closeLoginModal();
    } catch (e) {
        console.error("Login Error:", e);
        alert("Login failed: " + e.message);
    }
}

let confirmationResult = null;
async function sendOTP() {
    const phoneInput = document.getElementById('phone-number');
    const phone = phoneInput ? phoneInput.value.trim() : "";
    if (phone.length !== 10) return alert("Enter 10 digit number");
    
    try {
        const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });
        confirmationResult = await auth.signInWithPhoneNumber("+91" + phone, verifier);
        document.getElementById('phone-input-container').classList.add('hidden');
        document.getElementById('otp-input-container').classList.remove('hidden');
    } catch (e) {
        console.error("OTP Error:", e);
        alert("Error: " + e.message);
    }
}

async function verifyOTP() {
    const otpInput = document.getElementById('otp-code');
    const code = otpInput ? otpInput.value.trim() : "";
    try {
        await confirmationResult.confirm(code);
        closeLoginModal();
    } catch (e) {
        alert("Invalid OTP");
    }
}

// --- Home & Data Logic ---
function switchHomeTab(type) {
    currentHomeTab = type;
    const tabWorkers = document.getElementById('tab-workers');
    const tabJobs = document.getElementById('tab-jobs');
    if (tabWorkers) tabWorkers.className = type === 0 ? 'flex-1 py-3 rounded-xl font-black transition text-sm tab-active uppercase tracking-widest' : 'flex-1 py-3 rounded-xl font-black transition text-sm text-gray-500 hover:text-gray-700 uppercase tracking-widest';
    if (tabJobs) tabJobs.className = type === 1 ? 'flex-1 py-3 rounded-xl font-black transition text-sm tab-active uppercase tracking-widest' : 'flex-1 py-3 rounded-xl font-black transition text-sm text-gray-500 hover:text-gray-700 uppercase tracking-widest';
    fetchHomeData();
}

async function fetchHomeData() {
    if (!jobsContainer) return;
    jobsContainer.innerHTML = '<div class="flex justify-center p-10 col-span-full"><i class="fas fa-circle-notch fa-spin text-3xl text-blue-600"></i></div>';
    
    try {
        console.log("Fetching jobs for postType:", currentHomeTab);
        const snapshot = await db.collection('jobs')
            .where('postType', '==', currentHomeTab)
            .orderBy('timestamp', 'desc')
            .limit(50)
            .get();
        
        jobsContainer.innerHTML = '';
        if (snapshot.empty) {
            jobsContainer.innerHTML = '<div class="col-span-full text-center py-10 text-gray-400 font-bold">No posts found yet.</div>';
            return;
        }

        snapshot.forEach(doc => {
            const item = doc.data();
            jobsContainer.innerHTML += `
                <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer group" onclick="showJobDetails('${doc.id}')">
                    <div class="flex items-center mb-4">
                        <img src="${item.posterPhotoUrl || 'https://via.placeholder.com/40'}" class="w-12 h-12 rounded-2xl mr-4 object-cover border-2 border-white shadow-sm">
                        <div class="flex-1">
                            <h4 class="font-bold text-gray-800 group-hover:text-blue-600 transition">${item.title}</h4>
                            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">${item.category} • ${item.posterName}</p>
                        </div>
                        ${item.isVerified ? '<i class="fas fa-check-circle text-blue-500"></i>' : ''}
                    </div>
                    <p class="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">${item.description}</p>
                    <div class="flex justify-between items-center pt-4 border-t border-gray-50">
                        <span class="text-blue-600 font-black text-lg">₹ ${item.expectedRate || 'Negotiable'}</span>
                        <span class="text-[10px] bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-black uppercase tracking-tighter">${item.workMode || 'On-site'}</span>
                    </div>
                </div>`;
        });
    } catch (e) {
        console.error("Home Data Error:", e);
        showError('jobs-container', "Failed to load jobs. " + e.message);
    }
}

function filterHomeData() {
    const searchInput = document.getElementById('home-search');
    const search = searchInput ? searchInput.value.toLowerCase() : "";
    const items = jobsContainer.getElementsByClassName('group');
    Array.from(items).forEach(item => {
        const text = item.innerText.toLowerCase();
        item.style.display = text.includes(search) ? 'block' : 'none';
    });
}

async function showJobDetails(id) {
    try {
        const doc = await db.collection('jobs').doc(id).get();
        if (!doc.exists) return;
        const job = doc.data();
        const modalContent = document.getElementById('modal-content');
        if (!modalContent) return;

        modalContent.innerHTML = `
            <div class="flex items-center gap-4 mb-6">
                <img src="${job.posterPhotoUrl || 'https://via.placeholder.com/60'}" class="w-16 h-16 rounded-[24px] object-cover shadow-lg">
                <div>
                    <h3 class="text-xl font-black text-gray-800">${job.title}</h3>
                    <p class="text-xs font-black text-blue-500 uppercase tracking-widest">${job.category}</p>
                </div>
            </div>
            <div class="space-y-4 text-gray-600 text-sm leading-relaxed mb-6">
                <p>${job.description}</p>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-50 p-3 rounded-2xl">
                        <p class="text-[8px] font-black uppercase text-gray-400">Budget / Rate</p>
                        <p class="font-black text-gray-800 text-lg">₹ ${job.expectedRate}</p>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-2xl">
                        <p class="text-[8px] font-black uppercase text-gray-400">Location</p>
                        <p class="font-bold text-gray-800">${job.address || 'Not specified'}</p>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>Posted by ${job.posterName}</span>
                <span>${job.timestamp ? new Date(job.timestamp.toDate()).toLocaleDateString() : 'Just now'}</span>
            </div>
        `;

        const actionBtn = document.getElementById('modal-action-btn');
        if (actionBtn) {
            if (auth.currentUser && auth.currentUser.uid === job.userId) {
                actionBtn.innerText = "Delete Post";
                actionBtn.className = "flex-[2] py-4 bg-red-50 text-red-600 rounded-2xl font-black uppercase tracking-widest";
                actionBtn.onclick = () => { if(confirm("Delete this post?")) deleteJob(id).then(() => closeModal()); };
            } else {
                actionBtn.innerText = "Message " + (job.posterName ? job.posterName.split(' ')[0] : "User");
                actionBtn.className = "flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 uppercase tracking-widest";
                actionBtn.onclick = () => {
                    closeModal();
                    startChat(job.userId, job.posterName, job.posterPhotoUrl);
                };
            }
        }

        const modal = document.getElementById('job-modal');
        if (modal) modal.classList.remove('hidden');
    } catch (e) {
        console.error("Error showing details:", e);
    }
}

function closeModal() { 
    const modal = document.getElementById('job-modal');
    if (modal) modal.classList.add('hidden'); 
}

// --- Post Logic ---
function setPostType(type) {
    currentPostType = type;
    const postValue = document.getElementById('post-type-value');
    if (postValue) postValue.value = type;
    
    const btnJob = document.getElementById('post-type-job');
    const btnWorker = document.getElementById('post-type-worker');
    if (btnJob) btnJob.className = type === 1 ? 'flex-1 py-3 bg-white rounded-xl shadow-sm text-blue-600 font-black uppercase text-xs tracking-widest transition' : 'flex-1 py-3 text-gray-400 font-black uppercase text-xs tracking-widest transition';
    if (btnWorker) btnWorker.className = type === 0 ? 'flex-1 py-3 bg-white rounded-xl shadow-sm text-blue-600 font-black uppercase text-xs tracking-widest transition' : 'flex-1 py-3 text-gray-400 font-black uppercase text-xs tracking-widest transition';
    
    const rateLabel = document.getElementById('rate-label');
    if (rateLabel) rateLabel.innerText = type === 1 ? 'Budget (₹)' : 'Expected Rate (₹)';
}

document.getElementById('job-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return showLoginModal();

    const btn = e.target.querySelector('button[type="submit"]');
    if (!btn) return;
    btn.disabled = true;
    btn.innerText = "Posting...";

    try {
        const jobData = {
            userId: user.uid,
            title: document.getElementById('job-title').value,
            category: document.getElementById('job-category').value,
            expectedRate: document.getElementById('job-rate').value,
            description: document.getElementById('job-desc').value,
            postType: currentPostType,
            posterName: user.displayName || "Anonymous",
            posterPhotoUrl: user.photoURL || "",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            isVerified: false
        };

        await db.collection('jobs').add(jobData);
        alert("Post Successful!");
        e.target.reset();
        showSection('home');
    } catch (err) {
        console.error("Post Error:", err);
        alert("Post failed: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "Submit Post";
    }
});

// --- Chat Logic ---
function startChat(partnerId, partnerName, partnerPhoto) {
    if (!auth.currentUser) return showLoginModal();
    const roomId = getChatRoomId(auth.currentUser.uid, partnerId);
    showSection('chat');
    openChat(roomId, partnerId, partnerName, partnerPhoto);
}

function getChatRoomId(uid1, uid2) {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}

async function fetchConversations() {
    const user = auth.currentUser;
    if (!user) return;
    const container = document.getElementById('conversations-list');
    if (!container) return;
    
    container.innerHTML = '<div class="flex justify-center p-10"><i class="fas fa-circle-notch fa-spin text-blue-600 text-2xl"></i></div>';

    try {
        // Listening for updates to chat list
        db.collection('chats').where('participants', 'array-contains', user.uid)
            .orderBy('lastMessageTimestamp', 'desc')
            .onSnapshot(snapshot => {
                container.innerHTML = '';
                if (snapshot.empty) {
                    container.innerHTML = '<p class="text-center text-gray-400 py-10 text-xs font-bold">No messages yet. Start a conversation!</p>';
                    return;
                }
                snapshot.forEach(doc => {
                    const chat = doc.data();
                    const partnerId = chat.participants.find(p => p !== user.uid);
                    const partnerName = (chat.names && chat.names[partnerId]) || "User";
                    
                    container.innerHTML += `
                        <div class="flex items-center p-4 hover:bg-gray-50 cursor-pointer rounded-2xl transition group border-b border-gray-50" onclick="openChat('${doc.id}', '${partnerId}', '${partnerName}')">
                            <img src="${chat.photoUrls ? chat.photoUrls[partnerId] : 'https://via.placeholder.com/40'}" class="w-12 h-12 rounded-full mr-4 object-cover border">
                            <div class="flex-1 min-w-0">
                                <div class="flex justify-between items-center mb-1">
                                    <h4 class="font-black text-gray-800 text-sm truncate">${partnerName}</h4>
                                    <span class="text-[8px] text-gray-400 font-bold">${chat.lastMessageTimestamp ? new Date(chat.lastMessageTimestamp.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                                </div>
                                <p class="text-xs text-gray-400 truncate font-bold">${chat.lastMessage || 'Sent a message'}</p>
                            </div>
                        </div>`;
                });
            }, err => {
                console.error("Chat list error:", err);
                showError('conversations-list', "Failed to load chats: " + err.message);
            });
    } catch (e) {
        console.error("Fetch conv error:", e);
        showError('conversations-list', "Error: " + e.message);
    }
}

function openChat(roomId, partnerId, partnerName, partnerPhoto) {
    currentChatRoomId = roomId;
    currentPartnerId = partnerId;

    const listContainer = document.getElementById('conversations-list-container');
    const windowContainer = document.getElementById('chat-window');
    
    if (listContainer) listContainer.classList.add('hidden', 'md:flex');
    if (windowContainer) {
        windowContainer.classList.remove('hidden');
        windowContainer.classList.add('flex');
    }
    
    const nameEl = document.getElementById('chat-partner-name');
    const imgEl = document.getElementById('chat-partner-img');
    if (nameEl) nameEl.innerText = partnerName;
    if (imgEl) imgEl.src = partnerPhoto || 'https://via.placeholder.com/40';

    listenForMessages(roomId);
}

function backToConversations() {
    document.getElementById('conversations-list-container')?.classList.remove('hidden');
    document.getElementById('chat-window')?.classList.add('hidden');
    if (messageUnsubscribe) messageUnsubscribe();
}

function listenForMessages(roomId) {
    if (messageUnsubscribe) messageUnsubscribe();
    const container = document.getElementById('messages-container');
    if (!container) return;
    
    container.innerHTML = '<div class="flex-1 flex items-center justify-center"><i class="fas fa-circle-notch fa-spin text-blue-600 text-xl"></i></div>';

    messageUnsubscribe = db.collection('chats').doc(roomId).collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot(snapshot => {
            container.innerHTML = '';
            if (snapshot.empty) {
                container.innerHTML = '<div class="flex-1 flex flex-col justify-center items-center text-gray-400 italic text-sm"><p>Start the conversation...</p></div>';
            }
            snapshot.forEach(doc => {
                const msg = doc.data();
                const isMe = msg.senderId === auth.currentUser.uid;
                
                container.innerHTML += `
                    <div class="flex ${isMe ? 'justify-end' : 'justify-start'} mb-4">
                        <div class="${isMe ? 'bg-blue-600 text-white rounded-t-2xl rounded-bl-2xl' : 'bg-white text-gray-800 rounded-t-2xl rounded-br-2xl border'} p-4 max-w-[85%] shadow-sm">
                            <p class="text-sm font-bold">${msg.text}</p>
                            <p class="text-[8px] mt-2 opacity-50 font-black uppercase text-right">${msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}</p>
                        </div>
                    </div>`;
            });
            container.scrollTop = container.scrollHeight;
        }, err => {
            console.error("Messages Error:", err);
            showError('messages-container', "Error loading messages: " + err.message);
        });
}

async function sendMessage() {
    const input = document.getElementById('message-input');
    const text = input ? input.value.trim() : "";
    if (!text || !currentChatRoomId) return;

    if (input) input.value = '';
    const user = auth.currentUser;
    const partnerId = currentPartnerId;
    
    try {
        const message = {
            text: text,
            senderId: user.uid,
            status: 'sent',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        const chatMetadata = {
            lastMessage: text,
            lastMessageTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
            participants: [user.uid, partnerId],
            names: {
                [user.uid]: user.displayName || 'User',
                [partnerId]: document.getElementById('chat-partner-name').innerText
            }
        };

        const batch = db.batch();
        const chatRef = db.collection('chats').doc(currentChatRoomId);
        const msgRef = chatRef.collection('messages').doc();

        batch.set(chatRef, chatMetadata, { merge: true });
        batch.set(msgRef, message);
        await batch.commit();
    } catch (err) {
        console.error("Send Error:", err);
        alert("Failed to send message: " + err.message);
    }
}

// --- Payments Logic ---
async function fetchPayments() {
    const user = auth.currentUser;
    if (!user) return;
    const container = document.getElementById('payments-list');
    if (!container) return;
    
    container.innerHTML = '<div class="flex justify-center p-10"><i class="fas fa-circle-notch fa-spin text-blue-600"></i></div>';

    try {
        db.collection('payments')
            .where('toUserId', '==', user.uid)
            .orderBy('timestamp', 'desc')
            .onSnapshot(snapshot => {
                container.innerHTML = '';
                if (snapshot.empty) {
                    container.innerHTML = '<p class="text-center text-gray-400 py-10 text-xs font-bold italic">No transactions yet.</p>';
                    return;
                }
                snapshot.forEach(doc => {
                    const p = doc.data();
                    container.innerHTML += `
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-2">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                    <i class="fas fa-arrow-down text-xs"></i>
                                </div>
                                <div>
                                    <h4 class="font-black text-gray-800 text-sm">From ${p.fromUserName || 'Client'}</h4>
                                    <p class="text-[10px] text-gray-400 font-bold uppercase">${p.timestamp ? new Date(p.timestamp.toDate()).toLocaleDateString() : 'Recent'}</p>
                                </div>
                            </div>
                            <span class="text-green-600 font-black">+₹${p.amount}</span>
                        </div>`;
                });
            }, err => {
                console.error("Payment error:", err);
                showError('payments-list', "Failed to load transactions: " + err.message);
            });
    } catch (e) {
        console.error("Payments Error:", e);
    }
}

// --- Profile Logic ---
async function updateProfile() {
    const user = auth.currentUser;
    if (!user) return;

    const btn = document.getElementById('save-profile-btn');
    if (btn) {
        btn.innerText = "Syncing with App...";
        btn.disabled = true;
    }

    try {
        const profileData = {
            userId: user.uid,
            name: document.getElementById('edit-name').value,
            phoneNumber: document.getElementById('edit-phone').value,
            email: document.getElementById('edit-email').value,
            address: document.getElementById('edit-address').value,
            pincode: document.getElementById('edit-pincode').value,
            isWorker: document.getElementById('worker-mode-toggle').checked,
            education: document.getElementById('edit-education').value,
            experience: document.getElementById('edit-experience').value,
            skills: document.getElementById('edit-skills').value,
            bio: document.getElementById('edit-bio').value,
        };

        await db.collection('profiles').doc(user.uid).set(profileData, { merge: true });
        await user.updateProfile({ displayName: profileData.name });
        alert("Profile Synced! You can access this in your App now.");
    } catch (err) {
        alert("Sync failed: " + err.message);
    } finally {
        if (btn) {
            btn.innerText = "Save Changes";
            btn.disabled = false;
        }
    }
}

async function uploadProfilePicture(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const user = auth.currentUser;
    const storageRef = storage.ref(`profiles/${user.uid}`);

    const largeImg = document.getElementById('profile-large-img');
    if (largeImg) largeImg.style.opacity = "0.5";

    try {
        await storageRef.put(file);
        const url = await storageRef.getDownloadURL();

        await db.collection('profiles').doc(user.uid).update({ photoUrl: url });
        await user.updateProfile({ photoURL: url });

        if (largeImg) {
            largeImg.src = url;
            largeImg.style.opacity = "1";
        }
        const userImg = document.getElementById('user-img');
        if (userImg) userImg.src = url;
    } catch (e) {
        alert("Upload failed: " + e.message);
        if (largeImg) largeImg.style.opacity = "1";
    }
}

function toggleWorkerFields(checked) {
    const fields = document.getElementById('worker-details-fields');
    if (fields) fields.classList.toggle('hidden', !checked);
}

async function detectLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await res.json();
                const addrEl = document.getElementById('edit-address');
                const pinEl = document.getElementById('edit-pincode');
                if (addrEl) addrEl.value = data.display_name;
                if (pinEl) pinEl.value = data.address.postcode || "";
            } catch (e) {
                console.error("Location Error:", e);
            }
        });
    }
}

// --- ID Card Logic ---
function showIDCard() {
    const user = auth.currentUser;
    if (!user) return;
    const modal = document.getElementById('id-card-modal');
    if (modal) modal.classList.remove('hidden');
    
    const nameEl = document.getElementById('id-card-name');
    const imgEl = document.getElementById('id-card-img');
    const numEl = document.getElementById('id-card-number');
    
    const editName = document.getElementById('edit-name');
    const largeImg = document.getElementById('profile-large-img');
    
    if (nameEl) nameEl.innerText = (editName ? editName.value : "") || user.displayName || "User";
    if (imgEl && largeImg) imgEl.src = largeImg.src;
    if (numEl) numEl.innerText = "LW-" + user.uid.substring(0, 8).toUpperCase();
}

function closeIDCard() { 
    const modal = document.getElementById('id-card-modal');
    if (modal) modal.classList.add('hidden'); 
}

// --- Initialization & Real-time Sync ---
auth.onAuthStateChanged(async user => {
    console.log("Auth State Changed. User:", user ? user.uid : "Logged Out");
    if (user) {
        db.collection('profiles').doc(user.uid).onSnapshot(doc => {
            const profile = doc.data() || {};

            const uName = document.getElementById('user-name');
            const accName = document.getElementById('acc-display-name');
            const uImg = document.getElementById('user-img');
            const pLargeImg = document.getElementById('profile-large-img');

            if (uName) uName.innerText = profile.name || user.displayName || "User";
            if (accName) accName.innerText = profile.name || user.displayName || "User";
            if (uImg) uImg.src = profile.photoUrl || user.photoURL || "https://via.placeholder.com/40";
            if (pLargeImg) pLargeImg.src = profile.photoUrl || user.photoURL || "https://via.placeholder.com/120";

            if (document.getElementById('edit-name')) document.getElementById('edit-name').value = profile.name || user.displayName || "";
            if (document.getElementById('edit-phone')) document.getElementById('edit-phone').value = profile.phoneNumber || user.phoneNumber || "";
            if (document.getElementById('edit-email')) document.getElementById('edit-email').value = profile.email || user.email || "";
            if (document.getElementById('edit-address')) document.getElementById('edit-address').value = profile.address || "";
            if (document.getElementById('edit-pincode')) document.getElementById('edit-pincode').value = profile.pincode || "";

            const isWorker = profile.isWorker || false;
            const toggle = document.getElementById('worker-mode-toggle');
            if (toggle) toggle.checked = isWorker;
            toggleWorkerFields(isWorker);

            if (document.getElementById('edit-education')) document.getElementById('edit-education').value = profile.education || "";
            if (document.getElementById('edit-experience')) document.getElementById('edit-experience').value = profile.experience || "";
            if (document.getElementById('edit-skills')) document.getElementById('edit-skills').value = profile.skills || "";
            if (document.getElementById('edit-bio')) document.getElementById('edit-bio').value = profile.bio || "";

            const ratingStat = document.getElementById('stat-rating');
            if (ratingStat) ratingStat.innerText = (profile.averageRating || 0).toFixed(1);

            let completion = 0;
            if (profile.name) completion += 20;
            if (profile.photoUrl) completion += 20;
            if (profile.phoneNumber) completion += 20;
            if (profile.address) completion += 20;
            if (profile.bio) completion += 20;

            const bar = document.getElementById('completion-bar');
            const text = document.getElementById('completion-text');
            if (bar) bar.style.width = completion + '%';
            if (text) text.innerText = completion + '%';
        }, err => {
            console.error("Profile Snapshot Error:", err);
        });

        closeLoginModal();
    } else {
        showSection('home');
    }
});

async function fetchMyJobs() {
    const user = auth.currentUser;
    if (!user) return;
    const container = document.getElementById('account-myjobs-list');
    if (!container) return;
    
    container.innerHTML = '<div class="flex justify-center p-6"><i class="fas fa-circle-notch fa-spin text-blue-600"></i></div>';
    
    try {
        const snapshot = await db.collection('jobs').where('userId', '==', user.uid).get();
        let html = '';
        snapshot.forEach(doc => {
            const job = doc.data();
            html += `
                <div class="bg-gray-50 p-4 rounded-2xl border flex justify-between items-center group mb-2">
                    <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-gray-800 text-sm truncate">${job.title}</h4>
                        <p class="text-[9px] text-blue-500 font-black uppercase tracking-widest">${job.postType === 0 ? 'Worker Profile' : 'Job Post'}</p>
                    </div>
                    <button onclick="deleteJob('${doc.id}')" class="ml-4 p-2 text-gray-300 hover:text-red-500 transition"><i class="fas fa-trash-alt text-xs"></i></button>
                </div>`;
        });
        container.innerHTML = html || '<p class="text-center text-gray-400 py-6 text-xs font-bold italic">No posts found.</p>';
        const statPosts = document.getElementById('stat-posts');
        if (statPosts) statPosts.innerText = snapshot.size;
    } catch (err) {
        console.error("MyJobs error:", err);
        container.innerHTML = '<p class="text-center text-gray-400 py-6 text-xs">Failed to load posts.</p>';
    }
}

async function deleteJob(jobId) {
    try {
        await db.collection('jobs').doc(jobId).delete();
        fetchMyJobs();
    } catch (err) {
        alert("Delete failed.");
    }
}

function logout() { 
    if(confirm("Logout from account?")) {
        auth.signOut().then(() => {
            window.location.reload();
        });
    }
}

// Global Message Handler for Modal Action
window.sendMessage = sendMessage;

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    showSection('home');
});
