// Basic storage functions
export const saveToStorage = obj => new Promise(resolve => {
    chrome.storage.local.set(obj, res => resolve(true));
})

export const getFromStorage = arr => new Promise(resolve => {
    chrome.storage.local.get(arr, res => resolve(res));
})

// Chrome tabs API integration
export const getCurrentTab = async () => {
    try {
        let queryOptions = { active: true, lastFocusedWindow: true };
        // `tab` will either be a `tabs.Tab` instance or `undefined`.
        let [tab] = await chrome.tabs.query(queryOptions);
        return tab;
    } catch (error) {
        console.error('Error getting current tab:', error);
        return null;
    }
}

// Bookmark-specific storage functions
export const saveBookmarks = async (bookmarks) => {
    try {
        await saveToStorage({ bookmarks });
        console.log('Bookmarks saved successfully:', bookmarks);
        return true;
    } catch (error) {
        console.error('Error saving bookmarks:', error);
        return false;
    }
}

export const getBookmarks = async () => {
    try {
        const storageResult = await getFromStorage(["bookmarks"]);
        const { bookmarks } = storageResult;
        return bookmarks || []; // Return empty array if no bookmarks exist
    } catch (error) {
        console.error('Error getting bookmarks:', error);
        return [];
    }
}

// Add a new bookmark to storage
export const addBookmark = async (bookmark) => {
    try {
        const currentBookmarks = await getBookmarks();
        const newBookmark = {
            ...bookmark,
            id: bookmark.id || Date.now(),
            createdAt: new Date().toISOString()
        };
        const updatedBookmarks = [...currentBookmarks, newBookmark];
        await saveBookmarks(updatedBookmarks);
        return newBookmark;
    } catch (error) {
        console.error('Error adding bookmark:', error);
        return null;
    }
}

// Update an existing bookmark in storage
export const updateBookmark = async (bookmarkId, updatedData) => {
    try {
        const currentBookmarks = await getBookmarks();
        const updatedBookmarks = currentBookmarks.map(bookmark => 
            bookmark.id === bookmarkId 
                ? { ...bookmark, ...updatedData, updatedAt: new Date().toISOString() }
                : bookmark
        );
        await saveBookmarks(updatedBookmarks);
        return updatedBookmarks.find(bookmark => bookmark.id === bookmarkId);
    } catch (error) {
        console.error('Error updating bookmark:', error);
        return null;
    }
}

// Delete a bookmark from storage
export const deleteBookmark = async (bookmarkId) => {
    try {
        const currentBookmarks = await getBookmarks();
        const filteredBookmarks = currentBookmarks.filter(bookmark => bookmark.id !== bookmarkId);
        await saveBookmarks(filteredBookmarks);
        return true;
    } catch (error) {
        console.error('Error deleting bookmark:', error);
        return false;
    }
}

// Reorder bookmarks in storage
export const reorderBookmarks = async (newBookmarks) => {
    try {
        // Add order index to maintain sequence
        const bookmarksWithOrder = newBookmarks.map((bookmark, index) => ({
            ...bookmark,
            order: index,
            updatedAt: new Date().toISOString()
        }));
        await saveBookmarks(bookmarksWithOrder);
        return bookmarksWithOrder;
    } catch (error) {
        console.error('Error reordering bookmarks:', error);
        return null;
    }
}

