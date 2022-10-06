$(document).ready(function() {
    const login_status = is_logged_in();
    login_status.then((status) => {
        if (!status) {
            location.href = 'index.html'
        }
    });
});