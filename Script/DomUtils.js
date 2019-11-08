
let Dom_getElementsByClassName = (elem, className) => {
    let element = elem || document;
    if (element.getElementsByClassName) {
        return element.getElementsByClassName(className);
    } else {
        return [];
    }
}

let Dom_getElementById = (elem, id) => {
    let element = elem || document;
    if (element.getElementById) {
        return element.getElementById(id);
    } else {
        return null;
    }
}

let Dom_addEventListener = (elem, event, handler) => {
    if (!handler) return;

    let element = elem || document;
    element.addEventListener(event, handler);
}

let Dom_removeEventListener = (elem, event, handler) => {
    if (!handler || !elem) return;
    elem.removeEventListener(event, handler);
}

let Dom_getClassName = (elem) => {

    if (!elem) return "";

    let cname = elem.className || "";
    return (typeof(cname) == "string") ? cname : "";
}

let Dom_addClass = (elem, name) => {
    let className = Dom_getClassName(elem);
    if (!className) {
        elem.className = name;
        return;
    }

    let names = className.split(" ");
    names.push(name);
    elem.className = names.join(" ");
}

let Dom_removeClass = (elem, name) => {
    let originalName = Dom_getClassName(elem);
    if (!originalName) return;

    let names = originalName.split(" ");
    let len = names.length;
    for (let i = len - 1; i >= 0; i--) {
        if (names[i] == name) {
            names.splice(i, 1);
        }
    }

    elem.className = names.join(" ");
}

let Dom_getInnerText = (elem) => {
    return elem.innerText;
}

let Dom_setInnerText = (elem, text) => {
    elem.innerText = text;
}