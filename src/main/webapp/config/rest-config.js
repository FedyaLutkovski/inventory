app.config(function (RestangularProvider) {
    RestangularProvider.setBaseUrl('http://localhost:8080/');
    // RestangularProvider.setBaseUrl('http://m-inventory:8080/');
    RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
});
