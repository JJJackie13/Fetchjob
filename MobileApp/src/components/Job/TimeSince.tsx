export default function timeSince(date: any) {
    var now: any = new Date();
    var timestamp = new Date(date.replace(" ", "T")).getTime();
    var seconds = Math.floor((now - timestamp) / 1000);

    var interval = seconds / 31536000;
    if (interval == 1) {
        return Math.floor(interval) + " year ago";
    }
    if (interval > 1) {
        return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval == 1) {
        return Math.floor(interval) + " month ago";
    }
    if (interval > 1) {
        return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval == 1) {
        return Math.floor(interval) + " day ago";
    }
    if (interval > 1) {
        return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval == 1) {
        return Math.floor(interval) + " hour ago";
    }
    if (interval > 1) {
        return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval == 1) {
        return Math.floor(interval) + " minute ago";
    }
    if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}


export function timeRemain(date: any) {
    var now: any = new Date();
    var timestamp = new Date(date.replace(" ", "T")).getTime();
    var seconds = Math.floor((timestamp - now) / 1000);

    if (seconds > 0) {
        return true;
    } else {
        return false
    }
}

export function showTimeRemain(date: any) {
    var now: any = new Date();
    var timestamp = new Date(date.replace(" ", "T")).getTime();
    var seconds = Math.floor((timestamp - now) / 1000);

    var interval = seconds / 31536000;
    if (interval == 1) {
        return Math.floor(interval) + " year later";
    }
    if (interval > 1) {
        return Math.floor(interval) + " years later";
    }
    interval = seconds / 2592000;
    if (interval == 1) {
        return Math.floor(interval) + " month later";
    }
    if (interval > 1) {
        return Math.floor(interval) + " months later";
    }
    interval = seconds / 86400;
    if (interval == 1) {
        return Math.floor(interval) + " day later";
    }
    if (interval > 1) {
        return Math.floor(interval) + " days later";
    }
    interval = seconds / 3600;
    if (interval == 1) {
        return Math.floor(interval) + " hour later";
    }
    if (interval > 1) {
        return Math.floor(interval) + " hours later";
    }
    interval = seconds / 60;
    if (interval == 1) {
        return Math.floor(interval) + " minute later";
    }
    if (interval > 1) {
        return Math.floor(interval) + " minutes later";
    }
    return Math.floor(seconds) + " seconds later";
}

export function applyJobTime(date: any){
    const now:any = new Date();
    const timestamp = new Date(date.replace(" ", "T")).getTime() + (3600 * 1000 * 24 * Math.floor(Math.random() * 3));
    let seconds = Math.floor((timestamp - now) / 1000);

    let  interval = seconds / 31536000;
    if (interval == 1) {
        return Math.floor(interval) + " year ago";
    }
    if (interval > 1) {
        return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval == 1) {
        return Math.floor(interval) + " month ago";
    }
    if (interval > 1) {
        return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval == 1) {
        return Math.floor(interval) + " day ago";
    }
    if (interval > 1) {
        return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval == 1) {
        return Math.floor(interval) + " hour ago";
    }
    if (interval > 1) {
        return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval == 1) {
        return Math.floor(interval) + " minute ago";
    }
    if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}