(function () {
    function Helper () {
    }

    Helper.prototype.showError = function (message) {
        document.getElementById("error-message").innerHTML = message;

        var errorElement = document.getElementById("error");
        errorElement.style.display = "block";

        setTimeout(function () {
            errorElement.style.display = "none";
        }, 2000);
    };

    Helper.prototype.ucfirst = function (string) {
        return typeof string === "string"
            ? string.charAt(0).toUpperCase() + string.slice(1)
            : "";
    };

    window.helper = new Helper();
}());