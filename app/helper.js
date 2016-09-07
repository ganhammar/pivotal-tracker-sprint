(function () {
    function Helper () {
    }

    Helper.prototype.showError = function (message) {
        document.getElementById("error-message").innerHTML = message;

        var errorElement = document.getElementById("error");
        errorElement.style.display = "block";
        errorElement.classList.add("visible");

        setTimeout(function () {
            errorElement.classList.remove("visible");
        }, 5000);
    };

    String.prototype.ucfirst = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    window.helper = new Helper();
}());