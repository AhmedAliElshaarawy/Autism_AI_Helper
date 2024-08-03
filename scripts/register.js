setTimeout(() => {
  document.querySelector('.loader-container').style.display = 'none';
}, 3000);

document.addEventListener('DOMContentLoaded', () => {
  const registerButton = document.querySelector('.login-button');

  registerButton.addEventListener('click', (event) => {
    event.preventDefault();

    const username = document.querySelector('.username').value;
    const password = document.querySelector('.password').value;
    const email = document.querySelector('.email').value;
    const number = document.querySelector('.number').value;
    const fullname = document.querySelector('.fullname').value;

    const registrationData = {
      username,
      password,
      email,
      number,
      fullname
    };

    fetch('http://localhost:3000/registrations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Registration successful:', data);
        window.location.href = 'login.html';
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Registration failed.');
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