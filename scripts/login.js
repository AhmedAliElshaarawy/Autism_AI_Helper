setTimeout(() => {
  document.querySelector('.loader-container').style.display = 'none';
}, 3000);

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('.login-button');
  
    loginButton.addEventListener('click', (event) => {
      event.preventDefault();
  
      const username = document.querySelector('.username').value;
      const password = document.querySelector('.password').value;
  
      // Fetch the registration data from JSON Server
      fetch('http://localhost:3000/registrations')
        .then(response => response.json())
        .then(data => {
          const user = data.find(user => user.username === username && user.password === password);
  
          if (user) {
            console.log('Login successful:', user);
            window.location.href = '../views/home.html';
          } else {
            console.error('Login failed: Invalid credentials');
            alert('Login failed. Please check your username and password.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('An error occurred during login.');
        });
    });
  });
  
  document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const closeSidebar = document.querySelector('.close-sidebar');
    const overlay = document.querySelector('.overlay');

    function openSidebar() {
      sidebar.classList.add('open');
      overlay.classList.add('show');
    }

    function closeSidebarFunc() {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    }

    hamburger.addEventListener('click', openSidebar);
    closeSidebar.addEventListener('click', closeSidebarFunc);
    overlay.addEventListener('click', closeSidebarFunc);

    // Prevent clicks inside the sidebar from closing it
    sidebar.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  });