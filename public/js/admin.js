const deleteProduct = (btn, currentPage) => {
    const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
    const productId = btn.parentNode.querySelector("[name=productId]").value;

    fetch("/admin/products/" + productId, {
        method: "DELETE",
        headers: {
            "csrf-token": csrf,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            if (result.msg === "success") {
                btn.closest("li.product-card").remove();
                const productsLeft =
                    document.querySelectorAll("li.product-card").length;
                if (productsLeft === 0) {
                    // Load previous page if current page is now empty
                    window.location.href = "?page=" + (currentPage - 1);
                }
            } else {
                return;
            }
        });
};
