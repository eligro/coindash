
var defaults = {
    urls: [
        '*://poloniex.com/tradingApi*',
        '*://coinmarketcap.northpole.ro/*'] //['*://!*!/!*']
}

var version = chrome.app.getDetails().version;

var responseHeaders = [
    {
        name: 'Access-Control-Allow-Origin',
        value: '*'
    },
    {
        name: 'Access-Control-Allow-Headers',
        value: 'key, sign'
    },
    {
        name: 'Access-Control-Allow-Methods',
        value: 'POST, GET, OPTIONS, PUT, DELETE'
    },
    {
        name: 'Allow',
        value: 'POST, GET, OPTIONS, PUT, DELETE'
    }];


function handleRequest() {
    //console.log('handleRequest', arguments);
}

function handleRespone(res) {
    //console.log('handleRespone', arguments);
    responseHeaders.forEach(function(h) {
        console.log('push header', h);
        res.responseHeaders.push(h);
    });

    return {responseHeaders: res.responseHeaders};
}

function init() {
    chrome.webRequest.onBeforeSendHeaders.addListener(handleRequest, {urls: defaults.urls}, ['blocking', 'requestHeaders']);
    chrome.webRequest.onHeadersReceived.addListener(handleRespone, {urls: defaults.urls}, ['blocking', 'responseHeaders']);

    chrome.runtime.onMessageExternal.addListener(
        function(request, sender, sendResponse) {
            if (request && request.message === 'version') {
                sendResponse({version: version});
            }
            return true;
        });
}

init();
