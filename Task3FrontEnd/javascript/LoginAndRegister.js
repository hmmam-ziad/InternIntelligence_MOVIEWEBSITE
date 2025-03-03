

// Register
$(document).ready(function () {
    $('#registerForm').submit(function (event) {
        event.preventDefault();
        var username = $('#username').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var confirmPassword = $('#Confirmpassword').val();

        console.log(username);

        if (username == "" || email == "" || password == "" || confirmPassword == "") {
            $('#message').html("Please fill in all fields");
            return;
        }
        if (password != confirmPassword) {
            $('#message').html("Passwords do not match");
            return;
        }

        $.ajax({
            url: 'https://localhost:7110/api/Account/Register',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username: username,
                email: email,
                password: password
            }),
            success: function (data) {
                console.log(data.message);
                window.location.href = "Login.html";
            },
            error: function (data) {
                console.log(data.message);
                $('#message').html("An error occurred");
            }
        });
    });

});

// Login
$(document).ready(function () {
    $('#loginForm').submit(function (event) {
        event.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();

        if (username == "" || password == "") {
            $('#message').html("Please fill in all fields");
            return;
        }

        $.ajax({
            url: 'https://localhost:7110/api/Account/Login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username: username,
                password: password
            }),
            success: function (data) {
                console.log("Response Data:", data);
                const token = data.token;
                localStorage.setItem("token", token);
                console.log("Token saved:", token);
                window.location.href = "index.html";
            },
            error: function (data) {
                console.log(data.message);
                $('#message').html("An error occurred");
            }
        });
    });
});

$(document).ready(function () {
    const regButton = document.getElementById('regbutton');
    const logButton = document.getElementById('logButton');
    const logoutButton = document.getElementById('outButton');
    if (localStorage.getItem("token") != null) {
        regButton.style.display = "none";
        logButton.style.display = "none";
        logoutButton.style.display = "inline";
        logoutButton.addEventListener('click', function () {
            localStorage.removeItem("token");
            window.location.href = "Login.html";
        });
    }
});