$(document).ready(function() {
    const login_status = is_logged_in();
    login_status.then((status) => {
        if (status && localStorage.getItem('token') && localStorage.getItem('user')) {
            location.href = 'application.html'
        }
    });
});