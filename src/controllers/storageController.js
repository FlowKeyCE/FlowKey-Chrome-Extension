const saveToStorage = obj => new Promise(resolve => {
    chrome.storage.local.set(obj, res => resolve(true));
})

const getFromStorage = arr => new Promise(resolve => {
    chrome.storage.local.get(arr, res => resolve(res));
})

