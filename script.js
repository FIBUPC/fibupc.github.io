/**
 * Created by florencia.rimolo on 13/07/2017.
 */
(function () {
    var stateKey = 'random_state_key';

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    /**
     * Generates a random string containing numbers and letters
     * @param  {number} length The length of the string
     * @return {string} The generated string
     */
    function generateRandomString(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }


    var params = getHashParams();
    var access_token = params.access_token,
        state = params.state,
        storedState = localStorage.getItem(stateKey);
    if (access_token && (state == null || state !== storedState)) {
        alert('There was an error during the authentication');
    } else {
        localStorage.removeItem(stateKey);
        if (access_token) {
            $.ajax({
                url: 'https://api.fib.upc.edu/v2/jo/',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    console.log(response);
                    $('#nom').text(response.nom);
                    $('#cognoms').text(response.cognoms);
                    $('#login').hide();
                    $('#loggedin').show();
                }
            });
        } else {
            $('#login').show();
            $('#loggedin').hide();
        }
        document.getElementById('login-button').addEventListener('click', function () {
            var client_id = 'qkjc7gxze3oEWTfhw8JCkLikyo7p1pZZz9JjsA4w'; // Your client id
            var state = generateRandomString(16);
            localStorage.setItem(stateKey, state);
            var url = 'https://api.fib.upc.edu/v2/o/authorize/';
            url += '?client_id=' + encodeURIComponent(client_id);
            url += '&response_type=token';
            url += '&state=' + encodeURIComponent(state);
            window.location = url;
        }, false);
    }
})();