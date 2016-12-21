
const extensionId = 'bmakfigpeajegddeamfkmnambomhmnoh';

class ExtensionApi {

    static getVersion() {
        return new Promise((resolve, reject) => {
            if (window.chrome && window.chrome.runtime) {
                window.chrome.runtime.sendMessage(extensionId, {message: 'version'},
                    function (reply) {
                        if (reply) {
                            resolve(Object.assign({}, reply));
                        } else {
                            resolve({version: '0.0.0'});
                        }
                    });
            } else {
                resolve({version: '0.0.0'});
            }
        });
    }
}

export default ExtensionApi;