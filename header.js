
function setupHamburgerMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) { 
        console.log("Tìm thấy #menuToggle và #mainNav. Menu sẵn sàng."); 
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active'); 
            menuToggle.classList.toggle('open'); 
        });
    } else {
        console.error("LỖI: KHÔNG TÌM THẤY MENU SAU KHI FETCH. KIỂM TRA ID TRONG header.html"); 
    }
}

window.setupHamburgerMenu = setupHamburgerMenu;
