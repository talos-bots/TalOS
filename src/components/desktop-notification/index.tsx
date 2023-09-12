export function sendDesktopNotification(title: string, body: string, onClickCallback?: () => void) {
    // Check if Notification API is supported
    if (!("Notification" in window)) {
        console.warn("This browser does not support desktop notification.");
        return;
    }

    // Function to actually create the notification
    function createNotification() {
        let notification = new Notification(title, { body });
        if (typeof onClickCallback === 'function') {
            notification.onclick = onClickCallback;
        }
    }

    // Check for permission
    if (Notification.permission === "granted") {
        // If it's okay, let's create a notification
        createNotification();
    } 
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                createNotification();
            }
        });
    }
}