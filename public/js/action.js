document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navOverlay = document.getElementById("nav-overlay");

    if (menuToggle && navOverlay) {
        menuToggle.addEventListener("click", () => {
            navOverlay.classList.toggle("show");
        });

        navOverlay.addEventListener("click", () => {
            navOverlay.classList.toggle("show");
        });

        document.querySelectorAll(".nav-overlay a").forEach((link) => {
            link.addEventListener("click", () => {
                navOverlay.classList.remove("show");
            });
        });
    }
});
