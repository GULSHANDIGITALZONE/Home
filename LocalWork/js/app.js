// Updated Firebase Configuration provided by user
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// UI Elements
const sections = ['home', 'post', 'chat', 'account'];
const sectionTitle = document.getElementById('section-title');
const jobsContainer = document.getElementById('jobs-container');

// Navigation Logic
function showSection(sectionId) {
    sections.forEach(s => {
        document.getElementById(`${s}-section`).classList.add('hidden');
        document.getElementById(`nav-${s}-mobile`).classList.remove('active-link');
        document.getElementById(`nav-${s}-desktop`).classList.remove('active-link');
    });

    document.getElementById(`${sectionId}-section`).classList.remove('hidden');
    document.getElementById(`nav-${sectionId}-mobile`).classList.add('active-link');
    document.getElementById(`nav-${sectionId}-desktop`).classList.add('active-link');
    
    sectionTitle.innerText = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

    if (sectionId === 'home') fetchJobs();
    if (sectionId === 'chat') fetchConversations();
}

// Fetch Jobs from Firestore
async function fetchJobs() {
    jobsContainer.innerHTML = '<div class="flex justify-center p-10"><i class="fas fa-circle-notch fa-spin text-3xl text-blue-600"></i></div>';
    try {
        const snapshot = await db.collection('jobs')
            .orderBy('timestamp', 'desc')
            .limit(20)
            .get();

        jobsContainer.innerHTML = '';
        if (snapshot.empty) {
            jobsContainer.innerHTML = '<div class="text-center py-20 text-gray-500"><i class="fas fa-briefcase text-5xl mb-4 block"></i> No jobs found.</div>';
            return;
        }

        snapshot.forEach(doc => {
            const job = doc.data();
            const jobCard = `
                <div class="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer" onclick="showJobDetails('${doc.id}')">
                    <div class="flex items-center mb-3">
                        <img src="${job.posterPhotoUrl || 'https://via.placeholder.com/40'}" class="w-10 h-10 rounded-full mr-3 object-cover border">
                        <div>
                            <h4 class="font-bold text-gray-800">${job.title}</h4>
                            <p class="text-xs text-gray-500">${job.posterName} • ${job.category}</p>
                        </div>
                    </div>
                    <p class="text-sm text-gray-600 line-clamp-2">${job.description}</p>
                    <div class="mt-3 flex justify-between items-center">
                        <span class="text-blue-600 font-bold text-sm">₹ ${job.expectedRate || 'Negotiable'}</span>
                        <div class="flex gap-2">
                            <span class="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-full uppercase font-bold">${job.workMode}</span>
                            ${job.isVerified ? '<span class="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full uppercase font-bold"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
                        </div>
                    </div>
                </div>
            `;
            jobsContainer.innerHTML += jobCard;
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        jobsContainer.innerHTML = '<p class="text-center text-red-500 py-10">Error loading jobs. Make sure Firestore rules allow reading.</p>';
    }
}

// Google Login Logic
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(error => {
        alert("Login failed: " + error.message);
    });
}

// Auth State Observer
auth.onAuthStateChanged(async user => {
    const userProfileDiv = document.getElementById('user-profile');
    if (user) {
        document.getElementById('user-name').innerText = user.displayName || 'User';
        document.getElementById('user-img').src = user.photoURL || 'https://via.placeholder.com/40';
        
        // Update Account Section
        document.getElementById('profile-name').innerText = user.displayName || 'User';
        document.getElementById('profile-large-img').src = user.photoURL || 'https://via.placeholder.com/120';
        
        // Sync Profile to Firestore
        await db.collection('profiles').doc(user.uid).set({
            userId: user.uid,
            name: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

    } else {
        userProfileDiv.innerHTML = `
            <button onclick="loginWithGoogle()" class="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700 transition">
                <i class="fab fa-google mr-2"></i> Sign In
            </button>
        `;
        document.getElementById('profile-name').innerText = "Guest User";
    }
});

function logout() {
    if(confirm("Are you sure you want to logout?")) {
        auth.signOut().then(() => location.reload());
    }
}

// Post Job Logic
document.getElementById('job-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
        alert("Please login to post a job");
        loginWithGoogle();
        return;
    }

    const title = e.target[0].value;
    const description = e.target[1].value;

    if(!title || !description) return alert("Please fill all fields");

    try {
        await db.collection('jobs').add({
            userId: user.uid,
            posterName: user.displayName,
            posterPhotoUrl: user.photoURL,
            title: title,
            description: description,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            postType: 1, 
            isVerified: false,
            workMode: "On-site",
            category: "General"
        });
        alert("Job posted successfully!");
        e.target.reset();
        showSection('home');
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// Chat Logic (Basic)
async function fetchConversations() {
    const user = auth.currentUser;
    const chatContainer = document.getElementById('chat-section');
    if (!user) {
        chatContainer.innerHTML = '<div class="text-center py-20"><p class="mb-4">Please login to see chats</p><button onclick="loginWithGoogle()" class="bg-blue-600 text-white px-6 py-2 rounded">Login</button></div>';
        return;
    }

    chatContainer.innerHTML = '<div class="p-4 text-center text-gray-500">Loading conversations...</div>';
    
    try {
        const snapshot = await db.collection('conversations')
            .where('participants', 'array-contains', user.uid)
            .get();

        if (snapshot.empty) {
            chatContainer.innerHTML = '<div class="text-center py-20 text-gray-500"><i class="fas fa-comments text-5xl mb-4 block"></i> No conversations yet.</div>';
            return;
        }

        let html = '<div class="divide-y">';
        snapshot.forEach(doc => {
            const conv = doc.data();
            html += `
                <div class="p-4 flex items-center hover:bg-gray-100 cursor-pointer">
                    <img src="https://via.placeholder.com/40" class="w-12 h-12 rounded-full mr-4">
                    <div class="flex-1">
                        <h4 class="font-bold">Chat with ID: ${doc.id.substring(0,8)}...</h4>
                        <p class="text-sm text-gray-500 truncate">${conv.lastMessage || 'No messages'}</p>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        chatContainer.innerHTML = html;
    } catch (e) {
        chatContainer.innerHTML = '<p class="p-4 text-red-500">Error loading chats.</p>';
    }
}

// Initial Load
showSection('home');
