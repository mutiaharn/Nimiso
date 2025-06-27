document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessageDiv = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Mencegah form submit dan reload halaman

        const username = usernameInput.value;
        const password = passwordInput.value;

        // --- BAGIAN INI SANGAT PENTING: SIMULASI PANGGILAN KE SERVER (BACKEND) ---
        // Di aplikasi nyata, Anda akan mengirim permintaan POST ke server di sini.
        // Contoh dengan fetch API (JavaScript Vanilla untuk AJAX):
        /*
        fetch('/api/login', { // Ganti '/api/login' dengan URL endpoint login di server Anda
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        })
        .then(response => {
            if (response.ok) { // Jika respons status 200-299
                return response.json(); // Atau response.text() tergantung balasan server
            }
            throw new Error('Login Gagal'); // Tangkap error untuk status non-ok
        })
        .then(data => {
            // Jika login berhasil
            // Server Anda HARUS mengirimkan instruksi untuk redirect atau set cookie
            // Di sini kita langsung redirect ke index.html
            window.location.href = 'index.html'; // REDIRECT KE INDEX.HTML
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessageDiv.textContent = 'Nama pengguna atau kata sandi salah.';
            errorMessageDiv.style.display = 'block';
        });
        */

        // --- SIMULASI LOGIN BERHASIL/GAGAL (UNTUK DEMO TANPA BACKEND) ---
        // Hapus blok ini jika Anda sudah punya backend
        if (username === 'admin' && password === 'password123') { // Contoh kredensial
            errorMessageDiv.style.display = 'none';
            // Langsung redirect ke halaman dashboard (index.html)
            window.location.href = 'index.html';
        } else {
            errorMessageDiv.textContent = 'Nama pengguna atau kata sandi salah.';
            errorMessageDiv.style.display = 'block';
        }
        // --- AKHIR SIMULASI ---
    });
});