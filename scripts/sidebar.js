const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
const toggle = document.getElementById('sidebar-toggle');
let sidebarOpen = false;

function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('visible');
    sidebarOpen = true;
}

function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
    sidebarOpen = false;
}

toggle.addEventListener('click', () => sidebarOpen ? closeSidebar() : openSidebar());
overlay.addEventListener('click', closeSidebar);
